<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckInRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'energy' => ['required', 'in:lower,same,higher'],
            'recovery' => ['required', 'in:poor,okay,well'],
            'pain' => ['required', 'in:none,mild,moderate,significant'],
            'affectedAreas' => ['present', 'array', 'max:20'],
            'affectedAreas.*' => ['required', 'string', 'max:100', 'distinct'],
            'note' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
