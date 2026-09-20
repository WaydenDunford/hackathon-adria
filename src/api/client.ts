import type { DailyCheckIn, HealthProfileState, Meal, WorkoutDay } from '../types';

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  read_at: string | null;
}
export interface Safeguards {
  mealCount: number;
  exerciseCount: number;
  allergies: string[];
  preferences: string[];
  modifiedExercises: { original: string; modified: string; reason: string; impact: string; category: string }[];
}
export interface DashboardData {
  user: { id: number; name: string; username: string; plan: Plan; age: number; onboarded_at: string | null; language: string; theme: 'light' | 'night' };
  healthProfile: HealthProfileState;
  weeklyMeals: Record<string, Meal[]>;
  workouts: WorkoutDay[];
  dailyCheckIn: DailyCheckIn | null;
  notifications: AppNotification[];
  safeguards: Safeguards;
  summary: { averageCalories: number; averageProtein: number; mealCount: number; workoutCount: number };
}
export interface Plan {
  id: number;
  code: 'basic' | 'plus' | 'premium';
  name: string;
  level: 0 | 1 | 2;
  features: Record<string, { allowed: boolean; limit: number | null }>;
}
export type RecipeOption = Meal & { recipeId: number; desc: string };

const baseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
let csrfToken = '';
export interface AuthSession {
  user: { id: number; name: string; username: string; plan: Plan; onboarded_at: string | null } | null;
  csrfToken: string;
  demoUsers: { name: string; email: string }[];
}
export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function api<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  let response: Response;
  try {
    if (method !== 'GET' && !csrfToken) await api<AuthSession>('/auth/session');
    response = await fetch(baseUrl + path, {
      method,
      credentials: 'same-origin',
      headers: { Accept: 'application/json', 'X-CSRF-TOKEN': csrfToken, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new Error('Unable to reach Favia Health. Please check the connection and try again.');
  }
  const json = await response.json().catch(() => undefined);
  if (!response.ok) {
    const messages = json?.errors ? Object.values(json.errors).flat().join(' ') : null;
    if (response.status === 419) csrfToken = '';
    if (response.status === 401) window.dispatchEvent(new Event('favia:unauthenticated'));
    throw new ApiError(messages || (response.status === 419 ? 'Your session expired. Please try again.' : response.status < 500 ? json?.message : null) || 'Unable to load or save your plan. Please try again.', response.status);
  }
  if (json === undefined && response.status !== 204) throw new Error('The API returned an unexpected response.');
  if (json?.csrfToken) csrfToken = json.csrfToken;
  return json as T;
}
