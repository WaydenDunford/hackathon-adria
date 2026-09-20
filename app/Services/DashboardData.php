<?php

namespace App\Services;

use App\Http\Resources\CheckInResource;
use App\Http\Resources\HealthProfileResource;
use App\Http\Resources\MealResource;
use App\Http\Resources\PlanResource;
use App\Http\Resources\WorkoutResource;
use App\Models\User;

class DashboardData
{
    public function __construct(private MealPlanService $plans) {}

    public function meals(User $user): array
    {
        $plan = $this->plans->current($user);

        return $plan->days()->with(['meals.recipe.ingredients', 'meals.recipe.evidence'])->orderBy('day_index')->get()
            ->mapWithKeys(fn ($day) => [$day->date->englishDayOfWeek => $day->meals->sortBy('sort_order')->map(fn ($meal) => (new MealResource($meal))->resolve())->values()->all()])->all();
    }

    public function workouts(User $user): array
    {
        $plan = $this->plans->current($user);

        return $user->workouts()->whereBetween('scheduled_date', [$plan->start_date, $plan->end_date])
            ->with(['workout.entries.exercise.evidence', 'workout.entries.exercise.alternatives.alternative'])
            ->orderBy('scheduled_date')->get()->map(fn ($w) => (new WorkoutResource($w))->resolve())->all();
    }

    public function forUser(User $user): array
    {
        $user->loadMissing('plan.features');
        $meals = $this->meals($user);
        $workouts = $this->workouts($user);
        $checkIn = $user->checkIns()->whereDate('date', today())->first();
        $allMeals = collect($meals)->flatten(1);
        $exercises = collect($workouts)->flatMap(fn ($w) => $w['exercises']);
        $modified = collect($workouts)->flatMap(fn ($w) => collect($w['exercises'])->filter(fn ($e) => $e['isModified'])->map(fn ($e) => [
            'original' => $e['originalExerciseName'], 'modified' => $e['name'],
            'reason' => $e['adjustmentReason'], 'impact' => $e['whyThisExercise'], 'category' => $w['label'],
        ]))->values()->all();

        return [
            'user' => [...$user->only(['id', 'name', 'username', 'age', 'email', 'language', 'theme', 'onboarded_at']), 'plan' => (new PlanResource($user->plan))->resolve()],
            'healthProfile' => (new HealthProfileResource($user->healthProfile))->resolve(),
            'weeklyMeals' => $meals, 'workouts' => $workouts,
            'dailyCheckIn' => $checkIn ? (new CheckInResource($checkIn))->resolve() : null,
            'today' => ['meals' => $meals[today()->englishDayOfWeek] ?? [], 'workout' => collect($workouts)->firstWhere('scheduledDate', today()->toDateString())],
            'summary' => ['averageCalories' => (int) round($allMeals->sum('calories') / max(1, count($meals))), 'averageProtein' => (int) round($allMeals->sum('protein') / max(1, count($meals))), 'mealCount' => $allMeals->count(), 'workoutCount' => count($workouts)],
            'safeguards' => ['mealCount' => $allMeals->count(), 'exerciseCount' => $exercises->count(), 'modifiedExercises' => $modified, 'allergies' => $user->healthProfile->allergies, 'preferences' => $user->healthProfile->dietary_preferences],
            'notifications' => $user->notifications()->latest()->get()->toArray(),
        ];
    }
}
