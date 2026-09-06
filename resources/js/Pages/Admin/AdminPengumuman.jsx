import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PeriodeFilterBar from '@/Components/PeriodeFilterBar';
import WaStatusBadge from '@/Components/WaStatusBadge';
import EmailStatusBadge from '@/Components/EmailStatusBadge';

gsap.registerPlugin(ScrollTrigger);

export default function AdminPengumuman({ pendaftarans, stats, periodes = [], selectedPeriodeId = null, flash_status, flash_error }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loadingId, setLoadingId] = useState(null);

    const filteredPendaftaran = (pendaftarans || []).filter(p => {
        const matchesSearch = 
            p?.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
            p?.nik?.includes(search);
        
        if (!matchesSearch) return false;
        if (statusFilter === 'all') return true;
        if (statusFilter === 'lulus') return p.status === 'lulus';
        if (statusFilter === 'tidak_lulus') return p.status === 'tidak_lulus';
        if (statusFilter === 'menunggu') return p.status !== 'lulus' && p.status !== 'tidak_lulus';
        return true;
    });

    const handleUpdateStatus = (pendaftar, newStatus) => {
        let statusTitle = 'Tetapkan LULUS?';
        let statusText = `Apakah Anda yakin ingin menetapkan status <b>${pendaftar.nama_lengkap}</b> menjadi <span class="text-emerald-600 font-bold">LULUS</span>?`;
        let confirmBtnText = 'Ya, Set Lulus';
        let confirmBtnColor = '#059669'; // Emerald-600

        if (newStatus === 'tidak_lulus') {
            statusTitle = 'Tetapkan TIDAK LULUS?';
            statusText = `Apakah Anda yakin ingin mengubah status <b>${pendaftar.nama_lengkap}</b> menjadi <span class="text-rose-600 font-bold">TIDAK LULUS</span>?`;
            confirmBtnText = 'Ya, Set Gagal';
            confirmBtnColor = '#e11d48'; // Rose-600
        } else if (newStatus === 'proses') {
            statusTitle = 'Reset Status Kelulusan?';
            statusText = `Kembalikan status <b>${pendaftar.nama_lengkap}</b> menjadi <span class="text-amber-600 font-bold">Menunggu Verifikasi</span>?`;
            confirmBtnText = 'Ya, Reset Status';
            confirmBtnColor = '#d97706'; // Amber-600
        }

        Swal.fire({
            title: statusTitle,
            html: statusText,
            icon: newStatus === 'proses' ? 'question' : (newStatus === 'lulus' ? 'info' : 'warning'),
            showCancelButton: true,
            confirmButtonColor: confirmBtnColor,
            cancelButtonColor: '#64748b',
            confirmButtonText: confirmBtnText,
            cancelButtonText: 'Batal',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-2xl dark:bg-slate-900 dark:text-slate-100',
                title: 'text-lg font-bold text-slate-800 dark:text-white',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                setLoadingId(pendaftar.id);

                router.post(
                    route('seleksi.evaluate', pendaftar.id),
                    {
                        status_seleksi: newStatus,
                        status: newStatus,
                        catatan: `Status diperbarui dari menu Pengumuman pada ${new Date().toLocaleDateString('id-ID')}`
                    },
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Berhasil!',
                                text: newStatus === 'proses' 
                                    ? 'Status berhasil di-reset ke Menunggu Verifikasi.' 
                                    : `Status kelulusan berhasil diubah menjadi ${newStatus === 'lulus' ? 'LULUS' : 'TIDAK LULUS'}.`,
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
                                text: Object.values(errors)[0] || 'Terjadi kendala saat memperbarui status.',
                                confirmButtonColor: '#059669',
                            });
                        },
                        onFinish: () => {
                            setLoadingId(null);
                        }
                    }
                );
            }
        });
    };

    const getStatusBadge = (s) => {
        switch (s) {
            case 'lulus':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
            case 'tidak_lulus':
                return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800';
            default:
                return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
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
        <AuthenticatedLayout header="Pengumuman Kelulusan">
            <Head title="Pengumuman Kelulusan" />

            <div className="space-y-6">
                {/* Filter Periode */}
                <PeriodeFilterBar
                    periodes={periodes}
                    selectedPeriode={selectedPeriodeId}
                    routeName="pengumuman-admin.index"
                />

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
                <div className="grid gap-4 sm:grid-cols-4 gsap-stagger-container">
                    <div 
                        onClick={() => setStatusFilter('all')}
                        className={`cursor-pointer rounded-2xl border p-5 transition-all hover:shadow-md ${
                            statusFilter === 'all' 
                                ? 'border-emerald-500 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-950/30' 
                                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'
                        } gsap-stagger-item`}
                    >
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Pendaftar</span>
                        <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{stats?.total || 0}</p>
                    </div>
                    <div 
                        onClick={() => setStatusFilter('lulus')}
                        className={`cursor-pointer rounded-2xl border p-5 transition-all hover:shadow-md ${
                            statusFilter === 'lulus' 
                                ? 'border-emerald-500 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-950/30' 
                                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'
                        } gsap-stagger-item`}
                    >
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Lulus</span>
                        <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats?.lulus || 0}</p>
                    </div>
                    <div 
                        onClick={() => setStatusFilter('tidak_lulus')}
                        className={`cursor-pointer rounded-2xl border p-5 transition-all hover:shadow-md ${
                            statusFilter === 'tidak_lulus' 
                                ? 'border-rose-500 bg-rose-50/50 dark:border-rose-500 dark:bg-rose-950/30' 
                                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'
                        } gsap-stagger-item`}
                    >
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Tidak Lulus</span>
                        <p className="mt-1 text-2xl font-black text-rose-600 dark:text-rose-400">{stats?.tidak_lulus || 0}</p>
                    </div>
                    <div 
                        onClick={() => setStatusFilter('menunggu')}
                        className={`cursor-pointer rounded-2xl border p-5 transition-all hover:shadow-md ${
                            statusFilter === 'menunggu' 
                                ? 'border-amber-500 bg-amber-50/50 dark:border-amber-500 dark:bg-amber-950/30' 
                                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'
                        } gsap-stagger-item`}
                    >
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Menunggu</span>
                        <p className="mt-1 text-2xl font-black text-amber-600 dark:text-amber-400">{stats?.menunggu || 0}</p>
                    </div>
                </div>

                {/* Filter & Search */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 gsap-fade-down">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama atau NIK calon siswa..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                            >
                                <option value="all">Semua Status</option>
                                <option value="lulus">Hanya Lulus</option>
                                <option value="tidak_lulus">Hanya Tidak Lulus</option>
                                <option value="menunggu">Hanya Menunggu</option>
                            </select>
                            {(search || statusFilter !== 'all') && (
                                <button
                                    onClick={() => { setSearch(''); setStatusFilter('all'); }}
                                    className="rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                >
                                    Reset Filter
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* List Pendaftar & Pengumuman Status */}
                <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 overflow-hidden shadow-sm gsap-fade-up">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60">
                                    <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">Nama Lengkap</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">NIK</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-slate-500">Status Saat Ini</th>
                                    <th className="px-6 py-4 text-right text-xs font-extrabold uppercase tracking-widest text-slate-500">Aksi Pengumuman</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredPendaftaran.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">
                                            {search || statusFilter !== 'all' 
                                                ? 'Tidak ditemukan pendaftar yang sesuai dengan filter pencarian.' 
                                                : 'Belum ada data pendaftar pada periode ini.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPendaftaran.map((p) => {
                                        const isCurrentLoading = loadingId === p.id;
                                        const isLulus = p.status === 'lulus';
                                        const isTidakLulus = p.status === 'tidak_lulus';

                                        return (
                                            <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-800 dark:text-slate-100">{p.nama_lengkap}</div>
                                                    <div className="text-xs text-slate-400 mt-0.5">{p.no_hp_wali || 'No HP Belum Diisi'}</div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">{p.nik || '-'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider ${getStatusBadge(p.status)}`}>
                                                        {getStatusLabel(p.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {isCurrentLoading ? (
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                                            <svg className="h-4 w-4 animate-spin text-emerald-600" viewBox="0 0 24 24" fill="none">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Memproses...
                                                        </span>
                                                    ) : (
                                                        <div className="flex flex-col items-end gap-2">
                                                            <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                                                                {/* Tombol Set Lulus */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleUpdateStatus(p, 'lulus')}
                                                                    disabled={isLulus}
                                                                    title={isLulus ? 'Status saat ini: Lulus' : 'Ubah status menjadi Lulus'}
                                                                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                                                        isLulus
                                                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-300 opacity-60 cursor-default dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                                                                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-500/20 active:scale-95'
                                                                    }`}
                                                                >
                                                                    {isLulus ? '✓ Lulus' : 'Set Lulus'}
                                                                </button>

                                                                {/* Tombol Set Gagal */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleUpdateStatus(p, 'tidak_lulus')}
                                                                    disabled={isTidakLulus}
                                                                    title={isTidakLulus ? 'Status saat ini: Tidak Lulus' : 'Ubah status menjadi Tidak Lulus'}
                                                                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                                                        isTidakLulus
                                                                            ? 'bg-rose-50 text-rose-600 border border-rose-300 opacity-60 cursor-default dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
                                                                            : 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-500/20 active:scale-95'
                                                                    }`}
                                                                >
                                                                    {isTidakLulus ? '✗ Gagal' : 'Set Gagal'}
                                                                </button>

                                                                {/* Tombol Reset (hanya jika sudah diputuskan lulus/tidak lulus) */}
                                                                {(isLulus || isTidakLulus) && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleUpdateStatus(p, 'proses')}
                                                                        title="Batalkan keputusan dan kembalikan ke status Menunggu Verifikasi"
                                                                        className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all active:scale-95"
                                                                    >
                                                                        Reset
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {/* Indikator Status WA & Email Kelulusan */}
                                                            {isLulus && (
                                                                <div className="flex flex-col items-end gap-1 mt-0.5">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="text-[10px] font-semibold text-slate-400">WA:</span>
                                                                        <WaStatusBadge
                                                                            status={p.status_wa_lulus || 'belum_terkirim'}
                                                                            sentAt={p.wa_lulus_sent_at}
                                                                        />
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="text-[10px] font-semibold text-slate-400">Email:</span>
                                                                        <EmailStatusBadge
                                                                            status={p.status_email_lulus || 'belum_terkirim'}
                                                                            sentAt={p.email_lulus_sent_at}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
