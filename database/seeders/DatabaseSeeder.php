<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Default Admin User
        User::firstOrCreate(
            ['email' => 'sahronibelitang075@gmail.com'],
            [
                'username' => 'Sahroni-Admin',
                'password' => Hash::make('gurukecebanget'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Seed 39 Calon Siswa & Pendaftaran
        $this->call([
            CalonSiswaSeeder::class,
            KepalaSekolahSeeder::class,
        ]);
    }
}
