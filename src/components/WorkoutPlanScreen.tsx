import React, { useState } from 'react';
import { WorkoutDay, WorkoutDayId, Exercise, EvidenceCitation } from '../types';
import { exerciseVisuals } from '../data/exerciseVisuals';
import { ExerciseInstructionVisual } from './ExerciseInstructionVisual';
import {
  Dumbbell,
  Clock,
  Layers,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  Activity,
  Award,
  Sparkles
} from 'lucide-react';

interface WorkoutPlanScreenProps {
  workouts: WorkoutDay[];
  selectedWorkoutId: WorkoutDayId;
  onSelectWorkout: (id: WorkoutDayId) => void;
  onOpenEvidence: (evidence: EvidenceCitation) => void;
  onOpenExerciseAlternative: (exercise: Exercise, workoutTitle: string) => void;
}

export const WorkoutPlanScreen: React.FC<WorkoutPlanScreenProps> = ({
  workouts,
  selectedWorkoutId,
  onSelectWorkout,
  onOpenEvidence,
  onOpenExerciseAlternative,
}) => {
  const currentWorkout =
    workouts.find((w) => w.id === selectedWorkoutId) || workouts[0];

  // Track expanded "Why this exercise?"
  const [expandedWhyIds, setExpandedWhyIds] = useState<Record<string, boolean>>({
    'ex-a1': true,
  });

  const toggleWhy = (id: string) => {
    setExpandedWhyIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Biomechanically Adapted Workout Plan
          </h1>
        </div>

        {/* Safety Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 text-xs font-semibold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>Lower-Back Protection Active</span>
        </div>
      </div>

      {/* Workout Selector Tabs (Workout A, Workout B, Workout C) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {workouts.map((workout) => {
          const isSelected = selectedWorkoutId === workout.id;
          const modifiedCount = workout.exercises.filter((e) => e.isModified).length;

          return (
            <button
              key={workout.id}
              id={`workout-tab-${workout.id}`}
              onClick={() => onSelectWorkout(workout.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-white border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {workout.label}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {workout.estimatedDuration}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                {workout.title}
              </h3>

              <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
                <span className="text-amber-700 font-semibold">
                  {modifiedCount} adapted {modifiedCount === 1 ? 'exercise' : 'exercises'}
                </span>
                <span>•</span>
                <span>{workout.exercises.length} total</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Workout Header Card */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
              <span>{currentWorkout.label} Overview</span>
              <span>•</span>
              <span>{currentWorkout.estimatedDuration}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {currentWorkout.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Muscle Target:
            </span>
            {currentWorkout.muscleGroups.map((muscle, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Prescribed Movement Sequence ({currentWorkout.exercises.length} Exercises)
          </h3>
          <span className="text-xs text-slate-500">
            Click on any exercise to view evidence or alternatives
          </span>
        </div>

        {currentWorkout.exercises.map((exercise) => {
          const isWhyExpanded = !!expandedWhyIds[exercise.id];
          const exerciseVisual = exerciseVisuals[exercise.id];

          return (
            <div
              key={exercise.id}
              id={`exercise-card-${exercise.id}`}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                exercise.isModified
                  ? 'border-amber-200/90 hover:border-amber-400'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-5">
                {/* Exercise Info & Graphic */}
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  {/* Icon Placeholder */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                      exercise.isModified
                        ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                        : 'bg-teal-50 text-teal-700 border-teal-200/80'
                    }`}
                  >
                    <Dumbbell className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="text-base font-bold text-slate-900">
                        {exercise.name}
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-800">
                        {exercise.sets} sets × {exercise.reps}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 font-medium mb-2">
                      Target: {exercise.category}
                    </div>

                    {/* Condition Callout */}
                    {exercise.isModified ? (
                      <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-950 space-y-1 mb-2">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Adjusted for your health — Lower-back consideration</span>
                        </div>
                        <p className="leading-relaxed">
                          {exercise.adjustmentReason}
                        </p>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-slate-800">
                          No health-specific modification required
                        </span>
                        <span className="text-slate-500 hidden sm:inline">
                          — Safe under neutral spinal alignment
                        </span>
                      </div>
                    )}

                    {/* T1D Safety Note if present */}
                    {exercise.t1dSafetyNote && (
                      <div className="flex items-start gap-1.5 text-[11px] text-teal-800 bg-teal-50/60 p-2 rounded-lg border border-teal-100 mb-2">
                        <Activity className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>Type 1 Diabetes note:</strong> {exercise.t1dSafetyNote}
                        </span>
                      </div>
                    )}

                    {exercise.dailyAdjustmentReason && (
                      <div className="flex items-start gap-1.5 text-[11px] text-purple-900 bg-purple-50 p-2 rounded-lg border border-purple-200 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                        <span><strong>Today’s adjustment:</strong> {exercise.dailyAdjustmentReason}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Instructional visual and actions */}
                <div className="w-full shrink-0 space-y-2 xl:w-72">
                  {exerciseVisual && <ExerciseInstructionVisual visual={exerciseVisual} />}
                  <div className="flex gap-2 border-t border-slate-100 pt-3 xl:border-t-0 xl:pt-0">
                    <button
                      id={`view-alt-btn-${exercise.id}`}
                      onClick={() => onOpenExerciseAlternative(exercise, currentWorkout.title)}
                      className="flex-1 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors text-center"
                    >
                      View alternative
                    </button>

                    <button
                      id={`exercise-evidence-btn-${exercise.id}`}
                      onClick={() => onOpenEvidence(exercise.evidence)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100/80 rounded-lg border border-teal-200/60 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Evidence</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable "Why this exercise?" */}
              <div className="border-t border-slate-100 mt-3 pt-3">
                <button
                  id={`why-exercise-toggle-${exercise.id}`}
                  onClick={() => toggleWhy(exercise.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Why this exercise?</span>
                  {isWhyExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>

                {isWhyExpanded && (
                  <div className="mt-2 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60 leading-relaxed animate-fade-in">
                    {exercise.whyThisExercise}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
