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
            $table->string('nik', 16)->nullable()->after('nama_lengkap');
            $table->enum('payment_status', ['belum_bayar', 'cicilan', 'lunas'])->default('belum_bayar')->after('status');
            $table->decimal('amount_paid', 12, 2)->default(0.00)->after('payment_status');
        });

        Schema::table('dokumens', function (Blueprint $table) {
            $table->string('ijazah_path')->nullable()->after('identitas_ortu_path');
            $table->string('pkh_kks_path')->nullable()->after('ijazah_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pendaftarans', function (Blueprint $table) {
            $table->dropColumn(['nik', 'payment_status', 'amount_paid']);
        });

        Schema::table('dokumens', function (Blueprint $table) {
            $table->dropColumn(['ijazah_path', 'pkh_kks_path']);
        });
    }
};
