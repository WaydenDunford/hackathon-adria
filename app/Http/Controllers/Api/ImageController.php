<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Models\MealPlanMeal;
use App\Models\Recipe;
use App\Services\RecipeCompatibility;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    private function image(?string $path)
    {
        abort_unless($path && preg_match('~^/(meal-images|exercise-images)/[a-zA-Z0-9_-]+\.png$~', $path), 404);
        $file = resource_path('private-images'.$path);
        abort_unless(is_file($file), 404);

        return response()->file($file, ['Cache-Control' => 'private, no-store', 'X-Content-Type-Options' => 'nosniff']);
    }

    public function meal(Request $request, MealPlanMeal $meal)
    {
        abort_unless($meal->day->mealPlan->user_id === $request->user()->id, 404);

        return $this->image($meal->recipe->image_url);
    }

    public function recipe(Request $request, Recipe $recipe, RecipeCompatibility $filter)
    {
        abort_unless($filter->matches($recipe, $request->user()->healthProfile), 404);

        return $this->image($recipe->image_url);
    }

    public function exercise(Request $request, Exercise $exercise)
    {
        abort_unless($request->user()->workouts()->whereHas('workout.entries', fn ($q) => $q->where('exercise_id', $exercise->id))->exists(), 404);

        return $this->image($exercise->image_url);
    }
}
