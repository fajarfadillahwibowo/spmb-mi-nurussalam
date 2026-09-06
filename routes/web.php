<?php

/**
 * ============================================================================
 * SPMB MI Nurussalam — Definisi Route Web Utama
 * ============================================================================
 *
 * File ini mendefinisikan seluruh HTTP route untuk aplikasi web SPMB.
 * Route dikelompokkan berdasarkan konteks akses:
 *
 *  1. Public Routes  — Dapat diakses tanpa autentikasi (halaman informasi).
 *  2. Auth Routes    — Memerlukan autentikasi dan verifikasi email.
 *     a. Siswa Routes — Hanya untuk pengguna berstatus 'siswa'.
 *     b. Admin Routes — Hanya untuk pengguna berstatus 'admin'.
 *     c. Shared Routes — Dapat diakses oleh semua pengguna terautentikasi.
 *
 * Catatan: Route yang kompleks (pembayaran, data pendaftar, dll.) tetap
 * didefinisikan sebagai closure di file ini untuk memudahkan pembacaan alur
 * logika bisnis tanpa harus membuka file controller terpisah. Refactoring
 * ke Controller khusus dapat dilakukan pada iterasi pengembangan berikutnya.
 * ============================================================================
 */

// ─── Framework & Third-Party Imports ─────────────────────────────────────────
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

// ─── Controller Imports ───────────────────────────────────────────────────────
use App\Http\Controllers\DokumenController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\NotifikasiController;
use App\Http\Controllers\PendaftaranController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SeleksiController;

// ─── Job & Model Imports ──────────────────────────────────────────────────────
use App\Jobs\SendPembayaranNotification;
use App\Mail\KonfirmasiPembayaranMail;
use App\Models\Pendaftaran;

// ─── Pengaturan Module Imports (BARU — MODULAR) ───────────────────────────────
use App\Http\Controllers\PengaturanController;
use App\Models\PeriodeSpmb;
use App\Models\Setting;

// =============================================================================
// 1. PUBLIC ROUTES — Halaman Informasi (Tanpa Autentikasi)
// =============================================================================

/**
 * Halaman Beranda (Landing Page)
 * Menampilkan informasi umum sistem SPMB dan tautan navigasi utama.
 */
Route::get('/', function () {
    $periodeAktif = PeriodeSpmb::getAktif();

    $spmbSettings = [
        'status'      => Setting::get('spmb_status', 'buka'),
        'kontak_wa'   => Setting::get('kontak_wa', ''),
        'email'       => Setting::get('email_sekolah', ''),
        'periodeAktif'=> $periodeAktif,
    ];

    return Inertia::render('Welcome', [
        'canLogin'      => Route::has('login'),
        'canRegister'   => Route::has('register'),
        'laravelVersion'=> Application::VERSION,
        'phpVersion'    => PHP_VERSION,
        'spmbSettings'  => $spmbSettings,   // [BARU] pengaturan dinamis
    ]);
});

/** Halaman Profil Sekolah — Informasi kelembagaan MI Nurussalam. */
Route::get('/profil-sekolah', function () {
    return Inertia::render('ProfilSekolah', [
        'canLogin'    => Route::has('login'),
        'canRegister' => Route::has('register'),
        'spmbSettings'=> [
            'status' => Setting::get('spmb_status', 'buka'),
        ],
    ]);
})->name('profil-sekolah');

/** Halaman Visi & Misi — Pernyataan visi, misi, dan keunggulan madrasah. */
Route::get('/visi-misi', function () {
    return Inertia::render('VisiMisi', [
        'canLogin'    => Route::has('login'),
        'canRegister' => Route::has('register'),
        'spmbSettings'=> [
            'status' => Setting::get('spmb_status', 'buka'),
        ],
    ]);
})->name('visi-misi');

/** Halaman Kontak — Informasi kontak dan formulir pesan. */
Route::get('/kontak', function () {
    return Inertia::render('Kontak', [
        'canLogin'    => Route::has('login'),
        'canRegister' => Route::has('register'),
        'spmbSettings'=> [
            'status' => Setting::get('spmb_status', 'buka'),
        ],
    ]);
})->name('kontak');

