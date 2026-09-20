<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $planIds = DB::table('plans')->pluck('id', 'level');
        $basicPlanId = $planIds[0];

        DB::table('users')->orderBy('id')->each(function (object $user) use ($planIds, $basicPlanId) {
            DB::table('users')->where('id', $user->id)->update([
                'plan_id' => $planIds[$user->plan_level] ?? $basicPlanId,
            ]);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('plan_level');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedTinyInteger('plan_level')->default(0);
        });

        $levels = DB::table('plans')->pluck('level', 'id');
        DB::table('users')->orderBy('id')->each(function (object $user) use ($levels) {
            DB::table('users')->where('id', $user->id)->update(['plan_level' => $levels[$user->plan_id] ?? 0]);
        });
    }
};
