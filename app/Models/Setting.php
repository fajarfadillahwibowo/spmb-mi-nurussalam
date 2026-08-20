<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Model Setting - Pengaturan Global SPMB
 *
 * Menyediakan akses ke tabel settings melalui helper statis.
 * MODUL BARU - tidak memengaruhi model yang sudah ada.
 *
 * @property int         $id
 * @property string      $key
 * @property string|null $value
 * @property string|null $label
 * @property string      $group
 */
class Setting extends Model
{
    protected $table    = 'settings';
    protected $fillable = ['key', 'value', 'label', 'group'];

    /** Ambil nilai setting berdasarkan key. */
    public static function get(string $key, mixed $default = null): mixed
    {
        $row = static::where('key', $key)->first();
        return $row ? $row->value : $default;
    }

    /** Simpan atau perbarui nilai setting. */
    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
    }

    /** Ambil semua setting dalam satu group sebagai key=>value array. */
    public static function getGroup(string $group): array
    {
        return static::where('group', $group)
            ->get()
            ->pluck('value', 'key')
            ->toArray();
    }
}
