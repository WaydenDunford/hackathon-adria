<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable()->after('name');
        });

        DB::table('users')->orderBy('id')->each(function (object $user) {
            $base = strtolower((string) preg_replace('/[^a-z0-9_]/i', '', $user->name));
            $username = $base ?: 'user'.$user->id;
            $candidate = $username;
            $suffix = 1;
            while (DB::table('users')->where('username', $candidate)->exists()) {
                $candidate = $username.'_'.$suffix++;
            }
            DB::table('users')->where('id', $user->id)->update(['username' => $candidate]);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->unique('username');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['username']);
            $table->dropColumn('username');
        });
    }
};
