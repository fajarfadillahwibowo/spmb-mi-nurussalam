<?php

namespace App\Mail;

use App\Models\Pendaftaran;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class KonfirmasiPembayaranMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Pendaftaran $pendaftaran,
        public float $nominalBaru,
        public string $statusBaru,
        public string $jenisPembayaran = 'Total Biaya Masuk'
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $senderEmail = Setting::get('email_sekolah') ?: config('mail.from.address');
        $senderName  = config('mail.from.name', 'MI Nurussalam Sidogede');

        return new Envelope(
            from: new Address($senderEmail, $senderName),
            subject: 'Konfirmasi Bukti Pembayaran SPMB — MI Nurussalam Sidogede',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $namaSiswa   = e($this->pendaftaran->nama_lengkap);
        $nominalFmt  = 'Rp ' . number_format($this->nominalBaru, 0, ',', '.');
        $statusLabel = $this->statusBaru === 'lunas' ? 'LUNAS' : 'CICILAN (DITERIMA)';
        $badgeBg     = $this->statusBaru === 'lunas' ? '#ecfdf5' : '#eff6ff';
        $badgeBorder = $this->statusBaru === 'lunas' ? '#10b981' : '#3b82f6';
        $badgeText   = $this->statusBaru === 'lunas' ? '#065f46' : '#1e40af';
        $portalUrl   = url('/dashboard');

        return new Content(
            htmlString: "
            <div style='font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;'>
                <div style='text-align: center; margin-bottom: 24px;'>
                    <h2 style='color: #059669; font-size: 22px; font-weight: 800; margin: 0;'>MI NURUSSALAM SIDOGEDE</h2>
                    <p style='color: #64748b; font-size: 13px; font-weight: 600; margin: 4px 0 0 0;'>Konfirmasi Pembayaran SPMB</p>
                </div>
                <div style='border-top: 2px solid #ecfdf5; margin-bottom: 24px;'></div>

                <p style='color: #334155; font-size: 15px; margin: 0 0 12px 0;'>Assalamu'alaikum Wr. Wb.</p>
                <p style='color: #334155; font-size: 15px; margin: 0 0 16px 0;'>Yth. Orang Tua / Wali dari <strong>{$namaSiswa}</strong>,</p>

                <p style='color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;'>
                    Kami informasikan bahwa pembayaran biaya pendaftaran calon siswa telah berhasil diverifikasi oleh Panitia Bendahara MI Nurussalam.
                </p>

                <div style='background-color: {$badgeBg}; border: 1px solid {$badgeBorder}; border-radius: 12px; padding: 18px; margin: 20px 0;'>
                    <table style='width: 100%; border-collapse: collapse; font-size: 13px;'>
                        <tr>
                            <td style='padding: 6px 0; color: #64748b; font-weight: 600;'>Komponen Pembayaran</td>
                            <td style='padding: 6px 0; color: #1e293b; font-weight: 700; text-align: right;'>{$this->jenisPembayaran}</td>
                        </tr>
                        <tr>
                            <td style='padding: 6px 0; color: #64748b; font-weight: 600;'>Nominal Diverifikasi</td>
                            <td style='padding: 6px 0; color: #059669; font-weight: 800; font-size: 15px; text-align: right;'>{$nominalFmt}</td>
                        </tr>
                        <tr>
                            <td style='padding: 6px 0; color: #64748b; font-weight: 600;'>Status Pembayaran</td>
                            <td style='padding: 6px 0; text-align: right;'>
                                <span style='background-color: {$badgeBorder}; color: #ffffff; padding: 3px 8px; border-radius: 6px; font-weight: 800; font-size: 11px;'>{$statusLabel}</span>
                            </td>
                        </tr>
                    </table>
                </div>

                <p style='color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;'>
                    Kuitansi pembayaran digital resmi dapat diakses dan diunduh langsung melalui dashboard akun SPMB Anda.
                </p>

                <div style='text-align: center; margin: 28px 0;'>
                    <a href='{$portalUrl}' style='display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.2);'>
                        Buka Dashboard Akun SPMB
                    </a>
                </div>

                <div style='border-top: 1px solid #f1f5f9; margin-top: 24px; padding-top: 16px; text-align: center;'>
                    <p style='color: #94a3b8; font-size: 12px; margin: 0;'>
                        Email ini dibuat dan dikirim secara otomatis oleh Panitia SPMB MI Nurussalam Sidogede.
                    </p>
                </div>
            </div>
            "
        );
    }
}
