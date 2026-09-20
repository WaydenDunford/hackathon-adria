<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckInRequest;
use App\Http\Resources\CheckInResource;
use App\Models\User;
use App\Services\DashboardData;
use App\Services\WorkoutAdjustmentService;
use Illuminate\Support\Facades\DB;

class CheckInController extends Controller
{
    public function latest(User $user)
    {
        $checkIn = $user->checkIns()->latest('date')->first();

        return response()->json($checkIn ? (new CheckInResource($checkIn))->resolve() : null);
    }

    public function store(CheckInRequest $request, User $user, WorkoutAdjustmentService $adjuster, DashboardData $data)
    {
        $created = DB::transaction(function () use ($user, $request, $adjuster) {
            $user->newQuery()->whereKey($user->id)->lockForUpdate()->firstOrFail();
            $created = ! $user->checkIns()->whereDate('date', today())->exists();
            $adjuster->apply($user, $request->validated());

            return $created;
        });

        return response()->json($data->forUser($user->fresh()), $created ? 201 : 200);
    }
}
