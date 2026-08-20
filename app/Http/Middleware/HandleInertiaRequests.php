<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

// ─── Internal Imports [BARU — Sistem Notifikasi] ──────────────────────────────
use App\Models\Notifikasi;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * Menambahkan data notifikasi sebagai shared props agar tersedia
     * di semua halaman tanpa perlu fetch terpisah dari setiap komponen.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user          = $request->user();
        $notifications = [];
        $unreadCount   = 0;

        // Hanya hitung notifikasi jika user sudah login
        if ($user) {
            $notifications = Notifikasi::untukUser($user)
                ->orderBy('created_at', 'desc')
                ->limit(15)
                ->get()
                ->map(fn ($n) => [
                    'id'         => $n->id,
                    'title'      => $n->title,
                    'message'    => $n->message,
                    'is_read'    => $n->is_read,
                    'link_url'   => $n->link_url,
                    'created_at' => $n->created_at?->diffForHumans(),
                ])
                ->toArray();

            $unreadCount = Notifikasi::untukUser($user)
                ->where('is_read', false)
                ->count();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            // ── Shared Notifikasi [BARU] ───────────────────────────────────
            'notifications' => $notifications,
            'unreadCount'   => $unreadCount,
        ];
    }
}
