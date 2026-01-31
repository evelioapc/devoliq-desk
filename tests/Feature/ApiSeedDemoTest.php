<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ApiSeedDemoTest extends TestCase
{
    use RefreshDatabase;

    public function test_seed_demo_returns_404_when_not_local(): void
    {
        $company = Company::create([
            'name' => 'Test Co',
            'slug' => 'test-co',
            'plan' => 'free',
            'status' => 'active',
        ]);

        $user = User::create([
            'company_id' => $company->id,
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        config(['app.env' => 'production']);

        $response = $this->actingAs($user)
            ->postJson('/api/seed-demo');

        $response->assertStatus(404);

        config(['app.env' => 'testing']);
    }
}
