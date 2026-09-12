import React from 'react';
import type { ExerciseInstructionVisual as ExerciseInstructionVisualData, ExerciseVisualKind } from '../types';

interface ExerciseInstructionVisualProps {
  visual: ExerciseInstructionVisualData;
}

const poseTransforms: Record<ExerciseVisualKind, [string, string]> = {
  squat: ['translate(0 0)', 'translate(0 12) rotate(-8 50 62)'],
  row: ['translate(0 0) rotate(8 50 56)', 'translate(0 0) rotate(8 50 56)'],
  'bench-press': ['translate(0 15) rotate(-90 50 56)', 'translate(0 15) rotate(-90 50 56)'],
  core: ['translate(0 0)', 'translate(0 0)'],
  'shoulder-press': ['translate(0 0)', 'translate(0 -4)'],
  'hip-thrust': ['translate(0 16) rotate(-90 50 58)', 'translate(0 4) rotate(-90 50 58)'],
  pulldown: ['translate(0 0)', 'translate(0 0)'],
  carry: ['translate(0 0)', 'translate(3 0)'],
  'push-up': ['translate(0 12) rotate(-58 50 58)', 'translate(0 19) rotate(-58 50 58)'],
  'face-pull': ['translate(0 0)', 'translate(0 0)'],
  'bird-dog': ['translate(0 17) rotate(-48 50 58)', 'translate(4 12) rotate(-48 50 58)'],
};

function PoseFigure({ kind, finish }: { kind: ExerciseVisualKind; finish: boolean }) {
  const [startTransform, finishTransform] = poseTransforms[kind];
  const highlightUpper = ['row', 'bench-press', 'shoulder-press', 'pulldown', 'face-pull', 'push-up'].includes(kind);
  const highlightLower = ['squat', 'hip-thrust', 'bird-dog'].includes(kind);
  const armEnd = finish ? (kind === 'shoulder-press' || kind === 'pulldown' ? 16 : 44) : 70;

  return <svg viewBox="0 0 100 116" role="img" aria-label={finish ? 'Finish position' : 'Start position'} className="h-24 w-full">
    <g transform={finish ? finishTransform : startTransform} stroke="#64748b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="50" cy="18" r="9" fill="#e2e8f0" strokeWidth="2" />
      <path d="M50 28 L50 62" />
      <path d={`M50 34 L29 ${armEnd}`} /><path d={`M50 34 L71 ${armEnd}`} />
      <path d="M50 62 L33 94" /><path d="M50 62 L67 94" />
      <path d="M42 40 L58 40 L61 61 L39 61 Z" fill="#e2e8f0" strokeWidth="2" />
      {highlightUpper && <><path d="M40 40 L29 52" stroke="#f97316" strokeWidth="7" /><path d="M60 40 L71 52" stroke="#f97316" strokeWidth="7" /><path d="M42 43 L58 43 L59 55 L41 55 Z" fill="#fb923c" stroke="#fb923c" /></>}
      {highlightLower && <><path d="M45 61 L34 82" stroke="#f97316" strokeWidth="8" /><path d="M55 61 L66 82" stroke="#f97316" strokeWidth="8" /><circle cx="43" cy="64" r="7" fill="#fb923c" stroke="#fb923c" /><circle cx="57" cy="64" r="7" fill="#fb923c" stroke="#fb923c" /></>}
      {kind === 'core' && <ellipse cx="50" cy="51" rx="11" ry="15" fill="#fb923c" stroke="#fb923c" />}
    </g>
    {finish && <><path d="M77 15 C90 28 90 47 79 58" fill="none" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" /><path d="M76 56 L79 61 L83 56" fill="none" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></>}
  </svg>;
}

export function ExerciseInstructionVisual({ visual }: ExerciseInstructionVisualProps) {
  return <aside className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-3 sm:p-4 xl:w-72 xl:shrink-0" aria-label="Exercise movement guide">
    <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
      <div className="rounded-xl bg-white px-2 pb-1 pt-2 text-center"><PoseFigure kind={visual.kind} finish={false} /><span className="block text-[10px] font-bold uppercase tracking-wide text-slate-500">Start</span><span className="mt-0.5 block text-[10px] text-slate-400">{visual.startLabel}</span></div>
      <div className="rounded-xl bg-white px-2 pb-1 pt-2 text-center"><PoseFigure kind={visual.kind} finish /><span className="block text-[10px] font-bold uppercase tracking-wide text-teal-700">Finish</span><span className="mt-0.5 block text-[10px] text-slate-400">{visual.finishLabel}</span></div>
    </div>
    <div className="mt-3"><span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Targets</span><div className="mt-1.5 flex flex-wrap gap-1.5">{visual.targetMuscles.map((muscle) => <span key={muscle} className="rounded-md bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-800 ring-1 ring-orange-200">{muscle}</span>)}</div></div>
  </aside>;
}
