<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\HealthProfileRequest;
use App\Http\Resources\HealthProfileResource;
use App\Http\Resources\PlanResource;
use App\Models\User;
use App\Services\DashboardData;
use App\Services\MealPlanService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function show(User $user)
    {
        $user->loadMissing('plan.features');

        return response()->json([...$user->only(['id', 'name', 'username', 'email', 'age', 'language', 'theme', 'onboarded_at']), 'plan' => (new PlanResource($user->plan))->resolve()]);
    }

    public function dashboard(User $user, DashboardData $data)
    {
        return response()->json($data->forUser($user));
    }

    public function profile(User $user)
    {
        return response()->json((new HealthProfileResource($user->healthProfile()->firstOrFail()))->resolve());
    }

    public function updateProfile(HealthProfileRequest $request, User $user, MealPlanService $plans, DashboardData $data)
    {
        DB::transaction(function () use ($request, $user, $plans) {
            $user->newQuery()->whereKey($user->id)->lockForUpdate()->first();
            $user->healthProfile()->updateOrCreate([], $request->profile());
            if ($request->routeIs('onboarding')) {
                $user->update(['name' => $request->validated('name'), 'age' => $request->validated('age'), 'onboarded_at' => now()]);
            }
            $plans->reconcile($user);
        });

        return response()->json($data->forUser($user->fresh()));
    }

    public function settings(User $user)
    {
        return response()->json($user->only(['language', 'theme']));
    }

    public function updateSettings(Request $request, User $user)
    {
        $values = $request->validate(['language' => ['sometimes', 'required', 'in:EN,BS'], 'theme' => ['sometimes', 'required', 'in:light,night']]);
        $user->update($values);

        return $this->settings($user);
    }
}
