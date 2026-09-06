import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WaStatusBadge from '@/Components/WaStatusBadge';
import EmailStatusBadge from '@/Components/EmailStatusBadge';

gsap.registerPlugin(ScrollTrigger);

// ── Komponen Banner Notifikasi WhatsApp ─────────────────────────────────────
function WaBanner({ message }) {
    const [visible, setVisible] = useState(true);
    const ref = useRef(null);

    useEffect(() => {
        // Animate masuk
        gsap.fromTo(ref.current,
            { opacity: 0, y: -16 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
        );
        // Auto-dismiss setelah 6 detik
        const timer = setTimeout(() => {
            gsap.to(ref.current, {
                opacity: 0, y: -12, duration: 0.4, ease: 'power2.in',
                onComplete: () => setVisible(false),
            });
        }, 6000);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div ref={ref} className="flex items-start gap-3 rounded-2xl border border-emerald-200/60 bg-emerald-50 px-5 py-4 dark:border-emerald-800/50 dark:bg-emerald-950/50">
            {/* WA Icon */}
            <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-[#25D366] shadow-md shadow-[#25D366]/30">
                <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
            </div>
            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">{message}</p>
                <p className="mt-0.5 text-xs text-emerald-600/70 dark:text-emerald-400/70">Pesan dikirim otomatis ke nomor WhatsApp wali siswa via background job.</p>
            </div>
            {/* Close button */}
            <button onClick={() => setVisible(false)} className="shrink-0 text-emerald-400 hover:text-emerald-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
// ───────────────────────────────────────────────────────────────────────────

export default function Seleksi({ pendaftarans, filters, status }) {
    const [search, setSearch] = useState(filters.search || '');
    const [filterStatus, setFilterStatus] = useState(filters.status || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('seleksi.index'), { search, status: filterStatus }, { preserveState: true });
    };

    const handleStatusFilter = (val) => {
        setFilterStatus(val);
        router.get(route('seleksi.index'), { search, status: val }, { preserveState: true });
    };

    // Helper to format date
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const statusBadge = (stat) => {
        const classes = {
            belum_lengkap: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/50',
            menunggu_verifikasi: 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/50',
            proses_seleksi: 'bg-purple-50 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200/50 dark:border-purple-900/50',
            lulus: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/50 font-extrabold',
            tidak_lulus: 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-400 border-red-200/50 dark:border-red-900/50',
        };
        const text = {
            belum_lengkap: 'Belum Lengkap',
            menunggu_verifikasi: 'Menunggu Verifikasi',
            proses_seleksi: 'Proses Seleksi',
            lulus: 'Lulus',
            tidak_lulus: 'Tidak Lulus',
        };
        return (
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${classes[stat]}`}>
                {text[stat]}
            </span>
        );
    };

    useEffect(() => {
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
    }, []);

    return (
        <AuthenticatedLayout header="Seleksi Calon Siswa">
            <Head title="Seleksi Calon Siswa | SPMB MI Nurussalam" />

            <div className="space-y-6">
                {status && (
                    <WaBanner message={status} />
                )}

                {/* Filter and Search Bar */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-850 dark:bg-slate-950 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 gsap-fade-down">
                    <form onSubmit={handleSearch} className="flex-1 flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Cari nama lengkap..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                        />
                        <button type="submit" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors">
                            Cari
                        </button>
                    </form>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-450 uppercase tracking-wider shrink-0">Filter Status:</span>
                        <select
                            value={filterStatus}
                            onChange={(e) => handleStatusFilter(e.target.value)}
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                        >
                            <option value="">Semua Status</option>
                            <option value="belum_lengkap">Belum Lengkap</option>
                            <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
                            <option value="proses_seleksi">Proses Seleksi</option>
                            <option value="lulus">Lulus</option>
                            <option value="tidak_lulus">Tidak Lulus</option>
                        </select>
                    </div>
                </div>

                {/* Table Data */}
                <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden dark:border-slate-850 dark:bg-slate-950 shadow-sm gsap-fade-up">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-900/60">
                                <tr>
                                    <th className="px-6 py-4">Nama Lengkap</th>
                                    <th className="px-6 py-4">L/P</th>
                                    <th className="px-6 py-4">Orang Tua / Wali</th>
                                    <th className="px-6 py-4">No. HP Wali</th>
                                    <th className="px-6 py-4">Tgl Daftar</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                                {pendaftarans.data.length > 0 ? (
                                    pendaftarans.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{item.nama_lengkap}</td>
                                            <td className="px-6 py-4 font-semibold">{item.jenis_kelamin}</td>
                                            <td className="px-6 py-4 font-semibold">{item.nama_orang_tua}</td>
                                            <td className="px-6 py-4 font-semibold">{item.no_hp_wali}</td>
                                            <td className="px-6 py-4 font-semibold">{formatDate(item.created_at)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    {statusBadge(item.status)}
                                                    {item.status === 'lulus' && (
                                                        <>
                                                            <WaStatusBadge
                                                                status={item.status_wa_lulus || 'belum_terkirim'}
                                                                sentAt={item.wa_lulus_sent_at}
                                                                className="mt-0.5"
                                                            />
                                                            <EmailStatusBadge
                                                                status={item.status_email_lulus || 'belum_terkirim'}
                                                                sentAt={item.email_lulus_sent_at}
                                                                className="mt-0.5"
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Link
                                                    href={route('seleksi.show', item.id)}
                                                    className="inline-flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 px-3.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
                                                >
                                                    Tinjau Berkas
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-semibold">
                                            Tidak ada data pendaftar ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Links */}
                    {pendaftarans.links && pendaftarans.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/10">
                            <div className="flex gap-2">
                                {pendaftarans.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-xs font-bold transition-colors ${
                                            link.active
                                                ? 'bg-emerald-600 text-white'
                                                : link.url
                                                ? 'text-slate-655 bg-white border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 dark:text-slate-350'
                                                : 'text-slate-300 cursor-not-allowed border border-slate-200/50 bg-white/50 dark:border-slate-850 dark:bg-slate-950/50'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
