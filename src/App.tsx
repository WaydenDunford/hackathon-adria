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
import { Moon, Sun, Languages, ChevronDown } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
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

  const handleConfirmSwap = (newMealData: { name: string; calories: number; protein: number; carbs: number; fat: number; desc: string }) => {
    if (!swapModalMeal) return;
    const { meal, day } = swapModalMeal;
    setWeeklyMeals((prev) => ({ ...prev, [day]: (prev[day] || []).map((item) => item.id === meal.id ? {
      ...item, name: newMealData.name, calories: newMealData.calories, protein: newMealData.protein, carbs: newMealData.carbs, fat: newMealData.fat, subtitle: newMealData.desc,
      whyThisMeal: `Swapped alternative maintaining zero gluten and zero peanuts, with ${newMealData.carbs}g carbohydrates explicitly documented for Type 1 Diabetes glucose tracking.`,
    } : item) }));
  };

  const handleAddSnack = (day: DayOfWeek, snack: Meal) => setWeeklyMeals((prev) => ({ ...prev, [day]: [...(prev[day] || []), { ...snack, id: `${day.toLowerCase()}-snack-${Date.now()}` }] }));

  return (
    <div className={`app-shell min-h-screen bg-slate-50/80 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900 ${isNightMode ? 'night-mode' : ''}`}>
      <Navigation currentTab={currentTab} onSelectTab={setCurrentTab} healthProfile={healthProfile} onOpenAdjustments={() => setIsAdjustmentsOpen(true)} />
      <div className="min-h-screen md:pl-72">
        <header className="hidden h-20 items-center justify-end border-b border-slate-200 bg-white/70 px-6 backdrop-blur-sm md:flex">
          <div className="flex items-center gap-2">
            <label className="relative flex items-center" aria-label="Language">
              <Languages className="pointer-events-none absolute left-3 h-4 w-4 text-slate-500" />
              <select value={language} onChange={(event) => setLanguage(event.target.value)} className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-xs font-bold text-slate-700 outline-none transition hover:border-teal-300 focus:border-teal-500"><option value="EN">English</option><option value="BS">Bosanski</option></select>
              <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-slate-400" />
            </label>
            <button onClick={() => setIsNightMode((current) => !current)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-teal-300 hover:text-teal-700" aria-pressed={isNightMode}>
              {isNightMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}{isNightMode ? 'Light mode' : 'Night mode'}
            </button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8">
          {currentTab === 'dashboard' && <DashboardScreen healthProfile={healthProfile} onNavigate={setCurrentTab} onOpenAdjustments={() => setIsAdjustmentsOpen(true)} />}
          {currentTab === 'meals' && <MealPlanScreen weeklyMeals={weeklyMeals} selectedDay={selectedDay} onSelectDay={setSelectedDay} onOpenEvidence={setActiveEvidence} onOpenSwapMeal={(meal, day) => setSwapModalMeal({ meal, day })} onAddSnack={handleAddSnack} />}
          {currentTab === 'workouts' && <WorkoutPlanScreen workouts={workouts} selectedWorkoutId={selectedWorkoutId} onSelectWorkout={setSelectedWorkoutId} onOpenEvidence={setActiveEvidence} onOpenExerciseAlternative={(exercise, workoutTitle) => setExerciseModalData({ exercise, workoutTitle })} />}
          {currentTab === 'profile' && <HealthProfileScreen initialProfile={healthProfile} onSaveProfile={setHealthProfile} />}
          {currentTab === 'pricing' && <PricingScreen />}
        </main>
        <footer className="mt-10 border-t border-slate-200 bg-white/70 py-6"><div className="mx-auto flex max-w-6xl justify-end px-4 text-xs text-slate-500 sm:px-6"><span><strong className="text-slate-800">Favia Health</strong> · All rights reserved</span></div></footer>
      </div>
      <EvidenceModal evidence={activeEvidence} onClose={() => setActiveEvidence(null)} />
      <SwapMealModal meal={swapModalMeal?.meal || null} day={swapModalMeal?.day || ''} onClose={() => setSwapModalMeal(null)} onConfirmSwap={handleConfirmSwap} />
      <ExerciseAlternativeModal exercise={exerciseModalData?.exercise || null} workoutTitle={exerciseModalData?.workoutTitle || ''} onClose={() => setExerciseModalData(null)} onViewEvidence={(ev) => { setExerciseModalData(null); setActiveEvidence(ev); }} />
      <HealthAdjustmentsModal isOpen={isAdjustmentsOpen} onClose={() => setIsAdjustmentsOpen(false)} onViewEvidence={(ev) => { setIsAdjustmentsOpen(false); setActiveEvidence(ev); }} onNavigateToTab={(tab) => { setIsAdjustmentsOpen(false); setCurrentTab(tab); }} />
    </div>
  );
}
