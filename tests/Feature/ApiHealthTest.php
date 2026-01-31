<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiHealthTest extends TestCase
{
    public function test_health_endpoint_returns_ok_and_app_name(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
                'app' => 'devoliq-desk',
            ]);
    }
}
