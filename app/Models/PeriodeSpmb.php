<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

/**
 * Model PeriodeSpmb - Periode/Tahun Ajaran SPMB
 *
 * Menyimpan data periode aktif dan rentang gelombang pendaftaran.
 * MODUL BARU - tidak memengaruhi model yang sudah ada.
 *
 * @property int       $id
 * @property int       $tahun
 * @property bool      $is_aktif
 * @property int|null  $bulan_berjalan
 * @property int|null  $tahun_berjalan
 * @property string|null $gel1_mulai
 * @property string|null $gel1_selesai
 * @property string|null $gel2_mulai
 * @property string|null $gel2_selesai
 * @property string|null $gel3_mulai
 * @property string|null $gel3_selesai
 */
class PeriodeSpmb extends Model
{
    protected $table    = 'periode_spmb';
    protected $fillable = [
        'tahun', 'is_aktif', 'bulan_berjalan', 'tahun_berjalan',
        'gel1_mulai', 'gel1_selesai',
        'gel2_mulai', 'gel2_selesai',
        'gel3_mulai', 'gel3_selesai',
    ];

    protected $casts = [
        'is_aktif'    => 'boolean',
        'gel1_mulai'  => 'date',
        'gel1_selesai'=> 'date',
        'gel2_mulai'  => 'date',
        'gel2_selesai'=> 'date',
        'gel3_mulai'  => 'date',
        'gel3_selesai'=> 'date',
    ];

    // ─── Scopes ───────────────────────────────────────────────────────────────

    /** Scope: hanya periode yang aktif. */
    public function scopeAktif(Builder $query): Builder
    {
        return $query->where('is_aktif', true);
    }

    // ─── Static Helpers ───────────────────────────────────────────────────────

    /** Ambil periode yang sedang aktif, atau null jika tidak ada. */
    public static function getAktif(): ?static
    {
        return static::aktif()->first();
    }

    /**
     * Kembalikan tanggal awal periode ini (gel1_mulai atau 1 Jan tahun bersangkutan).
     * Digunakan sebagai batas bawah filter data.
     */
    public function getStartDate(): Carbon
    {
        return $this->gel1_mulai
            ? Carbon::parse($this->gel1_mulai)->startOfDay()
            : Carbon::create($this->tahun, 1, 1)->startOfDay();
    }

    /**
     * Kembalikan tanggal akhir periode ini (gel3_selesai atau 31 Des tahun bersangkutan).
     * Digunakan sebagai batas atas filter data.
     */
    public function getEndDate(): Carbon
    {
        return $this->gel3_selesai
            ? Carbon::parse($this->gel3_selesai)->endOfDay()
            : Carbon::create($this->tahun, 12, 31)->endOfDay();
    }

    /** Daftar semua tahun yang tersedia sebagai array. */
    public static function daftarTahun(): array
    {
        return static::orderBy('tahun', 'desc')
            ->pluck('tahun', 'id')
            ->toArray();
    }
}
