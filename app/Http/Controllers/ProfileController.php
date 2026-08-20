<?php

namespace App\Http\Controllers;

// ─── Framework & Third-Party Imports ──────────────────────────────────────────
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

// ─── Internal Imports ─────────────────────────────────────────────────────────
use App\Http\Requests\ProfileUpdateRequest;

/**
 * Controller Profil (Manajemen Akun Pengguna)
 *
 * Menangani operasi CRUD yang berkaitan dengan data profil pengguna yang
 * sedang terautentikasi, mencakup penampilan formulir profil, pembaruan
 * informasi profil, dan penghapusan akun secara permanen.
 */
class ProfileController extends Controller
{
    /**
     * Menampilkan formulir pengeditan profil pengguna.
     *
     * Memeriksa apakah pengguna mengimplementasikan kontrak MustVerifyEmail
     * untuk menentukan apakah notifikasi verifikasi email perlu ditampilkan.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status'          => session('status'),
        ]);
    }

    /**
     * Memperbarui informasi profil pengguna yang terautentikasi.
     *
     * Menggunakan ProfileUpdateRequest sebagai Form Request khusus yang
     * mengenkapsulasi logika validasi dan otorisasi. Jika email diubah,
     * status verifikasi email direset untuk memaksa verifikasi ulang.
     * Jika ada foto profil baru, file lama dihapus terlebih dahulu untuk
     * menghindari penumpukan file yang tidak terpakai (orphan files).
     *
     * @param  \App\Http\Requests\ProfileUpdateRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->validated());

        if ($request->hasFile('profile_photo')) {
            // Hapus foto lama dari storage sebelum digantikan foto baru.
            if ($user->profile_photo_path) {
                Storage::disk('public')->delete($user->profile_photo_path);
            }

            $user->profile_photo_path = $request->file('profile_photo')->store('profile-photos', 'public');
        }

        // Jika email berubah, reset status verifikasi agar pengguna melakukan verifikasi ulang.
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit')->with('status', 'Profil berhasil diperbarui!');
    }

    /**
     * Menghapus akun pengguna yang terautentikasi secara permanen.
     *
     * Memverifikasi kata sandi pengguna sebelum melakukan penghapusan
     * sebagai langkah keamanan tambahan. Setelah pengguna dihapus,
     * sesi diinvalidasi dan token CSRF diregenerasi untuk mencegah
     * serangan CSRF pasca-penghapusan.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Request $request): RedirectResponse
    {
        // Konfirmasi kata sandi wajib dilakukan sebelum penghapusan akun.
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        // Logout terlebih dahulu agar sesi aktif tidak terkontaminasi data akun yang dihapus.
        Auth::logout();

        $user->delete();

        // Invalidasi sesi dan regenerasi token CSRF pasca-logout untuk keamanan.
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
