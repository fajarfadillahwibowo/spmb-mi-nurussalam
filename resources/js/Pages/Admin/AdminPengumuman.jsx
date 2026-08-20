import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PeriodeFilterBar from '@/Components/PeriodeFilterBar'; // [BARU]

gsap.registerPlugin(ScrollTrigger);

export default function AdminPengumuman({ pendaftarans, stats, periodes = [], selectedPeriodeId = null }) {
    const [search, setSearch] = useState('');

    const filteredPendaftaran = (pendaftarans || []).filter(p => 
        p?.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
        p?.nik?.includes(search)
    );

    const handleUpdateStatus = (id, status) => {
        if (confirm(`Apakah Anda yakin ingin mengubah status pendaftar ini menjadi ${status === 'lulus' ? 'LULUS' : 'TIDAK LULUS'}?`)) {
            router.post(route('seleksi.evaluate', id), {
                status: status,
                catatan: `Status diperbarui dari menu Pengumuman pada ${new Date().toLocaleDateString('id-ID')}`
            }, {
                preserveScroll: true
            });
        }
    };

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
            default: return 'Menunggu Verifikasi';
        }
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
        <AuthenticatedLayout header="Pengumuman Kelulusan">
            <Head title="Pengumuman Kelulusan" />

            <div className="space-y-6">
                {/* Filter Periode — [BARU] */}
                <PeriodeFilterBar
                    periodes={periodes}
                    selectedPeriode={selectedPeriodeId}
                    routeName="pengumuman-admin.index"
                />
                {/* Stats Summary */}
                <div className="grid gap-4 sm:grid-cols-4 gsap-stagger-container">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 gsap-stagger-item">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Pendaftar</span>
                        <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{stats?.total || 0}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 gsap-stagger-item">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Lulus</span>
                        <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats?.lulus || 0}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 gsap-stagger-item">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Tidak Lulus</span>
                        <p className="mt-1 text-2xl font-black text-rose-600 dark:text-rose-400">{stats?.tidak_lulus || 0}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 gsap-stagger-item">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Menunggu</span>
                        <p className="mt-1 text-2xl font-black text-amber-600 dark:text-amber-400">{stats?.menunggu || 0}</p>
                    </div>
                </div>

                {/* Filter & Search */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 gsap-fade-down">
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama atau NIK calon siswa..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                            />
                        </div>
                    </div>
                </div>

                {/* List Pendaftar & Pengumuman Status */}
                <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 overflow-hidden gsap-fade-up">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                                    <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">Nama Lengkap</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">NIK</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">Nilai Seleksi</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-extrabold uppercase tracking-widest text-slate-500">Aksi Pengumuman</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredPendaftaran.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">
                                            Belum ada data pendaftar.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPendaftaran.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{p.nama_lengkap}</td>
                                            <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">{p.nik || '-'}</td>
                                            <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                                                {p.seleksi ? (
                                                    <span className="text-emerald-600 dark:text-emerald-400">
                                                        {parseFloat(p.seleksi.nilai_tes).toFixed(1)}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-xs italic">Belum Ujian</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider ${getStatusBadge(p.status)}`}>
                                                    {getStatusLabel(p.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => handleUpdateStatus(p.id, 'lulus')}
                                                    disabled={p.status === 'lulus'}
                                                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                                        p.status === 'lulus'
                                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-900 dark:text-slate-600'
                                                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/10'
                                                    }`}
                                                >
                                                    Set Lulus
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(p.id, 'tidak_lulus')}
                                                    disabled={p.status === 'tidak_lulus'}
                                                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                                        p.status === 'tidak_lulus'
                                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-900 dark:text-slate-600'
                                                            : 'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-500/10'
                                                    }`}
                                                >
                                                    Set Gagal
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
