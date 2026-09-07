import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PeriodeFilterBar from '@/Components/PeriodeFilterBar';

gsap.registerPlugin(ScrollTrigger);

const QUICK_BIODATA_TEMPLATES = [
    {
        title: '🔢 NIK Kurang / Salah',
        text: 'Nomor NIK yang dimasukkan belum valid atau tidak berjumlah 16 digit. Mohon periksa kembali Kartu Keluarga / Akta Kelahiran dan perbarui NIK pada menu Formulir Pendaftaran.',
    },
    {
        title: '📝 Nama / TTL Typo',
        text: 'Terdapat kesalahan penulisan pada nama lengkap atau tempat/tanggal lahir calon siswa. Mohon perbaiki formulir agar sesuai persis dengan Akta Kelahiran.',
    },
    {
        title: '🏠 Alamat Belum Lengkap',
        text: 'Alamat domisili tempat tinggal belum lengkap (RT/RW, Dusun, Desa/Kelurahan, Kecamatan). Mohon perbarui alamat secara jelas dan lengkap.',
    },
    {
        title: '📞 No HP / WA Tidak Aktif',
        text: 'Nomor WhatsApp wali yang dicantumkan salah atau tidak aktif. Mohon perbarui dengan nomor WhatsApp aktif untuk keperluan informasi resmi sekolah.',
    },
];

