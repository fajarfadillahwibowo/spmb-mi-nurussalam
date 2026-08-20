<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\SendVerificationCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationController extends Controller
{
    /**
     * Display the email verification page.
     */
    public function show(Request $request): Response
    {
        return Inertia::render('Auth/VerifyEmail', [
            'email' => $request->query('email'),
            'status' => session('status'),
            'error' => session('error'),
        ]);
    }

    /**
     * Verify the 6-digit code.
     */
    public function verify(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return redirect()->back()->with('error', 'User tidak ditemukan.');
        }

        if ($user->email_verified_at) {
            return redirect()->route('login')->with('status', 'Email Anda sudah terverifikasi.');
        }

        if ($user->verification_code !== $request->code) {
            return redirect()->back()->withErrors(['code' => 'Kode verifikasi tidak cocok.']);
        }

        if ($user->verification_code_expires_at && now()->greaterThan($user->verification_code_expires_at)) {
            return redirect()->back()->withErrors(['code' => 'Kode verifikasi telah kedaluwarsa. Silakan minta kode baru.']);
        }

        $user->forceFill([
            'email_verified_at' => now(),
            'verification_code' => null,
            'verification_code_expires_at' => null,
        ])->save();

        return redirect()->route('login')->with('status', 'Email Anda berhasil diverifikasi! Silakan login.');
    }

    /**
     * Resend the verification code.
     */
    public function resend(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->email_verified_at) {
            return redirect()->route('login')->with('status', 'Email Anda sudah terverifikasi.');
        }

        $code = sprintf('%06d', rand(0, 999999));

        $user->forceFill([
            'verification_code' => $code,
            'verification_code_expires_at' => now()->addMinutes(15),
        ])->save();

        $user->notify(new SendVerificationCode($code));

        return redirect()->back()->with('status', 'Kode verifikasi baru telah dikirim.');
    }
}
