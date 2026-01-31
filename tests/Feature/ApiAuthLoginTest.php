<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ApiAuthLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_returns_token_with_valid_credentials(): void
    {
        $company = Company::create([
            'name' => 'Test Co',
            'slug' => 'test-co',
            'plan' => 'free',
            'status' => 'active',
        ]);

        User::create([
            'company_id' => $company->id,
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['user', 'token'])
            ->assertJsonPath('user.email', 'test@example.com');
    }

    public function test_login_returns_401_with_invalid_credentials(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'nobody@example.com',
            'password' => 'wrong',
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Credenciales inválidas']);
    }
}
