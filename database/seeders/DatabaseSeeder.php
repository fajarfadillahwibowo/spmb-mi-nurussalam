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
        User::create([
            'username' => 'admin',
            'email' => 'admin@minurussalam.sch.id',
            'password' => Hash::make('adminspmb123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Default Verified Student
        User::create([
            'username' => 'siswa',
            'email' => 'siswa@gmail.com',
            'password' => Hash::make('siswaspmb123'),
            'role' => 'siswa',
            'email_verified_at' => now(),
        ]);

        // Default Unverified Student
        User::create([
            'username' => 'siswabaru',
            'email' => 'siswabaru@gmail.com',
            'password' => Hash::make('siswaspmb123'),
            'role' => 'siswa',
            'email_verified_at' => null,
            'verification_code' => '123456',
            'verification_code_expires_at' => now()->addHours(2),
        ]);
    }
}
