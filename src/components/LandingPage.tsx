import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  HeartPulse,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { HealthProfileState } from '../types';
import nutritionImage from '../assets/landing/nutrition.png';
import trainingImage from '../assets/landing/training.png';
import mobilityImage from '../assets/landing/mobility.png';
import planningImage from '../assets/landing/planning.png';

export interface LandingPageProps {
  onComplete: (name: string, profile: HealthProfileState) => void;
  onDevSkip?: () => void;
}

const conditionOptions = ['Type 1 Diabetes', 'Type 2 Diabetes', 'Celiac Disease', 'Lower-Back Problems', 'Other', 'None'];
const allergyOptions = ['Peanuts', 'Tree nuts', 'Milk', 'Eggs', 'Soy', 'Fish', 'Shellfish', 'Wheat', 'Other', 'None'];
const limitationOptions = ['Lower back', 'Knee', 'Shoulder', 'Hip', 'Limited mobility', 'Physical disability', 'Other', 'None'];
const dietaryOptions = ['No preference', 'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Lactose-Free', 'Gluten-Free', 'Dairy-Free', 'Other'];

const visuals = [
  { src: nutritionImage, label: 'Personalized Nutrition' },
  { src: trainingImage, label: 'Health-Aware Training' },
  { src: mobilityImage, label: 'Safe Movement' },
  { src: planningImage, label: 'Built Around You' },
];

const toggleChoice = (items: string[], item: string) => {
  if (item === 'None') return items.includes('None') ? [] : ['None'];
  const withoutNone = items.filter((value) => value !== 'None');
  return withoutNone.includes(item)
    ? withoutNone.filter((value) => value !== item)
    : [...withoutNone, item];
};

