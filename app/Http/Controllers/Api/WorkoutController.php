<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExerciseResource;
use App\Http\Resources\WorkoutResource;
use App\Models\Exercise;
use App\Models\User;
use App\Models\UserWorkout;
use App\Services\DashboardData;
use Illuminate\Http\Request;

class WorkoutController extends Controller
{
    public function index(User $user, DashboardData $data)
    {
        return response()->json($data->workouts($user));
    }

    public function show(Request $request, UserWorkout $userWorkout)
    {
        abort_unless($userWorkout->user_id === $request->user()->id, 404);

        return response()->json((new WorkoutResource($userWorkout->load(['workout.entries.exercise.evidence', 'workout.entries.exercise.alternatives.alternative'])))->resolve());
    }

    public function alternatives(Request $request, Exercise $exercise)
    {
        abort_unless($request->user()->workouts()->whereHas('workout.entries', fn ($q) => $q->where('exercise_id', $exercise->id))->exists(), 404);

        return response()->json((new ExerciseResource($exercise->load(['evidence', 'alternatives.alternative'])))->resolve()['alternatives']);
    }
}
