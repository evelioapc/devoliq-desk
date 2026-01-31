<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'company_name' => ['required', 'string', 'max:120'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $slugBase = Str::slug($data['company_name']);
        $slug = $slugBase;
        $i = 1;
        while (Company::where('slug', $slug)->exists()) {
            $slug = $slugBase.'-'.$i++;
        }

        $company = Company::create([
            'name' => $data['company_name'],
            'slug' => $slug,
            'plan' => 'free',
            'status' => 'active',
        ]);

        $user = User::create([
            'company_id' => $company->id,
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'admin',
        ]);

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'company' => $company,
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        log_activity('login', null, ['email' => $user->email], $user);

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load('company'));
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:120'],
            'email' => ['sometimes', 'required', 'email', 'max:190', Rule::unique('users', 'email')->ignore($user)],
            'password' => ['sometimes', 'nullable', 'string', 'min:8', 'confirmed'],
            'locale' => ['sometimes', 'nullable', 'string', 'in:es,pt,en'],
        ]);

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json($user->load('company'));
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'OK']);
    }
}
