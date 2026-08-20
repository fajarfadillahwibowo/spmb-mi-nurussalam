<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Tabel Notifikasi Sistem SPMB
 *
 * Tabel ini menyimpan semua notifikasi in-app untuk pengguna (siswa maupun admin).
 * Dibuat secara terpisah dan modular agar tidak mempengaruhi schema yang sudah ada.
 *
 * Kolom:
 *  - user_id  : FK ke users. NULL berarti notifikasi broadcast untuk semua admin.
 *  - for_role : Target penerima ('siswa', 'admin'). Digunakan saat user_id NULL.
 *  - title    : Judul singkat notifikasi.
 *  - message  : Isi pesan lengkap.
 *  - is_read  : Status baca (false = belum dibaca).
 *  - link_url : URL tujuan saat notifikasi diklik (nullable).
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifikasis', function (Blueprint $table) {
            $table->id();

            // FK ke users — nullable karena notifikasi admin bisa bersifat broadcast
            $table->foreignId('user_id')
                  ->nullable()
                  ->constrained('users')
                  ->cascadeOnDelete();

            // Target role penerima untuk notifikasi broadcast (user_id = NULL)
            $table->enum('for_role', ['siswa', 'admin', 'all'])->default('siswa');

            $table->string('title', 255);
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->string('link_url', 500)->nullable();

            $table->timestamps();

            // Index untuk performa query per-user dan unread count
            $table->index(['user_id', 'is_read']);
            $table->index(['for_role', 'is_read']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifikasis');
    }
};
