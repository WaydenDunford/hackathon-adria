export type NavTab = 'dashboard' | 'meals' | 'workouts' | 'profile' | 'pricing' | 'settings';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type WorkoutDayId = 'workout-a' | 'workout-b' | 'workout-c';

export interface EvidenceCitation {
  id: string;
  title: string;
  recommendation: string;
  sources: {
    name: string;
    publication: string;
    year?: string;
    url?: string;
  }[];
  evidenceLevel: 'Strong' | 'Moderate' | 'Grade A Clinical';
  clinicalSummary: string;
}

export interface HealthRelevanceItem {
  condition: string;
  iconType: 't1d' | 'celiac' | 'allergy' | 'back' | 'general';
  explanation: string;
}

export interface Meal {
  recipeId?: number;
  imageUrl?: string;
  imageAlt?: string;
  ingredients?: { ingredient: string; amount: string }[];
  instructions?: string;
  id: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  name: string;
  subtitle: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredientsSummary: string;
  imageCategory: 'bowl' | 'salad' | 'plate' | 'smoothie' | 'soup';
  healthBadges: string[];
  healthRelevance: HealthRelevanceItem[];
  whyThisMeal: string;
  evidence: EvidenceCitation;
}

export interface Exercise {
  exerciseId?: number;
  imageUrl?: string;
  visual?: ExerciseInstructionVisual;
  instructions?: string;
  alternatives?: { id: number; name: string; status: string; desc: string; isCurrent: boolean }[];
  id: string;
  name: string;
  sets: number;
  reps: string;
  category: string;
  isModified: boolean;
  modificationLabel?: string;
  originalExerciseName?: string;
  adjustmentReason?: string;
  whyThisExercise: string;
  evidence: EvidenceCitation;
  t1dSafetyNote?: string;
  dailyAdjustmentReason?: string;
}

export type ExerciseVisualKind = 'squat' | 'row' | 'bench-press' | 'core' | 'shoulder-press' | 'hip-thrust' | 'pulldown' | 'carry' | 'push-up' | 'face-pull' | 'bird-dog';

export interface ExerciseInstructionVisual {
  startLabel: string;
  finishLabel: string;
  targetMuscles: string[];
  kind: ExerciseVisualKind;
}

export interface WorkoutDay {
  userWorkoutId?: number;
  scheduledDate?: string;
  id: WorkoutDayId;
  label: string;
  title: string;
  estimatedDuration: string;
  intensity: string;
  muscleGroups: string[];
  exercises: Exercise[];
}

export interface HealthProfileState {
  conditions: string[];
  allergies: string[];
  dietaryPreferences: string[];
  physicalLimitations: string[];
}

export type DailyEnergy = 'lower' | 'same' | 'higher';
export type DailyPain = 'none' | 'mild' | 'moderate' | 'significant';
export type DailyRecovery = 'poor' | 'okay' | 'well';

export interface DailyCheckIn {
  date: string;
  completedAt: string;
  energy: DailyEnergy;
  pain: DailyPain;
  affectedAreas: string[];
  recovery: DailyRecovery;
  note: string;
  planAdjusted: boolean;
  adjustmentSummary: string[];
}
