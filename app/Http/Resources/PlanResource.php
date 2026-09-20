<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'level' => $this->level,
            'features' => $this->features->mapWithKeys(fn ($feature) => [$feature->code => [
                'allowed' => (bool) $feature->pivot->is_allowed,
                'limit' => $feature->pivot->limit,
            ]]),
        ];
    }
}
