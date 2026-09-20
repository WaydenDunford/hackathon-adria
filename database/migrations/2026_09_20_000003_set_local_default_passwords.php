<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('users')->orderBy('id')->each(function (object $user) {
            DB::table('users')->where('id', $user->id)->update(['password' => Hash::make('password123')]);
        });
    }

    public function down(): void
    {
        // Password hashes cannot be restored after a reset.
    }
};
