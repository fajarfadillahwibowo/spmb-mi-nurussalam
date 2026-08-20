-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 20 Agu 2026 pada 04.48
-- Versi server: 8.0.30
-- Versi PHP: 8.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Basis data: `spmb_mi_nurussalam`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `dokumens`
--

CREATE TABLE `dokumens` (
  `id` bigint UNSIGNED NOT NULL,
  `pendaftaran_id` bigint UNSIGNED NOT NULL,
  `akta_kelahiran_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kartu_keluarga_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `identitas_ortu_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ijazah_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pkh_kks_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `dokumens`
--

INSERT INTO `dokumens` (`id`, `pendaftaran_id`, `akta_kelahiran_path`, `kartu_keluarga_path`, `identitas_ortu_path`, `ijazah_path`, `pkh_kks_path`, `created_at`, `updated_at`) VALUES
(1, 1, 'dokumen/1BlD2X4aNXCQEegHYqVRHszr1UemVddwvJqkqbPi.jpg', 'dokumen/wTt5Nwgms25aBskf3K7k6hCoGqm7BERXY4ZdYKxX.png', 'dokumen/UbXVkdROzJGm9rFd1Q43b2NOnE9Tszc33Yuu4jvY.png', 'dokumen/X28SciF7NmQRj81XtwVdtrCvwHejdBiSj7V1Cwrb.png', 'dokumen/XizszgnGJoAp48Nk7tRBNCC4GUnp5lMgxkuBvvf7.jpg', '2026-06-22 20:40:24', '2026-06-30 02:05:29'),
(2, 2, 'dokumen/N7I7mZHLTskMXStjQppEpEUxXk3LIvxPfhw1nekv.jpg', 'dokumen/HgYqpQL0yDuwP2Fwhi33k8ZbTQpcHk1j2dyT4i4s.jpg', 'dokumen/yw2BdYsl9cFWCjku5DoJ7VI8TM72BtZoApKsPzva.jpg', 'dokumen/x32h9autS1Yk8PhfUQDFemSKsv8L6SFazDEFMog2.jpg', '', '2026-07-05 05:38:48', '2026-07-05 05:38:48'),
(3, 3, 'dokumen/6q8rUDHeRQSqCGHasoy2ujD6vOtWK0BpxKjxLPIZ.png', 'dokumen/t7Al1eR2gCuaoEQZ7SnYnQwlRwlrcx65IDacrsJj.png', 'dokumen/nfPAkqFljWOrqNE5Cn0ikqPccdVvcw7zWs7eSzDk.jpg', 'dokumen/bZSnI2QYO7i5xI3yZBRLpY8UoijFWXbiSNqJGbLE.png', '', '2026-07-13 08:32:42', '2026-07-13 08:32:42');

-- --------------------------------------------------------

--
-- Struktur dari tabel `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_06_21_000001_create_pendaftarans_table', 1),
(5, '2026_06_21_000002_create_dokumens_table', 1),
(6, '2026_06_21_000003_create_seleksis_table', 1),
(7, '2026_06_24_000001_add_fields_to_pendaftaran_and_dokumen', 2),
(8, '2026_06_25_070301_add_asal_sekolah_to_pendaftarans_table', 3),
(9, '2026_06_25_082424_add_payment_proof_to_pendaftarans_table', 4),
(10, '2026_07_06_000001_create_pengumumans_table', 5),
(11, '2026_07_06_000002_create_pembayarans_table', 5),
(12, '2026_07_11_132646_add_profile_photo_path_to_users_table', 6),
(13, '2026_08_07_000001_create_settings_table', 7),
(14, '2026_08_07_000002_create_periode_spmb_table', 7),
(15, '2026_08_07_155530_create_notifikasis_table', 8),
(16, '2026_08_14_063036_add_pas_foto_path_to_pendaftarans_table', 9);

-- --------------------------------------------------------

--
-- Struktur dari tabel `notifikasis`
--

CREATE TABLE `notifikasis` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `for_role` enum('siswa','admin','all') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'siswa',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `link_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`email`, `token`, `created_at`) VALUES
('fajarwb53@gmail.com', '$2y$12$IN/QkF0PoloEA4ewJkO.Fu09e4oXQiNXC9aepFAzU8uZ5tKBsyvku', '2026-08-12 19:39:52');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pembayarans`
--

CREATE TABLE `pembayarans` (
  `id` bigint UNSIGNED NOT NULL,
  `pendaftaran_id` bigint UNSIGNED NOT NULL,
  `payment_status` enum('belum_bayar','menunggu_konfirmasi','cicilan','lunas') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'belum_bayar',
  `amount_paid` decimal(12,2) NOT NULL DEFAULT '0.00',
  `bukti_pembayaran_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `catatan_pembayaran` text COLLATE utf8mb4_unicode_ci,
  `verified_by` bigint UNSIGNED DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `pendaftarans`
