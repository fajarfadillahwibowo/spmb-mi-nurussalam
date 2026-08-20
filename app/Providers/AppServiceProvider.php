<?php

namespace App\Providers;

// ─── Framework Imports ────────────────────────────────────────────────────────
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

// ─── Model Imports ────────────────────────────────────────────────────────────
use App\Models\Dokumen;
use App\Models\Pendaftaran;
use App\Models\Seleksi;

// ─── Observer Imports [BARU — Sistem Notifikasi] ──────────────────────────────
use App\Observers\DokumenObserver;
use App\Observers\PendaftaranObserver;
use App\Observers\SeleksiObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // ── Registrasi Observer Sistem Notifikasi [BARU] ─────────────────────
        // Observer ini memicu notifikasi in-app secara otomatis berdasarkan
        // perubahan pada model. Tidak ada perubahan pada logika bisnis yang ada.
        Pendaftaran::observe(PendaftaranObserver::class);
        Dokumen::observe(DokumenObserver::class);
        Seleksi::observe(SeleksiObserver::class);
    }
}
