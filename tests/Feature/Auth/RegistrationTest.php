<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Notifications\SendVerificationCode;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');
        $response->assertStatus(200);
    }

    public function test_new_users_can_register_and_receive_otp(): void
    {
        Notification::fake();

        $response = $this->post('/register', [
            'username' => 'siswa_baru',
            'email' => 'siswabaru@gmail.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        // User is not authenticated
        $this->assertGuest();

        // User database record created
        $user = User::where('username', 'siswa_baru')->first();
        $this->assertNotNull($user);
        $this->assertNull($user->email_verified_at);
        $this->assertNotNull($user->verification_code);
        $this->assertEquals(6, strlen($user->verification_code));

        // Redirects to verification screen
        $response->assertRedirect(route('verification.notice', ['email' => 'siswabaru@gmail.com']));

        // Check if OTP mail notification was dispatched
        Notification::assertSentTo($user, SendVerificationCode::class);
    }
}
