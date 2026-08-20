<?php

namespace App\Http\Controllers;

use App\Models\PeriodeSpmb;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * PengaturanController - Manajemen Pengaturan Sistem SPMB
 *
 * Menangani 3 sub-menu Pengaturan di portal admin:
 *   1. Status SPMB (Buka/Tutup)
 *   2. Periode & Gelombang Pendaftaran
 *   3. Pengaturan Sistem (Pengumuman, Kontak, Persyaratan)
 *
 * MODUL BARU - terisolasi, tidak memengaruhi controller yang sudah ada.
 */
class PengaturanController extends Controller
{
    // ─── Guard Helper ─────────────────────────────────────────────────────────

    /** Pastikan hanya admin yang dapat mengakses. */
    private function guardAdmin(): void
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Akses ditolak: hanya admin yang dapat mengakses halaman ini.');
        }
    }

    // =========================================================================
    // 1. STATUS SPMB (Buka / Tutup)
    // =========================================================================

    /** Tampilkan halaman pengaturan status SPMB. */
    public function statusSpmb(): \Inertia\Response
    {
        $this->guardAdmin();

        return Inertia::render('Admin/Pengaturan/StatusSpmb', [
            'statusSpmb'   => Setting::get('spmb_status', 'buka'),
            'flash_status' => session('status'),
            'flash_error'  => session('error'),
        ]);
    }

    /** Simpan perubahan status SPMB. */
    public function updateStatus(Request $request): \Illuminate\Http\RedirectResponse
    {
        $this->guardAdmin();

        $request->validate([
            'status' => 'required|in:buka,tutup',
        ]);

        Setting::set('spmb_status', $request->status);

        $label = $request->status === 'buka' ? 'DIBUKA' : 'DITUTUP';

        return redirect()->route('pengaturan.status')
            ->with('status', "Status pendaftaran SPMB berhasil diubah menjadi {$label}.");
    }

    // =========================================================================
    // 2. PERIODE & GELOMBANG PENDAFTARAN
    // =========================================================================

    /** Tampilkan halaman manajemen periode. */
    public function periode(): \Inertia\Response
    {
        $this->guardAdmin();

        $periodes = PeriodeSpmb::orderBy('tahun', 'desc')->get();

        return Inertia::render('Admin/Pengaturan/Periode', [
            'periodes'     => $periodes,
            'periodeAktif' => PeriodeSpmb::getAktif(),
            'flash_status' => session('status'),
            'flash_error'  => session('error'),
        ]);
    }

    /** Simpan atau perbarui periode. */
    public function updatePeriode(Request $request): \Illuminate\Http\RedirectResponse
    {
        $this->guardAdmin();

        $request->validate([
            'tahun'          => 'required|integer|min:2026|max:2045',
            'is_aktif'       => 'required|boolean',
            'bulan_berjalan' => 'nullable|integer|min:1|max:12',
            'tahun_berjalan' => 'nullable|integer|min:2026|max:2045',
            'gel1_mulai'     => 'nullable|date',
            'gel1_selesai'   => 'nullable|date|after_or_equal:gel1_mulai',
            'gel2_mulai'     => 'nullable|date',
            'gel2_selesai'   => 'nullable|date|after_or_equal:gel2_mulai',
            'gel3_mulai'     => 'nullable|date',
            'gel3_selesai'   => 'nullable|date|after_or_equal:gel3_mulai',
        ]);

        // Jika periode ini diaktifkan, nonaktifkan semua periode lain terlebih dahulu.
        if ($request->boolean('is_aktif')) {
            PeriodeSpmb::where('is_aktif', true)->update(['is_aktif' => false]);
        }

        PeriodeSpmb::updateOrCreate(
            ['tahun' => $request->tahun],
            [
                'is_aktif'       => $request->boolean('is_aktif'),
                'bulan_berjalan' => $request->bulan_berjalan,
                'tahun_berjalan' => $request->tahun_berjalan,
                'gel1_mulai'     => $request->gel1_mulai,
                'gel1_selesai'   => $request->gel1_selesai,
                'gel2_mulai'     => $request->gel2_mulai,
                'gel2_selesai'   => $request->gel2_selesai,
                'gel3_mulai'     => $request->gel3_mulai,
                'gel3_selesai'   => $request->gel3_selesai,
            ]
        );

        return redirect()->route('pengaturan.periode')
            ->with('status', "Periode tahun {$request->tahun} berhasil disimpan.");
    }

    // =========================================================================
    // 3. PENGATURAN SISTEM (Pengumuman, Kontak, Persyaratan)
    // =========================================================================

    /** Tampilkan halaman pengaturan sistem. */
    public function sistem(): \Inertia\Response
    {
        $this->guardAdmin();

        $persyaratan = json_decode(
            Setting::get('persyaratan_dokumen', '[]'),
            true
        ) ?? [];

        return Inertia::render('Admin/Pengaturan/Sistem', [
            'teksPengumuman'   => Setting::get('teks_pengumuman', ''),
            'kontakWa'         => Setting::get('kontak_wa', ''),
            'emailSekolah'     => Setting::get('email_sekolah', ''),
            'persyaratanDokumen' => $persyaratan,
            'flash_status'     => session('status'),
            'flash_error'      => session('error'),
        ]);
    }

    /** Simpan pengaturan sistem. */
    public function updateSistem(Request $request): \Illuminate\Http\RedirectResponse
    {
        $this->guardAdmin();

        $request->validate([
            'teks_pengumuman'    => 'nullable|string|max:1000',
            'kontak_wa'          => 'nullable|string|max:20',
            'email_sekolah'      => 'nullable|email|max:100',
            'persyaratan'        => 'nullable|array',
            'persyaratan.*.id'   => 'required|integer',
            'persyaratan.*.nama' => 'required|string|max:200',
            'persyaratan.*.aktif'=> 'required|boolean',
        ]);

        Setting::set('teks_pengumuman', $request->teks_pengumuman ?? '');
        Setting::set('kontak_wa',       $request->kontak_wa ?? '');
        Setting::set('email_sekolah',   $request->email_sekolah ?? '');

        if ($request->has('persyaratan')) {
            Setting::set('persyaratan_dokumen', json_encode($request->persyaratan));
        }

        return redirect()->route('pengaturan.sistem')
            ->with('status', 'Pengaturan sistem berhasil disimpan.');
    }
}
