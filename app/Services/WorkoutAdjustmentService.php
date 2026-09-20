<?php

namespace App\Services;

use App\Models\DailyCheckIn;
use App\Models\User;

class WorkoutAdjustmentService
{
    public function apply(User $user, array $draft): DailyCheckIn
    {
        $back = in_array($draft['pain'], ['moderate', 'significant'])
            && in_array('lower back', array_map('strtolower', $draft['affectedAreas']));
        $low = $draft['energy'] === 'lower' || $draft['recovery'] === 'poor';
        $summary = [];
        if ($low) {
            $summary[] = 'Workout intensity reduced because you reported lower energy or poor recovery.';
        }
        if ($back) {
            $summary[] = 'Lower-back loading was reduced and supported movement variations were prioritized for today.';
        }
        if ($draft['recovery'] === 'poor') {
            $summary[] = 'Training volume was reduced to support a recovery-oriented session.';
        }
        $checkIn = $user->checkIns()->whereDate('date', today())->first() ?? $user->checkIns()->make(['date' => today()->toDateString()]);
        $checkIn->fill([
            'energy' => $draft['energy'], 'recovery' => $draft['recovery'], 'pain' => $draft['pain'],
            'affected_areas' => $draft['affectedAreas'], 'note' => $draft['note'] ?? '',
            'plan_adjusted' => $back || $low, 'adjustment_summary' => $summary,
        ])->save();
        // Preserve the prototype's Workout A adaptation; templates are never mutated.
        $user->workouts()->whereHas('workout', fn ($q) => $q->where('slug', 'workout-a'))->update([
            'intensity_modifier' => $low ? 0.8 : 1,
            'volume_modifier' => $draft['recovery'] === 'poor' ? 0.8 : 1,
            'adjusted_for_date' => today()->toDateString(),
            'notes' => json_encode(['back' => $back, 'low' => $low]),
        ]);

        return $checkIn;
    }
}
