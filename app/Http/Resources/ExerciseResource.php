<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ExerciseResource extends JsonResource
{
    public function toArray($request): array
    {
        $profile = $request->user()->healthProfile;
        $back = in_array('Lower back', $profile->physical_limitations) || in_array('Lower-Back Problems', $profile->conditions);

        return [
            'id' => $this->slug, 'exerciseId' => $this->id, 'name' => $this->name, 'category' => $this->category,
            'isModified' => $this->is_modified && $back,
            'modificationLabel' => $back ? $this->modification_label : null,
            'originalExerciseName' => $back ? $this->original_exercise_name : null,
            'adjustmentReason' => $back ? $this->adjustment_reason : null,
            'whyThisExercise' => $this->description, 'instructions' => $this->instructions,
            'evidence' => (new EvidenceResource($this->evidence))->resolve($request),
            't1dSafetyNote' => in_array('Type 1 Diabetes', $profile->conditions) ? $this->t1d_safety_note : null,
            'visual' => $this->visual, 'imageUrl' => $this->image_url ? '/api/images/exercises/'.$this->id : null,
            'alternatives' => [
                ['id' => $this->id, 'name' => $this->name, 'status' => 'Currently Active', 'desc' => $this->description, 'isCurrent' => true],
                ...$this->alternatives->map(fn ($a) => ['id' => $a->alternative->id, 'name' => $a->alternative->name, 'status' => $a->status, 'desc' => $a->description, 'isCurrent' => false])->all(),
            ],
        ];
    }
}
