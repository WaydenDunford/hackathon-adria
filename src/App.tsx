import React, { useState } from 'react';
import { NavTab, DayOfWeek, WorkoutDayId, Meal, Exercise, EvidenceCitation, HealthProfileState } from './types';
import { initialHealthProfile, sampleWeeklyMealPlan, sampleWorkouts } from './data/mockData';
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

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [userName, setUserName] = useState('Amina');
  const [healthProfile, setHealthProfile] = useState<HealthProfileState>(initialHealthProfile);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<WorkoutDayId>('workout-a');
  const [weeklyMeals, setWeeklyMeals] = useState<Record<string, Meal[]>>(sampleWeeklyMealPlan);
  const [workouts] = useState(sampleWorkouts);
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
        whyThisMeal: `Swapped alternative maintaining zero gluten and zero peanuts, with ${newMealData.carbs}g carbohydrates explicitly documented for Type 1 Diabetes glucose tracking.`,
      } : item),
    }));
  };

  const handleAddSnack = (day: DayOfWeek, snack: Meal) => setWeeklyMeals((previousMeals) => ({
    ...previousMeals,
    [day]: [...(previousMeals[day] || []), { ...snack, id: `${day.toLowerCase()}-snack-${Date.now()}` }],
  }));

  if (!hasCompletedOnboarding) {
    return <LandingPage onComplete={(name, profile) => {
      setUserName(name);
      setHealthProfile(profile);
      setCurrentTab('dashboard');
      setHasCompletedOnboarding(true);
    }} />;
  }

  return (
    <div className={`app-shell min-h-screen bg-slate-50/80 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900 ${isNightMode ? 'night-mode' : ''}`}>
      <Navigation currentTab={currentTab} onSelectTab={setCurrentTab} healthProfile={healthProfile} onOpenAdjustments={() => setIsAdjustmentsOpen(true)} onCollapsedChange={setIsSidebarCollapsed} />
      <div className={`min-h-screen transition-[padding] duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-72'}`}>

        <main className="w-full px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
          {currentTab === 'dashboard' && <DashboardScreen healthProfile={healthProfile} userName={userName} onNavigate={setCurrentTab} onOpenAdjustments={() => setIsAdjustmentsOpen(true)} />}
          {currentTab === 'meals' && <MealPlanScreen weeklyMeals={weeklyMeals} selectedDay={selectedDay} onSelectDay={setSelectedDay} onOpenEvidence={setActiveEvidence} onOpenSwapMeal={(meal, day) => setSwapModalMeal({ meal, day })} onAddSnack={handleAddSnack} />}
          {currentTab === 'workouts' && <WorkoutPlanScreen workouts={workouts} selectedWorkoutId={selectedWorkoutId} onSelectWorkout={setSelectedWorkoutId} onOpenEvidence={setActiveEvidence} onOpenExerciseAlternative={(exercise, workoutTitle) => setExerciseModalData({ exercise, workoutTitle })} />}
          {currentTab === 'profile' && <HealthProfileScreen initialProfile={healthProfile} onSaveProfile={setHealthProfile} />}
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
