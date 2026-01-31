<?php

namespace Tests\Feature;

use Tests\TestCase;

class WebRootRedirectTest extends TestCase
{
    public function test_root_redirects_to_login_when_not_authenticated(): void
    {
        $response = $this->get('/');

        $response->assertRedirect('/login');
    }

    public function test_login_page_returns_200(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }
}
