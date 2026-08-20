import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LaporanSiswa({ pendaftaran, stats }) {
    const seleksi = pendaftaran?.seleksi;

    const getStatusLabel = (status) => {
        switch (status) {
            case 'lulus': return 'Lulus';
            case 'tidak_lulus': return 'Tidak Lulus';
            default: return 'Menunggu Verifikasi';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'lulus':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400';
            case 'tidak_lulus':
                return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400';
            default:
                return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400';
        }
    };

    // Calculate percentage values for the donut chart
    const total = stats?.total_pendaftar || 1;
    const lulusPercentage = Math.round(((stats?.lulus || 0) / total) * 100);
    const tidakLulusPercentage = Math.round(((stats?.tidak_lulus || 0) / total) * 100);
    const menungguPercentage = Math.round(((stats?.menunggu || 0) / total) * 100);

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
        <AuthenticatedLayout header="Laporan">
            <Head title="Laporan" />

            <div className="space-y-8">
                {/* Personal Summary Card */}
                {pendaftaran ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950 gsap-fade-right">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-md shadow-emerald-500/10">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Ringkasan Pendaftaran Anda</h3>
                                <p className="text-xs font-medium text-slate-500">Data pribadi dan status terkini</p>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Nama</span>
                                <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">{pendaftaran.nama_lengkap}</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">NIK</span>
                                <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">{pendaftaran.nik || '-'}</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Asal Sekolah</span>
                                <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">{pendaftaran.asal_sekolah || '-'}</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Status</span>
                                <p className="mt-2">
                                    <span className={`inline-flex rounded-lg px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider ${getStatusBadge(pendaftaran.status)}`}>
                                        {getStatusLabel(pendaftaran.status)}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Document completeness */}
                        <div className="mt-6">
                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Kelengkapan Berkas</h4>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {[
                                    { label: 'Akta Kelahiran', field: 'akta_kelahiran_path' },
                                    { label: 'Kartu Keluarga', field: 'kartu_keluarga_path' },
                                    { label: 'Identitas Orang Tua', field: 'identitas_ortu_path' },
                                    { label: 'Ijazah TK/RA', field: 'ijazah_path' },
                                    { label: 'PKH/KKS (Opsional)', field: 'pkh_kks_path', optional: true },
                                ].map((doc) => {
                                    const exists = !!pendaftaran.dokumen?.[doc.field];
                                    return (
                                        <div key={doc.field} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                                            exists
                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                                : doc.optional
                                                    ? 'bg-slate-50 text-slate-450 dark:bg-slate-900 dark:text-slate-650'
                                                    : 'bg-rose-50/50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
                                        }`}>
                                            {exists ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                </svg>
                                            ) : doc.optional ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-600">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5 shrink-0 text-rose-500">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                            {doc.label}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Evaluator notes */}
                        {seleksi?.catatan && (
                            <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/40">
                                <div className="flex items-start gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0 text-blue-500 mt-0.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                    </svg>
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Catatan dari Evaluator</span>
                                        <p className="mt-1 text-sm font-medium text-blue-800 dark:text-blue-300">{seleksi.catatan}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-950">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-700">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-bold text-slate-700 dark:text-slate-300">Belum Ada Data</h3>
                        <p className="mt-1 text-sm text-slate-500">Silakan lakukan pendaftaran terlebih dahulu.</p>
                    </div>
                )}

                {/* Public Statistics */}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-md shadow-violet-500/10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Statistik Penerimaan</h3>
                            <p className="text-xs font-medium text-slate-500">Ringkasan data SPMB keseluruhan</p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Total Pendaftar */}
                        <div className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 transition-all hover:shadow-lg hover:shadow-slate-200/50 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 dark:hover:shadow-slate-900/50">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                </svg>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Pendaftar</span>
                            <p className="mt-1 text-3xl font-black text-slate-900 dark:text-white">{stats?.total_pendaftar || 0}</p>
                        </div>

                        {/* Lulus */}
                        <div className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 transition-all hover:shadow-lg hover:shadow-slate-200/50 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 dark:hover:shadow-slate-900/50">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Lulus</span>
                            <p className="mt-1 text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats?.lulus || 0}</p>
                            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${lulusPercentage}%` }} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 mt-1 block">{lulusPercentage}%</span>
                        </div>

                        {/* Tidak Lulus */}
                        <div className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 transition-all hover:shadow-lg hover:shadow-slate-200/50 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 dark:hover:shadow-slate-900/50">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Tidak Lulus</span>
                            <p className="mt-1 text-3xl font-black text-rose-600 dark:text-rose-400">{stats?.tidak_lulus || 0}</p>
                            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div className="h-full rounded-full bg-rose-500 transition-all duration-500" style={{ width: `${tidakLulusPercentage}%` }} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 mt-1 block">{tidakLulusPercentage}%</span>
                        </div>

                        {/* Menunggu */}
                        <div className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 transition-all hover:shadow-lg hover:shadow-slate-200/50 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 dark:hover:shadow-slate-900/50">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Menunggu</span>
                            <p className="mt-1 text-3xl font-black text-amber-600 dark:text-amber-400">{stats?.menunggu || 0}</p>
                            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div className="h-full rounded-full bg-amber-500 transition-all duration-500" style={{ width: `${menungguPercentage}%` }} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 mt-1 block">{menungguPercentage}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
