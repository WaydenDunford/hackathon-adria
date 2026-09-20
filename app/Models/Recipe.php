<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Recipe extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['tags' => 'array', 'calories' => 'integer', 'protein' => 'integer', 'carbohydrates' => 'integer', 'fats' => 'integer'];
    }

    public function ingredients(): HasMany
    {
        return $this->hasMany(RecipeIngredient::class);
    }

    public function evidence(): BelongsTo
    {
        return $this->belongsTo(EvidenceReference::class, 'evidence_reference_id');
    }
}
