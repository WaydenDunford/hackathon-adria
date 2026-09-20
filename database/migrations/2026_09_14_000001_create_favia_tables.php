<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $t) {
            $t->unsignedSmallInteger('age')->nullable();
            $t->string('language', 2)->default('EN');
            $t->string('theme', 10)->default('light');
            $t->timestamp('onboarded_at')->nullable();
        });
        Schema::create('health_profiles', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            foreach (['conditions', 'allergies', 'dietary_preferences', 'physical_limitations'] as $field) {
                $t->jsonb($field);
            }
            $t->timestamps();
        });
        Schema::create('daily_check_ins', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->date('date');
            $t->string('energy', 10);
            $t->string('recovery', 10);
            $t->string('pain', 15);
            $t->jsonb('affected_areas');
            $t->text('note')->nullable();
            $t->boolean('plan_adjusted')->default(false);
            $t->jsonb('adjustment_summary');
            $t->timestamps();
            $t->unique(['user_id', 'date']);
        });
        Schema::create('evidence_references', function (Blueprint $t) {
            $t->id();
            $t->string('slug')->unique();
            $t->string('title');
            $t->text('recommendation');
            $t->string('evidence_level');
            $t->text('clinical_summary');
            $t->jsonb('sources');
            $t->timestamps();
        });
        Schema::create('recipes', function (Blueprint $t) {
            $t->id();
            $t->string('slug')->unique();
            $t->string('name');
            $t->text('description');
            $t->string('meal_type', 15)->index();
            $t->unsignedSmallInteger('preparation_time')->default(20);
            foreach (['calories', 'protein', 'carbohydrates', 'fats'] as $field) {
                $t->unsignedInteger($field);
            }
            $t->text('instructions');
            $t->text('research_summary');
            $t->string('image_url');
            $t->string('image_alt');
            $t->string('image_category');
            $t->jsonb('tags');
            $t->foreignId('evidence_reference_id')->constrained()->restrictOnDelete();
            $t->timestamps();
        });
        Schema::create('recipe_ingredients', function (Blueprint $t) {
            $t->id();
            $t->foreignId('recipe_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->string('quantity');
            $t->string('unit')->default('');
            $t->unsignedSmallInteger('sort_order');
            $t->timestamps();
            $t->unique(['recipe_id', 'sort_order']);
        });
        Schema::create('meal_plans', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->date('start_date');
            $t->date('end_date');
            $t->string('status')->default('active');
            $t->timestamps();
            $t->unique(['user_id', 'start_date']);
            $t->index(['user_id', 'status']);
        });
        Schema::create('meal_plan_days', function (Blueprint $t) {
            $t->id();
            $t->foreignId('meal_plan_id')->constrained()->cascadeOnDelete();
            $t->date('date');
            $t->unsignedSmallInteger('day_index');
            $t->timestamps();
            $t->unique(['meal_plan_id', 'date']);
            $t->unique(['meal_plan_id', 'day_index']);
        });
        Schema::create('meal_plan_meals', function (Blueprint $t) {
            $t->id();
            $t->foreignId('meal_plan_day_id')->constrained()->cascadeOnDelete();
            $t->foreignId('recipe_id')->constrained()->restrictOnDelete();
            $t->string('meal_type', 15);
            $t->unsignedSmallInteger('sort_order');
            $t->timestamps();
            $t->unique(['meal_plan_day_id', 'sort_order']);
        });
        Schema::create('workouts', function (Blueprint $t) {
            $t->id();
            $t->string('slug')->unique();
            $t->string('label');
            $t->string('name');
            $t->text('description')->nullable();
            $t->string('workout_type')->default('strength');
            $t->string('estimated_duration');
            $t->string('difficulty');
            $t->jsonb('muscle_groups');
            $t->timestamps();
        });
        Schema::create('exercises', function (Blueprint $t) {
            $t->id();
            $t->string('slug')->unique();
            $t->string('name');
            $t->string('category');
            $t->text('instructions');
            $t->text('description');
            $t->boolean('is_modified')->default(false);
            $t->string('modification_label')->nullable();
            $t->string('original_exercise_name')->nullable();
            $t->text('adjustment_reason')->nullable();
            $t->text('t1d_safety_note')->nullable();
            $t->string('image_url')->nullable();
            $t->jsonb('visual')->nullable();
            $t->foreignId('evidence_reference_id')->constrained()->restrictOnDelete();
            $t->timestamps();
        });
        Schema::create('workout_exercises', function (Blueprint $t) {
            $t->id();
            $t->foreignId('workout_id')->constrained()->cascadeOnDelete();
            $t->foreignId('exercise_id')->constrained()->restrictOnDelete();
            $t->unsignedSmallInteger('sets');
            $t->string('reps');
            $t->unsignedSmallInteger('rest_seconds')->default(60);
            $t->unsignedSmallInteger('sort_order');
            $t->timestamps();
            $t->unique(['workout_id', 'sort_order']);
        });
        Schema::create('exercise_alternatives', function (Blueprint $t) {
            $t->id();
            $t->foreignId('exercise_id')->constrained()->cascadeOnDelete();
            $t->foreignId('alternative_exercise_id')->constrained('exercises')->cascadeOnDelete();
            $t->string('status');
            $t->text('description');
            $t->timestamps();
            $t->unique(['exercise_id', 'alternative_exercise_id']);
        });
        Schema::create('user_workouts', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->foreignId('workout_id')->constrained()->restrictOnDelete();
            $t->date('scheduled_date');
            $t->string('status')->default('scheduled');
            $t->decimal('intensity_modifier', 3, 2)->default(1);
            $t->decimal('volume_modifier', 3, 2)->default(1);
            $t->date('adjusted_for_date')->nullable();
            $t->jsonb('notes')->nullable();
            $t->timestamps();
            $t->unique(['user_id', 'workout_id', 'scheduled_date']);
            $t->index(['user_id', 'scheduled_date']);
        });
        Schema::create('notifications', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->string('type');
            $t->string('title');
            $t->text('message');
            $t->timestamp('read_at')->nullable();
            $t->jsonb('metadata')->nullable();
            $t->timestamps();
            $t->index(['user_id', 'read_at']);
        });
    }

    public function down(): void
    {
        foreach (['notifications', 'user_workouts', 'exercise_alternatives', 'workout_exercises', 'exercises', 'workouts', 'meal_plan_meals', 'meal_plan_days', 'meal_plans', 'recipe_ingredients', 'recipes', 'evidence_references', 'daily_check_ins', 'health_profiles'] as $table) {
            Schema::dropIfExists($table);
        }
        Schema::table('users', fn (Blueprint $t) => $t->dropColumn(['age', 'language', 'theme', 'onboarded_at']));
    }
};
