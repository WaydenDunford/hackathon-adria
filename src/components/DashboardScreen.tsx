import React, { useState } from 'react';
import { DailyCheckIn, HealthProfileState, NavTab, EvidenceCitation } from '../types';
import { DailyCheckInCard } from './DailyCheckInCard';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Utensils,
  Dumbbell,
  Edit3,
  Flame,
  Wheat,
  Nut,
  Activity,
  ChevronRight,
  HeartPulse
} from 'lucide-react';

interface DashboardScreenProps {
  healthProfile: HealthProfileState;
  userName: string;
  dailyCheckIn: DailyCheckIn | null;
  onSaveDailyCheckIn: (draft: Omit<DailyCheckIn, 'date' | 'completedAt' | 'planAdjusted' | 'adjustmentSummary'>) => void;
  onNavigate: (tab: NavTab) => void;
  onOpenAdjustments: () => void;
}

const healthFacts = [
  {
    fact: 'Active muscles can take up glucose during exercise, even when less insulin is available.',
    condition: 'Type 1 Diabetes',
    source: 'American Diabetes Association',
    sourceUrl: 'https://diabetes.org/health-wellness/fitness/blood-glucose-and-exercise',
  },
  {
    fact: 'Physical activity can increase insulin sensitivity for 24 hours or more after a workout.',
    condition: 'Type 1 Diabetes',
    source: 'American Diabetes Association',
    sourceUrl: 'https://diabetes.org/health-wellness/fitness/blood-glucose-and-exercise',
  },
  {
    fact: 'Regular activity can help lower A1C over time, alongside an individualized diabetes plan.',
    condition: 'Type 1 Diabetes',
    source: 'American Diabetes Association',
    sourceUrl: 'https://diabetes.org/health-wellness/fitness/blood-glucose-and-exercise',
  },
  {
    fact: 'Aerobic and resistance exercise both support cardiovascular health and insulin sensitivity.',
    condition: 'Type 1 Diabetes',
    source: 'American Diabetes Association',
    sourceUrl: 'https://diabetes.org/health-wellness/fitness/anaerobic-exercise-diabetes',
  },
  {
    fact: 'Learning your own glucose response to different activities helps make exercise safer and more predictable.',
    condition: 'Type 1 Diabetes',
    source: 'American Diabetes Association',
    sourceUrl: 'https://diabetes.org/health-wellness/fitness/exercise-and-type-1',
  },
  {
    fact: 'Being active can support heart health, mood, and sleep for people living with type 1 diabetes.',
    condition: 'Type 1 Diabetes',
    source: 'American Diabetes Association',
    sourceUrl: 'https://professional.diabetes.org/sites/dpro/files/2026-06/guide-for-people-with-type_1-diabetes.pdf',
  },
  {
    fact: 'For non-specific low-back pain, physical therapy can improve strength, movement, and return to activity.',
    condition: 'Lower-Back Problems',
    source: 'World Health Organization',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/low-back-pain',
  },
  {
    fact: 'Staying physically active is one of the self-care strategies that can help reduce symptoms and future episodes of non-specific low-back pain.',
    condition: 'Lower-Back Problems',
    source: 'World Health Organization',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/low-back-pain',
  },
  {
    fact: 'Low physical activity is a risk factor for non-specific low-back pain, so gradual movement can be part of recovery.',
    condition: 'Lower-Back Problems',
    source: 'World Health Organization',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/low-back-pain',
  },
  {
    fact: 'Low-back rehabilitation aims to help people return to meaningful daily activities while improving function.',
    condition: 'Lower-Back Problems',
    source: 'World Health Organization',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/low-back-pain',
  },
  {
    fact: 'Exercise can be adapted by reducing duration, frequency, or intensity when symptoms need a gentler approach.',
    condition: 'Lower-Back Problems',
    source: 'Centers for Disease Control and Prevention',
    sourceUrl: 'https://archive.cdc.gov/www_cdc_gov/arthritis/basics/physical-activity/pain.html',
  },
  {
    fact: 'Untreated celiac disease can affect nutrient absorption, so protecting bone health is an important part of care.',
    condition: 'Celiac Disease',
    source: 'National Institute of Diabetes and Digestive and Kidney Diseases',
    sourceUrl: 'https://www.niddk.nih.gov/health-information/digestive-diseases/celiac-disease/treatment',
  },
  {
    fact: 'Regular physical activity helps strengthen bones and muscles, a useful complement to celiac disease follow-up care.',
    condition: 'Celiac Disease',
    source: 'Centers for Disease Control and Prevention',
    sourceUrl: 'https://www.cdc.gov/physical-activity-basics/health-benefits/adults.html',
  },
  {
    fact: 'Physical activity can improve sleep quality and reduce anxiety—whole-health benefits alongside celiac disease treatment.',
    condition: 'Celiac Disease',
    source: 'Centers for Disease Control and Prevention',
    sourceUrl: 'https://www.cdc.gov/physical-activity-basics/health-benefits/adults.html',
  },
  {
    fact: 'Exercise supports general health, but a strict gluten-free diet remains the treatment for celiac disease.',
    condition: 'Celiac Disease',
    source: 'National Institute of Diabetes and Digestive and Kidney Diseases',
    sourceUrl: 'https://www.niddk.nih.gov/health-information/digestive-diseases/celiac-disease/treatment',
  },
];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  healthProfile,
  userName,
  dailyCheckIn,
  onSaveDailyCheckIn,
  onNavigate,
  onOpenAdjustments,
}) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const [healthFact] = useState(() => healthFacts[Math.floor(Math.random() * healthFacts.length)]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 1. Header Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 rounded-3xl px-6 py-8 sm:px-8 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center lg:gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Health-Aware Planning Engine Active</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {greeting}, {userName}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                id="dashboard-view-plan-btn"
                onClick={() => onNavigate('meals')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <span>View My Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="dashboard-see-adjustments-hero-btn"
                onClick={onOpenAdjustments}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-sm transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-teal-300" />
                <span>Safety Audit Overview</span>
              </button>
            </div>
          </div>

          <aside className="w-full max-w-sm rounded-2xl border border-teal-300/20 bg-slate-950/20 px-5 py-5 text-center lg:max-w-none">
            <div className="flex items-center justify-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Did you know?</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-100">{healthFact.fact}</p>
            <a
              href={healthFact.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-xs font-medium text-teal-300 hover:text-teal-200 underline underline-offset-2"
            >
              Source: {healthFact.source}
            </a>
          </aside>
        </div>
      </div>

      <DailyCheckInCard
        checkIn={dailyCheckIn}
        onSave={onSaveDailyCheckIn}
        onViewPlan={() => onNavigate('workouts')}
      />

      {/* 2. Health Profile Summary Card */}
      <div
        id="health-profile-summary-card"
        className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs"
      >
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/60">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Your Plan Considers
              </h2>
            </div>
          </div>

          <button
            id="edit-health-profile-btn"
            onClick={() => onNavigate('profile')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100/70 border border-teal-200/60 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Health Profile</span>
          </button>
        </div>

        {/* Badges / Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Type 1 Diabetes */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900">Type 1 Diabetes</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Carb counts highlighted; exercise hypoglycemia safety rules applied.
              </p>
            </div>
          </div>

          {/* Celiac Disease */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <Wheat className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900">Celiac Disease</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                100% strict gluten elimination; cross-contact precautions enabled.
              </p>
            </div>
          </div>

          {/* Peanut Allergy */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
              <Nut className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900">Peanut Allergy</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Zero peanut ingredients; seed-butter safe substitutions used.
              </p>
            </div>
          </div>

          {/* Lower-Back Problems */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900">Lower-Back Problems</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Axial loading substituted; disc compression minimized.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Current Plan Section (Two Large Cards) */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">This Week&apos;s Tailored Program</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Meal Plan Card */}
          <div
            id="dashboard-meal-plan-card"
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-700">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Meal Plan</h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60">
                  7-Day Plan
                </span>
              </div>

              {/* Key Specs */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 mb-5">
                <div>
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Daily Target
                  </div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    ~2,150 <span className="text-xs font-normal text-slate-500">kcal</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Avg Protein
                  </div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    118 <span className="text-xs font-normal text-slate-500">g/day</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Selection
                  </div>
                  <div className="text-xs font-bold text-teal-700 mt-1">
                    Health-Aware
                  </div>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified 100% gluten-free and peanut-free recipes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Precise carbohydrate tracking visible for every meal</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Breakfast through dinner + stabilizing snacks</span>
                </li>
              </ul>
            </div>

            <button
              id="dashboard-btn-view-meal-plan"
              onClick={() => onNavigate('meals')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>View Meal Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Workout Plan Card */}
          <div
            id="dashboard-workout-plan-card"
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-700">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Workout Plan</h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60">
                  3 Workouts / Week
                </span>
              </div>

              {/* Key Specs */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 mb-5">
                <div>
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Schedule
                  </div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    3 Days <span className="text-xs font-normal text-slate-500">/ wk</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Focus
                  </div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    Strength <span className="text-xs font-normal text-slate-500">+ Core</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Exercises
                  </div>
                  <div className="text-xs font-bold text-teal-700 mt-1">
                    Adapted
                  </div>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>3 high-compression movements safely modified</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Type 1 Diabetes exercise safety guidelines included</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>15 exercises kept standard without over-restriction</span>
                </li>
              </ul>
            </div>

            <button
              id="dashboard-btn-view-workout-plan"
              onClick={() => onNavigate('workouts')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>View Workout Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Health Check Summary Card (Core Differentiator) */}
      <div
        id="health-check-summary-card"
        className="bg-gradient-to-br from-teal-50/70 via-white to-emerald-50/50 rounded-2xl border border-teal-200/90 p-6 sm:p-7 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-teal-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Health Check Complete
                </h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  100% Passed
                </span>
              </div>
            </div>
          </div>

          <button
            id="dashboard-see-health-adjustments-btn"
            onClick={onOpenAdjustments}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
          >
            <span>See Health Adjustments</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Content Bullets specified by prompt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">21 / 21 meals checked for gluten</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Zero gluten or wheat cross-contact</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">21 / 21 meals checked for peanuts</div>
              <div className="text-[11px] text-slate-500 mt-0.5">100% allergen exclusion verified</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">Carbohydrate information ready</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Available for every single meal &amp; snack</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">18 / 18 exercises reviewed</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Evaluated for lower-back disc loading</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-amber-200 shadow-2xs flex items-start gap-3 col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
              3
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">3 exercises modified based on physical limitations</div>
              <div className="text-[11px] text-slate-600 mt-0.5">
                Barbell back squats, bent-over rows, and heavy Romanian deadlifts safely adapted to remove axial spine compression.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
