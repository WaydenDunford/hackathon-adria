<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CheckInController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\MealPlanController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\WorkoutController;
use App\Http\Middleware\OwnUser;
use Illuminate\Support\Facades\Route;

// Reject malformed identifiers before PostgreSQL attempts an integer comparison.
foreach (['user', 'meal', 'recipe', 'userWorkout', 'exercise', 'notification'] as $parameter) {
    Route::pattern($parameter, '[1-9][0-9]{0,17}');
}

Route::get('auth/session', [AuthController::class, 'session']);
Route::post('auth/register', [AuthController::class, 'register'])->middleware('throttle:5,1,register');
Route::post('auth/login', [AuthController::class, 'login'])->middleware('throttle:5,1,login');
Route::post('auth/demo', [AuthController::class, 'demo'])->middleware('throttle:5,1,demo');
Route::post('auth/logout', [AuthController::class, 'logout'])->middleware('auth');

Route::middleware(['auth', OwnUser::class])->group(function () {
    Route::get('images/meals/{meal}', [ImageController::class, 'meal']);
    Route::get('images/recipes/{recipe}', [ImageController::class, 'recipe']);
    Route::get('images/exercises/{exercise}', [ImageController::class, 'exercise']);
    Route::prefix('users/{user}')->group(function () {
        Route::get('', [UserController::class, 'show']);
        Route::get('dashboard', [UserController::class, 'dashboard']);
        Route::get('health-profile', [UserController::class, 'profile']);
        Route::put('health-profile', [UserController::class, 'updateProfile']);
        Route::put('onboarding', [UserController::class, 'updateProfile'])->name('onboarding');
        Route::get('settings', [UserController::class, 'settings']);
        Route::put('settings', [UserController::class, 'updateSettings']);
        Route::get('meal-plan', [MealPlanController::class, 'index']);
        Route::put('meal-plan/order', [MealPlanController::class, 'reorder']);
        Route::get('meal-plan/{date}', [MealPlanController::class, 'day']);
        Route::post('meals/snack', [MealPlanController::class, 'snack']);
        Route::get('workouts', [WorkoutController::class, 'index']);
        Route::get('check-ins/latest', [CheckInController::class, 'latest']);
        Route::post('check-ins', [CheckInController::class, 'store']);
        Route::get('notifications', [NotificationController::class, 'index']);
    });
    Route::get('user-meals/{meal}/alternatives', [MealPlanController::class, 'alternatives']);
    Route::post('user-meals/{meal}/replace', [MealPlanController::class, 'replace']);
    Route::get('recipes/{recipe}', [MealPlanController::class, 'recipe']);
    Route::get('user-workouts/{userWorkout}', [WorkoutController::class, 'show']);
    Route::get('exercises/{exercise}/alternatives', [WorkoutController::class, 'alternatives']);
    Route::patch('notifications/{notification}/read', [NotificationController::class, 'read']);
});
