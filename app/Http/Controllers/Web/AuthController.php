<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($data, (bool) $request->boolean('remember'))) {
            return back()->withErrors(['email' => 'Credenciales inválidas.'])->onlyInput('email');
        }

        $request->session()->regenerate();
        $user = Auth::user();
        log_activity('login', null, ['email' => $user->email], $user);

        return redirect()->intended('/');
    }

    public function showRegister(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request): RedirectResponse
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

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended('/');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
