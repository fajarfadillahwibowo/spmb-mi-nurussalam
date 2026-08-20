<?php

/**
 * ============================================================
 *  WHITE BOX TEST – PendaftaranController
 *  Pengujian: Statement, Branch, dan Condition Coverage
 *  Framework: PHPUnit 12 + Laravel HTTP Test Helpers
 * ============================================================
 */

namespace Tests\Feature\WhiteBox;

use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PendaftaranControllerTest extends TestCase
{
    use RefreshDatabase;

    // ─────────────────────────────────────────────────────────
    //  HELPERS
    // ─────────────────────────────────────────────────────────

    /** Data biodata valid yang memenuhi seluruh aturan validasi. */
    private function validBiodata(): array
    {
        return [
            'nik'            => '3507012345678901',
            'asal_sekolah'   => 'TK Nurul Huda',
            'nama_lengkap'   => 'Ahmad Fauzi',
            'tempat_lahir'   => 'Cilacap',
            'tanggal_lahir'  => '2019-06-01',
            'jenis_kelamin'  => 'L',
            'alamat'         => 'Jl. Mawar No.1 Sidogede',
            'nama_orang_tua' => 'Budi Santoso',
            'no_hp_wali'     => '085600001111',
        ];
    }

    /** Buat user siswa yang sudah terverifikasi emailnya. */
    private function makeSiswa(): User
    {
        return User::factory()->create([
            'role'              => 'siswa',
            'email_verified_at' => now(),
        ]);
    }

    /** Buat user admin yang sudah terverifikasi emailnya. */
    private function makeAdmin(): User
    {
        return User::factory()->create([
            'role'              => 'admin',
            'email_verified_at' => now(),
        ]);
    }

    // ═══════════════════════════════════════════════════════════════
    //  METHOD: index()
    //  Cyclomatic Complexity: V(G) = 2
    //  Jalur-1: role === 'siswa', pendaftaran = null   → render form kosong
    //  Jalur-2: role !== 'siswa'                       → abort 403
    //  (Jalur-3: role === 'siswa', pendaftaran ≠ null  → render form terisi)
    // ═══════════════════════════════════════════════════════════════

    /**
     * TC-P-01 | Jalur-1a
     * Siswa yang belum memiliki data pendaftaran dapat mengakses
     * halaman form biodata dan menerima respons 200 dengan komponen Inertia.
     */
    public function test_index_siswa_tanpa_pendaftaran_menampilkan_form_kosong(): void
    {
        $user = $this->makeSiswa();

        $response = $this->actingAs($user)->get(route('pendaftaran.index'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn ($page) => $page
                ->component('Siswa/Pendaftaran')
                ->has('pendaftaran')
                ->where('pendaftaran', null)
        );
    }

    /**
     * TC-P-02 | Jalur-1b
     * Siswa yang sudah memiliki data pendaftaran menerima form terisi
     * dengan data pendaftaran yang ada.
     */
    public function test_index_siswa_dengan_pendaftaran_menampilkan_data_existing(): void
    {
        $user = $this->makeSiswa();

        $pendaftaran = Pendaftaran::create([
            'user_id'        => $user->id,
            'nik'            => '3507019999999999',
            'nama_lengkap'   => 'Test User',
            'tempat_lahir'   => 'Jakarta',
            'tanggal_lahir'  => '2019-01-01',
            'jenis_kelamin'  => 'P',
            'alamat'         => 'Jl. Test',
            'nama_orang_tua' => 'Parent Test',
            'no_hp_wali'     => '08123456789',
            'status'         => 'belum_lengkap',
            'payment_status' => 'belum_bayar',
            'amount_paid'    => 0,
        ]);

        $response = $this->actingAs($user)->get(route('pendaftaran.index'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn ($page) => $page
                ->component('Siswa/Pendaftaran')
                ->where('pendaftaran.id', $pendaftaran->id)
        );
    }

    /**
     * TC-P-03 | Jalur-2
     * Pengguna non-siswa (admin) yang mencoba mengakses halaman
     * pendaftaran harus menerima HTTP 403.
     */
    public function test_index_non_siswa_ditolak_403(): void
    {
        $admin = $this->makeAdmin();

        $response = $this->actingAs($admin)->get(route('pendaftaran.index'));

        $response->assertStatus(403);
    }

    /**
     * TC-P-04 | Jalur-2 (tamu)
     * Pengguna yang belum login diarahkan ke halaman login.
     */
    public function test_index_tamu_diarahkan_ke_login(): void
    {
        $response = $this->get(route('pendaftaran.index'));

        $response->assertRedirect(route('login'));
    }

    // ═══════════════════════════════════════════════════════════════
    //  METHOD: store()
    //  Cyclomatic Complexity: V(G) = 4
    //  Jalur-1: role !== 'siswa'                             → abort 403
    //  Jalur-2: role='siswa', validasi gagal                 → redirect + errors
    //  Jalur-3: role='siswa', valid, pendaftaran=null (baru) → create record
    //  Jalur-4: role='siswa', valid, pendaftaran≠null (ada)  → update record
    // ═══════════════════════════════════════════════════════════════

    /**
     * TC-P-05 | Jalur-1
     * Admin yang mencoba menyimpan biodata harus menerima HTTP 403.
     */
    public function test_store_non_siswa_ditolak_403(): void
    {
        $admin = $this->makeAdmin();

        $response = $this->actingAs($admin)->post(route('pendaftaran.store'), $this->validBiodata());

        $response->assertStatus(403);
    }

    /**
     * TC-P-06 | Jalur-2 – field wajib kosong (nama_lengkap)
     * Validasi harus gagal dan mengembalikan error pada field 'nama_lengkap'.
     */
    public function test_store_validasi_gagal_nama_lengkap_kosong(): void
    {
        $user = $this->makeSiswa();
        $data = $this->validBiodata();
        unset($data['nama_lengkap']);

        $response = $this->actingAs($user)->post(route('pendaftaran.store'), $data);

        $response->assertSessionHasErrors('nama_lengkap');
        $this->assertDatabaseMissing('pendaftarans', ['user_id' => $user->id]);
    }

    /**
     * TC-P-07 | Jalur-2 – NIK bukan 16 digit angka
     * Validasi harus gagal karena format NIK tidak sesuai regex.
     */
    public function test_store_validasi_gagal_nik_format_salah(): void
    {
        $user = $this->makeSiswa();
        $data = $this->validBiodata();
        $data['nik'] = 'ABCD1234'; // bukan 16 digit angka

        $response = $this->actingAs($user)->post(route('pendaftaran.store'), $data);

        $response->assertSessionHasErrors('nik');
    }

    /**
     * TC-P-08 | Jalur-2 – NIK kurang dari 16 digit
     */
    public function test_store_validasi_gagal_nik_kurang_16_digit(): void
    {
        $user = $this->makeSiswa();
        $data = $this->validBiodata();
        $data['nik'] = '12345'; // hanya 5 digit

        $response = $this->actingAs($user)->post(route('pendaftaran.store'), $data);

        $response->assertSessionHasErrors('nik');
    }

    /**
     * TC-P-09 | Jalur-2 – tanggal_lahir format tidak valid
     */
    public function test_store_validasi_gagal_tanggal_lahir_format_salah(): void
    {
        $user = $this->makeSiswa();
        $data = $this->validBiodata();
        $data['tanggal_lahir'] = 'bukan-tanggal';

        $response = $this->actingAs($user)->post(route('pendaftaran.store'), $data);

        $response->assertSessionHasErrors('tanggal_lahir');
    }

    /**
     * TC-P-10 | Jalur-2 – jenis_kelamin nilai tidak valid
     */
    public function test_store_validasi_gagal_jenis_kelamin_tidak_valid(): void
    {
        $user = $this->makeSiswa();
        $data = $this->validBiodata();
        $data['jenis_kelamin'] = 'X'; // harus 'L' atau 'P'

        $response = $this->actingAs($user)->post(route('pendaftaran.store'), $data);

        $response->assertSessionHasErrors('jenis_kelamin');
    }

    /**
     * TC-P-11 | Jalur-3 – Pendaftaran BARU (record belum ada)
     * Siswa pertama kali menyimpan biodata: harus membuat record baru
     * dengan status='belum_lengkap' dan payment_status='belum_bayar'.
     */
    public function test_store_membuat_pendaftaran_baru_ketika_belum_ada(): void
    {
        $user = $this->makeSiswa();

        $response = $this->actingAs($user)->post(route('pendaftaran.store'), $this->validBiodata());

        $response->assertRedirect(route('pendaftaran.index'));
        $response->assertSessionHas('status', 'Biodata berhasil disimpan!');

        $this->assertDatabaseHas('pendaftarans', [
            'user_id'        => $user->id,
            'nik'            => '3507012345678901',
            'nama_lengkap'   => 'Ahmad Fauzi',
            'status'         => 'belum_lengkap',
            'payment_status' => 'belum_bayar',
            'amount_paid'    => 0,
        ]);
    }

    /**
     * TC-P-12 | Jalur-3 – field opsional (asal_sekolah = null)
     * Bidang asal_sekolah bersifat nullable; harus berhasil disimpan tanpa error.
     */
    public function test_store_berhasil_ketika_asal_sekolah_null(): void
    {
        $user = $this->makeSiswa();
        $data = $this->validBiodata();
        $data['asal_sekolah'] = null;

        $response = $this->actingAs($user)->post(route('pendaftaran.store'), $data);

        $response->assertRedirect(route('pendaftaran.index'));
        $this->assertDatabaseHas('pendaftarans', [
            'user_id'      => $user->id,
            'asal_sekolah' => null,
        ]);
    }

    /**
     * TC-P-13 | Jalur-4 – UPDATE pendaftaran yang sudah ada
     * Siswa yang sudah memiliki biodata dapat memperbarui datanya.
     * Status harus tetap 'belum_lengkap' (tidak direset).
     */
    public function test_store_memperbarui_pendaftaran_yang_sudah_ada(): void
    {
        $user = $this->makeSiswa();

        // Buat record awal
        Pendaftaran::create([
            'user_id'        => $user->id,
            'nik'            => '3507010000000000',
            'nama_lengkap'   => 'Nama Lama',
            'tempat_lahir'   => 'Kota Lama',
            'tanggal_lahir'  => '2018-01-01',
            'jenis_kelamin'  => 'P',
            'alamat'         => 'Alamat Lama',
            'nama_orang_tua' => 'Ortu Lama',
            'no_hp_wali'     => '08100000000',
            'status'         => 'belum_lengkap',
            'payment_status' => 'belum_bayar',
            'amount_paid'    => 0,
        ]);

        $newData = $this->validBiodata();
        $newData['nama_lengkap'] = 'Nama Baru';

        $response = $this->actingAs($user)->post(route('pendaftaran.store'), $newData);

        $response->assertRedirect(route('pendaftaran.index'));

        // Harus hanya ada 1 record untuk user ini
        $this->assertEquals(1, Pendaftaran::where('user_id', $user->id)->count());

        // Nama harus terupdate
        $this->assertDatabaseHas('pendaftarans', [
            'user_id'      => $user->id,
            'nama_lengkap' => 'Nama Baru',
        ]);
    }

    /**
     * TC-P-14 | Tamu mencoba store → redirect ke login
     */
    public function test_store_tamu_diarahkan_ke_login(): void
    {
        $response = $this->post(route('pendaftaran.store'), $this->validBiodata());

        $response->assertRedirect(route('login'));
    }
}
