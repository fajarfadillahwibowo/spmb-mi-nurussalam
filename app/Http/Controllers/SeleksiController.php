<?php

namespace App\Http\Controllers;

// ─── Framework & Third-Party Imports ──────────────────────────────────────────
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

// ─── Internal Imports ─────────────────────────────────────────────────────────
use App\Jobs\SendWhatsAppNotification;
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
            $query->where('nama_lengkap', 'like', "%{$search}%");
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

        $request->validate([
            'status_seleksi' => 'required|in:lulus,tidak_lulus',
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
        $seleksi->status_seleksi = $request->status_seleksi;
        $seleksi->catatan        = $request->catatan;
        $seleksi->save();

        // Sinkronkan status utama pada tabel pendaftaran agar konsisten.
        $pendaftaran->status = $request->status_seleksi;
        $pendaftaran->save();

        // Dispatch Job notifikasi WA hanya jika status BERUBAH.
        // Ini mencegah notifikasi terkirim ganda jika admin menyimpan ulang
        // tanpa mengubah status evaluasi.
        if ($statusSebelumnya !== $request->status_seleksi) {
            SendWhatsAppNotification::dispatch($pendaftaran, $request->status_seleksi)
                ->delay(now()->addSeconds(3));
        }

        return redirect()->route('seleksi.index')
            ->with('status', 'Evaluasi berhasil disimpan! Notifikasi WhatsApp sedang dikirim ke wali siswa.');
    }
}
