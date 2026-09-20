<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RecipeResource extends JsonResource
{
    public function toArray($request): array
    {
        $profile = $request->user()->healthProfile;
        $relevance = [];
        foreach ($profile->conditions as $condition) {
            $relevance[] = [
                'condition' => $condition, 'iconType' => str_contains($condition, 'Diabetes') ? 't1d' : ($condition === 'Celiac Disease' ? 'celiac' : 'general'),
                'explanation' => str_contains($condition, 'Diabetes') ? 'Carbohydrate grams are shown for each meal.' : 'Recorded in your profile; demo rules only filter supported ingredient tags.',
            ];
        }
        foreach ($profile->allergies as $allergy) {
            $relevance[] = ['condition' => $allergy.' allergy', 'iconType' => 'allergy', 'explanation' => 'Filtered against stored '.$allergy.' ingredient tags.'];
        }
        foreach ($profile->dietary_preferences as $preference) {
            $relevance[] = ['condition' => $preference, 'iconType' => 'general', 'explanation' => 'Filtered using the stored '.$preference.' recipe tag.'];
        }
        if (! $relevance) {
            $relevance[] = ['condition' => 'Your nutrition goals', 'iconType' => 'general', 'explanation' => 'Balanced ingredients and clear nutrition information.'];
        }

        return [
            'id' => (string) $this->id, 'recipeId' => $this->id, 'type' => $this->meal_type,
            'name' => $this->name, 'subtitle' => $this->description, 'desc' => $this->description,
            'calories' => $this->calories, 'protein' => $this->protein, 'carbs' => $this->carbohydrates, 'fat' => $this->fats,
            'ingredientsSummary' => $this->ingredients->sortBy('sort_order')->pluck('name')->implode(', '),
            'ingredients' => $this->ingredients->sortBy('sort_order')->map(fn ($i) => ['ingredient' => $i->name, 'amount' => trim($i->quantity.' '.$i->unit)])->values(),
            'instructions' => $this->instructions, 'preparationTime' => $this->preparation_time,
            'imageUrl' => $this->image_url ? '/api/images/recipes/'.$this->id : null, 'imageAlt' => $this->image_alt, 'imageCategory' => $this->image_category,
            'healthBadges' => array_column($relevance, 'condition'), 'healthRelevance' => $relevance,
            'whyThisMeal' => $this->research_summary, 'evidence' => (new EvidenceResource($this->evidence))->resolve($request),
        ];
    }
}