export default function AdminDataPendaftar({ pendaftarans, filters, periodes = [], selectedPeriodeId = null, flash_status, flash_error }) {
    const { user } = usePage().props.auth;
    const isKepalaSekolah = user?.role === 'kepala_sekolah';

    const [search, setSearch] = useState(filters?.search || '');
    const [gender, setGender] = useState(filters?.gender || '');

    // State Modal Detail
    const [detailPendaftar, setDetailPendaftar] = useState(null);

    // State Modal Edit Data
    const [editPendaftar, setEditPendaftar] = useState(null);
    const [editForm, setEditForm] = useState({
        nama_lengkap: '',
        nik: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: 'L',
        asal_sekolah: '',
        nama_orang_tua: '',
        no_hp_wali: '',
        alamat: '',
    });
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    // State Modal Kirim Notifikasi Perbaikan Biodata
    const [notifPendaftar, setNotifPendaftar] = useState(null);
    const [notifMessage, setNotifMessage] = useState('');
    const [notifSendWa, setNotifSendWa] = useState(true);
    const [isSendingNotif, setIsSendingNotif] = useState(false);

    const handleFilter = () => {
        router.get(route('data-pendaftar.index'), {
            search: search || undefined,
            gender: gender || undefined,
        }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearch('');
        setGender('');
        router.get(route('data-pendaftar.index'), {}, { preserveState: true, replace: true });
    };

    // ── Helper: Kalkulasi Usia ──────────────────────────────────────────────
    const calculateAge = (birthDateString) => {
        if (!birthDateString) return '-';
        const birthDate = new Date(birthDateString);
        if (isNaN(birthDate)) return '-';
        const today = new Date();

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();

        if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
            years--;
            months += 12;
        }
        if (today.getDate() < birthDate.getDate()) {
            months--;
            if (months < 0) {
                months += 12;
                years--;
            }
        }

        if (years <= 0 && months <= 0) return '< 1 bln';
        if (years <= 0) return `${months} bln`;
        if (months === 0) return `${years} thn`;
        return `${years} thn ${months} bln`;
    };

    // ── Buka Modal Edit ─────────────────────────────────────────────────────
    const openEditModal = (p) => {
        setEditPendaftar(p);
        setEditForm({
            nama_lengkap: p.nama_lengkap || '',
            nik: p.nik || '',
            tempat_lahir: p.tempat_lahir || '',
            tanggal_lahir: p.tanggal_lahir ? p.tanggal_lahir.substring(0, 10) : '',
            jenis_kelamin: p.jenis_kelamin || 'L',
            asal_sekolah: p.asal_sekolah || '',
            nama_orang_tua: p.nama_orang_tua || '',
            no_hp_wali: p.no_hp_wali || '',
            alamat: p.alamat || '',
        });
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        if (!editPendaftar) return;

        if (editForm.nik.length !== 16) {
            Swal.fire({
                icon: 'warning',
                title: 'NIK Tidak Valid',
                text: 'Nomor Induk Kependudukan (NIK) harus terdiri dari tepat 16 digit angka.',
                confirmButtonColor: '#059669',
            });
            return;
        }

        setIsSavingEdit(true);

        router.post(
            route('data-pendaftar.update', editPendaftar.id),
            editForm,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEditPendaftar(null);
                    Swal.fire({
                        icon: 'success',
                        title: 'Biodata Disimpan!',
                        text: 'Data pendaftar berhasil diperbarui. Notifikasi telah dikirim ke akun calon siswa.',
                        timer: 3000,
                        showConfirmButton: false,
                        toast: true,
                        position: 'top-end',
                    });
                },
                onError: (errors) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal Menyimpan',
                        text: Object.values(errors)[0] || 'Terjadi kesalahan saat memperbarui data.',
                        confirmButtonColor: '#059669',
                    });
                },
                onFinish: () => setIsSavingEdit(false),
            }
        );
    };

    // ── Buka Modal Notifikasi ───────────────────────────────────────────────
    const openNotifModal = (p) => {
        setNotifPendaftar(p);
        setNotifMessage('');
        setNotifSendWa(!!p.no_hp_wali);
    };

    const handleSendNotification = (e) => {
        e.preventDefault();
        if (!notifPendaftar) return;

        if (!notifMessage.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Pesan Belum Diisi',
                text: 'Harap masukkan instruksi atau alasan pembaruan biodata untuk calon siswa.',
                confirmButtonColor: '#059669',
            });
            return;
        }

        setIsSendingNotif(true);

        router.post(
            route('data-pendaftar.kirim-notifikasi', notifPendaftar.id),
            {
                pesan: notifMessage,
                kirim_wa: notifSendWa,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setNotifPendaftar(null);
                    Swal.fire({
                        icon: 'success',
                        title: 'Notifikasi Terkirim!',
                        text: 'Pemberitahuan perbaikan biodata berhasil masuk ke lonceng notifikasi akun siswa' + (notifSendWa ? ' dan WhatsApp wali.' : '.'),
                        timer: 3500,
                        showConfirmButton: false,
                        toast: true,
                        position: 'top-end',
                    });
                },
                onError: (errors) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal Mengirim',
                        text: Object.values(errors)[0] || 'Terjadi kesalahan saat mengirim notifikasi.',
                        confirmButtonColor: '#059669',
                    });
                },
                onFinish: () => setIsSendingNotif(false),
            }
        );
    };

    const data = pendaftarans?.data || [];
    const links = pendaftarans?.links || [];

    // Hitung Stats
    const totalSiswa = pendaftarans?.total || data.length;
    const totalLaki = data.filter(p => p.jenis_kelamin === 'L').length;
    const totalPerempuan = data.filter(p => p.jenis_kelamin === 'P').length;

    useEffect(() => {
        if (flash_error) {
            Swal.fire({
                icon: 'error',
                title: 'Pemberitahuan',
                text: flash_error,
                confirmButtonColor: '#059669',
            });
        }

        const animations = [
            { class: '.gsap-fade-up', vars: { y: 60 } },
            { class: '.gsap-fade-down', vars: { y: -60 } },
            { class: '.gsap-fade-right', vars: { x: -60 } },
            { class: '.gsap-fade-left', vars: { x: 60 } },
        ];
        animations.forEach(({ class: className, vars }) => {
            gsap.utils.toArray(className).forEach((el) => {
                gsap.fromTo(el,
                    { ...vars, opacity: 0 },
                    { x: 0, y: 0, opacity: 1, duration: 1.5, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' } }
                );
            });
        });
        gsap.utils.toArray('.gsap-stagger-container').forEach((container) => {
            const items = container.querySelectorAll('.gsap-stagger-item');
            gsap.fromTo(items,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, stagger: 0.25, ease: 'power3.out', scrollTrigger: { trigger: container, start: 'top 85%', toggleActions: 'play none none none' } }
            );
        });
    }, [flash_error]);

    return (
        <AuthenticatedLayout header="Data Pendaftar">
            <Head title="Data Pendaftar" />

            <div className="space-y-6">
                {/* Filter Periode */}
                <PeriodeFilterBar
                    periodes={periodes}
                    selectedPeriode={selectedPeriodeId}
                    routeName="data-pendaftar.index"
                    extraParams={{ search: filters?.search, gender: filters?.gender }}
                />

                {/* Banner Mode Pengawas (Kepala Sekolah) */}
                {isKepalaSekolah && (
                    <div className="flex items-center justify-between p-4 bg-amber-50 border-l-4 border-amber-500 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-amber-100 text-amber-800 rounded-xl text-lg font-bold">🛡️</span>
                            <div>
                                <h4 className="text-sm font-extrabold text-amber-950">Mode Pengawas: Data Pendaftar (Read-Only)</h4>
                                <p className="text-xs text-amber-800 font-medium mt-0.5">
                                    Hak akses Anda bersifat memantau dan mengaudit biodata calon murid. Aksi edit data dan pengiriman notifikasi hanya dapat diproses oleh Administrator.
                                </p>
                            </div>
                        </div>
                        <span className="hidden sm:inline-flex text-[11px] font-extrabold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-3 py-1 rounded-full">
                            Read-Only Active
                        </span>
                    </div>
                )}

                {/* Flash Success Message */}
                {flash_status && (
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-5 py-4 text-sm font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <svg className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{flash_status}</span>
                    </div>
                )}

                {/* Stats Summary */}
                <div className="grid gap-4 sm:grid-cols-3 gsap-stagger-container">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 gsap-stagger-item shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Terdaftar</span>
                        <p className="mt-1 text-3xl font-black text-slate-900 dark:text-white">{totalSiswa}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 gsap-stagger-item shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Laki-Laki (L)</span>
                        <p className="mt-1 text-3xl font-black text-cyan-600 dark:text-cyan-400">{totalLaki}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 gsap-stagger-item shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Perempuan (P)</span>
                        <p className="mt-1 text-3xl font-black text-pink-600 dark:text-pink-400">{totalPerempuan}</p>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 gsap-fade-down shadow-sm">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Cari Nama / NIK / Kontak</label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                placeholder="Ketik nama, NIK, atau nomor WA..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Jenis Kelamin</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                            >
                                <option value="">Semua Jenis Kelamin</option>
                                <option value="L">Laki-laki (L)</option>
                                <option value="P">Perempuan (P)</option>
                            </select>
                        </div>
                        <div className="flex items-end gap-2">
                            <button
                                onClick={handleFilter}
                                className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700 transition-colors"
                            >
                                Filter
                            </button>
                            <button
                                onClick={handleReset}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 overflow-hidden gsap-fade-up shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80">
                                    <th className="px-4 py-4 text-center text-xs font-extrabold uppercase tracking-widest text-slate-500">No</th>
                                    <th className="px-4 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">Calon Siswa</th>
                                    <th className="px-4 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">TTL & Usia</th>
                                    <th className="px-4 py-4 text-center text-xs font-extrabold uppercase tracking-widest text-slate-500">JK</th>
                                    <th className="px-4 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">Asal TK/RA</th>
                                    <th className="px-4 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">Orang Tua / Wali</th>
                                    <th className="px-4 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">Alamat Domisili</th>
                                    <th className="px-4 py-4 text-center text-xs font-extrabold uppercase tracking-widest text-slate-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-slate-400 font-medium">
                                            Belum ada data pendaftar yang sesuai filter.
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((p, idx) => {
                                        const ageStr = calculateAge(p.tanggal_lahir);
                                        const tglLahirFormatted = p.tanggal_lahir
                                            ? new Date(p.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                                            : '-';

                                        return (
                                            <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                                {/* No */}
                                                <td className="px-4 py-4 text-center font-bold text-slate-500 text-xs">
                                                    {(pendaftarans.current_page - 1) * pendaftarans.per_page + idx + 1}
                                                </td>

                                                {/* Calon Siswa (Foto + Nama + NIK + Email) */}
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {p.pas_foto_path ? (
                                                            <img
                                                                src={`/storage/${p.pas_foto_path}`}
                                                                alt={p.nama_lengkap}
                                                                className="h-11 w-11 shrink-0 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                                                            />
                                                        ) : (
                                                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-extrabold text-sm ${
                                                                p.jenis_kelamin === 'P'
                                                                    ? 'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-400'
                                                                    : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400'
                                                            }`}>
                                                                {p.nama_lengkap ? p.nama_lengkap.charAt(0).toUpperCase() : '?'}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <span className="font-extrabold text-slate-900 dark:text-white block leading-tight">
                                                                {p.nama_lengkap}
                                                            </span>
                                                            <div className="flex items-center gap-1.5 mt-1">
                                                                <span className="inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                                    NIK: {p.nik || '-'}
                                                                </span>
                                                            </div>
                                                            {p.user?.email && (
                                                                <span className="text-[11px] text-slate-400 block mt-0.5">
                                                                    {p.user.email}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* TTL & Usia */}
                                                <td className="px-4 py-4">
                                                    <div className="text-xs">
                                                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                                                            {p.tempat_lahir || '-'}, {tglLahirFormatted}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 mt-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                                            🎂 {ageStr}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* JK */}
                                                <td className="px-4 py-4 text-center">
                                                    <span className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-xs font-black ${
                                                        p.jenis_kelamin === 'P'
                                                            ? 'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-400'
                                                            : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400'
                                                    }`}>
                                                        {p.jenis_kelamin === 'P' ? 'P' : 'L'}
                                                    </span>
                                                </td>

                                                {/* Asal TK/RA */}
                                                <td className="px-4 py-4">
                                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                        {p.asal_sekolah || '-'}
                                                    </span>
                                                </td>

                                                {/* Orang Tua & WA */}
                                                <td className="px-4 py-4">
                                                    <div className="text-xs">
                                                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                                                            {p.nama_orang_tua || '-'}
                                                        </span>
                                                        {p.no_hp_wali ? (
                                                            <a
                                                                href={`https://wa.me/${p.no_hp_wali.replace(/\D/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(`Assalamu'alaikum Yth. Wali dari ${p.nama_lengkap}, kami dari Panitia SPMB MI Nurussalam.`)}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 mt-0.5 transition-colors"
                                                                title="Kirim Pesan WhatsApp"
                                                            >
                                                                <svg className="h-3 w-3 fill-emerald-500" viewBox="0 0 24 24">
                                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                                                                </svg>
                                                                <span>{p.no_hp_wali}</span>
                                                            </a>
                                                        ) : (
                                                            <span className="text-[11px] text-slate-400">-</span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Alamat */}
                                                <td className="px-4 py-4 max-w-xs">
                                                    <span className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2" title={p.alamat || '-'}>
                                                        {p.alamat || '-'}
                                                    </span>
                                                </td>

                                                {/* Aksi */}
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                         {/* Detail */}
                                                        <button
                                                            type="button"
                                                            onClick={() => setDetailPendaftar(p)}
                                                            className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                                                            title="Lihat Detail Lengkap Biodata"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                            </svg>
                                                        </button>

                                                        {!isKepalaSekolah && (
                                                            <>
                                                                {/* Edit */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openEditModal(p)}
                                                                    className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition-all active:scale-95"
                                                                    title="Edit / Koreksi Biodata"
                                                                >
                                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                                    </svg>
                                                                </button>

                                                                {/* Notifikasi Minta Perbarui */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openNotifModal(p)}
                                                                    className="rounded-lg bg-amber-50 p-2 text-amber-600 hover:bg-amber-500 hover:text-white dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-600 dark:hover:text-white transition-all active:scale-95"
                                                                    title="Kirim Notifikasi Perbarui Biodata ke Siswa"
                                                                >
                                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                                                    </svg>
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3 dark:border-slate-800 dark:bg-slate-900">
                            <span className="text-xs font-bold text-slate-500">
                                Menampilkan {pendaftarans.from || 0} - {pendaftarans.to || 0} dari {pendaftarans.total} data
                            </span>
                            <div className="flex gap-1">
                                {links.map((link, i) => (
                                    <button
                                        key={i}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        disabled={!link.url}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                                            link.active
                                                ? 'bg-emerald-600 text-white'
                                                : link.url
                                                    ? 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'
                                                    : 'text-slate-300 cursor-not-allowed dark:text-slate-700'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── MODAL 1: Detail Lengkap Biodata ───────────────────────────────── */}
            {detailPendaftar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-950 shadow-2xl animate-in fade-in zoom-in duration-150">
                        {/* Header Modal */}
                        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-850 pb-5">
                            <div className="flex items-center gap-4">
                                {detailPendaftar.pas_foto_path ? (
                                    <img
                                        src={`/storage/${detailPendaftar.pas_foto_path}`}
                                        alt={detailPendaftar.nama_lengkap}
                                        className="h-16 w-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-md"
                                    />
                                ) : (
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 font-black text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 text-xl">
                                        {detailPendaftar.nama_lengkap ? detailPendaftar.nama_lengkap.charAt(0).toUpperCase() : '?'}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                        {detailPendaftar.nama_lengkap}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400">
                                            NIK: {detailPendaftar.nik || '-'}
                                        </span>
                                        <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-extrabold uppercase ${
                                            detailPendaftar.jenis_kelamin === 'P' ? 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400' : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400'
                                        }`}>
                                            {detailPendaftar.jenis_kelamin === 'P' ? 'Perempuan' : 'Laki-laki'}
                                        </span>
                                        <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                                            🎂 {calculateAge(detailPendaftar.tanggal_lahir)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDetailPendaftar(null)}
                                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-850 dark:hover:text-slate-300"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content Grid */}
                        <div className="grid gap-4 sm:grid-cols-2 mt-5 text-xs">
                            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 space-y-2.5">
                                <span className="font-extrabold uppercase tracking-wider text-slate-400 block text-[10px]">Data Pribadi</span>
                                <div>
                                    <span className="text-slate-500 block">Tempat, Tanggal Lahir:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">
                                        {detailPendaftar.tempat_lahir || '-'}, {detailPendaftar.tanggal_lahir ? new Date(detailPendaftar.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block">Asal Sekolah (TK/RA):</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{detailPendaftar.asal_sekolah || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block">Akun Email Login:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{detailPendaftar.user?.email || '-'}</span>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 space-y-2.5">
                                <span className="font-extrabold uppercase tracking-wider text-slate-400 block text-[10px]">Orang Tua & Kontak</span>
                                <div>
                                    <span className="text-slate-500 block">Nama Orang Tua / Wali:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{detailPendaftar.nama_orang_tua || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block">No. HP / WhatsApp:</span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{detailPendaftar.no_hp_wali || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block">Tanggal Registrasi:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">
                                        {new Date(detailPendaftar.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
                                    </span>
                                </div>
                            </div>

                            <div className="sm:col-span-2 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
                                <span className="font-extrabold uppercase tracking-wider text-slate-400 block text-[10px] mb-1">Alamat Domisili Lengkap</span>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                                    {detailPendaftar.alamat || 'Belum mengisi alamat domisili.'}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t border-slate-100 dark:border-slate-850">
                            {!isKepalaSekolah && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const p = detailPendaftar;
                                        setDetailPendaftar(null);
                                        openEditModal(p);
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-blue-500/20"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                    <span>Edit Data Ini</span>
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setDetailPendaftar(null)}
                                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-300"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL 2: Edit Biodata Calon Siswa (Admin) ──────────────────────── */}
            {editPendaftar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-950 shadow-2xl animate-in fade-in zoom-in duration-150">
                        {/* Header Modal */}
                        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white text-xs">✏️</span>
                                    Edit / Koreksi Biodata Calon Siswa
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Mengubah data pendaftar: <strong>{editPendaftar.nama_lengkap}</strong>
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditPendaftar(null)}
                                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-850 dark:hover:text-slate-300"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSaveEdit} className="space-y-4 mt-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                {/* Nama Lengkap */}
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                                        Nama Lengkap Sesuai Akta
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.nama_lengkap}
                                        onChange={(e) => setEditForm({ ...editForm, nama_lengkap: e.target.value })}
                                        required
                                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                    />
                                </div>

                                {/* NIK */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                            NIK (16 Digit)
                                        </label>
                                        <span className={`text-[11px] font-mono font-bold ${editForm.nik.length === 16 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                            {editForm.nik.length}/16
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        maxLength={16}
                                        value={editForm.nik}
                                        onChange={(e) => setEditForm({ ...editForm, nik: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                                        required
                                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                    />
                                </div>

                                {/* Jenis Kelamin */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                                        Jenis Kelamin
                                    </label>
                                    <select
                                        value={editForm.jenis_kelamin}
                                        onChange={(e) => setEditForm({ ...editForm, jenis_kelamin: e.target.value })}
                                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                    >
                                        <option value="L">Laki-laki (L)</option>
                                        <option value="P">Perempuan (P)</option>
                                    </select>
                                </div>

                                {/* Tempat Lahir */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                                        Tempat Lahir
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.tempat_lahir}
                                        onChange={(e) => setEditForm({ ...editForm, tempat_lahir: e.target.value })}
                                        required
                                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                    />
                                </div>

                                {/* Tanggal Lahir */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                                        Tanggal Lahir
                                    </label>
                                    <input
                                        type="date"
                                        value={editForm.tanggal_lahir}
                                        onChange={(e) => setEditForm({ ...editForm, tanggal_lahir: e.target.value })}
                                        required
                                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                    />
                                </div>

                                {/* Asal Sekolah */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                                        Asal Sekolah (TK/RA)
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.asal_sekolah}
                                        onChange={(e) => setEditForm({ ...editForm, asal_sekolah: e.target.value })}
                                        placeholder="Contoh: RA Al-Hidayah"
                                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                    />
                                </div>

                                {/* Nama Orang Tua / Wali */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                                        Nama Orang Tua / Wali
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.nama_orang_tua}
                                        onChange={(e) => setEditForm({ ...editForm, nama_orang_tua: e.target.value })}
                                        required
                                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                    />
                                </div>

                                {/* No HP Wali */}
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                                        No. WhatsApp / HP Wali
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.no_hp_wali}
                                        onChange={(e) => setEditForm({ ...editForm, no_hp_wali: e.target.value })}
                                        required
                                        placeholder="08xxxxxxxxxx"
                                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                    />
                                </div>

                                {/* Alamat Lengkap */}
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                                        Alamat Domisili Lengkap
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={editForm.alamat}
                                        onChange={(e) => setEditForm({ ...editForm, alamat: e.target.value })}
                                        required
                                        placeholder="RT/RW, Dusun, Desa, Kecamatan, Kabupaten..."
                                        className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                    />
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-850">
                                <button
                                    type="button"
                                    onClick={() => setEditPendaftar(null)}
                                    disabled={isSavingEdit}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingEdit}
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-50"
                                >
                                    {isSavingEdit ? (
                                        <>
                                            <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Menyimpan...</span>
                                        </>
                                    ) : (
                                        <span>Simpan Perubahan</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── MODAL 3: Kirim Notifikasi Perbarui Biodata ─────────────────────── */}
            {notifPendaftar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-950 shadow-2xl animate-in fade-in zoom-in duration-150">
                        {/* Header Modal */}
                        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white text-xs">🔔</span>
                                    Kirim Notifikasi Perbarui Biodata
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Calon Siswa: <strong>{notifPendaftar.nama_lengkap}</strong> (NIK: {notifPendaftar.nik || '-'})
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setNotifPendaftar(null)}
                                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-850 dark:hover:text-slate-300"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSendNotification} className="space-y-4 mt-5">
                            {/* Template Cepat */}
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Template Instruksi Cepat:
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    {QUICK_BIODATA_TEMPLATES.map((tmpl, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                if (notifMessage) {
                                                    setNotifMessage(prev => `${prev}\n\n${tmpl.text}`);
                                                } else {
                                                    setNotifMessage(tmpl.text);
                                                }
                                            }}
                                            className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-amber-950/50 transition-colors"
                                        >
                                            {tmpl.title}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Textarea Pesan */}
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                                    Isi Pesan Notifikasi:
                                </label>
                                <textarea
                                    value={notifMessage}
                                    onChange={(e) => setNotifMessage(e.target.value)}
                                    rows="4"
                                    placeholder="Tuliskan data apa saja yang perlu diperbarui oleh calon siswa (contoh: NIK kurang 1 digit, mohon periksa KK)..."
                                    required
                                    className="w-full rounded-2xl border border-slate-300 p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                />
                                <p className="text-[11px] text-slate-400 mt-1">
                                    💡 Pesan ini akan langsung masuk ke <strong>simbol lonceng notifikasi</strong> di pojok kanan atas akun calon siswa dan mengarahkan ke halaman Formulir Biodata.
                                </p>
                            </div>

                            {/* Opsi WhatsApp */}
                            {notifPendaftar.no_hp_wali && (
                                <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                        <input
                                            type="checkbox"
                                            checked={notifSendWa}
                                            onChange={(e) => setNotifSendWa(e.target.checked)}
                                            className="rounded text-emerald-600 focus:ring-emerald-500 dark:bg-slate-800"
                                        />
                                        <span>Kirim juga pemberitahuan via WhatsApp ke wali siswa ({notifPendaftar.no_hp_wali})</span>
                                    </label>
                                </div>
                            )}

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-850">
                                <button
                                    type="button"
                                    onClick={() => setNotifPendaftar(null)}
                                    disabled={isSendingNotif}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSendingNotif}
                                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20 disabled:opacity-50"
                                >
                                    {isSendingNotif ? (
                                        <>
                                            <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Mengirim...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                            </svg>
                                            <span>Kirim Notifikasi</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
