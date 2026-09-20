<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MealResource extends JsonResource
{
    public function toArray($request): array
    {
        return [...(new RecipeResource($this->recipe))->resolve($request), 'id' => (string) $this->id, 'type' => $this->meal_type, 'imageUrl' => '/api/images/meals/'.$this->id];
    }
}
