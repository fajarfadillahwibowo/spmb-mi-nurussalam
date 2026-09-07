import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PeriodeFilterBar from '@/Components/PeriodeFilterBar';

gsap.registerPlugin(ScrollTrigger);

const REQUIRED_DOCS = [
    { type: 'akta_kelahiran_path', label: 'Akta Kelahiran' },
    { type: 'kartu_keluarga_path', label: 'Kartu Keluarga' },
    { type: 'identitas_ortu_path', label: 'Identitas Orang Tua (KTP)' },
    { type: 'ijazah_path', label: 'Ijazah TK/RA' },
    { type: 'pkh_kks_path', label: 'PKH/KKS (Opsional)', optional: true },
];

const QUICK_TEMPLATES = [
    {
        title: '📷 Foto Buram / Tidak Terbaca',
        text: 'Hasil scan/foto dokumen buram dan tidak terbaca jelas oleh panitia verifikasi. Mohon foto ulang dengan pencahayaan terang dan fokus yang jelas.',
    },
    {
        title: '✂️ Dokumen Terpotong',
        text: 'Bagian tepi atau data penting pada dokumen terpotong. Mohon unggah ulang seluruh lembar dokumen secara utuh dan lengkap.',
    },
    {
        title: '⚠️ Dokumen Salah / Tidak Sesuai',
        text: 'Dokumen yang diunggah tidak sesuai dengan persyaratan yang diminta. Mohon periksa kembali jenis dokumen dan unggah berkas yang benar.',
    },
    {
        title: '📄 File Rusak / Corrupt',
        text: 'File dokumen rusak atau tidak dapat dibuka oleh sistem. Mohon simpan ulang dalam format PDF, JPG, atau PNG yang valid lalu unggah kembali.',
    },
];

