<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Tabel Settings (Pengaturan Global SPMB)
 *
 * Tabel key-value untuk menyimpan seluruh konfigurasi sistem SPMB
 * yang dapat diubah oleh admin melalui portal Pengaturan.
 *
 * MODUL BARU — tidak memengaruhi tabel atau migrasi yang sudah ada.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique()->comment('Identifier unik pengaturan');
            $table->text('value')->nullable()->comment('Nilai pengaturan (JSON atau string)');
            $table->string('label')->nullable()->comment('Label tampilan untuk UI admin');
            $table->string('group')->default('general')->comment('Kelompok pengaturan');
            $table->timestamps();
        });

        // ── Seed data default ─────────────────────────────────────────────────
        $now = now();

        DB::table('settings')->insert([
            [
                'key'        => 'spmb_status',
                'value'      => 'buka',
                'label'      => 'Status Pendaftaran SPMB',
                'group'      => 'spmb',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key'        => 'teks_pengumuman',
                'value'      => 'Selamat datang di Portal SPMB MI Nurussalam Sidogede. Silakan lengkapi data pendaftaran Anda sebelum batas waktu yang ditentukan.',
                'label'      => 'Teks Pengumuman Dashboard Siswa',
                'group'      => 'sistem',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key'        => 'kontak_wa',
                'value'      => '6281234567890',
                'label'      => 'Nomor WhatsApp Admin',
                'group'      => 'kontak',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key'        => 'email_sekolah',
                'value'      => 'minurussalam.sidogede@gmail.com',
                'label'      => 'Email Sekolah',
                'group'      => 'kontak',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key'        => 'persyaratan_dokumen',
                'value'      => json_encode([
                    ['id' => 1, 'nama' => 'Fotokopi Kartu Keluarga (KK)', 'aktif' => true],
                    ['id' => 2, 'nama' => 'Fotokopi Akta Kelahiran', 'aktif' => true],
                    ['id' => 3, 'nama' => 'Fotokopi KTP Orang Tua / Wali', 'aktif' => true],
                    ['id' => 4, 'nama' => 'Pas Foto Terbaru (3x4 dan 4x6)', 'aktif' => true],
                    ['id' => 5, 'nama' => 'Fotokopi Ijazah / SKL TK/RA', 'aktif' => true],
                    ['id' => 6, 'nama' => 'Surat Rekomendasi Kepala TK/RA', 'aktif' => false],
                    ['id' => 7, 'nama' => 'Sertifikat Prestasi (Jalur Prestasi)', 'aktif' => false],
                    ['id' => 8, 'nama' => 'Surat Keterangan Tidak Mampu (SKTM)', 'aktif' => false],
                ]),
                'label'      => 'Daftar Persyaratan Dokumen',
                'group'      => 'sistem',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
