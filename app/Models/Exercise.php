<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exercise extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['is_modified' => 'boolean', 'visual' => 'array'];
    }

    public function evidence(): BelongsTo
    {
        return $this->belongsTo(EvidenceReference::class, 'evidence_reference_id');
    }

    public function alternatives(): HasMany
    {
        return $this->hasMany(ExerciseAlternative::class);
    }
}
