<?php

namespace App\Models;

// ─── Framework & Third-Party Imports ──────────────────────────────────────────
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model Notifikasi (Sistem Notifikasi In-App SPMB)
 *
 * Merepresentasikan satu entri notifikasi yang dikirim kepada pengguna.
 * Notifikasi dapat bersifat personal (user_id terisi) atau broadcast
 * ke semua pengguna dengan role tertentu (user_id NULL, for_role terisi).
 *
 * @property int         $id
 * @property int|null    $user_id     Penerima spesifik (null = broadcast per role)
 * @property string      $for_role    Target role: 'siswa', 'admin', atau 'all'
 * @property string      $title       Judul singkat notifikasi
 * @property string      $message     Isi pesan lengkap
 * @property bool        $is_read     Status baca
 * @property string|null $link_url    URL tujuan saat notifikasi diklik
 */
#[Fillable(['user_id', 'for_role', 'title', 'message', 'is_read', 'link_url'])]
class Notifikasi extends Model
{
    // ─── Attribute Casting ────────────────────────────────────────────────────

    protected $casts = [
        'is_read' => 'boolean',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    /**
     * Mendapatkan pengguna pemilik notifikasi ini (jika personal).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    /**
     * Scope: ambil notifikasi milik user tertentu (personal + broadcast sesuai role).
     */
    public function scopeUntukUser($query, $user)
    {
        return $query->where(function ($q) use ($user) {
            $q->where('user_id', $user->id)
              ->orWhere(function ($q2) use ($user) {
                  $q2->whereNull('user_id')
                     ->where('for_role', $user->role);
              });
        });
    }
}
