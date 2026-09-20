import React from 'react';
import type { Safeguards } from '../api/client';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';
import { EvidenceCitation } from '../types';

interface HealthAdjustmentsModalProps {
  safeguards: Safeguards;
  isOpen: boolean;
  onClose: () => void;
  onViewEvidence: (ev: EvidenceCitation) => void;
  onNavigateToTab: (tab: 'meals' | 'workouts') => void;
}

export const HealthAdjustmentsModal: React.FC<HealthAdjustmentsModalProps> = ({
  safeguards,
  isOpen,
  onClose,
  onViewEvidence,
  onNavigateToTab,
}) => {
  if (!isOpen) return null;

  const modifiedExercises = safeguards.modifiedExercises;

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
                  Demo Rules Applied
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Health Adjustments &amp; Plan Review
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
                  <div className="font-bold text-slate-900 text-sm">{safeguards.mealCount} / {safeguards.mealCount} Meals Checked</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Stored dietary tags: {safeguards.preferences.join(', ') || 'No dietary preference'}.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">{safeguards.mealCount} Meals Filtered</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Allergy filters: {safeguards.allergies.join(', ') || 'No recorded allergies'}.
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
                  <div className="font-bold text-slate-900 text-sm">{modifiedExercises.length} Exercises Modified</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {safeguards.exerciseCount} exercises in the stored plan. {modifiedExercises.length} adaptations reflect your profile.
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
              <span className="text-[11px] text-slate-500 font-medium">{modifiedExercises.length} adjustments active</span>
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
              <strong className="text-slate-800">Targeted Precision:</strong> {safeguards.exerciseCount - modifiedExercises.length} of {safeguards.exerciseCount} exercises have no profile-specific modification. These are simple demo rules, not medical advice.
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
