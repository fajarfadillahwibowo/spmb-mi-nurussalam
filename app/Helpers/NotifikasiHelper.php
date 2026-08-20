<?php

namespace App\Helpers;

// ─── Internal Imports ─────────────────────────────────────────────────────────
use App\Models\Notifikasi;
use App\Models\User;

/**
 * NotifikasiHelper — Static Helper untuk Pengiriman Notifikasi In-App
 *
 * Kelas ini adalah satu-satunya titik masuk untuk membuat notifikasi baru
 * dalam sistem. Semua Observer, Controller, dan logika bisnis lain
 * harus menggunakan kelas ini — bukan langsung membuat record Notifikasi.
 */
class NotifikasiHelper
{
    /**
     * Kirim notifikasi ke satu pengguna (siswa atau admin) secara personal.
     *
     * @param  int         $userId  ID pengguna penerima
     * @param  string      $title   Judul singkat notifikasi
     * @param  string      $message Isi pesan lengkap
     * @param  string|null $linkUrl URL tujuan saat notifikasi diklik
     * @return void
     */
    public static function kirimKePengguna(int $userId, string $title, string $message, ?string $linkUrl = null): void
    {
        try {
            Notifikasi::create([
                'user_id'  => $userId,
                'for_role' => 'siswa',
                'title'    => $title,
                'message'  => $message,
                'is_read'  => false,
                'link_url' => $linkUrl,
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('[NotifikasiHelper] Gagal kirim notifikasi ke user.', [
                'user_id' => $userId,
                'title'   => $title,
                'error'   => $e->getMessage(),
            ]);
        }
    }

    /**
     * Kirim notifikasi broadcast ke semua pengguna dengan role 'admin'.
     *
     * Notifikasi ini tidak terikat ke user_id spesifik — semua admin
     * yang login akan melihatnya melalui shared Inertia props.
     *
     * @param  string      $title   Judul singkat notifikasi
     * @param  string      $message Isi pesan lengkap
     * @param  string|null $linkUrl URL tujuan saat notifikasi diklik
     * @return void
     */
    public static function kirimKeSemuaAdmin(string $title, string $message, ?string $linkUrl = null): void
    {
        try {
            Notifikasi::create([
                'user_id'  => null,
                'for_role' => 'admin',
                'title'    => $title,
                'message'  => $message,
                'is_read'  => false,
                'link_url' => $linkUrl,
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('[NotifikasiHelper] Gagal kirim notifikasi broadcast admin.', [
                'title' => $title,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Tandai semua notifikasi milik user sebagai telah dibaca.
     * Mencakup notifikasi personal (user_id) dan broadcast (for_role).
     *
     * @param  \App\Models\User $user
     * @return void
     */
    public static function bacaSemuaMilikUser(User $user): void
    {
        Notifikasi::where('user_id', $user->id)
                  ->where('is_read', false)
                  ->update(['is_read' => true]);

        Notifikasi::whereNull('user_id')
                  ->where('for_role', $user->role)
                  ->where('is_read', false)
                  ->update(['is_read' => true]);
    }
}

