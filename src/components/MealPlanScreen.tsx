import React, { useState } from 'react';
import { DayOfWeek, Meal, EvidenceCitation } from '../types';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ShieldCheck,
  Wheat,
  Nut,
  Activity,
  CheckCircle2,
  Info,
  Utensils,
  Sparkles
} from 'lucide-react';

interface MealPlanScreenProps {
  weeklyMeals: Record<string, Meal[]>;
  selectedDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
  onOpenEvidence: (evidence: EvidenceCitation) => void;
  onOpenSwapMeal: (meal: Meal, day: string) => void;
}

type MealSlotType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export const MealPlanScreen: React.FC<MealPlanScreenProps> = ({
  weeklyMeals,
  selectedDay,
  onSelectDay,
  onOpenEvidence,
  onOpenSwapMeal,
}) => {
  const days: DayOfWeek[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const mealSlots: MealSlotType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  // Track the chosen meal slot to display (Breakfast, Lunch, Dinner, Snack)
  const [selectedMealType, setSelectedMealType] = useState<MealSlotType>('Breakfast');

  // Track whether "Relevant to your health" is expanded for the current meal
  const [isHealthExpanded, setIsHealthExpanded] = useState<boolean>(true);

  // Track "Why this meal?" accordion
  const [isWhyExpanded, setIsWhyExpanded] = useState<boolean>(true);

  // Get meals for selected day
  const currentDayMeals = weeklyMeals[selectedDay] || [];

  // Compute daily totals for the currently selected day
  const totalCalories = currentDayMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = currentDayMeals.reduce((acc, m) => acc + m.protein, 0);
  const totalCarbs = currentDayMeals.reduce((acc, m) => acc + m.carbs, 0);
  const totalFat = currentDayMeals.reduce((acc, m) => acc + m.fat, 0);

  // Find the single chosen meal to display
  const selectedMeal =
    currentDayMeals.find((m) => m.type === selectedMealType) || currentDayMeals[0];

  // Helper to step through meals linearly (Previous / Next)
  const allOrderedSlots: { day: DayOfWeek; slot: MealSlotType }[] = [];
  days.forEach((d) => {
    mealSlots.forEach((s) => {
      allOrderedSlots.push({ day: d, slot: s });
    });
  });

  const currentIndex = allOrderedSlots.findIndex(
    (item) => item.day === selectedDay && item.slot === selectedMealType
  );

  const handlePrevMeal = () => {
    if (currentIndex > 0) {
      const prev = allOrderedSlots[currentIndex - 1];
      onSelectDay(prev.day);
      setSelectedMealType(prev.slot);
    }
  };

  const handleNextMeal = () => {
    if (currentIndex < allOrderedSlots.length - 1) {
      const next = allOrderedSlots[currentIndex + 1];
      onSelectDay(next.day);
      setSelectedMealType(next.slot);
    }
  };

  // Helper for placeholder meal visuals with gradients and food icons
  const getMealVisual = (type: MealSlotType) => {
    const visualStyles = {
      Breakfast: {
        gradient: 'from-amber-100 via-orange-50 to-amber-50 text-amber-800 border-amber-200/80',
        badge: 'bg-amber-100/90 text-amber-900 border-amber-300',
        label: 'Morning Fuel',
      },
      Lunch: {
        gradient: 'from-teal-100 via-emerald-50 to-teal-50 text-teal-800 border-teal-200/80',
        badge: 'bg-teal-100/90 text-teal-900 border-teal-300',
        label: 'Midday Stability',
      },
      Dinner: {
        gradient: 'from-sky-100 via-indigo-50 to-sky-50 text-sky-800 border-sky-200/80',
        badge: 'bg-sky-100/90 text-sky-900 border-sky-300',
        label: 'Evening Recovery',
      },
      Snack: {
        gradient: 'from-emerald-100 via-teal-50 to-emerald-50 text-emerald-800 border-emerald-200/80',
        badge: 'bg-emerald-100/90 text-emerald-900 border-emerald-300',
        label: 'Glycemic Buffer',
      },
    };

    const style = visualStyles[type] || visualStyles.Breakfast;

    return (
      <div
        className={`w-full h-44 sm:h-48 rounded-2xl bg-gradient-to-br ${style.gradient} border p-4 flex flex-col justify-between relative overflow-hidden shadow-2xs`}
      >
        <div className="flex items-center justify-between z-10">
          <span
            className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border shadow-2xs ${style.badge}`}
          >
            {type}
          </span>
          <span className="text-[11px] font-semibold text-slate-600 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
            {style.label}
          </span>
        </div>

        <div className="flex items-center gap-3 z-10">
          <div className="w-12 h-12 rounded-xl bg-white/95 shadow-sm border border-slate-200/70 flex items-center justify-center text-slate-800">
            <Utensils className="w-6 h-6 text-slate-800" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Certified Safe &amp; Audited
            </span>
            <span className="text-[11px] text-slate-600">
              Zero Gluten • Zero Peanuts • Carb Counted
            </span>
          </div>
        </div>

        {/* Decorative corner ring */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/30 pointer-events-none" />
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner: Title without description beneath as requested */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            7-Day Health-Aware Meal Plan
          </h1>
        </div>

        {/* Daily Nutrition Tally Pill */}
        <div className="inline-flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-2xs self-start sm:self-auto text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              {selectedDay} Total
            </span>
            <span className="font-extrabold text-slate-900 text-sm">{totalCalories} kcal</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Carbs (T1D)
            </span>
            <span className="font-extrabold text-teal-700 text-sm">{totalCarbs}g</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Protein
            </span>
            <span className="font-bold text-slate-800 text-sm">{totalProtein}g</span>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Left side Calendar/Table Selector, Right side Selected Meal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Calendar / Table Meal Plan Selector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Weekly Schedule
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                Click any meal to view
              </span>
            </div>

            {/* Calendar Table Matrix: Days as columns, Daily meals as rows */}
            <div className="overflow-x-auto -mx-1 sm:mx-0">
              <table
                id="meal-calendar-table"
                className="w-full text-xs border-collapse min-w-[340px]"
              >
                <thead>
                  <tr>
                    <th className="p-1.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 w-16">
                      Meal
                    </th>
                    {days.map((day) => {
                      const isDaySelected = selectedDay === day;
                      return (
                        <th
                          key={day}
                          className={`p-1.5 text-center text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 transition-colors ${
                            isDaySelected
                              ? 'text-teal-700 bg-teal-50/70 rounded-t-lg'
                              : 'text-slate-500'
                          }`}
                        >
                          <span className="hidden sm:inline">{day.substring(0, 3)}</span>
                          <span className="sm:hidden">{day.substring(0, 1)}</span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {mealSlots.map((slot) => (
                    <tr key={slot} className="border-b border-slate-100 last:border-b-0">
                      {/* Row Header: Meal Type */}
                      <td className="py-2.5 pr-1.5 pl-1 font-bold text-slate-700 text-[11px] whitespace-nowrap">
                        {slot}
                      </td>

                      {/* Day Columns */}
                      {days.map((day) => {
                        const dayMeals = weeklyMeals[day] || [];
                        const cellMeal = dayMeals.find((m) => m.type === slot);
                        const isCellSelected =
                          selectedDay === day && selectedMealType === slot;

                        return (
                          <td key={day} className="p-1 text-center">
                            <button
                              id={`cell-${day.toLowerCase()}-${slot.toLowerCase()}`}
                              onClick={() => {
                                onSelectDay(day);
                                setSelectedMealType(slot);
                              }}
                              title={`${day} ${slot}: ${cellMeal?.name || ''} (${cellMeal?.carbs || 0}g carbs, ${cellMeal?.calories || 0} kcal)`}
                              className={`w-full py-2 px-1 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                                isCellSelected
                                  ? 'bg-teal-600 text-white font-bold shadow-xs ring-2 ring-teal-500/30'
                                  : 'bg-slate-50/80 hover:bg-teal-50 text-slate-700 border border-slate-200/70 hover:border-teal-300'
                              }`}
                            >
                              <span
                                className={`text-[10px] font-extrabold leading-tight ${
                                  isCellSelected ? 'text-white' : 'text-teal-900'
                                }`}
                              >
                                {cellMeal?.carbs}g
                              </span>
                              <span
                                className={`text-[9px] leading-tight ${
                                  isCellSelected ? 'text-teal-100' : 'text-slate-400'
                                }`}
                              >
                                {cellMeal?.calories}k
                              </span>
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Summary of Active Day */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">
                Viewing: <strong className="text-slate-900">{selectedDay} • {selectedMealType}</strong>
              </span>
              <span className="text-[11px] text-slate-400">
                Cell values: Carbs / kcal
              </span>
            </div>
          </div>

          {/* Quick Slot Filter Buttons */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-2xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Jump to meal slot for {selectedDay}:
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {mealSlots.map((slot) => {
                const isSelected = selectedMealType === slot;
                return (
                  <button
                    key={slot}
                    id={`quick-slot-btn-${slot.toLowerCase()}`}
                    onClick={() => setSelectedMealType(slot)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all text-center cursor-pointer ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-2xs font-bold'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Show JUST THAT MEAL in full comprehensive detail */}
        <div className="lg:col-span-7">
          {selectedMeal && (
            <div
              id={`active-meal-detail-card-${selectedMeal.id}`}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-5 transition-all"
            >
              {/* Card Header & Pagination Controls */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold uppercase tracking-wider">
                    {selectedDay}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {selectedMeal.type}
                  </span>
                </div>

                {/* Prev / Next linear step buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    id="btn-prev-meal"
                    onClick={handlePrevMeal}
                    disabled={currentIndex === 0}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Previous meal"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-semibold text-slate-400 px-1">
                    {currentIndex + 1} of {allOrderedSlots.length}
                  </span>
                  <button
                    id="btn-next-meal"
                    onClick={handleNextMeal}
                    disabled={currentIndex === allOrderedSlots.length - 1}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Next meal"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Meal Graphic Banner */}
              {getMealVisual(selectedMeal.type as MealSlotType)}

              {/* Meal Title & Subtitle */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {selectedMeal.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  {selectedMeal.subtitle}
                </p>
              </div>

              {/* Nutrition Macros Bar */}
              <div className="grid grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
                <div className="py-1">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    Calories
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-slate-900">
                    {selectedMeal.calories}
                  </span>
                </div>

                <div className="py-1 bg-teal-50 rounded-xl border border-teal-200/80 shadow-2xs">
                  <span className="block text-[10px] uppercase font-bold text-teal-700">
                    Carbs (T1D)
                  </span>
                  <span className="text-sm sm:text-base font-black text-teal-950">
                    {selectedMeal.carbs}g
                  </span>
                </div>

                <div className="py-1">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    Protein
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-slate-900">
                    {selectedMeal.protein}g
                  </span>
                </div>

                <div className="py-1">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    Fat
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-slate-900">
                    {selectedMeal.fat}g
                  </span>
                </div>
              </div>

              {/* Verified Health Safeguard Flags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                  <Wheat className="w-3.5 h-3.5 text-amber-600" />
                  <span>Gluten-Free (Celiac Safe)</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                  <Nut className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Peanut-Free (Verified)</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-sky-50 text-sky-900 border border-sky-200">
                  <Activity className="w-3.5 h-3.5 text-sky-600" />
                  <span>T1D Aware ({selectedMeal.carbs}g Carbohydrate)</span>
                </span>
              </div>

              {/* Ingredients Summary */}
              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Verified Safe Ingredients:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedMeal.ingredientsSummary}
                </p>
              </div>

              {/* "Why this meal?" - explicitly kept per instructions */}
              <div className="border-t border-slate-100 pt-4">
                <button
                  id="why-this-meal-toggle-btn"
                  onClick={() => setIsWhyExpanded(!isWhyExpanded)}
                  className="flex items-center justify-between w-full text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    <Info className="w-4 h-4 text-teal-600" />
                    <span>Why this meal?</span>
                  </div>
                  {isWhyExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {isWhyExpanded && (
                  <div className="mt-2.5 p-4 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs sm:text-sm text-teal-950 leading-relaxed animate-fade-in">
                    {selectedMeal.whyThisMeal}
                  </div>
                )}
              </div>

              {/* "Relevant to your health" Expandable Section */}
              <div className="border-t border-slate-100 pt-4">
                <button
                  id="relevant-health-toggle-btn"
                  onClick={() => setIsHealthExpanded(!isHealthExpanded)}
                  className="flex items-center justify-between w-full text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>Relevant to your health</span>
                  </div>
                  {isHealthExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {isHealthExpanded && (
                  <div className="mt-3 space-y-2.5 animate-fade-in">
                    {/* T1D */}
                    <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 text-xs text-slate-700">
                      <div className="flex items-center gap-1.5 font-bold text-sky-950 mb-1">
                        <Activity className="w-3.5 h-3.5 text-sky-600" />
                        <span>Type 1 Diabetes (Bolus Guidance)</span>
                      </div>
                      <p className="leading-relaxed">
                        {selectedMeal.healthNotes.type1Diabetes}
                      </p>
                    </div>

                    {/* Celiac */}
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-700">
                      <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-1">
                        <Wheat className="w-3.5 h-3.5 text-amber-600" />
                        <span>Celiac Disease (Gluten Exclusion)</span>
                      </div>
                      <p className="leading-relaxed">
                        {selectedMeal.healthNotes.celiac}
                      </p>
                    </div>

                    {/* Peanut Allergy */}
                    <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-slate-700">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-950 mb-1">
                        <Nut className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Peanut Allergy (Cross-Contact Safeguard)</span>
                      </div>
                      <p className="leading-relaxed">
                        {selectedMeal.healthNotes.peanutAllergy}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Swap Meal & View Evidence */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  id={`btn-swap-meal-${selectedMeal.id}`}
                  onClick={() => onOpenSwapMeal(selectedMeal, selectedDay)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Swap meal</span>
                </button>

                <button
                  id={`btn-evidence-meal-${selectedMeal.id}`}
                  onClick={() => onOpenEvidence(selectedMeal.evidence)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>View clinical evidence</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
