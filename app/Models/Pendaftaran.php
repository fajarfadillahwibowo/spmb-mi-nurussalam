<?php

namespace App\Models;

// ─── Framework & Third-Party Imports ──────────────────────────────────────────
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Model Pendaftaran (Registrasi Calon Siswa)
 *
 * Merepresentasikan formulir biodata calon peserta didik baru yang
 * diisi oleh pengguna berstatus 'siswa'. Model ini menjadi entitas
 * sentral yang berelasi dengan Dokumen, Seleksi, dan data Pengguna.
 *
 * @property int         $id
 * @property int         $user_id
 * @property string      $nama_lengkap
 * @property string      $nik                      Nomor Induk Kependudukan (16 digit)
 * @property string|null $asal_sekolah
 * @property string      $tempat_lahir
 * @property \Carbon\Carbon $tanggal_lahir
 * @property string      $jenis_kelamin            'L' atau 'P'
 * @property string      $alamat
 * @property string      $nama_orang_tua
 * @property string      $no_hp_wali               Nomor WhatsApp wali untuk notifikasi
 * @property string      $status                   Status berkas pendaftaran
 * @property string      $payment_status           Status pembayaran
 * @property float       $amount_paid              Akumulasi total nominal yang telah dibayarkan
 * @property string|null $bukti_pembayaran_path    Path file bukti transfer yang diunggah siswa
 * @property string|null $catatan_pembayaran       Catatan admin mengenai verifikasi pembayaran
 * @property string|null $pas_foto_path            Path file pas foto siswa
 */
#[Fillable([
    'user_id',
    'nama_lengkap',
    'nik',
    'asal_sekolah',
    'tempat_lahir',
    'tanggal_lahir',
    'jenis_kelamin',
    'alamat',
    'nama_orang_tua',
    'no_hp_wali',
    'status',
    'payment_status',
    'amount_paid',
    'bukti_pembayaran_path',
    'catatan_pembayaran',
    'pas_foto_path',
])]
class Pendaftaran extends Model
{
    // ─── Attribute Casting ────────────────────────────────────────────────────

    /**
     * Casting tipe data otomatis untuk atribut model.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tanggal_lahir' => 'date',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    /**
     * Mendapatkan pengguna (akun) pemilik data pendaftaran ini.
     *
     * Relasi inverse One-to-One: Satu pendaftaran dimiliki oleh satu User.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mendapatkan dokumen persyaratan yang diunggah untuk pendaftaran ini.
     *
     * Relasi One-to-One: Satu pendaftaran memiliki satu rekaman Dokumen.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function dokumen(): HasOne
    {
        return $this->hasOne(Dokumen::class);
    }

    /**
     * Mendapatkan hasil evaluasi/seleksi untuk pendaftaran ini.
     *
     * Relasi One-to-One: Satu pendaftaran memiliki satu hasil Seleksi
     * yang dicatat oleh admin penilai.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function seleksi(): HasOne
    {
        return $this->hasOne(Seleksi::class);
    }
}
