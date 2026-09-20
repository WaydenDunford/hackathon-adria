<?php

namespace App\Services;

use App\Models\Plan;
use App\Models\Recipe;
use App\Models\User;
use App\Models\Workout;

class AccountSetup
{
    public function create(User $user): void
    {
        $user->plan()->associate(Plan::basic());
        $user->save();
        $user->healthProfile()->create(['conditions' => [], 'allergies' => [], 'dietary_preferences' => [], 'physical_limitations' => []]);
        $start = today()->startOfWeek();
        $plan = $user->mealPlans()->create(['start_date' => $start, 'end_date' => $start->copy()->addDays(6), 'status' => 'active']);
        for ($i = 0; $i < 7; $i++) {
            $day = $plan->days()->create(['day_index' => $i, 'date' => $start->copy()->addDays($i)]);
            foreach (['Breakfast', 'Lunch', 'Dinner', 'Snack'] as $order => $type) {
                $recipe = Recipe::where('meal_type', $type)->orderBy('id')->firstOrFail();
                $day->meals()->create(['recipe_id' => $recipe->id, 'meal_type' => $type, 'sort_order' => $order]);
            }
        }
        foreach (Workout::orderBy('id')->limit(3)->get() as $i => $workout) {
            $user->workouts()->create(['workout_id' => $workout->id, 'scheduled_date' => $start->copy()->addDays($i * 2)]);
        }
    }
}
