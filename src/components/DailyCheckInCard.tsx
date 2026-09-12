import { useState } from 'react';
import { Activity, Check, ChevronDown, ChevronUp, HeartPulse, Pencil, ShieldCheck, Sparkles } from 'lucide-react';
import { DailyCheckIn, DailyEnergy, DailyPain, DailyRecovery } from '../types';

interface DailyCheckInCardProps {
  checkIn: DailyCheckIn | null;
  onSave: (draft: Omit<DailyCheckIn, 'date' | 'completedAt' | 'planAdjusted' | 'adjustmentSummary'>) => void;
  onViewPlan: () => void;
}

const energyOptions: { value: DailyEnergy; label: string }[] = [
  { value: 'lower', label: 'Lower than usual' },
  { value: 'same', label: 'About the same' },
  { value: 'higher', label: 'Higher than usual' },
];
const painOptions: { value: DailyPain; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'mild', label: 'Mild' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'significant', label: 'Significant' },
];
const recoveryOptions: { value: DailyRecovery; label: string }[] = [
  { value: 'poor', label: 'Poorly recovered' },
  { value: 'okay', label: 'Okay' },
  { value: 'well', label: 'Well recovered' },
];
const areas = ['Lower back', 'Knee', 'Shoulder', 'Hip', 'Other'];

const displayEnergy = (energy: DailyEnergy) => energy === 'lower' ? 'Low' : energy === 'higher' ? 'Higher' : 'Usual';
const displayRecovery = (recovery: DailyRecovery) => recovery === 'poor' ? 'Poor' : recovery === 'well' ? 'Well recovered' : 'Okay';

function OptionRow<T extends string>({
  options, value, onChange,
}: { options: { value: T; label: string }[]; value: T; onChange: (value: T) => void }) {
  return <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">{options.map((option) => <button key={option.value} type="button" onClick={() => onChange(option.value)} aria-pressed={value === option.value} className={`flex min-h-11 items-center justify-between rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition-all ${value === option.value ? 'border-teal-500 bg-teal-50 text-teal-900 ring-2 ring-teal-500/15' : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300'}`}><span>{option.label}</span>{value === option.value && <Check className="h-4 w-4 text-teal-600" />}</button>)}</div>;
}

export function DailyCheckInCard({ checkIn, onSave, onViewPlan }: DailyCheckInCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [energy, setEnergy] = useState<DailyEnergy>('same');
  const [pain, setPain] = useState<DailyPain>('none');
  const [affectedAreas, setAffectedAreas] = useState<string[]>([]);
  const [recovery, setRecovery] = useState<DailyRecovery>('okay');
  const [note, setNote] = useState('');

  const saveUnchanged = () => onSave({ energy: 'same', pain: 'none', affectedAreas: [], recovery: 'okay', note: '' });
  const toggleArea = (area: string) => setAffectedAreas((current) => current.includes(area) ? current.filter((item) => item !== area) : [...current, area]);
  const saveAdjustment = () => {
    onSave({ energy, pain, affectedAreas: pain === 'none' ? [] : affectedAreas, recovery, note: note.trim() });
    setIsOpen(false);
  };

  if (checkIn && !isOpen) {
    return <section className="rounded-3xl border border-teal-200 bg-white p-5 shadow-xs sm:p-6" aria-label="Today's check-in">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700"><Check className="h-4 w-4" />Today’s check-in</div><h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">{checkIn.planAdjusted ? 'Today’s plan was adjusted' : 'Plan unchanged'}</h2><p className="mt-1 text-sm text-slate-500">{checkIn.planAdjusted ? `${checkIn.adjustmentSummary.length} targeted changes were made at ${checkIn.completedAt}.` : 'Today’s plan still matches your current state.'}</p></div><button type="button" onClick={() => setIsOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-teal-300 hover:text-teal-700"><Pencil className="h-3.5 w-3.5" />Update check-in</button></div>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4"><div className="rounded-xl bg-slate-50 p-3"><span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Energy</span><strong className="mt-1 block text-sm text-slate-800">{displayEnergy(checkIn.energy)}</strong></div><div className="rounded-xl bg-slate-50 p-3"><span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Discomfort</span><strong className="mt-1 block text-sm capitalize text-slate-800">{checkIn.pain}</strong></div><div className="rounded-xl bg-slate-50 p-3"><span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Recovery</span><strong className="mt-1 block text-sm text-slate-800">{displayRecovery(checkIn.recovery)}</strong></div><div className="rounded-xl bg-slate-50 p-3"><span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Areas</span><strong className="mt-1 block truncate text-sm text-slate-800">{checkIn.affectedAreas.length ? checkIn.affectedAreas.join(', ') : 'None'}</strong></div></div>
      {checkIn.planAdjusted && <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-900"><Sparkles className="h-4 w-4 text-amber-600" />What changed today</div><ul className="mt-2 space-y-1.5 text-sm text-amber-950">{checkIn.adjustmentSummary.map((item) => <li key={item} className="flex gap-2"><span className="text-amber-600">•</span>{item}</li>)}</ul><button type="button" onClick={onViewPlan} className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-teal-700 hover:text-teal-900">View adjusted plan <ChevronDown className="h-3.5 w-3.5" /></button></div>}
    </section>;
  }

  return <section className="rounded-3xl border border-teal-200 bg-white p-5 shadow-xs sm:p-6" aria-label="Daily plan check-in">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700"><HeartPulse className="h-4 w-4" />Today’s adapted plan</div><h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">How are you feeling today?</h2><p className="mt-1 text-sm text-slate-500">Tell us what changed, and we’ll adapt what matters.</p></div>{isOpen && <button type="button" onClick={() => setIsOpen(false)} className="text-xs font-bold text-slate-500 hover:text-slate-800">Cancel</button>}</div>
    {!isOpen ? <div className="mt-5 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={saveUnchanged} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50"><Check className="h-4 w-4 text-teal-600" />I feel the same</button><button type="button" onClick={() => setIsOpen(true)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-500"><Sparkles className="h-4 w-4" />Adjust my plan</button></div> : <div className="mt-6 space-y-6 border-t border-slate-100 pt-5 animate-fade-in"><div><h3 className="mb-3 text-sm font-bold text-slate-800">How is your energy today?</h3><OptionRow options={energyOptions} value={energy} onChange={setEnergy} /></div><div><h3 className="mb-3 text-sm font-bold text-slate-800">Any pain or discomfort today?</h3><OptionRow options={painOptions} value={pain} onChange={setPain} />{pain !== 'none' && <div className="mt-3 flex flex-wrap gap-2">{areas.map((area) => <button type="button" key={area} onClick={() => toggleArea(area)} className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${affectedAreas.includes(area) ? 'border-purple-400 bg-purple-50 text-purple-900' : 'border-slate-200 text-slate-600 hover:border-purple-300'}`}>{area}</button>)}</div>}</div><div><h3 className="mb-3 text-sm font-bold text-slate-800">How recovered do you feel today?</h3><OptionRow options={recoveryOptions} value={recovery} onChange={setRecovery} /></div><label className="block text-sm font-bold text-slate-800">Anything else we should know today?<textarea value={note} onChange={(event) => setNote(event.target.value)} rows={2} placeholder="e.g. my back feels tighter than usual" className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3.5 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15" /></label><button type="button" onClick={saveAdjustment} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-teal-500"><ShieldCheck className="h-4 w-4" />Adjust Today’s Plan</button><p className="text-center text-[11px] leading-relaxed text-slate-400">This updates supported meal and activity recommendations; it does not diagnose or provide medical clearance.</p></div>}
  </section>;
}
