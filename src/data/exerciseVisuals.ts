import { ExerciseInstructionVisual } from '../types';

export const exerciseVisuals: Record<string, ExerciseInstructionVisual> = {
  'ex-a1': { kind: 'squat', startLabel: 'Stand tall', finishLabel: 'Sit back & down', targetMuscles: ['Quads', 'Glutes', 'Core'] },
  'ex-a2': { kind: 'row', startLabel: 'Arms long', finishLabel: 'Pull to ribs', targetMuscles: ['Lats', 'Rhomboids', 'Biceps'] },
  'ex-a3': { kind: 'bench-press', startLabel: 'Arms extended', finishLabel: 'Lower with control', targetMuscles: ['Chest', 'Triceps', 'Front delts'] },
  'ex-a4': { kind: 'core', startLabel: 'Hands at chest', finishLabel: 'Press & resist', targetMuscles: ['Obliques', 'Deep core'] },
  'ex-a5': { kind: 'shoulder-press', startLabel: 'Weights at shoulders', finishLabel: 'Press overhead', targetMuscles: ['Deltoids', 'Triceps'] },
  'ex-b1': { kind: 'hip-thrust', startLabel: 'Hips lowered', finishLabel: 'Drive hips up', targetMuscles: ['Glutes', 'Hamstrings'] },
  'ex-b2': { kind: 'pulldown', startLabel: 'Arms overhead', finishLabel: 'Pull to chest', targetMuscles: ['Lats', 'Upper back'] },
  'ex-b3': { kind: 'carry', startLabel: 'Stand braced', finishLabel: 'Walk tall', targetMuscles: ['Grip', 'Core', 'Traps'] },
  'ex-b4': { kind: 'core', startLabel: 'Back flat', finishLabel: 'Extend opposite limbs', targetMuscles: ['Deep core', 'Hip flexors'] },
  'ex-c1': { kind: 'push-up', startLabel: 'Arms extended', finishLabel: 'Lower to bench', targetMuscles: ['Chest', 'Triceps', 'Core'] },
  'ex-c2': { kind: 'row', startLabel: 'Arms long', finishLabel: 'Pull to torso', targetMuscles: ['Mid-traps', 'Rhomboids'] },
  'ex-c3': { kind: 'face-pull', startLabel: 'Arms long', finishLabel: 'Pull toward face', targetMuscles: ['Rear delts', 'Rotator cuff'] },
  'ex-c4': { kind: 'bird-dog', startLabel: 'Hands & knees', finishLabel: 'Reach long', targetMuscles: ['Glutes', 'Spinal stabilizers', 'Core'] },
};
