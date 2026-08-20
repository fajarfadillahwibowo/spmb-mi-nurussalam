import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import WhatsAppAdminButton from '@/Components/WhatsAppAdminButton';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
        return dateString;
    }
};

// ── Biodata Field ─────────────────────────────────────────────────────────────
function BiodataField({ label, value, icon, full = false }) {
    return (
        <div className={`group rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4 transition-all duration-200 hover:border-emerald-200 hover:shadow-sm ${full ? 'sm:col-span-2' : ''}`}>
            <div className="flex items-start gap-3">
                {icon && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
                        {icon}
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{label}</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-800 leading-snug">{value || <span className="text-slate-300 italic font-normal">Tidak diisi</span>}</p>
                </div>
            </div>
        </div>
    );
}

// ── Document Badge ────────────────────────────────────────────────────────────
function DocBadge({ label, path, required = true, index }) {
    const uploaded = !!path;
    return (
        <div className={`flex items-center gap-4 rounded-2xl border p-4 transition-all duration-200 ${
            uploaded
                ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50'
                : required
                ? 'border-amber-200 bg-amber-50/60'
                : 'border-slate-200 bg-slate-50/60'
        }`}>
            {/* number + status icon */}
            <div className="relative shrink-0">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-black text-sm ${
                    uploaded ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : required ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
                }`}>
                    {uploaded ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <span>{index}</span>
                    )}
                </div>
                {uploaded && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-2 ring-emerald-500 text-[8px] font-black text-emerald-600">✓</span>}
            </div>

            {/* label & status */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-extrabold ${uploaded ? 'text-emerald-800' : required ? 'text-amber-800' : 'text-slate-600'}`}>{label}</p>
                <p className={`text-xs font-medium mt-0.5 ${uploaded ? 'text-emerald-600' : required ? 'text-amber-600' : 'text-slate-400'}`}>
                    {uploaded ? 'Berkas telah diunggah & siap diverifikasi' : required ? 'Wajib — belum diunggah' : 'Opsional — belum diunggah'}
                </p>
            </div>

            {/* action */}
            {uploaded ? (
                <a href={`/storage/${path}`} target="_blank" rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    Lihat
                </a>
            ) : (
                <Link href={route('dokumen.index')}
                    className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                        required
                            ? 'bg-amber-500 text-white hover:bg-amber-400'
                            : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    Unggah
                </Link>
            )}
        </div>
    );
}

