<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->unsignedTinyInteger('level')->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        DB::table('plans')->insert([
            ['code' => 'basic', 'name' => 'Basic', 'level' => 0, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'plus', 'name' => 'Plus', 'level' => 1, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'premium', 'name' => 'Premium', 'level' => 2, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        Schema::create('features', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('feature_plan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->constrained()->restrictOnDelete();
            $table->foreignId('feature_id')->constrained()->restrictOnDelete();
            $table->boolean('is_allowed')->default(true);
            $table->unsignedInteger('limit')->nullable();
            $table->timestamps();
            $table->unique(['plan_id', 'feature_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('plan_id')->nullable()->constrained()->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['plan_id']);
            $table->dropColumn('plan_id');
        });
        Schema::dropIfExists('feature_plan');
        Schema::dropIfExists('features');
        Schema::dropIfExists('plans');
    }
};
