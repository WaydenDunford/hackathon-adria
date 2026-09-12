import React, { useState } from 'react';
import { DayOfWeek, EvidenceCitation, Meal } from '../types';
import {
  Activity, ChevronDown, ChevronUp, CircleGauge, Flame, Info, Nut,
  RefreshCw, ShieldCheck, Utensils, Wheat, X
} from 'lucide-react';

interface MealPlanScreenProps {
  weeklyMeals: Record<string, Meal[]>;
  selectedDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
  onOpenEvidence: (evidence: EvidenceCitation) => void;
  onOpenSwapMeal: (meal: Meal, day: string) => void;
  onAddSnack: (day: DayOfWeek, snack: Meal) => void;
}

const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const mealBenefits = (meal: Meal) => meal.whyThisMeal || meal.healthRelevance[0]?.explanation;
const getToday = () => days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
const recipeForOneServing = (meal: Meal) => {
  const portions = meal.type === 'Breakfast'
    ? ['1 cup', '½ cup', '2 tbsp', '1 tsp']
    : meal.type === 'Lunch'
      ? ['140 g', '¾ cup', '1 cup', '1 tbsp']
      : meal.type === 'Dinner'
        ? ['160 g', '200 g', '1 cup', '1 tbsp']
        : ['170 g', '¼ cup', '2 tbsp', '1 tsp'];
  return meal.ingredientsSummary.split(',').slice(0, 4).map((ingredient, index) => ({
    ingredient: ingredient.trim(),
    amount: portions[index],
  }));
};

