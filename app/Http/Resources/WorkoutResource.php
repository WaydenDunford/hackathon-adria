<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class WorkoutResource extends JsonResource
{
    public function toArray($request): array
    {
        $w = $this->workout;
        $active = $this->adjusted_for_date?->isToday() ?? false;
        $low = $active && ($this->notes['low'] ?? false);
        $back = $active && ($this->notes['back'] ?? false);
        $volume = $active && $this->volume_modifier < 1;

        return [
            'id' => $w->slug, 'userWorkoutId' => $this->id, 'scheduledDate' => $this->scheduled_date->toDateString(),
            'label' => $w->label, 'title' => $w->name,
            'estimatedDuration' => $volume ? '35 mins today' : $w->estimated_duration,
            'intensity' => $low ? 'Low-Moderate today' : $w->difficulty,
            'muscleGroups' => $w->muscle_groups,
            'exercises' => $w->entries->sortBy('sort_order')->map(function ($entry) use ($request, $low, $back, $volume) {
                $e = (new ExerciseResource($entry->exercise))->resolve($request);
                $target = $back && in_array($e['id'], ['ex-a1', 'ex-a2', 'ex-a4']);

                return [...$e, 'sets' => $volume ? max(2, $entry->sets - 1) : $entry->sets, 'reps' => $entry->reps,
                    'dailyAdjustmentReason' => $target ? 'Supported movement prioritized after today’s lower-back check-in.' : ($low ? 'Today’s intensity adjusted to match reported energy and recovery.' : null)];
            })->values(),
        ];
    }
}
