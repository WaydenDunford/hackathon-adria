<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvidenceReference extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['sources' => 'array'];
    }
}
