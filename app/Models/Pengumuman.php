<?php

namespace App\Models;

// ─── Framework & Third-Party Imports ──────────────────────────────────────────
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model Pengumuman (Rekaman Hasil Pengumuman Resmi)
 *
 * Merepresentasikan data pengumuman resmi penerimaan peserta didik baru
 * yang diterbitkan oleh admin. Berbeda dengan Seleksi yang mencatat
 * proses evaluasi internal, Pengumuman mencatat keputusan final yang
 * dikomunikasikan secara resmi kepada calon peserta didik.
 *
 * @property int         $id
 * @property int         $pendaftaran_id      Foreign key ke tabel pendaftarans
 * @property int         $admin_id            ID admin yang menerbitkan pengumuman
 * @property string      $status_pengumuman   Status: 'diterima', 'tidak_diterima', dll.
 * @property string|null $catatan             Catatan tambahan yang disertakan dalam pengumuman
 * @property \Carbon\Carbon|null $tanggal_pengumuman  Tanggal dan waktu pengumuman resmi diterbitkan
 */
class Pengumuman extends Model
{
    /**
     * Nama tabel database yang digunakan model ini.
     *
     * Dideklarasikan eksplisit karena nama tabel ('pengumumans') tidak
     * mengikuti konvensi plural bahasa Inggris dari Laravel secara otomatis.
     *
     * @var string
     */
    protected $table = 'pengumumans';

    /**
     * Atribut yang diizinkan untuk diisi secara massal (mass assignment).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'pendaftaran_id',
        'admin_id',
        'status_pengumuman',
        'catatan',
        'tanggal_pengumuman',
    ];

    /**
     * Casting tipe data otomatis untuk atribut model.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tanggal_pengumuman' => 'datetime',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    /**
     * Mendapatkan data pendaftaran yang menjadi subjek pengumuman ini.
     *
     * Relasi inverse: Satu pengumuman merujuk pada satu Pendaftaran.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function pendaftaran(): BelongsTo
    {
        return $this->belongsTo(Pendaftaran::class);
    }

    /**
     * Mendapatkan admin yang menerbitkan pengumuman ini.
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
