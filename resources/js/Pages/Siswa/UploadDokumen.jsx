import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import WhatsAppAdminButton from '@/Components/WhatsAppAdminButton';
import { Head, router } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Definisi Konfigurasi Dokumen ─────────────────────────────────────────────
const DOCUMENT_CONFIGS = [
    {
        id: 'kartu_keluarga',
        pathKey: 'kartu_keluarga_path',
        title: 'Scan Kartu Keluarga (KK)',
        subtitle: 'Pastikan seluruh anggota keluarga dan nomor KK terbaca jelas.',
        required: true,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94-3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
        ),
    },
    {
        id: 'identitas_ortu',
        pathKey: 'identitas_ortu_path',
        title: 'Scan KTP Orang Tua / Wali',
        subtitle: 'Foto atau scan KTP Ayah, Ibu, atau Wali yang masih berlaku.',
        required: true,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
            </svg>
        ),
    },
    {
        id: 'akta_kelahiran',
        pathKey: 'akta_kelahiran_path',
        title: 'Scan Akta Kelahiran Calon Siswa',
        subtitle: 'Dokumen resmi akta kelahiran calon peserta didik baru.',
        required: true,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
        ),
    },
    {
        id: 'ijazah',
        pathKey: 'ijazah_path',
        title: 'Scan Ijazah / SKHU RA/TK',
        subtitle: 'Ijazah atau Surat Keterangan Lulus dari jenjang RA / TK.',
        required: true,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-5.25 6.557q0 .178.01.355m5.24-6.912a55.38 55.38 0 0 1 5.25 2.887V15a.75.75 0 1 1-1.5 0v-2.25" />
            </svg>
        ),
    },
    {
        id: 'pkh_kks',
        pathKey: 'pkh_kks_path',
        title: 'Scan Kartu PKH / KKS / Jaminan Sosial',
        subtitle: 'Kartu Program Keluarga Harapan / KKS / KIP (Opsional jalur afirmasi).',
        required: false,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25M21 11.25V6.75A2.25 2.25 0 0 0 18.75 4.5H5.25A2.25 2.25 0 0 0 3 6.75v4.5m18 0H3m6 6h6" />
            </svg>
        ),
    },
];

