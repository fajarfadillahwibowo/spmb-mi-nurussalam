<?php

namespace App\Jobs;

// ─── Framework & Third-Party Imports ──────────────────────────────────────────
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

// ─── Internal Imports ─────────────────────────────────────────────────────────
use App\Models\Pendaftaran;
use App\Services\WhatsAppService;

/**
 * Job: Pengiriman Notifikasi WhatsApp Konfirmasi Pembayaran
 *
 * Mengimplementasikan pola Command Pattern dengan Queue untuk mengirim
 * pesan WhatsApp secara asinkron kepada wali siswa setelah admin
 * memverifikasi bukti pembayaran.
 *
 * Alur desain:
 * - Job ini HANYA di-dispatch setelah DB::transaction sukses di web.php,
 *   sehingga jika database gagal, job ini tidak akan pernah masuk antrian.
 * - Implementasi ShouldQueue memastikan eksekusi berjalan di worker
 *   terpisah, sehingga tidak memblokir HTTP response ke admin.
 * - Mekanisme retry otomatis dengan backoff eksponensial melindungi
 *   sistem dari kegagalan sementara pada gateway WhatsApp (Fonnte API).
 */
class SendPembayaranNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // ─── Queue Configuration ──────────────────────────────────────────────────

    /**
     * Jumlah maksimum percobaan ulang otomatis jika job gagal.
     *
     * @var int
     */
    public int $tries = 3;

    /**
     * Batas waktu eksekusi per percobaan dalam satuan detik.
     *
     * @var int
     */
    public int $timeout = 30;

    /**
     * Mendefinisikan jeda waktu (detik) antar setiap percobaan ulang.
     *
     * Menggunakan pola backoff eksponensial: 60s → 5 menit → 15 menit.
     * Ini memberikan waktu bagi gateway WhatsApp untuk pulih dari gangguan sementara.
     *
     * @return array<int, int>
     */
    public function backoff(): array
    {
        return [60, 300, 900];
    }

    // ─── Constructor ──────────────────────────────────────────────────────────

    /**
     * Membuat instance Job dengan data yang diperlukan untuk membangun pesan.
     *
     * Seluruh properti dideklarasikan sebagai protected readonly karena data
     * yang dikirim ke Job tidak boleh dimodifikasi setelah Job dibuat.
     * SerializesModels trait menangani serialisasi/deserialisasi model Eloquent
     * secara otomatis ketika Job disimpan ke dan diambil dari antrian.
     *
     * @param  \App\Models\Pendaftaran  $pendaftaran    Data pendaftaran terbaru setelah update
     * @param  string                   $jenisPembayaran  Label jenis pembayaran (cth: "Uang Pangkal")
     * @param  float                    $nominalBaru    Nominal yang baru saja diverifikasi
     * @param  string                   $statusBaru     Status pembayaran baru: 'lunas' atau 'cicilan'
     * @param  string|null              $pdfUrl         URL absolut kuitansi PDF (opsional)
     */
    public function __construct(
        protected Pendaftaran $pendaftaran,
        protected string      $jenisPembayaran,
        protected float       $nominalBaru,
        protected string      $statusBaru,
        protected ?string     $pdfUrl = null,
    ) {}

    // ─── Job Handler ──────────────────────────────────────────────────────────

    /**
     * Mengeksekusi logika utama pengiriman notifikasi WhatsApp.
     *
     * WhatsAppService di-inject secara otomatis oleh Laravel Service Container
     * saat Job dieksekusi oleh worker. Jika pengiriman gagal, RuntimeException
     * dilempar agar Job masuk ke antrian retry secara otomatis sesuai konfigurasi
     * $tries dan backoff() yang telah didefinisikan.
     *
     * @param  \App\Services\WhatsAppService  $whatsApp
     * @return void
     *
     * @throws \RuntimeException  Ketika API Fonnte mengembalikan respons gagal
     */
    public function handle(WhatsAppService $whatsApp): void
    {
        $noHpWali    = $this->pendaftaran->no_hp_wali;
        $namaLengkap = $this->pendaftaran->nama_lengkap;

        // Guard: batalkan eksekusi jika nomor HP wali tidak tersedia.
        if (empty(trim($noHpWali))) {
            Log::warning('[WA Pembayaran Job] Dibatalkan: no_hp_wali kosong.', [
                'pendaftaran_id' => $this->pendaftaran->id,
                'nama'           => $namaLengkap,
            ]);

            return;
        }

        // Bangun teks pesan WhatsApp yang dipersonalisasi berdasarkan data pendaftaran.
        $pesan = $this->buildPesanPembayaran($namaLengkap);

        // Kirim pesan: sertakan lampiran PDF kuitansi jika URL-nya tersedia.
        if ($this->pdfUrl) {
            $result = $whatsApp->sendWithFile($noHpWali, $pesan, $this->pdfUrl, 'Kuitansi_Pembayaran.pdf');
        } else {
            $result = $whatsApp->send($noHpWali, $pesan);
        }

        if (! $result['success']) {
            $this->pendaftaran->update([
                'status_wa_bayar' => 'belum_terkirim',
            ]);

            // Lempar exception agar Queue Worker memasukkan Job ke antrian retry.
            throw new \RuntimeException(
                "[WA Pembayaran Job] Gagal kirim ke {$noHpWali}: {$result['message']}"
            );
        }

        $this->pendaftaran->update([
            'status_wa_bayar'  => 'terkirim',
            'wa_bayar_sent_at' => now(),
        ]);

        Log::info('[WA Pembayaran Job] Sukses dikirim.', [
            'pendaftaran_id' => $this->pendaftaran->id,
            'nama'           => $namaLengkap,
            'no_hp_wali'     => $noHpWali,
            'status_baru'    => $this->statusBaru,
            'nominal'        => $this->nominalBaru,
            'with_pdf'       => (bool) $this->pdfUrl,
        ]);
    }

    /**
     * Dipanggil ketika semua percobaan retry telah habis dan Job tetap gagal.
     *
     * Mencatat error final ke log sistem sebagai audit trail kegagalan
     * pengiriman notifikasi, agar dapat ditindaklanjuti secara manual.
     *
     * @param  \Throwable  $exception  Exception terakhir yang menyebabkan kegagalan
     * @return void
     */
    public function failed(\Throwable $exception): void
    {
        $this->pendaftaran->update([
            'status_wa_bayar' => 'belum_terkirim',
        ]);

        Log::error('[WA Pembayaran Job] GAGAL TOTAL setelah semua retry.', [
            'pendaftaran_id' => $this->pendaftaran->id,
            'nama'           => $this->pendaftaran->nama_lengkap,
            'no_hp_wali'     => $this->pendaftaran->no_hp_wali,
            'status_baru'    => $this->statusBaru,
            'error'          => $exception->getMessage(),
        ]);
    }

    // ─── Private Helpers ──────────────────────────────────────────────────────

    /**
     * Membangun teks pesan WhatsApp yang dinamis dan informatif.
     *
     * Pesan dikustomisasi berdasarkan status pembayaran:
     * - 'lunas' : Ucapan selamat dan tautan ke dashboard untuk unduh kuitansi.
     * - 'cicilan': Informasi total terbayar dan instruksi cicilan berikutnya.
     *
     * @param  string  $namaSiswa  Nama lengkap calon peserta didik
     * @return string              Teks pesan WhatsApp yang siap dikirim
     */
    private function buildPesanPembayaran(string $namaSiswa): string
    {
        $nominal     = 'Rp ' . number_format($this->nominalBaru, 0, ',', '.');
        $statusLabel = $this->statusBaru === 'lunas'
            ? '✅ *LUNAS*'
            : '🔄 *CICILAN (Sebagian Diterima)*';
        $appUrl      = config('app.url');

        // ─── Bangun Badan Pesan ───────────────────────────────────────────────
        $pesan  = "Assalamu'alaikum Wr. Wb.\n\n";
        $pesan .= "Yth. *{$namaSiswa}* / Wali Murid,\n\n";
        $pesan .= "Kami informasikan bahwa pembayaran untuk:\n";
        $pesan .= "🏷️ *Jenis:* {$this->jenisPembayaran}\n";
        $pesan .= "💰 *Nominal:* {$nominal}\n\n";
        $pesan .= "Telah kami terima dan berstatus {$statusLabel}.\n\n";

        if ($this->statusBaru === 'lunas') {
            $pesan .= "🎉 Selamat! Pembayaran Anda telah *LUNAS*. ";
            $pesan .= "Kuitansi resmi dapat diunduh melalui dashboard akun SPMB Anda.\n";
            $pesan .= "🔗 {$appUrl}/dashboard\n\n";
        } else {
            // Tampilkan total akumulasi untuk membantu wali memantau sisa cicilan.
            $totalTerbayar = 'Rp ' . number_format($this->pendaftaran->amount_paid, 0, ',', '.');
            $pesan .= "💡 Total terbayar saat ini: *{$totalTerbayar}*\n";
            $pesan .= "Silakan lakukan pembayaran berikutnya sesuai jadwal yang telah disepakati.\n\n";
        }

        if ($this->pdfUrl) {
            $pesan .= "📄 *Kuitansi PDF* terlampir di pesan ini.\n\n";
        }

        $pesan .= "Terima kasih atas kepercayaan Bapak/Ibu.\n";
        $pesan .= "Wassalamu'alaikum Wr. Wb.\n";
        $pesan .= "-- *Admin MI Nurussalam Sidogede* --";

        return $pesan;
    }
}
