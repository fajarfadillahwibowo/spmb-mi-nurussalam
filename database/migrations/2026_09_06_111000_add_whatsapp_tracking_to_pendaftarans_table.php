<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pendaftarans', function (Blueprint $table) {
            $table->enum('status_wa_lulus', ['belum_terkirim', 'terkirim'])
                ->default('belum_terkirim')
                ->after('status')
                ->comment('Status pengiriman notifikasi WA pengumuman kelulusan');

            $table->timestamp('wa_lulus_sent_at')
                ->nullable()
                ->after('status_wa_lulus')
                ->comment('Waktu pengiriman sukses notifikasi WA kelulusan');

            $table->enum('status_wa_bayar', ['belum_terkirim', 'terkirim'])
                ->default('belum_terkirim')
                ->after('catatan_pembayaran')
                ->comment('Status pengiriman notifikasi WA konfirmasi pembayaran');

            $table->timestamp('wa_bayar_sent_at')
                ->nullable()
                ->after('status_wa_bayar')
                ->comment('Waktu pengiriman sukses notifikasi WA pembayaran');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pendaftarans', function (Blueprint $table) {
            $table->dropColumn([
                'status_wa_lulus',
                'wa_lulus_sent_at',
                'status_wa_bayar',
                'wa_bayar_sent_at',
            ]);
        });
    }
};
