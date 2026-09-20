<?php

namespace Database\Seeders;

use App\Models\Feature;
use App\Models\Plan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = collect([
            ['code' => Plan::BASIC, 'name' => 'Basic', 'level' => 0],
            ['code' => Plan::PLUS, 'name' => 'Plus', 'level' => 1],
            ['code' => Plan::PREMIUM, 'name' => 'Premium', 'level' => 2],
        ])->mapWithKeys(fn (array $attributes) => [$attributes['code'] => Plan::updateOrCreate(['code' => $attributes['code']], [...$attributes, 'is_active' => true])]);

        $features = collect([
            ['code' => 'dashboard', 'name' => 'Dashboard'],
            ['code' => 'health_profile', 'name' => 'Health profile'],
            ['code' => 'meal_plan', 'name' => 'Meal plan'],
            ['code' => 'meal_swaps', 'name' => 'Meal swaps'],
            ['code' => 'snack_addition', 'name' => 'Snack addition'],
            ['code' => 'recipe_details', 'name' => 'Recipe details'],
            ['code' => 'workout_plan', 'name' => 'Workout plan'],
            ['code' => 'exercise_alternatives', 'name' => 'Exercise alternatives'],
            ['code' => 'daily_check_in', 'name' => 'Daily check-in'],
            ['code' => 'notifications', 'name' => 'Notifications'],
            ['code' => 'evidence', 'name' => 'Evidence and citations'],
            ['code' => 'preferences', 'name' => 'Preferences'],
        ])->map(fn (array $attributes) => Feature::updateOrCreate(['code' => $attributes['code']], $attributes));

        foreach ($plans as $plan) {
            foreach ($features as $feature) {
                DB::table('feature_plan')->insertOrIgnore([
                    'plan_id' => $plan->id,
                    'feature_id' => $feature->id,
                    'is_allowed' => true,
                    'limit' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
