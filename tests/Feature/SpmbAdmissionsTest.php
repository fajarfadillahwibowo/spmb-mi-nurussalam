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
            'nik' => '3507011234567890',
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
            'nik' => '3507011234567890',
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
            'nik' => '3507011234567890',
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
            'ijazah'         => UploadedFile::fake()->create('ijazah.pdf', 100, 'application/pdf'),
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

        // Re-evaluate from Lulus to Tidak Lulus (Ubah Status)
        $responseTidakLulus = $this->actingAs($admin)->post("/seleksi/{$pendaftaran->id}/evaluate", [
            'status' => 'tidak_lulus',
            'catatan' => 'Diubah menjadi tidak lulus.',
        ]);

        $responseTidakLulus->assertRedirect(route('seleksi.index'));
        $this->assertEquals('tidak_lulus', $pendaftaran->fresh()->status);
        $this->assertDatabaseHas('seleksis', [
            'pendaftaran_id' => $pendaftaran->id,
            'status_seleksi' => 'tidak_lulus',
        ]);

        // Reset status back to proses/menunggu
        $responseReset = $this->actingAs($admin)->post("/seleksi/{$pendaftaran->id}/evaluate", [
            'status_seleksi' => 'proses',
        ]);

        $responseReset->assertRedirect(route('seleksi.index'));
        $this->assertEquals('menunggu_verifikasi', $pendaftaran->fresh()->status);
        $this->assertDatabaseHas('seleksis', [
            'pendaftaran_id' => $pendaftaran->id,
            'status_seleksi' => 'proses',
        ]);
    }

    public function test_admin_can_update_candidate_biodata(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $siswa = User::factory()->create(['role' => 'siswa']);
        $pendaftaran = Pendaftaran::create([
            'user_id' => $siswa->id,
            'nama_lengkap' => 'Nama Salah Typo',
            'nik' => '3507011234567890',
            'tempat_lahir' => 'Malang',
            'tanggal_lahir' => '2019-05-15',
            'jenis_kelamin' => 'L',
            'asal_sekolah' => 'TK Aisyiyah',
            'alamat' => 'Jl. Mawar No. 10',
            'nama_orang_tua' => 'Budi Santoso',
            'no_hp_wali' => '081234567890',
            'status' => 'belum_lengkap',
        ]);

        $response = $this->actingAs($admin)->post("/data-pendaftar/{$pendaftaran->id}/update", [
            'nama_lengkap' => 'Nama Benar',
            'nik' => '3507011234567890',
            'tempat_lahir' => 'Malang',
            'tanggal_lahir' => '2019-05-15',
            'jenis_kelamin' => 'L',
            'asal_sekolah' => 'RA Nurul Huda',
            'alamat' => 'Jl. Melati No. 20 RT 01 RW 02',
            'nama_orang_tua' => 'Budi Santoso',
            'no_hp_wali' => '081234567890',
        ]);

        $response->assertRedirect(route('data-pendaftar.index'));

        $this->assertDatabaseHas('pendaftarans', [
            'id' => $pendaftaran->id,
            'nama_lengkap' => 'Nama Benar',
            'asal_sekolah' => 'RA Nurul Huda',
            'alamat' => 'Jl. Melati No. 20 RT 01 RW 02',
        ]);

        // In-app notification sent to student
        $this->assertDatabaseHas('notifikasis', [
            'user_id' => $siswa->id,
            'title' => '✏️ Biodata Diperbarui oleh Admin',
        ]);
    }

    public function test_admin_can_send_biodata_revision_notification(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $siswa = User::factory()->create(['role' => 'siswa']);
        $pendaftaran = Pendaftaran::create([
            'user_id' => $siswa->id,
            'nama_lengkap' => 'Ahmad Fajar',
            'nik' => '3507011234567890',
            'tempat_lahir' => 'Sidogede',
            'tanggal_lahir' => '2019-01-01',
            'jenis_kelamin' => 'L',
            'asal_sekolah' => 'TK Melati',
            'alamat' => 'Sidogede',
            'nama_orang_tua' => 'Sutrisno',
            'no_hp_wali' => '085600000001',
            'status' => 'belum_lengkap',
        ]);

        $response = $this->actingAs($admin)->post("/data-pendaftar/{$pendaftaran->id}/kirim-notifikasi", [
            'pesan' => 'Alamat belum menyertakan nomor RT dan RW. Mohon perbarui.',
            'kirim_wa' => false,
        ]);

        $response->assertRedirect(route('data-pendaftar.index'));

        // Verify in-app notification in database
        $this->assertDatabaseHas('notifikasis', [
            'user_id' => $siswa->id,
            'title' => '⚠️ Pembaruan Biodata Diperlukan',
            'message' => 'Alamat belum menyertakan nomor RT dan RW. Mohon perbarui.',
            'link_url' => '/pendaftaran',
        ]);
    }
}
