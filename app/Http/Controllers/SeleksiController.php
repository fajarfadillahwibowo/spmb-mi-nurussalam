<?php

namespace App\Http\Controllers;

// ─── Framework & Third-Party Imports ──────────────────────────────────────────
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

// ─── Internal Imports ─────────────────────────────────────────────────────────
use App\Jobs\SendWhatsAppNotification;
use App\Mail\PengumumanKelulusanMail;
use App\Models\Pendaftaran;
use App\Models\Seleksi;

/**
 * Controller Seleksi (Manajemen Proses Evaluasi Pendaftaran)
 *
 * Mengelola seluruh alur proses seleksi/evaluasi berkas pendaftaran
 * calon peserta didik yang dilakukan oleh admin. Controller ini
 * mengimplementasikan pola Command-Job untuk pengiriman notifikasi
 * WhatsApp secara asinkron (non-blocking) setelah admin menyimpan
 * hasil evaluasi, sehingga response ke admin tetap cepat.
 */
class SeleksiController extends Controller
{
    /**
     * Menampilkan daftar semua pendaftaran untuk ditinjau oleh admin.
     *
     * Mendukung pencarian berdasarkan nama lengkap dan pemfilteran
     * berdasarkan status berkas. Hasil ditampilkan secara paginated
     * (10 data per halaman) dan diurutkan dari yang terbaru.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request): Response
    {
        // Hanya admin yang berwenang mengakses halaman manajemen seleksi.
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Aksi ditolak.');
        }

        $search = $request->query('search');
        $status = $request->query('status');

        // Eager load relasi 'user' dan 'dokumen' untuk menghindari N+1 query problem.
        $query = Pendaftaran::with(['user', 'dokumen']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        // withQueryString() mempertahankan parameter filter di URL saat berpindah halaman.
        $pendaftarans = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Seleksi', [
            'pendaftarans' => $pendaftarans,
            'filters'      => [
                'search' => $search,
                'status' => $status,
            ],
            'status'       => session('status'),
        ]);
    }

    /**
     * Menampilkan detail lengkap satu berkas pendaftaran untuk ditinjau.
     *
     * Menggunakan Route Model Binding untuk resolusi otomatis model
     * Pendaftaran berdasarkan parameter {pendaftaran} pada URL.
     *
     * @param  \App\Models\Pendaftaran  $pendaftaran
     * @return \Inertia\Response
     */
    public function show(Pendaftaran $pendaftaran): Response
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Aksi ditolak.');
        }

        // Load semua relasi yang dibutuhkan halaman detail dalam satu query.
        $pendaftaran->load(['user', 'dokumen', 'seleksi']);

        return Inertia::render('Admin/SeleksiDetail', [
            'pendaftaran' => $pendaftaran,
            'status'      => session('status'),
        ]);
    }

    /**
     * Menyimpan hasil evaluasi dan mengirim notifikasi WhatsApp ke wali siswa.
     *
     * Notifikasi WhatsApp dikirim secara asinkron melalui Job Queue (Laravel Queue)
     * hanya jika status evaluasi BERUBAH dari nilai sebelumnya. Mekanisme ini
     * mencegah pengiriman notifikasi ganda apabila admin menyimpan ulang dengan
     * status yang sama, dan memastikan response API tidak terhambat oleh proses
     * pengiriman pesan eksternal.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Pendaftaran   $pendaftaran
     * @return \Illuminate\Http\RedirectResponse
     */
    public function evaluate(Request $request, Pendaftaran $pendaftaran): RedirectResponse
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Aksi ditolak.');
        }

        // Mendukung input status_seleksi atau status dari frontend
        $statusInput = $request->input('status_seleksi') ?? $request->input('status');

        // Normalisasi jika dikirim sebagai 'menunggu' atau 'menunggu_verifikasi'
        if ($statusInput === 'menunggu' || $statusInput === 'menunggu_verifikasi') {
            $statusInput = 'proses';
        }

        $request->merge(['status_seleksi' => $statusInput]);

        $request->validate([
            'status_seleksi' => 'required|in:lulus,tidak_lulus,proses',
            'catatan'        => 'nullable|string',
        ]);

        // Ambil rekaman seleksi yang sudah ada, atau buat baru jika belum pernah dievaluasi.
        $seleksi = $pendaftaran->seleksi;

        if (! $seleksi) {
            $seleksi                  = new Seleksi();
            $seleksi->pendaftaran_id  = $pendaftaran->id;
        }

        // Simpan status lama sebelum diperbarui untuk mendeteksi perubahan.
        $statusSebelumnya = $seleksi->status_seleksi;

        $seleksi->admin_id       = Auth::id();
        $seleksi->status_seleksi = $statusInput;
        $seleksi->catatan        = $request->catatan;
        $seleksi->save();

        // Sinkronkan status utama pada tabel pendaftaran agar konsisten.
        $pendaftaran->status = ($statusInput === 'proses') ? 'menunggu_verifikasi' : $statusInput;

        // ─── LOGIKA PELACAKAN STATUS NOTIFIKASI WA KELULUSAN ─────────────────
        if ($statusInput === 'lulus' && $statusSebelumnya !== 'lulus') {
            if (!empty($pendaftaran->no_hp_wali)) {
                try {
                    $waService = app(\App\Services\WhatsAppService::class);
                    $pesan = \App\Services\WhatsAppService::buildLulusMessage($pendaftaran->nama_lengkap);
                    $result = $waService->send($pendaftaran->no_hp_wali, $pesan);

                    if (!empty($result['success']) && $result['success'] === true) {
                        $pendaftaran->status_wa_lulus  = 'terkirim';
                        $pendaftaran->wa_lulus_sent_at = now();
                    } else {
                        $pendaftaran->status_wa_lulus = 'belum_terkirim';
                    }
                } catch (\Throwable $e) {
                    Log::warning('[SeleksiController] Gagal kirim WA kelulusan', [
                        'error' => $e->getMessage(),
                    ]);
                    $pendaftaran->status_wa_lulus = 'belum_terkirim';
                }
            } else {
                $pendaftaran->status_wa_lulus = 'belum_terkirim';
            }

            // ─── LOGIKA PENGIRIMAN & PELACAKAN STATUS EMAIL KELULUSAN ─────────
            $recipientEmail = $pendaftaran->user?->email;
            if (!empty($recipientEmail)) {
                try {
                    Mail::to($recipientEmail)->send(new PengumumanKelulusanMail($pendaftaran));
                    $pendaftaran->status_email_lulus  = 'terkirim';
                    $pendaftaran->email_lulus_sent_at = now();
                    Log::info("[Email Kelulusan] Sukses terkirim ke: {$recipientEmail}");
                } catch (\Throwable $e) {
                    $pendaftaran->status_email_lulus = 'belum_terkirim';
                    Log::error("[Email Kelulusan] Gagal kirim ke {$recipientEmail}: " . $e->getMessage());
                }
            } else {
                $pendaftaran->status_email_lulus = 'belum_terkirim';
            }

        } elseif ($statusInput === 'tidak_lulus' && $statusSebelumnya !== 'tidak_lulus') {
            // Notifikasi tidak lulus tetap dikirim via Job/Queue
            SendWhatsAppNotification::dispatch($pendaftaran, 'tidak_lulus');
        } elseif ($statusInput === 'proses') {
            // Reset status WA & Email jika admin me-reset keputusan
            $pendaftaran->status_wa_lulus     = 'belum_terkirim';
            $pendaftaran->wa_lulus_sent_at    = null;
            $pendaftaran->status_email_lulus  = 'belum_terkirim';
            $pendaftaran->email_lulus_sent_at = null;
        }

        $pendaftaran->save();

        $waFeedback = '';
        if ($statusInput === 'lulus') {
            $waFeedback = ' (' . ($pendaftaran->status_wa_lulus === 'terkirim' ? 'WA: Terkirim' : 'WA: Belum Terkirim')
                        . ' | ' . ($pendaftaran->status_email_lulus === 'terkirim' ? 'Email: Terkirim' : 'Email: Belum Terkirim') . ')';
        }

        return redirect()->back(302, [], route('seleksi.index'))
            ->with('status', 'Status pengumuman/kelulusan calon siswa berhasil diperbarui!' . $waFeedback);
    }
}
