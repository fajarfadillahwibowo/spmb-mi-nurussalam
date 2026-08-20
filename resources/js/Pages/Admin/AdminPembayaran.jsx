import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PeriodeFilterBar from '@/Components/PeriodeFilterBar'; // [BARU]

gsap.registerPlugin(ScrollTrigger);

export default function AdminPembayaran({ pendaftarans, filters, flash_status, flash_error, periodes = [], selectedPeriodeId = null }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [activePendaftaran, setActivePendaftaran] = useState(null);
    const [action, setAction] = useState('approve');
    const [newStatus, setNewStatus] = useState('lunas');
    const [catatan, setCatatan] = useState('');
    const [verifiedAmount, setVerifiedAmount] = useState('');
    const [jenisPembayaran, setJenisPembayaran] = useState('Uang Pangkal');
    const [kirimNotifWa, setKirimNotifWa] = useState(true);
    // loadingId: menyimpan ID pendaftaran yang sedang diproses.
    // Ini mencegah admin mengklik tombol lain selagi 1 request berjalan.
    const [loadingId, setLoadingId] = useState(null);
    const isSubmitting = loadingId !== null;

    const handleFilter = () => {
        router.get(route('pembayaran-admin.index'), {
            search: search || undefined,
            status: status || undefined,
        }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('');
        router.get(route('pembayaran-admin.index'), {}, { preserveState: true, replace: true });
    };

    const getStatusBadge = (s) => {
        switch (s) {
            case 'lunas':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400';
            case 'cicilan':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400';
            case 'menunggu_konfirmasi':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 animate-pulse';
            default:
                return 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-400';
        }
    };

    const getStatusLabel = (s) => {
        switch (s) {
            case 'lunas': return 'Lunas';
            case 'cicilan': return 'Cicilan';
            case 'menunggu_konfirmasi': return 'Menunggu Verifikasi';
            default: return 'Belum Bayar';
        }
    };

    const formatRupiah = (num) => {
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
    };

    const data = pendaftarans?.data || [];
    const links = pendaftarans?.links || [];

    // Calculate dynamic stats
    const totalPendaftar = pendaftarans?.total || 0;
    const statsCounts = {
        menunggu: data.filter(p => p.payment_status === 'menunggu_konfirmasi').length,
        lunas: data.filter(p => p.payment_status === 'lunas').length,
        cicilan: data.filter(p => p.payment_status === 'cicilan').length,
    };

    const handleConfirm = (e) => {
        e.preventDefault();
        if (!activePendaftaran || isSubmitting) return;

        // Set loading state ke ID pendaftaran yang sedang diproses.
        // Ini mem-disable tombol submit dan semua tombol "Tinjau Bukti" lainnya
        // di tabel secara bersamaan → mencegah double-request.
        setLoadingId(activePendaftaran.id);

        router.post(
            route('pembayaran-admin.confirm', activePendaftaran.id),
            {
                action: action,
                payment_status: newStatus,
                verified_amount: action === 'approve' ? (parseFloat(verifiedAmount) || 0) : 0,
                catatan_pembayaran: catatan,
                jenis_pembayaran: jenisPembayaran,
                kirim_notif_wa: kirimNotifWa ? 1 : 0,
            },
            {
                onSuccess: () => {
                    setActivePendaftaran(null);
                    setCatatan('');
                    setVerifiedAmount('');
                    setJenisPembayaran('Uang Pangkal');
                    setKirimNotifWa(true);

                    // Konfirmasi sukses
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: action === 'approve'
                            ? 'Pembayaran diverifikasi. Notifikasi WA sedang dikirim ke antrian.'
                            : 'Bukti pembayaran berhasil ditolak.',
                        timer: 3000,
                        showConfirmButton: false,
                        toast: true,
                        position: 'top-end',
                    });
                },
                onError: (errors) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal!',
                        text: Object.values(errors)[0] || 'Terjadi kesalahan, silakan coba lagi.',
                        confirmButtonColor: '#16a34a',
                    });
                },
                onFinish: () => {
                    // PENTING: Selalu reset loading state, baik sukses maupun gagal.
                    // Ini memastikan tombol kembali aktif setelah request selesai.
                    setLoadingId(null);
                },
            }
        );
    };

    const getFileUrl = (path) => `/storage/${path}`;
    const isPdf = (path) => path?.toLowerCase().endsWith('.pdf');

    useEffect(() => {
        // Tampilkan flash error jika ada (dari backend DB transaction gagal)
        if (flash_error) {
            Swal.fire({
                icon: 'error',
                title: 'Kesalahan Server!',
                text: flash_error,
                confirmButtonColor: '#16a34a',
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
        <AuthenticatedLayout header="Verifikasi Pembayaran Siswa">
            <Head title="Verifikasi Pembayaran | SPMB Admin" />

            <div className="space-y-6">
                {/* Filter Periode — [BARU] */}
                <PeriodeFilterBar
                    periodes={periodes}
                    selectedPeriode={selectedPeriodeId}
                    routeName="pembayaran-admin.index"
                    extraParams={{ search: filters?.search, status: filters?.status }}
                />

                {flash_status && (
                    <div className="rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
                        {flash_status}
                    </div>
                )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main List */}
                <div className={`${activePendaftaran ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-6`}>
                    
                    {/* Filter Bar */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm gsap-fade-down">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Cari Nama</label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                    placeholder="Ketik nama..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Status Pembayaran</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                >
                                    <option value="">Semua</option>
                                    <option value="belum_bayar">Belum Bayar</option>
                                    <option value="menunggu_konfirmasi">Menunggu Verifikasi</option>
                                    <option value="cicilan">Cicilan</option>
                                    <option value="lunas">Lunas</option>
                                </select>
                            </div>
                            <div className="flex items-end gap-2">
                                <button
                                    onClick={handleFilter}
                                    className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-colors"
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

                    {/* Table */}
                    <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-850 dark:bg-slate-950 overflow-hidden shadow-sm gsap-fade-up">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
                                        <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">Nama Pendaftar</th>
                                        <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">Total Terbayar</th>
                                        <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">Status</th>
                                        <th className="px-6 py-4 text-center text-xs font-extrabold uppercase tracking-widest text-slate-500">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {data.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-semibold">
                                                Belum ada data pendaftar.
                                            </td>
                                        </tr>
                                    ) : (
                                        data.map((p) => (
                                            <tr key={p.id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors ${activePendaftaran?.id === p.id ? 'bg-slate-50 dark:bg-slate-900' : ''}`}>
                                                <td className="px-6 py-4">
                                                    <span className="font-extrabold text-slate-800 dark:text-white block">{p.nama_lengkap}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold">NIK: {p.nik || '-'}</span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">
                                                    {formatRupiah(p.amount_paid)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider ${getStatusBadge(p.payment_status)}`}>
                                                        {getStatusLabel(p.payment_status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {p.bukti_pembayaran_path ? (
                                                        <button
                                                            id={`btn-tinjau-${p.id}`}
                                                            onClick={() => {
                                                                if (isSubmitting) return; // Guard: blokir klik jika ada proses berjalan
                                                                setActivePendaftaran(p);
                                                                setAction('approve');
                                                                setNewStatus(p.payment_status === 'cicilan' ? 'cicilan' : 'lunas');
                                                                setVerifiedAmount(p.amount_paid);
                                                            }}
                                                            disabled={isSubmitting}
                                                            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all shadow-sm ${
                                                                isSubmitting
                                                                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500'
                                                                    : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500'
                                                            }`}
                                                        >
                                                            {loadingId === p.id ? (
                                                                <span className="flex items-center gap-1.5">
                                                                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                                                    </svg>
                                                                    Memproses...
                                                                </span>
                                                            ) : 'Tinjau Bukti'}
                                                        </button>
                                                    ) : (
                                                        <span className="text-slate-450 text-xs font-bold italic">Belum Upload</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Detail & Audit Verification */}
                {activePendaftaran && (
                    <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-850 dark:bg-slate-950 shadow-sm space-y-6 gsap-fade-left">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-850">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Audit Bukti Transfer</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{activePendaftaran.nama_lengkap}</p>
                            </div>
                            <button
                                onClick={() => setActivePendaftaran(null)}
                                className="text-slate-400 hover:text-slate-600 text-sm font-bold transition-colors"
                            >
                                Tutup &times;
                            </button>
                        </div>

                        {/* File Preview */}
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Dokumen Bukti</span>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex items-center justify-center p-3 min-h-[220px]">
                                {isPdf(activePendaftaran.bukti_pembayaran_path) ? (
                                    <div className="w-full h-64 flex flex-col items-center justify-center gap-3">
                                        <span className="text-4xl">📄</span>
                                        <span className="text-xs font-semibold text-slate-500">Berkas berupa PDF</span>
                                        <a
                                            href={getFileUrl(activePendaftaran.bukti_pembayaran_path)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                                        >
                                            Buka PDF di Tab Baru
                                        </a>
                                    </div>
                                ) : (
                                    <a
                                        href={getFileUrl(activePendaftaran.bukti_pembayaran_path)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Klik untuk memperbesar gambar"
                                    >
                                        <img
                                            src={getFileUrl(activePendaftaran.bukti_pembayaran_path)}
                                            alt="Bukti Transfer"
                                            className="max-h-60 max-w-full object-contain rounded-xl hover:scale-105 transition-transform"
                                        />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="bg-slate-50 rounded-2xl p-4 dark:bg-slate-900 text-xs font-bold space-y-2">
                            <div className="flex justify-between">
                                <span className="text-slate-450 uppercase text-[9px]">Jumlah Diklaim</span>
                                <span className="text-slate-800 dark:text-white">{formatRupiah(activePendaftaran.amount_paid)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-450 uppercase text-[9px]">Status Saat Ini</span>
                                <span className="text-amber-600 uppercase tracking-wider">{getStatusLabel(activePendaftaran.payment_status)}</span>
                            </div>
                        </div>

                        {/* Decision Form */}
                        <form onSubmit={handleConfirm} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Tindakan</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setAction('approve')}
                                        className={`rounded-xl border p-2.5 text-center text-xs font-bold transition-all ${
                                            action === 'approve'
                                                ? 'border-emerald-600 bg-emerald-50/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/20'
                                                : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900'
                                        }`}
                                    >
                                        Terima / Setujui
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAction('reject')}
                                        className={`rounded-xl border p-2.5 text-center text-xs font-bold transition-all ${
                                            action === 'reject'
                                                ? 'border-rose-600 bg-rose-50/30 text-rose-700 dark:text-rose-450 ring-1 ring-rose-500/20'
                                                : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900'
                                        }`}
                                    >
                                        Tolak Bukti
                                    </button>
                                </div>
                            </div>

                            {action === 'approve' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Status Baru</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setNewStatus('lunas')}
                                                className={`rounded-xl border p-2 text-center text-xs font-bold transition-all ${
                                                    newStatus === 'lunas'
                                                        ? 'border-emerald-600 bg-emerald-50/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/20'
                                                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900'
                                                }`}
                                            >
                                                Set Lunas
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setNewStatus('cicilan')}
                                                className={`rounded-xl border p-2 text-center text-xs font-bold transition-all ${
                                                    newStatus === 'cicilan'
                                                        ? 'border-emerald-600 bg-emerald-50/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/20'
                                                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900'
                                                }`}
                                            >
                                                Set Cicilan
                                            </button>
                                        </div>
                                    </div>

                                    {/* Jenis Pembayaran — dikirim ke backend untuk pesan WA */}
                                    <div className="space-y-1">
                                        <label htmlFor="jenis_pembayaran" className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Jenis Pembayaran</label>
                                        <select
                                            id="jenis_pembayaran"
                                            value={jenisPembayaran}
                                            onChange={(e) => setJenisPembayaran(e.target.value)}
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 font-bold"
                                        >
                                            <option value="Uang Pangkal">Uang Pangkal</option>
                                            <option value="Biaya Seragam">Biaya Seragam</option>
                                            <option value="Biaya Buku & Alat Tulis">Biaya Buku & Alat Tulis</option>
                                            <option value="Biaya Pendaftaran SPMB">Biaya Pendaftaran SPMB</option>
                                            <option value="Biaya Kegiatan">Biaya Kegiatan</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="verified_amount" className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Nominal Pembayaran Diterima (Rp)</label>
                                        <div className="relative mt-1">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                                            <input
                                                id="verified_amount"
                                                type="number"
                                                value={verifiedAmount}
                                                onChange={(e) => setVerifiedAmount(e.target.value)}
                                                placeholder="Masukkan nominal yang valid"
                                                className="w-full pl-8 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-800 bg-white focus:border-emerald-500 focus:outline-none dark:bg-slate-900 font-bold"
                                                required
                                            />
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                                            Calon siswa mengklaim transfer sebesar: <strong className="text-slate-700 dark:text-slate-300">{formatRupiah(activePendaftaran.amount_paid)}</strong>
                                        </span>
                                    </div>

                                    {/* Toggle Kirim Notifikasi WA */}
                                    <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-900">
                                        <div>
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">📲 Kirim Notifikasi WA</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">Otomatis kirim pesan ke {activePendaftaran.no_hp_wali || 'nomor wali'}</p>
                                        </div>
                                        <button
                                            type="button"
                                            id="toggle-notif-wa"
                                            onClick={() => setKirimNotifWa(!kirimNotifWa)}
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                                kirimNotifWa ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                                            }`}
                                        >
                                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                                                kirimNotifWa ? 'translate-x-4.5' : 'translate-x-0.5'
                                            }`} />
                                        </button>
                                    </div>
                                </>
                            )}


                            <div className="space-y-1">
                                <label htmlFor="catatan" className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Catatan / Alasan</label>
                                <textarea
                                    id="catatan"
                                    value={catatan}
                                    onChange={(e) => setCatatan(e.target.value)}
                                    placeholder={action === 'approve' ? 'Catatan verifikasi (misal: Transfer lunas bank BSI)' : 'Alasan penolakan bukti transfer (wajib diisi)...'}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                    rows="3"
                                    required={action === 'reject'}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                id="btn-simpan-keputusan"
                                disabled={isSubmitting}
                                className={`w-full rounded-xl py-2.5 text-xs font-bold text-white transition-all shadow-md ${
                                    isSubmitting
                                        ? 'bg-slate-400 cursor-not-allowed shadow-none'
                                        : action === 'approve'
                                        ? 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 shadow-emerald-500/10'
                                        : 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 shadow-rose-500/10'
                                }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                        </svg>
                                        Memproses Verifikasi...
                                    </span>
                                ) : 'Simpan Keputusan'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
            </div>
        </AuthenticatedLayout>
    );
}
