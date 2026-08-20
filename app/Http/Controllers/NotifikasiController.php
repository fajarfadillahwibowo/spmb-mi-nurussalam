<?php

namespace App\Http\Controllers;

// ─── Framework & Third-Party Imports ──────────────────────────────────────────
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

// ─── Internal Imports ─────────────────────────────────────────────────────────
use App\Helpers\NotifikasiHelper;
use App\Models\Notifikasi;

/**
 * NotifikasiController — Controller API Sistem Notifikasi In-App
 *
 * Mengelola operasi baca/tandai-dibaca pada notifikasi pengguna.
 * Semua endpoint mengembalikan JSON dan memerlukan autentikasi.
 *
 * Endpoint:
 *  GET  /notifikasi              → Ambil daftar notifikasi user (maks 30 terbaru)
 *  POST /notifikasi/{id}/baca    → Tandai satu notifikasi sebagai dibaca
 *  POST /notifikasi/baca-semua   → Tandai semua notifikasi user sebagai dibaca
 */
class NotifikasiController extends Controller
{
    /**
     * Ambil daftar notifikasi milik user yang sedang login.
     *
     * Mengambil notifikasi personal (user_id match) dan broadcast
     * untuk role user yang bersangkutan (user_id NULL, for_role match).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();

        $notifications = Notifikasi::untukUser($user)
            ->orderBy('created_at', 'desc')
            ->limit(30)
            ->get()
            ->map(fn ($n) => [
                'id'         => $n->id,
                'title'      => $n->title,
                'message'    => $n->message,
                'is_read'    => $n->is_read,
                'link_url'   => $n->link_url,
                'created_at' => $n->created_at?->diffForHumans(),
            ]);

        $unreadCount = Notifikasi::untukUser($user)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count'  => $unreadCount,
        ]);
    }

    /**
     * Tandai SATU notifikasi sebagai sudah dibaca.
     *
     * Hanya memproses notifikasi yang memang milik user yang login
     * untuk mencegah user lain menandai notifikasi bukan miliknya.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAsRead(int $id): JsonResponse
    {
        $user = Auth::user();

        // Cari notifikasi yang milik user ini (personal atau broadcast role)
        $notifikasi = Notifikasi::untukUser($user)->where('id', $id)->first();

        if ($notifikasi) {
            $notifikasi->update(['is_read' => true]);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Tandai SEMUA notifikasi milik user sebagai sudah dibaca.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAllRead(): JsonResponse
    {
        $user = Auth::user();

        NotifikasiHelper::bacaSemuaMilikUser($user);

        return response()->json(['success' => true]);
    }
}
