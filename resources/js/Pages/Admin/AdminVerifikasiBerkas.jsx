import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PeriodeFilterBar from '@/Components/PeriodeFilterBar'; // [BARU]

gsap.registerPlugin(ScrollTrigger);

const REQUIRED_DOCS = [
    { type: 'akta_kelahiran_path', label: 'Akta Kelahiran' },
    { type: 'kartu_keluarga_path', label: 'Kartu Keluarga' },
    { type: 'identitas_ortu_path', label: 'Identitas Orang Tua' },
    { type: 'ijazah_path', label: 'Ijazah TK/RA' },
    { type: 'pkh_kks_path', label: 'PKH/KKS (Opsional)', optional: true },
];

export default function AdminVerifikasiBerkas({ pendaftarans, filters, periodes = [], selectedPeriodeId = null }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [verifikasi, setVerifikasi] = useState(filters?.verifikasi || '');

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
        <AuthenticatedLayout header="Verifikasi Berkas">
            <Head title="Verifikasi Berkas" />

            <div className="space-y-6">
                {/* Filter Periode — [BARU] */}
                <PeriodeFilterBar
                    periodes={periodes}
                    selectedPeriode={selectedPeriodeId}
                    routeName="verifikasi-berkas.index"
                    extraParams={{ search: filters?.search, verifikasi: filters?.verifikasi }}
                />
                {/* Stats Summary */}
                <div className="grid gap-4 sm:grid-cols-3 gsap-stagger-container">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 gsap-stagger-item">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.5a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Pendaftar</span>
                        <p className="mt-1 text-3xl font-black text-slate-900 dark:text-white">{data.length}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 gsap-stagger-item">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Berkas Lengkap</span>
                        <p className="mt-1 text-3xl font-black text-emerald-600 dark:text-emerald-400">{totalLengkap}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 gsap-stagger-item">
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
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 gsap-fade-down">
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
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Status Berkas</label>
                            <select
                                value={verifikasi}
                                onChange={(e) => setVerifikasi(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                            >
                                <option value="">Semua</option>
                                <option value="lengkap">Lengkap</option>
                                <option value="belum_lengkap">Belum Lengkap</option>
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

                {/* Document Verification Cards */}
                <div className="space-y-4 gsap-fade-up">
                    {data.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-950">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-700">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-bold text-slate-700 dark:text-slate-300">Tidak Ada Data</h3>
                            <p className="mt-1 text-sm text-slate-500">Tidak ada pendaftar yang sesuai filter.</p>
                        </div>
                    ) : (
                        data.map((p) => {
                            const completeness = getCompleteness(p.dokumen);
                            const isComplete = completeness.percentage === 100;

                            return (
                                <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-extrabold text-sm ${
                                                isComplete
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                                            }`}>
                                                {p.nama_lengkap.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-slate-900 dark:text-white">{p.nama_lengkap}</h4>
                                                <p className="text-xs font-medium text-slate-500">NIK: {p.nik || '-'} &bull; {p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <span className={`text-xs font-extrabold uppercase tracking-wider ${isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                                    {completeness.uploaded}/{completeness.total} Berkas
                                                </span>
                                                <div className="mt-1 h-2 w-32 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                                        style={{ width: `${completeness.percentage}%` }}
                                                     />
                                                </div>
                                            </div>
                                            <span className={`inline-flex rounded-lg px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider ${
                                                isComplete
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                                            }`}>
                                                {isComplete ? 'Lengkap' : 'Belum Lengkap'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Document Checklist */}
                                    <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
                                        {REQUIRED_DOCS.map((doc) => {
                                            const exists = getDocStatus(p.dokumen, doc.type);
                                            const path = p.dokumen?.[doc.type];
                                            const content = (
                                                <>
                                                    {exists ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4 shrink-0">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4 shrink-0">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                        </svg>
                                                    )}
                                                    {doc.label}
                                                </>
                                            );

                                            if (exists) {
                                                return (
                                                    <a
                                                        key={doc.type}
                                                        href={`/storage/${path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
                                                    >
                                                        {content}
                                                    </a>
                                                );
                                            }

                                            return (
                                                <div
                                                    key={doc.type}
                                                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold ${
                                                        doc.optional
                                                            ? 'bg-slate-50 text-slate-400 dark:bg-slate-900/30 dark:text-slate-500'
                                                            : 'bg-rose-50 text-rose-500 dark:bg-rose-950/30 dark:text-rose-400'
                                                    }`}
                                                >
                                                    {content}
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
        </AuthenticatedLayout>
    );
}
