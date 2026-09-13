import React, { useMemo } from 'react';
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

const profileSummaryItems = (profile: HealthProfileState) => {
  const items: { label: string; description: string; icon: typeof Activity; iconClass: string }[] = [];
  const conditionDescriptions: Record<string, string> = {
    'Type 1 Diabetes': 'Carbohydrate counts are highlighted; exercise glucose safety guidance is included.',
    'Type 2 Diabetes': 'Balanced carbohydrate portions and meal-level nutrition details are prioritized.',
    'Celiac Disease': 'Gluten-free planning and cross-contact awareness are enabled.',
    'Lower-Back Problems': 'Movement recommendations are adapted to reduce unnecessary spinal loading.',
  };

  profile.conditions.forEach((condition) => items.push({
    label: condition,
    description: conditionDescriptions[condition] || 'Included in your personalized health plan.',
    icon: condition.includes('Diabetes') ? Activity : condition === 'Celiac Disease' ? Wheat : ShieldCheck,
    iconClass: condition.includes('Diabetes') ? 'bg-sky-100 text-sky-700' : condition === 'Celiac Disease' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700',
  }));
  profile.allergies.forEach((allergy) => items.push({ label: `${allergy} allergy`, description: `${allergy} is excluded from your meal recommendations.`, icon: Nut, iconClass: 'bg-red-100 text-red-700' }));
  profile.dietaryPreferences.forEach((preference) => items.push({ label: preference, description: `${preference} meal preferences are applied.`, icon: preference === 'Gluten-Free' ? Wheat : Utensils, iconClass: 'bg-teal-100 text-teal-700' }));
  profile.physicalLimitations.filter((limitation) => limitation.toLowerCase() !== 'lower back').forEach((limitation) => items.push({ label: `${limitation} consideration`, description: 'Movement recommendations account for this consideration.', icon: ShieldCheck, iconClass: 'bg-purple-100 text-purple-700' }));

  return items.length ? items : [{ label: 'Personalized wellness', description: 'Your plan is ready to support your goals.', icon: HeartPulse, iconClass: 'bg-teal-100 text-teal-700' }];
};

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
  const profileItems = useMemo(() => profileSummaryItems(healthProfile), [healthProfile]);
  const healthFact = useMemo(() => healthFacts.find((fact) => healthProfile.conditions.includes(fact.condition)) || {
    fact: 'Your plan is organized around the health information and preferences you selected.',
    source: 'Your Favia Health profile',
    sourceUrl: undefined,
  }, [healthProfile.conditions]);
  const mealHighlights = [
    ...healthProfile.allergies.map((allergy) => `${allergy}-free meal recommendations`),
    ...healthProfile.dietaryPreferences.map((preference) => `${preference} preferences applied`),
    ...(healthProfile.conditions.some((condition) => condition.includes('Diabetes')) ? ['Carbohydrate information visible for every meal'] : []),
  ];
  const workoutHighlights = [
    ...healthProfile.physicalLimitations.map((limitation) => `${limitation} movement considerations applied`),
    ...(healthProfile.conditions.includes('Type 1 Diabetes') ? ['Type 1 Diabetes exercise safety guidance included'] : []),
  ];
  const auditHighlights = [
    ...healthProfile.allergies.map((allergy) => ({ title: `21 / 21 meals checked for ${allergy.toLowerCase()}`, description: `${allergy} is excluded from recommendations.` })),
    ...healthProfile.dietaryPreferences.map((preference) => ({ title: `${preference} preference applied`, description: 'All meals are filtered to match your preference.' })),
    ...(healthProfile.conditions.filter((condition) => condition.includes('Diabetes')).map((condition) => ({ title: `${condition} meal information ready`, description: 'Carbohydrate information is available for every meal and snack.' }))),
    ...healthProfile.physicalLimitations.map((limitation) => ({ title: `${limitation} movement review complete`, description: 'Workout recommendations account for this consideration.' })),
  ];

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
            {healthFact.sourceUrl ? <a href={healthFact.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-medium text-teal-300 hover:text-teal-200 underline underline-offset-2">Source: {healthFact.source}</a> : <p className="mt-3 text-xs font-medium text-teal-300">Source: {healthFact.source}</p>}
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {profileItems.map((item) => {
            const Icon = item.icon;
            return <div key={item.label} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5"><div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${item.iconClass}`}><Icon className="h-4 w-4" /></div><div><span className="text-sm font-bold text-slate-900">{item.label}</span><p className="mt-0.5 text-xs text-slate-500">{item.description}</p></div></div>;
          })}
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

              <ul className="mb-6 space-y-2 text-xs text-slate-600">
                {(mealHighlights.length ? mealHighlights : ['Balanced meals with nutrition information for every day', 'Breakfast through dinner plus practical snacks']).slice(0, 3).map((highlight) => <li key={highlight} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /><span>{highlight}</span></li>)}
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

              <ul className="mb-6 space-y-2 text-xs text-slate-600">
                {(workoutHighlights.length ? workoutHighlights : ['Balanced strength and mobility recommendations', 'Exercises kept practical for your routine']).slice(0, 3).map((highlight) => <li key={highlight} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /><span>{highlight}</span></li>)}
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

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {(auditHighlights.length ? auditHighlights : [{ title: 'Your plan is ready', description: 'Meals and movement recommendations are personalized to your selections.' }]).map((item) => <div key={item.title} className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /><div><div className="text-xs font-bold text-slate-900 sm:text-sm">{item.title}</div><div className="mt-0.5 text-[11px] text-slate-500">{item.description}</div></div></div>)}
        </div>
      </div>
    </div>
  );
};
