<?php

namespace Database\Seeders;

use App\Models\EvidenceReference;
use App\Models\Exercise;
use App\Models\ExerciseAlternative;
use App\Models\Plan;
use App\Models\Recipe;
use App\Models\User;
use App\Models\Workout;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class FaviaSeeder extends Seeder
{
    private array $data;

    public function run(): void
    {
        $this->data = json_decode(file_get_contents(__DIR__.'/data/demo.json'), true, flags: JSON_THROW_ON_ERROR);
        DB::transaction(function () {
            $this->call(PlanSeeder::class);
            $planIds = Plan::pluck('id', 'code');
            // Re-running db:seed does not overwrite a demo user's edits.
            $start = today()->startOfWeek();
            foreach ($this->data['meals'] as $meals) {
                foreach ($meals as $meal) {
                    $this->recipe($meal);
                }
            }
            $users = collect(config('favia.demo_enabled') ? [
                ['email' => config('favia.demo_email'), 'username' => 'amina', 'name' => 'Amina', 'age' => 32, 'plan_id' => $planIds[Plan::BASIC]],
                ['email' => 'fatih@favia.test', 'username' => 'fatih', 'name' => 'Fatih', 'age' => 29, 'plan_id' => $planIds[Plan::PLUS]],
                ['email' => 'vedad@favia.test', 'username' => 'vedad', 'name' => 'Vedad', 'age' => 31, 'plan_id' => $planIds[Plan::PREMIUM]],
            ] : [])->map(function (array $attributes) {
                $user = User::firstOrCreate(['email' => $attributes['email']], [
                    ...$attributes, 'password' => Hash::make('password123'), 'language' => 'EN', 'theme' => 'light', 'onboarded_at' => now(),
                ]);
                $user->forceFill(['username' => $attributes['username'], 'plan_id' => $attributes['plan_id'], 'password' => 'password123'])->save();
                if (! $user->onboarded_at) {
                    $user->update(['onboarded_at' => now()]);
                }

                return $user;
            });
            foreach ($users as $user) {
                $profile = $this->data['profile'];
                $user->healthProfile()->firstOrCreate([], [
                    'conditions' => $profile['conditions'], 'allergies' => $profile['allergies'],
                    'dietary_preferences' => $profile['dietaryPreferences'], 'physical_limitations' => $profile['physicalLimitations'],
                ]);
                $start = today()->startOfWeek();
                $plan = $user->mealPlans()->firstOrCreate(['start_date' => $start], ['end_date' => $start->copy()->addDays(6), 'status' => 'active']);
                foreach (array_values($this->data['meals']) as $dayIndex => $meals) {
                    $day = $plan->days()->firstOrCreate(['day_index' => $dayIndex], ['date' => $start->copy()->addDays($dayIndex)]);
                    foreach ($meals as $index => $meal) {
                        $recipe = $this->recipe($meal);
                        $day->meals()->firstOrCreate(['sort_order' => $index], ['recipe_id' => $recipe->id, 'meal_type' => $meal['type']]);
                    }
                }
            }
            foreach ($this->data['swaps'] as $type => $options) {
                foreach ($options as $index => $option) {
                    if (Recipe::where('name', $option['name'])->exists()) {
                        continue;
                    }
                    $this->recipe([
                        ...$option, 'id' => 'swap-'.strtolower($type).'-'.$index, 'type' => $type,
                        'subtitle' => $option['desc'], 'ingredientsSummary' => $option['desc'],
                        'imageCategory' => 'bowl', 'whyThisMeal' => 'Seeded alternative with documented ingredients and nutrition.',
                        'evidence' => $this->data['meals']['Monday'][0]['evidence'],
                    ]);
                }
            }
            // Simple plant-based options keep all seven days populated for supported restrictions.
            foreach (['Breakfast', 'Lunch', 'Dinner', 'Snack'] as $type) {
                foreach ([0, 1] as $variant) {
                    $this->recipe([
                        'id' => 'plant-'.strtolower($type).'-'.$variant, 'type' => $type,
                        'name' => ($variant ? 'Roasted Sweet Potato & Chickpea' : 'Rice & Lentil').' '.$type.' Bowl',
                        'subtitle' => 'Plant-based demo option with vegetables and olive oil',
                        'ingredientsSummary' => $variant ? 'Sweet potato, chickpeas, carrots, olive oil' : 'Brown rice, lentils, spinach, olive oil',
                        'calories' => $type === 'Snack' ? 210 : 480, 'protein' => 18, 'carbs' => 54, 'fat' => 12,
                        'imageCategory' => 'bowl', 'whyThisMeal' => 'A simple seeded option matching supported ingredient tags. Not a medical recommendation.',
                        'evidence' => [
                            'id' => 'demo-nutrition', 'title' => 'Demo nutrition information', 'recommendation' => 'Review the listed ingredients and portions.',
                            'sources' => [['name' => 'Favia demo recipe library', 'publication' => 'Development seed data']],
                            'evidenceLevel' => 'Moderate', 'clinicalSummary' => 'Illustrative demo data; not a clinical study or medical advice.',
                        ],
                    ]);
                }
            }
            foreach ([
                'bowl' => 'monday-berry-chia-porridge',
                'salad' => 'monday-lemon-herb-chicken',
                'plate' => 'monday-salmon-quinoa-bowl',
                'smoothie' => 'monday-greek-yogurt-seeds',
                'soup' => 'monday-greek-yogurt-seeds',
            ] as $category => $image) {
                Recipe::where('image_category', $category)
                    ->where('image_url', 'like', 'https://images.unsplash.com/%')
                    ->update(['image_url' => '/meal-images/'.$image.'.png']);
            }
            $imageNames = ['ex-a1' => 'goblet-squat', 'ex-a2' => 'chest-supported-incline-dumbbell-row', 'ex-a3' => 'dumbbell-flat-bench-press', 'ex-a4' => 'pallof-anti-rotation-cable-hold', 'ex-a5' => 'seated-dumbbell-shoulder-press'];
            foreach ($this->data['workouts'] as $index => $w) {
                $workout = Workout::firstOrCreate(['slug' => $w['id']], [
                    'label' => $w['label'], 'name' => $w['title'], 'description' => $w['title'],
                    'estimated_duration' => $w['estimatedDuration'], 'difficulty' => $w['intensity'], 'muscle_groups' => $w['muscleGroups'],
                ]);
                foreach ($w['exercises'] as $order => $e) {
                    $visual = $this->data['visuals'][$e['id']] ?? null;
                    $exercise = Exercise::firstOrCreate(['slug' => $e['id']], [
                        'name' => $e['name'], 'category' => $e['category'], 'description' => $e['whyThisExercise'],
                        'instructions' => $visual ? $visual['startLabel'].'. '.$visual['finishLabel'].'.' : 'Use a comfortable, controlled range of movement.',
                        'is_modified' => $e['isModified'], 'modification_label' => $e['modificationLabel'] ?? null,
                        'original_exercise_name' => $e['originalExerciseName'] ?? null, 'adjustment_reason' => $e['adjustmentReason'] ?? null,
                        't1d_safety_note' => $e['t1dSafetyNote'] ?? null, 'visual' => $visual,
                        'image_url' => isset($imageNames[$e['id']]) ? '/exercise-images/'.$imageNames[$e['id']].'.png' : null,
                        'evidence_reference_id' => $this->evidence($e['evidence'])->id,
                    ]);
                    $workout->entries()->firstOrCreate(['sort_order' => $order], ['exercise_id' => $exercise->id, 'sets' => $e['sets'], 'reps' => $e['reps']]);
                    $alternatives = $e['isModified']
                        ? [['Belt Squat or Leg Press (Neutral Back Support)', 'Machine Alternative', 'A supported machine option from the prototype demo.'], ['Bodyweight Box Squat with Bands', 'Low-Load Mobility Option', 'A low-load demo option.']]
                        : [['Cable or Resistance Band Variation', 'Joint-Friendly Alternative', 'Provides continuous smooth tension profile.']];
                    foreach ($alternatives as $n => [$name, $status, $description]) {
                        $alternative = Exercise::firstOrCreate(['slug' => $e['id'].'-alternative-'.$n], [
                            'name' => $name, 'category' => $e['category'], 'description' => $description,
                            'instructions' => 'Use controlled movement within a comfortable range.', 'evidence_reference_id' => $exercise->evidence_reference_id,
                        ]);
                        ExerciseAlternative::firstOrCreate(['exercise_id' => $exercise->id, 'alternative_exercise_id' => $alternative->id], ['status' => $status, 'description' => $description]);
                    }
                }
                foreach ($users as $user) {
                    $user->workouts()->firstOrCreate(['workout_id' => $workout->id, 'scheduled_date' => $start->copy()->addDays($index * 2)]);
                }
            }
            foreach ([
                ['plan', 'Your weekly plan is ready', 'Your meal and workout plans are available.'],
                ['check-in', 'Daily check-in', 'Share how you feel before reviewing your workout.'],
                ['profile', 'Review your health profile', 'Keep your preferences and restrictions up to date.'],
            ] as [$type, $title, $message]) {
                foreach ($users as $user) {
                    $user->notifications()->firstOrCreate(['type' => $type], compact('title', 'message'));
                }
            }
        });
    }

    private function evidence(array $e): EvidenceReference
    {
        return EvidenceReference::firstOrCreate(['slug' => $e['id']], [
            'title' => $e['title'], 'recommendation' => $e['recommendation'], 'sources' => $e['sources'],
            'evidence_level' => $e['evidenceLevel'], 'clinical_summary' => $e['clinicalSummary'],
        ]);
    }

    private function recipe(array $meal): Recipe
    {
        $mealImageIds = [
            'mon-b1', 'mon-l1', 'mon-d1', 'mon-s1',
            'tue-b1', 'tue-l1', 'tue-d1', 'tue-s1',
            'wed-b1', 'wed-l1', 'wed-d1', 'wed-s1',
            'thu-b1', 'thu-l1', 'thu-d1', 'thu-s1',
            'fri-b1', 'fri-l1', 'fri-d1', 'fri-s1',
            'sat-b1', 'sat-l1', 'sat-d1', 'sat-s1',
            'sun-b1', 'sun-l1', 'sun-d1', 'sun-s1',
        ];
        $fallbackImages = [
            'bowl' => 'monday-berry-chia-porridge',
            'salad' => 'monday-lemon-herb-chicken',
            'plate' => 'monday-salmon-quinoa-bowl',
            'smoothie' => 'monday-greek-yogurt-seeds',
            'soup' => 'monday-greek-yogurt-seeds',
        ];
        $imageUrl = in_array($meal['id'], $mealImageIds, true)
            ? '/meal-images/meal-'.$meal['id'].'.png'
            : '/meal-images/'.$fallbackImages[$meal['imageCategory']].'.png';
        $ingredients = strtolower($meal['ingredientsSummary'].' '.$meal['name']);
        $tags = ['gluten_free']; // All original recipes explicitly use GF grains.
        foreach (['contains_nuts' => '/almond|walnut|cashew/', 'contains_dairy' => '/yogurt|cheese|ghee|labneh/', 'contains_eggs' => '/egg|omelette|frittata/', 'contains_soy' => '/tofu|edamame/', 'contains_fish' => '/salmon|tuna|halibut|cod/'] as $tag => $pattern) {
            if (preg_match($pattern, $ingredients)) {
                $tags[] = $tag;
            }
        }
        if (! in_array('contains_dairy', $tags)) {
            $tags[] = 'dairy_free';
        }
        if (! preg_match('/chicken|turkey|beef|bison|pork|bone broth|bones|salmon|tuna|halibut|cod/', $ingredients)) {
            $tags[] = 'vegetarian';
            if (! in_array('contains_dairy', $tags) && ! in_array('contains_eggs', $tags)) {
                $tags[] = 'vegan';
            }
        }
        if (str_starts_with($meal['id'], 'plant-')) {
            $tags = [...$tags, 'halal', 'kosher'];
        }
        $recipe = Recipe::firstOrCreate(['slug' => $meal['id']], [
            'name' => $meal['name'], 'description' => $meal['subtitle'], 'meal_type' => $meal['type'],
            'calories' => $meal['calories'], 'protein' => $meal['protein'], 'carbohydrates' => $meal['carbs'], 'fats' => $meal['fat'],
            'instructions' => 'Prepare the listed ingredients and serve as one balanced portion.',
            'research_summary' => $meal['whyThisMeal'], 'tags' => $tags, 'image_category' => $meal['imageCategory'],
            'image_alt' => $meal['name'], 'image_url' => $imageUrl,
            'evidence_reference_id' => $this->evidence($meal['evidence'])->id,
        ]);
        // Existing local demos may contain the retired Unsplash URLs; refresh only this static asset path.
        if ($recipe->image_url !== $imageUrl) {
            $recipe->update(['image_url' => $imageUrl]);
        }
        $portions = match ($meal['type']) {
            'Breakfast' => ['1 cup', '½ cup', '2 tbsp', '1 tsp'],
            'Lunch' => ['140 g', '¾ cup', '1 cup', '1 tbsp'],
            'Dinner' => ['160 g', '200 g', '1 cup', '1 tbsp'],
            default => ['170 g', '¼ cup', '2 tbsp', '1 tsp'],
        };
        foreach (explode(',', $meal['ingredientsSummary']) as $i => $name) {
            $recipe->ingredients()->firstOrCreate(['sort_order' => $i], [
                'name' => trim($name), 'quantity' => $portions[$i] ?? 'To taste', 'unit' => '',
            ]);
        }

        return $recipe;
    }
}
