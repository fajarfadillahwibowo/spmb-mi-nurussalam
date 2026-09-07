<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Memeriksa apakah pengguna yang login memiliki salah satu role yang diizinkan.
     *
     * Contoh pemanggilan route middleware:
     * ->middleware('role:admin')
     * ->middleware('role:admin,kepala_sekolah')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            return redirect()->route('login');
        }

        $userRole = (string) $user->role;

        if (! in_array($userRole, $roles, true)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Akses Ditolak: Anda tidak memiliki otoritas untuk fitur ini.'
                ], 403);
            }

            abort(403, 'Akses Ditolak: Anda tidak memiliki wewenang untuk mengakses halaman ini.');
        }

        return $next($request);
    }
}
