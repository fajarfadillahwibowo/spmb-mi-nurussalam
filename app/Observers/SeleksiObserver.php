<?php

namespace App\Observers;

// ─── Internal Imports ─────────────────────────────────────────────────────────
use App\Models\Seleksi;

/**
 * SeleksiObserver — Observer Notifikasi untuk Model Seleksi
 *
 * Catatan: Notifikasi perubahan status seleksi (lulus/tidak_lulus) sudah
 * ditangani oleh PendaftaranObserver melalui kolom `status` di tabel
 * pendaftarans — karena SeleksiController juga mengupdate kolom tersebut.
 *
 * Observer ini disiapkan sebagai lapisan extensibility untuk kebutuhan
 * di masa depan (misalnya notifikasi catatan tambahan dari admin).
 */
class SeleksiObserver
{
    // Notifikasi kelulusan ditangani di PendaftaranObserver.updated()
    // Tidak ada aksi tambahan yang diperlukan di sini saat ini.

    public function created(Seleksi $seleksi): void {}
    public function updated(Seleksi $seleksi): void {}
    public function deleted(Seleksi $seleksi): void {}
    public function restored(Seleksi $seleksi): void {}
    public function forceDeleted(Seleksi $seleksi): void {}
}