export default function AdminVerifikasiBerkas({ pendaftarans, filters, periodes = [], selectedPeriodeId = null, flash_status, flash_error }) {
    const { user } = usePage().props.auth;
    const isKepalaSekolah = user?.role === 'kepala_sekolah';

    const [search, setSearch] = useState(filters?.search || '');
    const [verifikasi, setVerifikasi] = useState(filters?.verifikasi || '');
    const [loadingAction, setLoadingAction] = useState(null);

    // Modal Pemberitahuan State
    const [activeModalPendaftar, setActiveModalPendaftar] = useState(null);
    const [selectedFaultyDocs, setSelectedFaultyDocs] = useState([]);
    const [customMessage, setCustomMessage] = useState('');
    const [shouldDeleteFiles, setShouldDeleteFiles] = useState(true);
    const [shouldSendWa, setShouldSendWa] = useState(true);
    const [isSubmittingNotif, setIsSubmittingNotif] = useState(false);

    const handleFilter = () => {
        router.get(route('verifikasi-berkas.index'), {
            search: search || undefined,
            verifikasi: verifikasi || undefined,
        }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearch('');
        setVerifikasi('');
        router.get(route('verifikasi-berkas.index'), {}, { preserveState: true, replace: true });
    };

    const getDocStatus = (dokumen, docType) => {
        return !!dokumen?.[docType];
    };

    const getCompleteness = (dokumen) => {
        const required = REQUIRED_DOCS.filter(d => !d.optional);
        const uploaded = required.filter(d => getDocStatus(dokumen, d.type)).length;
        return { uploaded, total: required.length, percentage: Math.round((uploaded / required.length) * 100) };
    };

    const data = Array.isArray(pendaftarans) ? pendaftarans : (pendaftarans?.data || []);

    // Count stats
    const totalLengkap = data.filter(p => p && getCompleteness(p.dokumen).percentage === 100).length;
    const totalBelum = data.length - totalLengkap;

    // ── Hapus Satu Dokumen ──────────────────────────────────────────────────
    const handleDeleteSingleDoc = (pendaftar, doc) => {
        Swal.fire({
            title: `Hapus ${doc.label}?`,
            html: `Apakah Anda yakin ingin menghapus berkas <b>${doc.label}</b> milik <b>${pendaftar.nama_lengkap}</b>?<br><span class="text-xs text-rose-500 mt-2 block font-medium">File fisik akan dihapus dari server dan pemberitahuan otomatis akan masuk ke akun calon siswa (simbol lonceng) untuk mengunggah ulang.</span>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e11d48',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus Berkas',
            cancelButtonText: 'Batal',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-2xl dark:bg-slate-900 dark:text-slate-100',
                title: 'text-lg font-bold text-slate-800 dark:text-white',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const actionKey = `delete_${pendaftar.id}_${doc.type}`;
                setLoadingAction(actionKey);

                router.post(
                    route('verifikasi-berkas.hapus-dokumen', pendaftar.id),
                    { doc_type: doc.type },
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Berkas Dihapus!',
                                text: `Berkas ${doc.label} milik ${pendaftar.nama_lengkap} berhasil dihapus. Notifikasi telah dikirim ke calon siswa.`,
                                timer: 3000,
                                showConfirmButton: false,
                                toast: true,
                                position: 'top-end',
                            });
                        },
                        onError: (errors) => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Gagal Menghapus Berkas',
                                text: Object.values(errors)[0] || 'Terjadi kesalahan sistem saat menghapus berkas.',
                                confirmButtonColor: '#059669',
                            });
                        },
                        onFinish: () => setLoadingAction(null),
                    }
                );
            }
        });
    };

    // ── Buka Modal Pemberitahuan ────────────────────────────────────────────
    const openNotificationModal = (pendaftar) => {
        setActiveModalPendaftar(pendaftar);
        setSelectedFaultyDocs([]);
        setCustomMessage('');
        setShouldDeleteFiles(true);
        setShouldSendWa(!!pendaftar.no_hp_wali);
    };

    const closeNotificationModal = () => {
        setActiveModalPendaftar(null);
        setSelectedFaultyDocs([]);
        setCustomMessage('');
        setIsSubmittingNotif(false);
    };

    const toggleFaultyDoc = (docType) => {
        setSelectedFaultyDocs(prev => 
            prev.includes(docType)
                ? prev.filter(t => t !== docType)
                : [...prev, docType]
        );
    };

    const applyTemplate = (templateText) => {
        if (customMessage) {
            setCustomMessage(prev => `${prev}\n\n${templateText}`);
        } else {
            setCustomMessage(templateText);
        }
    };

    // ── Submit Pemberitahuan ────────────────────────────────────────────────
    const handleSubmitNotification = (e) => {
        e.preventDefault();
        if (!activeModalPendaftar) return;

        if (!customMessage.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Catatan Belum Diisi',
                text: 'Harap masukkan rincian atau alasan perbaikan berkas untuk calon siswa.',
                confirmButtonColor: '#059669',
            });
            return;
        }

        setIsSubmittingNotif(true);

        router.post(
            route('verifikasi-berkas.kirim-pemberitahuan', activeModalPendaftar.id),
            {
                pesan: customMessage,
                dokumen_bermasalah: selectedFaultyDocs,
                hapus_file: shouldDeleteFiles,
                kirim_wa: shouldSendWa,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    closeNotificationModal();
                    Swal.fire({
                        icon: 'success',
                        title: 'Pemberitahuan Terkirim!',
                        text: 'Pemberitahuan berhasil masuk ke lonceng notifikasi akun calon siswa' + (shouldSendWa ? ' dan WhatsApp wali.' : '.'),
                        timer: 3500,
                        showConfirmButton: false,
                        toast: true,
                        position: 'top-end',
                    });
                },
                onError: (errors) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal Mengirim Pemberitahuan',
                        text: Object.values(errors)[0] || 'Terjadi kesalahan sistem saat mengirim pemberitahuan.',
                        confirmButtonColor: '#059669',
                    });
                },
                onFinish: () => setIsSubmittingNotif(false),
            }
        );
    };

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
        <AuthenticatedLayout header="Verifikasi Berkas">
            <Head title="Verifikasi Berkas" />

            <div className="space-y-6">
                {/* Filter Periode */}
                <PeriodeFilterBar
                    periodes={periodes}
                    selectedPeriode={selectedPeriodeId}
                    routeName="verifikasi-berkas.index"
                    extraParams={{ search: filters?.search, verifikasi: filters?.verifikasi }}
                />

                {/* Banner Mode Pengawas (Kepala Sekolah) */}
                {isKepalaSekolah && (
                    <div className="flex items-center justify-between p-4 bg-amber-50 border-l-4 border-amber-500 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-amber-100 text-amber-800 rounded-xl text-lg font-bold">🛡️</span>
                            <div>
                                <h4 className="text-sm font-extrabold text-amber-950">Mode Pengawas: Verifikasi Berkas (Read-Only)</h4>
                                <p className="text-xs text-amber-800 font-medium mt-0.5">
                                    Hak akses Anda bersifat memantau dan mengaudit dokumen persyaratan pendaftar. Aksi penghapusan berkas dan pengiriman notifikasi hanya dapat dilakukan oleh Administrator.
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
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.5a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Pendaftar</span>
                        <p className="mt-1 text-3xl font-black text-slate-900 dark:text-white">{data.length}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 gsap-stagger-item shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Berkas Lengkap</span>
                        <p className="mt-1 text-3xl font-black text-emerald-600 dark:text-emerald-400">{totalLengkap}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 gsap-stagger-item shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Belum Lengkap</span>
                        <p className="mt-1 text-3xl font-black text-amber-600 dark:text-amber-400">{totalBelum}</p>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 gsap-fade-down shadow-sm">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Cari Nama / NIK</label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                placeholder="Ketik nama atau NIK..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Status Kelengkapan Berkas</label>
                            <select
                                value={verifikasi}
                                onChange={(e) => setVerifikasi(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                            >
                                <option value="">Semua Berkas</option>
                                <option value="lengkap">Lengkap (100%)</option>
                                <option value="belum_lengkap">Belum Lengkap</option>
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

                {/* Document Verification Cards */}
                <div className="space-y-4 gsap-fade-up">
                    {data.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-950">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-700">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-bold text-slate-700 dark:text-slate-300">Tidak Ada Data</h3>
                            <p className="mt-1 text-sm text-slate-500">Tidak ada pendaftar yang sesuai filter pencarian.</p>
                        </div>
                    ) : (
                        data.map((p) => {
                            const completeness = getCompleteness(p.dokumen);
                            const isComplete = completeness.percentage === 100;

                            return (
                                <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
                                    {/* Card Header */}
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-850">
                                        <div className="flex items-center gap-4">
                                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-extrabold text-sm ${
                                                isComplete
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                                            }`}>
                                                {p.nama_lengkap.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{p.nama_lengkap}</h4>
                                                    <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider ${
                                                        isComplete
                                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                                                    }`}>
                                                        {isComplete ? 'Lengkap' : 'Belum Lengkap'}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-medium text-slate-500 mt-0.5">
                                                    NIK: <span className="font-semibold text-slate-700 dark:text-slate-300">{p.nik || '-'}</span> &bull; {p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} &bull; No WA: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{p.no_hp_wali || 'Belum diisi'}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Bar & Progress */}
                                        <div className="flex flex-wrap items-center gap-3">
                                            {/* Progress Bar */}
                                            <div className="text-right mr-2 hidden sm:block">
                                                <span className={`text-xs font-extrabold uppercase tracking-wider ${isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                                    {completeness.uploaded}/{completeness.total} Berkas Wajib
                                                </span>
                                                <div className="mt-1 h-2 w-28 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                                        style={{ width: `${completeness.percentage}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Tombol Beri Pemberitahuan / Minta Kirim Ulang */}
                                            {!isKepalaSekolah && (
                                                <button
                                                    type="button"
                                                    onClick={() => openNotificationModal(p)}
                                                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2 text-xs font-bold shadow-sm shadow-amber-500/20 transition-all active:scale-95"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                                    </svg>
                                                    <span>Pemberitahuan Berkas</span>
                                                </button>
                                            )}

                                            {/* Direct WhatsApp button jika ada nomor */}
                                            {p.no_hp_wali && (
                                                <a
                                                    href={`https://wa.me/${p.no_hp_wali.replace(/\D/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(`Assalamu'alaikum Yth. Wali dari ${p.nama_lengkap}, kami dari Panitia SPMB MI Nurussalam menginfokan terkait berkas pendaftaran calon siswa.`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white px-3 py-2 text-xs font-bold shadow-sm shadow-emerald-500/10 transition-all"
                                                    title="Hubungi Wali via WhatsApp"
                                                >
                                                    <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                                                    </svg>
                                                    <span>WA</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Document Checklist & Delete Action Grid */}
                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                                        {REQUIRED_DOCS.map((doc) => {
                                            const exists = getDocStatus(p.dokumen, doc.type);
                                            const path = p.dokumen?.[doc.type];
                                            const isDeletingThis = loadingAction === `delete_${p.id}_${doc.type}`;

                                            if (exists) {
                                                return (
                                                    <div
                                                        key={doc.type}
                                                        className="flex flex-col justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/30 transition-all hover:shadow-sm"
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <span className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                                </svg>
                                                                {doc.label}
                                                            </span>
                                                        </div>

                                                        {/* Action Buttons for Document */}
                                                        <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-emerald-200/60 dark:border-emerald-900/50">
                                                            <a
                                                                href={`/storage/${path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-emerald-700 shadow-sm hover:bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-800 transition-colors"
                                                            >
                                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                                </svg>
                                                                <span>Lihat</span>
                                                            </a>

                                                            {/* Tombol Hapus Dokumen (Admin Saja) */}
                                                            {!isKepalaSekolah && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteSingleDoc(p, doc)}
                                                                    disabled={isDeletingThis}
                                                                    title={`Hapus file ${doc.label}`}
                                                                    className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1 text-[11px] font-bold text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-700 dark:hover:text-white transition-all active:scale-95 disabled:opacity-50"
                                                                >
                                                                    {isDeletingThis ? (
                                                                        <svg className="h-3 w-3 animate-spin text-rose-600" viewBox="0 0 24 24" fill="none">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                        </svg>
                                                                    ) : (
                                                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                        </svg>
                                                                    )}
                                                                    <span>Hapus</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div
                                                    key={doc.type}
                                                    className={`flex flex-col justify-between rounded-xl border p-3 ${
                                                        doc.optional
                                                            ? 'border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/30'
                                                            : 'border-rose-200 bg-rose-50/50 dark:border-rose-900/50 dark:bg-rose-950/20'
                                                    }`}
                                                >
                                                    <span className={`flex items-center gap-1.5 text-xs font-bold ${
                                                        doc.optional
                                                            ? 'text-slate-500 dark:text-slate-400'
                                                            : 'text-rose-700 dark:text-rose-400'
                                                    }`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4 shrink-0">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                        </svg>
                                                        {doc.label}
                                                    </span>
                                                    <span className="mt-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                                                        {doc.optional ? 'Opsional (Belum diunggah)' : 'Belum Diunggah'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ── Modal Dialog Pemberitahuan Perbaikan Berkas ─────────────────────── */}
            {activeModalPendaftar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-950 shadow-2xl animate-in fade-in zoom-in duration-150">
                        {/* Header Modal */}
                        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white text-xs">⚠️</span>
                                    Pemberitahuan Perbaikan Berkas
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Calon Siswa: <strong className="text-slate-800 dark:text-slate-200">{activeModalPendaftar.nama_lengkap}</strong> (NIK: {activeModalPendaftar.nik || '-'})
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeNotificationModal}
                                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-850 dark:hover:text-slate-300 transition-colors"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmitNotification} className="space-y-5 mt-5">
                            {/* 1. Pilih Dokumen yang Bermasalah */}
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                    1. Pilih Dokumen yang Bermasalah (Salah / Rusak / Blur):
                                </label>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {REQUIRED_DOCS.map((doc) => {
                                        const isUploaded = !!activeModalPendaftar.dokumen?.[doc.type];
                                        const isChecked = selectedFaultyDocs.includes(doc.type);

                                        return (
                                            <label
                                                key={doc.type}
                                                className={`flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer text-xs font-bold transition-all ${
                                                    isChecked
                                                        ? 'border-amber-500 bg-amber-50/80 text-amber-900 dark:border-amber-500 dark:bg-amber-950/40 dark:text-amber-200'
                                                        : isUploaded
                                                            ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                                                            : 'border-slate-200 bg-slate-50/50 opacity-60 text-slate-400 dark:border-slate-800 dark:bg-slate-900/50'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => toggleFaultyDoc(doc.type)}
                                                    className="rounded text-amber-600 focus:ring-amber-500 dark:bg-slate-800"
                                                />
                                                <span className="flex-1">{doc.label}</span>
                                                <span className="text-[10px] font-semibold opacity-75">
                                                    {isUploaded ? '✓ Terunggah' : '✗ Kosong'}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 2. Template Cepat Alasan Perbaikan */}
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    2. Template Alasan / Instruksi Cepat:
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    {QUICK_TEMPLATES.map((tmpl, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => applyTemplate(tmpl.text)}
                                            className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-950/50 transition-colors"
                                        >
                                            {tmpl.title}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 3. Textarea Pesan / Catatan */}
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                                    3. Isi Pesan Notifikasi untuk Siswa:
                                </label>
                                <textarea
                                    value={customMessage}
                                    onChange={(e) => setCustomMessage(e.target.value)}
                                    rows="4"
                                    placeholder="Contoh: Scan Kartu Keluarga buram dan terpotong di bagian NIK. Mohon unggah ulang foto/scan KK yang jelas dan utuh..."
                                    className="w-full rounded-2xl border border-slate-300 bg-white p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                    required
                                />
                                <p className="text-[11px] text-slate-400 mt-1">
                                    💡 Pesan ini akan langsung masuk ke <strong>simbol lonceng notifikasi</strong> di pojok kanan atas akun calon siswa saat login.
                                </p>
                            </div>

                            {/* 4. Opsi Ekstra */}
                            <div className="space-y-2 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={shouldDeleteFiles}
                                        onChange={(e) => setShouldDeleteFiles(e.target.checked)}
                                        className="rounded text-amber-600 focus:ring-amber-500 dark:bg-slate-800"
                                    />
                                    <span>Hapus file dokumen yang dipilih dari server sekarang (siswa langsung melihat status belum diunggah)</span>
                                </label>

                                {activeModalPendaftar.no_hp_wali && (
                                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                        <input
                                            type="checkbox"
                                            checked={shouldSendWa}
                                            onChange={(e) => setShouldSendWa(e.target.checked)}
                                            className="rounded text-emerald-600 focus:ring-emerald-500 dark:bg-slate-800"
                                        />
                                        <span>Kirim juga pemberitahuan via WhatsApp ke wali siswa ({activeModalPendaftar.no_hp_wali})</span>
                                    </label>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-850">
                                <button
                                    type="button"
                                    onClick={closeNotificationModal}
                                    disabled={isSubmittingNotif}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingNotif}
                                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
                                >
                                    {isSubmittingNotif ? (
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
                                            <span>Kirim Pemberitahuan</span>
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
