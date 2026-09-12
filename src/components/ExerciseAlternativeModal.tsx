import React from 'react';
import { Exercise, EvidenceCitation } from '../types';
import { X, ShieldCheck, Dumbbell, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ExerciseAlternativeModalProps {
  exercise: Exercise | null;
  workoutTitle: string;
  onClose: () => void;
  onViewEvidence: (ev: EvidenceCitation) => void;
  onSelectAlternative?: (newExerciseName: string, reason: string) => void;
}

export const ExerciseAlternativeModal: React.FC<ExerciseAlternativeModalProps> = ({
  exercise,
  workoutTitle,
  onClose,
  onViewEvidence,
}) => {
  if (!exercise) return null;

  // Curate alternatives based on exercise
  const alternativesList = exercise.isModified
    ? [
        {
          name: exercise.name,
          status: 'Currently Active (Safest for Lower Back)',
          desc: 'Primary clinical prescription with minimal axial compressive forces.',
          isCurrent: true,
        },
        {
          name: 'Belt Squat or Leg Press (Neutral Back Support)',
          status: 'Machine Alternative',
          desc: 'Removes spinal loading entirely by applying load through the hips or reclined sled.',
          isCurrent: false,
        },
        {
          name: 'Bodyweight Box Squat with Bands',
          status: 'Low-Load Mobility Option',
          desc: 'Useful for days with mild lower back soreness while maintaining knee and hip kinematics.',
          isCurrent: false,
        },
      ]
    : [
        {
          name: exercise.name,
          status: 'Currently Active',
          desc: 'Standard mechanical form without modification.',
          isCurrent: true,
        },
        {
          name: 'Cable or Resistance Band Variation',
          status: 'Joint-Friendly Alternative',
          desc: 'Provides continuous smooth tension profile.',
          isCurrent: false,
        },
      ];

  return (
    <div
      id="exercise-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="exercise-modal-content"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-700 shrink-0">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                Exercise Analysis • {workoutTitle}
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-0.5">
                {exercise.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg p-1.5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Health Status Callout */}
          {exercise.isModified ? (
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
              <div className="flex items-center gap-2 mb-1.5 text-amber-900 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Adjusted for Lower-Back Limitation</span>
              </div>
              <div className="text-xs text-amber-900/90 leading-relaxed">
                Replaced <span className="line-through text-amber-700">{exercise.originalExerciseName}</span> because of reported lower-back sensitivity.
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
              <div className="flex items-center gap-2 mb-1 text-emerald-900 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No Health-Specific Modification Required</span>
              </div>
              <p className="text-xs text-emerald-900/80 leading-relaxed">
                Biomechanical assessment indicates this movement creates negligible lumbar stress in this posture. Standard load progression is safe.
              </p>
            </div>
          )}

          {/* Why This Exercise */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Why this exercise was chosen
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              {exercise.whyThisExercise}
            </p>
          </div>

          {/* T1D Safety Note if applicable */}
          {exercise.t1dSafetyNote && (
            <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200/70">
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Type 1 Diabetes Guidance</span>
              </div>
              <p className="text-xs text-teal-800 leading-relaxed">
                {exercise.t1dSafetyNote}
              </p>
            </div>
          )}

          {/* Safe Alternatives */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Safe Vetted Alternatives
            </h4>
            <div className="space-y-2">
              {alternativesList.map((alt, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs ${
                    alt.isCurrent
                      ? 'border-teal-300 bg-teal-50/40'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{alt.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      alt.isCurrent ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {alt.status}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">{alt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onViewEvidence(exercise.evidence);
            }}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>View Medical Evidence</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
