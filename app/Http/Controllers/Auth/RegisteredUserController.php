<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Setting;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response|RedirectResponse
    {
        if (Setting::get('spmb_status', 'buka') === 'tutup') {
            return redirect('/')->with('error', 'Maaf, pendaftaran SPMB saat ini sedang ditutup.');
        }

        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        if (Setting::get('spmb_status', 'buka') === 'tutup') {
            return redirect('/')->with('error', 'Maaf, pendaftaran SPMB saat ini sedang ditutup.');
        }

        $request->validate([
            'username' => ['required', 'string', 'min:3', 'max:255', 'regex:/^[\pL\pN\s\-\_]+$/u', 'unique:'.User::class],
            'email'    => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'string', 'min:8', 'confirmed', Rules\Password::defaults()],
        ], [
            'password.min'       => 'Password minimal harus terdiri dari 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak sesuai.',
            'password.required'  => 'Kolom password wajib diisi.',
            'username.required'  => 'Kolom username wajib diisi.',
            'email.required'     => 'Alamat email aktif wajib diisi.',
            'email.unique'       => 'Alamat email ini sudah terdaftar.',
            'username.unique'    => 'Username ini sudah digunakan.',
        ]);

        $code = sprintf('%06d', rand(0, 999999));

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'siswa',
            'verification_code' => $code,
            'verification_code_expires_at' => now()->addMinutes(15),
        ]);

        event(new Registered($user));

        // Send OTP code via email
        $user->notify(new \App\Notifications\SendVerificationCode($code));

        return redirect()->route('verification.notice', ['email' => $user->email])
            ->with('status', 'Kode verifikasi telah dikirim ke email Anda.');
    }
}
