<?php

namespace App\Models;

// ─── Framework & Third-Party Imports ──────────────────────────────────────────
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model Seleksi (Hasil Evaluasi Panitia)
 *
 * Merepresentasikan hasil penilaian administratif yang dilakukan oleh
 * admin terhadap berkas pendaftaran calon peserta didik. Rekaman ini
 * dibuat atau diperbarui ketika admin menjalankan aksi evaluasi pada
 * halaman manajemen seleksi.
 *
 * @property int         $id
 * @property int         $pendaftaran_id  Foreign key ke tabel pendaftarans
 * @property int         $admin_id        ID admin yang melakukan evaluasi (foreign key ke users)
 * @property string      $status_seleksi  Hasil evaluasi: 'lulus' atau 'tidak_lulus'
 * @property string|null $catatan         Catatan tambahan dari admin mengenai keputusan seleksi
 */
#[Fillable([
    'pendaftaran_id',
    'admin_id',
    'status_seleksi',
    'catatan',
])]
class Seleksi extends Model
{
    // ─── Relationships ────────────────────────────────────────────────────────

    /**
     * Mendapatkan data pendaftaran yang dievaluasi.
     *
     * Relasi inverse One-to-One: Satu hasil Seleksi terkait pada satu Pendaftaran.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function pendaftaran(): BelongsTo
    {
        return $this->belongsTo(Pendaftaran::class);
    }

    /**
     * Mendapatkan admin yang melaksanakan proses evaluasi.
     *
     * Menggunakan foreign key kustom 'admin_id' karena nama kolom tidak
     * mengikuti konvensi default Laravel ('user_id').
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
