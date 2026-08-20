<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Tabel Periode SPMB (Manajemen Tahun Ajaran & Gelombang)
 *
 * Menyimpan data periode/tahun ajaran beserta rentang tanggal
 * untuk setiap gelombang pendaftaran.
 *
 * MODUL BARU — tidak memengaruhi tabel atau migrasi yang sudah ada.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('periode_spmb', function (Blueprint $table) {
            $table->id();
            $table->smallInteger('tahun')->comment('Tahun periode, contoh: 2026');
            $table->boolean('is_aktif')->default(false)->comment('Hanya satu periode yang aktif');
            $table->tinyInteger('bulan_berjalan')->nullable()->comment('Bulan berjalan 1-12');
            $table->smallInteger('tahun_berjalan')->nullable()->comment('Tahun berjalan');

            // Gelombang I
            $table->date('gel1_mulai')->nullable()->comment('Tanggal mulai Gelombang I');
            $table->date('gel1_selesai')->nullable()->comment('Tanggal selesai Gelombang I');

            // Gelombang II
            $table->date('gel2_mulai')->nullable()->comment('Tanggal mulai Gelombang II');
            $table->date('gel2_selesai')->nullable()->comment('Tanggal selesai Gelombang II');

            // Gelombang III
            $table->date('gel3_mulai')->nullable()->comment('Tanggal mulai Gelombang III');
            $table->date('gel3_selesai')->nullable()->comment('Tanggal selesai Gelombang III');

            $table->timestamps();

            $table->unique('tahun');
        });

        // ── Seed data default: Tahun 2026 (aktif) ────────────────────────────
        $now = now();

        DB::table('periode_spmb')->insert([
            [
                'tahun'          => 2026,
                'is_aktif'       => true,
                'bulan_berjalan' => (int) date('m'),
                'tahun_berjalan' => (int) date('Y'),
                'gel1_mulai'     => '2026-01-06',
                'gel1_selesai'   => '2026-02-28',
                'gel2_mulai'     => '2026-03-02',
                'gel2_selesai'   => '2026-04-30',
                'gel3_mulai'     => '2026-05-04',
                'gel3_selesai'   => '2026-06-30',
                'created_at'     => $now,
                'updated_at'     => $now,
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('periode_spmb');
    }
};
