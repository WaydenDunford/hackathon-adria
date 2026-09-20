<?php

namespace App\Services;

use App\Models\MealPlan;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class MealPlanService
{
    public function __construct(private RecipeCompatibility $compatibility) {}

    public function current(User $user): MealPlan
    {
        return $user->mealPlans()->where('status', 'active')->latest('start_date')->firstOrFail();
    }

    /** Called inside a transaction; compatible swaps/snacks survive profile edits. */
    public function reconcile(User $user): void
    {
        $profile = $user->healthProfile()->firstOrFail();
        $plan = $this->current($user);
        $days = $plan->days()->with('meals.recipe')->get();
        foreach ($days as $day) {
            foreach ($day->meals as $meal) {
                if ($this->compatibility->matches($meal->recipe, $profile)) {
                    continue;
                }
                $replacement = $this->compatibility->options($meal->meal_type, $profile)->first();
                if (! $replacement) {
                    throw ValidationException::withMessages([
                        'allergies' => 'The demo recipe library has no compatible '.$meal->meal_type.' for these restrictions. Your previous profile and plan have been kept.',
                    ]);
                }
                $meal->update(['recipe_id' => $replacement->id]);
            }
        }
    }
}
