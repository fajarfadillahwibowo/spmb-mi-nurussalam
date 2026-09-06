-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 23 Agu 2026 pada 05.58
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

--
-- Dumping data untuk tabel `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('mi-nurussalam-sidogede-cache-s|127.0.0.1', 'i:1;', 1787449005),
('mi-nurussalam-sidogede-cache-s|127.0.0.1:timer', 'i:1787449005;', 1787449005);

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
(1, 1, 'dokumen/Q572EnNSweR2YnvU2wN9UsR1AkT13MTRnvyK40WJ.jpg', 'dokumen/SrU2pKprQpywCmAhy1P8ZYYgenVGnitIwQTt6Vnq.jpg', 'dokumen/Bx79TLYtzrIqd6FpwOJg8B8MLMOWAxGzBIwiGj2I.jpg', 'dokumen/73ppKEQkFreDjZkLtEJ8uD10gkMypokoSa8D5aYY.png', '', '2026-08-22 07:49:30', '2026-08-22 07:49:30'),
(2, 2, 'dokumen/akta_azzahra_salsabila_qgUrWeqJrmL8E9YFQccl.jpg', 'dokumen/kk_azzahra_salsabila_qgUrWeqJrmL8E9YFQccl.jpg', 'dokumen/ktp_azzahra_salsabila_qgUrWeqJrmL8E9YFQccl.jpg', 'dokumen/ijazah_azzahra_salsabila_qgUrWeqJrmL8E9YFQccl.png', NULL, '2026-08-22 08:41:00', '2026-08-22 08:41:00'),
(3, 3, 'dokumen/akta_keysha_al_khanza_T8wMxPIK7blc7WBQsBgV.jpg', 'dokumen/kk_keysha_al_khanza_T8wMxPIK7blc7WBQsBgV.jpg', 'dokumen/ktp_keysha_al_khanza_T8wMxPIK7blc7WBQsBgV.jpg', 'dokumen/ijazah_keysha_al_khanza_T8wMxPIK7blc7WBQsBgV.png', NULL, '2026-08-22 08:41:01', '2026-08-22 08:41:01'),
(4, 4, 'dokumen/akta_nadhira_rahma_falisha_oZgghY7hRQjldrFyksb3.jpg', 'dokumen/kk_nadhira_rahma_falisha_oZgghY7hRQjldrFyksb3.jpg', 'dokumen/ktp_nadhira_rahma_falisha_oZgghY7hRQjldrFyksb3.jpg', 'dokumen/ijazah_nadhira_rahma_falisha_oZgghY7hRQjldrFyksb3.png', NULL, '2026-08-22 08:41:01', '2026-08-22 08:41:01'),
(5, 5, 'dokumen/akta_zaidan_syafiq_ardiaz_89ZcV4HVIg1vN8nmeS1E.jpg', 'dokumen/kk_zaidan_syafiq_ardiaz_89ZcV4HVIg1vN8nmeS1E.jpg', 'dokumen/ktp_zaidan_syafiq_ardiaz_89ZcV4HVIg1vN8nmeS1E.jpg', 'dokumen/ijazah_zaidan_syafiq_ardiaz_89ZcV4HVIg1vN8nmeS1E.png', NULL, '2026-08-22 08:41:02', '2026-08-22 08:41:02'),
(6, 6, 'dokumen/akta_arsya_maulana_romadhan_UX5nIMDcgoFqePzXjAtk.jpg', 'dokumen/kk_arsya_maulana_romadhan_UX5nIMDcgoFqePzXjAtk.jpg', 'dokumen/ktp_arsya_maulana_romadhan_UX5nIMDcgoFqePzXjAtk.jpg', 'dokumen/ijazah_arsya_maulana_romadhan_UX5nIMDcgoFqePzXjAtk.png', NULL, '2026-08-22 08:41:02', '2026-08-22 08:41:02'),
(7, 7, 'dokumen/akta_salsa_kirana_zahrani_f05gWN3kPqdzw9TBS5ja.jpg', 'dokumen/kk_salsa_kirana_zahrani_f05gWN3kPqdzw9TBS5ja.jpg', 'dokumen/ktp_salsa_kirana_zahrani_f05gWN3kPqdzw9TBS5ja.jpg', 'dokumen/ijazah_salsa_kirana_zahrani_f05gWN3kPqdzw9TBS5ja.png', NULL, '2026-08-22 09:09:16', '2026-08-22 09:09:16'),
(8, 8, 'dokumen/akta_husna_ayunindya_dHHOTgjxB4qBMZhBI4l9.jpg', 'dokumen/kk_husna_ayunindya_dHHOTgjxB4qBMZhBI4l9.jpg', 'dokumen/ktp_husna_ayunindya_dHHOTgjxB4qBMZhBI4l9.jpg', 'dokumen/ijazah_husna_ayunindya_dHHOTgjxB4qBMZhBI4l9.png', NULL, '2026-08-22 09:09:16', '2026-08-22 09:09:16'),
(9, 9, 'dokumen/akta_karel_al_sadad_mMlOVUzbYGeRKAPo6fS1.jpg', 'dokumen/kk_karel_al_sadad_mMlOVUzbYGeRKAPo6fS1.jpg', 'dokumen/ktp_karel_al_sadad_mMlOVUzbYGeRKAPo6fS1.jpg', 'dokumen/ijazah_karel_al_sadad_mMlOVUzbYGeRKAPo6fS1.png', NULL, '2026-08-22 09:09:17', '2026-08-22 09:09:17'),
(10, 10, 'dokumen/akta_afifa_titiya_nmmbhGycgaZQhIycZh1Y.jpg', 'dokumen/kk_afifa_titiya_nmmbhGycgaZQhIycZh1Y.jpg', 'dokumen/ktp_afifa_titiya_nmmbhGycgaZQhIycZh1Y.jpg', 'dokumen/ijazah_afifa_titiya_nmmbhGycgaZQhIycZh1Y.png', NULL, '2026-08-22 09:09:17', '2026-08-22 09:09:17'),
(11, 11, 'dokumen/akta_syailendra_dirga_mADaRWmWxioLuiEr6Kk8.jpg', 'dokumen/kk_syailendra_dirga_mADaRWmWxioLuiEr6Kk8.jpg', 'dokumen/ktp_syailendra_dirga_mADaRWmWxioLuiEr6Kk8.jpg', 'dokumen/ijazah_syailendra_dirga_mADaRWmWxioLuiEr6Kk8.png', NULL, '2026-08-22 09:09:18', '2026-08-22 09:09:18'),
(12, 12, 'dokumen/akta_angga_wijaya_mAyYK8HoTWxjPbQ0HUiA.jpg', 'dokumen/kk_angga_wijaya_mAyYK8HoTWxjPbQ0HUiA.jpg', 'dokumen/ktp_angga_wijaya_mAyYK8HoTWxjPbQ0HUiA.jpg', 'dokumen/ijazah_angga_wijaya_mAyYK8HoTWxjPbQ0HUiA.png', NULL, '2026-08-22 09:09:18', '2026-08-22 09:09:18'),
(13, 13, 'dokumen/akta_aisyah_M6wh2SalHUsQoHkEfJnF.jpg', 'dokumen/kk_aisyah_M6wh2SalHUsQoHkEfJnF.jpg', 'dokumen/ktp_aisyah_M6wh2SalHUsQoHkEfJnF.jpg', 'dokumen/ijazah_aisyah_M6wh2SalHUsQoHkEfJnF.png', NULL, '2026-08-22 09:09:18', '2026-08-22 09:09:18'),
(14, 14, 'dokumen/akta_alifa_azzalia_Ka09krIxvPO4gzbhrTML.jpg', 'dokumen/kk_alifa_azzalia_Ka09krIxvPO4gzbhrTML.jpg', 'dokumen/ktp_alifa_azzalia_Ka09krIxvPO4gzbhrTML.jpg', 'dokumen/ijazah_alifa_azzalia_Ka09krIxvPO4gzbhrTML.png', NULL, '2026-08-22 09:09:18', '2026-08-22 09:09:18'),
(15, 15, 'dokumen/akta_bilal_al_rasyid_BSvut6zVWvxhe9jBMhwj.jpg', 'dokumen/kk_bilal_al_rasyid_BSvut6zVWvxhe9jBMhwj.jpg', 'dokumen/ktp_bilal_al_rasyid_BSvut6zVWvxhe9jBMhwj.jpg', 'dokumen/ijazah_bilal_al_rasyid_BSvut6zVWvxhe9jBMhwj.png', NULL, '2026-08-22 09:09:19', '2026-08-22 09:09:19'),
(16, 16, 'dokumen/akta_asyifa_umi_sabrina_27xFLjF76LpqLpgG0Gla.jpg', 'dokumen/kk_asyifa_umi_sabrina_27xFLjF76LpqLpgG0Gla.jpg', 'dokumen/ktp_asyifa_umi_sabrina_27xFLjF76LpqLpgG0Gla.jpg', 'dokumen/ijazah_asyifa_umi_sabrina_27xFLjF76LpqLpgG0Gla.png', NULL, '2026-08-22 09:09:19', '2026-08-22 09:09:19'),
(17, 17, 'dokumen/akta_azwan_rafasya_n7G14GFJSyzHSabbt2Xi.jpg', 'dokumen/kk_azwan_rafasya_n7G14GFJSyzHSabbt2Xi.jpg', 'dokumen/ktp_azwan_rafasya_n7G14GFJSyzHSabbt2Xi.jpg', 'dokumen/ijazah_azwan_rafasya_n7G14GFJSyzHSabbt2Xi.png', NULL, '2026-08-22 09:09:19', '2026-08-22 09:09:19'),
(18, 18, 'dokumen/akta_alfania_layla_syakira_VQQQdzQu6DKdVMrtFh4U.jpg', 'dokumen/kk_alfania_layla_syakira_VQQQdzQu6DKdVMrtFh4U.jpg', 'dokumen/ktp_alfania_layla_syakira_VQQQdzQu6DKdVMrtFh4U.jpg', 'dokumen/ijazah_alfania_layla_syakira_VQQQdzQu6DKdVMrtFh4U.png', NULL, '2026-08-22 09:09:20', '2026-08-22 09:09:20'),
(19, 19, 'dokumen/akta_rizki_maulana_saputra_orapcYr5O738YxXdXjr2.jpg', 'dokumen/kk_rizki_maulana_saputra_orapcYr5O738YxXdXjr2.jpg', 'dokumen/ktp_rizki_maulana_saputra_orapcYr5O738YxXdXjr2.jpg', 'dokumen/ijazah_rizki_maulana_saputra_orapcYr5O738YxXdXjr2.png', NULL, '2026-08-22 09:09:20', '2026-08-22 09:09:20'),
(20, 20, 'dokumen/akta_al_khaisyan_putra_JHD84lxpwOpp2MK17jwn.jpg', 'dokumen/kk_al_khaisyan_putra_JHD84lxpwOpp2MK17jwn.jpg', 'dokumen/ktp_al_khaisyan_putra_JHD84lxpwOpp2MK17jwn.jpg', 'dokumen/ijazah_al_khaisyan_putra_JHD84lxpwOpp2MK17jwn.png', NULL, '2026-08-22 09:09:20', '2026-08-22 09:09:20'),
(21, 21, 'dokumen/akta_muhammad_rofiq_pUsK4HW83rSD8K8eMLDl.jpg', 'dokumen/kk_muhammad_rofiq_pUsK4HW83rSD8K8eMLDl.jpg', 'dokumen/ktp_muhammad_rofiq_pUsK4HW83rSD8K8eMLDl.jpg', 'dokumen/ijazah_muhammad_rofiq_pUsK4HW83rSD8K8eMLDl.png', NULL, '2026-08-22 09:09:20', '2026-08-22 09:09:20'),
(22, 22, 'dokumen/akta_nad_nazhif_fikri_OOMymF6vABRI8HeAYbs5.jpg', 'dokumen/kk_nad_nazhif_fikri_OOMymF6vABRI8HeAYbs5.jpg', 'dokumen/ktp_nad_nazhif_fikri_OOMymF6vABRI8HeAYbs5.jpg', 'dokumen/ijazah_nad_nazhif_fikri_OOMymF6vABRI8HeAYbs5.png', NULL, '2026-08-22 09:09:21', '2026-08-22 09:09:21'),
(23, 23, 'dokumen/akta_erina_rayya_odgA86dHH4HLLJX3Sof5.jpg', 'dokumen/kk_erina_rayya_odgA86dHH4HLLJX3Sof5.jpg', 'dokumen/ktp_erina_rayya_odgA86dHH4HLLJX3Sof5.jpg', 'dokumen/ijazah_erina_rayya_odgA86dHH4HLLJX3Sof5.png', NULL, '2026-08-22 09:09:21', '2026-08-22 09:09:21'),
(24, 24, 'dokumen/akta_hafiz_nur_rahman_GlWZCIC93TNHMseOlu11.jpg', 'dokumen/kk_hafiz_nur_rahman_GlWZCIC93TNHMseOlu11.jpg', 'dokumen/ktp_hafiz_nur_rahman_GlWZCIC93TNHMseOlu11.jpg', 'dokumen/ijazah_hafiz_nur_rahman_GlWZCIC93TNHMseOlu11.png', NULL, '2026-08-22 09:09:21', '2026-08-22 09:09:21'),
(25, 25, 'dokumen/akta_saffana_nasha_MJ1uCiUfRzEaijsU36d6.jpg', 'dokumen/kk_saffana_nasha_MJ1uCiUfRzEaijsU36d6.jpg', 'dokumen/ktp_saffana_nasha_MJ1uCiUfRzEaijsU36d6.jpg', 'dokumen/ijazah_saffana_nasha_MJ1uCiUfRzEaijsU36d6.png', NULL, '2026-08-22 09:09:22', '2026-08-22 09:09:22'),
(26, 26, 'dokumen/akta_noval_devan_3cQymWNEqeBshl3SapGC.jpg', 'dokumen/kk_noval_devan_3cQymWNEqeBshl3SapGC.jpg', 'dokumen/ktp_noval_devan_3cQymWNEqeBshl3SapGC.jpg', 'dokumen/ijazah_noval_devan_3cQymWNEqeBshl3SapGC.png', NULL, '2026-08-22 09:09:22', '2026-08-22 09:09:22'),
(27, 27, 'dokumen/akta_alya_dinda_kamala_jG7hzBffIwvxcKmcVo58.jpg', 'dokumen/kk_alya_dinda_kamala_jG7hzBffIwvxcKmcVo58.jpg', 'dokumen/ktp_alya_dinda_kamala_jG7hzBffIwvxcKmcVo58.jpg', 'dokumen/ijazah_alya_dinda_kamala_jG7hzBffIwvxcKmcVo58.png', NULL, '2026-08-22 09:09:22', '2026-08-22 09:09:22'),
(28, 28, 'dokumen/akta_muhaimin_ahmad_vo6yVuRajrQK78k9Tx6E.jpg', 'dokumen/kk_muhaimin_ahmad_vo6yVuRajrQK78k9Tx6E.jpg', 'dokumen/ktp_muhaimin_ahmad_vo6yVuRajrQK78k9Tx6E.jpg', 'dokumen/ijazah_muhaimin_ahmad_vo6yVuRajrQK78k9Tx6E.png', NULL, '2026-08-22 09:09:23', '2026-08-22 09:09:23'),
(29, 29, 'dokumen/akta_narendra_rayyan_38cqky5dNxoumHb9Oteu.jpg', 'dokumen/kk_narendra_rayyan_38cqky5dNxoumHb9Oteu.jpg', 'dokumen/ktp_narendra_rayyan_38cqky5dNxoumHb9Oteu.jpg', 'dokumen/ijazah_narendra_rayyan_38cqky5dNxoumHb9Oteu.png', NULL, '2026-08-22 09:09:23', '2026-08-22 09:09:23'),
(30, 30, 'dokumen/akta_haidar_el_fayyadh_TG4yqA1dTJxV20Ow62mm.jpg', 'dokumen/kk_haidar_el_fayyadh_TG4yqA1dTJxV20Ow62mm.jpg', 'dokumen/ktp_haidar_el_fayyadh_TG4yqA1dTJxV20Ow62mm.jpg', 'dokumen/ijazah_haidar_el_fayyadh_TG4yqA1dTJxV20Ow62mm.png', NULL, '2026-08-22 09:09:23', '2026-08-22 09:09:23'),
(31, 31, 'dokumen/akta_keyla_zea_fanisa_6BIEq3ckJfMlLXMY0m1O.jpg', 'dokumen/kk_keyla_zea_fanisa_6BIEq3ckJfMlLXMY0m1O.jpg', 'dokumen/ktp_keyla_zea_fanisa_6BIEq3ckJfMlLXMY0m1O.jpg', 'dokumen/ijazah_keyla_zea_fanisa_6BIEq3ckJfMlLXMY0m1O.png', NULL, '2026-08-22 09:09:23', '2026-08-22 09:09:23'),
(32, 32, 'dokumen/akta_akbar_raiz_2LFdlPPpp3fJIri615Di.jpg', 'dokumen/kk_akbar_raiz_2LFdlPPpp3fJIri615Di.jpg', 'dokumen/ktp_akbar_raiz_2LFdlPPpp3fJIri615Di.jpg', 'dokumen/ijazah_akbar_raiz_2LFdlPPpp3fJIri615Di.png', NULL, '2026-08-22 09:09:24', '2026-08-22 09:09:24'),
(33, 33, 'dokumen/akta_azka_artanabil_KCEzmVUzGf7iHMHwL2S5.jpg', 'dokumen/kk_azka_artanabil_KCEzmVUzGf7iHMHwL2S5.jpg', 'dokumen/ktp_azka_artanabil_KCEzmVUzGf7iHMHwL2S5.jpg', 'dokumen/ijazah_azka_artanabil_KCEzmVUzGf7iHMHwL2S5.png', NULL, '2026-08-22 09:09:24', '2026-08-22 09:09:24'),
(34, 34, 'dokumen/akta_nazril_mudzdzafar_If0ktiZF1hy9t3FJqerb.jpg', 'dokumen/kk_nazril_mudzdzafar_If0ktiZF1hy9t3FJqerb.jpg', 'dokumen/ktp_nazril_mudzdzafar_If0ktiZF1hy9t3FJqerb.jpg', 'dokumen/ijazah_nazril_mudzdzafar_If0ktiZF1hy9t3FJqerb.png', NULL, '2026-08-22 09:09:24', '2026-08-22 09:09:24'),
(35, 35, 'dokumen/akta_ziris_haidar_alexi_qcJLi1xuOiGqjvOE5tR9.jpg', 'dokumen/kk_ziris_haidar_alexi_qcJLi1xuOiGqjvOE5tR9.jpg', 'dokumen/ktp_ziris_haidar_alexi_qcJLi1xuOiGqjvOE5tR9.jpg', 'dokumen/ijazah_ziris_haidar_alexi_qcJLi1xuOiGqjvOE5tR9.png', NULL, '2026-08-22 09:09:25', '2026-08-22 09:09:25'),
(36, 36, 'dokumen/akta_citra_syakira_9uWPWK55qBR17XYW1T7F.jpg', 'dokumen/kk_citra_syakira_9uWPWK55qBR17XYW1T7F.jpg', 'dokumen/ktp_citra_syakira_9uWPWK55qBR17XYW1T7F.jpg', 'dokumen/ijazah_citra_syakira_9uWPWK55qBR17XYW1T7F.png', NULL, '2026-08-22 09:09:25', '2026-08-22 09:09:25'),
(37, 37, 'dokumen/akta_vezia_almeca_naza_20KlEx5C8rKI2aElhHuH.jpg', 'dokumen/kk_vezia_almeca_naza_20KlEx5C8rKI2aElhHuH.jpg', 'dokumen/ktp_vezia_almeca_naza_20KlEx5C8rKI2aElhHuH.jpg', 'dokumen/ijazah_vezia_almeca_naza_20KlEx5C8rKI2aElhHuH.png', NULL, '2026-08-22 09:09:25', '2026-08-22 09:09:25'),
(38, 38, 'dokumen/akta_febrian_syahputra_TuZC51WRShQ1BBrbQoFS.jpg', 'dokumen/kk_febrian_syahputra_TuZC51WRShQ1BBrbQoFS.jpg', 'dokumen/ktp_febrian_syahputra_TuZC51WRShQ1BBrbQoFS.jpg', 'dokumen/ijazah_febrian_syahputra_TuZC51WRShQ1BBrbQoFS.png', NULL, '2026-08-22 09:09:26', '2026-08-22 09:09:26'),
(39, 39, 'dokumen/akta_muhammad_zain_alfatih_VH22VJZtFjKUXIVF9NHN.jpg', 'dokumen/kk_muhammad_zain_alfatih_VH22VJZtFjKUXIVF9NHN.jpg', 'dokumen/ktp_muhammad_zain_alfatih_VH22VJZtFjKUXIVF9NHN.jpg', 'dokumen/ijazah_muhammad_zain_alfatih_VH22VJZtFjKUXIVF9NHN.png', NULL, '2026-08-22 09:09:26', '2026-08-22 09:09:26');

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

--
-- Dumping data untuk tabel `jobs`
--

INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES
(1, 'default', '{\"uuid\":\"d08118c9-0835-416c-9084-ad507be26cc1\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:1;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 14:53:09.686387\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787410387,\"delay\":2}', 0, NULL, 1787410389, 1787410387),
(2, 'default', '{\"uuid\":\"e137644d-c3b6-44b8-98f1-c65520ab65ac\",\"displayName\":\"App\\\\Jobs\\\\SendPembayaranNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendPembayaranNotification\",\"command\":\"O:35:\\\"App\\\\Jobs\\\\SendPembayaranNotification\\\":5:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:1;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:18:\\\"\\u0000*\\u0000jenisPembayaran\\\";s:18:\\\"3. Uang Buku Rapor\\\";s:14:\\\"\\u0000*\\u0000nominalBaru\\\";d:100000;s:13:\\\"\\u0000*\\u0000statusBaru\\\";s:7:\\\"cicilan\\\";s:9:\\\"\\u0000*\\u0000pdfUrl\\\";N;}\",\"batchId\":null},\"createdAt\":1787411577,\"delay\":null}', 0, NULL, 1787411577, 1787411577),
(3, 'default', '{\"uuid\":\"9204e757-5e6a-49b0-9d01-2093dfcfc673\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:1;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:11:\\\"tidak_lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 15:16:17.645304\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787411774,\"delay\":3}', 0, NULL, 1787411777, 1787411774),
(4, 'default', '{\"uuid\":\"91d45535-8ce1-4af8-b3d1-21b26d85a548\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:1;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 15:16:24.022055\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787411781,\"delay\":3}', 0, NULL, 1787411784, 1787411781),
(5, 'default', '{\"uuid\":\"77865b42-25f9-4c98-8af8-75dac8df4585\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:6;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 15:46:32.631238\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787413589,\"delay\":3}', 0, NULL, 1787413592, 1787413589),
(6, 'default', '{\"uuid\":\"67b56438-6e69-4c29-bf16-8cb22b940acc\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 15:46:35.698737\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787413592,\"delay\":3}', 0, NULL, 1787413595, 1787413592),
(7, 'default', '{\"uuid\":\"ef897c35-46b6-4335-814a-8a34fdc76c3e\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 15:46:38.797208\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787413595,\"delay\":3}', 0, NULL, 1787413598, 1787413595),
(8, 'default', '{\"uuid\":\"c1c0c137-8835-4706-a059-f38ec5323975\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:4;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 15:46:47.389896\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787413604,\"delay\":3}', 0, NULL, 1787413607, 1787413604),
(9, 'default', '{\"uuid\":\"172ef205-745a-45d5-81c6-03b872ba0129\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:5;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 15:46:51.038055\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787413608,\"delay\":3}', 0, NULL, 1787413611, 1787413608),
(10, 'default', '{\"uuid\":\"84d0ec3e-d0f5-4d95-9efd-4f5389e2be86\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:10;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:13:16.552735\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415193,\"delay\":3}', 0, NULL, 1787415196, 1787415193),
(11, 'default', '{\"uuid\":\"f9cf3832-837e-4f4e-83a8-df1419e98cb4\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:13;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:13:28.017584\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415205,\"delay\":3}', 0, NULL, 1787415208, 1787415205),
(12, 'default', '{\"uuid\":\"635bfb49-bce2-4b6e-beb0-9d583b300115\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:32;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:13:33.024522\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415210,\"delay\":3}', 0, NULL, 1787415213, 1787415210),
(13, 'default', '{\"uuid\":\"02e33880-0974-4ef7-8dde-c3a9471a8ac8\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:20;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:13:37.480335\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415214,\"delay\":3}', 0, NULL, 1787415217, 1787415214),
(14, 'default', '{\"uuid\":\"c3ca30be-e377-43ce-821d-e5eeb7cfde28\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:18;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:13:41.358337\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415218,\"delay\":3}', 0, NULL, 1787415221, 1787415218),
(15, 'default', '{\"uuid\":\"c3072e0a-0b97-4ff6-a002-7ca1cf43c437\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:14;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:13:45.141619\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415222,\"delay\":3}', 0, NULL, 1787415225, 1787415222),
(16, 'default', '{\"uuid\":\"76e2b607-c469-45ab-90b7-ef10b390b89f\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:27;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:13:48.731745\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415225,\"delay\":3}', 0, NULL, 1787415228, 1787415225),
(17, 'default', '{\"uuid\":\"46bcb72c-e7bd-414e-bf66-bdf9937b6deb\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:12;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:13:52.621640\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415229,\"delay\":3}', 0, NULL, 1787415232, 1787415229),
(18, 'default', '{\"uuid\":\"f7f67427-1aa0-4c21-8f05-99bc0ff6597d\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:16;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:14:08.165105\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415245,\"delay\":3}', 0, NULL, 1787415248, 1787415245),
(19, 'default', '{\"uuid\":\"281a0d03-8202-403b-a4c7-a09b43032e21\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:33;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:14:12.337784\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415249,\"delay\":3}', 0, NULL, 1787415252, 1787415249),
(20, 'default', '{\"uuid\":\"83fc0f47-a8fd-438f-bc39-e4cf45802e32\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:17;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:14:16.819857\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415253,\"delay\":3}', 0, NULL, 1787415256, 1787415253),
(21, 'default', '{\"uuid\":\"a34e26a9-d16d-40cd-8268-340a6c1d228f\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:15;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:14:28.098606\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415265,\"delay\":3}', 0, NULL, 1787415268, 1787415265),
(22, 'default', '{\"uuid\":\"eb32a8f0-9a75-4dcc-b47d-58655d0956c4\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:15;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:11:\\\"tidak_lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:14:33.336019\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415270,\"delay\":3}', 0, NULL, 1787415273, 1787415270),
(23, 'default', '{\"uuid\":\"69540f23-1065-43a8-b175-9309f5c4abe3\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:36;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:14:37.512347\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415274,\"delay\":3}', 0, NULL, 1787415277, 1787415274),
(24, 'default', '{\"uuid\":\"5aa24d0e-971e-4edc-8ba6-f8099414eb3b\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:23;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:14:41.368227\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415278,\"delay\":3}', 0, NULL, 1787415281, 1787415278),
(25, 'default', '{\"uuid\":\"274f6d75-b0d1-4745-b434-1d2cb0115011\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:38;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:14:44.767271\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415281,\"delay\":3}', 0, NULL, 1787415284, 1787415281),
(26, 'default', '{\"uuid\":\"e05d6505-a1a3-469e-b40e-37194b8e578a\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:24;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:14:48.187619\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415285,\"delay\":3}', 0, NULL, 1787415288, 1787415285),
(27, 'default', '{\"uuid\":\"e5b5dd9c-faad-4467-b231-ef46dc44cad3\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:8;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:14:52.649001\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415289,\"delay\":3}', 0, NULL, 1787415292, 1787415289),
(28, 'default', '{\"uuid\":\"1f6c818e-f55b-48b6-b7d3-87fbd7eda531\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:9;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:14:56.459435\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415293,\"delay\":3}', 0, NULL, 1787415296, 1787415293),
(29, 'default', '{\"uuid\":\"c402267f-1b47-4e45-b9c5-b8e2c6b66bae\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:31;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:15:00.496190\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415297,\"delay\":3}', 0, NULL, 1787415300, 1787415297),
(30, 'default', '{\"uuid\":\"e34d2a30-9ea2-4bdc-a1c1-db62cd4f5725\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:21;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:15:04.342967\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415301,\"delay\":3}', 0, NULL, 1787415304, 1787415301),
(31, 'default', '{\"uuid\":\"7d525086-8960-4af9-85c0-2b01b02c3887\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:11;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:15:07.824172\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415304,\"delay\":3}', 0, NULL, 1787415307, 1787415304),
(32, 'default', '{\"uuid\":\"36e9f1bb-70ef-4070-9c17-9d5399e0887f\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:28;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:15:11.233085\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415308,\"delay\":3}', 0, NULL, 1787415311, 1787415308),
(33, 'default', '{\"uuid\":\"89c388a7-119a-4a94-86ca-e2e46056751e\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:30;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:15:14.550742\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415311,\"delay\":3}', 0, NULL, 1787415314, 1787415311),
(34, 'default', '{\"uuid\":\"60708403-704b-4374-8d23-a384fb23bf80\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:39;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:15:17.693749\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415314,\"delay\":3}', 0, NULL, 1787415317, 1787415314),
(35, 'default', '{\"uuid\":\"8c3609fd-bad9-4013-9cbb-9f1da37a86c0\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:22;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:15:22.641185\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415319,\"delay\":3}', 0, NULL, 1787415322, 1787415319),
(36, 'default', '{\"uuid\":\"f1cd6551-b8b4-4f78-b5b2-8c28c20de5b4\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:29;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:15:26.884041\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415323,\"delay\":3}', 0, NULL, 1787415326, 1787415323),
(37, 'default', '{\"uuid\":\"e97d92db-746b-4327-9fd2-a38803622e98\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:34;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:15:30.701411\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415327,\"delay\":3}', 0, NULL, 1787415330, 1787415327),
(38, 'default', '{\"uuid\":\"c2ce2446-a7a7-4dd5-8cb9-6058b0045d67\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:26;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:15:35.026426\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415332,\"delay\":3}', 0, NULL, 1787415335, 1787415332),
(39, 'default', '{\"uuid\":\"400e06b9-3f7a-4e20-b12a-d8a8e1b4101c\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:19;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:5:\\\"lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-22 16:15:38.912516\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787415335,\"delay\":3}', 0, NULL, 1787415338, 1787415335),
(40, 'default', '{\"uuid\":\"60c09ade-5a86-4861-a650-2302e8f79fdc\",\"displayName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"60,300,900\",\"timeout\":30,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendWhatsAppNotification\",\"command\":\"O:33:\\\"App\\\\Jobs\\\\SendWhatsAppNotification\\\":3:{s:14:\\\"\\u0000*\\u0000pendaftaran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:22:\\\"App\\\\Models\\\\Pendaftaran\\\";s:2:\\\"id\\\";i:13;s:9:\\\"relations\\\";a:1:{i:0;s:7:\\\"seleksi\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:16:\\\"\\u0000*\\u0000statusSeleksi\\\";s:11:\\\"tidak_lulus\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-08-23 01:48:11.556539\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\",\"batchId\":null},\"createdAt\":1787449690,\"delay\":1}', 0, NULL, 1787449691, 1787449690);

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

--
-- Dumping data untuk tabel `notifikasis`
--

INSERT INTO `notifikasis` (`id`, `user_id`, `for_role`, `title`, `message`, `is_read`, `link_url`, `created_at`, `updated_at`) VALUES
(1, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: Atha Rayhaan Shakeil telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 07:23:22', '2026-08-22 07:50:33'),
(2, 2, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 1, '/dokumen', '2026-08-22 07:23:22', '2026-08-22 07:23:31'),
(3, 2, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 1, '/dokumen', '2026-08-22 07:49:31', '2026-08-22 07:49:42'),
(4, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: Atha Rayhaan Shakeil telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 07:49:31', '2026-08-22 07:50:49'),
(5, 2, 'siswa', '✏️ Biodata Diperbarui oleh Admin', 'Data formulir biodata pendaftaran Anda telah disesuaikan/diperbaiki oleh admin panitia SPMB.', 1, '/pendaftaran', '2026-08-22 07:52:22', '2026-08-22 07:53:54'),
(6, 2, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 1, '/pengumuman', '2026-08-22 07:53:06', '2026-08-22 07:53:57'),
(7, 2, 'siswa', '📤 Bukti Pembayaran Diunggah', 'Bukti pembayaran Anda berhasil diunggah dan sedang dalam proses verifikasi admin. Harap tunggu konfirmasi.', 1, '/pembayaran', '2026-08-22 08:00:37', '2026-08-22 08:00:50'),
(8, NULL, 'admin', '💰 Pembayaran Baru Masuk', 'Pembayaran Baru: Atha Rayhaan Shakeil telah mengunggah bukti pembayaran. Harap segera verifikasi.', 1, '/pembayaran-admin', '2026-08-22 08:00:37', '2026-08-22 08:01:12'),
(9, 2, 'siswa', '✅ Cicilan Pembayaran Diverifikasi', 'Pembayaran cicilan Anda telah diverifikasi. Harap selesaikan sisa pembayaran pada jadwal berikutnya.', 1, '/pembayaran', '2026-08-22 08:12:54', '2026-08-22 08:13:58'),
(10, 2, 'siswa', '❌ Hasil Seleksi Diperbarui', 'Mohon maaf, status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 1, '/pengumuman', '2026-08-22 08:16:14', '2026-08-22 08:24:33'),
(11, 2, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 1, '/pengumuman', '2026-08-22 08:16:21', '2026-08-22 08:24:39'),
(12, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: AZZAHRA SALSABILA telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 08:41:00', '2026-08-22 08:46:16'),
(13, 3, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 08:41:00', '2026-08-22 08:41:00'),
(14, 3, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 08:41:00', '2026-08-22 08:41:00'),
(15, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: AZZAHRA SALSABILA telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 08:41:00', '2026-08-22 08:46:16'),
(16, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: KEYSHA AL-KHANZA telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 08:41:01', '2026-08-22 08:46:16'),
(17, 4, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 08:41:01', '2026-08-22 08:41:01'),
(18, 4, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 08:41:01', '2026-08-22 08:41:01'),
(19, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: KEYSHA AL-KHANZA telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 08:41:01', '2026-08-22 08:46:16'),
(20, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: NADHIRA RAHMA FALISHA telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 08:41:01', '2026-08-22 08:46:16'),
(21, 5, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 08:41:01', '2026-08-22 08:41:01'),
(22, 5, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 08:41:01', '2026-08-22 08:41:01'),
(23, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: NADHIRA RAHMA FALISHA telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 08:41:01', '2026-08-22 08:46:16'),
(24, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: ZAIDAN SYAFIQ ARDIAZ telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 08:41:02', '2026-08-22 08:46:04'),
(25, 6, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 08:41:02', '2026-08-22 08:41:02'),
(26, 6, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 08:41:02', '2026-08-22 08:41:02'),
(27, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: ZAIDAN SYAFIQ ARDIAZ telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 08:41:02', '2026-08-22 08:46:10'),
(28, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: ARSYA MAULANA ROMADHAN telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 08:41:02', '2026-08-22 08:46:16'),
(29, 7, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 08:41:02', '2026-08-22 08:41:02'),
(30, 7, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 08:41:02', '2026-08-22 08:41:02'),
(31, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: ARSYA MAULANA ROMADHAN telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 08:41:02', '2026-08-22 08:46:16'),
(32, 7, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 08:46:29', '2026-08-22 08:46:29'),
(33, 3, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 08:46:32', '2026-08-22 08:46:32'),
(34, 4, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 08:46:35', '2026-08-22 08:46:35'),
(35, 5, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 08:46:44', '2026-08-22 08:46:44'),
(36, 6, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 08:46:48', '2026-08-22 08:46:48'),
(37, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: SALSA KIRANA ZAHRANI telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:16', '2026-08-22 09:13:20'),
(38, 8, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:16', '2026-08-22 09:09:16'),
(39, 8, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:16', '2026-08-22 09:09:16'),
(40, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: SALSA KIRANA ZAHRANI telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:16', '2026-08-22 09:13:20'),
(41, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: HUSNA AYUNINDYA telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:16', '2026-08-22 09:13:20'),
(42, 9, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:16', '2026-08-22 09:09:16'),
(43, 9, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:16', '2026-08-22 09:09:16'),
(44, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: HUSNA AYUNINDYA telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:16', '2026-08-22 09:13:20'),
(45, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: KAREL AL SADAD telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:17', '2026-08-22 09:13:20'),
(46, 10, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:17', '2026-08-22 09:09:17'),
(47, 10, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:17', '2026-08-22 09:09:17'),
(48, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: KAREL AL SADAD telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:17', '2026-08-22 09:13:20'),
(49, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: AFIFA TITIYA telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:17', '2026-08-22 09:13:20'),
(50, 11, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:17', '2026-08-22 09:09:17'),
(51, 11, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:17', '2026-08-22 09:09:17'),
(52, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: AFIFA TITIYA telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:17', '2026-08-22 09:13:20'),
(53, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: M. SYAILENDRA DIRGA VERNANDO telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:18', '2026-08-22 09:13:20'),
(54, 12, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:18', '2026-08-22 09:09:18'),
(55, 12, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:18', '2026-08-22 09:09:18'),
(56, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: M. SYAILENDRA DIRGA VERNANDO telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:18', '2026-08-22 09:13:20'),
(57, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: ANGGA WIJAYA telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:18', '2026-08-22 09:13:20'),
(58, 13, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:18', '2026-08-22 09:09:18'),
(59, 13, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:18', '2026-08-22 09:09:18'),
(60, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: ANGGA WIJAYA telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:18', '2026-08-22 09:13:20'),
(61, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: AISYAH telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:18', '2026-08-22 09:13:20'),
(62, 14, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:18', '2026-08-22 09:09:18'),
(63, 14, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:18', '2026-08-22 09:09:18'),
(64, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: AISYAH telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:18', '2026-08-22 09:13:20'),
(65, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: ALIFA AZZALIA telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:18', '2026-08-22 09:13:20'),
(66, 15, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:18', '2026-08-22 09:09:18'),
(67, 15, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:18', '2026-08-22 09:09:18'),
(68, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: ALIFA AZZALIA telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:18', '2026-08-22 09:13:20'),
(69, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: BILAL AL RASYID telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:19', '2026-08-22 09:13:20'),
(70, 16, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:19', '2026-08-22 09:09:19'),
(71, 16, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:19', '2026-08-22 09:09:19'),
(72, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: BILAL AL RASYID telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:19', '2026-08-22 09:13:20'),
(73, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: ASYIFA UMI SABRINA telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:19', '2026-08-22 09:13:20'),
(74, 17, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:19', '2026-08-22 09:09:19'),
(75, 17, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:19', '2026-08-22 09:09:19'),
(76, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: ASYIFA UMI SABRINA telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:19', '2026-08-22 09:13:20'),
(77, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: AZWAN RAFASYA telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:19', '2026-08-22 09:13:20'),
(78, 18, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:19', '2026-08-22 09:09:19'),
(79, 18, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:19', '2026-08-22 09:09:19'),
(80, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: AZWAN RAFASYA telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:19', '2026-08-22 09:13:20'),
(81, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: ALFANIA LAYLA SYAKIRA RAMADHANI telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:20', '2026-08-22 09:13:20'),
(82, 19, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:20', '2026-08-22 09:09:20'),
(83, 19, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:20', '2026-08-22 09:09:20'),
(84, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: ALFANIA LAYLA SYAKIRA RAMADHANI telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:20', '2026-08-22 09:13:20'),
(85, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: RIZKI MAULANA SAPUTRA telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:20', '2026-08-22 09:13:20'),
(86, 20, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:20', '2026-08-22 09:09:20'),
(87, 20, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:20', '2026-08-22 09:09:20'),
(88, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: RIZKI MAULANA SAPUTRA telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:20', '2026-08-22 09:13:20'),
(89, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: AL KHAISYAN PUTRA PAMUNGKAS telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:20', '2026-08-22 09:13:20'),
(90, 21, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:20', '2026-08-22 09:09:20'),
(91, 21, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:20', '2026-08-22 09:09:20'),
(92, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: AL KHAISYAN PUTRA PAMUNGKAS telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:20', '2026-08-22 09:13:20'),
(93, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: KMS. MUHAMMAD ROFIQ AL MAULIDY telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:20', '2026-08-22 09:13:20'),
(94, 22, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:20', '2026-08-22 09:09:20'),
(95, 22, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:20', '2026-08-22 09:09:20'),
(96, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: KMS. MUHAMMAD ROFIQ AL MAULIDY telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:20', '2026-08-22 09:13:20'),
(97, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: NAD NAZHIF FIKRI telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:21', '2026-08-22 09:13:20'),
(98, 23, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:21', '2026-08-22 09:09:21'),
(99, 23, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:21', '2026-08-22 09:09:21'),
(100, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: NAD NAZHIF FIKRI telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:21', '2026-08-22 09:13:20'),
(101, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: ERINA RAYYA ASSYAUQIE telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:21', '2026-08-22 09:13:20'),
(102, 24, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:21', '2026-08-22 09:09:21'),
(103, 24, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:21', '2026-08-22 09:09:21'),
(104, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: ERINA RAYYA ASSYAUQIE telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:21', '2026-08-22 09:13:20'),
(105, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: HAFIZ NUR RAHMAN telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:21', '2026-08-22 09:13:20'),
(106, 25, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:21', '2026-08-22 09:09:21'),
(107, 25, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:21', '2026-08-22 09:09:21'),
(108, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: HAFIZ NUR RAHMAN telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:21', '2026-08-22 09:13:20'),
(109, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: SAFFANA NASHA FAWZIA telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:22', '2026-08-22 09:13:20'),
(110, 26, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:22', '2026-08-22 09:09:22'),
(111, 26, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:22', '2026-08-22 09:09:22'),
(112, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: SAFFANA NASHA FAWZIA telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:22', '2026-08-22 09:13:20'),
(113, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: NOVAL DEVAN AT TAIMIFAH telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:22', '2026-08-22 09:13:20'),
(114, 27, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:22', '2026-08-22 09:09:22'),
(115, 27, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:22', '2026-08-22 09:09:22'),
(116, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: NOVAL DEVAN AT TAIMIFAH telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:22', '2026-08-22 09:13:20'),
(117, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: ALYA DINDA KAMALA telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:22', '2026-08-22 09:13:20'),
(118, 28, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:22', '2026-08-22 09:09:22'),
(119, 28, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:22', '2026-08-22 09:09:22'),
(120, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: ALYA DINDA KAMALA telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:22', '2026-08-22 09:13:20'),
(121, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: MUHAIMIN AHMAD telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:22', '2026-08-22 09:13:20'),
(122, 29, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:23', '2026-08-22 09:09:23'),
(123, 29, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:23', '2026-08-22 09:09:23'),
(124, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: MUHAIMIN AHMAD telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:23', '2026-08-22 09:13:20'),
(125, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: NARENDRA RAYYAN ATHA RAZKA telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:23', '2026-08-22 09:13:20'),
(126, 30, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:23', '2026-08-22 09:09:23'),
(127, 30, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:23', '2026-08-22 09:09:23'),
(128, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: NARENDRA RAYYAN ATHA RAZKA telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:23', '2026-08-22 09:13:20'),
(129, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: MUHAMMAD HAIDAR EL FAYYADH telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:23', '2026-08-22 09:13:20'),
(130, 31, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:23', '2026-08-22 09:09:23'),
(131, 31, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:23', '2026-08-22 09:09:23'),
(132, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: MUHAMMAD HAIDAR EL FAYYADH telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:23', '2026-08-22 09:13:20'),
(133, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: KEYLA ZEA FANISA telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:23', '2026-08-22 09:13:20'),
(134, 32, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:23', '2026-08-22 09:09:23'),
(135, 32, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:23', '2026-08-22 09:09:23'),
(136, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: KEYLA ZEA FANISA telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:23', '2026-08-22 09:13:20'),
(137, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: AKBAR RAIZ telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:24', '2026-08-22 09:13:20'),
(138, 33, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:24', '2026-08-22 09:09:24'),
(139, 33, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:24', '2026-08-22 09:09:24'),
(140, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: AKBAR RAIZ telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:24', '2026-08-22 09:13:20'),
(141, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: AZKA ARTANABIL telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:24', '2026-08-22 09:13:20'),
(142, 34, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:24', '2026-08-22 09:09:24'),
(143, 34, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:24', '2026-08-22 09:09:24'),
(144, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: AZKA ARTANABIL telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:24', '2026-08-22 09:13:20'),
(145, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: NAZRIL MUDZDZAFAR telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:24', '2026-08-22 09:13:20'),
(146, 35, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:24', '2026-08-22 09:09:24'),
(147, 35, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:24', '2026-08-22 09:09:24'),
(148, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: NAZRIL MUDZDZAFAR telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:24', '2026-08-22 09:13:20'),
(149, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: ZIRIS HAIDAR ALEXI telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:25', '2026-08-22 09:13:20'),
(150, 36, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:25', '2026-08-22 09:09:25'),
(151, 36, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:25', '2026-08-22 09:09:25'),
(152, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: ZIRIS HAIDAR ALEXI telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:25', '2026-08-22 09:13:20'),
(153, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: CITRA SYAKIRA telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:25', '2026-08-22 09:13:20'),
(154, 37, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:25', '2026-08-22 09:09:25'),
(155, 37, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:25', '2026-08-22 09:09:25'),
(156, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: CITRA SYAKIRA telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:25', '2026-08-22 09:13:20'),
(157, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: VEZIA ALMECA NAZA telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:25', '2026-08-22 09:13:20'),
(158, 38, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:25', '2026-08-22 09:09:25'),
(159, 38, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:25', '2026-08-22 09:09:25'),
(160, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: VEZIA ALMECA NAZA telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:25', '2026-08-22 09:13:20'),
(161, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: FEBRIAN SYAHPUTRA telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:26', '2026-08-22 09:13:20'),
(162, 39, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:26', '2026-08-22 09:09:26'),
(163, 39, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:26', '2026-08-22 09:09:26'),
(164, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: FEBRIAN SYAHPUTRA telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:26', '2026-08-22 09:13:20'),
(165, NULL, 'admin', '🧑‍🎓 Pendaftar Baru', 'Pendaftar Baru: MUHAMMAD ZAIN ALFATIH telah mendaftar pada sistem.', 1, '/data-pendaftar', '2026-08-22 09:09:26', '2026-08-22 09:13:20'),
(166, 40, 'siswa', '✅ Biodata Tersimpan', 'Biodata berhasil disimpan. Lanjutkan dengan mengunggah dokumen persyaratan.', 0, '/dokumen', '2026-08-22 09:09:26', '2026-08-22 09:09:26'),
(167, 40, 'siswa', '📄 Dokumen Berhasil Diunggah', 'Berkas dokumen Anda berhasil diunggah dan sedang menunggu verifikasi dari panitia admin.', 0, '/dokumen', '2026-08-22 09:09:26', '2026-08-22 09:09:26'),
(168, NULL, 'admin', '📋 Dokumen Baru Diunggah', 'Update Berkas: MUHAMMAD ZAIN ALFATIH telah mengunggah dokumen persyaratan. Silakan verifikasi.', 1, '/verifikasi-berkas', '2026-08-22 09:09:26', '2026-08-22 09:13:20'),
(169, 11, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:13:13', '2026-08-22 09:13:13'),
(170, 14, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:13:25', '2026-08-22 09:13:25'),
(171, 33, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:13:30', '2026-08-22 09:13:30'),
(172, 21, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:13:34', '2026-08-22 09:13:34'),
(173, 19, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:13:38', '2026-08-22 09:13:38'),
(174, 15, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:13:42', '2026-08-22 09:13:42'),
(175, 28, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:13:45', '2026-08-22 09:13:45'),
(176, 13, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:13:49', '2026-08-22 09:13:49'),
(177, 17, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:14:05', '2026-08-22 09:14:05'),
(178, 34, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:14:09', '2026-08-22 09:14:09'),
(179, 18, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:14:13', '2026-08-22 09:14:13'),
(180, 16, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:14:25', '2026-08-22 09:14:25'),
(181, 16, 'siswa', '❌ Hasil Seleksi Diperbarui', 'Mohon maaf, status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:14:30', '2026-08-22 09:14:30'),
(182, 37, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:14:34', '2026-08-22 09:14:34'),
(183, 24, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:14:38', '2026-08-22 09:14:38'),
(184, 39, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:14:41', '2026-08-22 09:14:41'),
(185, 25, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:14:45', '2026-08-22 09:14:45'),
(186, 9, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:14:49', '2026-08-22 09:14:49'),
(187, 10, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:14:53', '2026-08-22 09:14:53'),
(188, 32, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:14:57', '2026-08-22 09:14:57'),
(189, 22, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:15:01', '2026-08-22 09:15:01'),
(190, 12, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:15:04', '2026-08-22 09:15:04'),
(191, 29, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:15:08', '2026-08-22 09:15:08'),
(192, 31, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:15:11', '2026-08-22 09:15:11'),
(193, 40, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:15:14', '2026-08-22 09:15:14'),
(194, 23, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:15:19', '2026-08-22 09:15:19'),
(195, 30, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:15:23', '2026-08-22 09:15:23'),
(196, 35, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:15:27', '2026-08-22 09:15:27'),
(197, 27, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:15:32', '2026-08-22 09:15:32'),
(198, 20, 'siswa', '🎉 Selamat! Anda Dinyatakan LULUS', 'Status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 09:15:35', '2026-08-22 09:15:35'),
(199, 14, 'siswa', '❌ Hasil Seleksi Diperbarui', 'Mohon maaf, status kelulusan Anda telah diperbarui. Silakan cek Halaman Pengumuman untuk informasi lebih lanjut.', 0, '/pengumuman', '2026-08-22 18:48:08', '2026-08-22 18:48:08'),
(200, 18, 'siswa', '📤 Bukti Pembayaran Diunggah', 'Bukti pembayaran Anda berhasil diunggah dan sedang dalam proses verifikasi admin. Harap tunggu konfirmasi.', 0, '/pembayaran', '2026-08-22 18:58:55', '2026-08-22 18:58:55'),
(201, NULL, 'admin', '💰 Pembayaran Baru Masuk', 'Pembayaran Baru: AZWAN RAFASYA telah mengunggah bukti pembayaran. Harap segera verifikasi.', 1, '/pembayaran-admin', '2026-08-22 18:58:55', '2026-08-22 18:59:43');

-- --------------------------------------------------------

--
-- Struktur dari tabel `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(1, 2, 'Atha Rayhaan Shakeil', '1608032601200001', NULL, 'TK ABA Harjowinangun', 'OKU Timur', '2020-01-26', 'L', 'Tanjung Raya Belitang', '1. Anta Bilhuda   2. Sri Wahyuni', '0856 0935 7655', 'lulus', 'cicilan', 100000.00, NULL, 'Pembayaran Rp 100.000 disetujui. Cicilan sudah masuk', '2026-08-22 07:23:22', '2026-08-22 08:24:01'),
(2, 3, 'AZZAHRA SALSABILA', '1608034607200001', 'pas_foto/foto_azzahra_salsabila_qgUrWeqJrmL8E9YFQccl.jpg', 'PAUD Kasih Ibu Sidomakmur', 'OKU Timur', '2020-07-06', 'P', 'Sidomakmur', '1. Randi Iwantoro   2. Maya Resti', '085840234706', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 08:41:00', '2026-08-22 08:46:32'),
(3, 4, 'KEYSHA AL-KHANZA', '1608037008190001', 'pas_foto/foto_keysha_al_khanza_T8wMxPIK7blc7WBQsBgV.jpg', 'PAUD Kasih Ibu Sidomakmur', 'OKU Timur', '2019-08-30', 'P', 'Sidomakmur', '1. Riki Hermawan   2. Sagita Putri Lesmana', '085709147368', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 08:41:01', '2026-08-22 08:46:35'),
(4, 5, 'NADHIRA RAHMA FALISHA', '1608036707200001', 'pas_foto/foto_nadhira_rahma_falisha_oZgghY7hRQjldrFyksb3.jpg', 'TK ABA Harjowinangun', 'OKU Timur', '2020-07-27', 'P', 'Sidogede', '1. Sito Kastoyo   2. Siti Kholifatul Motmainah', '081273833632', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 08:41:01', '2026-08-22 08:46:44'),
(5, 6, 'ZAIDAN SYAFIQ ARDIAZ', '1608030208200001', 'pas_foto/foto_zaidan_syafiq_ardiaz_89ZcV4HVIg1vN8nmeS1E.jpg', 'TK ABA Harjowinangun', 'OKU Timur', '2020-08-02', 'L', 'Sidogede', '1. Ardianto, M.Pd   2. Zumroton Nikmah, S.Pd.', '085839986594', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 08:41:02', '2026-08-22 08:46:48'),
(6, 7, 'ARSYA MAULANA ROMADHAN', '1608030105200001', 'pas_foto/foto_arsya_maulana_romadhan_UX5nIMDcgoFqePzXjAtk.jpg', 'RA Nurul Huda Sidomakmur', 'OKU Timur', '2020-05-01', 'L', 'Sidomakmur', '1. Ahmad Tukiyan   2. Nia Widiani', '082181491159', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 08:41:02', '2026-08-22 08:46:29'),
(7, 8, 'SALSA KIRANA ZAHRANI', '1608034506200001', 'pas_foto/foto_salsa_kirana_zahrani_f05gWN3kPqdzw9TBS5ja.jpg', 'RA Nurul Huda Sidomakmur', 'OKU Timur', '2020-06-05', 'P', 'Sidomakmur', '1. Antono   2. Tilawati', '085373020355', 'menunggu_verifikasi', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:16', '2026-08-22 09:09:16'),
(8, 9, 'HUSNA AYUNINDYA', '1608035110190001', 'pas_foto/foto_husna_ayunindya_dHHOTgjxB4qBMZhBI4l9.jpg', 'RA Nurul Huda Sidomakmur', 'OKU Timur', '2019-10-11', 'P', 'Sidomakmur', '1. Hasyim Muhamad Sobri   2. Siti Maisyaroh', '085840000008', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:16', '2026-08-22 09:14:49'),
(9, 10, 'KAREL AL SADAD', '1608031911190001', 'pas_foto/foto_karel_al_sadad_mMlOVUzbYGeRKAPo6fS1.jpg', 'TK Imam Bonjol Gumawang', 'OKU Timur', '2019-11-19', 'L', 'Tegalrejo', '1. Ahmad Zainal Arifin   2. Marfiana Lestari', '081391399054', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:17', '2026-08-22 09:14:53'),
(10, 11, 'AFIFA TITIYA', '1608034609190001', 'pas_foto/foto_afifa_titiya_nmmbhGycgaZQhIycZh1Y.jpg', 'KB Al Fatah Sidogede', 'OKU Timur', '2019-09-06', 'P', 'Sidogede', '1. Tusimin   2. Nora Filiyanti', '085691675912', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:17', '2026-08-22 09:13:13'),
(11, 12, 'M. SYAILENDRA DIRGA VERNANDO', '1608032403200001', 'pas_foto/foto_syailendra_dirga_mADaRWmWxioLuiEr6Kk8.jpg', 'TK ABA Tulus Ayu', 'OKU Timur', '2020-03-24', 'L', 'Tulus Ayu', '1. Redho Vernando   2. Indah Utami', '085709570651', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:18', '2026-08-22 09:15:04'),
(12, 13, 'ANGGA WIJAYA', '1608032211190001', 'pas_foto/foto_angga_wijaya_mAyYK8HoTWxjPbQ0HUiA.jpg', 'KB Al Fatah Sidogede', 'OKU Timur', '2019-11-22', 'L', 'Sidogede', '1. Suherman   2. Nurmala Sari', '085700000012', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:18', '2026-08-22 09:13:49'),
(13, 14, 'AISYAH', '1608034311190001', 'pas_foto/foto_aisyah_M6wh2SalHUsQoHkEfJnF.jpg', 'KB Al Fatah Sidogede', 'OKU Timur', '2019-11-03', 'P', 'Sidogede', '1. Heri Suharyanto   2. Naria Afriandika Parulian', '085700000013', 'tidak_lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:18', '2026-08-22 18:48:08'),
(14, 15, 'ALIFA AZZALIA', '1608034406200001', 'pas_foto/foto_alifa_azzalia_Ka09krIxvPO4gzbhrTML.jpg', 'KB Al Fatah Sidogede', 'OKU Timur', '2020-06-04', 'P', 'Sidogede', '1. Hendri Purwoko   2. Supiyati', '085700000014', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:18', '2026-08-22 09:13:42'),
(15, 16, 'BILAL AL RASYID', '1608033105200001', 'pas_foto/foto_bilal_al_rasyid_BSvut6zVWvxhe9jBMhwj.jpg', 'KB Al Fatah Sidogede', 'OKU Timur', '2020-05-31', 'L', 'Sidogede', '1. Sudarsono   2. Muhayati', '085700000015', 'tidak_lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:19', '2026-08-22 09:14:30'),
(16, 17, 'ASYIFA UMI SABRINA', '1608034512190001', 'pas_foto/foto_asyifa_umi_sabrina_27xFLjF76LpqLpgG0Gla.jpg', 'KB Al Fatah Sidogede', 'OKU Timur', '2019-12-05', 'P', 'Sidogede', '1. Aris Wibowo   2. Feri Indriyani', '085700000016', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:19', '2026-08-22 09:14:05'),
(17, 18, 'AZWAN RAFASYA', '1608030101200001', 'pas_foto/foto_azwan_rafasya_n7G14GFJSyzHSabbt2Xi.jpg', 'KB Al Fatah Sidogede', 'OKU Timur', '2020-01-01', 'L', 'Sidogede', '1. Ariyandi Okta Wirnata   2. Rina Sunarti', '085700000017', 'lulus', 'menunggu_konfirmasi', 100000.00, 'pembayaran/mpPpnbHwwKsHwD1711Tbb3Rkc6YiGsSzEorC3mOu.png', NULL, '2026-08-22 09:09:19', '2026-08-22 18:58:55'),
(18, 19, 'ALFANIA LAYLA SYAKIRA RAMADHANI', '1608036704200001', 'pas_foto/foto_alfania_layla_syakira_VQQQdzQu6DKdVMrtFh4U.jpg', 'KB Al Fatah Sidogede', 'OKU Timur', '2020-04-27', 'P', 'Sidogede', '1. Ahmad Sarjono   2. Animawati', '085700000018', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:20', '2026-08-22 09:13:38'),
(19, 20, 'RIZKI MAULANA SAPUTRA', '1608030811190001', 'pas_foto/foto_rizki_maulana_saputra_orapcYr5O738YxXdXjr2.jpg', 'KB Al Fatah Sidogede', 'OKU Timur', '2019-11-08', 'L', 'Sidogede', '1. Yusuf   2. Anggi Larasati', '085700000019', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:20', '2026-08-22 09:15:35'),
(20, 21, 'AL KHAISYAN PUTRA PAMUNGKAS', '1608032009190001', 'pas_foto/foto_al_khaisyan_putra_JHD84lxpwOpp2MK17jwn.jpg', 'TK Mandiri Bangka', 'Bangka', '2019-09-20', 'L', 'Tanjung Raya', '1. Yogi   2. Nira', '085700000020', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:20', '2026-08-22 09:13:34'),
(21, 22, 'KMS. MUHAMMAD ROFIQ AL MAULIDY', '1608031111200001', 'pas_foto/foto_muhammad_rofiq_pUsK4HW83rSD8K8eMLDl.jpg', 'TK ABA Bedilan', 'OKU Timur', '2020-11-11', 'L', 'Jaya Bakti', '1. Kms. M. Andri Juwaidi, MARS   2. Atika Nur Maghfiroh', '085382006100', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:20', '2026-08-22 09:15:01'),
(22, 23, 'NAD NAZHIF FIKRI', '1608031612160001', 'pas_foto/foto_nad_nazhif_fikri_OOMymF6vABRI8HeAYbs5.jpg', 'SD IT Al-Inayah Lb. Harjo (Kls A)', 'OKU Timur', '2016-12-16', 'L', 'Lubuk Harjo', '1. Jazim Ryfai   2. Jumara Santi', '081273833076', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:21', '2026-08-22 09:15:19'),
(23, 24, 'ERINA RAYYA ASSYAUQIE', '1608035405200001', 'pas_foto/foto_erina_rayya_odgA86dHH4HLLJX3Sof5.jpg', 'TK ABA Harjowinangun', 'OKU Timur', '2020-05-14', 'P', 'Sidogede', '1. Tri Wahyudi   2. Lidya Sari', '085832411002', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:21', '2026-08-22 09:14:38'),
(24, 25, 'HAFIZ NUR RAHMAN', '1608030205200001', 'pas_foto/foto_hafiz_nur_rahman_GlWZCIC93TNHMseOlu11.jpg', '-', 'OKU Timur', '2020-05-02', 'L', 'Sidogede', '1. Eliyanto   2. Mei Rusmawati', '085793825789', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:21', '2026-08-22 09:14:45'),
(25, 26, 'SAFFANA NASHA FAWZIA', '1608036602200001', 'pas_foto/foto_saffana_nasha_MJ1uCiUfRzEaijsU36d6.jpg', 'TK Imam Bonjol Gumawang', 'OKU Timur', '2020-02-26', 'P', 'Sidogede', '1. Imam Ma\'ruf   2. Nur Aliyah Sya\'ban', '085244613234', 'menunggu_verifikasi', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:22', '2026-08-22 09:09:22'),
(26, 27, 'NOVAL DEVAN AT TAIMIFAH', '1608031410190001', 'pas_foto/foto_noval_devan_3cQymWNEqeBshl3SapGC.jpg', 'TK ABA Harjowinangun', 'OKU Timur', '2019-10-14', 'L', 'Sidogede', '1. Ahmad Abdullah Attaimifah   2. Ratna Juwita', '085789557448', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:22', '2026-08-22 09:15:32'),
(27, 28, 'ALYA DINDA KAMALA', '1608034502200001', 'pas_foto/foto_alya_dinda_kamala_jG7hzBffIwvxcKmcVo58.jpg', 'TK Al Hayati', 'OKU Timur', '2020-02-05', 'P', 'Harjowinangun', '1. Sugiantoro   2. Leniawati', '085700000027', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:22', '2026-08-22 09:13:45'),
(28, 29, 'MUHAIMIN AHMAD', '1608033011190001', 'pas_foto/foto_muhaimin_ahmad_vo6yVuRajrQK78k9Tx6E.jpg', '-', 'Palembang', '2019-11-30', 'L', 'Palembang - Gumawang', '1. Sakban   2. Seri Wahyuningsih', '085700000028', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:22', '2026-08-22 09:15:08'),
(29, 30, 'NARENDRA RAYYAN ATHA RAZKA', '1608031312190001', 'pas_foto/foto_narendra_rayyan_38cqky5dNxoumHb9Oteu.jpg', 'TK An Nur Sidogede', 'OKU Timur', '2019-12-13', 'L', 'Sidogede', '1. Muti M. Barok', '085700000029', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:23', '2026-08-22 09:15:23'),
(30, 31, 'MUHAMMAD HAIDAR EL FAYYADH', '1608032002200001', 'pas_foto/foto_haidar_el_fayyadh_TG4yqA1dTJxV20Ow62mm.jpg', 'TK IT An Nur Sidogede', 'OKU Timur', '2020-02-20', 'L', 'Sidogede', '1. Sakti Aji Wijaya   2. Hesti Setiyani', '085700000030', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:23', '2026-08-22 09:15:11'),
(31, 32, 'KEYLA ZEA FANISA', '1608037004200001', 'pas_foto/foto_keyla_zea_fanisa_6BIEq3ckJfMlLXMY0m1O.jpg', 'TK IT An Nur Sidogede', 'OKU Timur', '2020-04-30', 'P', 'Sidogede', '1. Heru Marjono   2. Anisa Lutfiandari', '085700000031', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:23', '2026-08-22 09:14:57'),
(32, 33, 'AKBAR RAIZ', '1608032504200001', 'pas_foto/foto_akbar_raiz_2LFdlPPpp3fJIri615Di.jpg', 'TK IT An Nur Sidogede', 'OKU Timur', '2020-04-25', 'L', 'Sidogede', '1. Hisam Ashari   2. Ni\'mah Novita', '08131800299', 'menunggu_verifikasi', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:24', '2026-08-22 18:48:17'),
(33, 34, 'AZKA ARTANABIL', '1608031403200001', 'pas_foto/foto_azka_artanabil_KCEzmVUzGf7iHMHwL2S5.jpg', 'TK Imam Bonjol', 'OKU Timur', '2020-03-14', 'L', 'Sidogede', '1. Juli Susianto   2. Erwiyanti', '085700000033', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:24', '2026-08-22 09:14:09'),
(34, 35, 'NAZRIL MUDZDZAFAR', '1608032206200001', 'pas_foto/foto_nazril_mudzdzafar_If0ktiZF1hy9t3FJqerb.jpg', '-', 'OKU Timur', '2020-06-22', 'L', 'Bedilan', '1. Wagiman   2. Erriya', '085700000034', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:24', '2026-08-22 09:15:27'),
(35, 36, 'ZIRIS HAIDAR ALEXI', '1608030309200001', 'pas_foto/foto_ziris_haidar_alexi_qcJLi1xuOiGqjvOE5tR9.jpg', 'RA Karang Endah', 'OKU Timur', '2020-09-03', 'L', 'Karang Endah', '1. Hardimansyah   2. Jumirah', '085700000035', 'menunggu_verifikasi', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:25', '2026-08-22 09:09:25'),
(36, 37, 'CITRA SYAKIRA', '1608034102200001', 'pas_foto/foto_citra_syakira_9uWPWK55qBR17XYW1T7F.jpg', 'TK ABA Harjowinangun', 'OKU Timur', '2020-02-01', 'P', 'Sidogede', '1. Habibi   2. Sri Lestari', '085700000036', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:25', '2026-08-22 09:14:34'),
(37, 38, 'VEZIA ALMECA NAZA', '1608034311190001', 'pas_foto/foto_vezia_almeca_naza_20KlEx5C8rKI2aElhHuH.jpg', 'SDN Bedilan (Kls 2)', 'OKU Timur', '2019-11-03', 'P', 'Bedilan', '1. Hasan Zaenal Abidin   2. Istiana', '085700000037', 'menunggu_verifikasi', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:25', '2026-08-22 09:09:25'),
(38, 39, 'FEBRIAN SYAHPUTRA', '1608031402190001', 'pas_foto/foto_febrian_syahputra_TuZC51WRShQ1BBrbQoFS.jpg', 'SDN Jakarta Pusat (Kls 3)', 'Jakarta', '2019-02-14', 'L', '-', '1. Irpan Maulana   2. Nadhotul Umamah', '085700000038', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:26', '2026-08-22 09:14:41'),
(39, 40, 'MUHAMMAD ZAIN ALFATIH', '1608032604160001', 'pas_foto/foto_muhammad_zain_alfatih_VH22VJZtFjKUXIVF9NHN.jpg', '(Kls 4)', 'OKU Timur', '2016-04-26', 'L', 'Sidogede', '1. Tauhidin   2. Siti Masuroh', '085700000039', 'lulus', 'belum_bayar', 0.00, NULL, NULL, '2026-08-22 09:09:26', '2026-08-22 09:15:14');

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
(1, 1, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 07:53:06', '2026-08-22 08:16:21'),
(2, 6, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 08:46:29', '2026-08-22 08:46:29'),
(3, 2, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 08:46:32', '2026-08-22 08:46:32'),
(4, 3, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 08:46:35', '2026-08-22 08:46:35'),
(5, 4, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 08:46:44', '2026-08-22 08:46:44'),
(6, 5, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 08:46:48', '2026-08-22 08:46:48'),
(7, 10, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:13:13', '2026-08-22 09:13:13'),
(8, 13, 1, 'tidak_lulus', 'Status diperbarui dari menu Pengumuman pada 23/8/2026', '2026-08-22 09:13:24', '2026-08-22 18:48:08'),
(9, 32, 1, 'proses', 'Status diperbarui dari menu Pengumuman pada 23/8/2026', '2026-08-22 09:13:30', '2026-08-22 18:48:17'),
(10, 20, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:13:34', '2026-08-22 09:13:34'),
(11, 18, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:13:38', '2026-08-22 09:13:38'),
(12, 14, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:13:42', '2026-08-22 09:13:42'),
(13, 27, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:13:45', '2026-08-22 09:13:45'),
(14, 12, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:13:49', '2026-08-22 09:13:49'),
(15, 16, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:14:05', '2026-08-22 09:14:05'),
(16, 33, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:14:09', '2026-08-22 09:14:09'),
(17, 17, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:14:13', '2026-08-22 09:14:13'),
(18, 15, 1, 'tidak_lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:14:25', '2026-08-22 09:14:30'),
(19, 36, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:14:34', '2026-08-22 09:14:34'),
(20, 23, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:14:38', '2026-08-22 09:14:38'),
(21, 38, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:14:41', '2026-08-22 09:14:41'),
(22, 24, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:14:45', '2026-08-22 09:14:45'),
(23, 8, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:14:49', '2026-08-22 09:14:49'),
(24, 9, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:14:53', '2026-08-22 09:14:53'),
(25, 31, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:14:57', '2026-08-22 09:14:57'),
(26, 21, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:15:01', '2026-08-22 09:15:01'),
(27, 11, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:15:04', '2026-08-22 09:15:04'),
(28, 28, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:15:08', '2026-08-22 09:15:08'),
(29, 30, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:15:11', '2026-08-22 09:15:11'),
(30, 39, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:15:14', '2026-08-22 09:15:14'),
(31, 22, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:15:19', '2026-08-22 09:15:19'),
(32, 29, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:15:23', '2026-08-22 09:15:23'),
(33, 34, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:15:27', '2026-08-22 09:15:27'),
(34, 26, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:15:31', '2026-08-22 09:15:31'),
(35, 19, 1, 'lulus', 'Status diperbarui dari menu Pengumuman pada 22/8/2026', '2026-08-22 09:15:35', '2026-08-22 09:15:35');

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
('9p8G0SrTSzI8Hf0V7J1Abh1b4Gofku7C0kvSL8hL', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJ5dE9FbFNaSXRBU2RtemVwNDdGbFcyM29hY2JnOUkzTXRjVE5mWFAxIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119LCJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI6MX0=', 1787450383),
('KfeEAi1PJ8XWmRmeDR5V8GQlcbFVpQKNmcAR1KAT', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJSeEsybGhKY1I3bTlTWmhxU080WWlXZ1NLSjYxUkh6ak1kSUIxZ0tJIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX0sImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjoxfQ==', 1787464615),
('sJ0WE3vgYx8Lqfe0139lmxMZWlG3Lc6xspsFbKDT', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJMSTlkdW0xcWNDWTg0VFRtWWJGOUxKWVFVTlQzYjhDY1JuQjV2N2hsIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787464547);

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
(1, 'Sahroni-Admin', 'sahronibelitang075@gmail.com', '2026-06-21 21:16:09', '$2y$12$kqoHYuVOqyGjH0TAkhABGe5uNX9wgdlGZ.5stqU.pVSvuazq.WTQe', 'admin', NULL, NULL, 'JHg9TetwkrKuFPy2w81hyQz2O7y2ZGTyOsJuKahXKIKSBwfnMsgBUcUPfDFp', '2026-06-21 21:16:09', '2026-08-22 07:06:28', 'profile-photos/15ZWh7JYXXJSGODrcgjsDI71u0KwT57HcgaNVSsk.jpg'),
(2, 'Atha Rayhaan Shakeil', 'wadi07578@gmail.com', '2026-08-22 07:18:46', '$2y$12$bt/YUeBSwiDuQFwmkLKvG.XKvbmKW7IO4uiBKBybdEvrbj5sgDRui', 'siswa', NULL, NULL, NULL, '2026-08-22 07:18:00', '2026-08-22 07:18:46', NULL),
(3, 'Azzahra Salsabila', 'azzahrasalsabila@gmail.com', '2026-08-22 08:41:00', '$2y$12$bcNaJpsIdWB69Ygu7G9qIO5R2v/47i9t20yXdMLCg21iYWmi9tqnK', 'siswa', NULL, NULL, NULL, '2026-08-22 08:41:00', '2026-08-22 08:41:00', NULL),
(4, 'Keysha Al-Khanza', 'keyshaalkhanza@gmail.com', '2026-08-22 08:41:01', '$2y$12$an8JaMkM4Ayn6ouD7Zvqf.BUe9U9FSyPXshFOcl5M4oMCqeogzRWC', 'siswa', NULL, NULL, NULL, '2026-08-22 08:41:01', '2026-08-22 08:41:01', NULL),
(5, 'Nadhira Rahma Falisha', 'nadhirarahmafalisha@gmail.com', '2026-08-22 08:41:01', '$2y$12$ErEdfzQW7zis0ggnuUzQcOzXD2RN8lVI6.tzyLhzjdunJjxQRCSf.', 'siswa', NULL, NULL, NULL, '2026-08-22 08:41:01', '2026-08-22 08:41:01', NULL),
(6, 'Zaidan Syafiq Ardiaz', 'zaidansyafiqardiaz@gmail.com', '2026-08-22 08:41:02', '$2y$12$EKpKK288TwFzbzAyqFRqt.JJbPMUunPI8Bt483THS1a.QzLMUHQeS', 'siswa', NULL, NULL, NULL, '2026-08-22 08:41:02', '2026-08-22 08:41:02', NULL),
(7, 'Arsya Maulana Romadhan', 'arsyamaulanaromadhan@gmail.com', '2026-08-22 08:41:02', '$2y$12$epq5yStb1xe33ajMT4iB1O8UKStXukls4Unv.82Wxk9OrL9EgOH1G', 'siswa', NULL, NULL, NULL, '2026-08-22 08:41:02', '2026-08-22 08:41:02', NULL),
(8, 'Salsa Kirana Zahrani', 'salsakiranazahrani@gmail.com', '2026-08-22 09:09:16', '$2y$12$VSmShYX/eevM3DouJctxk.cPX/yZhV063eOjgeJ04q.5j5k5d54tm', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:16', '2026-08-22 09:09:16', NULL),
(9, 'Husna Ayunindya', 'husnaayunindya@gmail.com', '2026-08-22 09:09:16', '$2y$12$3mDsaqY5htp90.2e6nMeluUX3agDfW7/Jy.gwr60uzZonNB9ZfdEq', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:16', '2026-08-22 09:09:16', NULL),
(10, 'Karel Al Sadad', 'karelalsadad@gmail.com', '2026-08-22 09:09:17', '$2y$12$OX8RJxdSWKkKswnAJ66LNOeM6Li62H29lcLJsMmSYvFUpZ5M2seCO', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:17', '2026-08-22 09:09:17', NULL),
(11, 'Afifa Titiya', 'afifatitiya@gmail.com', '2026-08-22 09:09:17', '$2y$12$geWQShb1tvKabpdDG84W1enw7mxEnry4GMFlnOHwdj2tEEDBFBx5y', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:17', '2026-08-22 09:09:17', NULL),
(12, 'M. Syailendra Dirga Vernando', 'syailendradirga@gmail.com', '2026-08-22 09:09:18', '$2y$12$ZLZ2/vYJuJO6//dyZPTW5uBx23doj6IYjzGmy5np3nQERirlC2xKC', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:18', '2026-08-22 09:09:18', NULL),
(13, 'Angga Wijaya', 'anggawijaya@gmail.com', '2026-08-22 09:09:18', '$2y$12$UDc.e6sw9t43QX2hDxk9DOd5qMH2BUGdtFKhOPCL7FuqSHTJNavpa', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:18', '2026-08-22 09:09:18', NULL),
(14, 'Aisyah', 'aisyah.spmb26@gmail.com', '2026-08-22 09:09:18', '$2y$12$NkLyOCfZPhdck41cC.Hk9.f57L1uQVV1GFGNneGq5LpwaHdDv.7Ea', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:18', '2026-08-22 09:09:18', NULL),
(15, 'Alifa Azzalia', 'alifaazzalia@gmail.com', '2026-08-22 09:09:18', '$2y$12$ZGoBmyuocEdw3WMT1W3gwOYBQ8ocs2.n4hu2kGCNPvtUVw05w9HtO', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:18', '2026-08-22 09:09:18', NULL),
(16, 'Bilal Al Rasyid', 'bilalalrasyid@gmail.com', '2026-08-22 09:09:19', '$2y$12$O2RTmknSKbvdtg38FH0iXuWb3aJToyVH05NjoDrLbpW4PD6WvyLEe', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:19', '2026-08-22 09:09:19', NULL),
(17, 'Asyifa Umi Sabrina', 'asyifaumisabrina@gmail.com', '2026-08-22 09:09:19', '$2y$12$.mnuY7Zn85TuiaGuOWxyVux8JkO7wHgDB8HLEgMNGHGWtjbJTuCP2', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:19', '2026-08-22 09:09:19', NULL),
(18, 'Azwan Rafasya', 'azwanrafasya@gmail.com', '2026-08-22 09:09:19', '$2y$12$5MLDG8c7C.eAR5NZOfIlmeOA5Zx2dPpxh/B6UOp11WHHOVmYjHnum', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:19', '2026-08-22 09:09:19', NULL),
(19, 'Alfania Layla Syakira Ramadhani', 'alfanialaylasyakira@gmail.com', '2026-08-22 09:09:20', '$2y$12$Q4tWZ4PftUX6.PsZT9hOv.I4C3oUTBLnqR2YqB6l.T8MpP7Y8ssd.', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:20', '2026-08-22 09:09:20', NULL),
(20, 'Rizki Maulana Saputra', 'rizkimaulanasaputra@gmail.com', '2026-08-22 09:09:20', '$2y$12$j4Wwd4FLhxcgKnsoCR3DduVE3yKylMug9Zzc6czAZg7rkpI889Bbi', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:20', '2026-08-22 09:09:20', NULL),
(21, 'Al Khaisyan Putra Pamungkas', 'alkhaisyanputra@gmail.com', '2026-08-22 09:09:20', '$2y$12$ek2VwhL4Xi0eafOH.8MiaOABoKst3Xy0oTkyu0vy8wPgfcT4eeQRO', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:20', '2026-08-22 09:09:20', NULL),
(22, 'Kms. Muhammad Rofiq Al Maulidy', 'muhammadrofiq20@gmail.com', '2026-08-22 09:09:20', '$2y$12$Q6L993KivGXnEgf7MWf3auKJje0gNEhukH5Nfb4n9uvFHIixKswrm', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:20', '2026-08-22 09:09:20', NULL),
(23, 'Nad Nazhif Fikri', 'nadnazhiffikri@gmail.com', '2026-08-22 09:09:21', '$2y$12$cjut4tp36QCRvj6h8nN9Yu/y2Thr2sMrHATHz8nhr/ZpBif27XNKa', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:21', '2026-08-22 09:09:21', NULL),
(24, 'Erina Rayya Assyauqie', 'erinarayyaassyauqie@gmail.com', '2026-08-22 09:09:21', '$2y$12$bkmd5/82KY4jm17rtcMML.jS8cAb0sGBnF.DkZbpomcM3YlYtdW5y', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:21', '2026-08-22 09:09:21', NULL),
(25, 'Hafiz Nur Rahman', 'hafiznurrahman@gmail.com', '2026-08-22 09:09:21', '$2y$12$wBAKyzM2yAegvWWdJbtWve8Taz5cWVr7.2Cq0X9NFHO8xEIsmpDh2', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:21', '2026-08-22 09:09:21', NULL),
(26, 'Saffana Nasha Fawzia', 'saffananashafawzia@gmail.com', '2026-08-22 09:09:22', '$2y$12$3q62smvyZ6QO5cCnvIAA4eZNVQnW/VcvRDGkXHBTfzKaL7LXr9FIS', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:22', '2026-08-22 09:09:22', NULL),
(27, 'Noval Devan At Taimifah', 'novaldevanattaimifah@gmail.com', '2026-08-22 09:09:22', '$2y$12$AemvchbgLT8YFXrY1ykHfOTayNlYXgm3C/j9GuuJ5HEKHcT80XT/6', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:22', '2026-08-22 09:09:22', NULL),
(28, 'Alya Dinda Kamala', 'alyadindakamala@gmail.com', '2026-08-22 09:09:22', '$2y$12$8Yt5zvoXGtZbMAoFOBtqoeP.BmIHQW1yTeYXTprWO3BwIRBuYMP0K', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:22', '2026-08-22 09:09:22', NULL),
(29, 'Muhaimin Ahmad', 'muhaiminahmad@gmail.com', '2026-08-22 09:09:22', '$2y$12$AUzPDRwnrale/.zA6yppf./aTZlUsNc/7yESTkxHFtVeBAjHLSbKS', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:22', '2026-08-22 09:09:22', NULL),
(30, 'Narendra Rayyan Atha Razka', 'narendrarayyan@gmail.com', '2026-08-22 09:09:23', '$2y$12$ETOg.gYD7JypEY4dGVzAnOnj9OgcqE9Q3CBFiooTXjb5iFN7AnLhm', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:23', '2026-08-22 09:09:23', NULL),
(31, 'Muhammad Haidar El Fayyadh', 'haidarelfayyadh@gmail.com', '2026-08-22 09:09:23', '$2y$12$kPfGoyroydhJN2K38EInKeq09DXekAMbfeudaa..WEhxRGRvylRzm', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:23', '2026-08-22 09:09:23', NULL),
(32, 'Keyla Zea Fanisa', 'keylazeafanisa@gmail.com', '2026-08-22 09:09:23', '$2y$12$UFLxdjBkHVNJlxuxIqP3mu4NhKTM/YG154EteW87mi7.QbRfOfL1q', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:23', '2026-08-22 09:09:23', NULL),
(33, 'Akbar Raiz', 'akbarraiz@gmail.com', '2026-08-22 09:09:24', '$2y$12$OodqridwqQmih6lx3VQ9xu9Gs3Xv7.PaSMtQdE0HkPFtshJdDENUS', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:24', '2026-08-22 09:09:24', NULL),
(34, 'Azka Artanabil', 'azkaartanabil@gmail.com', '2026-08-22 09:09:24', '$2y$12$a/9nNAJz.2ERcqZFVrZd5O/Y56kZvah2ovLokVCOq4bnIHbWqm/ki', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:24', '2026-08-22 09:09:24', NULL),
(35, 'Nazril Mudzdzafar', 'nazrilmudzdzafar@gmail.com', '2026-08-22 09:09:24', '$2y$12$ZJrPN4hAb2.8NHfsWK6BYu6mHK/XnK46gI21DbiPrJ5zq0Zsz3M/O', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:24', '2026-08-22 09:09:24', NULL),
(36, 'Ziris Haidar Alexi', 'zirishaidaralexi@gmail.com', '2026-08-22 09:09:25', '$2y$12$HVugQ4MIkNsURwXJbI4kOe5.Ha0zPzBhBV4ZLjJRm76vO6wwC/suu', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:25', '2026-08-22 09:09:25', NULL),
(37, 'Citra Syakira', 'citrasyakira@gmail.com', '2026-08-22 09:09:25', '$2y$12$iR/SVmtXbD3a5LffONHJK.L08VdInBftJRdQ3TC9eLYvBA5K5jC.K', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:25', '2026-08-22 09:09:25', NULL),
(38, 'Vezia Almeca Naza', 'veziaalmecanaza@gmail.com', '2026-08-22 09:09:25', '$2y$12$OzHz/DUQ8MmNU7UoPSENFuXWtKhWvrxEUY9IRP99wkUqbGENO3HUe', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:25', '2026-08-22 09:09:25', NULL),
(39, 'Febrian Syahputra', 'febriansyahputra@gmail.com', '2026-08-22 09:09:26', '$2y$12$W9oVwsgy5AjILmYmWpMtNuVX9Zvvc2CpY.rst5qH6jBGrBn1O8foK', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:26', '2026-08-22 09:09:26', NULL),
(40, 'Muhammad Zain Alfatih', 'muhammadzainalfatih@gmail.com', '2026-08-22 09:09:26', '$2y$12$.aY0iyO3XDCUsQVJ0.pZA.yPUdv3HBIHXxylwEW4/tmBWRVuj7G9C', 'siswa', NULL, NULL, NULL, '2026-08-22 09:09:26', '2026-08-22 09:09:26', NULL);

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
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT untuk tabel `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT untuk tabel `notifikasis`
--
ALTER TABLE `notifikasis`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=202;

--
-- AUTO_INCREMENT untuk tabel `pembayarans`
--
ALTER TABLE `pembayarans`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `pendaftarans`
--
ALTER TABLE `pendaftarans`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

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
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT untuk tabel `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

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
