import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import WhatsAppAdminButton from '@/Components/WhatsAppAdminButton';
import PeriodeFilterBar from '@/Components/PeriodeFilterBar'; // [BARU]

gsap.registerPlugin(ScrollTrigger);

// ── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    belum_daftar: {
        label: 'Belum Terdaftar',
        color: '#64748b',
        bg: 'from-slate-500 to-slate-600',
        light: 'bg-slate-100 text-slate-700',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
        ),
    },
    belum_lengkap: {
        label: 'Biodata Belum Lengkap',
        color: '#d97706',
        bg: 'from-amber-500 to-orange-500',
        light: 'bg-amber-50 text-amber-700',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        ),
    },
    menunggu_verifikasi: {
        label: 'Menunggu Verifikasi',
        color: '#2563eb',
        bg: 'from-blue-500 to-indigo-600',
        light: 'bg-blue-50 text-blue-700',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
        ),
    },
    proses_seleksi: {
        label: 'Proses Seleksi',
        color: '#7c3aed',
        bg: 'from-violet-500 to-purple-600',
        light: 'bg-violet-50 text-violet-700',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
            </svg>
        ),
    },
    lulus: {
        label: 'LULUS SELEKSI',
        color: '#059669',
        bg: 'from-emerald-500 to-teal-500',
        light: 'bg-emerald-50 text-emerald-700',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        ),
    },
    tidak_lulus: {
        label: 'TIDAK LULUS',
        color: '#dc2626',
        bg: 'from-red-500 to-rose-600',
        light: 'bg-red-50 text-red-700',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        ),
    },
};

// ── Quick Action Card ─────────────────────────────────────────────────────────
function QuickActionCard({ icon, title, desc, href, active = false, disabled = false }) {
    return (
        <Link
            href={disabled ? '#' : href}
            onClick={disabled ? (e) => e.preventDefault() : undefined}
            className={`group flex flex-col gap-3 rounded-2xl border p-5 transition-all duration-300 ${
                active
                    ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-emerald-100 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                    : disabled
                    ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                    : 'border-slate-200 bg-white hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5'
            }`}
        >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600'} transition-colors`}>
                {icon}
            </div>
            <div>
                <p className={`text-sm font-bold ${active ? 'text-emerald-700' : 'text-slate-700'}`}>{title}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5 leading-relaxed">{desc}</p>
            </div>
            {active && (
                <span className="self-start inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                    Selesai <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </span>
            )}
        </Link>
    );
}

