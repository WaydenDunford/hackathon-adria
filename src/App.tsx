import React, { useState } from 'react';
import { NavTab, DayOfWeek, WorkoutDayId, Meal, Exercise, EvidenceCitation, HealthProfileState, DailyCheckIn } from './types';
import { createWeeklyMealPlan, initialHealthProfile, sampleWorkouts } from './data/mockData';
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

// Temporary development aid: set false or remove the prop below before release.
const ENABLE_DEV_ONBOARDING_SKIP = true;

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [userName, setUserName] = useState('Amina');
  const [healthProfile, setHealthProfile] = useState<HealthProfileState>(initialHealthProfile);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<WorkoutDayId>('workout-a');
  const [weeklyMeals, setWeeklyMeals] = useState<Record<string, Meal[]>>(() => createWeeklyMealPlan(initialHealthProfile));
  const [workouts, setWorkouts] = useState(sampleWorkouts);
  const [dailyCheckIn, setDailyCheckIn] = useState<DailyCheckIn | null>(null);
  const [activeEvidence, setActiveEvidence] = useState<EvidenceCitation | null>(null);
  const [swapModalMeal, setSwapModalMeal] = useState<{ meal: Meal; day: string } | null>(null);
  const [exerciseModalData, setExerciseModalData] = useState<{ exercise: Exercise; workoutTitle: string } | null>(null);
  const [isAdjustmentsOpen, setIsAdjustmentsOpen] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleConfirmSwap = (newMealData: { name: string; calories: number; protein: number; carbs: number; fat: number; desc: string }) => {
    if (!swapModalMeal) return;
    const { meal, day } = swapModalMeal;
    setWeeklyMeals((previousMeals) => ({
      ...previousMeals,
      [day]: (previousMeals[day] || []).map((item) => item.id === meal.id ? {
        ...item,
        name: newMealData.name,
        calories: newMealData.calories,
        protein: newMealData.protein,
        carbs: newMealData.carbs,
        fat: newMealData.fat,
        subtitle: newMealData.desc,
        whyThisMeal: `Swapped alternative tailored to your selected health profile, with ${newMealData.carbs}g carbohydrates clearly documented.`,
      } : item),
    }));
  };

  const handleAddSnack = (day: DayOfWeek, snack: Meal) => setWeeklyMeals((previousMeals) => ({
    ...previousMeals,
    [day]: [...(previousMeals[day] || []), { ...snack, id: `${day.toLowerCase()}-snack-${Date.now()}` }],
  }));

  const handleDailyCheckIn = (draft: Omit<DailyCheckIn, 'date' | 'completedAt' | 'planAdjusted' | 'adjustmentSummary'>) => {
    const hasBackDiscomfort = draft.pain === 'moderate' || draft.pain === 'significant'
      ? draft.affectedAreas.some((area) => area.toLowerCase() === 'lower back')
      : false;
    const needsLowerIntensity = draft.energy === 'lower' || draft.recovery === 'poor';
    const shouldAdjust = hasBackDiscomfort || needsLowerIntensity;
    const adjustmentSummary: string[] = [];
    if (needsLowerIntensity) adjustmentSummary.push('Workout intensity reduced because you reported lower energy or poor recovery.');
    if (hasBackDiscomfort) adjustmentSummary.push('Lower-back loading was reduced and supported movement variations were prioritized for today.');
    if (draft.recovery === 'poor') adjustmentSummary.push('Training volume was reduced to support a recovery-oriented session.');

    const now = new Date();
    setDailyCheckIn({
      ...draft,
      date: now.toISOString().slice(0, 10),
      completedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      planAdjusted: shouldAdjust,
      adjustmentSummary,
    });

    setWorkouts(sampleWorkouts.map((workout) => {
      if (!shouldAdjust || workout.id !== 'workout-a') return workout;
      return {
        ...workout,
        intensity: needsLowerIntensity ? 'Low-Moderate today' : workout.intensity,
        estimatedDuration: draft.recovery === 'poor' ? '35 mins today' : workout.estimatedDuration,
        exercises: workout.exercises.map((exercise) => {
          const needsDailyBackAdaptation = hasBackDiscomfort && ['ex-a1', 'ex-a2', 'ex-a4'].includes(exercise.id);
          if (!needsDailyBackAdaptation && !needsLowerIntensity) return exercise;
          return {
            ...exercise,
            sets: draft.recovery === 'poor' ? Math.max(2, exercise.sets - 1) : exercise.sets,
            dailyAdjustmentReason: needsDailyBackAdaptation
              ? 'Today: kept as a supported, lower-back-considerate option because you reported lower-back discomfort.'
              : 'Today: volume reduced to match your reported energy and recovery.',
          };
        }),
      };
    }));
  };

  if (!hasCompletedOnboarding) {
    const handleOnboardingComplete = (name: string, profile: HealthProfileState) => {
      setUserName(name);
      setHealthProfile(profile);
      setWeeklyMeals(createWeeklyMealPlan(profile));
      setCurrentTab('dashboard');
      setHasCompletedOnboarding(true);
    };
    return <LandingPage
      onComplete={handleOnboardingComplete}
      onDevSkip={ENABLE_DEV_ONBOARDING_SKIP ? () => setHasCompletedOnboarding(true) : undefined}
    />;
  }

  return (
    <div className={`app-shell min-h-screen bg-slate-50/80 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900 ${isNightMode ? 'night-mode' : ''}`}>
      <Navigation currentTab={currentTab} onSelectTab={setCurrentTab} healthProfile={healthProfile} onOpenAdjustments={() => setIsAdjustmentsOpen(true)} onCollapsedChange={setIsSidebarCollapsed} />
      <div className={`min-h-screen transition-[padding] duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-72'}`}>

        <main className="w-full px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
          {currentTab === 'dashboard' && <DashboardScreen healthProfile={healthProfile} userName={userName} dailyCheckIn={dailyCheckIn} onSaveDailyCheckIn={handleDailyCheckIn} onNavigate={setCurrentTab} onOpenAdjustments={() => setIsAdjustmentsOpen(true)} />}
          {currentTab === 'meals' && <MealPlanScreen weeklyMeals={weeklyMeals} selectedDay={selectedDay} onSelectDay={setSelectedDay} onOpenEvidence={setActiveEvidence} onOpenSwapMeal={(meal, day) => setSwapModalMeal({ meal, day })} onAddSnack={handleAddSnack} />}
          {currentTab === 'workouts' && <WorkoutPlanScreen workouts={workouts} selectedWorkoutId={selectedWorkoutId} onSelectWorkout={setSelectedWorkoutId} onOpenEvidence={setActiveEvidence} onOpenExerciseAlternative={(exercise, workoutTitle) => setExerciseModalData({ exercise, workoutTitle })} />}
          {currentTab === 'profile' && <HealthProfileScreen initialProfile={healthProfile} onSaveProfile={(profile) => { setHealthProfile(profile); setWeeklyMeals(createWeeklyMealPlan(profile)); }} />}
          {currentTab === 'pricing' && <PricingScreen />}
          {currentTab === 'settings' && <SettingsScreen language={language} onLanguageChange={setLanguage} isNightMode={isNightMode} onToggleNightMode={() => setIsNightMode((current) => !current)} />}
        </main>
        <footer className="mt-10 border-t border-slate-200 bg-white/70 py-6"><div className="flex w-full items-center justify-end gap-2 px-4 text-xs text-slate-500 sm:px-6 lg:px-8"><img src="/favia-health-favicon.png" alt="Favia Health" className="h-5 w-5 object-contain" /><span><strong className="text-slate-800">Favia Health</strong> · © 2026 All rights reserved</span></div></footer>
      </div>

      <EvidenceModal evidence={activeEvidence} onClose={() => setActiveEvidence(null)} />
      <SwapMealModal meal={swapModalMeal?.meal || null} day={swapModalMeal?.day || ''} onClose={() => setSwapModalMeal(null)} onConfirmSwap={handleConfirmSwap} />
      <ExerciseAlternativeModal exercise={exerciseModalData?.exercise || null} workoutTitle={exerciseModalData?.workoutTitle || ''} onClose={() => setExerciseModalData(null)} onViewEvidence={(evidence) => { setExerciseModalData(null); setActiveEvidence(evidence); }} />
      <HealthAdjustmentsModal isOpen={isAdjustmentsOpen} onClose={() => setIsAdjustmentsOpen(false)} onViewEvidence={(evidence) => { setIsAdjustmentsOpen(false); setActiveEvidence(evidence); }} onNavigateToTab={(tab) => { setIsAdjustmentsOpen(false); setCurrentTab(tab); }} />
    </div>
  );
}
