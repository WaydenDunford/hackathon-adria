<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class OwnUser
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->route('user');
        abort_if($user && (int) ($user instanceof User ? $user->id : $user) !== $request->user()->id, 404);
        $response = $next($request);
        $response->headers->set('Cache-Control', 'no-store, private');

        return $response;
    }
}