// ── Step Progress Component ───────────────────────────────────────────────────
function StepItem({ step, title, desc, done, active, action, actionLabel, isLast }) {
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-black text-sm transition-all duration-500 ${
                    done
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                        : active
                        ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-200 ring-4 ring-emerald-100'
                        : 'bg-slate-100 text-slate-400'
                }`}>
                    {done ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        step
                    )}
                    {active && !done && <span className="absolute -inset-1 animate-ping rounded-full bg-emerald-400 opacity-30" />}
                </div>
                {!isLast && <div className={`mt-1 w-0.5 flex-1 min-h-[32px] rounded-full transition-colors duration-500 ${done ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
            </div>
            <div className={`pb-8 ${isLast ? 'pb-0' : ''}`}>
                <p className={`font-bold text-sm leading-tight ${done ? 'text-emerald-700' : active ? 'text-slate-800' : 'text-slate-400'}`}>{title}</p>
                <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">{desc}</p>
                {action && (
                    <Link href={action} className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm">
                        {actionLabel} <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                    </Link>
                )}
            </div>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Dashboard({ auth, role, pendaftaran, stats, teksPengumuman, periodes = [], selectedPeriodeId = null }) {
    const isSiswa = role === 'siswa';

    const hasBio = !!pendaftaran;
    const hasDocs = !!(
        pendaftaran?.dokumen?.akta_kelahiran_path &&
        pendaftaran?.dokumen?.kartu_keluarga_path &&
        pendaftaran?.dokumen?.identitas_ortu_path
    );
    // bukti_pembayaran_path & payment_status ada langsung di tabel pendaftaran
    const hasPembayaran = !!(
        pendaftaran?.bukti_pembayaran_path ||
        (pendaftaran?.payment_status && pendaftaran?.payment_status !== 'belum_bayar')
    );
    const status = pendaftaran?.status || 'belum_daftar';
    // Pengumuman dianggap selesai jika hasil seleksi sudah ditetapkan
    const hasPengumuman = status === 'lulus' || status === 'tidak_lulus';
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.belum_daftar;

    // completion percentage — 4 tahap sesuai visual Alur Pendaftaran
    const steps = [true, hasBio, hasDocs, hasPembayaran];
    const completedSteps = steps.filter(Boolean).length;
    const progressPct = Math.round((completedSteps / steps.length) * 100);

    const containerRef = useRef();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.anim-up').forEach((el, i) => {
                gsap.fromTo(el,
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.7, delay: i * 0.08, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' } }
                );
            });
            gsap.utils.toArray('.gsap-fade-up').forEach((el) => {
                gsap.fromTo(el, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' } });
            });
            gsap.utils.toArray('.gsap-fade-down').forEach((el) => {
                gsap.fromTo(el, { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' } });
            });
            gsap.utils.toArray('.gsap-stagger-container').forEach((container) => {
                const items = container.querySelectorAll('.gsap-stagger-item');
                gsap.fromTo(items, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.25, ease: 'power3.out', scrollTrigger: { trigger: container, start: 'top 85%', toggleActions: 'play none none none' } });
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    // ── Admin Dashboard ─────────────────────────────────────────────────────
    if (!isSiswa) {
        const genderData = [
            { name: 'Laki-Laki', value: stats?.gender?.laki || 0, color: '#3b82f6' },
            { name: 'Perempuan', value: stats?.gender?.perempuan || 0, color: '#ec4899' },
        ];
        const seleksiData = [
            { name: 'Lulus', value: stats?.lulus || 0, color: '#10b981' },
            { name: 'Tidak Lulus', value: stats?.tidak_lulus || 0, color: '#ef4444' },
        ];
        const berkasData = [
            { name: 'Belum Daftar/Lengkap', value: (stats?.status_berkas?.belum_daftar || 0) + (stats?.status_berkas?.belum_lengkap || 0) },
            { name: 'Menunggu Verifikasi', value: stats?.status_berkas?.menunggu_verifikasi || 0 },
            { name: 'Proses Seleksi', value: stats?.status_berkas?.proses_seleksi || 0 },
        ];
        const tooltipStyle = { backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #e2e8f0', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a' };

        return (
            <AuthenticatedLayout header="Dashboard">
                <Head title="Dashboard | SPMB MI Nurussalam" />
                <div ref={containerRef} className="space-y-8">
                    {/* [BARU] Filter Periode */}
                    <PeriodeFilterBar
                        periodes={periodes}
                        selectedPeriode={selectedPeriodeId}
                        routeName="dashboard"
                    />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 dark:border-slate-850 dark:bg-slate-950 gsap-fade-down">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Panel Administrasi Akademik</h3>
                            <p className="text-sm font-semibold text-slate-500 mt-0.5">Sistem Penerimaan Murid Baru MI Nurussalam Sidogede</p>
                        </div>
                        {selectedPeriodeId ? (
                            <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200/50 px-3.5 py-1 text-xs font-extrabold text-amber-800">
                                Sesi Historis {periodes.find(p => p.id == selectedPeriodeId)?.tahun}
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200/50 px-3.5 py-1 text-xs font-extrabold text-emerald-800">
                                Sesi Aktif {periodes.find(p => p.is_aktif)?.tahun}
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 gsap-stagger-container">
                        {[
                            { label: 'Total Pendaftar', value: stats.total, color: 'text-slate-950 dark:text-white', bg: 'bg-slate-100 dark:bg-slate-900', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94-3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg> },
                            { label: 'Menunggu Verifikasi', value: stats.menunggu, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/60', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg> },
                            { label: 'Dinyatakan Lulus', value: stats.lulus, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/60', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6 text-emerald-600"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> },
                            { label: 'Tidak Lulus', value: stats.tidak_lulus, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/60', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6 text-red-600"><path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> },
                        ].map((card, i) => (
                            <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-850 dark:bg-slate-950 shadow-sm flex items-center justify-between gsap-stagger-item">
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">{card.label}</span>
                                    <span className={`text-3xl font-extrabold block ${card.color}`}>{card.value}</span>
                                </div>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.bg}`}>{card.icon}</div>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 gsap-fade-up">
                        {[
                            { title: 'Hasil Seleksi', sub: 'Distribusi kelulusan pendaftar', data: seleksiData },
                            { title: 'Jenis Kelamin', sub: 'Demografi calon siswa', data: genderData },
                        ].map((chart, i) => (
                            <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-850 dark:bg-slate-950 shadow-sm flex flex-col items-center">
                                <div className="w-full text-center mb-4">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{chart.title}</h4>
                                    <p className="text-xs font-semibold text-slate-500">{chart.sub}</p>
                                </div>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={chart.data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                                                {chart.data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                            </Pie>
                                            <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#0f172a' }} />
                                            <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        ))}
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-850 dark:bg-slate-950 shadow-sm flex flex-col">
                            <div className="w-full mb-6 text-center">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Progres Pemberkasan</h4>
                                <p className="text-xs font-semibold text-slate-500">Tahapan administrasi pendaftar</p>
                            </div>
                            <div className="flex-1 w-full min-h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={berkasData} layout="vertical" margin={{ top: 0, right: 20, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} width={120} />
                                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={tooltipStyle} />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                                            {berkasData.map((entry, index) => <Cell key={index} fill={['#cbd5e1', '#3b82f6', '#8b5cf6'][index % 3]} />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gsap-fade-up">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-850 dark:bg-slate-950 space-y-4">
                            <h4 className="font-bold text-base">Alur Kerja Cepat</h4>
                            <p className="text-xs text-slate-500 font-semibold leading-relaxed">Evaluasi berkas pendaftar secara berkala pada laman seleksi. Semua data yang disubmit terikat pada integritas MySQL schema.</p>
                            <div className="flex gap-3">
                                <Link href={route('seleksi.index')} className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors shadow-md">Mulai Menyeleksi &rarr;</Link>
                                <Link href={route('laporan.index')} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">Lihat Laporan</Link>
                            </div>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-850 dark:bg-slate-950 flex flex-col justify-center items-center text-center space-y-2">
                            <span className="text-emerald-600 text-sm font-extrabold tracking-widest uppercase">Target Kuota Penerimaan</span>
                            <span className="text-5xl font-black text-slate-900 dark:text-white">60</span>
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Kuota Maksimal Terdaftar</span>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // ── Student Dashboard ───────────────────────────────────────────────────
    const greetingTime = () => {
        const h = new Date().getHours();
        if (h < 11) return 'Selamat Pagi';
        if (h < 15) return 'Selamat Siang';
        if (h < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard | SPMB MI Nurussalam" />
            <div ref={containerRef} className="space-y-6">

                {/* ── Teks Pengumuman Admin (BARU) ────────────────────────── */}
                {teksPengumuman && (
                    <div className="anim-up flex items-start gap-3 px-4 py-3 rounded-2xl text-sm"
                        style={{ background: 'rgba(153,204,51,0.1)', border: '1px solid rgba(153,204,51,0.25)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#99CC33" className="h-5 w-5 shrink-0 mt-0.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
                        </svg>
                        <p className="font-medium leading-relaxed" style={{ color: '#003333' }}>{teksPengumuman}</p>
                    </div>
                )}

                {/* ── Hero Welcome Banner ─────────────────────────────────── */}
                <div className="anim-up relative overflow-hidden rounded-3xl text-white" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #0d9488 100%)' }}>
                    {/* decorative circles */}
                    <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full opacity-10" style={{ background: '#99CC33' }} />
                    <div className="pointer-events-none absolute right-20 bottom-0 h-32 w-32 rounded-full opacity-10" style={{ background: '#a7f3d0' }} />
                    <div className="pointer-events-none absolute -left-6 bottom-0 h-40 w-40 rounded-full opacity-5" style={{ background: 'white' }} />

                    <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8">
                        {/* Avatar + greeting */}
                        <div className="flex items-center gap-4">
                            {auth.user.profile_photo_path ? (
                                <img src={`/storage/${auth.user.profile_photo_path}`} alt="Profile" className="h-16 w-16 rounded-2xl object-cover border-2 border-white/30 shadow-xl" />
                            ) : (
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-black text-2xl text-emerald-900 shadow-xl border-2 border-white/20" style={{ background: '#99CC33' }}>
                                    {auth.user.username?.charAt(0)?.toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">{greetingTime()}, Calon Siswa 👋</p>
                                <h3 className="text-2xl font-extrabold tracking-tight mt-0.5">{auth.user.username}!</h3>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-extrabold uppercase ${cfg.light}`}>
                                        {cfg.icon}
                                        {cfg.label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Ring */}
                        <div className="flex flex-col items-center gap-2 md:ml-auto">
                            <div className="relative flex h-20 w-20 items-center justify-center">
                                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 80 80">
                                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="7" />
                                    <circle
                                        cx="40" cy="40" r="34"
                                        fill="none"
                                        stroke="#99CC33"
                                        strokeWidth="7"
                                        strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 34}`}
                                        strokeDashoffset={`${2 * Math.PI * 34 * (1 - progressPct / 100)}`}
                                        style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                                    />
                                </svg>
                                <span className="font-black text-lg">{progressPct}<span className="text-xs">%</span></span>
                            </div>
                            <p className="text-xs font-bold text-emerald-200 text-center">Kelengkapan<br />Pendaftaran</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="px-6 pb-6 md:px-8">
                        <div className="flex justify-between text-xs font-bold text-emerald-200 mb-1.5">
                            <span>Progres Tahapan</span>
                            <span>{completedSteps}/{steps.length} Tahap</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{ width: `${progressPct}%`, background: '#99CC33' }}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Info Cards Row ──────────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[
                        {
                            label: 'Tahun Pelajaran',
                            value: '2026/2027',
                            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>,
                            accent: '#3b82f6',
                        },
                        {
                            label: 'Jenjang',
                            value: 'MI / SD',
                            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-1.342" /></svg>,
                            accent: '#8b5cf6',
                        },
                        {
                            label: 'Sekolah',
                            value: 'MI Nurussalam',
                            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" /></svg>,
                            accent: '#059669',
                        },
                        {
                            label: 'Kuota Tersisa',
                            value: '60 Kursi',
                            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94-3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>,
                            accent: '#f59e0b',
                        },
                    ].map((item, i) => (
                        <div key={i} className="anim-up rounded-2xl border border-slate-200 bg-white p-4 flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: item.accent + '15', color: item.accent }}>
                                {item.icon}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 truncate">{item.label}</p>
                                <p className="text-sm font-extrabold text-slate-800 truncate">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Main 2-column grid ──────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Left: Steps Progress */}
                    <div className="anim-up lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h4 className="text-base font-extrabold text-slate-900">Alur Pendaftaran</h4>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">Ikuti tahapan di bawah ini</p>
                            </div>
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 rounded-full px-2.5 py-1">{completedSteps}/{steps.length}</span>
                        </div>

                        <div>
                            <StepItem
                                step={1} title="Registrasi Akun" done={true} active={false}
                                desc="Akun Anda telah terdaftar dan email sudah diverifikasi."
                                isLast={false}
                            />
                            <StepItem
                                step={2} title="Isi Biodata Diri" done={hasBio} active={!hasBio}
                                desc="Lengkapi formulir biodata calon murid dan wali murid."
                                action={!hasBio ? route('pendaftaran.index') : null}
                                actionLabel="Isi Biodata"
                                isLast={false}
                            />
                            <StepItem
                                step={3} title="Unggah Dokumen" done={hasDocs} active={hasBio && !hasDocs}
                                desc="Unggah scan KK, Akta Kelahiran, dan KTP orang tua."
                                action={hasBio && !hasDocs ? route('dokumen.index') : null}
                                actionLabel="Unggah Dokumen"
                                isLast={false}
                            />
                            <StepItem
                                step={4} title="Pembayaran" done={hasPembayaran} active={hasDocs && !hasPembayaran}
                                desc="Unggah bukti pembayaran biaya pendaftaran."
                                action={hasDocs && !hasPembayaran ? route('pembayaran.index') : null}
                                actionLabel="Bayar Sekarang"
                                isLast={true}
                            />
                        </div>
                    </div>

                    {/* Right: Quick actions + Status info */}
                    <div className="lg:col-span-3 flex flex-col gap-6">

                        {/* Status Banner if hasil sudah ada */}
                        {(status === 'lulus' || status === 'tidak_lulus') && (
                            <div className={`anim-up rounded-3xl p-6 text-white bg-gradient-to-r ${cfg.bg} relative overflow-hidden`}>
                                <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20">
                                        {cfg.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-80">Hasil Seleksi Administrasi</p>
                                        <h4 className="text-2xl font-black mt-0.5">{cfg.label}</h4>
                                        <p className="text-sm opacity-80 mt-1">
                                            {status === 'lulus'
                                                ? 'Selamat! Anda telah dinyatakan lulus seleksi administrasi. Pantau pengumuman untuk informasi lebih lanjut.'
                                                : 'Mohon maaf, berkas Anda belum memenuhi persyaratan seleksi administrasi.'}
                                        </p>
                                    </div>
                                </div>
                                {status === 'lulus' && (
                                    <Link href={route('pengumuman.index')} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-xs font-bold hover:bg-white/30 transition-colors">
                                        Lihat Pengumuman &rarr;
                                    </Link>
                                )}
                            </div>
                        )}

                        {/* Quick Access Grid */}
                        <div className="anim-up rounded-3xl border border-slate-200 bg-white p-6">
                            <h4 className="text-base font-extrabold text-slate-900 mb-1">Menu Cepat</h4>
                            <p className="text-xs text-slate-400 font-medium mb-5">Akses langsung ke halaman penting</p>
                            <div className="grid grid-cols-2 gap-3">
                                <QuickActionCard
                                    href={route('pendaftaran.index')}
                                    active={hasBio}
                                    title="Biodata Diri"
                                    desc="Isi atau perbarui formulir data diri"
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>}
                                />
                                <QuickActionCard
                                    href={hasBio ? route('dokumen.index') : '#'}
                                    active={hasDocs}
                                    disabled={!hasBio}
                                    title="Upload Dokumen"
                                    desc="Unggah berkas persyaratan"
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>}
                                />
                                <QuickActionCard
                                    href={hasDocs ? route('pembayaran.index') : '#'}
                                    active={hasPembayaran}
                                    disabled={!hasDocs}
                                    title="Pembayaran"
                                    desc="Unggah bukti biaya pendaftaran"
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>}
                                />
                                <QuickActionCard
                                    href={route('pengumuman.index')}
                                    active={hasPengumuman}
                                    title="Pengumuman"
                                    desc="Pantau informasi dan pengumuman"
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a9.04 9.04 0 0 1-5.714 0M3.181 12.062a18.8 18.8 0 0 1 17.638 0M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm1.89 3.487A9.04 9.04 0 0 1 12 15a9.04 9.04 0 0 1-4.89-1.513M21 12v6.75A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V12" /></svg>}
                                />
                            </div>
                        </div>

                        {/* Info / Tips box */}
                        <div className="anim-up rounded-3xl border border-amber-200 bg-amber-50 p-5">
                            <div className="flex gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a14.025 14.025 0 0 0 1.125-1.628M12 9.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Zm5.25-4.5a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-extrabold text-amber-800">Panduan Pendaftaran</p>
                                    <ul className="mt-2 space-y-1.5 text-xs font-medium text-amber-700 list-disc pl-4">
                                        <li>Isi biodata diri dengan lengkap dan akurat sesuai dokumen resmi.</li>
                                        <li>Dokumen yang diunggah harus berformat JPG/PNG/PDF, maks 2MB.</li>
                                        <li>Pastikan bukti pembayaran terbaca dengan jelas sebelum diunggah.</li>
                                        <li>Pantau halaman Pengumuman untuk mengetahui hasil seleksi Anda.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Kontak Sekolah Footer Card ─────────────────────────── */}
                <div className="anim-up rounded-3xl border border-slate-200 bg-white p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="flex-1">
                            <h4 className="text-base font-extrabold text-slate-900">Butuh Bantuan?</h4>
                            <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                                Jika Anda mengalami kendala dalam proses pendaftaran, silakan hubungi pihak sekolah melalui kontak di bawah ini atau kunjungi langsung MI Nurussalam Sidogede.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <a href="tel:+6281234567890" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4 text-emerald-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                </svg>
                                Telepon Sekolah
                            </a>
                            <Link href={route('kontak')} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-xs font-bold text-white hover:from-emerald-500 hover:to-teal-500 transition-all shadow-sm shadow-emerald-200">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                                Halaman Kontak
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
            <WhatsAppAdminButton pageName="Dashboard" />
        </AuthenticatedLayout>
    );
}
