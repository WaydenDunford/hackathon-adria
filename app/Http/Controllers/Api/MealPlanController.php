<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MealResource;
use App\Http\Resources\RecipeResource;
use App\Models\MealPlanMeal;
use App\Models\Recipe;
use App\Models\User;
use App\Services\DashboardData;
use App\Services\MealPlanService;
use App\Services\RecipeCompatibility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MealPlanController extends Controller
{
    public function index(User $user, DashboardData $data)
    {
        return response()->json($data->meals($user));
    }

    public function day(User $user, string $date, MealPlanService $plans)
    {
        validator(['date' => $date], ['date' => ['required', 'date_format:Y-m-d']])->validate();
        $day = $plans->current($user)->days()->whereDate('date', $date)->with(['meals.recipe.ingredients', 'meals.recipe.evidence'])->firstOrFail();

        return response()->json($day->meals->sortBy('sort_order')->map(fn ($m) => (new MealResource($m))->resolve())->values());
    }

    private function own(Request $request, MealPlanMeal $meal): void
    {
        abort_unless($meal->day->mealPlan->user_id === $request->user()->id, 404);
    }

    public function alternatives(Request $request, MealPlanMeal $meal, RecipeCompatibility $filter)
    {
        $this->own($request, $meal);

        return response()->json($filter->options($meal->meal_type, $request->user()->healthProfile)->map(fn ($r) => (new RecipeResource($r))->resolve())->values());
    }

    public function replace(Request $request, MealPlanMeal $meal, RecipeCompatibility $filter)
    {
        $this->own($request, $meal);
        $input = $request->validate(['recipeId' => ['required', 'integer', 'exists:recipes,id']]);
        $updated = DB::transaction(function () use ($request, $meal, $filter, $input) {
            $user = User::whereKey($request->user()->id)->lockForUpdate()->firstOrFail();
            $recipe = Recipe::with(['ingredients', 'evidence'])->findOrFail($input['recipeId']);
            if ($recipe->meal_type !== $meal->meal_type || ! $filter->matches($recipe, $user->healthProfile)) {
                throw ValidationException::withMessages(['recipeId' => 'Select a compatible recipe of the same meal type.']);
            }
            $meal->update(['recipe_id' => $recipe->id]);

            return (new MealResource($meal->fresh(['recipe.ingredients', 'recipe.evidence'])))->resolve();
        });

        return response()->json($updated);
    }

    public function snack(Request $request, User $user, MealPlanService $plans, RecipeCompatibility $filter)
    {
        $input = $request->validate(['day' => ['required', 'in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday'], 'recipeId' => ['nullable', 'integer', 'exists:recipes,id']]);
        $meal = DB::transaction(function () use ($user, $plans, $filter, $input) {
            $user->newQuery()->whereKey($user->id)->lockForUpdate()->firstOrFail();
            $dayIndex = array_search($input['day'], ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
            $day = $plans->current($user)->days()->where('day_index', $dayIndex)->lockForUpdate()->firstOrFail();
            $options = $filter->options('Snack', $user->fresh()->healthProfile);
            $recipe = isset($input['recipeId']) ? $options->firstWhere('id', $input['recipeId']) : $options->first();
            if (! $recipe) {
                throw ValidationException::withMessages(['recipeId' => 'No compatible seeded snack is available.']);
            }

            return $day->meals()->create(['recipe_id' => $recipe->id, 'meal_type' => 'Snack', 'sort_order' => ((int) $day->meals()->max('sort_order')) + 1]);
        });

        return response()->json((new MealResource($meal->load(['recipe.ingredients', 'recipe.evidence'])))->resolve(), 201);
    }

    public function reorder(Request $request, User $user, MealPlanService $plans)
    {
        $input = $request->validate([
            'day' => ['required', 'in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday'],
            'mealIds' => ['required', 'array', 'min:1'],
            'mealIds.*' => ['required', 'integer', 'distinct'],
        ]);

        $meals = DB::transaction(function () use ($input, $user, $plans) {
            $user->newQuery()->whereKey($user->id)->lockForUpdate()->firstOrFail();
            $dayIndex = array_search($input['day'], ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
            $day = $plans->current($user)->days()->where('day_index', $dayIndex)->lockForUpdate()->firstOrFail();
            $mealsById = $day->meals()->lockForUpdate()->get()->keyBy('id');
            $expectedIds = $mealsById->keys()->sort()->values()->all();
            $receivedIds = collect($input['mealIds'])->map(fn ($id) => (int) $id)->sort()->values()->all();

            if ($receivedIds !== $expectedIds) {
                throw ValidationException::withMessages(['mealIds' => 'Use every meal in the selected day exactly once.']);
            }

            foreach ($mealsById as $meal) {
                $meal->update(['sort_order' => -$meal->id]);
            }
            foreach ($input['mealIds'] as $position => $id) {
                $mealsById[(int) $id]->update(['sort_order' => $position]);
            }

            return $day->meals()->with(['recipe.ingredients', 'recipe.evidence'])->orderBy('sort_order')->get();
        });

        return response()->json($meals->map(fn ($meal) => (new MealResource($meal))->resolve())->values());
    }

    public function recipe(Request $request, Recipe $recipe, RecipeCompatibility $filter)
    {
        abort_unless($filter->matches($recipe, $request->user()->healthProfile), 404);

        return response()->json((new RecipeResource($recipe->load(['ingredients', 'evidence'])))->resolve());
    }
}
