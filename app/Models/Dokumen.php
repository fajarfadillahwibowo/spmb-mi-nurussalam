<?php

namespace App\Models;

// ─── Framework & Third-Party Imports ──────────────────────────────────────────
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model Dokumen (Dokumen Persyaratan Pendaftaran)
 *
 * Merepresentasikan rekaman dokumen persyaratan yang diunggah oleh calon
 * peserta didik sebagai bagian dari proses pendaftaran SPMB. Setiap
 * file disimpan di disk 'public' dan path-nya disimpan pada kolom terkait.
 *
 * @property int         $id
 * @property int         $pendaftaran_id       Foreign key ke tabel pendaftarans
 * @property string|null $akta_kelahiran_path  Path file Akta Kelahiran
 * @property string|null $kartu_keluarga_path  Path file Kartu Keluarga
 * @property string|null $identitas_ortu_path  Path file KTP Orang Tua/Wali
 * @property string|null $ijazah_path          Path file Ijazah/SKHU TK/RA
 * @property string|null $pkh_kks_path         Path file Kartu PKH/KKS (opsional, untuk jalur afirmasi)
 */
#[Fillable([
    'pendaftaran_id',
    'akta_kelahiran_path',
    'kartu_keluarga_path',
    'identitas_ortu_path',
    'ijazah_path',
    'pkh_kks_path',
])]
class Dokumen extends Model
{
    // ─── Relationships ────────────────────────────────────────────────────────

    /**
     * Mendapatkan data pendaftaran yang memiliki dokumen-dokumen ini.
     *
     * Relasi inverse One-to-One: Satu rekaman Dokumen milik satu Pendaftaran.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function pendaftaran(): BelongsTo
    {
        return $this->belongsTo(Pendaftaran::class);
    }
}
