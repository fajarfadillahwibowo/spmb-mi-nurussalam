<?php

namespace App\Observers;

// ─── Internal Imports ─────────────────────────────────────────────────────────
use App\Helpers\NotifikasiHelper;
use App\Models\Pendaftaran;

/**
 * PendaftaranObserver — Observer Notifikasi untuk Model Pendaftaran
 *
 * Observer ini secara otomatis memicu notifikasi in-app berdasarkan
 * perubahan yang terjadi pada model Pendaftaran. Logika di sini
 * TIDAK mengubah data pendaftaran, hanya membaca dan membuat notifikasi.
 *
 * Skenario yang ditangani:
 *  - created()  : Notif admin saat pendaftar baru muncul
 *  - updated()  : Notif siswa/admin berdasarkan perubahan status & payment_status
 */
class PendaftaranObserver
{
    /**
     * Dipanggil saat data pendaftaran BARU berhasil dibuat.
     *
     * Trigger: Siswa pertama kali mengisi dan menyimpan biodata.
     * Aksi   : Kirim notifikasi ke semua admin tentang pendaftar baru.
     */
    public function created(Pendaftaran $pendaftaran): void
    {
        $nama = $pendaftaran->nama_lengkap ?? 'Siswa Baru';

        NotifikasiHelper::kirimKeSemuaAdmin(
            title:   '🧑‍🎓 Pendaftar Baru',
            message: "Pendaftar Baru: {$nama} telah mendaftar pada sistem.",
            linkUrl: '/data-pendaftar'
        );

        // Konfirmasi ke siswa bahwa biodata berhasil disimpan
        if ($pendaftaran->user_id) {
            NotifikasiHelper::kirimKePengguna(
                userId:  $pendaftaran->user_id,
                title:   '✅ Biodata Tersimpan',
                message: 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.',
                linkUrl: '/dokumen'
            );
        }
    }

    /**
     * Dipanggil setiap kali data pendaftaran DIPERBARUI.
     *
     * Observer mendeteksi perubahan spesifik pada kolom-kolom kritis
     * menggunakan wasChanged() dan getOriginal() agar notifikasi hanya
     * dikirim saat benar-benar ada perubahan yang relevan.
     *
     * Skenario status utama:
     *  - lulus / tidak_lulus : Notif kelulusan ke siswa
     *  - proses_seleksi      : Notif "sedang diproses" ke siswa
     *
     * Skenario payment_status:
     *  - menunggu_konfirmasi : Notif ke siswa (upload berhasil) + admin (bayar masuk)
     *  - lunas               : Notif "LUNAS" ke siswa
     *  - cicilan             : Notif "cicilan diverifikasi" ke siswa
     *  - belum_bayar         : Jika sebelumnya 'menunggu_konfirmasi' = ditolak
     */
    public function updated(Pendaftaran $pendaftaran): void
    {
        $userId = $pendaftaran->user_id;
        $nama   = $pendaftaran->nama_lengkap ?? 'Siswa';

        // ── Perubahan Status Seleksi ─────────────────────────────────────────
        if ($pendaftaran->wasChanged('status')) {
            $statusBaru = $pendaftaran->status;

            match ($statusBaru) {
                'lulus' => NotifikasiHelper::kirimKePengguna(
                    userId:  $userId,
                    title:   '🎉 Selamat! Anda Dinyatakan LULUS',
                    message: 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.',
                    linkUrl: '/pengumuman'
                ),

                'tidak_lulus' => NotifikasiHelper::kirimKePengguna(
                    userId:  $userId,
                    title:   '❌ Hasil Seleksi Diperbarui',
                    message: 'Mohon maaf, status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.',
                    linkUrl: '/pengumuman'
                ),

                'proses_seleksi' => NotifikasiHelper::kirimKePengguna(
                    userId:  $userId,
                    title:   '🔍 Berkas Sedang Diproses',
                    message: 'Berkas pendaftaran Anda sedang dalam proses seleksi oleh panitia. Mohon ditunggu.',
                    linkUrl: '/seleksi-siswa'
                ),

                default => null,
            };
        }

        // ── Perubahan Status Pembayaran ──────────────────────────────────────
        if ($pendaftaran->wasChanged('payment_status')) {
            $payStatusBaru  = $pendaftaran->payment_status;
            $payStatusLama  = $pendaftaran->getOriginal('payment_status');

            match (true) {

                // Siswa baru upload bukti bayar → notif ke siswa + admin
                $payStatusBaru === 'menunggu_konfirmasi' => $this->handleBuktiDiunggah($pendaftaran, $nama, $userId),

                // Admin approve: lunas
                $payStatusBaru === 'lunas' => NotifikasiHelper::kirimKePengguna(
                    userId:  $userId,
                    title:   '💚 Pembayaran Lunas!',
                    message: 'Pembayaran Anda telah diverifikasi dan dinyatakan LUNAS/SAH. Terima kasih!',
                    linkUrl: '/pembayaran'
                ),

                // Admin approve: cicilan
                $payStatusBaru === 'cicilan' && $payStatusLama === 'menunggu_konfirmasi' => NotifikasiHelper::kirimKePengguna(
                    userId:  $userId,
                    title:   '✅ Cicilan Pembayaran Diverifikasi',
                    message: 'Pembayaran cicilan Anda telah diverifikasi. Harap selesaikan sisa pembayaran pada jadwal berikutnya.',
                    linkUrl: '/pembayaran'
                ),

                // Admin reject (kembalikan ke belum_bayar)
                $payStatusBaru === 'belum_bayar' && $payStatusLama === 'menunggu_konfirmasi' => NotifikasiHelper::kirimKePengguna(
                    userId:  $userId,
                    title:   '⚠️ Bukti Pembayaran Ditolak',
                    message: 'Bukti pembayaran tidak valid. Silakan unggah ulang bukti transfer yang sesuai dan terbaca jelas.',
                    linkUrl: '/pembayaran'
                ),

                default => null,
            };
        }
    }

    /**
     * Tangani skenario saat siswa mengunggah bukti pembayaran.
     * Mengirim notifikasi ke dua pihak: siswa (konfirmasi) dan admin (ada bayar masuk).
     */
    private function handleBuktiDiunggah(Pendaftaran $pendaftaran, string $nama, ?int $userId): void
    {
        // Notif ke siswa: konfirmasi upload berhasil
        if ($userId) {
            NotifikasiHelper::kirimKePengguna(
                userId:  $userId,
                title:   '📤 Bukti Pembayaran Diunggah',
                message: 'Bukti pembayaran Anda berhasil diunggah dan sedang dalam proses verifikasi admin. Harap tunggu konfirmasi.',
                linkUrl: '/pembayaran'
            );
        }

        // Notif ke semua admin: ada pembayaran masuk yang perlu diverifikasi
        NotifikasiHelper::kirimKeSemuaAdmin(
            title:   '💰 Pembayaran Baru Masuk',
            message: "Pembayaran Baru: {$nama} telah mengunggah bukti pembayaran. Harap segera verifikasi.",
            linkUrl: '/pembayaran-admin'
        );
    }

    // ── Event tidak digunakan ─────────────────────────────────────────────────
    public function deleted(Pendaftaran $pendaftaran): void {}
    public function restored(Pendaftaran $pendaftaran): void {}
    public function forceDeleted(Pendaftaran $pendaftaran): void {}
}
