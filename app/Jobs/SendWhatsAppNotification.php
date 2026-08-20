<?php

namespace App\Jobs;

use App\Models\Pendaftaran;
use App\Services\WhatsAppService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendWhatsAppNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Jumlah percobaan ulang jika job gagal.
     */
    public int $tries = 3;

    /**
     * Timeout per eksekusi job (detik).
     */
    public int $timeout = 30;

    /**
     * Delay antar retry: 60s -> 5 menit -> 15 menit.
     */
    public function backoff(): array
    {
        return [60, 300, 900];
    }

    /**
     * Create a new job instance.
     */
    public function __construct(
        protected Pendaftaran $pendaftaran,
        protected string      $statusSeleksi
    ) {}

    /**
     * Execute the job.
     */
    public function handle(WhatsAppService $whatsApp): void
    {
        $namaLengkap = $this->pendaftaran->nama_lengkap;
        $noHpWali    = $this->pendaftaran->no_hp_wali;

        // Validasi: jangan kirim jika nomor tidak tersedia
        if (empty($noHpWali)) {
            Log::warning('[WhatsApp Job] Tidak dikirim: no_hp_wali kosong', [
                'pendaftaran_id' => $this->pendaftaran->id,
                'nama'           => $namaLengkap,
            ]);
            return;
        }

        // Pilih template pesan sesuai status seleksi
        $pesan = match ($this->statusSeleksi) {
            'lulus'       => WhatsAppService::buildLulusMessage($namaLengkap),
            'tidak_lulus' => WhatsAppService::buildTidakLulusMessage($namaLengkap),
            default       => null,
        };

        // Hanya kirim untuk status yang relevan
        if ($pesan === null) {
            Log::info('[WhatsApp Job] Tidak dikirim: status tidak memerlukan notifikasi', [
                'status' => $this->statusSeleksi,
            ]);
            return;
        }

        $result = $whatsApp->send($noHpWali, $pesan);

        if (! $result['success']) {
            // Lempar exception agar Job di-retry otomatis sesuai backoff
            throw new \RuntimeException(
                "[WhatsApp Job] Gagal kirim ke {$noHpWali}: {$result['message']}"
            );
        }

        Log::info('[WhatsApp Job] Selesai sukses', [
            'pendaftaran_id' => $this->pendaftaran->id,
            'nama'           => $namaLengkap,
            'status'         => $this->statusSeleksi,
        ]);
    }

    /**
     * Jalankan saat semua percobaan retry habis dan tetap gagal.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('[WhatsApp Job] GAGAL TOTAL setelah semua retry', [
            'pendaftaran_id' => $this->pendaftaran->id,
            'nama'           => $this->pendaftaran->nama_lengkap,
            'no_hp_wali'     => $this->pendaftaran->no_hp_wali,
            'status'         => $this->statusSeleksi,
            'error'          => $exception->getMessage(),
        ]);
    }
}
