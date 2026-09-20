<?php

namespace Tests\Feature;

use App\Models\MealPlanMeal;
use App\Models\Plan;
use App\Models\User;
use Database\Seeders\FaviaSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['favia.demo_enabled' => true]);
        $this->seed(FaviaSeeder::class);
    }

    public function test_registration_creates_private_plans_and_login_logout_work(): void
    {
        $values = ['name' => 'New Person', 'username' => 'new_person', 'email' => 'PERSON@example.com', 'password' => 'a-long-private-password', 'password_confirmation' => 'a-long-private-password'];
        $this->postJson('/api/auth/register', $values)->assertCreated()->assertJsonPath('user.name', 'New Person')->assertJsonPath('user.plan.code', Plan::BASIC);
        $user = User::where('email', 'person@example.com')->firstOrFail();
        $this->assertTrue(Hash::check($values['password'], $user->password));
        $this->assertAuthenticatedAs($user);
        $this->getJson('/api/users/'.$user->id.'/dashboard')->assertOk()->assertJsonPath('summary.mealCount', 28)->assertJsonPath('summary.workoutCount', 3)->assertJsonPath('healthProfile.conditions', []);
        $this->putJson('/api/users/'.$user->id.'/onboarding', ['name' => 'New Person', 'age' => 30, 'conditions' => [], 'allergies' => [], 'dietaryPreferences' => [], 'physicalLimitations' => []])->assertOk();
        $this->postJson('/api/auth/logout')->assertOk()->assertJsonPath('user', null);
        $this->assertGuest();
        $this->getJson('/api/users/'.$user->id.'/dashboard')->assertUnauthorized();
        $this->postJson('/api/auth/login', ['identifier' => $user->email, 'password' => 'wrong'])->assertUnprocessable();
        $this->postJson('/api/auth/login', ['identifier' => $user->email, 'password' => $values['password']])->assertOk()->assertJsonPath('user.id', $user->id);
        $this->postJson('/api/auth/logout')->assertOk();
        $this->postJson('/api/auth/login', ['identifier' => 'new_person', 'password' => $values['password']])->assertOk()->assertJsonPath('user.id', $user->id);
    }

    public function test_other_users_records_and_images_are_inaccessible_even_with_demo_header(): void
    {
        $amina = User::where('email', 'demo@favia.test')->firstOrFail();
        $fatih = User::where('email', 'fatih@favia.test')->firstOrFail();
        $meal = MealPlanMeal::whereHas('day.mealPlan', fn ($q) => $q->where('user_id', $fatih->id))->firstOrFail();
        $this->actingAs($amina)->withHeader('X-Demo-User', $fatih->email);
        foreach (['', '/dashboard', '/health-profile', '/settings', '/meal-plan', '/workouts', '/notifications', '/check-ins/latest'] as $suffix) {
            $this->getJson('/api/users/'.$fatih->id.$suffix)->assertNotFound();
        }
        $this->putJson('/api/users/'.$fatih->id.'/settings', ['theme' => 'night'])->assertNotFound();
        $this->getJson('/api/user-meals/'.$meal->id.'/alternatives')->assertNotFound();
        $this->postJson('/api/user-meals/'.$meal->id.'/replace', ['recipeId' => $meal->recipe_id])->assertNotFound();
        $this->getJson('/api/user-workouts/'.$fatih->workouts()->first()->id)->assertNotFound();
        $this->patchJson('/api/notifications/'.$fatih->notifications()->first()->id.'/read')->assertNotFound();
        $this->getJson('/api/images/meals/'.$meal->id)->assertNotFound();
        $own = MealPlanMeal::whereHas('day.mealPlan', fn ($q) => $q->where('user_id', $amina->id))->firstOrFail();
        $this->get('/api/images/meals/'.$own->id)->assertOk()->assertHeader('content-type', 'image/png');
        $this->get('/meal-images/meal-mon-b1.png')->assertNotFound();
    }

    public function test_demo_access_is_optional_and_cannot_impersonate_a_regular_account(): void
    {
        $this->assertTrue(Hash::check('password123', User::where('username', 'amina')->firstOrFail()->password));
        $this->assertSame(Plan::PLUS, User::where('username', 'fatih')->firstOrFail()->plan->code);
        $this->assertSame(Plan::PREMIUM, User::where('username', 'vedad')->firstOrFail()->plan->code);
        foreach (Plan::with('features')->get() as $plan) {
            $this->assertCount(12, $plan->features);
            $this->assertTrue($plan->features->every(fn ($feature) => $feature->pivot->is_allowed));
        }
        config(['favia.demo_enabled' => false]);
        $this->getJson('/api/auth/session')->assertOk()->assertJsonPath('user', null)->assertJsonPath('demoUsers', []);
        $this->postJson('/api/auth/demo', ['email' => 'demo@favia.test'])->assertNotFound();
        $this->withHeader('X-Demo-User', 'demo@favia.test')->getJson('/api/users/1/dashboard')->assertUnauthorized();
        $this->getJson('/api/images/meals/1')->assertUnauthorized();
        config(['favia.demo_enabled' => true]);
        $this->postJson('/api/auth/demo', ['email' => 'person@example.com'])->assertUnprocessable();
        $this->postJson('/api/auth/demo', ['email' => 'fatih@favia.test'])->assertOk()->assertJsonPath('user.name', 'Fatih');
    }

    public function test_registration_validation_and_login_rate_limit(): void
    {
        $this->postJson('/api/auth/register', ['name' => 'Test', 'username' => 'test', 'email' => 'demo@favia.test', 'password' => 'short'])->assertUnprocessable();
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/auth/login', ['identifier' => 'unknown@example.com', 'password' => 'incorrect'])->assertUnprocessable();
        }
        $this->postJson('/api/auth/login', ['identifier' => 'unknown@example.com', 'password' => 'incorrect'])->assertStatus(429);
    }

    public function test_names_can_repeat_but_usernames_cannot(): void
    {
        $password = 'a-long-private-password';
        $this->postJson('/api/auth/register', [
            'name' => 'Alex', 'username' => 'alex_one', 'email' => 'alex-one@example.com',
            'password' => $password, 'password_confirmation' => $password,
        ])->assertCreated();
        $this->postJson('/api/auth/register', [
            'name' => 'Alex', 'username' => 'alex_two', 'email' => 'alex-two@example.com',
            'password' => $password, 'password_confirmation' => $password,
        ])->assertCreated();
        $this->postJson('/api/auth/register', [
            'name' => 'Another Alex', 'username' => 'alex_one', 'email' => 'alex-three@example.com',
            'password' => $password, 'password_confirmation' => $password,
        ])->assertUnprocessable()->assertJsonValidationErrors('username');
    }

    public function test_catalog_and_registration_work_with_demo_accounts_disabled(): void
    {
        User::query()->delete();
        config(['favia.demo_enabled' => false]);
        $this->seed(FaviaSeeder::class);
        $this->assertSame(0, User::count());
        $this->postJson('/api/auth/register', [
            'name' => 'Private User', 'username' => 'private_user', 'email' => 'private@example.com',
            'password' => 'a-long-private-password', 'password_confirmation' => 'a-long-private-password',
        ])->assertCreated()->assertJsonPath('demoUsers', []);
        $this->assertSame(1, User::count());
    }

    public function test_csrf_is_required_for_authentication_requests(): void
    {
        // Laravel normally skips CSRF in tests; enable the real middleware check.
        $this->app['env'] = 'production';
        $this->postJson('/api/auth/login', ['email' => 'a@example.com', 'password' => 'incorrect'])->assertStatus(419);
    }
}
