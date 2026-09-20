import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavTab, DayOfWeek, WorkoutDayId, Meal, Exercise, EvidenceCitation, HealthProfileState, DailyCheckIn } from './types';
import { api, DashboardData, RecipeOption, AuthSession } from './api/client';
import { AuthScreen } from './components/AuthScreen';
import { Navigation } from './components/Navigation';
import { DashboardScreen } from './components/DashboardScreen';
import { MealPlanScreen } from './components/MealPlanScreen';
import { WorkoutPlanScreen } from './components/WorkoutPlanScreen';
import { HealthProfileScreen } from './components/HealthProfileScreen';
import { PricingScreen } from './components/PricingScreen';
import { EvidenceModal } from './components/EvidenceModal';
import { SwapMealModal } from './components/SwapMealModal';
import { ExerciseAlternativeModal } from './components/ExerciseAlternativeModal';
import { HealthAdjustmentsModal } from './components/HealthAdjustmentsModal';
import { LandingPage } from './components/LandingPage';
import { SettingsScreen } from './components/SettingsScreen';
import { NotificationsCard } from './components/NotificationsCard';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const mutationLock = useRef(false);
  const userName = data?.user.name || '';
  const healthProfile = data?.healthProfile || { conditions: [], allergies: [], dietaryPreferences: [], physicalLimitations: [] };
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<WorkoutDayId>('workout-a');
  const weeklyMeals = data?.weeklyMeals || {};
  const workouts = data?.workouts || [];
  const dailyCheckIn = data?.dailyCheckIn || null;
  const [activeEvidence, setActiveEvidence] = useState<EvidenceCitation | null>(null);
  const [swapModalMeal, setSwapModalMeal] = useState<{ meal: Meal; day: string } | null>(null);
  const [exerciseModalData, setExerciseModalData] = useState<{ exercise: Exercise; workoutTitle: string } | null>(null);
  const [isAdjustmentsOpen, setIsAdjustmentsOpen] = useState(false);
  const isNightMode = data?.user.theme === 'night';
  const language = data?.user.language || 'EN';
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  const load = useCallback(async () => {
    setError('');
    try {
      const current = await api<AuthSession>('/auth/session');
      setSession(current);
      if (!current.user) { setData(null); return; }
      const loaded = await api<DashboardData>(`/users/${current.user.id}/dashboard`);
      setData(loaded);
      setHasCompletedOnboarding(Boolean(loaded.user.onboarded_at));
    } catch (failure) { setError((failure as Error).message); }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const expired = () => {
      setData(null); setSession(current => current && { ...current, user: null });
      setActiveEvidence(null); setSwapModalMeal(null); setExerciseModalData(null); setIsAdjustmentsOpen(false);
    };
    window.addEventListener('favia:unauthenticated', expired);
    return () => window.removeEventListener('favia:unauthenticated', expired);
  }, []);

  const logout = async () => {
    await api('/auth/logout', 'POST');
    setData(null); setHasCompletedOnboarding(false); setCurrentTab('dashboard');
    setActiveEvidence(null); setSwapModalMeal(null); setExerciseModalData(null); setIsAdjustmentsOpen(false);
    await load();
  };

  const mutate = useCallback(async (action: () => Promise<void>): Promise<boolean> => {
    if (mutationLock.current) return false;
    mutationLock.current = true;
    setPending(true);
    setError('');
    try { await action(); return true; }
    catch (failure) { setError((failure as Error).message); return false; }
    finally { mutationLock.current = false; setPending(false); }
  }, []);

  const userPath = `/users/${data?.user.id}`;
  const handleConfirmSwap = async (option: RecipeOption) => {
    if (!swapModalMeal) return false;
    const { meal, day } = swapModalMeal;
    return mutate(async () => {
      const updated = await api<Meal>(`/user-meals/${meal.id}/replace`, 'POST', { recipeId: option.recipeId });
      setData(current => {
        if (!current) return current;
        const updatedWeek: Record<string, Meal[]> = { ...current.weeklyMeals, [day]: current.weeklyMeals[day].map(item => item.id === meal.id ? updated : item) };
        const meals = Object.values(updatedWeek).flat();
        const days = Math.max(1, Object.keys(updatedWeek).length);
        return { ...current, weeklyMeals: updatedWeek, summary: { ...current.summary,
          averageCalories: Math.round(meals.reduce((sum, item) => sum + item.calories, 0) / days),
          averageProtein: Math.round(meals.reduce((sum, item) => sum + item.protein, 0) / days),
        } };
      });
      setSwapModalMeal(null);
    });
  };
  const handleAddSnack = (day: DayOfWeek) => mutate(async () => {
    const snack = await api<Meal>(`${userPath}/meals/snack`, 'POST', { day });
    setData(current => {
      if (!current) return current;
      const updatedWeek: Record<string, Meal[]> = { ...current.weeklyMeals, [day]: [...current.weeklyMeals[day], snack] };
      const meals = Object.values(updatedWeek).flat();
      const days = Math.max(1, Object.keys(updatedWeek).length);
      return { ...current, weeklyMeals: updatedWeek, safeguards: { ...current.safeguards, mealCount: meals.length }, summary: {
        ...current.summary, mealCount: meals.length,
        averageCalories: Math.round(meals.reduce((sum, item) => sum + item.calories, 0) / days),
        averageProtein: Math.round(meals.reduce((sum, item) => sum + item.protein, 0) / days),
      } };
    });
  });
  const reorderMeals = (day: DayOfWeek, mealIds: string[]) => mutate(async () => {
    const ordered = await api<Meal[]>(`${userPath}/meal-plan/order`, 'PUT', { day, mealIds: mealIds.map(Number) });
    setData(current => current && { ...current, weeklyMeals: { ...current.weeklyMeals, [day]: ordered } });
  });
  const handleDailyCheckIn = useCallback((draft: Omit<DailyCheckIn, 'date' | 'completedAt' | 'planAdjusted' | 'adjustmentSummary'>) =>
    mutate(async () => { setData(await api<DashboardData>(`/users/${data?.user.id}/check-ins`, 'POST', draft)); }), [data?.user.id, mutate]);
  const saveProfile = (profile: HealthProfileState) => mutate(async () => {
    setData(await api<DashboardData>(`${userPath}/health-profile`, 'PUT', profile));
  });
  const saveSettings = (settings: { language?: string; theme?: string }) => mutate(async () => {
    const updated = await api<{ language: string; theme: 'light' | 'night' }>(`${userPath}/settings`, 'PUT', settings);
    setData(current => current && { ...current, user: { ...current.user, ...updated } });
  });

  if (session && !session.user) return <AuthScreen demoUsers={session.demoUsers} onAuthenticated={load} />;

  if (!data) return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-600">
    {error ? <div role="alert" className="text-center"><p>{error}</p><button onClick={() => void load()} className="mt-3 rounded-xl bg-teal-600 px-4 py-2 text-white">Try again</button></div> : <p role="status">Loading your plan…</p>}
  </div>;

  if (!hasCompletedOnboarding) {
    return <LandingPage
      onComplete={async (name, profile, age) => {
        const saved = await api<DashboardData>(`${userPath}/onboarding`, 'PUT', { name, age, ...profile });
        setData(saved);
        setCurrentTab('dashboard');
        setHasCompletedOnboarding(true);
      }}
      onLogout={() => { void mutate(logout); }}
      initialName={data.user.name}
    />;
  }

  return (
    <div className={`app-shell min-h-screen bg-slate-50/80 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900 ${isNightMode ? 'night-mode' : ''}`}>
      <Navigation currentTab={currentTab} onSelectTab={setCurrentTab} healthProfile={healthProfile} onOpenAdjustments={() => setIsAdjustmentsOpen(true)} onCollapsedChange={setIsSidebarCollapsed} />
      <div className={`min-h-screen transition-[padding] duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-72'}`}>

        <main className="w-full px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8" aria-busy={pending}>
          {error && <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
          {currentTab === 'dashboard' && <DashboardScreen summary={data.summary} healthProfile={healthProfile} userName={userName} dailyCheckIn={dailyCheckIn} onSaveDailyCheckIn={handleDailyCheckIn} onNavigate={setCurrentTab} onOpenAdjustments={() => setIsAdjustmentsOpen(true)} />}
          {currentTab === 'meals' && <MealPlanScreen weeklyMeals={weeklyMeals} selectedDay={selectedDay} onSelectDay={setSelectedDay} onOpenEvidence={setActiveEvidence} onOpenSwapMeal={(meal, day) => setSwapModalMeal({ meal, day })} onAddSnack={handleAddSnack} onReorderMeals={reorderMeals} />}
          {currentTab === 'workouts' && <WorkoutPlanScreen workouts={workouts} selectedWorkoutId={selectedWorkoutId} onSelectWorkout={setSelectedWorkoutId} onOpenEvidence={setActiveEvidence} onOpenExerciseAlternative={(exercise, workoutTitle) => setExerciseModalData({ exercise, workoutTitle })} />}
          {currentTab === 'profile' && <HealthProfileScreen initialProfile={healthProfile} onSaveProfile={saveProfile} onLogout={() => { void mutate(logout); }} />}
          {currentTab === 'pricing' && <PricingScreen currentPlan={data.user.plan} />}
          {currentTab === 'dashboard' && <NotificationsCard notifications={data.notifications} onRead={(id) => mutate(async () => {
            const updated = await api<DashboardData['notifications'][number]>(`/notifications/${id}/read`, 'PATCH');
            setData(current => current && { ...current, notifications: current.notifications.map(item => item.id === id ? updated : item) });
          })} />}
          {currentTab === 'settings' && <SettingsScreen language={language} onLanguageChange={(language) => { void saveSettings({ language }); }} isNightMode={isNightMode} onToggleNightMode={() => { void saveSettings({ theme: isNightMode ? 'light' : 'night' }); }} />}
        </main>
        <footer className="mt-10 border-t border-slate-200 bg-white/70 py-6"><div className="flex w-full items-center justify-end gap-2 px-4 text-xs text-slate-500 sm:px-6 lg:px-8"><img src="/favia-health-favicon.png" alt="Favia Health" className="h-5 w-5 object-contain" /><span><strong className="text-slate-800">Favia Health</strong> · © 2026 All rights reserved</span></div></footer>
      </div>

      <EvidenceModal evidence={activeEvidence} onClose={() => setActiveEvidence(null)} />
      <SwapMealModal meal={swapModalMeal?.meal || null} day={swapModalMeal?.day || ''} onClose={() => setSwapModalMeal(null)} onConfirmSwap={handleConfirmSwap} />
      <ExerciseAlternativeModal exercise={exerciseModalData?.exercise || null} workoutTitle={exerciseModalData?.workoutTitle || ''} onClose={() => setExerciseModalData(null)} onViewEvidence={(evidence) => { setExerciseModalData(null); setActiveEvidence(evidence); }} />
      <HealthAdjustmentsModal safeguards={data.safeguards} isOpen={isAdjustmentsOpen} onClose={() => setIsAdjustmentsOpen(false)} onViewEvidence={(evidence) => { setIsAdjustmentsOpen(false); setActiveEvidence(evidence); }} onNavigateToTab={(tab) => { setIsAdjustmentsOpen(false); setCurrentTab(tab); }} />
    </div>
  );
}
