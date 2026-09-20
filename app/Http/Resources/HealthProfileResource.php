<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class HealthProfileResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'conditions' => $this->conditions, 'allergies' => $this->allergies,
            'dietaryPreferences' => $this->dietary_preferences, 'physicalLimitations' => $this->physical_limitations,
        ];
    }
}