// ── Completeness Score Card ────────────────────────────────────────────────────
function CompletenessCard({ bioScore, docScore, bioTotal, docTotal }) {
    const totalFilled = bioScore + docScore;
    const totalMax = bioTotal + docTotal;
    const overall = Math.round((totalFilled / totalMax) * 100);

    return (
        <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white">
            <div className="px-6 pt-6 pb-4">
                <h4 className="text-sm font-extrabold text-slate-900">Kelengkapan Berkas</h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Skor keseluruhan kelengkapan pendaftaran Anda</p>
            </div>
            <div className="px-6 pb-6 space-y-5">
                {/* Overall score */}
                <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0">
                        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 80 80">
                            <circle cx="40" cy="40" r="32" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                            <circle
                                cx="40" cy="40" r="32"
                                fill="none"
                                stroke={overall >= 80 ? '#10b981' : overall >= 50 ? '#f59e0b' : '#ef4444'}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 32}`}
                                strokeDashoffset={`${2 * Math.PI * 32 * (1 - overall / 100)}`}
                                style={{ transition: 'stroke-dashoffset 1.2s ease-in-out' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-base font-black text-slate-800">{overall}<span className="text-[9px]">%</span></span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-slate-500 mb-3">Rincian:</p>
                        <div className="space-y-2">
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-slate-600">Biodata</span>
                                    <span className={bioScore === bioTotal ? 'text-emerald-600' : 'text-amber-600'}>{bioScore}/{bioTotal}</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                                        style={{ width: `${(bioScore / bioTotal) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-slate-600">Dokumen</span>
                                    <span className={docScore === docTotal ? 'text-emerald-600' : 'text-amber-600'}>{docScore}/{docTotal}</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-blue-500 transition-all duration-1000"
                                        style={{ width: `${(docScore / docTotal) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status message */}
                <div className={`rounded-2xl p-3 text-xs font-semibold leading-relaxed ${
                    overall === 100
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : overall >= 50
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                    {overall === 100
                        ? '✅ Semua data lengkap! Berkas Anda siap untuk diverifikasi oleh panitia.'
                        : overall >= 50
                        ? '⚠️ Hampir lengkap! Segera lengkapi data yang masih kosong agar proses berjalan lancar.'
                        : '❌ Data belum lengkap. Mohon isi biodata dan unggah dokumen yang diperlukan.'}
                </div>
            </div>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function SeleksiSiswa({ pendaftaran }) {
    const dokumen = pendaftaran?.dokumen;
    const containerRef = useRef();

    // ── Calculate scores ──────────────────────────────────────────────────────
    const biodataFields = [
        pendaftaran?.nama_lengkap,
        pendaftaran?.nik,
        pendaftaran?.jenis_kelamin,
        pendaftaran?.tempat_lahir,
        pendaftaran?.tanggal_lahir,
        pendaftaran?.alamat,
        pendaftaran?.nama_orang_tua,
        pendaftaran?.no_hp_wali,
    ];
    const bioScore = biodataFields.filter(Boolean).length;
    const bioTotal = biodataFields.length;

    const requiredDocs = [dokumen?.kartu_keluarga_path, dokumen?.identitas_ortu_path, dokumen?.akta_kelahiran_path, dokumen?.ijazah_path];
    const docScore = requiredDocs.filter(Boolean).length;
    const docTotal = requiredDocs.length;

    const allDocsComplete = docScore === docTotal;
    const allBioComplete = bioScore === bioTotal;

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.anim-up').forEach((el, i) => {
                gsap.fromTo(el,
                    { y: 35, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.65, delay: i * 0.07, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' } }
                );
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    if (!pendaftaran) {
        return (
            <AuthenticatedLayout header="Seleksi">
                <Head title="Seleksi | SPMB MI Nurussalam" />
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-10 w-10 text-slate-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-700">Belum Ada Biodata</h3>
                        <p className="mt-2 text-sm text-slate-400 max-w-xs leading-relaxed">
                            Anda belum mengisi formulir pendaftaran. Silakan isi biodata terlebih dahulu untuk memulai proses pendaftaran.
                        </p>
                    </div>
                    <Link href={route('pendaftaran.index')}
                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-200 hover:from-emerald-500 hover:to-teal-500 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                        </svg>
                        Isi Biodata Sekarang
                    </Link>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout header="Seleksi">
            <Head title="Seleksi | SPMB MI Nurussalam" />
            <div ref={containerRef} className="space-y-6">

                {/* ── Hero Banner ─────────────────────────────────────────── */}
                <div className="anim-up relative overflow-hidden rounded-3xl text-white" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f4c35 100%)' }}>
                    <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full opacity-10" style={{ background: '#059669' }} />
                    <div className="pointer-events-none absolute right-28 bottom-0 h-28 w-28 rounded-full opacity-10" style={{ background: '#34d399' }} />

                    <div className="relative flex flex-col md:flex-row md:items-center gap-6 p-6 md:p-8">
                        <div className="flex-1">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur-sm mb-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Seleksi Kelengkapan Berkas
                            </span>
                            <h3 className="text-2xl font-extrabold tracking-tight">{pendaftaran.nama_lengkap}</h3>
                            <p className="mt-1 text-sm text-slate-300 font-medium">NIK: {pendaftaran.nik || <span className="italic opacity-60">Belum diisi</span>}</p>
                        </div>
                        <div className="flex gap-3">
                            {/* Bio status chip */}
                            <div className={`flex flex-col items-center rounded-2xl px-5 py-3 text-center ${allBioComplete ? 'bg-emerald-500/20 border border-emerald-400/30' : 'bg-amber-500/20 border border-amber-400/30'}`}>
                                <span className="text-2xl font-black">{bioScore}<span className="text-base text-white/60">/{bioTotal}</span></span>
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-0.5">Biodata</span>
                            </div>
                            {/* Doc status chip */}
                            <div className={`flex flex-col items-center rounded-2xl px-5 py-3 text-center ${allDocsComplete ? 'bg-emerald-500/20 border border-emerald-400/30' : 'bg-amber-500/20 border border-amber-400/30'}`}>
                                <span className="text-2xl font-black">{docScore}<span className="text-base text-white/60">/{docTotal}</span></span>
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-0.5">Dokumen</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom action bar */}
                    <div className="relative border-t border-white/10 px-6 py-3 md:px-8 flex items-center justify-between gap-4">
                        <p className="text-xs text-slate-300 font-medium">
                            Silakan periksa & lengkapi semua data di bawah sebelum batas waktu pendaftaran.
                        </p>
                        <div className="flex gap-2 shrink-0">
                            <Link href={route('pendaftaran.index')} className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 text-xs font-bold text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
                                </svg>
                                Edit Biodata
                            </Link>
                            <Link href={route('dokumen.index')} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-3 py-2 text-xs font-bold text-white transition-colors shadow-md shadow-emerald-900/50">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                </svg>
                                Unggah Dokumen
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Main Grid ───────────────────────────────────────────── */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* Left col: Biodata + Dokumen */}
                    <div className="xl:col-span-2 space-y-6">

                        {/* Biodata Card */}
                        <div className="anim-up rounded-3xl border border-slate-200 bg-white overflow-hidden">
                            {/* Card header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${allBioComplete ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-extrabold text-slate-900">Data Biodata Diri</h4>
                                        <p className="text-xs text-slate-400 font-medium">Formulir pendaftaran calon murid</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-extrabold ${allBioComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {allBioComplete ? '✓ Lengkap' : `${bioScore}/${bioTotal} Terisi`}
                                    </span>
                                    <Link href={route('pendaftaran.index')} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
                                        </svg>
                                        Edit
                                    </Link>
                                </div>
                            </div>

                            {/* Biodata fields grid */}
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <BiodataField label="Nama Lengkap" value={pendaftaran.nama_lengkap}
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" /></svg>}
                                />
                                <BiodataField label="NIK (No. Induk Kependudukan)" value={pendaftaran.nik}
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" /></svg>}
                                />
                                <BiodataField label="Jenis Kelamin" value={pendaftaran.jenis_kelamin === 'L' ? 'Laki-laki' : pendaftaran.jenis_kelamin === 'P' ? 'Perempuan' : null}
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>}
                                />
                                <BiodataField label="Tempat Lahir" value={pendaftaran.tempat_lahir}
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>}
                                />
                                <BiodataField label="Tanggal Lahir" value={formatDate(pendaftaran.tanggal_lahir)}
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>}
                                />
                                <BiodataField label="Asal Sekolah / RA / TK" value={pendaftaran.asal_sekolah}
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-1.342" /></svg>}
                                />
                                <BiodataField label="Nama Orang Tua / Wali" value={pendaftaran.nama_orang_tua}
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94-3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>}
                                />
                                <BiodataField label="No. HP / WhatsApp Wali" value={pendaftaran.no_hp_wali}
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>}
                                />
                                <BiodataField label="Alamat Lengkap" value={pendaftaran.alamat} full
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" /></svg>}
                                />
                            </div>

                            {/* Incomplete warning */}
                            {!allBioComplete && (
                                <div className="mx-6 mb-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 shrink-0 text-amber-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                    </svg>
                                    <p className="text-xs font-semibold text-amber-800">
                                        Terdapat {bioTotal - bioScore} kolom biodata yang belum terisi. <Link href={route('pendaftaran.index')} className="font-extrabold underline underline-offset-2">Lengkapi sekarang →</Link>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Dokumen Card */}
                        <div className="anim-up rounded-3xl border border-slate-200 bg-white overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${allDocsComplete ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-extrabold text-slate-900">Berkas Dokumen</h4>
                                        <p className="text-xs text-slate-400 font-medium">Status unggah dokumen persyaratan</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-extrabold ${allDocsComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {allDocsComplete ? '✓ Lengkap' : `${docScore}/${docTotal} Terunggah`}
                                    </span>
                                    <Link href={route('dokumen.index')} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                        </svg>
                                        Kelola
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6 space-y-3">
                                <DocBadge index={1} label="Scan Kartu Keluarga (KK)" path={dokumen?.kartu_keluarga_path} required />
                                <DocBadge index={2} label="Scan KTP Orang Tua / Wali" path={dokumen?.identitas_ortu_path} required />
                                <DocBadge index={3} label="Scan Akta Kelahiran" path={dokumen?.akta_kelahiran_path} required />
                                <DocBadge index={4} label="Scan Ijazah / Surat Keterangan RA/TK" path={dokumen?.ijazah_path} required />

                                {/* Divider for optional */}
                                <div className="flex items-center gap-3 py-1">
                                    <div className="h-px flex-1 bg-slate-100" />
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300">Opsional</span>
                                    <div className="h-px flex-1 bg-slate-100" />
                                </div>

                                <DocBadge index={5} label="Kartu PKH / KKS / Jaminan Sosial" path={dokumen?.pkh_kks_path} required={false} />
                            </div>

                            {/* Persyaratan info box */}
                            <div className="mx-6 mb-6 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 flex gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 shrink-0 text-blue-500 mt-0.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                </svg>
                                <p className="text-xs font-semibold text-blue-800 leading-relaxed">
                                    Format berkas: <strong>PDF, JPG, atau PNG</strong> — ukuran maksimal <strong>2 MB</strong> per file. Pastikan gambar/scan terbaca dengan jelas sebelum diunggah.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right col: Scores + Tips */}
                    <div className="space-y-6">
                        <div className="anim-up">
                            <CompletenessCard bioScore={bioScore} docScore={docScore} bioTotal={bioTotal} docTotal={docTotal} />
                        </div>

                        {/* Quick checklist */}
                        <div className="anim-up rounded-3xl border border-slate-200 bg-white p-6">
                            <h4 className="text-sm font-extrabold text-slate-900 mb-4">Daftar Periksa Mandiri</h4>
                            <div className="space-y-3">
                                {[
                                    { label: 'Biodata diri sudah terisi', done: allBioComplete },
                                    { label: 'KK sudah diunggah', done: !!dokumen?.kartu_keluarga_path },
                                    { label: 'KTP orang tua sudah diunggah', done: !!dokumen?.identitas_ortu_path },
                                    { label: 'Akta kelahiran sudah diunggah', done: !!dokumen?.akta_kelahiran_path },
                                    { label: 'Ijazah/SKTK sudah diunggah', done: !!dokumen?.ijazah_path },
                                    { label: 'Bukti pembayaran sudah diunggah', done: !!pendaftaran?.bukti_pembayaran_path },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${item.done ? 'bg-emerald-500 text-white' : 'border-2 border-slate-200'}`}>
                                            {item.done && (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="h-3 w-3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className={`text-xs font-semibold ${item.done ? 'text-slate-700 line-through decoration-emerald-400' : 'text-slate-500'}`}>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="anim-up rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                                    </svg>
                                </div>
                                <h4 className="text-sm font-extrabold text-emerald-900">Tips Pendaftaran</h4>
                            </div>
                            <ul className="space-y-2.5 text-xs font-medium text-emerald-800">
                                <li className="flex items-start gap-2"><span className="text-emerald-500 font-black mt-0.5">›</span> Pastikan nama di biodata sama persis dengan akta kelahiran.</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 font-black mt-0.5">›</span> Scan dokumen dengan kualitas yang jelas dan tidak buram.</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 font-black mt-0.5">›</span> Unggah semua dokumen wajib sebelum batas waktu pendaftaran.</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 font-black mt-0.5">›</span> Pantau halaman Pengumuman secara berkala untuk melihat hasil seleksi.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <WhatsAppAdminButton pageName="Seleksi" />
        </AuthenticatedLayout>
    );
}
