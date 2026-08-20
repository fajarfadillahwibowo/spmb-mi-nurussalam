<?php

namespace App\Models;

// ─── Framework & Third-Party Imports ──────────────────────────────────────────
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model Pembayaran
 *
 * Merepresentasikan rekaman riwayat verifikasi pembayaran yang dilakukan
 * oleh admin terhadap bukti transfer yang diunggah oleh calon siswa.
 * Setiap verifikasi pembayaran dicatat di tabel ini beserta keterangan
 * nominal, status, dan identitas admin yang melakukan verifikasi.
 *
 * @property int         $id
 * @property int         $pendaftaran_id           Foreign key ke tabel pendaftarans
 * @property string      $payment_status           Status: 'cicilan', 'lunas', dll.
 * @property float       $amount_paid              Nominal yang diverifikasi pada transaksi ini
 * @property string|null $bukti_pembayaran_path    Path file bukti pembayaran yang diunggah siswa
 * @property string|null $catatan_pembayaran       Catatan admin mengenai transaksi ini
 * @property int|null    $verified_by              ID admin yang melakukan verifikasi
 * @property \Carbon\Carbon|null $verified_at      Timestamp saat verifikasi dilakukan
 */
class Pembayaran extends Model
{
    /**
     * Nama tabel database yang digunakan model ini.
     *
     * Dideklarasikan eksplisit karena nama tabel ('pembayarans') tidak
     * mengikuti konvensi plural bahasa Inggris dari Laravel secara otomatis.
     *
     * @var string
     */
    protected $table = 'pembayarans';

    /**
     * Atribut yang diizinkan untuk diisi secara massal (mass assignment).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'pendaftaran_id',
        'payment_status',
        'amount_paid',
        'bukti_pembayaran_path',
        'catatan_pembayaran',
        'verified_by',
        'verified_at',
    ];

    /**
     * Casting tipe data otomatis untuk atribut model.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount_paid'  => 'decimal:2',
        'verified_at'  => 'datetime',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    /**
     * Mendapatkan data pendaftaran yang berelasi dengan rekaman pembayaran ini.
     *
     * Relasi inverse One-to-One: Satu rekaman pembayaran milik satu Pendaftaran.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function pendaftaran(): BelongsTo
    {
        return $this->belongsTo(Pendaftaran::class);
    }

    /**
     * Mendapatkan admin yang telah melakukan verifikasi pada rekaman ini.
     *
     * Menggunakan foreign key kustom 'verified_by' karena nama kolom tidak
     * mengikuti konvensi default Laravel ('user_id').
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
