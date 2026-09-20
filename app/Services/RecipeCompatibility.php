<?php

namespace App\Services;

use App\Models\HealthProfile;
use App\Models\Recipe;
use Illuminate\Support\Collection;

/** Small demo metadata filter, not a medical recommendation engine. */
class RecipeCompatibility
{
    public function matches(Recipe $recipe, HealthProfile $profile): bool
    {
        $tags = $recipe->tags;
        $allergens = ['peanuts' => 'contains_peanuts', 'tree nuts' => 'contains_nuts', 'milk' => 'contains_dairy', 'eggs' => 'contains_eggs', 'soy' => 'contains_soy', 'fish' => 'contains_fish', 'shellfish' => 'contains_shellfish', 'wheat' => 'contains_gluten'];
        foreach ($profile->allergies as $allergy) {
            $tag = $allergens[strtolower($allergy)] ?? null;
            // Unknown allergens are not silently declared compatible.
            if (! $tag || in_array($tag, $tags)) {
                return false;
            }
        }
        $preferences = ['vegetarian' => 'vegetarian', 'vegan' => 'vegan', 'gluten-free' => 'gluten_free', 'dairy-free' => 'dairy_free', 'lactose-free' => 'dairy_free', 'halal' => 'halal', 'kosher' => 'kosher'];
        foreach ($profile->dietary_preferences as $preference) {
            if (strtolower($preference) === 'no preference') {
                continue;
            }
            $tag = $preferences[strtolower($preference)] ?? null;
            if (! $tag || ! in_array($tag, $tags)) {
                return false;
            }
        }

        return ! in_array('Celiac Disease', $profile->conditions) || in_array('gluten_free', $tags);
    }

    public function options(string $type, HealthProfile $profile): Collection
    {
        return Recipe::with(['ingredients', 'evidence'])->where('meal_type', $type)->orderBy('id')->get()
            ->filter(fn ($recipe) => $this->matches($recipe, $profile))->values();
    }
}
