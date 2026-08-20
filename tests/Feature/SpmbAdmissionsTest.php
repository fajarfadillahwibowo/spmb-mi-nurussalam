<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Pendaftaran;
use App\Models\Dokumen;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SpmbAdmissionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_siswa_can_save_biodata(): void
    {
        $user = User::factory()->create([
            'role' => 'siswa',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($user)->post('/pendaftaran', [
            'nama_lengkap' => 'Ahmad Dani',
            'tempat_lahir' => 'Sidogede',
            'tanggal_lahir' => '2019-05-15',
            'jenis_kelamin' => 'L',
            'alamat' => 'Jl. Merdeka No. 42 Sidogede',
            'nama_orang_tua' => 'Slamet',
            'no_hp_wali' => '085607746031',
        ]);

        $response->assertRedirect(route('pendaftaran.index'));
        $this->assertDatabaseHas('pendaftarans', [
            'user_id' => $user->id,
            'nama_lengkap' => 'Ahmad Dani',
            'status' => 'belum_lengkap',
        ]);
    }

    public function test_siswa_can_upload_documents(): void
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'role' => 'siswa',
            'email_verified_at' => now(),
        ]);

        $pendaftaran = Pendaftaran::create([
            'user_id' => $user->id,
            'nama_lengkap' => 'Ahmad Dani',
            'tempat_lahir' => 'Sidogede',
            'tanggal_lahir' => '2019-05-15',
            'jenis_kelamin' => 'L',
            'alamat' => 'Jl. Merdeka No. 42 Sidogede',
            'nama_orang_tua' => 'Slamet',
            'no_hp_wali' => '085607746031',
            'status' => 'belum_lengkap',
        ]);

        $response = $this->actingAs($user)->post('/dokumen', [
            'akta_kelahiran' => UploadedFile::fake()->image('akta.jpg', 500, 500),
            'kartu_keluarga' => UploadedFile::fake()->create('kk.pdf', 100, 'application/pdf'),
            'identitas_ortu' => UploadedFile::fake()->image('ktp.png', 500, 500),
        ]);

        $response->assertRedirect(route('dokumen.index'));
        
        $pendaftaran->refresh();
        $this->assertEquals('menunggu_verifikasi', $pendaftaran->status);
        $this->assertNotNull($pendaftaran->dokumen);
        $this->assertNotEmpty($pendaftaran->dokumen->akta_kelahiran_path);
        
        // Assert storage has the files
        Storage::disk('public')->assertExists($pendaftaran->fresh()->dokumen->akta_kelahiran_path);
        Storage::disk('public')->assertExists($pendaftaran->fresh()->dokumen->kartu_keluarga_path);
        Storage::disk('public')->assertExists($pendaftaran->fresh()->dokumen->identitas_ortu_path);
    }

    public function test_admin_can_evaluate_pendaftaran(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $siswa = User::factory()->create([
            'role' => 'siswa',
            'email_verified_at' => now(),
        ]);

        $pendaftaran = Pendaftaran::create([
            'user_id' => $siswa->id,
            'nama_lengkap' => 'Ahmad Dani',
            'tempat_lahir' => 'Sidogede',
            'tanggal_lahir' => '2019-05-15',
            'jenis_kelamin' => 'L',
            'alamat' => 'Jl. Merdeka No. 42 Sidogede',
            'nama_orang_tua' => 'Slamet',
            'no_hp_wali' => '085607746031',
            'status' => 'menunggu_verifikasi',
        ]);

        // Evaluate Lulus
        $response = $this->actingAs($admin)->post("/seleksi/{$pendaftaran->id}/evaluate", [
            'status_seleksi' => 'lulus',
            'catatan' => 'Berkas lengkap dan sesuai kriteria.',
        ]);

        $response->assertRedirect(route('seleksi.index'));
        $this->assertEquals('lulus', $pendaftaran->fresh()->status);
        $this->assertDatabaseHas('seleksis', [
            'pendaftaran_id' => $pendaftaran->id,
            'admin_id' => $admin->id,
            'status_seleksi' => 'lulus',
            'catatan' => 'Berkas lengkap dan sesuai kriteria.',
        ]);
    }
}
