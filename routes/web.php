<?php

use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(base_path('routes/api.php'));

Route::fallback(function () {
    abort_if(request()->is('api/*') || request()->is('meal-images/*') || request()->is('exercise-images/*'), 404);
    $app = public_path('build/index.html');

    abort_unless(is_file($app), 404, 'The frontend has not been built. Run npm run build.');

    return response()->file($app);
});
