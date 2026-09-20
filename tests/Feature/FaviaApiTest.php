<?php

namespace Tests\Feature;

use App\Models\DailyCheckIn;
use App\Models\MealPlanMeal;
use App\Models\Recipe;
use App\Models\User;
use App\Models\WorkoutExercise;
use Database\Seeders\FaviaSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FaviaApiTest extends TestCase
{
    use RefreshDatabase;

    private User $demo;

    private string $url;

    protected function setUp(): void
    {
        parent::setUp();
        config(['favia.demo_enabled' => true]);
        $this->seed(FaviaSeeder::class);
        $this->demo = User::where('email', config('favia.demo_email'))->firstOrFail();
        $this->actingAs($this->demo);
        $this->url = '/api/users/'.$this->demo->id;
    }

    private function profile(array $changes = []): array
    {
        return [...['conditions' => ['Type 1 Diabetes', 'Celiac Disease', 'Lower-Back Problems'], 'allergies' => ['Peanuts'], 'dietaryPreferences' => ['Gluten-Free'], 'physicalLimitations' => ['Lower back']], ...$changes];
    }

    public function test_profile_onboarding_and_settings_are_persisted(): void
    {
        $this->getJson($this->url.'/health-profile')->assertOk()->assertJsonPath('allergies.0', 'Peanuts');
        $this->putJson($this->url.'/onboarding', ['name' => 'Mina', 'age' => 29, ...$this->profile()])->assertOk()->assertJsonPath('user.name', 'Mina');
        $this->assertDatabaseHas('users', ['id' => $this->demo->id, 'name' => 'Mina', 'age' => 29]);
        $this->assertNotNull($this->demo->fresh()->onboarded_at);
        $this->putJson($this->url.'/settings', ['theme' => 'night', 'language' => 'BS'])->assertOk();
        $this->getJson($this->url.'/dashboard')->assertOk()->assertJsonPath('user.theme', 'night')->assertJsonPath('user.language', 'BS');
        $this->putJson($this->url.'/settings', ['theme' => 'invalid'])->assertUnprocessable();
        $this->putJson($this->url.'/health-profile', ['conditions' => 'bad'])->assertUnprocessable();
    }

    public function test_all_seven_days_have_recipes_ingredients_and_images(): void
    {
        $plan = $this->getJson($this->url.'/meal-plan')->assertOk()->json();
        $this->assertCount(7, $plan);
        foreach ($plan as $meals) {
            $this->assertCount(4, $meals);
            foreach ($meals as $meal) {
                $this->assertNotEmpty($meal['ingredients']);
                $this->assertNotEmpty($meal['imageUrl']);
                $this->getJson('/api/recipes/'.$meal['recipeId'])->assertOk()->assertJsonPath('name', $meal['name']);
            }
        }
        $date = $this->demo->mealPlans()->first()->start_date->toDateString();
        $this->getJson($this->url.'/meal-plan/'.$date)->assertOk()->assertJsonCount(4);
        $this->getJson($this->url.'/meal-plan/invalid')->assertUnprocessable();
    }

    public function test_replacement_persists_complete_recipe_and_rejects_wrong_type(): void
    {
        $meal = MealPlanMeal::first();
        $options = $this->getJson('/api/user-meals/'.$meal->id.'/alternatives')->assertOk()->json();
        $option = collect($options)->first(fn ($r) => $r['recipeId'] !== $meal->recipe_id);
        $this->postJson('/api/user-meals/'.$meal->id.'/replace', ['recipeId' => $option['recipeId']])->assertOk()->assertJsonPath('name', $option['name']);
        $this->assertDatabaseHas('meal_plan_meals', ['id' => $meal->id, 'recipe_id' => $option['recipeId']]);
        $this->getJson($this->url.'/meal-plan')->assertJsonPath('Monday.0.name', $option['name']);
        $this->postJson('/api/user-meals/'.$meal->id.'/replace', ['recipeId' => Recipe::where('meal_type', 'Dinner')->first()->id])->assertUnprocessable();
        $this->postJson('/api/user-meals/'.$meal->id.'/replace', ['recipeId' => 999999])->assertUnprocessable();
        $this->postJson('/api/user-meals/999999/replace', ['recipeId' => $option['recipeId']])->assertNotFound();
    }

    public function test_profile_filters_every_day_and_rejects_incompatible_replacements(): void
    {
        $this->putJson($this->url.'/health-profile', $this->profile(['dietaryPreferences' => ['Vegan'], 'allergies' => ['Peanuts', 'Tree nuts', 'Soy']]))->assertOk();
        foreach (MealPlanMeal::with('recipe')->whereHas('day.mealPlan', fn ($q) => $q->where('user_id', $this->demo->id))->get() as $meal) {
            $this->assertContains('vegan', $meal->recipe->tags);
            $this->assertNotContains('contains_nuts', $meal->recipe->tags);
            $this->assertNotContains('contains_soy', $meal->recipe->tags);
        }
        $meal = MealPlanMeal::first();
        $unsafe = Recipe::where('slug', 'mon-b1')->first();
        $this->postJson('/api/user-meals/'.$meal->id.'/replace', ['recipeId' => $unsafe->id])->assertUnprocessable();
        $before = $meal->fresh()->recipe_id;
        $this->putJson($this->url.'/health-profile', $this->profile(['allergies' => ['Unknown allergen']]))->assertUnprocessable();
        $this->assertSame($before, $meal->fresh()->recipe_id);
        $this->assertSame(['Peanuts', 'Tree nuts', 'Soy'], $this->demo->fresh()->healthProfile->allergies);
    }

    public function test_snack_addition_persists_in_selected_day(): void
    {
        $this->postJson($this->url.'/meals/snack', ['day' => 'Tuesday'])->assertCreated()->assertJsonPath('type', 'Snack');
        $this->getJson($this->url.'/meal-plan')->assertJsonCount(5, 'Tuesday')->assertJsonCount(4, 'Monday');
        $this->postJson($this->url.'/meals/snack', ['day' => 'Noday'])->assertUnprocessable();
    }

    public function test_meals_can_be_reordered_within_their_day(): void
    {
        $monday = $this->getJson($this->url.'/meal-plan')->assertOk()->json('Monday');
        $snack = collect($monday)->firstWhere('type', 'Snack');
        $order = [
            $monday[0]['id'],
            $snack['id'],
            ...collect($monday)->reject(fn ($meal) => in_array($meal['id'], [$monday[0]['id'], $snack['id']], true))->pluck('id')->all(),
        ];
        $this->putJson($this->url.'/meal-plan/order', ['day' => 'Monday', 'mealIds' => $order])
            ->assertOk()->assertJsonPath('1.id', $snack['id']);
        $this->assertSame($order, $this->getJson($this->url.'/meal-plan')->json('Monday.*.id'));
        $this->putJson($this->url.'/meal-plan/order', ['day' => 'Monday', 'mealIds' => array_slice($order, 1)])
            ->assertUnprocessable();
        $otherUser = User::factory()->create();
        $this->putJson('/api/users/'.$otherUser->id.'/meal-plan/order', ['day' => 'Monday', 'mealIds' => $order])->assertNotFound();
    }

    public function test_reseeding_keeps_user_edits_and_does_not_duplicate_plans(): void
    {
        $this->putJson($this->url.'/onboarding', ['name' => 'Saved Name', 'age' => 40, ...$this->profile()])->assertOk();
        $meal = MealPlanMeal::first();
        $replacement = Recipe::where('meal_type', 'Breakfast')->where('id', '!=', $meal->recipe_id)->first();
        $this->postJson('/api/user-meals/'.$meal->id.'/replace', ['recipeId' => $replacement->id])->assertOk();
        $this->seed(FaviaSeeder::class);
        $this->assertDatabaseHas('users', ['id' => $this->demo->id, 'name' => 'Saved Name']);
        $this->assertSame($replacement->id, $meal->fresh()->recipe_id);
        $this->assertSame(1, $this->demo->mealPlans()->count());
        $this->assertSame(3, $this->demo->workouts()->count());
        $this->assertSame(84, MealPlanMeal::count());
    }

    public function test_workouts_have_evidence_visuals_and_read_only_alternatives(): void
    {
        $workouts = $this->getJson($this->url.'/workouts')->assertOk()->assertJsonCount(3)->json();
        $exercise = $workouts[0]['exercises'][0];
        $this->assertNotEmpty($exercise['evidence']['sources']);
        $this->assertNotEmpty($exercise['instructions']);
        $this->assertNotEmpty($exercise['imageUrl']);
        $this->getJson('/api/exercises/'.$exercise['exerciseId'].'/alternatives')->assertOk()->assertJsonCount(3);
        $this->getJson('/api/user-workouts/'.$workouts[0]['userWorkoutId'])->assertOk()->assertJsonPath('id', 'workout-a');
    }

    public function test_daily_check_in_is_idempotent_and_adjustments_expire(): void
    {
        $sets = WorkoutExercise::first()->sets;
        $draft = ['energy' => 'lower', 'pain' => 'moderate', 'affectedAreas' => ['Lower back'], 'recovery' => 'poor', 'note' => 'Back soreness and poor sleep'];
        $this->postJson($this->url.'/check-ins', $draft)->assertCreated()->assertJsonPath('dailyCheckIn.planAdjusted', true)
            ->assertJsonPath('workouts.0.exercises.0.sets', max(2, $sets - 1));
        $this->postJson($this->url.'/check-ins', $draft)->assertOk()->assertJsonPath('workouts.0.exercises.0.sets', max(2, $sets - 1));
        $this->assertSame(1, DailyCheckIn::count());
        $this->getJson($this->url.'/check-ins/latest')->assertOk()->assertJsonPath('note', $draft['note']);
        $this->getJson($this->url.'/dashboard')->assertJsonPath('dailyCheckIn.planAdjusted', true);
        $this->travel(1)->days();
        $this->getJson($this->url.'/dashboard')->assertJsonPath('dailyCheckIn', null)->assertJsonPath('workouts.0.exercises.0.sets', $sets);
        $this->travelBack();
        $this->postJson($this->url.'/check-ins', ['energy' => 'same', 'pain' => 'none', 'affectedAreas' => [], 'recovery' => 'well', 'note' => ''])->assertOk()->assertJsonPath('dailyCheckIn.planAdjusted', false)->assertJsonPath('workouts.0.exercises.0.sets', $sets);
        $this->postJson($this->url.'/check-ins', ['energy' => 'invalid'])->assertUnprocessable();
    }

    public function test_notifications_read_and_other_user_records_are_protected(): void
    {
        $notification = $this->getJson($this->url.'/notifications')->assertOk()->assertJsonCount(3)->json('0');
        $this->patchJson('/api/notifications/'.$notification['id'].'/read')->assertOk();
        $this->assertNotNull($this->demo->notifications()->find($notification['id'])->read_at);
        $other = User::factory()->create();
        $private = $other->notifications()->create(['type' => 'test', 'title' => 'Private', 'message' => 'Other user']);
        $this->getJson('/api/users/'.$other->id.'/dashboard')->assertNotFound();
        $this->patchJson('/api/notifications/'.$private->id.'/read')->assertNotFound();
        $this->getJson('/api/users/999999/settings')->assertNotFound();
        $this->getJson('/api/users/not-an-id/settings')->assertNotFound();
        $this->getJson('/api/recipes/9999999999999999999999999')->assertNotFound();
        $this->getJson('/api/user-meals/invalid/alternatives')->assertNotFound();
    }
}