--

CREATE TABLE `pendaftarans` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `nama_lengkap` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nik` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pas_foto_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `asal_sekolah` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tempat_lahir` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `jenis_kelamin` enum('L','P') COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_orang_tua` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_hp_wali` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('belum_lengkap','menunggu_verifikasi','proses_seleksi','lulus','tidak_lulus') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'belum_lengkap',
  `payment_status` enum('belum_bayar','menunggu_konfirmasi','cicilan','lunas') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'belum_bayar',
  `amount_paid` decimal(12,2) NOT NULL DEFAULT '0.00',
  `bukti_pembayaran_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `catatan_pembayaran` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `pendaftarans`
--

INSERT INTO `pendaftarans` (`id`, `user_id`, `nama_lengkap`, `nik`, `pas_foto_path`, `asal_sekolah`, `tempat_lahir`, `tanggal_lahir`, `jenis_kelamin`, `alamat`, `nama_orang_tua`, `no_hp_wali`, `status`, `payment_status`, `amount_paid`, `bukti_pembayaran_path`, `catatan_pembayaran`, `created_at`, `updated_at`) VALUES
(1, 2, 'Fajar Fadillah Wibowo', '1608032709020001', 'pas_foto/SuHj38wUfV08Z8kG88Hk517rRQsXGtBfpSft0uwn.jpg', 'TK Al-Amin', 'Sidogede', '2022-09-27', 'L', 'Sidogede', 'Farhan', '085607746031', 'lulus', 'cicilan', 680000.00, NULL, 'Pembayaran Rp 150.000 disetujui. bulim lunas', '2026-06-22 20:35:09', '2026-08-13 23:57:26'),
(2, 6, 'Fadliati Ramadani', '1608034509000001', NULL, 'TK Al-furqon', 'Sidomakmur', '2020-03-13', 'P', 'Sidogede, kec. Belitang, Kab. OKU Timur, Sumsel', 'Muhammad Ali', '087767563245', 'lulus', 'cicilan', 230230.00, NULL, 'Pembayaran Rp 230.000 disetujui. anda salah memasukkan nominal uang cicilan, tidak apa-apa admin telah memperbaiki', '2026-07-05 05:37:49', '2026-07-05 05:44:06'),
(3, 9, 'Fadil Zakaria', '1608032709020001', NULL, 'TK Al-Istiqomah', 'Sidoanu', '2020-04-23', 'L', 'Sidoanu, Sidogede', 'Wahirun', '+62 878-9487-8613', 'tidak_lulus', 'menunggu_konfirmasi', 130000.00, 'pembayaran/ORptjPqtU1PKlyr5rtCJJDH8YwNIHzj56fKk4IZ1.png', NULL, '2026-07-13 08:31:51', '2026-07-22 04:43:44');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengumumans`
--

