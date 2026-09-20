<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EvidenceResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->slug, 'title' => $this->title, 'recommendation' => $this->recommendation,
            'sources' => $this->sources, 'evidenceLevel' => $this->evidence_level, 'clinicalSummary' => $this->clinical_summary,
        ];
    }
}
