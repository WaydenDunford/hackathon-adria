import React, { useState } from 'react';
import {
  NavTab,
  DayOfWeek,
  WorkoutDayId,
  Meal,
  Exercise,
  EvidenceCitation,
  HealthProfileState,
} from './types';
import {
  initialHealthProfile,
  sampleWeeklyMealPlan,
  sampleWorkouts,
} from './data/mockData';
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
import { ShieldCheck, HeartPulse, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [healthProfile, setHealthProfile] = useState<HealthProfileState>(initialHealthProfile);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<WorkoutDayId>('workout-a');

  // Meal & workout state
  const [weeklyMeals, setWeeklyMeals] = useState<Record<string, Meal[]>>(sampleWeeklyMealPlan);
  const [workouts] = useState(sampleWorkouts);

  // Modals state
  const [activeEvidence, setActiveEvidence] = useState<EvidenceCitation | null>(null);
  const [swapModalMeal, setSwapModalMeal] = useState<{ meal: Meal; day: string } | null>(null);
  const [exerciseModalData, setExerciseModalData] = useState<{
    exercise: Exercise;
    workoutTitle: string;
  } | null>(null);
  const [isAdjustmentsOpen, setIsAdjustmentsOpen] = useState<boolean>(false);

  // Handle swapping a meal
  const handleConfirmSwap = (newMealData: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    desc: string;
  }) => {
    if (!swapModalMeal) return;
    const { meal, day } = swapModalMeal;

    setWeeklyMeals((prev) => {
      const dayMeals = prev[day] || [];
      const updatedDayMeals = dayMeals.map((m) => {
        if (m.id === meal.id) {
          return {
            ...m,
            name: newMealData.name,
            calories: newMealData.calories,
            protein: newMealData.protein,
            carbs: newMealData.carbs,
            fat: newMealData.fat,
            subtitle: newMealData.desc,
            whyThisMeal: `Swapped alternative maintaining zero gluten and zero peanuts, with ${newMealData.carbs}g carbohydrates explicitly documented for Type 1 Diabetes glucose tracking.`,
          };
        }
        return m;
      });

      return {
        ...prev,
        [day]: updatedDayMeals,
      };
    });
  };

  // Handle saving health profile
  const handleSaveProfile = (updatedProfile: HealthProfileState) => {
    setHealthProfile(updatedProfile);
  };

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Navigation */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        healthProfile={healthProfile}
        onOpenAdjustments={() => setIsAdjustmentsOpen(true)}
      />

      {/* Main Container - Centered layout with comfortable max width (1140px) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {currentTab === 'dashboard' && (
          <DashboardScreen
            healthProfile={healthProfile}
            onNavigate={setCurrentTab}
            onOpenAdjustments={() => setIsAdjustmentsOpen(true)}
          />
        )}

        {currentTab === 'meals' && (
          <MealPlanScreen
            weeklyMeals={weeklyMeals}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            onOpenEvidence={setActiveEvidence}
            onOpenSwapMeal={(meal, day) => setSwapModalMeal({ meal, day })}
          />
        )}

        {currentTab === 'workouts' && (
          <WorkoutPlanScreen
            workouts={workouts}
            selectedWorkoutId={selectedWorkoutId}
            onSelectWorkout={setSelectedWorkoutId}
            onOpenEvidence={setActiveEvidence}
            onOpenExerciseAlternative={(exercise, workoutTitle) =>
              setExerciseModalData({ exercise, workoutTitle })
            }
          />
        )}

        {currentTab === 'profile' && (
          <HealthProfileScreen
            initialProfile={healthProfile}
            onSaveProfile={handleSaveProfile}
          />
        )}

        {currentTab === 'pricing' && <PricingScreen />}
      </main>

      {/* Global Modals */}
      <EvidenceModal
        evidence={activeEvidence}
        onClose={() => setActiveEvidence(null)}
      />

      <SwapMealModal
        meal={swapModalMeal?.meal || null}
        day={swapModalMeal?.day || ''}
        onClose={() => setSwapModalMeal(null)}
        onConfirmSwap={handleConfirmSwap}
      />

      <ExerciseAlternativeModal
        exercise={exerciseModalData?.exercise || null}
        workoutTitle={exerciseModalData?.workoutTitle || ''}
        onClose={() => setExerciseModalData(null)}
        onViewEvidence={(ev) => {
          setExerciseModalData(null);
          setActiveEvidence(ev);
        }}
      />

      <HealthAdjustmentsModal
        isOpen={isAdjustmentsOpen}
        onClose={() => setIsAdjustmentsOpen(false)}
        onViewEvidence={(ev) => {
          setIsAdjustmentsOpen(false);
          setActiveEvidence(ev);
        }}
        onNavigateToTab={(tab) => {
          setIsAdjustmentsOpen(false);
          setCurrentTab(tab);
        }}
      />

      {/* Subtle Investor Demo Footer */}
      <footer className="border-t border-slate-200 bg-white/70 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-teal-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-3 h-3" />
            </div>
            <span className="font-semibold text-slate-800">CuraHealth</span>
            <span>— Health-Aware Personalized Nutrition &amp; Movement Prototype</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Type 1 Diabetes • Celiac Disease • Peanut Allergy • Lower Back</span>
            <button
              id="footer-adjustments-link"
              onClick={() => setIsAdjustmentsOpen(true)}
              className="text-teal-700 hover:text-teal-900 font-semibold"
            >
              Audit Log
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
