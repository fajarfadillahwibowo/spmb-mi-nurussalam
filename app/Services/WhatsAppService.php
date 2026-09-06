<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected string $token;
    protected string $apiUrl;

    public function __construct()
    {
        $this->token  = config('services.fonnte.token', '');
        $this->apiUrl = config('services.fonnte.url', 'https://api.fonnte.com/send');
    }

    /**
     * Kirim pesan WhatsApp ke nomor tujuan.
     *
     * @param  string  $phoneNumber  Nomor WA (format: 08xxx atau 628xxx)
     * @param  string  $message      Isi pesan
     * @return array{success: bool, message: string}
     */
    public function send(string $phoneNumber, string $message): array
    {
        $normalizedNumber = $this->normalizePhoneNumber($phoneNumber);

        try {
            $response = Http::timeout(15)
                ->withHeaders(['Authorization' => $this->token])
                ->asForm()
                ->post($this->apiUrl, [
                    'target'  => $normalizedNumber,
                    'message' => $message,
                ]);

            if ($response->successful()) {
                $data = $response->json();

                if (isset($data['status']) && $data['status'] === true) {
                    Log::info('[WhatsApp] Pesan berhasil dikirim', [
                        'to'      => $normalizedNumber,
                        'preview' => substr($message, 0, 60) . '...',
                    ]);

                    return ['success' => true, 'message' => 'Pesan WhatsApp berhasil dikirim.'];
                }

                Log::warning('[WhatsApp] Response tidak valid dari Fonnte', [
                    'to'       => $normalizedNumber,
                    'response' => $data,
                ]);

                return [
                    'success' => false,
                    'message' => $data['reason'] ?? 'Gagal mengirim pesan ke gateway.',
                ];
            }

            Log::error('[WhatsApp] HTTP error dari Fonnte', [
                'to'     => $normalizedNumber,
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            return ['success' => false, 'message' => 'Gagal terhubung ke gateway WhatsApp (HTTP ' . $response->status() . ').'];

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('[WhatsApp] Gateway tidak dapat dihubungi (timeout/down)', [
                'to'    => $normalizedNumber,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'message' => 'Gateway WhatsApp tidak dapat dihubungi saat ini.'];

        } catch (\Exception $e) {
            Log::error('[WhatsApp] Unexpected error', [
                'to'    => $normalizedNumber,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'message' => 'Terjadi kesalahan tidak terduga: ' . $e->getMessage()];
        }
    }

    /**
     * Kirim pesan WhatsApp + lampiran file (misal PDF kuitansi) ke nomor tujuan.
     *
     * Fonnte mendukung parameter 'url' untuk melampirkan file via link publik.
     * File harus dapat diakses publik (http/https). Jika file tidak bisa diakses
     * publik, gunakan method send() biasa dan sertakan link di body pesan.
     *
     * @param  string  $phoneNumber   Nomor WA (format: 08xxx atau 628xxx)
     * @param  string  $message       Isi pesan teks
     * @param  string  $fileUrl       URL publik file yang akan dilampirkan
     * @param  string  $filename      Nama file yang tampil di WA (misal: Kuitansi.pdf)
     * @return array{success: bool, message: string}
     */
    public function sendWithFile(
        string $phoneNumber,
        string $message,
        string $fileUrl,
        string $filename = 'dokumen.pdf'
    ): array {
        $normalizedNumber = $this->normalizePhoneNumber($phoneNumber);

        try {
            $response = Http::timeout(30) // lebih lama karena upload file
                ->withHeaders(['Authorization' => $this->token])
                ->asForm()
                ->post($this->apiUrl, [
                    'target'   => $normalizedNumber,
                    'message'  => $message,
                    'url'      => $fileUrl,       // Parameter Fonnte untuk lampiran
                    'filename' => $filename,      // Nama file yang terlihat oleh penerima
                ]);

            if ($response->successful()) {
                $data = $response->json();

                if (isset($data['status']) && $data['status'] === true) {
                    Log::info('[WhatsApp] Pesan + file berhasil dikirim', [
                        'to'       => $normalizedNumber,
                        'file_url' => $fileUrl,
                    ]);
                    return ['success' => true, 'message' => 'Pesan WhatsApp + file berhasil dikirim.'];
                }

                Log::warning('[WhatsApp] Response tidak valid (dengan file) dari Fonnte', [
                    'to'       => $normalizedNumber,
                    'response' => $data,
                ]);

                // Fallback: coba kirim pesan teks saja (tanpa file)
                Log::info('[WhatsApp] Mencoba fallback: kirim teks saja tanpa file...');
                return $this->send($phoneNumber, $message . "\n\n📎 Kuitansi: {$fileUrl}");
            }

            Log::error('[WhatsApp] HTTP error (dengan file) dari Fonnte', [
                'to'     => $normalizedNumber,
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            return ['success' => false, 'message' => 'Gagal mengirim file via gateway WhatsApp (HTTP ' . $response->status() . ').'];

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('[WhatsApp] Gateway tidak dapat dihubungi saat kirim file', [
                'to'    => $normalizedNumber,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'message' => 'Gateway WhatsApp tidak dapat dihubungi saat ini.'];

        } catch (\Exception $e) {
            Log::error('[WhatsApp] Unexpected error saat kirim file', [
                'to'    => $normalizedNumber,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'message' => 'Terjadi kesalahan tidak terduga: ' . $e->getMessage()];
        }
    }

    /**
     * Normalisasi nomor HP Indonesia ke format 628xxxx
     */
    public function normalizePhoneNumber(string $phone): string
    {
        $phone = preg_replace('/\D/', '', $phone);

        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        }

        if (!str_starts_with($phone, '62')) {
            $phone = '62' . $phone;
        }

        return $phone;
    }

    /**
     * Build pesan WA untuk siswa yang LULUS seleksi
     */
    public static function buildLulusMessage(string $namaSiswa): string
    {
        return "Assalamu'alaikum Wr. Wb.\n\n"
            . "*Selamat {$namaSiswa}!*\n\n"
            . "Anda dinyatakan *DITERIMA / LULUS* sebagai calon peserta didik baru "
            . "MI Nurussalam Sidogede.\n\n"
            . "*Langkah Selanjutnya:*\n"
            . "Silakan unduh *Surat Keputusan Penerimaan Murid Baru* melalui website SPMB Nurussalam.\n\n"
            . "Masuk ke halaman *Pengumuman* untuk mengunduh surat tersebut.\n\n"
            . "_Surat yang telah diunduh harap di-print dan dibawa ke sekolah ya._\n\n"
            . "Wassalamu'alaikum Wr. Wb.\n"
            . "-- Admin MI Nurussalam Sidogede";
    }

    /**
     * Build pesan WA untuk siswa yang TIDAK LULUS seleksi
     */
    public static function buildTidakLulusMessage(string $namaSiswa): string
    {
        return "Assalamu'alaikum Wr. Wb.\n\n"
            . "Yth. Wali dari *{$namaSiswa}*,\n\n"
            . "Kami sampaikan bahwa setelah melalui proses seleksi, "
            . "ananda *{$namaSiswa}* belum dapat kami terima sebagai peserta didik baru "
            . "MI Nurussalam Sidogede pada tahun ajaran ini.\n\n"
            . "Terima kasih atas kepercayaan Bapak/Ibu. Semoga ananda mendapatkan yang terbaik.\n\n"
            . "Wassalamu'alaikum Wr. Wb.\n"
            . "-- Admin MI Nurussalam Sidogede";
    }

    /**
     * Build pesan WA untuk pemberitahuan perbaikan berkas / dokumen
     */
    public static function buildPerbaikanDokumenMessage(string $namaSiswa, string $catatan): string
    {
        return "Assalamu'alaikum Wr. Wb.\n\n"
            . "Yth. Wali dari *{$namaSiswa}*,\n\n"
            . "Panitia SPMB MI Nurussalam telah melakukan pemeriksaan berkas pendaftaran ananda.\n\n"
            . "⚠️ *Pemberitahuan Perbaikan Dokumen:*\n"
            . "{$catatan}\n\n"
            . "Mohon untuk segera masuk ke akun website SPMB MI Nurussalam pada menu *Unggah Dokumen* untuk mengunggah ulang dokumen yang sesuai, jelas, dan valid.\n\n"
            . "Wassalamu'alaikum Wr. Wb.\n"
            . "-- Panitia SPMB MI Nurussalam Sidogede";
    }

    /**
     * Build pesan WA untuk pemberitahuan perbaikan data diri / biodata
     */
    public static function buildPerbaikanBiodataMessage(string $namaSiswa, string $catatan): string
    {
        return "Assalamu'alaikum Wr. Wb.\n\n"
            . "Yth. Wali dari *{$namaSiswa}*,\n\n"
            . "Panitia SPMB MI Nurussalam telah memeriksa data formulir biodata pendaftaran ananda.\n\n"
            . "📝 *Catatan Pembaruan Biodata:*\n"
            . "{$catatan}\n\n"
            . "Mohon untuk segera masuk ke akun website SPMB MI Nurussalam pada menu *Formulir Pendaftaran* untuk memperbarui data tersebut dengan benar.\n\n"
            . "Wassalamu'alaikum Wr. Wb.\n"
            . "-- Panitia SPMB MI Nurussalam Sidogede";
    }
}
