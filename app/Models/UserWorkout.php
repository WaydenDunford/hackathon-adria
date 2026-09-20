<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserWorkout extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['scheduled_date' => 'date', 'adjusted_for_date' => 'date', 'notes' => 'array', 'intensity_modifier' => 'float', 'volume_modifier' => 'float'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function workout(): BelongsTo
    {
        return $this->belongsTo(Workout::class);
    }
}
