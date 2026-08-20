<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pendaftarans', function (Blueprint $table) {
            $table->string('bukti_pembayaran_path')->nullable()->after('amount_paid');
            $table->text('catatan_pembayaran')->nullable()->after('bukti_pembayaran_path');
        });

        DB::statement("ALTER TABLE pendaftarans MODIFY COLUMN payment_status ENUM('belum_bayar', 'menunggu_konfirmasi', 'cicilan', 'lunas') NOT NULL DEFAULT 'belum_bayar'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pendaftarans', function (Blueprint $table) {
            $table->dropColumn(['bukti_pembayaran_path', 'catatan_pembayaran']);
        });

        DB::statement("ALTER TABLE pendaftarans MODIFY COLUMN payment_status ENUM('belum_bayar', 'cicilan', 'lunas') NOT NULL DEFAULT 'belum_bayar'");
    }
};
