<?php

namespace App\Http\Controllers;

// ─── Framework & Third-Party Imports ──────────────────────────────────────────
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

// ─── Internal Imports ─────────────────────────────────────────────────────────
use App\Models\Pendaftaran;
use App\Helpers\NotifikasiHelper;
use App\Services\WhatsAppService;

/**
 * Controller Pendaftaran (Manajemen Biodata Calon Peserta Didik)
 *
 * Mengelola pengisian dan pembaruan formulir biodata calon peserta didik
 * baru (SPMB). Controller ini hanya dapat diakses oleh pengguna berstatus
 * 'siswa' dan mendukung operasi upsert (create jika belum ada, update jika
 * sudah ada) pada satu rekaman Pendaftaran per pengguna.
 */
class PendaftaranController extends Controller
{
    /**
     * Menampilkan formulir pengisian atau pengeditan biodata.
     *
     * Meneruskan data pendaftaran yang sudah ada (jika ada) ke komponen
     * React melalui Inertia untuk mengisi ulang nilai-nilai field formulir.
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        $user = Auth::user();

        // Hanya calon siswa yang dapat mengisi formulir pendaftaran.
        if ($user->role !== 'siswa') {
            abort(403, 'Hanya calon siswa yang dapat mengakses halaman ini.');
        }

        $pendaftaran = $user->pendaftaran;

        return Inertia::render('Siswa/Pendaftaran', [
            'pendaftaran' => $pendaftaran,
            'status'      => session('status'),
        ]);
    }

    /**
     * Menyimpan atau memperbarui biodata calon peserta didik.
     *
     * Jika pengguna belum memiliki rekaman Pendaftaran, rekaman baru akan
     * dibuat dengan status awal 'belum_lengkap'. Jika sudah ada, data
     * yang dikirim akan memperbarui rekaman yang ada (upsert pattern).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if ($user->role !== 'siswa') {
            abort(403, 'Aksi ditolak.');
        }

        // Validasi input biodata dengan aturan ketat sesuai persyaratan SPMB.
        $request->validate([
            'nik'           => 'required|string|size:16|regex:/^[0-9]+$/',
            'asal_sekolah'  => 'nullable|string|max:255',
            'nama_lengkap'  => 'required|string|max:255',
            'tempat_lahir'  => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat'        => 'required|string',
            'nama_orang_tua'=> 'required|string|max:255',
            'no_hp_wali'    => 'required|string|max:20',
            'pas_foto'      => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Pola Upsert: gunakan rekaman yang sudah ada, atau inisialisasi baru.
        $pendaftaran = $user->pendaftaran;

        if (! $pendaftaran) {
            $pendaftaran                 = new Pendaftaran();
            $pendaftaran->user_id        = $user->id;
            $pendaftaran->status         = 'belum_lengkap';
            $pendaftaran->payment_status = 'belum_bayar';
            $pendaftaran->amount_paid    = 0;
        }

        $pendaftaran->nik           = $request->nik;
        $pendaftaran->asal_sekolah  = $request->asal_sekolah;
        $pendaftaran->nama_lengkap  = $request->nama_lengkap;
        $pendaftaran->tempat_lahir  = $request->tempat_lahir;
        $pendaftaran->tanggal_lahir = $request->tanggal_lahir;
        $pendaftaran->jenis_kelamin = $request->jenis_kelamin;
        $pendaftaran->alamat        = $request->alamat;
        $pendaftaran->nama_orang_tua= $request->nama_orang_tua;
        $pendaftaran->no_hp_wali    = $request->no_hp_wali;

        // Proses unggahan pas foto jika ada
        if ($request->hasFile('pas_foto')) {
            // Hapus foto lama jika ada
            if ($pendaftaran->pas_foto_path) {
                Storage::disk('public')->delete($pendaftaran->pas_foto_path);
            }
            $pendaftaran->pas_foto_path = $request->file('pas_foto')->store('pas_foto', 'public');
            
            // Sinkronisasi dengan foto profil akun siswa
            $user->profile_photo_path = $pendaftaran->pas_foto_path;
            $user->save();
        }

        $pendaftaran->save();

        return redirect()->route('pendaftaran.index')->with('status', 'Biodata berhasil disimpan!');
    }

    /**
     * Memperbarui/mengoreksi data calon siswa oleh admin.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Pendaftaran   $pendaftaran
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateAdmin(Request $request, Pendaftaran $pendaftaran): RedirectResponse
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Aksi ditolak.');
        }

        $request->validate([
            'nik'           => 'required|string|size:16|regex:/^[0-9]+$/',
            'asal_sekolah'  => 'nullable|string|max:255',
            'nama_lengkap'  => 'required|string|max:255',
            'tempat_lahir'  => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat'        => 'required|string',
            'nama_orang_tua'=> 'required|string|max:255',
            'no_hp_wali'    => 'required|string|max:20',
        ]);

        $pendaftaran->nik            = $request->nik;
        $pendaftaran->asal_sekolah   = $request->asal_sekolah;
        $pendaftaran->nama_lengkap   = $request->nama_lengkap;
        $pendaftaran->tempat_lahir   = $request->tempat_lahir;
        $pendaftaran->tanggal_lahir  = $request->tanggal_lahir;
        $pendaftaran->jenis_kelamin  = $request->jenis_kelamin;
        $pendaftaran->alamat         = $request->alamat;
        $pendaftaran->nama_orang_tua = $request->nama_orang_tua;
        $pendaftaran->no_hp_wali     = $request->no_hp_wali;
        $pendaftaran->save();

        // Kirim notifikasi in-app ke akun siswa
        if ($pendaftaran->user_id) {
            NotifikasiHelper::kirimKePengguna(
                userId:  $pendaftaran->user_id,
                title:   '✏️ Biodata Diperbarui oleh Admin',
                message: 'Data formulir biodata pendaftaran Anda telah disesuaikan/diperbaiki oleh admin panitia SPMB.',
                linkUrl: '/pendaftaran'
            );
        }

        return redirect()->back(302, [], route('data-pendaftar.index'))
            ->with('status', "Biodata calon siswa {$pendaftaran->nama_lengkap} berhasil diperbarui.");
    }

    /**
     * Mengirim notifikasi instruksi perbaikan biodata ke calon siswa.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Pendaftaran   $pendaftaran
     * @return \Illuminate\Http\RedirectResponse
     */
    public function kirimPemberitahuanBiodata(Request $request, Pendaftaran $pendaftaran): RedirectResponse
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Aksi ditolak.');
        }

        $request->validate([
            'pesan'    => 'required|string|max:1000',
            'kirim_wa' => 'nullable|boolean',
        ]);

        // 1. Kirim notifikasi in-app ke calon siswa (muncul di lonceng notifikasi pojok kanan atas)
        if ($pendaftaran->user_id) {
            NotifikasiHelper::kirimKePengguna(
                userId:  $pendaftaran->user_id,
                title:   '⚠️ Pembaruan Biodata Diperlukan',
                message: $request->pesan,
                linkUrl: '/pendaftaran'
            );
        }

        // 2. Kirim notifikasi via WhatsApp jika dipilih dan nomor wali tersedia
        $waSent = false;
        if ($request->boolean('kirim_wa') && !empty($pendaftaran->no_hp_wali)) {
            try {
                $waService = app(WhatsAppService::class);
                $waMessage = WhatsAppService::buildPerbaikanBiodataMessage(
                    $pendaftaran->nama_lengkap,
                    $request->pesan
                );
                $waResult = $waService->send($pendaftaran->no_hp_wali, $waMessage);
                $waSent = $waResult['success'] ?? false;
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('[DataPendaftar] Gagal kirim WA notifikasi biodata', [
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $feedbackMsg = 'Pemberitahuan perbaikan biodata berhasil dikirim ke calon siswa (tersedia di lonceng notifikasi)'
            . ($waSent ? ' dan pesan WhatsApp terkirim ke wali.' : '.');

        return redirect()->back(302, [], route('data-pendaftar.index'))
            ->with('status', $feedbackMsg);
    }
}
