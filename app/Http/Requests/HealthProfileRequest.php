<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HealthProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [];
        foreach (['conditions', 'allergies', 'dietaryPreferences', 'physicalLimitations'] as $key) {
            $rules[$key] = ['present', 'array', 'max:30'];
            $rules[$key.'.*'] = ['required', 'string', 'max:150', 'distinct:ignore_case'];
        }
        if ($this->routeIs('onboarding')) {
            $rules['name'] = ['required', 'string', 'max:100'];
            $rules['age'] = ['required', 'integer', 'between:1,120'];
        }

        return $rules;
    }

    public function profile(): array
    {
        return [
            'conditions' => $this->validated('conditions'),
            'allergies' => $this->validated('allergies'),
            'dietary_preferences' => $this->validated('dietaryPreferences'),
            'physical_limitations' => $this->validated('physicalLimitations'),
        ];
    }
}
