<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Workout extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['muscle_groups' => 'array'];
    }

    public function entries(): HasMany
    {
        return $this->hasMany(WorkoutExercise::class);
    }
}