function ChoiceGrid({
  options,
  values,
  onChange,
  searchable = false,
}: {
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
  searchable?: boolean;
}) {
  const [query, setQuery] = useState('');
  const visibleOptions = useMemo(
    () => options.filter((option) => option.toLowerCase().includes(query.toLowerCase())),
    [options, query]
  );

  return (
    <div className="space-y-3">
      {searchable && (
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-500 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-500/15">
          <Search className="h-4 w-4" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search conditions"
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </label>
      )}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {visibleOptions.map((option) => {
          const isSelected = values.includes(option);
          return (
            <button
              type="button"
              key={option}
              onClick={() => onChange(toggleChoice(values, option))}
              aria-pressed={isSelected}
              className={`flex min-h-12 items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all ${
                isSelected
                  ? 'border-teal-500 bg-teal-50 text-teal-950 ring-2 ring-teal-500/15'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50/40'
              }`}
            >
              <span>{option}</span>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${isSelected ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 bg-white'}`}>
                {isSelected && <Check className="h-3.5 w-3.5" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LandingPage({ onComplete, onDevSkip }: LandingPageProps) {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [conditions, setConditions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [limitations, setLimitations] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>(['No preference']);
  const [otherCondition, setOtherCondition] = useState('');
  const [otherAllergy, setOtherAllergy] = useState('');
  const [otherLimitation, setOtherLimitation] = useState('');
  const [otherPreference, setOtherPreference] = useState('');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isWideLayout, setIsWideLayout] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const updateLayout = () => setIsWideLayout(mediaQuery.matches);
    updateLayout();
    mediaQuery.addEventListener('change', updateLayout);
    return () => mediaQuery.removeEventListener('change', updateLayout);
  }, []);

  const openOnboarding = () => setIsOnboardingOpen(true);
  const next = () => {
    if (step === 1 && (!name.trim() || !age.trim())) {
      setError('Please enter your name and age to continue.');
      return;
    }
    setError('');
    setStep((current) => Math.min(5, current + 1));
  };
  const createPlan = () => {
    const appendOther = (values: string[], other: string) =>
      values.filter((value) => value !== 'None' && value !== 'Other').concat(other.trim() ? [other.trim()] : []);
    setIsGenerating(true);
    window.setTimeout(() => {
      onComplete(name.trim(), {
        conditions: appendOther(conditions, otherCondition),
        allergies: appendOther(allergies, otherAllergy),
        physicalLimitations: appendOther(limitations, otherLimitation),
        dietaryPreferences: preferences.includes('No preference') ? [] : appendOther(preferences, otherPreference),
      });
    }, 2200);
  };

  const renderStep = () => {
    if (step === 1) return (
      <div className="space-y-5">
        <div><h2 className="text-2xl font-bold tracking-tight text-slate-900">Let’s start with you.</h2><p className="mt-1 text-sm text-slate-500">A few details help us personalize your experience.</p></div>
        <label className="block text-sm font-semibold text-slate-700">First name<input autoFocus value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15" placeholder="Your first name" /></label>
        <label className="block text-sm font-semibold text-slate-700">Age<input inputMode="numeric" value={age} onChange={(event) => setAge(event.target.value.replace(/\D/g, ''))} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15" placeholder="e.g. 32" /></label>
      </div>
    );
    const content = step === 2
      ? { title: 'Any health conditions to account for?', description: 'This is for plan personalization, not medical diagnosis.', options: conditionOptions, values: conditions, setValues: setConditions, other: otherCondition, setOther: setOtherCondition, searchable: true, label: 'condition' }
      : step === 3
        ? { title: 'Any food allergies or intolerances?', description: 'Select as many as apply. Choose None if there are no food restrictions.', options: allergyOptions, values: allergies, setValues: setAllergies, other: otherAllergy, setOther: setOtherAllergy, label: 'allergy or intolerance' }
        : step === 4
          ? { title: 'Anything that affects how you move?', description: 'We’ll use this to adapt movement recommendations.', options: limitationOptions, values: limitations, setValues: setLimitations, other: otherLimitation, setOther: setOtherLimitation, label: 'movement consideration' }
          : { title: 'What are your dietary preferences?', description: 'Preferences are separate from allergies and medical restrictions.', options: dietaryOptions, values: preferences, setValues: setPreferences, other: otherPreference, setOther: setOtherPreference, label: 'dietary preference' };
    return (
      <div className="space-y-5">
        <div><h2 className="text-2xl font-bold tracking-tight text-slate-900">{content.title}</h2><p className="mt-1 text-sm text-slate-500">{content.description}</p></div>
        <ChoiceGrid options={content.options} values={content.values} onChange={content.setValues} searchable={content.searchable} />
        {content.values.includes('Other') && <label className="block text-sm font-semibold text-slate-700">Tell us more<input value={content.other} onChange={(event) => content.setOther(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15" placeholder={`Describe your ${content.label}`} /></label>}
      </div>
    );
  };

  const onboardingPanel = (
    <div className="mx-auto w-full max-w-xl px-6 py-24 sm:px-10 lg:py-14">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8">
        <div className="mb-7 flex items-center justify-between gap-4"><div className="flex items-center gap-2 text-sm font-bold text-teal-700"><ShieldCheck className="h-5 w-5" />Your health profile</div><span className="text-xs font-semibold text-slate-400">Step {step} of 5</span></div>
        <div className="mb-8 flex gap-1.5" aria-label={`Step ${step} of 5`}>{[1, 2, 3, 4, 5].map((item) => <span key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? 'bg-teal-600' : 'bg-slate-100'}`} />)}</div>
        {renderStep()}
        {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-5"><button type="button" onClick={() => step === 1 ? setIsOnboardingOpen(false) : setStep((current) => current - 1)} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"><ArrowLeft className="h-4 w-4" />{step === 1 ? 'Back to landing' : 'Back'}</button>{step < 5 ? <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white hover:bg-teal-500">Continue<ArrowRight className="h-4 w-4" /></button> : <button type="button" onClick={createPlan} className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white hover:bg-teal-500"><Sparkles className="h-4 w-4" />Create My Plan</button>}</div>
      </div>
    </div>
  );

  return (
    <div className="h-[100dvh] overflow-hidden bg-white text-slate-950">
      <motion.header animate={{ width: isWideLayout && isOnboardingOpen ? '50%' : '100%' }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="absolute left-0 top-0 z-30 flex items-center px-6 py-6 sm:px-10 lg:px-[5vw] lg:py-8">
        <div className="flex w-full items-center justify-between gap-3"><div className="flex items-center gap-2.5 text-slate-900"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm"><HeartPulse className="h-5 w-5" /></span><span className="text-lg font-extrabold tracking-tight">CuraHealth</span></div>{onDevSkip && !isOnboardingOpen && <button type="button" onClick={onDevSkip} className="rounded-lg border border-dashed border-slate-300 bg-white/80 px-3 py-2 text-[11px] font-bold text-slate-500 transition hover:border-teal-400 hover:text-teal-700">Dev: skip onboarding</button>}</div>
      </motion.header>

      <main className="relative flex h-full min-h-0 flex-col overflow-hidden lg:flex-row-reverse">
        <motion.section animate={{ width: isWideLayout && isOnboardingOpen ? '50%' : '100%' }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="relative flex h-full min-h-0 shrink-0 items-center justify-center overflow-hidden px-6 pb-7 pt-24 sm:px-10 sm:pb-8 lg:px-[5vw] lg:py-20">
          <div className="pointer-events-none absolute -left-32 -top-24 h-96 w-96 rounded-full bg-teal-100/70 blur-3xl" /><div className="pointer-events-none absolute -bottom-36 -right-28 h-[28rem] w-[28rem] rounded-full bg-cyan-100/60 blur-3xl" />
          <div className={`relative flex w-full items-center justify-center ${isOnboardingOpen ? 'max-w-sm' : 'max-w-6xl'} ${isOnboardingOpen ? 'flex-col' : 'flex-col gap-7 lg:flex-row lg:gap-12'}`}>
            <AnimatePresence mode="popLayout">{!isOnboardingOpen && <motion.section initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.35 }} className="max-w-sm text-center lg:text-left"><div className="mb-4 flex items-center justify-center gap-3 lg:justify-start"><span className="h-px w-9 bg-teal-500" /><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700">Health-aware planning</p></div><h1 className="text-3xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-4xl">A plan built around your health.</h1><p className="mt-4 text-sm leading-6 text-slate-500">Personalized meals and movement that take your health conditions, allergies, physical limitations, and dietary preferences into account.</p></motion.section>}</AnimatePresence>
            <section className={`w-full ${isOnboardingOpen ? 'max-w-[310px]' : 'max-w-[440px]'} flex-1`}>
              <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-6">{visuals.map((visual, index) => <motion.figure key={visual.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 + 0.12, duration: 0.45 }} className="min-w-0 text-center"><div className="mx-auto aspect-square max-w-[145px] overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-[0_14px_30px_rgba(15,23,42,0.10)] sm:max-w-[180px]"><img src={visual.src} alt={visual.label} className="h-full w-full object-cover" /></div><figcaption className="mt-2 text-[8px] font-bold uppercase tracking-[0.13em] text-slate-400 sm:text-[9px]">{visual.label}</figcaption></motion.figure>)}</div>
              <AnimatePresence>{!isOnboardingOpen && <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} type="button" onClick={openOnboarding} whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }} className="mx-auto mt-6 flex min-h-12 w-full max-w-xs items-center justify-center gap-3 rounded-2xl bg-teal-600 px-7 py-3 text-sm font-bold text-white shadow-[0_14px_28px_rgba(13,148,136,0.24)] transition hover:bg-teal-500"><Sparkles className="h-4 w-4" />Get Your Plan<ChevronRight className="h-4 w-4" /></motion.button>}</AnimatePresence>
            </section>
          </div>
        </motion.section>

        <AnimatePresence initial={false}>{isOnboardingOpen && <motion.section initial={{ opacity: 0, width: isWideLayout ? 0 : '100%' }} animate={{ opacity: 1, width: isWideLayout ? '50%' : '100%' }} exit={{ opacity: 0, width: isWideLayout ? 0 : '100%' }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className={`min-w-0 overflow-y-auto bg-slate-50 ${isWideLayout ? 'h-full shrink-0' : 'absolute inset-0 z-20 h-full'}`} role="dialog" aria-modal="true" aria-label="Health onboarding questionnaire">{onboardingPanel}</motion.section>}</AnimatePresence>
      </main>

      <AnimatePresence>{isGenerating && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 p-6 backdrop-blur-md"><motion.div initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-sm rounded-3xl border border-white/70 bg-white/90 p-8 text-center shadow-2xl"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1.15, repeat: Infinity, ease: 'linear' }} className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-4 border-teal-100 border-t-teal-600"><Sparkles className="h-4 w-4 text-teal-600" /></motion.div><h2 className="mt-5 text-xl font-bold text-slate-900">Making your personalized plan</h2><p className="mt-2 text-sm leading-6 text-slate-500">We’re tailoring meals and movement around the details you shared.</p></motion.div></motion.div>}</AnimatePresence>
    </div>
  );
}
