<?php

namespace App\Models;

// ─── Framework & Third-Party Imports ──────────────────────────────────────────
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

// ─── Internal Imports ─────────────────────────────────────────────────────────
use Database\Factories\UserFactory;

/**
 * Model Pengguna (User)
 *
 * Merepresentasikan entitas pengguna sistem, yang dapat berperan sebagai
 * siswa (calon peserta didik) maupun admin. Model ini mengimplementasikan
 * kontrak MustVerifyEmail untuk memastikan akun diverifikasi melalui OTP
 * sebelum dapat mengakses sistem.
 *
 * @property int         $id
 * @property string      $username
 * @property string      $email
 * @property string      $password
 * @property string      $role                          'admin' atau 'siswa'
 * @property string|null $verification_code
 * @property \Carbon\Carbon|null $verification_code_expires_at
 * @property string|null $profile_photo_path
 * @property \Carbon\Carbon|null $email_verified_at
 */
#[Fillable(['username', 'email', 'password', 'role', 'verification_code', 'verification_code_expires_at', 'profile_photo_path'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    // ─── Attribute Casting ────────────────────────────────────────────────────

    /**
     * Mendefinisikan konversi tipe data otomatis untuk atribut tertentu.
     *
     * Casting 'hashed' pada password memastikan nilai selalu di-hash
     * secara otomatis oleh Laravel sebelum disimpan ke database.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at'              => 'datetime',
            'verification_code_expires_at'   => 'datetime',
            'password'                       => 'hashed',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    /**
     * Mendapatkan data pendaftaran yang dimiliki oleh pengguna ini.
     *
     * Relasi One-to-One: Satu pengguna hanya boleh memiliki
     * satu data pendaftaran aktif dalam satu periode SPMB.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function pendaftaran(): HasOne
    {
        return $this->hasOne(Pendaftaran::class);
    }

    // ─── Overrides ────────────────────────────────────────────────────────────

    /**
     * Override: Nonaktifkan pengiriman email verifikasi bawaan Laravel.
     *
     * Sistem ini menggunakan mekanisme OTP (One-Time Password) kustom
     * yang dikelola secara manual di AuthController, sehingga metode
     * notifikasi default dari framework sengaja dikosongkan.
     *
     * @return void
     */
    public function sendEmailVerificationNotification(): void
    {
        // Verifikasi ditangani secara manual melalui OTP di AuthController.
    }

    // ─── Role Helpers ─────────────────────────────────────────────────────────

    /**
     * Apakah user adalah administrator operasional
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Apakah user adalah Kepala Sekolah (Supervisor / Pengawas)
     */
    public function isKepalaSekolah(): bool
    {
        return $this->role === 'kepala_sekolah';
    }

    /**
     * Apakah user memiliki hak akses pengawasan/supervisor (Admin atau Kepala Sekolah)
     */
    public function isSupervisor(): bool
    {
        return in_array($this->role, ['admin', 'kepala_sekolah'], true);
    }

    /**
     * Apakah user berhak memutasi/mengubah data (Hanya Admin)
     */
    public function canMutate(): bool
    {
        return $this->role === 'admin';
    }
}

