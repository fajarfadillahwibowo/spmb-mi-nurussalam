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
            $table->enum('status_email_lulus', ['belum_terkirim', 'terkirim'])
                ->default('belum_terkirim')
                ->after('status_wa_lulus')
                ->comment('Status pengiriman email pengumuman kelulusan');

            $table->timestamp('email_lulus_sent_at')
                ->nullable()
                ->after('status_email_lulus')
                ->comment('Waktu pengiriman sukses email kelulusan');

            $table->enum('status_email_bayar', ['belum_terkirim', 'terkirim'])
                ->default('belum_terkirim')
                ->after('status_wa_bayar')
                ->comment('Status pengiriman email konfirmasi pembayaran');

            $table->timestamp('email_bayar_sent_at')
                ->nullable()
                ->after('status_email_bayar')
                ->comment('Waktu pengiriman sukses email pembayaran');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pendaftarans', function (Blueprint $table) {
            $table->dropColumn([
                'status_email_lulus',
                'email_lulus_sent_at',
                'status_email_bayar',
                'email_bayar_sent_at',
            ]);
        });
    }
};
