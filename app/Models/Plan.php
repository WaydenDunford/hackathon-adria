<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    public const BASIC = 'basic';

    public const PLUS = 'plus';

    public const PREMIUM = 'premium';

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['level' => 'integer', 'is_active' => 'boolean'];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function features(): BelongsToMany
    {
        return $this->belongsToMany(Feature::class)->withPivot(['is_allowed', 'limit'])->withTimestamps();
    }

    public static function basic(): self
    {
        return static::where('code', self::BASIC)->firstOrFail();
    }
}
