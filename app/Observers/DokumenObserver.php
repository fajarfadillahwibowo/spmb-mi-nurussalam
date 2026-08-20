<?php

namespace App\Observers;

// ─── Internal Imports ─────────────────────────────────────────────────────────
use App\Helpers\NotifikasiHelper;
use App\Models\Dokumen;

/**
 * DokumenObserver — Observer Notifikasi untuk Model Dokumen
 *
 * Memicu notifikasi saat siswa pertama kali mengunggah dokumen (created)
 * atau memperbarui/upload ulang dokumen yang sudah ada (updated).
 */
class DokumenObserver
{
    /**
     * Dipanggil saat rekaman Dokumen BARU dibuat (pertama kali upload).
     *
     * Trigger: Siswa berhasil mengunggah dokumen untuk pertama kalinya.
     * Aksi   : Notif konfirmasi ke siswa + notif ke admin.
     */
    public function created(Dokumen $dokumen): void
    {
        // Ambil data pendaftaran terkait untuk mendapatkan user_id dan nama
        $pendaftaran = $dokumen->pendaftaran;

        if (! $pendaftaran) {
            return;
        }

        $userId = $pendaftaran->user_id;
        $nama   = $pendaftaran->nama_lengkap ?? 'Siswa';

        // Notif ke siswa: konfirmasi dokumen berhasil diunggah
        if ($userId) {
            NotifikasiHelper::kirimKePengguna(
                userId:  $userId,
                title:   '📄 Dokumen Berhasil Diunggah',
                message: 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.',
                linkUrl: '/dokumen'
            );
        }

        // Notif ke admin: ada berkas baru yang perlu diverifikasi
        NotifikasiHelper::kirimKeSemuaAdmin(
            title:   '📋 Dokumen Baru Diunggah',
            message: "Update Berkas: {$nama} telah mengunggah dokumen persyaratan. Silakan verifikasi.",
            linkUrl: '/verifikasi-berkas'
        );
    }

    /**
     * Dipanggil saat rekaman Dokumen DIPERBARUI (upload ulang/ganti file).
     *
     * Trigger: Siswa mengunggah ulang salah satu atau beberapa dokumen.
     * Aksi   : Notif ke admin bahwa ada pembaruan berkas.
     */
    public function updated(Dokumen $dokumen): void
    {
        $pendaftaran = $dokumen->pendaftaran;

        if (! $pendaftaran) {
            return;
        }

        $nama = $pendaftaran->nama_lengkap ?? 'Siswa';

        // Notif ke admin: ada berkas yang diperbarui
        NotifikasiHelper::kirimKeSemuaAdmin(
            title:   '🔄 Berkas Diperbarui',
            message: "Update Berkas: {$nama} telah memperbarui/mengunggah ulang dokumen persyaratan.",
            linkUrl: '/verifikasi-berkas'
        );
    }

    // ── Event tidak digunakan ─────────────────────────────────────────────────
    public function deleted(Dokumen $dokumen): void {}
    public function restored(Dokumen $dokumen): void {}
    public function forceDeleted(Dokumen $dokumen): void {}
}
