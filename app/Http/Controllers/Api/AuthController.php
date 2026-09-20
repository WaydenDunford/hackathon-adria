<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PlanResource;
use App\Models\User;
use App\Services\AccountSetup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function session(Request $request)
    {
        $user = $request->user()?->loadMissing('plan.features');

        return response()->json([
            'user' => $user ? [...$user->only(['id', 'name', 'username', 'onboarded_at']), 'plan' => (new PlanResource($user->plan))->resolve()] : null,
            'csrfToken' => csrf_token(),
            'demoUsers' => config('favia.demo_enabled') ? User::whereIn('email', config('favia.demo_emails'))->get(['name', 'email']) : [],
        ])->header('Cache-Control', 'no-store, private');
    }

    public function register(Request $request, AccountSetup $setup)
    {
        if (is_string($request->input('email'))) {
            $request->merge(['email' => strtolower(trim($request->input('email')))]);
        }
        if (is_string($request->input('name'))) {
            $request->merge(['name' => trim($request->input('name'))]);
        }
        if (is_string($request->input('username'))) {
            $request->merge(['username' => strtolower(trim($request->input('username')))]);
        }
        $values = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'username' => ['required', 'string', 'min:3', 'max:30', 'regex:/^[a-z0-9_]+$/', 'unique:users,username'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email', function ($attribute, $value, $fail) {
                if (in_array($value, config('favia.demo_emails'))) {
                    $fail('This email is reserved for demo access.');
                }
            }],
            'password' => ['required', 'confirmed', 'max:128', Password::min(12)],
        ]);
        $user = DB::transaction(function () use ($values, $setup) {
            $user = User::create($values);
            $setup->create($user);

            return $user;
        });
        Auth::login($user);
        $request->session()->regenerate();

        return $this->session($request)->setStatusCode(201);
    }

    public function login(Request $request)
    {
        if (is_string($request->input('identifier'))) {
            $request->merge(['identifier' => trim($request->input('identifier'))]);
        }
        $values = $request->validate(['identifier' => ['required', 'string', 'max:255'], 'password' => ['required', 'string', 'max:128']]);
        $user = User::query()
            ->whereRaw('lower(email) = ?', [strtolower($values['identifier'])])
            ->orWhere('username', strtolower($values['identifier']))
            ->first();
        if (! $user || ! Hash::check($values['password'], $user->password)) {
            throw ValidationException::withMessages(['identifier' => 'The email, username, or password is incorrect.']);
        }
        Auth::login($user);
        $request->session()->regenerate();

        return $this->session($request);
    }

    public function demo(Request $request)
    {
        abort_unless(config('favia.demo_enabled'), 404);
        $values = $request->validate(['email' => ['required', 'string', Rule::in(config('favia.demo_emails'))]]);
        Auth::login(User::where('email', $values['email'])->firstOrFail());
        $request->session()->regenerate();

        return $this->session($request);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->session($request);
    }
}
