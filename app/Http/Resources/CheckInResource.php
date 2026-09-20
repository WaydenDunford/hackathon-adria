<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CheckInResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'date' => $this->date->toDateString(), 'completedAt' => $this->updated_at->format('H:i'),
            'energy' => $this->energy, 'recovery' => $this->recovery, 'pain' => $this->pain,
            'affectedAreas' => $this->affected_areas, 'note' => $this->note ?? '',
            'planAdjusted' => $this->plan_adjusted, 'adjustmentSummary' => $this->adjustment_summary,
        ];
    }
}
