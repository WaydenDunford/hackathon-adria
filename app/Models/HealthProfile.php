<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HealthProfile extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['conditions' => 'array', 'allergies' => 'array', 'dietary_preferences' => 'array', 'physical_limitations' => 'array'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
