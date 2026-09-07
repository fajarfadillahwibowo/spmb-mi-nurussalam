<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class KepalaSekolahSeeder extends Seeder
{
    /**
     * Seed akun Kepala Sekolah (Supervisor / Read-Only).
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'kepala.sekolah@minurussalam.sch.id'],
            [
                'username'          => 'Kepala-Sekolah',
                'password'          => Hash::make('kepalasekolah123'),
                'role'              => 'kepala_sekolah',
                'email_verified_at' => now(),
            ]
        );
    }
}
