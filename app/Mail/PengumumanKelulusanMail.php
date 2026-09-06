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

class PengumumanKelulusanMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(public Pendaftaran $pendaftaran) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $senderEmail = Setting::get('email_sekolah') ?: config('mail.from.address');
        $senderName  = config('mail.from.name', 'MI Nurussalam Sidogede');

        return new Envelope(
            from: new Address($senderEmail, $senderName),
            subject: 'Pengumuman Hasil Seleksi SPMB — MI Nurussalam Sidogede',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $namaSiswa = e($this->pendaftaran->nama_lengkap);
        $portalUrl = url('/pengumuman');

        return new Content(
            htmlString: "
            <div style='font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;'>
                <div style='text-align: center; margin-bottom: 24px;'>
                    <h2 style='color: #059669; font-size: 22px; font-weight: 800; margin: 0;'>MI NURUSSALAM SIDOGEDE</h2>
                    <p style='color: #64748b; font-size: 13px; font-weight: 600; margin: 4px 0 0 0;'>Sistem Penerimaan Murid Baru (SPMB)</p>
                </div>
                <div style='border-top: 2px solid #ecfdf5; margin-bottom: 24px;'></div>

                <p style='color: #334155; font-size: 15px; margin: 0 0 12px 0;'>Assalamu'alaikum Wr. Wb.</p>
                <p style='color: #334155; font-size: 15px; margin: 0 0 16px 0;'>Yth. Orang Tua / Wali dari <strong>{$namaSiswa}</strong>,</p>

                <div style='background-color: #ecfdf5; border: 1px solid #a7f3d0; border-left: 5px solid #10b981; border-radius: 8px; padding: 16px; margin: 20px 0;'>
                    <h3 style='color: #065f46; font-size: 16px; font-weight: 800; margin: 0 0 6px 0;'>🎉 SELAMAT! ANANDA DINYATAKAN DITERIMA / LULUS</h3>
                    <p style='color: #047857; font-size: 14px; line-height: 1.5; margin: 0;'>
                        Berdasarkan hasil verifikasi dan seleksi panitia, ananda dinyatakan resmi diterima sebagai peserta didik baru di <strong>MI Nurussalam Sidogede</strong>.
                    </p>
                </div>

                <p style='color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;'>
                    Silakan masuk ke akun portal SPMB Anda untuk mengunduh <strong>Surat Keputusan (SK) Penerimaan Murid Baru</strong> resmi madrasah. Surat yang telah diunduh dapat dicetak untuk keperluan daftar ulang.
                </p>

                <div style='text-align: center; margin: 28px 0;'>
                    <a href='{$portalUrl}' style='display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.2);'>
                        Buka Halaman Pengumuman & Unduh Surat
                    </a>
                </div>

                <div style='border-top: 1px solid #f1f5f9; margin-top: 24px; padding-top: 16px; text-align: center;'>
                    <p style='color: #94a3b8; font-size: 12px; margin: 0;'>
                        Email ini dibuat dan dikirim secara otomatis oleh Sistem SPMB MI Nurussalam Sidogede.
                    </p>
                </div>
            </div>
            "
        );
    }
}