export const MealPlanScreen: React.FC<MealPlanScreenProps> = ({
  weeklyMeals, selectedDay, onSelectDay, onOpenEvidence, onOpenSwapMeal,
}) => {
  const [openMeal, setOpenMeal] = useState<Meal | null>(null);
  const [isWhyOpen, setIsWhyOpen] = useState(true);
  const [isHealthOpen, setIsHealthOpen] = useState(true);
  const today = getToday();
  const meals = weeklyMeals[selectedDay] || [];
  const dayCalories = meals.reduce((total, meal) => total + meal.calories, 0);

  const openDetails = (meal: Meal) => {
    setOpenMeal(meal);
    setIsWhyOpen(true);
    setIsHealthOpen(true);
  };

  const iconForHealth = (type: Meal['healthRelevance'][number]['iconType']) => {
    if (type === 't1d') return Activity;
    if (type === 'celiac') return Wheat;
    if (type === 'allergy') return Nut;
    return ShieldCheck;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Your weekly menu</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">7-Day Health-Aware Meal Plan</h1>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
          {selectedDay}: <strong className="text-slate-900">{dayCalories} kcal planned</strong>
        </div>
      </header>

      <section aria-label="Choose a day" className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {days.map((day) => {
          const active = day === selectedDay;
          const isToday = day === today;
          const total = (weeklyMeals[day] || []).reduce((sum, meal) => sum + meal.calories, 0);
          return (
            <button
              key={day}
              onClick={() => onSelectDay(day)}
              className={`cursor-pointer rounded-2xl border p-3 text-left transition-all ${
                active
                  ? 'border-teal-500 bg-white shadow-md ring-2 ring-teal-500/15'
                  : 'border-slate-200 bg-white/80 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className={`text-xs font-bold ${active ? 'text-teal-800' : 'text-slate-800'}`}>{day}</span>
                {isToday && <span className="rounded-full bg-teal-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">Today</span>}
              </div>
              <span className="mt-1 block text-[11px] text-slate-500">{(weeklyMeals[day] || []).length} meals · {total} kcal</span>
            </button>
          );
        })}
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">{selectedDay}'s meals</h2>
        </div>

        {meals.map((meal) => (
          <article
            key={meal.id}
            onClick={() => openDetails(meal)}
            className="relative grid cursor-pointer overflow-visible rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md md:grid-cols-[1.2fr_0.7fr_1fr]"
          >
            <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 shadow-sm">{meal.type}</span>
            <section className="flex min-h-56 flex-col p-5 sm:p-6">
              <button onClick={(event) => { event.stopPropagation(); openDetails(meal); }} className="cursor-pointer text-center text-lg font-bold leading-snug text-slate-900 hover:text-teal-700 sm:text-xl">
                {meal.name}
              </button>
              <div className="mt-auto pt-5">
                <p className="text-sm leading-relaxed text-slate-600">{meal.subtitle}</p>
                <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50/60 p-3 text-xs leading-relaxed text-teal-950">
                  <span className="mb-1 flex items-center gap-1.5 font-bold"><CircleGauge className="h-3.5 w-3.5 text-teal-600" />Benefits</span>
                  {mealBenefits(meal)}
                </div>
              </div>
            </section>

            <section className="border-y border-slate-100 bg-slate-50/70 p-5 sm:p-6 md:border-x md:border-y-0">
              <p className="mb-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">Macros</p>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  ['Calories', meal.calories, 'kcal', Flame],
                  ['Carbs', meal.carbs, 'g', Activity],
                  ['Protein', meal.protein, 'g', Utensils],
                  ['Fat', meal.fat, 'g', CircleGauge],
                ].map(([label, amount, unit, Icon]) => {
                  const MacroIcon = Icon as typeof Flame;
                  return (
                    <div key={String(label)} className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                      <MacroIcon className={`mx-auto mb-1 h-4 w-4 ${label === 'Carbs' ? 'text-teal-600' : 'text-slate-400'}`} />
                      <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</span>
                      <span className="text-sm font-extrabold text-slate-900">{amount}{unit}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="flex min-h-56 flex-col p-4 sm:p-5">
              <div>
                <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">Recipe</p>
                <div className="grid grid-cols-2 gap-2">
                  {recipeForOneServing(meal).map(({ ingredient, amount }) => (
                    <div key={ingredient} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                      <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">{amount}</span>
                      <span className="mt-0.5 block text-xs font-bold leading-snug text-slate-800">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-slate-50 p-2.5"><span className="block text-[10px] font-bold uppercase text-slate-400">Serving size</span><span className="text-xs font-bold text-slate-800">1 balanced plate</span></div>
                <div className="rounded-xl bg-slate-50 p-2.5"><span className="block text-[10px] font-bold uppercase text-slate-400">Preparation</span><span className="text-xs font-bold text-slate-800">15–25 min</span></div>
              </div>
            </section>
          </article>
        ))}
      </section>

      {openMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4" onClick={() => setOpenMeal(null)}>
          <article role="dialog" aria-modal="true" aria-label={`${openMeal.name} details`} onClick={(event) => event.stopPropagation()} className="max-h-[85dvh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <header className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white p-5">
              <div><p className="text-[11px] font-bold uppercase tracking-wider text-teal-700">{selectedDay} · {openMeal.type}</p><h2 className="mt-1 text-xl font-bold text-slate-900">{openMeal.name}</h2></div>
              <button onClick={() => setOpenMeal(null)} className="cursor-pointer rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </header>
            <div className="space-y-4 p-5">
              <section className="rounded-2xl border border-teal-100 bg-teal-50/60 p-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-teal-950"><Info className="h-4 w-4 text-teal-600" />Meal research</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">This meal supports your current nutrition goals through its verified ingredients, balanced macros, and condition-aware preparation.</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-teal-700">
                  <a href="https://example.com/nutrition-study" target="_blank" rel="noreferrer" className="underline hover:text-teal-900">Nutrition study ↗</a>
                  <a href="https://example.com/meal-guidance" target="_blank" rel="noreferrer" className="underline hover:text-teal-900">Meal guidance ↗</a>
                  <a href="https://example.com/ingredient-reference" target="_blank" rel="noreferrer" className="underline hover:text-teal-900">Ingredient reference ↗</a>
                </div>
              </section>
              <section className="rounded-2xl border border-slate-200"><button onClick={() => setIsWhyOpen(!isWhyOpen)} className="flex w-full cursor-pointer items-center justify-between p-4 text-left"><span className="flex items-center gap-2 text-sm font-bold"><Info className="h-4 w-4 text-teal-600" />Why this meal?</span>{isWhyOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</button>{isWhyOpen && <p className="border-t border-slate-100 p-4 text-sm leading-relaxed text-slate-600">{mealBenefits(openMeal)}</p>}</section>
              <section className="rounded-2xl border border-slate-200"><button onClick={() => setIsHealthOpen(!isHealthOpen)} className="flex w-full cursor-pointer items-center justify-between p-4 text-left"><span className="flex items-center gap-2 text-sm font-bold"><ShieldCheck className="h-4 w-4 text-teal-600" />Relevant to your health</span>{isHealthOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</button>{isHealthOpen && <div className="space-y-2 border-t border-slate-100 p-3">{openMeal.healthRelevance.map((item) => { const Icon = iconForHealth(item.iconType); return <div key={item.condition} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600"><p className="mb-1 flex items-center gap-1.5 font-bold text-slate-900"><Icon className="h-4 w-4 text-teal-600" />{item.condition}</p>{item.explanation}</div>; })}</div>}</section>
              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-between"><button onClick={() => onOpenEvidence(openMeal.evidence)} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-xs font-bold text-teal-800"><ShieldCheck className="h-4 w-4" />View clinical evidence</button><button onClick={() => onOpenSwapMeal(openMeal, selectedDay)} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white"><RefreshCw className="h-4 w-4" />Swap meal</button></div>
            </div>
          </article>
        </div>
      )}
    </div>
  );
};