/** Halaman Informasi SPMB — Panduan, regulasi, alur, dan FAQ pendaftaran. */
Route::get('/informasi-spmb', function () {
    // Baca periode aktif untuk jadwal gelombang dinamis
    $periodeAktif = PeriodeSpmb::getAktif();

    $spmbSettings = [
        'status'      => Setting::get('spmb_status', 'buka'),
        'kontak_wa'   => Setting::get('kontak_wa', ''),
        'email'       => Setting::get('email_sekolah', ''),
        'periodeAktif'=> $periodeAktif,
    ];

    return Inertia::render('InformasiSPMB', [
        'canLogin'    => Route::has('login'),
        'canRegister' => Route::has('register'),
        'spmbSettings'=> $spmbSettings,     // [BARU] pengaturan dinamis
    ]);
})->name('informasi-spmb');

// =============================================================================
// 2. DASHBOARD — Diakses oleh Siswa & Admin (memerlukan autentikasi)
// =============================================================================

/**
 * Halaman Dashboard — Tampilan berbeda berdasarkan role pengguna.
 *
 * Admin melihat statistik rekap pendaftaran secara keseluruhan.
 * Siswa melihat status pendaftaran, dokumen, dan seleksi milik sendiri.
 */
Route::get('/dashboard', function (Request $request) {
    $user = Auth::user();

    if ($user->role === 'admin') {
        // ─── Dashboard Admin: Statistik Rekap Pendaftaran ────────────────────

        // [BARU] Filter periode — gunakan periode aktif jika tidak ada pilihan eksplisit
        $periodeId = $request->query('periode_id');
        $periodes  = PeriodeSpmb::orderBy('tahun', 'desc')->get();
        $periode   = $periodeId ? PeriodeSpmb::find($periodeId) : PeriodeSpmb::getAktif();

        // Query dasar Pendaftaran difilter berdasarkan periode
        $baseQuery = Pendaftaran::query();
        if ($periode) {
            $baseQuery->whereBetween('created_at', [
                $periode->getStartDate(),
                $periode->getEndDate(),
            ]);
        }

        return Inertia::render('Dashboard', [
            'role'  => 'admin',
            'stats' => [
                'total'       => (clone $baseQuery)->count(),
                'lulus'       => (clone $baseQuery)->where('status', 'lulus')->count(),
                'tidak_lulus' => (clone $baseQuery)->where('status', 'tidak_lulus')->count(),
                'menunggu'    => (clone $baseQuery)->where('status', 'menunggu_verifikasi')->count(),
                'gender'      => [
                    'laki'     => (clone $baseQuery)->where('jenis_kelamin', 'L')->count(),
                    'perempuan'=> (clone $baseQuery)->where('jenis_kelamin', 'P')->count(),
                ],
                'status_berkas' => [
                    'belum_daftar'       => (clone $baseQuery)->where('status', 'belum_daftar')->count(),
                    'belum_lengkap'      => (clone $baseQuery)->where('status', 'belum_lengkap')->count(),
                    'menunggu_verifikasi'=> (clone $baseQuery)->where('status', 'menunggu_verifikasi')->count(),
                    'proses_seleksi'     => (clone $baseQuery)->where('status', 'proses_seleksi')->count(),
                ],
            ],
            'periodes'         => $periodes,           // [BARU]
            'selectedPeriodeId'=> $periodeId ? (int) $periodeId : null, // [BARU]
        ]);
    }

    // ─── Dashboard Siswa: Status Pendaftaran Pribadi ──────────────────────────
    return Inertia::render('Dashboard', [
        'role'            => 'siswa',
        'pendaftaran'     => $user->pendaftaran()->with(['dokumen', 'seleksi'])->first(),
        'teksPengumuman'  => Setting::get('teks_pengumuman', ''), // [BARU]
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// =============================================================================
// 3. AUTHENTICATED ROUTES — Memerlukan login & verifikasi email
// =============================================================================

Route::middleware(['auth', 'verified'])->group(function () {

    // ─── Siswa: Pendaftaran (Pengisian Biodata) ───────────────────────────────
    Route::get('/pendaftaran', [PendaftaranController::class, 'index'])->name('pendaftaran.index');
    Route::post('/pendaftaran', [PendaftaranController::class, 'store'])->name('pendaftaran.store');

    // ─── Siswa: Unggah Dokumen Persyaratan ───────────────────────────────────
    Route::get('/dokumen', [DokumenController::class, 'index'])->name('dokumen.index');
    Route::post('/dokumen', [DokumenController::class, 'store'])->name('dokumen.store');

    // ─── Siswa: Halaman Pengumuman Hasil Seleksi ──────────────────────────────
    Route::get('/pengumuman', function () {
        $user = Auth::user();

        if ($user->role !== 'siswa') {
            abort(403);
        }

        return Inertia::render('Siswa/Pengumuman', [
            'pendaftaran' => $user->pendaftaran()->with('seleksi')->first(),
        ]);
    })->name('pengumuman.index');

    // ─── Siswa: Halaman Status Seleksi (Read-Only) ────────────────────────────
    Route::get('/seleksi-siswa', function () {
        $user = Auth::user();

        if ($user->role !== 'siswa') {
            abort(403);
        }

        return Inertia::render('Siswa/SeleksiSiswa', [
            'pendaftaran' => $user->pendaftaran()->with(['dokumen', 'seleksi'])->first(),
        ]);
    })->name('seleksi-siswa.index');

    // ─── Siswa: Halaman Pembayaran ────────────────────────────────────────────
    Route::get('/pembayaran', function () {
        $user = Auth::user();

        if ($user->role !== 'siswa') {
            abort(403);
        }

        return Inertia::render('Siswa/Pembayaran', [
            'pendaftaran' => $user->pendaftaran()->with(['dokumen', 'seleksi'])->first(),
            'status'      => session('status'),
        ]);
    })->name('pembayaran.index');

    /**
     * Siswa: Unggah Bukti Pembayaran
     *
     * Memproses unggahan bukti transfer dari siswa. Status pembayaran
     * diubah menjadi 'menunggu_konfirmasi' hingga admin melakukan verifikasi.
     */
    Route::post('/pembayaran/pay', function (Request $request) {
        $user = Auth::user();

        if ($user->role !== 'siswa') {
            abort(403);
        }

        $request->validate([
            'payment_status'  => 'required|in:cicilan,lunas',
            'amount_paid'     => 'required|numeric|min:0',
            'bukti_pembayaran'=> 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $pendaftaran = $user->pendaftaran;

        if ($pendaftaran) {
            if ($request->hasFile('bukti_pembayaran')) {
                // Hapus bukti lama (jika ada) sebelum menyimpan yang baru.
                if ($pendaftaran->bukti_pembayaran_path) {
                    Storage::disk('public')->delete($pendaftaran->bukti_pembayaran_path);
                }

                $pendaftaran->bukti_pembayaran_path = $request->file('bukti_pembayaran')
                    ->store('pembayaran', 'public');
            }

            $pendaftaran->payment_status      = 'menunggu_konfirmasi';
            $pendaftaran->amount_paid         = $request->amount_paid;
            $pendaftaran->catatan_pembayaran  = null; // Reset catatan penolakan sebelumnya.
            $pendaftaran->save();
        }

        return redirect()->route('pembayaran.index')
            ->with('status', 'Bukti pembayaran berhasil diunggah! Silakan tunggu konfirmasi panitia.');
    })->name('pembayaran.pay');

    // ─── Admin: Manajemen Pembayaran ─────────────────────────────────────────

    /**
     * Admin: Daftar Semua Pembayaran Siswa
     *
     * Mendukung pencarian berdasarkan nama dan pemfilteran berdasarkan
     * status pembayaran dengan paginasi 15 data per halaman.
     */
    Route::get('/pembayaran-admin', function (Request $request) {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            abort(403);
        }

        $search       = $request->query('search');
        $filterStatus = $request->query('status');

        // [BARU] Filter periode
        $periodeId = $request->query('periode_id');
        $periodes  = PeriodeSpmb::orderBy('tahun', 'desc')->get();
        $periode   = $periodeId ? PeriodeSpmb::find($periodeId) : PeriodeSpmb::getAktif();

        $query = Pendaftaran::with(['user']);

        if ($periode) {
            $query->whereBetween('created_at', [
                $periode->getStartDate(),
                $periode->getEndDate(),
            ]);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%");
            });
        }

        if ($filterStatus) {
            $query->where('payment_status', $filterStatus);
        }

        $pendaftarans = $query->orderBy('updated_at', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('Admin/AdminPembayaran', [
            'pendaftarans'     => $pendaftarans,
            'filters'          => [
                'search' => $search,
                'status' => $filterStatus,
            ],
            'flash_status'     => session('status'),
            'flash_error'      => session('error'),
            'periodes'         => $periodes,           // [BARU]
            'selectedPeriodeId'=> $periodeId ? (int) $periodeId : null, // [BARU]
        ]);
    })->name('pembayaran-admin.index');

    /**
     * Admin: Konfirmasi Verifikasi Pembayaran
     *
     * Memproses keputusan admin (approve/reject) terhadap bukti pembayaran siswa.
     *
     * Alur kerja menggunakan dua mekanisme pengamanan:
     *
     * 1. SERVER-SIDE IDEMPOTENCY CHECK — Menolak permintaan duplikat jika status
     *    pembayaran sudah berubah dari 'menunggu_konfirmasi'. Ini adalah lapisan
     *    keamanan server-side yang melengkapi loading state di sisi frontend.
     *
     * 2. DB::TRANSACTION (Prinsip Atomik) — Seluruh operasi database (update status,
     *    akumulasi nominal, hapus file) dibungkus dalam satu transaksi. Jika satu
     *    operasi gagal, seluruh perubahan dibatalkan (rollback otomatis), menjaga
     *    integritas data. Job WhatsApp hanya di-dispatch setelah commit berhasil.
     */
    Route::post('/pembayaran-admin/{pendaftaran}/konfirmasi', function (Request $request, Pendaftaran $pendaftaran) {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            abort(403);
        }

        $request->validate([
            'action'             => 'required|in:approve,reject',
            'payment_status'     => 'required_if:action,approve|in:cicilan,lunas',
            'verified_amount'    => 'required_if:action,approve|numeric|min:0',
            'jenis_pembayaran'   => 'nullable|string|max:100',
            'catatan_pembayaran' => 'nullable|string',
            'kirim_notif_wa'     => 'nullable|boolean',
        ]);

        // ── GUARD: Idempotency Check (Cegah Proses Ganda) ──────────────────────
        // Tolak request approve jika status sudah bukan 'menunggu_konfirmasi',
        // yang berarti pembayaran ini sudah pernah diproses sebelumnya.
        if ($request->action === 'approve' && $pendaftaran->payment_status !== 'menunggu_konfirmasi') {
            return redirect()->route('pembayaran-admin.index')->with(
                'status',
                'Aksi diabaikan: status pembayaran sudah diproses sebelumnya (' . $pendaftaran->payment_status . ').'
            );
        }

        // Variabel hasil yang dibawa keluar dari closure transaksi untuk digunakan
        // setelah commit berhasil (tidak bisa return dari dalam closure DB::transaction).
        $dispatchWaJob   = false;
        $nominalBaru     = 0.0;
        $statusBaru      = $request->payment_status ?? 'belum_bayar';
        $jenisPembayaran = $request->jenis_pembayaran ?: 'Total Biaya Masuk (Semua Komponen)';

        // ── DB::TRANSACTION (Prinsip Atomik) ───────────────────────────────────
        // Semua operasi database di dalam closure ini bersifat atomik.
        // Kegagalan satu operasi akan membatalkan seluruh transaksi (rollback).
        try {
            DB::transaction(function () use ($request, $pendaftaran, &$dispatchWaJob, &$nominalBaru, &$statusBaru) {
                if ($request->action === 'approve') {
                    $nominalBaru = (float) $request->verified_amount;

                    // Akumulasikan nominal ke total yang sudah dibayarkan (mendukung pola cicilan).
                    $pendaftaran->amount_paid   += $nominalBaru;
                    $pendaftaran->payment_status = $request->payment_status;

                    // Buat catatan verifikasi yang informatif untuk riwayat pembayaran.
                    $rupiahNominal = 'Rp ' . number_format($nominalBaru, 0, ',', '.');
                    $pendaftaran->catatan_pembayaran = $request->catatan_pembayaran
                        ? "Pembayaran {$rupiahNominal} disetujui. " . $request->catatan_pembayaran
                        : "Pembayaran sebesar {$rupiahNominal} berhasil diverifikasi oleh admin.";

                    // Hapus file bukti transfer lama agar siswa dapat mengunggah
                    // bukti pembayaran cicilan berikutnya.
                    if ($pendaftaran->bukti_pembayaran_path) {
                        Storage::disk('public')->delete($pendaftaran->bukti_pembayaran_path);
                        $pendaftaran->bukti_pembayaran_path = null;
                    }

                    // Tandai bahwa WA job boleh di-dispatch setelah commit berhasil.
                    $statusBaru    = $request->payment_status;
                    $dispatchWaJob = true;

                } else {
                    // ── Aksi Reject ──────────────────────────────────────────────
                    // Kembalikan status pembayaran ke sebelumnya berdasarkan riwayat cicilan.
                    $pendaftaran->payment_status     = $pendaftaran->amount_paid > 0 ? 'cicilan' : 'belum_bayar';
                    $pendaftaran->catatan_pembayaran = $request->catatan_pembayaran
                        ?: 'Bukti pembayaran ditolak. Silakan unggah kembali bukti yang valid.';

                    if ($pendaftaran->bukti_pembayaran_path) {
                        Storage::disk('public')->delete($pendaftaran->bukti_pembayaran_path);
                        $pendaftaran->bukti_pembayaran_path = null;
                    }

                    // Notifikasi WA tidak dikirim untuk aksi penolakan pembayaran.
                    $dispatchWaJob = false;
                }

                // SAVE — Jika baris ini gagal, seluruh transaction di-rollback.
                $pendaftaran->save();

            }); // ← DB::transaction melakukan COMMIT di sini jika tidak ada exception.

        } catch (\Throwable $e) {
            // Jika transaksi database gagal, catat error dan kembalikan pesan gagal.
            // WA Job TIDAK akan di-dispatch karena $dispatchWaJob masih bernilai false.
            Log::error('[Pembayaran Konfirmasi] DB transaction gagal.', [
                'pendaftaran_id' => $pendaftaran->id,
                'error'          => $e->getMessage(),
            ]);

            return redirect()->route('pembayaran-admin.index')
                ->with('error', 'Terjadi kesalahan saat memperbarui data. Silakan coba lagi.');
        }

        // ── PENGIRIMAN NOTIFIKASI WA & PELACAKAN STATUS ─────────────────────
        $waStatusMsg = '';
        if ($dispatchWaJob && $request->boolean('kirim_notif_wa', true)) {
            $pendaftaran->refresh();
            if (!empty($pendaftaran->no_hp_wali)) {
                try {
                    $waService = app(\App\Services\WhatsAppService::class);
                    $nominalFmt  = 'Rp ' . number_format($nominalBaru, 0, ',', '.');
                    $statusLabel = $statusBaru === 'lunas' ? 'LUNAS' : 'CICILAN';
                    $appUrl      = config('app.url');

                    $pesan  = "Assalamu'alaikum Wr. Wb.\n\n"
                        . "Yth. *{$pendaftaran->nama_lengkap}* / Wali Murid,\n\n"
                        . "Kami informasikan bahwa pembayaran untuk:\n"
                        . "🏷️ *Jenis:* {$jenisPembayaran}\n"
                        . "💰 *Nominal:* {$nominalFmt}\n\n"
                        . "Telah kami terima dan berstatus *{$statusLabel}*.\n\n"
                        . ($statusBaru === 'lunas'
                            ? "🎉 Selamat! Pembayaran Anda telah *LUNAS*.\n🔗 {$appUrl}/dashboard\n\n"
                            : "Silakan lakukan pembayaran berikutnya sesuai ketentuan.\n\n")
                        . "Wassalamu'alaikum Wr. Wb.\n-- *Admin MI Nurussalam Sidogede* --";

                    $waResult = $waService->send($pendaftaran->no_hp_wali, $pesan);

                    if (!empty($waResult['success']) && $waResult['success'] === true) {
                        $pendaftaran->update([
                            'status_wa_bayar'  => 'terkirim',
                            'wa_bayar_sent_at' => now(),
                        ]);
                        $waStatusMsg = ' (Status WA: Terkirim)';
                    } else {
                        $pendaftaran->update([
                            'status_wa_bayar' => 'belum_terkirim',
                        ]);
                        $waStatusMsg = ' (Status WA: Belum Terkirim)';
                    }
                } catch (\Throwable $e) {
                    Log::warning('[Pembayaran Konfirmasi] Gagal kirim WA', ['error' => $e->getMessage()]);
                    $pendaftaran->update([
                        'status_wa_bayar' => 'belum_terkirim',
                    ]);
                    $waStatusMsg = ' (Status WA: Belum Terkirim)';
                }
            } else {
                $pendaftaran->update(['status_wa_bayar' => 'belum_terkirim']);
                $waStatusMsg = ' (Nomor WA tidak tersedia)';
            }
        } elseif ($request->action === 'approve') {
            $pendaftaran->update(['status_wa_bayar' => 'belum_terkirim']);
        }

        // ── PENGIRIMAN NOTIFIKASI EMAIL KONFIRMASI PEMBAYARAN ────────────────
        if ($request->action === 'approve') {
            $recipientEmail = $pendaftaran->user?->email;
            if (!empty($recipientEmail)) {
                try {
                    Mail::to($recipientEmail)->send(new KonfirmasiPembayaranMail(
                        $pendaftaran,
                        $nominalBaru,
                        $statusBaru,
                        $jenisPembayaran
                    ));
                    $pendaftaran->update([
                        'status_email_bayar'  => 'terkirim',
                        'email_bayar_sent_at' => now(),
                    ]);
                    Log::info("[Email Pembayaran] Sukses terkirim ke: {$recipientEmail}");
                } catch (\Throwable $e) {
                    $pendaftaran->update([
                        'status_email_bayar' => 'belum_terkirim',
                    ]);
                    Log::error("[Email Pembayaran] Gagal kirim ke {$recipientEmail}: " . $e->getMessage());
                }
            } else {
                $pendaftaran->update(['status_email_bayar' => 'belum_terkirim']);
            }
        }

        return redirect()->route('pembayaran-admin.index')
            ->with('status', 'Status pembayaran pendaftar berhasil diperbarui!' . $waStatusMsg);

    })->name('pembayaran-admin.confirm');

    /**
     * Admin: Edit / Koreksi Data Pembayaran Siswa
     *
     * Memungkinkan admin untuk mengedit kembali status pembayaran, nominal terbayar,
     * catatan pembayaran, serta mengirimkan notifikasi WA pembaruan jika diperlukan.
     */
    Route::put('/pembayaran-admin/{pendaftaran}/update', function (Request $request, Pendaftaran $pendaftaran) {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            abort(403);
        }

        $request->validate([
            'payment_status'     => 'required|in:belum_bayar,menunggu_konfirmasi,cicilan,lunas',
            'amount_paid'        => 'required|numeric|min:0',
            'catatan_pembayaran' => 'nullable|string|max:1000',
            'jenis_pembayaran'   => 'nullable|string|max:100',
            'kirim_notif_wa'     => 'nullable|boolean',
        ]);

        $nominalBaru     = (float) $request->amount_paid;
        $statusBaru      = $request->payment_status;
        $jenisPembayaran = $request->jenis_pembayaran ?: 'Koreksi Data Pembayaran';

        try {
            DB::transaction(function () use ($request, $pendaftaran, $nominalBaru, $statusBaru) {
                $pendaftaran->payment_status     = $statusBaru;
                $pendaftaran->amount_paid        = $nominalBaru;
                $pendaftaran->catatan_pembayaran = $request->catatan_pembayaran;
                $pendaftaran->save();
            });
        } catch (\Throwable $e) {
            Log::error('[Pembayaran Edit] DB transaction gagal.', [
                'pendaftaran_id' => $pendaftaran->id,
                'error'          => $e->getMessage(),
            ]);

            return redirect()->route('pembayaran-admin.index')
                ->with('error', 'Gagal memperbarui data pembayaran. Silakan coba lagi.');
        }

        // Kirim notifikasi WA jika opsi kirim_notif_wa dipilih
        if ($request->boolean('kirim_notif_wa', false)) {
            $pendaftaran->refresh();
            if (!empty($pendaftaran->no_hp_wali)) {
                try {
                    $waService = app(\App\Services\WhatsAppService::class);
                    $nominalFmt  = 'Rp ' . number_format($nominalBaru, 0, ',', '.');
                    $statusLabel = $statusBaru === 'lunas' ? 'LUNAS' : ($statusBaru === 'cicilan' ? 'CICILAN' : strtoupper($statusBaru));
                    $pesan = "Assalamu'alaikum Wr. Wb.\n\nPembaruan data pembayaran *{$pendaftaran->nama_lengkap}*:\n🏷️ Jenis: {$jenisPembayaran}\n💰 Nominal: {$nominalFmt}\nStatus: *{$statusLabel}*\n\n-- Admin MI Nurussalam";
                    $waResult = $waService->send($pendaftaran->no_hp_wali, $pesan);
                    if (!empty($waResult['success']) && $waResult['success'] === true) {
                        $pendaftaran->update([
                            'status_wa_bayar'  => 'terkirim',
                            'wa_bayar_sent_at' => now(),
                        ]);
                    } else {
                        $pendaftaran->update([
                            'status_wa_bayar' => 'belum_terkirim',
                        ]);
                    }
                } catch (\Throwable $e) {
                    $pendaftaran->update([
                        'status_wa_bayar' => 'belum_terkirim',
                    ]);
                }
            }

            // Kirim notifikasi Email pembaruan
            $recipientEmail = $pendaftaran->user?->email;
            if (!empty($recipientEmail)) {
                try {
                    Mail::to($recipientEmail)->send(new KonfirmasiPembayaranMail(
                        $pendaftaran,
                        $nominalBaru,
                        $statusBaru,
                        $jenisPembayaran
                    ));
                    $pendaftaran->update([
                        'status_email_bayar'  => 'terkirim',
                        'email_bayar_sent_at' => now(),
                    ]);
                } catch (\Throwable $e) {
                    $pendaftaran->update([
                        'status_email_bayar' => 'belum_terkirim',
                    ]);
                }
            }
        }

        return redirect()->route('pembayaran-admin.index')
            ->with('status', "Data pembayaran calon siswa ({$pendaftaran->nama_lengkap}) berhasil diperbarui!");
    })->name('pembayaran-admin.update');

    // ─── Admin: Data Pendaftar ────────────────────────────────────────────────
    Route::get('/data-pendaftar', function (Request $request) {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            abort(403);
        }

        $search   = $request->query('search');
        $status   = $request->query('status');
        $gender   = $request->query('gender');

        // [BARU] Filter periode — gunakan periode aktif jika tidak ada pilihan eksplisit
        $periodeId = $request->query('periode_id');
        $periodes  = PeriodeSpmb::orderBy('tahun', 'desc')->get();
        $periode   = $periodeId
            ? PeriodeSpmb::find($periodeId)
            : PeriodeSpmb::getAktif();

        $query = Pendaftaran::with(['user', 'dokumen', 'seleksi']);

        // Terapkan filter tanggal jika ada periode yang terpilih
        if ($periode) {
            $query->whereBetween('created_at', [
                $periode->getStartDate(),
                $periode->getEndDate(),
            ]);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($gender) {
            $query->where('jenis_kelamin', $gender);
        }

        $pendaftarans = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('Admin/AdminDataPendaftar', [
            'pendaftarans'     => $pendaftarans,
            'filters'          => [
                'search' => $search,
                'status' => $status,
                'gender' => $gender,
            ],
            'periodes'         => $periodes,           // [BARU]
            'selectedPeriodeId'=> $periodeId ? (int) $periodeId : null, // [BARU]
            'flash_status'     => session('status'),
            'flash_error'      => session('error'),
        ]);
    })->name('data-pendaftar.index');

    Route::post('/data-pendaftar/{pendaftaran}/update', [PendaftaranController::class, 'updateAdmin'])->name('data-pendaftar.update');
    Route::post('/data-pendaftar/{pendaftaran}/kirim-notifikasi', [PendaftaranController::class, 'kirimPemberitahuanBiodata'])->name('data-pendaftar.kirim-notifikasi');

    // ─── Admin: Verifikasi Kelengkapan Berkas ─────────────────────────────────
    Route::get('/verifikasi-berkas', function (Request $request) {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            abort(403);
        }

        $search     = $request->query('search');
        $verifikasi = $request->query('verifikasi'); // 'lengkap' | 'belum_lengkap'

        // [BARU] Filter periode
        $periodeId = $request->query('periode_id');
        $periodes  = PeriodeSpmb::orderBy('tahun', 'desc')->get();
        $periode   = $periodeId ? PeriodeSpmb::find($periodeId) : PeriodeSpmb::getAktif();

        $query = Pendaftaran::with(['user', 'dokumen']);

        if ($periode) {
            $query->whereBetween('created_at', [
                $periode->getStartDate(),
                $periode->getEndDate(),
            ]);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%");
            });
        }

        $pendaftarans = $query->orderBy('created_at', 'desc')->get();

        // Filter kelengkapan dokumen dilakukan pada Collection (bukan Query Builder)
        // karena kondisi 'lengkap' melibatkan pemeriksaan relasi yang kompleks.
        if ($verifikasi === 'lengkap') {
            $pendaftarans = $pendaftarans->filter(function ($p) {
                $d = $p->dokumen;

                return $d
                    && $d->akta_kelahiran_path
                    && $d->kartu_keluarga_path
                    && $d->identitas_ortu_path
                    && $d->ijazah_path;
            })->values();

        } elseif ($verifikasi === 'belum_lengkap') {
            $pendaftarans = $pendaftarans->filter(function ($p) {
                $d = $p->dokumen;

                return ! $d
                    || ! $d->akta_kelahiran_path
                    || ! $d->kartu_keluarga_path
                    || ! $d->identitas_ortu_path
                    || ! $d->ijazah_path;
            })->values();
        }

        return Inertia::render('Admin/AdminVerifikasiBerkas', [
            'pendaftarans'     => $pendaftarans,
            'filters'          => [
                'search'     => $search,
                'verifikasi' => $verifikasi,
            ],
            'periodes'         => $periodes,           // [BARU]
            'selectedPeriodeId'=> $periodeId ? (int) $periodeId : null, // [BARU]
            'flash_status'     => session('status'),
            'flash_error'      => session('error'),
        ]);
    })->name('verifikasi-berkas.index');

    Route::post('/verifikasi-berkas/{pendaftaran}/hapus-dokumen', [DokumenController::class, 'hapusDokumenAdmin'])->name('verifikasi-berkas.hapus-dokumen');
    Route::post('/verifikasi-berkas/{pendaftaran}/kirim-pemberitahuan', [DokumenController::class, 'kirimPemberitahuan'])->name('verifikasi-berkas.kirim-pemberitahuan');

    // ─── Admin: Manajemen Pengumuman ──────────────────────────────────────────
    Route::get('/pengumuman-admin', function (Request $request) {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            abort(403);
        }

        // [BARU] Filter periode
        $periodeId = $request->query('periode_id');
        $periodes  = PeriodeSpmb::orderBy('tahun', 'desc')->get();
        $periode   = $periodeId ? PeriodeSpmb::find($periodeId) : PeriodeSpmb::getAktif();

        $query = Pendaftaran::with(['user', 'seleksi'])->orderBy('nama_lengkap', 'asc');

        if ($periode) {
            $query->whereBetween('created_at', [
                $periode->getStartDate(),
                $periode->getEndDate(),
            ]);
        }

        $pendaftarans = $query->get();

        $stats = [
            'total'       => $pendaftarans->count(),
            'lulus'       => $pendaftarans->where('status', 'lulus')->count(),
            'tidak_lulus' => $pendaftarans->where('status', 'tidak_lulus')->count(),
            'menunggu'    => $pendaftarans->where('status', 'menunggu_verifikasi')->count(),
        ];

        return Inertia::render('Admin/AdminPengumuman', [
            'pendaftarans'     => $pendaftarans,
            'stats'            => $stats,
            'periodes'         => $periodes,           // [BARU]
            'selectedPeriodeId'=> $periodeId ? (int) $periodeId : null, // [BARU]
            'flash_status'     => session('status'),
            'flash_error'      => session('error'),
        ]);
    })->name('pengumuman-admin.index');

    // ─── Admin: Manajemen Seleksi (via Controller) ────────────────────────────
    Route::get('/seleksi', [SeleksiController::class, 'index'])->name('seleksi.index');
    Route::get('/seleksi/{pendaftaran}', [SeleksiController::class, 'show'])->name('seleksi.show');
    Route::post('/seleksi/{pendaftaran}/evaluate', [SeleksiController::class, 'evaluate'])->name('seleksi.evaluate');

    // ─── Admin: Laporan (via Controller) ─────────────────────────────────────
    Route::get('/laporan', [LaporanController::class, 'index'])->name('laporan.index');
    Route::get('/laporan/export-excel', [LaporanController::class, 'exportExcel'])->name('laporan.export');

    // ─── Shared: Manajemen Profil Pengguna ───────────────────────────────────
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ─── Shared: API Notifikasi In-App [BARU] ────────────────────────────────
    // Route ini tersedia untuk semua user terautentikasi (siswa & admin).
    Route::get('/notifikasi', [NotifikasiController::class, 'index'])->name('notifikasi.index');
    Route::post('/notifikasi/baca-semua', [NotifikasiController::class, 'markAllRead'])->name('notifikasi.baca-semua');
    Route::post('/notifikasi/{id}/baca', [NotifikasiController::class, 'markAsRead'])->name('notifikasi.baca');
});

