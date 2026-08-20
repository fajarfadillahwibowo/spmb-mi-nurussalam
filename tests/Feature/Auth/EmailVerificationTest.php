<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_email_verification_screen_can_be_rendered(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => null,
            'verification_code' => '123456',
            'verification_code_expires_at' => now()->addMinutes(15),
        ]);

        $response = $this->get('/verify-email?email=' . urlencode($user->email));

        $response->assertStatus(200);
    }

    public function test_email_can_be_verified_with_correct_code(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => null,
            'verification_code' => '123456',
            'verification_code_expires_at' => now()->addMinutes(15),
        ]);

        $response = $this->post('/verify-email', [
            'email' => $user->email,
            'code' => '123456',
        ]);

        $this->assertTrue($user->fresh()->hasVerifiedEmail());
        $this->assertNull($user->fresh()->verification_code);
        $response->assertRedirect(route('login'));
    }

    public function test_email_is_not_verified_with_incorrect_code(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => null,
            'verification_code' => '123456',
            'verification_code_expires_at' => now()->addMinutes(15),
        ]);

        $response = $this->post('/verify-email', [
            'email' => $user->email,
            'code' => '654321', // incorrect code
        ]);

        $this->assertFalse($user->fresh()->hasVerifiedEmail());
        $response->assertSessionHasErrors('code');
    }

    public function test_email_is_not_verified_with_expired_code(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => null,
            'verification_code' => '123456',
            'verification_code_expires_at' => now()->subMinutes(1), // expired
        ]);

        $response = $this->post('/verify-email', [
            'email' => $user->email,
            'code' => '123456',
        ]);

        $this->assertFalse($user->fresh()->hasVerifiedEmail());
        $response->assertSessionHasErrors('code');
    }
}
