<?php

/**
 * ============================================================
 *  WHITE BOX TEST – DokumenController
 *  Pengujian: Statement, Branch, dan Condition Coverage
 *  Framework: PHPUnit 12 + Laravel HTTP Test Helpers
 * ============================================================
 */

namespace Tests\Feature\WhiteBox;

use App\Models\Dokumen;
use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DokumenControllerTest extends TestCase
{
    use RefreshDatabase;

    // ─────────────────────────────────────────────────────────
    //  HELPERS
    // ─────────────────────────────────────────────────────────

    private function makeSiswa(): User
    {
        return User::factory()->create([
            'role'              => 'siswa',
            'email_verified_at' => now(),
        ]);
    }

    private function makeAdmin(): User
    {
        return User::factory()->create([
            'role'              => 'admin',
            'email_verified_at' => now(),
        ]);
    }

    /**
     * Buat record Pendaftaran untuk siswa tertentu.
     */
    private function makePendaftaran(User $user, array $override = []): Pendaftaran
    {
        return Pendaftaran::create(array_merge([
            'user_id'        => $user->id,
            'nik'            => '3507011234567890',
            'nama_lengkap'   => 'Test Siswa',
            'tempat_lahir'   => 'Sidogede',
            'tanggal_lahir'  => '2019-01-01',
            'jenis_kelamin'  => 'L',
            'alamat'         => 'Jl. Test No.1',
            'nama_orang_tua' => 'Ortu Test',
            'no_hp_wali'     => '085600000001',
            'status'         => 'belum_lengkap',
            'payment_status' => 'belum_bayar',
            'amount_paid'    => 0,
        ], $override));
    }

    /** Buat fake PDF file (≤ 2 MB). */
    private function fakePdf(string $name = 'doc.pdf'): UploadedFile
    {
        return UploadedFile::fake()->create($name, 100, 'application/pdf');
    }

    /** Buat fake image file. */
    private function fakeImage(string $name = 'img.jpg'): UploadedFile
    {
        return UploadedFile::fake()->image($name, 400, 400);
    }

    // ═══════════════════════════════════════════════════════════════
    //  METHOD: index()
    //  Cyclomatic Complexity: V(G) = 3
    //  Jalur-1: role !== 'siswa'              → abort 403
    //  Jalur-2: role='siswa', !pendaftaran    → redirect pendaftaran.index
    //  Jalur-3: role='siswa', ada pendaftaran → render halaman upload
    // ═══════════════════════════════════════════════════════════════

    /**
     * TC-D-01 | Jalur-1
     * Admin yang mengakses halaman dokumen harus ditolak dengan HTTP 403.
     */
    public function test_index_non_siswa_ditolak_403(): void
    {
        $admin = $this->makeAdmin();

        $response = $this->actingAs($admin)->get(route('dokumen.index'));

        $response->assertStatus(403);
    }

    /**
     * TC-D-02 | Jalur-2
     * Siswa yang belum melengkapi biodata (pendaftaran null)
     * harus diarahkan ke halaman pendaftaran dengan pesan status.
     */
    public function test_index_siswa_tanpa_biodata_diarahkan_ke_pendaftaran(): void
    {
        $user = $this->makeSiswa();

        $response = $this->actingAs($user)->get(route('dokumen.index'));

        $response->assertRedirect(route('pendaftaran.index'));
        $response->assertSessionHas(
            'status',
            'Silakan lengkapi biodata Anda terlebih dahulu sebelum mengunggah dokumen.'
        );
    }

    /**
     * TC-D-03 | Jalur-3
     * Siswa dengan biodata lengkap dapat mengakses halaman upload
     * dan menerima respons 200 dengan komponen Inertia yang benar.
     */
    public function test_index_siswa_dengan_biodata_menampilkan_halaman_upload(): void
    {
        $user = $this->makeSiswa();
        $this->makePendaftaran($user);

        $response = $this->actingAs($user)->get(route('dokumen.index'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn ($page) => $page->component('Siswa/UploadDokumen')
        );
    }

    /**
     * TC-D-04 | Tamu → redirect ke login
     */
    public function test_index_tamu_diarahkan_ke_login(): void
    {
        $response = $this->get(route('dokumen.index'));

        $response->assertRedirect(route('login'));
    }

    // ═══════════════════════════════════════════════════════════════
    //  METHOD: store()
    //  Cyclomatic Complexity: V(G) = 13 (12 branch + 1)
    //  Jalur utama:
    //  J-1: role !== 'siswa'                          → abort 403
    //  J-2: role='siswa', !pendaftaran                → redirect + error
    //  J-3: role='siswa', pendaftaran, validasi gagal → session errors
    //  J-4: role='siswa', pendaftaran, !dokumen       → buat dokumen baru
    //  J-5: role='siswa', pendaftaran, dokumen ada    → update dokumen lama
    //  J-6: upload akta (path lama kosong / path lama ada)
    //  J-7: upload kartu_keluarga (path lama kosong / path lama ada)
    //  J-8: upload identitas_ortu (path lama kosong / path lama ada)
    //  J-9: upload ijazah (path lama kosong / path lama ada)
    //  J-10: upload pkh_kks (path lama kosong / path lama ada)
    //  J-11: $uploaded=false → redirect error 'Tidak ada file yang diunggah.'
    //  J-12: semua wajib lengkap → status='menunggu_verifikasi'
    //  J-13: belum semua wajib lengkap → status tetap 'belum_lengkap'
    // ═══════════════════════════════════════════════════════════════

    /**
     * TC-D-05 | Jalur-1
     * Admin mencoba POST ke /dokumen → HTTP 403.
     */
    public function test_store_non_siswa_ditolak_403(): void
    {
        $admin = $this->makeAdmin();

        $response = $this->actingAs($admin)->post(route('dokumen.store'), []);

        $response->assertStatus(403);
    }

    /**
     * TC-D-06 | Jalur-2
     * Siswa tanpa biodata mencoba upload dokumen
     * → diarahkan ke pendaftaran.index dengan pesan error.
     */
    public function test_store_siswa_tanpa_biodata_diarahkan_ke_pendaftaran(): void
    {
        $user = $this->makeSiswa();

        $response = $this->actingAs($user)->post(route('dokumen.store'), []);

        $response->assertRedirect(route('pendaftaran.index'));
        $response->assertSessionHas('error', 'Silakan lengkapi biodata terlebih dahulu.');
    }

    /**
     * TC-D-07 | Jalur-3 – validasi file terlalu besar (> 2048 KB)
     */
    public function test_store_validasi_gagal_file_terlalu_besar(): void
    {
        Storage::fake('public');
        $user = $this->makeSiswa();
        $this->makePendaftaran($user);

        $bigFile = UploadedFile::fake()->create('besar.pdf', 3000, 'application/pdf'); // 3 MB

        $response = $this->actingAs($user)->post(route('dokumen.store'), [
            'akta_kelahiran' => $bigFile,
        ]);

        $response->assertSessionHasErrors('akta_kelahiran');
    }

    /**
     * TC-D-08 | Jalur-3 – validasi tipe file tidak valid (misal: .txt)
     */
    public function test_store_validasi_gagal_tipe_file_tidak_valid(): void
    {
        Storage::fake('public');
        $user = $this->makeSiswa();
        $this->makePendaftaran($user);

        $txtFile = UploadedFile::fake()->create('data.txt', 50, 'text/plain');

        $response = $this->actingAs($user)->post(route('dokumen.store'), [
            'kartu_keluarga' => $txtFile,
        ]);

        $response->assertSessionHasErrors('kartu_keluarga');
    }

    /**
     * TC-D-09 | Jalur-11
     * Tidak ada file yang dikirim dalam request
     * → redirect dengan error 'Tidak ada file yang diunggah.'
     */
    public function test_store_tanpa_file_apapun_mengembalikan_error(): void
    {
        $user = $this->makeSiswa();
        $this->makePendaftaran($user);

        $response = $this->actingAs($user)->post(route('dokumen.store'), []);

        $response->assertRedirect(route('dokumen.index'));
        $response->assertSessionHas('error', 'Tidak ada file yang diunggah.');
    }

    /**
     * TC-D-10 | Jalur-4 – Dokumen BARU, upload 1 file (akta_kelahiran)
     * Record dokumen belum ada → harus membuat record baru.
     * Upload parsial (hanya akta) → status tetap 'belum_lengkap'.
     */
    public function test_store_membuat_dokumen_baru_upload_parsial(): void
    {
        Storage::fake('public');
        $user        = $this->makeSiswa();
        $pendaftaran = $this->makePendaftaran($user);

        $response = $this->actingAs($user)->post(route('dokumen.store'), [
            'akta_kelahiran' => $this->fakeImage('akta.jpg'),
        ]);

        $response->assertRedirect(route('dokumen.index'));
        $response->assertSessionHas('status', 'Dokumen berhasil diunggah!');

        $pendaftaran->refresh();
        $this->assertNotNull($pendaftaran->dokumen);
        $this->assertNotEmpty($pendaftaran->dokumen->akta_kelahiran_path);
        $this->assertEquals('belum_lengkap', $pendaftaran->status);

        Storage::disk('public')->assertExists($pendaftaran->dokumen->akta_kelahiran_path);
    }

    /**
     * TC-D-11 | Jalur-5 + J-6 – UPDATE dokumen yang sudah ada, dengan path lama ada
     * Upload akta baru ketika path lama sudah ada → file lama harus dihapus.
     */
    public function test_store_mengganti_file_lama_dengan_file_baru(): void
    {
        Storage::fake('public');
        $user        = $this->makeSiswa();
        $pendaftaran = $this->makePendaftaran($user);

        // Buat file lama di storage
        $oldPath = 'dokumen/akta_lama.jpg';
        Storage::disk('public')->put($oldPath, 'dummy content');

        // Buat record dokumen lama
        Dokumen::create([
            'pendaftaran_id'     => $pendaftaran->id,
            'akta_kelahiran_path' => $oldPath,
            'kartu_keluarga_path' => '',
            'identitas_ortu_path' => '',
            'ijazah_path'         => '',
            'pkh_kks_path'        => '',
        ]);

        Storage::disk('public')->assertExists($oldPath);

        // Upload akta baru
        $response = $this->actingAs($user)->post(route('dokumen.store'), [
            'akta_kelahiran' => $this->fakeImage('akta_baru.jpg'),
        ]);

        $response->assertRedirect(route('dokumen.index'));

        // File lama harus sudah dihapus
        Storage::disk('public')->assertMissing($oldPath);

        // File baru harus tersimpan
        $pendaftaran->refresh();
        $this->assertNotEmpty($pendaftaran->dokumen->akta_kelahiran_path);
        $this->assertNotEquals($oldPath, $pendaftaran->dokumen->akta_kelahiran_path);
        Storage::disk('public')->assertExists($pendaftaran->dokumen->akta_kelahiran_path);
    }

    /**
     * TC-D-12 | Jalur-12 – Semua dokumen WAJIB lengkap
     * Setelah upload 4 dokumen wajib → status harus berubah menjadi 'menunggu_verifikasi'.
     */
    public function test_store_semua_wajib_lengkap_mengubah_status_menunggu_verifikasi(): void
    {
        Storage::fake('public');
        $user        = $this->makeSiswa();
        $pendaftaran = $this->makePendaftaran($user);

        $response = $this->actingAs($user)->post(route('dokumen.store'), [
            'akta_kelahiran' => $this->fakeImage('akta.jpg'),
            'kartu_keluarga' => $this->fakePdf('kk.pdf'),
            'identitas_ortu' => $this->fakeImage('ktp.png'),
            'ijazah'         => $this->fakePdf('ijazah.pdf'),
        ]);

        $response->assertRedirect(route('dokumen.index'));
        $response->assertSessionHas('status', 'Dokumen berhasil diunggah!');

        $pendaftaran->refresh();
        $this->assertEquals('menunggu_verifikasi', $pendaftaran->status);
    }

    /**
     * TC-D-13 | Jalur-13 – Dokumen wajib BELUM semua lengkap
     * Upload hanya 3 dari 4 dokumen wajib → status tetap 'belum_lengkap'.
     */
    public function test_store_dokumen_wajib_belum_lengkap_status_tetap_belum_lengkap(): void
    {
        Storage::fake('public');
        $user        = $this->makeSiswa();
        $pendaftaran = $this->makePendaftaran($user);

        // Hanya 3 dokumen wajib (tanpa ijazah)
        $response = $this->actingAs($user)->post(route('dokumen.store'), [
            'akta_kelahiran' => $this->fakeImage('akta.jpg'),
            'kartu_keluarga' => $this->fakePdf('kk.pdf'),
            'identitas_ortu' => $this->fakeImage('ktp.png'),
        ]);

        $response->assertRedirect(route('dokumen.index'));

        $pendaftaran->refresh();
        $this->assertEquals('belum_lengkap', $pendaftaran->status);
    }

    /**
     * TC-D-14 | Jalur – Upload file pkh_kks (dokumen opsional)
     * pkh_kks adalah opsional; upload berhasil dan tidak mengubah status
     * selama 4 dokumen wajib belum terpenuhi.
     */
    public function test_store_upload_pkh_kks_opsional_berhasil(): void
    {
        Storage::fake('public');
        $user        = $this->makeSiswa();
        $pendaftaran = $this->makePendaftaran($user);

        $response = $this->actingAs($user)->post(route('dokumen.store'), [
            'pkh_kks' => $this->fakePdf('pkh.pdf'),
        ]);

        $response->assertRedirect(route('dokumen.index'));
        $response->assertSessionHas('status', 'Dokumen berhasil diunggah!');

        $pendaftaran->refresh();
        $this->assertNotEmpty($pendaftaran->dokumen->pkh_kks_path);
        $this->assertEquals('belum_lengkap', $pendaftaran->status); // belum semua wajib
    }

    /**
     * TC-D-15 | Semua 5 dokumen sekaligus (4 wajib + 1 opsional)
     * Status → 'menunggu_verifikasi', semua file tersimpan.
     */
    public function test_store_semua_dokumen_termasuk_opsional_berhasil(): void
    {
        Storage::fake('public');
        $user        = $this->makeSiswa();
        $pendaftaran = $this->makePendaftaran($user);

        $response = $this->actingAs($user)->post(route('dokumen.store'), [
            'akta_kelahiran' => $this->fakeImage('akta.jpg'),
            'kartu_keluarga' => $this->fakePdf('kk.pdf'),
            'identitas_ortu' => $this->fakeImage('ktp.png'),
            'ijazah'         => $this->fakePdf('ijazah.pdf'),
            'pkh_kks'        => $this->fakePdf('pkh.pdf'),
        ]);

        $response->assertRedirect(route('dokumen.index'));

        $pendaftaran->refresh();
        $this->assertEquals('menunggu_verifikasi', $pendaftaran->status);

        $dokumen = $pendaftaran->dokumen;
        $this->assertNotEmpty($dokumen->akta_kelahiran_path);
        $this->assertNotEmpty($dokumen->kartu_keluarga_path);
        $this->assertNotEmpty($dokumen->identitas_ortu_path);
        $this->assertNotEmpty($dokumen->ijazah_path);
        $this->assertNotEmpty($dokumen->pkh_kks_path);
    }

    /**
     * TC-D-16 | Jalur-5 + path lama kosong string
     * Jika path lama adalah string kosong (''), Storage::delete tidak dipanggil.
     * Upload kartu_keluarga baru pada dokumen yang akta sudah ada.
     */
    public function test_store_path_lama_kosong_tidak_hapus_storage(): void
    {
        Storage::fake('public');
        $user        = $this->makeSiswa();
        $pendaftaran = $this->makePendaftaran($user);

        // Buat dokumen dengan path lama yang sudah ada untuk akta
        $existingAktaPath = 'dokumen/akta_ada.jpg';
        Storage::disk('public')->put($existingAktaPath, 'content');

        Dokumen::create([
            'pendaftaran_id'     => $pendaftaran->id,
            'akta_kelahiran_path' => $existingAktaPath,
            'kartu_keluarga_path' => '', // kosong
            'identitas_ortu_path' => '',
            'ijazah_path'         => '',
            'pkh_kks_path'        => '',
        ]);

        // Upload kartu_keluarga (path lama = '')
        $response = $this->actingAs($user)->post(route('dokumen.store'), [
            'kartu_keluarga' => $this->fakePdf('kk_baru.pdf'),
        ]);

        $response->assertRedirect(route('dokumen.index'));

        // File akta lama harus MASIH ADA (tidak ikut terhapus)
        Storage::disk('public')->assertExists($existingAktaPath);

        // File KK baru harus tersimpan
        $pendaftaran->refresh();
        $this->assertNotEmpty($pendaftaran->dokumen->kartu_keluarga_path);
    }

    /**
     * TC-D-17 | Tamu mencoba store → redirect ke login
     */
    public function test_store_tamu_diarahkan_ke_login(): void
    {
        $response = $this->post(route('dokumen.store'), []);

        $response->assertRedirect(route('login'));
    }
}