// =============================================================================
// 4. AUTH ROUTES — Registrasi, Login, Logout, Reset Password, dll.
// =============================================================================

require __DIR__ . '/auth.php';

// =============================================================================
// 5. PENGATURAN ADMIN ROUTES (MODUL BARU — TERISOLASI)
//
// Semua route pengaturan dikelompokkan di sini secara modular.
// Tidak ada kode existing yang dimodifikasi untuk menambahkan blok ini.
// =============================================================================

Route::middleware(['auth', 'verified'])
    ->prefix('pengaturan')
    ->name('pengaturan.')
    ->group(function () {
        // Sub-menu 1: Status SPMB (Buka/Tutup)
        Route::get('/status-spmb',  [PengaturanController::class, 'statusSpmb'])->name('status');
        Route::post('/status-spmb', [PengaturanController::class, 'updateStatus'])->name('status.update');

        // Sub-menu 2: Periode & Gelombang Pendaftaran
        Route::get('/periode',      [PengaturanController::class, 'periode'])->name('periode');
        Route::post('/periode',     [PengaturanController::class, 'updatePeriode'])->name('periode.update');

        // Sub-menu 3: Pengaturan Sistem
        Route::get('/sistem',       [PengaturanController::class, 'sistem'])->name('sistem');
        Route::post('/sistem',      [PengaturanController::class, 'updateSistem'])->name('sistem.update');
    });

