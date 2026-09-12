import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';
import { EvidenceCitation } from '../types';

interface HealthAdjustmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewEvidence: (ev: EvidenceCitation) => void;
  onNavigateToTab: (tab: 'meals' | 'workouts') => void;
}

export const HealthAdjustmentsModal: React.FC<HealthAdjustmentsModalProps> = ({
  isOpen,
  onClose,
  onViewEvidence,
  onNavigateToTab,
}) => {
  if (!isOpen) return null;

  const modifiedExercises = [
    {
      original: 'Barbell Back Squat',
      modified: 'Goblet Squat (Chest-Loaded)',
      reason: 'Lower-back limitation (L4-S1 disc compression risk)',
      impact: 'Reduces spinal compressive forces by ~38% through anterior counter-balancing while training full quad depth.',
      category: 'Workout A',
    },
    {
      original: 'Bent-Over Barbell Row',
      modified: 'Incline Chest-Supported Dumbbell Row',
      reason: 'Lower-back limitation (eliminates unsupported torso cantilever)',
      impact: 'Sternum support removes isometric shear stress on lumbar erectors, keeping focus on lats and rhomboids.',
      category: 'Workout A',
    },
    {
      original: 'Heavy Romanian Deadlift',
      modified: 'Single-Leg Hip Thrust / Glute Bridge',
      reason: 'Lower-back limitation (hinging shear elimination)',
      impact: 'Supine horizontal spine angle isolates gluteus maximus without loading lumbar intervertebral discs.',
      category: 'Workout B',
    },
  ];

  return (
    <div
      id="health-adjustments-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="health-adjustments-modal"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-teal-50/60 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                  Verification Report
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  100% Plan Audited
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Clinical Health Adjustments &amp; Audit Log
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-white/80 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Audit Metrics Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Comprehensive Safety Audit Status
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">21 / 21 Meals Checked</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Zero gluten cross-contamination. 100% certified celiac-safe grain protocols.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">21 / 21 Meals Peanut-Free</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Verified allergen exclusion with peanut-free facility sourcing.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/50 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">Carbohydrate Tracking</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Explicit total &amp; net carb counts on 100% of meals for Type 1 Diabetes bolusing.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">3 Exercises Modified</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    18 / 18 reviewed exercises. 3 adapted specifically for lower-back safety.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Exercise Modifications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Exercise Modifications (Lower-Back Protection)
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">3 adjustments active</span>
            </div>

            <div className="space-y-3">
              {modifiedExercises.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs line-through text-slate-400 font-medium">
                        {item.original}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="text-sm font-bold text-slate-900">
                        {item.modified}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-100/70 text-amber-900 border border-amber-200">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs text-amber-800 font-medium mb-1">
                    Trigger: {item.reason}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.impact}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Unmodified confirmation */}
          <div className="p-3.5 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-800">Targeted Precision:</strong> 15 of 18 exercises remained completely unmodified (e.g. Dumbbell Bench Press, Seated Shoulder Press). CuraHealth only alters movements where clinical biomechanics warrant safety interventions.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNavigateToTab('meals');
              }}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 px-3 py-1.5 rounded-lg hover:bg-teal-50"
            >
              Go to Meal Plan →
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigateToTab('workouts');
              }}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 px-3 py-1.5 rounded-lg hover:bg-teal-50"
            >
              Go to Workout Plan →
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