// ─── Komponen Item Kartu Dokumen (Mandiri Per File) ────────────────────────────
function DocumentCard({ cfg, currentPath, index }) {
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [clientError, setClientError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const hasUploaded = Boolean(currentPath);

    // Reset pilihan file saat path berubah dari server
    useEffect(() => {
        setSelectedFile(null);
        setIsEditing(false);
        setClientError(null);
    }, [currentPath]);

    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const maxSize = 2 * 1024 * 1024; // 2MB
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

        if (file.size > maxSize) {
            setClientError('Ukuran berkas melebihi batas maksimal 2 MB.');
            setSelectedFile(null);
            e.target.value = null;
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            setClientError('Format berkas tidak didukung. Harap pilih file PDF, JPG, atau PNG.');
            setSelectedFile(null);
            e.target.value = null;
            return;
        }

        setClientError(null);
        setSelectedFile(file);
    };

    // Aksi: Simpan berkas individual
    const handleSave = (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append(cfg.id, selectedFile);

        setIsLoading(true);
        router.post(route('dokumen.store'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = null;
            },
            onError: (errs) => {
                const msg = errs[cfg.id] || 'Terjadi kesalahan saat mengunggah berkas.';
                setClientError(msg);
            },
            onFinish: () => {
                setIsLoading(false);
            },
        });
    };

    // Aksi: Hapus berkas individual
    const handleDelete = () => {
        Swal.fire({
            title: `Hapus ${cfg.title}?`,
            text: 'Berkas yang telah dihapus harus diunggah ulang agar memenuhi persyaratan pendaftaran.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus Berkas',
            cancelButtonText: 'Batal',
            background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
            color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#1e293b',
            customClass: {
                popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl',
                confirmButton: 'rounded-xl font-bold px-5 py-2.5',
                cancelButton: 'rounded-xl font-bold px-5 py-2.5',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true);
                router.delete(route('dokumen.destroy'), {
                    data: { doc_type: cfg.pathKey },
                    preserveScroll: true,
                    onFinish: () => {
                        setIsLoading(false);
                    },
                });
            }
        });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setSelectedFile(null);
        setClientError(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 gsap-stagger-item">
            {/* Header Kartu */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-850">
                <div className="flex items-start gap-3.5">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                        hasUploaded
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400'
                    }`}>
                        {cfg.icon}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-400 tracking-wider">#{index + 1}</span>
                            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                                {cfg.title}
                            </h4>
                            {cfg.required ? (
                                <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-700 border border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50">
                                    Wajib
                                </span>
                            ) : (
                                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                                    Opsional
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                            {cfg.subtitle}
                        </p>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="sm:self-center shrink-0">
                    {hasUploaded ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Terunggah
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                            Belum Ada Berkas
                        </span>
                    )}
                </div>
            </div>

            {/* Body Kartu */}
            <div className="pt-4">
                {/* STATE 1: Berkas sudah ada & tidak sedang dalam mode edit */}
                {hasUploaded && !isEditing ? (
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-200/70 dark:bg-slate-900/50 dark:border-slate-800/60">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm border border-slate-200 dark:bg-slate-950 dark:border-slate-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                </div>
                                <div className="truncate">
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                                        Berkas telah tersimpan di sistem
                                    </span>
                                    <span className="text-[11px] text-slate-500 font-medium block">
                                        Format PDF / Gambar • Siap diverifikasi
                                    </span>
                                </div>
                            </div>
                            <a
                                href={`/storage/${currentPath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 transition-colors shadow-sm shrink-0"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-3.5 w-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                Lihat Berkas
                            </a>
                        </div>

                        {/* Menu Aksi Per File: Edit / Ganti & Hapus */}
                        <div className="flex items-center justify-end gap-2.5 pt-1">
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                disabled={isLoading}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-3.5 w-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                                Edit / Ganti Berkas
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/80 transition-all shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-3.5 w-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                Hapus
                            </button>
                        </div>
                    </div>
                ) : (
                    /* STATE 2: Belum ada berkas ATAU sedang dalam mode edit (ganti) */
                    <form onSubmit={handleSave} className="space-y-4">
                        {/* Selector Area */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                                selectedFile
                                    ? 'border-emerald-400 bg-emerald-50/40 dark:border-emerald-600 dark:bg-emerald-950/20'
                                    : 'border-slate-300 bg-slate-50/60 hover:border-emerald-400 hover:bg-emerald-50/20 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-emerald-600'
                            }`}
                        >
                            <input
                                ref={fileInputRef}
                                id={`file-${cfg.id}`}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {selectedFile ? (
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white max-w-xs truncate">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                            Ukuran: {formatFileSize(selectedFile.size)} • Siap Disimpan
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-medium text-slate-400 hover:underline">
                                        Klik untuk memilih file lain
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-emerald-950 dark:group-hover:text-emerald-300 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            {isEditing ? 'Pilih file baru pengganti' : 'Klik untuk memilih berkas'}
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            Format: PDF, JPG, PNG (Maks. 2 MB)
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Error Message */}
                        {clientError && (
                            <p className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                                <span>⚠️</span> {clientError}
                            </p>
                        )}

                        {/* Tombol Aksi Simpan & Batal (1 per 1) */}
                        <div className="flex items-center justify-end gap-2.5 pt-2">
                            {(isEditing || selectedFile) && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    disabled={isLoading}
                                    className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
                                >
                                    Batal
                                </button>
                            )}

                            <button
                                type="submit"
                                disabled={!selectedFile || isLoading}
                                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold text-white transition-all shadow-md ${
                                    selectedFile && !isLoading
                                        ? 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 shadow-emerald-600/30'
                                        : 'bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600 shadow-none'
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="h-3.5 w-3.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                        </svg>
                                        Simpan {cfg.title.split(' ')[1] || 'Berkas'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function UploadDokumen({ dokumen, status, error }) {
    const containerRef = useRef(null);

    // Hitung rekap kelengkapan dokumen wajib (4 dokumen)
    const requiredDocs = DOCUMENT_CONFIGS.filter(d => d.required);
    const uploadedRequiredCount = requiredDocs.filter(d => Boolean(dokumen?.[d.pathKey])).length;
    const isAllRequiredUploaded = uploadedRequiredCount === requiredDocs.length;
    const progressPct = Math.round((uploadedRequiredCount / requiredDocs.length) * 100);

    useEffect(() => {
        const animations = [
            { class: '.gsap-fade-up', vars: { y: 40 } },
            { class: '.gsap-fade-down', vars: { y: -40 } },
        ];
        animations.forEach(({ class: className, vars }) => {
            gsap.utils.toArray(className).forEach((el) => {
                gsap.fromTo(el,
                    { ...vars, opacity: 0 },
                    { x: 0, y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' } }
                );
            });
        });

        gsap.utils.toArray('.gsap-stagger-container').forEach((container) => {
            const items = container.querySelectorAll('.gsap-stagger-item');
            gsap.fromTo(items,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: container, start: 'top 85%', toggleActions: 'play none none none' } }
            );
        });
    }, []);

    // Flash message pop-up via SweetAlert2
    useEffect(() => {
        if (status) {
            Swal.fire({
                title: 'Berhasil!',
                text: status,
                icon: 'success',
                confirmButtonColor: '#059669',
                background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
                color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#1e293b',
                customClass: {
                    popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl',
                    confirmButton: 'rounded-xl font-bold px-6 py-2.5 shadow-sm',
                }
            });
        }
    }, [status]);

    useEffect(() => {
        if (error) {
            Swal.fire({
                title: 'Pemberitahuan',
                text: error,
                icon: 'warning',
                confirmButtonColor: '#d97706',
                background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
                color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#1e293b',
                customClass: {
                    popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl',
                    confirmButton: 'rounded-xl font-bold px-6 py-2.5 shadow-sm',
                }
            });
        }
    }, [error]);

    return (
        <AuthenticatedLayout header="Upload Dokumen Persyaratan">
            <Head title="Upload Dokumen | SPMB MI Nurussalam" />

            <div ref={containerRef} className="mx-auto max-w-4xl space-y-6">

                {/* ── Banner Ringkasan Kelengkapan Berkas ───────────────────────────── */}
                <div className="rounded-3xl bg-gradient-to-br from-[#003333] via-[#004444] to-[#0d5555] p-6 md:p-8 text-white shadow-xl relative overflow-hidden gsap-fade-down">
                    {/* Hiasan background */}
                    <div className="pointer-events-none absolute -right-8 -top-8 h-44 w-44 rounded-full opacity-10" style={{ background: '#99CC33' }} />
                    <div className="pointer-events-none absolute right-24 -bottom-10 h-32 w-32 rounded-full opacity-10 bg-white" />

                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-lg">
                            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider bg-white/10 text-[#99CC33] border border-white/10">
                                📁 Langkah 2 dari 5 SPMB
                            </span>
                            <h2 className="text-2xl font-black tracking-tight text-white">
                                Unggah Dokumen Persyaratan
                            </h2>
                            <p className="text-xs text-white/80 leading-relaxed font-medium">
                                Unggah berkas persyaratan 1 per 1 di bawah ini. Anda dapat mengedit atau menghapus berkas kapan saja sebelum masa verifikasi berkas ditutup.
                            </p>
                        </div>

                        {/* Progress Meter */}
                        <div className="flex flex-col sm:items-end justify-center bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 min-w-[200px]">
                            <div className="flex items-center justify-between w-full mb-1.5">
                                <span className="text-xs font-bold text-white/80">Kelengkapan</span>
                                <span className="text-sm font-black text-[#99CC33]">{progressPct}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-black/20 overflow-hidden mb-2">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${progressPct}%`, background: '#99CC33' }}
                                />
                            </div>
                            <span className="text-[11px] font-bold text-white/90">
                                {uploadedRequiredCount} dari {requiredDocs.length} Dokumen Wajib
                            </span>
                        </div>
                    </div>

                    {/* Alert info otomatis */}
                    {isAllRequiredUploaded ? (
                        <div className="mt-5 flex items-center gap-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-2.5 text-xs font-bold text-emerald-200">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-emerald-300">
                                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                            </svg>
                            <span>Selamat! Seluruh dokumen wajib telah lengkap dan siap diverifikasi oleh panitia SPMB.</span>
                        </div>
                    ) : (
                        <div className="mt-5 flex items-center gap-2.5 rounded-xl bg-amber-500/20 border border-amber-400/30 px-4 py-2.5 text-xs font-bold text-amber-200">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-amber-300">
                                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                            </svg>
                            <span>Masih ada {requiredDocs.length - uploadedRequiredCount} dokumen wajib yang belum diunggah. Silakan lengkapi di bawah.</span>
                        </div>
                    )}
                </div>

                {/* ── Petunjuk Format & Aturan Berkas ─────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 dark:bg-slate-950 dark:border-slate-850 dark:text-slate-400 gsap-fade-up">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold dark:bg-emerald-950 dark:text-emerald-400">
                            💡
                        </span>
                        <span>
                            File yang didukung: <strong className="text-slate-800 dark:text-slate-200 font-bold">PDF, JPG, JPEG, PNG</strong> dengan ukuran maksimal <strong className="text-slate-800 dark:text-slate-200 font-bold">2 MB</strong> per berkas.
                        </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                        Disimpan mandiri per berkas
                    </span>
                </div>

                {/* ── Daftar Kartu Dokumen (1 per 1) ───────────────────────────────── */}
                <div className="space-y-4 gsap-stagger-container">
                    {DOCUMENT_CONFIGS.map((cfg, idx) => (
                        <DocumentCard
                            key={cfg.id}
                            cfg={cfg}
                            currentPath={dokumen?.[cfg.pathKey]}
                            index={idx}
                        />
                    ))}
                </div>
            </div>

            <WhatsAppAdminButton pageName="Upload Dokumen" />
        </AuthenticatedLayout>
    );
}
