<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');
        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_username(): void
    {
        $user = User::factory()->create([
            'username' => 'siswa_test',
            'email_verified_at' => now(),
            'role' => 'siswa',
        ]);

        $response = $this->post('/login', [
            'login' => 'siswa_test',
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('pendaftaran.index', absolute: false));
    }

    public function test_users_can_authenticate_using_email(): void
    {
        $user = User::factory()->create([
            'email' => 'siswa@test.com',
            'email_verified_at' => now(),
            'role' => 'siswa',
        ]);

        $response = $this->post('/login', [
            'login' => 'siswa@test.com',
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('pendaftaran.index', absolute: false));
    }

    public function test_admin_user_is_redirected_to_dashboard_after_login(): void
    {
        $admin = User::factory()->create([
            'username' => 'admin_test',
            'email' => 'admin@test.com',
            'email_verified_at' => now(),
            'role' => 'admin',
        ]);

        $response = $this->post('/login', [
            'login' => 'admin_test',
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_unverified_users_cannot_login_and_are_redirected_to_verify_email(): void
    {
        $user = User::factory()->create([
            'username' => 'siswa_unverified',
            'email' => 'unverified@test.com',
            'email_verified_at' => null,
            'verification_code' => '123456',
            'verification_code_expires_at' => now()->addMinutes(15),
        ]);

        $response = $this->post('/login', [
            'login' => 'siswa_unverified',
            'password' => 'password',
        ]);

        $this->assertGuest();
        $response->assertRedirect(route('verification.notice', ['email' => 'unverified@test.com']));
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $this->post('/login', [
            'login' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }
}
