import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PeriodeFilterBar from '@/Components/PeriodeFilterBar'; // [BARU]
import WaStatusBadge from '@/Components/WaStatusBadge';
import EmailStatusBadge from '@/Components/EmailStatusBadge';

gsap.registerPlugin(ScrollTrigger);

export default function AdminPembayaran({ pendaftarans, filters, flash_status, flash_error, periodes = [], selectedPeriodeId = null }) {
    const { user } = usePage().props.auth;
    const isKepalaSekolah = user?.role === 'kepala_sekolah';

    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [activePendaftaran, setActivePendaftaran] = useState(null);
    const [action, setAction] = useState('approve');
    const [newStatus, setNewStatus] = useState('lunas');
    const [catatan, setCatatan] = useState('');
    const [verifiedAmount, setVerifiedAmount] = useState('');
    const [jenisPembayaran, setJenisPembayaran] = useState('Total Biaya Masuk (Semua Komponen)');
    const [kirimNotifWa, setKirimNotifWa] = useState(true);
    // loadingId: menyimpan ID pendaftaran yang sedang diproses.
    // Ini mencegah admin mengklik tombol lain selagi 1 request berjalan.
    const [loadingId, setLoadingId] = useState(null);
    const isSubmitting = loadingId !== null;

    // State Edit Data Pembayaran
    const [editingPendaftaran, setEditingPendaftaran] = useState(null);
    const [editPaymentStatus, setEditPaymentStatus] = useState('belum_bayar');
    const [editAmountPaid, setEditAmountPaid] = useState('');
    const [editCatatan, setEditCatatan] = useState('');
    const [editJenisPembayaran, setEditJenisPembayaran] = useState('Total Biaya Masuk (Semua Komponen)');
    const [editKirimNotifWa, setEditKirimNotifWa] = useState(false);
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

    const openEditModal = (p) => {
        setEditingPendaftaran(p);
        setEditPaymentStatus(p.payment_status || 'belum_bayar');
        setEditAmountPaid(p.amount_paid ?? 0);
        setEditCatatan(p.catatan_pembayaran || '');
        setEditJenisPembayaran('Total Biaya Masuk (Semua Komponen)');
        setEditKirimNotifWa(false);
    };

    const closeEditModal = () => {
        setEditingPendaftaran(null);
        setEditAmountPaid('');
        setEditCatatan('');
        setIsSubmittingEdit(false);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editingPendaftaran || isSubmittingEdit) return;

        setIsSubmittingEdit(true);

        router.put(
            route('pembayaran-admin.update', editingPendaftaran.id),
            {
                payment_status: editPaymentStatus,
                amount_paid: parseFloat(editAmountPaid) || 0,
                catatan_pembayaran: editCatatan,
                jenis_pembayaran: editJenisPembayaran,
                kirim_notif_wa: editKirimNotifWa ? 1 : 0,
            },
            {
                onSuccess: () => {
                    closeEditModal();
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Data pembayaran berhasil diperbarui.',
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
                        text: Object.values(errors)[0] || 'Terjadi kesalahan saat menyimpan data.',
                        confirmButtonColor: '#16a34a',
                    });
                },
                onFinish: () => {
                    setIsSubmittingEdit(false);
                },
            }
        );
    };

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
                    setJenisPembayaran('Total Biaya Masuk (Semua Komponen)');
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
                {/* Filter Periode */}
                <PeriodeFilterBar
                    periodes={periodes}
                    selectedPeriode={selectedPeriodeId}
                    routeName="pembayaran-admin.index"
                    extraParams={{ search: filters?.search, status: filters?.status }}
                />

                {/* Banner Mode Pengawas (Kepala Sekolah) */}
                {isKepalaSekolah && (
                    <div className="flex items-center justify-between p-4 bg-amber-50 border-l-4 border-amber-500 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-amber-100 text-amber-800 rounded-xl text-lg font-bold">🛡️</span>
                            <div>
                                <h4 className="text-sm font-extrabold text-amber-950">Mode Pengawas: Riwayat & Status Pembayaran (Read-Only)</h4>
                                <p className="text-xs text-amber-800 font-medium mt-0.5">
                                    Hak akses Anda bersifat memantau dan mengaudit bukti transfer. Aksi verifikasi, approval, dan koreksi pembayaran hanya dapat dilakukan oleh Administrator.
                                </p>
                            </div>
                        </div>
                        <span className="hidden sm:inline-flex text-[11px] font-extrabold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-3 py-1 rounded-full">
                            Read-Only Active
                        </span>
                    </div>
                )}

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
                                                    <div className="flex flex-col items-center gap-1.5">
                                                        <div className="flex items-center justify-center gap-2">
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
                                                                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all shadow-sm ${
                                                                        isSubmitting
                                                                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500'
                                                                            : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500'
                                                                    }`}
                                                                    title="Tinjau bukti transfer pendaftar"
                                                                >
                                                                    {loadingId === p.id ? (
                                                                        <span className="flex items-center gap-1.5">
                                                                            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                                                            </svg>
                                                                            Memproses...
                                                                        </span>
                                                                    ) : (
                                                                        <>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-3.5 w-3.5">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                                            </svg>
                                                                            Tinjau
                                                                        </>
                                                                    )}
                                                                </button>
                                                            ) : null}

                                                            {!isKepalaSekolah && (
                                                                <button
                                                                    id={`btn-edit-${p.id}`}
                                                                    onClick={() => openEditModal(p)}
                                                                    disabled={isSubmitting || isSubmittingEdit}
                                                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 px-3 py-1.5 text-xs font-bold transition-all shadow-sm"
                                                                    title="Edit / Koreksi Data Pembayaran"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                                    </svg>
                                                                    Edit
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Indikator Status WA & Email Pembayaran */}
                                                        {(p.payment_status === 'lunas' || p.payment_status === 'cicilan' || p.status_wa_bayar === 'terkirim' || p.status_email_bayar === 'terkirim') && (
                                                            <div className="flex flex-col items-center gap-1 mt-0.5">
                                                                <WaStatusBadge
                                                                    status={p.status_wa_bayar || 'belum_terkirim'}
                                                                    sentAt={p.wa_bayar_sent_at}
                                                                />
                                                                <EmailStatusBadge
                                                                    status={p.status_email_bayar || 'belum_terkirim'}
                                                                    sentAt={p.email_bayar_sent_at}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Links */}
                        {links.length > 3 && (
                            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 p-4 dark:border-slate-800">
                                <span className="text-xs font-semibold text-slate-500">
                                    Total {totalPendaftar} data pembayaran
                                </span>
                                <div className="flex flex-wrap gap-1">
                                    {links.map((link, i) => (
                                        <button
                                            key={i}
                                            disabled={!link.url || link.active}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                                                link.active
                                                    ? 'bg-emerald-600 text-white shadow-sm'
                                                    : link.url
                                                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                                    : 'cursor-not-allowed text-slate-400 opacity-50'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
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
                            <div className="flex justify-between items-center pt-2 border-t border-slate-200/50 dark:border-slate-800">
                                <span className="text-slate-450 uppercase text-[9px]">Status WA</span>
                                <WaStatusBadge
                                    status={activePendaftaran.status_wa_bayar || 'belum_terkirim'}
                                    sentAt={activePendaftaran.wa_bayar_sent_at}
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-450 uppercase text-[9px]">Status Email</span>
                                <EmailStatusBadge
                                    status={activePendaftaran.status_email_bayar || 'belum_terkirim'}
                                    sentAt={activePendaftaran.email_bayar_sent_at}
                                />
                            </div>
                        </div>

                        {/* Decision Form or Read-Only Inspection */}
                        {isKepalaSekolah ? (
                            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 space-y-3 dark:border-amber-900/60 dark:bg-amber-950/30">
                                <div className="flex items-center gap-2">
                                    <span className="text-base">🛡️</span>
                                    <h4 className="text-xs font-extrabold text-amber-900 dark:text-amber-300 uppercase tracking-wider">Mode Pengawas (Read-Only)</h4>
                                </div>
                                <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed font-medium">
                                    Anda sedang meninjau bukti pembayaran calon siswa <strong>{activePendaftaran.nama_lengkap}</strong>. Form persetujuan atau penolakan bukti transfer hanya dapat diproses oleh Administrator.
                                </p>
                                <div className="pt-3 border-t border-amber-200/70 dark:border-amber-800/50 space-y-2 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-semibold">Status Pembayaran:</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${getStatusBadge(activePendaftaran.payment_status)}`}>
                                            {activePendaftaran.payment_status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-semibold">Nominal Terdaftar:</span>
                                        <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                                            Rp {Number(activePendaftaran.amount_paid || 0).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    {activePendaftaran.catatan_pembayaran && (
                                        <div className="pt-1.5">
                                            <span className="text-slate-500 font-semibold block mb-1">Catatan Terakhir:</span>
                                            <p className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-100 dark:border-amber-900/40 text-slate-700 dark:text-slate-300 italic text-[11px]">
                                                {activePendaftaran.catatan_pembayaran}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
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
                                                <optgroup label="Paket Pembayaran">
                                                    <option value="Total Biaya Masuk (Semua Komponen)">Total Biaya Masuk (Semua Komponen)</option>
                                                    <option value="Cicilan Biaya Masuk">Cicilan Biaya Masuk</option>
                                                </optgroup>
                                                <optgroup label="Rincian Komponen Biaya (7 Komponen)">
                                                    <option value="1. Biaya Pendaftaran">1. Biaya Pendaftaran (Gratis)</option>
                                                    <option value="2. Uang Kaos Olahraga">2. Uang Kaos Olahraga (Rp 160.000)</option>
                                                    <option value="3. Uang Buku Rapor">3. Uang Buku Rapor (Rp 100.000)</option>
                                                    <option value="4. Uang Buku Paket / LKS">4. Uang Buku Paket / LKS (Rp 100.000)</option>
                                                    <option value="5. Uang Foto">5. Uang Foto (Rp 20.000)</option>
                                                    <option value="6. Uang Kegiatan Eskul">6. Uang Kegiatan Eskul (Rp 50.000)</option>
                                                    <option value="7. Uang Wakaf Pengembangan Madrasah">7. Uang Wakaf Pengembangan Madrasah (ZISWAF)</option>
                                                </optgroup>
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
                                        </div>

                                        {/* Toggle Kirim Notifikasi WhatsApp */}
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                                            <div className="space-y-0.5">
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Kirim Notifikasi WA</span>
                                                <span className="text-[10px] text-slate-400 block">Kirim pesan WhatsApp otomatis ke nomor wali</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setKirimNotifWa(!kirimNotifWa)}
                                                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                    kirimNotifWa ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
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
                        )}
                    </div>
                )}
            </div>
            </div>

            {/* Modal Edit / Koreksi Pembayaran */}
            {editingPendaftaran && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 md:p-8 dark:border-slate-800 dark:bg-slate-950 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Edit Data Pembayaran</h3>
                                    <p className="text-xs text-slate-500 font-medium">{editingPendaftaran.nama_lengkap} (NIK: {editingPendaftaran.nik || '-'})</p>
                                </div>
                            </div>
                            <button
                                onClick={closeEditModal}
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-900 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            {/* Status WA & Email Terakhir */}
                            <div className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500">Status Notifikasi WA:</span>
                                    <WaStatusBadge
                                        status={editingPendaftaran.status_wa_bayar || 'belum_terkirim'}
                                        sentAt={editingPendaftaran.wa_bayar_sent_at}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500">Status Notifikasi Email:</span>
                                    <EmailStatusBadge
                                        status={editingPendaftaran.status_email_bayar || 'belum_terkirim'}
                                        sentAt={editingPendaftaran.email_bayar_sent_at}
                                    />
                                </div>
                            </div>
                            {/* Status Pembayaran Selector */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Status Pembayaran</label>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {[
                                        { val: 'belum_bayar', label: 'Belum Bayar' },
                                        { val: 'menunggu_konfirmasi', label: 'Menunggu' },
                                        { val: 'cicilan', label: 'Cicilan' },
                                        { val: 'lunas', label: 'Lunas' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.val}
                                            type="button"
                                            onClick={() => setEditPaymentStatus(opt.val)}
                                            className={`rounded-xl p-2 text-center text-xs font-bold transition-all border ${
                                                editPaymentStatus === opt.val
                                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 ring-2 ring-emerald-500/20'
                                                    : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Total Terbayar (Nominal) */}
                            <div className="space-y-1.5">
                                <label htmlFor="edit_amount_paid" className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                                    Total Nominal Terbayar (Rp)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                                    <input
                                        id="edit_amount_paid"
                                        type="number"
                                        min="0"
                                        step="1000"
                                        value={editAmountPaid}
                                        onChange={(e) => setEditAmountPaid(e.target.value)}
                                        placeholder="0"
                                        className="w-full pl-10 pr-4 py-2.5 text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <span className="text-[11px] font-semibold text-slate-500 block">
                                    Format: <strong className="text-emerald-600 dark:text-emerald-400">{formatRupiah(parseFloat(editAmountPaid) || 0)}</strong>
                                </span>
                            </div>

                            {/* Jenis Pembayaran */}
                            <div className="space-y-1.5">
                                <label htmlFor="edit_jenis_pembayaran" className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                                    Jenis / Komponen Pembayaran
                                </label>
                                <select
                                    id="edit_jenis_pembayaran"
                                    value={editJenisPembayaran}
                                    onChange={(e) => setEditJenisPembayaran(e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-bold focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                >
                                    <optgroup label="Paket Pembayaran">
                                        <option value="Total Biaya Masuk (Semua Komponen)">Total Biaya Masuk (Semua Komponen)</option>
                                        <option value="Cicilan Biaya Masuk">Cicilan Biaya Masuk</option>
                                        <option value="Koreksi Data Pembayaran">Koreksi Data Pembayaran</option>
                                    </optgroup>
                                    <optgroup label="Rincian Komponen Biaya (7 Komponen)">
                                        <option value="1. Biaya Pendaftaran">1. Biaya Pendaftaran (Gratis)</option>
                                        <option value="2. Uang Kaos Olahraga">2. Uang Kaos Olahraga (Rp 160.000)</option>
                                        <option value="3. Uang Buku Rapor">3. Uang Buku Rapor (Rp 100.000)</option>
                                        <option value="4. Uang Buku Paket / LKS">4. Uang Buku Paket / LKS (Rp 100.000)</option>
                                        <option value="5. Uang Foto">5. Uang Foto (Rp 20.000)</option>
                                        <option value="6. Uang Kegiatan Eskul">6. Uang Kegiatan Eskul (Rp 50.000)</option>
                                        <option value="7. Uang Wakaf Pengembangan Madrasah">7. Uang Wakaf Pengembangan Madrasah (ZISWAF)</option>
                                    </optgroup>
                                </select>
                            </div>

                            {/* Catatan Pembayaran */}
                            <div className="space-y-1.5">
                                <label htmlFor="edit_catatan" className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                                    Catatan / Keterangan Pembayaran
                                </label>
                                <textarea
                                    id="edit_catatan"
                                    value={editCatatan}
                                    onChange={(e) => setEditCatatan(e.target.value)}
                                    placeholder="Contoh: Pembayaran tunai via bendahara madrasah / Koreksi nominal..."
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                    rows="3"
                                ></textarea>
                            </div>

                            {/* Toggle Kirim Notifikasi WA */}
                            <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 bg-slate-50 dark:bg-slate-900">
                                <div>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">📲 Kirim Notifikasi WA ke Wali</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Kirim info pembaruan ke {editingPendaftaran.no_hp_wali || 'nomor wali'}</p>
                                </div>
                                <button
                                    type="button"
                                    id="toggle-edit-notif-wa"
                                    onClick={() => setEditKirimNotifWa(!editKirimNotifWa)}
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                        editKirimNotifWa ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                                    }`}
                                >
                                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                                        editKirimNotifWa ? 'translate-x-4.5' : 'translate-x-0.5'
                                    }`} />
                                </button>
                            </div>

                            {/* Modal Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    disabled={isSubmittingEdit}
                                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    id="btn-simpan-edit-pembayaran"
                                    disabled={isSubmittingEdit}
                                    className={`inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all ${
                                        isSubmittingEdit ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isSubmittingEdit ? (
                                        <>
                                            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                            </svg>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Simpan Perubahan'
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
