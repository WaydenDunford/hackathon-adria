import { useEffect, useState } from 'react';
import { Check, ChevronRight, HeartPulse, Pencil, ShieldCheck, Sparkles } from 'lucide-react';
import { DailyCheckIn } from '../types';

interface DailyCheckInCardProps {
  checkIn: DailyCheckIn | null;
  onSave: (draft: Omit<DailyCheckIn, 'date' | 'completedAt' | 'planAdjusted' | 'adjustmentSummary'>) => void;
  onViewPlan: () => void;
}

type CheckInDraft = Omit<DailyCheckIn, 'date' | 'completedAt' | 'planAdjusted' | 'adjustmentSummary'>;

const adjustmentStages = [
  'Reviewing how you feel today…',
  'Adjusting your plan to your current mood…',
  'Checking your movement and recovery needs…',
  'Finalizing today’s personalized plan…',
];

export function DailyCheckInCard({ checkIn, onSave, onViewPlan }: DailyCheckInCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState('');
  const [pendingAdjustment, setPendingAdjustment] = useState<CheckInDraft | null>(null);
  const [adjustmentStage, setAdjustmentStage] = useState(0);

  useEffect(() => {
    if (!pendingAdjustment) return;
    setAdjustmentStage(0);
    const stageTimers = adjustmentStages.slice(1).map((_, index) => window.setTimeout(() => setAdjustmentStage(index + 1), (index + 1) * 1100));
    const completeTimer = window.setTimeout(() => {
      onSave(pendingAdjustment);
      setPendingAdjustment(null);
      setNote('');
      setIsOpen(false);
    }, 4700);
    return () => {
      stageTimers.forEach(window.clearTimeout);
      window.clearTimeout(completeTimer);
    };
  }, [onSave, pendingAdjustment]);

  const saveFine = () => {
    onSave({ energy: 'same', pain: 'none', affectedAreas: [], recovery: 'okay', note: '' });
    setIsOpen(false);
  };

  const saveAdjustment = () => {
    const response = note.trim();
    const mentionsBack = /\b(back|lumbar|spine)\b/i.test(response);
    const mentionsRecovery = /\b(recovery|sore|sleep|restless)\b/i.test(response);
    setPendingAdjustment({
      energy: 'lower',
      pain: mentionsBack ? 'moderate' : 'none',
      affectedAreas: mentionsBack ? ['Lower back'] : [],
      recovery: mentionsRecovery ? 'poor' : 'okay',
      note: response,
    });
  };

  if (pendingAdjustment) {
    return <section className="min-h-[365px] rounded-3xl border border-teal-200 bg-white p-5 shadow-xs sm:p-6" aria-live="polite" aria-label="Adjusting your plan">
      <div className="flex min-h-[325px] flex-col items-center justify-center text-center sm:min-h-[317px]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700"><Sparkles className="h-6 w-6 animate-pulse" /></div>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Personalizing your plan</p>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">{adjustmentStages[adjustmentStage]}</h2>
        <p className="mt-2 text-sm text-slate-500">Applying your check-in to today’s recommendations.</p>
        <div className="mt-5 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-teal-100"><div className="h-full rounded-full bg-teal-600 transition-all duration-500" style={{ width: `${((adjustmentStage + 1) / adjustmentStages.length) * 100}%` }} /></div>
      </div>
    </section>;
  }

  if (checkIn && !isOpen) {
    return <section className="rounded-3xl border border-teal-200 bg-white p-5 shadow-xs sm:p-6" aria-label="Today's check-in">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700"><Check className="h-4 w-4" />Today’s check-in</div><h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">{checkIn.planAdjusted ? 'Today’s plan was adjusted' : 'Plan unchanged'}</h2><p className="mt-1 text-sm text-slate-500">{checkIn.planAdjusted ? `${checkIn.adjustmentSummary.length} targeted changes were made at ${checkIn.completedAt}.` : 'Today’s plan still matches how you feel.'}</p></div><button type="button" onClick={() => setIsOpen(true)} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-teal-300 hover:text-teal-700"><Pencil className="h-3.5 w-3.5" />Update check-in</button></div>
      {checkIn.note && <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">“{checkIn.note}”</p>}
      {checkIn.planAdjusted && <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-900"><Sparkles className="h-4 w-4 text-emerald-600" />What changed today</div><ul className="mt-2 space-y-1.5 text-sm text-emerald-950">{checkIn.adjustmentSummary.map((item) => <li key={item} className="flex gap-2"><span className="text-emerald-600">•</span>{item}</li>)}</ul><button type="button" onClick={onViewPlan} className="mt-3 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-teal-700 hover:text-teal-900">View adjusted plan <ChevronRight className="h-3.5 w-3.5" /></button></div>}
    </section>;
  }

  return <section className="min-h-[365px] rounded-3xl border border-teal-200 bg-white p-5 shadow-xs sm:p-6" aria-label="Daily plan check-in">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700"><HeartPulse className="h-4 w-4" />Today’s adapted plan</div><h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">How are you feeling today?</h2><p className="mt-1 text-sm text-slate-500">Share what changed, and Favia will adjust the relevant parts of your plan.</p></div>{checkIn && <button type="button" onClick={() => setIsOpen(false)} className="cursor-pointer text-xs font-bold text-slate-500 hover:text-slate-800">Cancel</button>}</div>
    <div className="mt-6 border-t border-slate-100 pt-5"><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} aria-label="How are you feeling today?" placeholder="Tell us how you are feeling today so I can adjust your plan." className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3.5 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15" /><div className="mt-4 flex w-full flex-col-reverse gap-3 sm:flex-row"><button type="button" onClick={saveFine} className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50"><Check className="h-4 w-4 text-teal-600" />I’m feeling fine</button><button type="button" onClick={saveAdjustment} disabled={!note.trim()} className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"><ShieldCheck className="h-4 w-4" />Adjust Today’s Plan</button></div><p className="mt-4 text-center text-[11px] leading-relaxed text-slate-400">This updates supported meal and activity recommendations; it does not diagnose or provide medical clearance.</p></div>
  </section>;
}
