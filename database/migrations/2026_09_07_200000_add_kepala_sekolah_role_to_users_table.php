<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Menambahkan opsi role 'kepala_sekolah' pada tabel users
     * untuk mendukung sistem Role Management (Supervisor / Read-Only Access).
     */
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE `users` MODIFY COLUMN `role` ENUM('siswa', 'admin', 'kepala_sekolah') NOT NULL DEFAULT 'siswa'");
        } else {
            Schema::table('users', function (Blueprint $table) {
                $table->string('role', 30)->default('siswa')->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE `users` MODIFY COLUMN `role` ENUM('siswa', 'admin') NOT NULL DEFAULT 'siswa'");
        } else {
            Schema::table('users', function (Blueprint $table) {
                $table->string('role', 20)->default('siswa')->change();
            });
        }
    }
};