CREATE TABLE `pengumumans` (
  `id` bigint UNSIGNED NOT NULL,
  `pendaftaran_id` bigint UNSIGNED NOT NULL,
  `admin_id` bigint UNSIGNED DEFAULT NULL,
  `status_pengumuman` enum('lulus','tidak_lulus','menunggu') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'menunggu',
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `tanggal_pengumuman` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `periode_spmb`
--

CREATE TABLE `periode_spmb` (
  `id` bigint UNSIGNED NOT NULL,
  `tahun` smallint NOT NULL COMMENT 'Tahun periode, contoh: 2026',
  `is_aktif` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Hanya satu periode yang aktif',
  `bulan_berjalan` tinyint DEFAULT NULL COMMENT 'Bulan berjalan 1-12',
  `tahun_berjalan` smallint DEFAULT NULL COMMENT 'Tahun berjalan',
  `gel1_mulai` date DEFAULT NULL COMMENT 'Tanggal mulai Gelombang I',
  `gel1_selesai` date DEFAULT NULL COMMENT 'Tanggal selesai Gelombang I',
  `gel2_mulai` date DEFAULT NULL COMMENT 'Tanggal mulai Gelombang II',
  `gel2_selesai` date DEFAULT NULL COMMENT 'Tanggal selesai Gelombang II',
  `gel3_mulai` date DEFAULT NULL COMMENT 'Tanggal mulai Gelombang III',
  `gel3_selesai` date DEFAULT NULL COMMENT 'Tanggal selesai Gelombang III',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `periode_spmb`
--

INSERT INTO `periode_spmb` (`id`, `tahun`, `is_aktif`, `bulan_berjalan`, `tahun_berjalan`, `gel1_mulai`, `gel1_selesai`, `gel2_mulai`, `gel2_selesai`, `gel3_mulai`, `gel3_selesai`, `created_at`, `updated_at`) VALUES
(1, 2026, 1, 8, 2026, '2026-05-01', '2026-06-30', '2026-06-01', '2026-07-30', '2026-07-01', '2026-08-30', '2026-08-07 04:26:27', '2026-08-07 07:05:09'),
(2, 2027, 0, 7, 2027, '2027-05-01', '2027-06-01', '2027-06-02', '2027-07-02', '2027-07-03', '2027-08-03', '2026-08-07 05:16:43', '2026-08-07 06:26:12'),
(3, 2028, 0, 8, 2028, NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-07 06:32:19', '2026-08-07 06:32:33'),
(4, 2029, 0, 8, 2029, NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-07 06:32:33', '2026-08-07 06:32:50'),
(5, 2030, 0, 8, 2030, '2030-02-22', '2030-03-23', '2030-04-23', '2030-05-24', '2030-06-25', '2030-07-30', '2026-08-07 06:32:50', '2026-08-07 07:05:09');

-- --------------------------------------------------------

--
-- Struktur dari tabel `seleksis`
--

CREATE TABLE `seleksis` (
  `id` bigint UNSIGNED NOT NULL,
  `pendaftaran_id` bigint UNSIGNED NOT NULL,
  `admin_id` bigint UNSIGNED NOT NULL,
  `status_seleksi` enum('proses','lulus','tidak_lulus') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'proses',
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `seleksis`
--

INSERT INTO `seleksis` (`id`, `pendaftaran_id`, `admin_id`, `status_seleksi`, `catatan`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'lulus', 'Baik', '2026-06-22 20:41:28', '2026-06-22 20:41:28'),
(2, 2, 1, 'lulus', 'Semangat', '2026-07-05 05:42:54', '2026-07-05 05:42:54'),
(3, 3, 1, 'tidak_lulus', '1. Batas usia melampaui peraturan\n2. Dokumen tiddak lengkap/palsu', '2026-07-13 08:34:42', '2026-08-14 00:45:33');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('7VadxWiZWmtLMLQK7jKr5EXf67J2BRt30ZBCuhes', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJIU0pGVGJYRG1zZGZQbVpNMVM2SldKWFA1T05wZlFEZnVaSVpWem9aIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787130445),
('Oof8s6nCIiCWtOsEEaSCSOwNnlA8gCO8PLFoXuS2', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiI3dEpZeTJOR3hlVGZFOGtreGJxU1hYeHFrQkpZNXZBTGczd1A1WDZaIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1787131100),
('rbFdqlrv0ytDF5nKqnBBTnqGAqzsnjzci1vwwjhu', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJ0M2FBbWhsd0pxWWZUc041OVhuUkNMNmx6OXhqRFJRSFR2bkJTMGNJIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92aXNpLW1pc2kiLCJyb3V0ZSI6InZpc2ktbWlzaSJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787198746),
('rd8qUhMDYsFFgzVKcZ61E5jSnH9nSGOq0h0294Sz', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJRc04wbGhGUW9jbFlrQWtzdUFWQkI0N1U2YjAzZEludk1YQWhVZmswIiwidXJsIjpbXSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119LCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvMTI3LjAuMC4xOjgwMDBcL3Blbmd1bXVtYW4tYWRtaW4iLCJyb3V0ZSI6InBlbmd1bXVtYW4tYWRtaW4uaW5kZXgifSwibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiOjF9', 1787131590);

-- --------------------------------------------------------

--
-- Struktur dari tabel `settings`
--

CREATE TABLE `settings` (
  `id` bigint UNSIGNED NOT NULL,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Identifier unik pengaturan',
  `value` text COLLATE utf8mb4_unicode_ci COMMENT 'Nilai pengaturan (JSON atau string)',
  `label` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Label tampilan untuk UI admin',
  `group` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general' COMMENT 'Kelompok pengaturan',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `settings`
--

INSERT INTO `settings` (`id`, `key`, `value`, `label`, `group`, `created_at`, `updated_at`) VALUES
(1, 'spmb_status', 'buka', 'Status Pendaftaran SPMB', 'spmb', '2026-08-07 04:26:27', '2026-08-07 21:26:45'),
(2, 'teks_pengumuman', 'Selamat datang di Portal SPMB MI Nurussalam Sidogede. Silakan lengkapi data pendaftaran Anda sebelum batas waktu yang ditentukan.', 'Teks Pengumuman Dashboard Siswa', 'sistem', '2026-08-07 04:26:27', '2026-08-07 07:02:06'),
(3, 'kontak_wa', '6281234567890', 'Nomor WhatsApp Admin', 'kontak', '2026-08-07 04:26:27', '2026-08-07 04:26:27'),
(4, 'email_sekolah', 'minurussalam.sidogede@gmail.com', 'Email Sekolah', 'kontak', '2026-08-07 04:26:27', '2026-08-07 04:26:27'),
(5, 'persyaratan_dokumen', '[{\"id\":1,\"nama\":\"Fotokopi Kartu Keluarga (KK)\",\"aktif\":true},{\"id\":3,\"nama\":\"Fotokopi KTP Orang Tua \\/ Wali\",\"aktif\":true},{\"id\":4,\"nama\":\"Pas Foto Terbaru (3x4 dan 4x6)\",\"aktif\":true},{\"id\":5,\"nama\":\"Fotokopi Ijazah \\/ SKL TK\\/RA\",\"aktif\":true},{\"id\":6,\"nama\":\"Surat Rekomendasi Kepala TK\\/RA\",\"aktif\":false},{\"id\":7,\"nama\":\"Sertifikat Prestasi (Jalur Prestasi)\",\"aktif\":false},{\"id\":8,\"nama\":\"Surat Keterangan Tidak Mampu (SKTM)\",\"aktif\":false},{\"id\":9,\"nama\":\"Fotokopi Akte Kelahiran\",\"aktif\":true}]', 'Daftar Persyaratan Dokumen', 'sistem', '2026-08-07 04:26:27', '2026-08-07 07:02:06');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('siswa','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'siswa',
  `verification_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verification_code_expires_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `profile_photo_path` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `email_verified_at`, `password`, `role`, `verification_code`, `verification_code_expires_at`, `remember_token`, `created_at`, `updated_at`, `profile_photo_path`) VALUES
(1, 'admin', 'admin@minurussalam.sch.id', '2026-06-21 21:16:09', '$2y$12$DYoiX2A34emRAg94miQpFOp4ptF90B28yzilhRxmd13tNjh3u/7mS', 'admin', NULL, NULL, 'gvV526zMX5u4mJlAGHoPgTPG37xL2gDAYosxvDHmuoGzVsFYyCXXPxMAuKXa', '2026-06-21 21:16:09', '2026-06-21 21:16:09', NULL),
(2, 'siswa', 'siswa@gmail.com', '2026-06-21 21:16:10', '$2y$12$syDhtIhD/X8CrTv8M26.bOANSfBV5N9lS8KMKR5u34Takv9/9PYyC', 'siswa', NULL, NULL, NULL, '2026-06-21 21:16:10', '2026-08-13 23:57:26', 'pas_foto/SuHj38wUfV08Z8kG88Hk517rRQsXGtBfpSft0uwn.jpg'),
(6, 'Widia_Saputri', 'fajarfadil0707@gmail.com', '2026-07-02 22:09:40', '$2y$12$3omPqmtjtVYoSxpQGhJxGuDEi0y07YysjXEAG2i29w7pxvlmnvaMi', 'siswa', NULL, NULL, 'iPFf4QsNShvtEZwZIvYX4AxvKJd0uXjKk6AXIjxzAwOJVqqbi05OpE0KHFGo', '2026-07-02 22:08:34', '2026-07-11 06:58:10', 'profile-photos/bi12BrOgQM2VFxqmYtHZsbV11bSZGAHceKaTCbtG.jpg'),
(9, 'Fadil Zakaria', 'fajarwb53@gmail.com', '2026-07-07 23:44:50', '$2y$12$2xkMa4C99hcjs8CIKKq2pu87vbl29V25S88iNoJb/ZQhXG3SkMYQa', 'siswa', NULL, NULL, 'FiTv3uaa8dbnouO3OImudAttuyOUozg3TlUqLZAAex2JksJY2ZOOer2AOuAD', '2026-07-07 23:43:37', '2026-07-13 21:28:29', 'profile-photos/DAO5OGrWKfJHTeC8h2cKMKqWUK8BeMH0eOY0Rlyi.jpg'),
(15, 'Imam Subani', 'wadi07578@gmail.com', '2026-07-23 08:27:21', '$2y$12$ImBjjOgKIM4x9q2axH8o..47Ft7v2lCTYe1EypW5R/IbVPIVqUVh6', 'siswa', NULL, NULL, NULL, '2026-07-23 08:25:33', '2026-07-23 08:27:21', NULL);

--
-- Indeks untuk tabel yang dibuang
--

--
-- Indeks untuk tabel `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indeks untuk tabel `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indeks untuk tabel `dokumens`
--
ALTER TABLE `dokumens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dokumens_pendaftaran_id_foreign` (`pendaftaran_id`);

--
-- Indeks untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  ADD KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`);

--
-- Indeks untuk tabel `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indeks untuk tabel `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `notifikasis`
--
ALTER TABLE `notifikasis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifikasis_user_id_is_read_index` (`user_id`,`is_read`),
  ADD KEY `notifikasis_for_role_is_read_index` (`for_role`,`is_read`);

--
-- Indeks untuk tabel `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indeks untuk tabel `pembayarans`
--
ALTER TABLE `pembayarans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pembayarans_pendaftaran_id_foreign` (`pendaftaran_id`),
  ADD KEY `pembayarans_verified_by_foreign` (`verified_by`);

--
-- Indeks untuk tabel `pendaftarans`
--
ALTER TABLE `pendaftarans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pendaftarans_user_id_foreign` (`user_id`);

--
-- Indeks untuk tabel `pengumumans`
--
ALTER TABLE `pengumumans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pengumumans_pendaftaran_id_foreign` (`pendaftaran_id`),
  ADD KEY `pengumumans_admin_id_foreign` (`admin_id`);

--
-- Indeks untuk tabel `periode_spmb`
--
ALTER TABLE `periode_spmb`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `periode_spmb_tahun_unique` (`tahun`);

--
-- Indeks untuk tabel `seleksis`
--
ALTER TABLE `seleksis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `seleksis_pendaftaran_id_foreign` (`pendaftaran_id`),
  ADD KEY `seleksis_admin_id_foreign` (`admin_id`);

--
-- Indeks untuk tabel `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indeks untuk tabel `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_key_unique` (`key`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username_unique` (`username`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `dokumens`
--
ALTER TABLE `dokumens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT untuk tabel `notifikasis`
--
ALTER TABLE `notifikasis`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `pembayarans`
--
ALTER TABLE `pembayarans`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `pendaftarans`
--
ALTER TABLE `pendaftarans`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `pengumumans`
--
ALTER TABLE `pengumumans`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `periode_spmb`
--
ALTER TABLE `periode_spmb`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `seleksis`
--
ALTER TABLE `seleksis`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `dokumens`
--
ALTER TABLE `dokumens`
  ADD CONSTRAINT `dokumens_pendaftaran_id_foreign` FOREIGN KEY (`pendaftaran_id`) REFERENCES `pendaftarans` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `notifikasis`
--
ALTER TABLE `notifikasis`
  ADD CONSTRAINT `notifikasis_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pembayarans`
--
ALTER TABLE `pembayarans`
  ADD CONSTRAINT `pembayarans_pendaftaran_id_foreign` FOREIGN KEY (`pendaftaran_id`) REFERENCES `pendaftarans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pembayarans_verified_by_foreign` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `pendaftarans`
--
ALTER TABLE `pendaftarans`
  ADD CONSTRAINT `pendaftarans_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pengumumans`
--
ALTER TABLE `pengumumans`
  ADD CONSTRAINT `pengumumans_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pengumumans_pendaftaran_id_foreign` FOREIGN KEY (`pendaftaran_id`) REFERENCES `pendaftarans` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `seleksis`
--
ALTER TABLE `seleksis`
  ADD CONSTRAINT `seleksis_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `seleksis_pendaftaran_id_foreign` FOREIGN KEY (`pendaftaran_id`) REFERENCES `pendaftarans` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
