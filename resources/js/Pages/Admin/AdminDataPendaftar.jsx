import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PeriodeFilterBar from '@/Components/PeriodeFilterBar'; // [BARU]

gsap.registerPlugin(ScrollTrigger);

export default function AdminDataPendaftar({ pendaftarans, filters, periodes = [], selectedPeriodeId = null }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [gender, setGender] = useState(filters?.gender || '');

    const handleFilter = () => {
        router.get(route('data-pendaftar.index'), {
            search: search || undefined,
            status: status || undefined,
            gender: gender || undefined,
        }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('');
        setGender('');
        router.get(route('data-pendaftar.index'), {}, { preserveState: true, replace: true });
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

    const getStatusBadge = (s) => {
        switch (s) {
            case 'lulus':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400';
            case 'tidak_lulus':
                return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400';
            default:
                return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400';
        }
    };

    const getStatusLabel = (s) => {
        switch (s) {
            case 'lulus': return 'Lulus';
            case 'tidak_lulus': return 'Tidak Lulus';
            default: return 'Menunggu';
        }
    };

    const data = pendaftarans?.data || [];
    const links = pendaftarans?.links || [];

    return (
        <AuthenticatedLayout header="Data Pendaftar">
            <Head title="Data Pendaftar" />

            <div className="space-y-6">
                {/* Filter Periode — [BARU] */}
                <PeriodeFilterBar
                    periodes={periodes}
                    selectedPeriode={selectedPeriodeId}
                    routeName="data-pendaftar.index"
                    extraParams={{ search: filters?.search, status: filters?.status, gender: filters?.gender }}
                />
                {/* Filter Bar */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 gsap-fade-down">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-md shadow-blue-500/10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Filter Data</h3>
                            <p className="text-xs font-medium text-slate-500">Cari dan filter data pendaftar</p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                            >
                                <option value="">Semua Status</option>
                                <option value="menunggu_verifikasi">Menunggu</option>
                                <option value="lulus">Lulus</option>
                                <option value="tidak_lulus">Tidak Lulus</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Jenis Kelamin</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                            >
                                <option value="">Semua</option>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                        </div>
                        <div className="flex items-end gap-2">
                            <button
                                onClick={handleFilter}
                                className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-colors"
                            >
                                Cari
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
                <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 overflow-hidden gsap-fade-up">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                                    <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">No</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">Nama Lengkap</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">NIK</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">JK</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">Asal Sekolah</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">No. HP Wali</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">Tgl Daftar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-slate-400 font-medium">
                                            Belum ada data pendaftar.
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((p, idx) => (
                                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-500">{(pendaftarans.current_page - 1) * pendaftarans.per_page + idx + 1}</td>
                                            <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{p.nama_lengkap}</td>
                                            <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">{p.nik || '-'}</td>
                                            <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">{p.jenis_kelamin === 'L' ? 'L' : 'P'}</td>
                                            <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">{p.asal_sekolah || '-'}</td>
                                            <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">{p.no_hp_wali || '-'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider ${getStatusBadge(p.status)}`}>
                                                    {getStatusLabel(p.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-500 text-xs">
                                                {new Date(p.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                        </tr>
                                    ))
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
        </AuthenticatedLayout>
    );
}
