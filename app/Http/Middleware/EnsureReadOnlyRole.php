<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureReadOnlyRole
{
    /**
     * Mencegah bypass mutasi data dari client API (Postman / cURL / devtools).
     *
     * Jika pengguna login ber-role 'kepala_sekolah', middleware ini hanya mengizinkan
     * HTTP request yang bersifat aman/idempoten (GET, HEAD, OPTIONS).
     * Setiap upaya pengiriman POST, PUT, PATCH, DELETE akan langsung digagalkan dengan 403 Forbidden.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->role === 'kepala_sekolah') {
            if (! in_array($request->method(), ['GET', 'HEAD', 'OPTIONS'], true)) {
                if ($request->expectsJson()) {
                    return response()->json([
                        'status'  => 'forbidden',
                        'message' => 'Pelanggaran Keamanan: Akun Kepala Sekolah berstatus Supervisor (Read-Only) dan dilarang mengubah/menghapus data.'
                    ], 403);
                }

                abort(403, 'Akses Ditolak: Role Kepala Sekolah hanya memiliki hak baca (Read-Only / Supervisor).');
            }
        }

        return $next($request);
    }
}
