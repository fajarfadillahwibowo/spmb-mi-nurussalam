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
use App\Models\Dokumen;

/**
 * Controller Dokumen (Manajemen Dokumen Persyaratan)
 *
 * Mengelola proses unggah dan tampil dokumen persyaratan pendaftaran
 * yang dilakukan oleh calon peserta didik (role: 'siswa'). Setiap file
 * yang diunggah akan disimpan di disk 'public' dan path-nya direkam
 * pada tabel 'dokumens'.
 *
 * Setelah seluruh dokumen wajib (akta, KK, identitas ortu, ijazah)
 * berhasil diunggah, status pendaftaran secara otomatis diperbarui
 * menjadi 'menunggu_verifikasi' oleh sistem.
 */
class DokumenController extends Controller
{
    /**
     * Menampilkan halaman unggah dokumen persyaratan.
     *
     * Memeriksa keberadaan data biodata (Pendaftaran) terlebih dahulu.
     * Jika belum ada, pengguna diarahkan untuk melengkapi biodata terlebih dahulu.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function index(): Response|RedirectResponse
    {
        $user = Auth::user();

        // Hanya pengguna dengan role 'siswa' yang dapat mengakses halaman ini.
        if ($user->role !== 'siswa') {
            abort(403, 'Aksi ditolak.');
        }

        $pendaftaran = $user->pendaftaran;

        // Biodata harus dilengkapi terlebih dahulu sebelum mengunggah dokumen.
        if (! $pendaftaran) {
            return redirect()->route('pendaftaran.index')
                ->with('status', 'Silakan lengkapi biodata Anda terlebih dahulu sebelum mengunggah dokumen.');
        }

        $dokumen = $pendaftaran->dokumen;

        return Inertia::render('Siswa/UploadDokumen', [
            'dokumen' => $dokumen,
            'status'  => session('status'),
            'error'   => session('error'),
        ]);
    }

    /**
     * Memproses dan menyimpan dokumen persyaratan yang diunggah.
     *
     * Mendukung unggah parsial (tidak semua dokumen wajib diunggah sekaligus).
     * File lama akan dihapus dari storage sebelum digantikan file baru.
     * Status pendaftaran otomatis berubah menjadi 'menunggu_verifikasi'
     * apabila keempat dokumen wajib telah tersedia.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $user = Auth::user();

        // Hanya pengguna dengan role 'siswa' yang dapat melakukan unggah.
        if ($user->role !== 'siswa') {
            abort(403, 'Aksi ditolak.');
        }

        $pendaftaran = $user->pendaftaran;

        if (! $pendaftaran) {
            return redirect()->route('pendaftaran.index')
                ->with('error', 'Silakan lengkapi biodata terlebih dahulu.');
        }

        // Validasi: setiap file harus berformat PDF atau gambar dan berukuran maks. 2 MB.
        $request->validate([
            'akta_kelahiran' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'kartu_keluarga' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'identitas_ortu' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'ijazah'         => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'pkh_kks'        => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        // Ambil rekaman Dokumen yang sudah ada, atau inisialisasi baru jika belum ada.
        $dokumen = $pendaftaran->dokumen;

        if (! $dokumen) {
            $dokumen                    = new Dokumen();
            $dokumen->pendaftaran_id    = $pendaftaran->id;
            $dokumen->akta_kelahiran_path = '';
            $dokumen->kartu_keluarga_path = '';
            $dokumen->identitas_ortu_path = '';
            $dokumen->ijazah_path         = '';
            $dokumen->pkh_kks_path        = '';
        }

        // Flag penanda apakah ada minimal satu file yang berhasil diunggah.
        $uploaded = false;

        // ─── Proses Unggah Per-Dokumen ────────────────────────────────────────
        // Pola yang sama diterapkan untuk setiap dokumen:
        // 1. Cek apakah file baru dikirim dalam request.
        // 2. Hapus file lama dari storage (jika ada) untuk menghindari orphan files.
        // 3. Simpan file baru dan perbarui path-nya pada model.

        if ($request->hasFile('akta_kelahiran')) {
            if ($dokumen->akta_kelahiran_path) {
                Storage::disk('public')->delete($dokumen->akta_kelahiran_path);
            }
            $dokumen->akta_kelahiran_path = $request->file('akta_kelahiran')->store('dokumen', 'public');
            $uploaded = true;
        }

        if ($request->hasFile('kartu_keluarga')) {
            if ($dokumen->kartu_keluarga_path) {
                Storage::disk('public')->delete($dokumen->kartu_keluarga_path);
            }
            $dokumen->kartu_keluarga_path = $request->file('kartu_keluarga')->store('dokumen', 'public');
            $uploaded = true;
        }

        if ($request->hasFile('identitas_ortu')) {
            if ($dokumen->identitas_ortu_path) {
                Storage::disk('public')->delete($dokumen->identitas_ortu_path);
            }
            $dokumen->identitas_ortu_path = $request->file('identitas_ortu')->store('dokumen', 'public');
            $uploaded = true;
        }

        if ($request->hasFile('ijazah')) {
            if ($dokumen->ijazah_path) {
                Storage::disk('public')->delete($dokumen->ijazah_path);
            }
            $dokumen->ijazah_path = $request->file('ijazah')->store('dokumen', 'public');
            $uploaded = true;
        }

        if ($request->hasFile('pkh_kks')) {
            if ($dokumen->pkh_kks_path) {
                Storage::disk('public')->delete($dokumen->pkh_kks_path);
            }
            $dokumen->pkh_kks_path = $request->file('pkh_kks')->store('dokumen', 'public');
            $uploaded = true;
        }

        // ─── Simpan & Perbarui Status ─────────────────────────────────────────
        if ($uploaded) {
            $dokumen->save();

            // Jika keempat dokumen wajib sudah terunggah, tandai pendaftaran
            // siap untuk diverifikasi oleh panitia admin.
            $semuaWajibLengkap = $dokumen->akta_kelahiran_path
                && $dokumen->kartu_keluarga_path
                && $dokumen->identitas_ortu_path
                && $dokumen->ijazah_path;

            if ($semuaWajibLengkap) {
                $pendaftaran->status = 'menunggu_verifikasi';
                $pendaftaran->save();
            }

            return redirect()->route('dokumen.index')->with('status', 'Dokumen berhasil diunggah!');
        }

        return redirect()->route('dokumen.index')->with('error', 'Tidak ada file yang diunggah.');
    }
}
