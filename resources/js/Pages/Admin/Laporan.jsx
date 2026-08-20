import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PeriodeFilterBar from '@/Components/PeriodeFilterBar'; // [BARU]

gsap.registerPlugin(ScrollTrigger);

export default function Laporan({ pendaftarans, stats, filters, periodes = [], selectedPeriodeId = null }) {
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [genderFilter, setGenderFilter] = useState(filters.gender || '');

    const handleFilterChange = (statusVal, genderVal) => {
        router.get(route('laporan.index'), {
            status: statusVal || undefined,
            gender: genderVal || undefined,
            periode_id: selectedPeriodeId || undefined,
        }, { preserveState: true });
    };

    const handlePrint = () => {
        window.print();
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
        <AuthenticatedLayout header="Laporan Pendaftaran">
            <Head title="Laporan PMB | SPMB MI Nurussalam" />

            {/* Print Friendly Styles */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-report-area, .print-report-area * {
                        visibility: visible;
                    }
                    .print-report-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        border: none !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                        background: white !important;
                        color: black !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>

            <div className="space-y-6">
                
                {/* [BARU] Filter Periode */}
                <div className="no-print">
                    <PeriodeFilterBar
                        periodes={periodes}
                        selectedPeriode={selectedPeriodeId}
                        routeName="laporan.index"
                        extraParams={{ status: filters.status, gender: filters.gender }}
                    />
                </div>

                {/* Print and Filter actions (No print) */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-850 dark:bg-slate-950 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 no-print gsap-fade-down">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Status:</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    handleFilterChange(e.target.value, genderFilter);
                                }}
                                className="rounded-xl border border-slate-350 bg-white px-3 py-2 text-xs font-bold focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                            >
                                <option value="">Semua</option>
                                <option value="belum_lengkap">Belum Lengkap</option>
                                <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
                                <option value="proses_seleksi">Proses Seleksi</option>
                                <option value="lulus">Lulus</option>
                                <option value="tidak_lulus">Tidak Lulus</option>
                            </select>
                        </div>
                        
                        {/* Gender Filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Kelamin:</span>
                            <select
                                value={genderFilter}
                                onChange={(e) => {
                                    setGenderFilter(e.target.value);
                                    handleFilterChange(statusFilter, e.target.value);
                                }}
                                className="rounded-xl border border-slate-355 bg-white px-3 py-2 text-xs font-bold focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                            >
                                <option value="">Semua</option>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <a
                            href={route('laporan.export', { status: statusFilter, gender: genderFilter, periode_id: selectedPeriodeId })}
                            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            Export Excel
                        </a>
                        <button
                            onClick={handlePrint}
                            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.617 0-1.11-.461-1.12-1.078L5.789 18m12.1-.096a42.94 42.94 0 0 0-12.1 0M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                            </svg>
                            Cetak Laporan
                        </button>
                    </div>
                </div>

                {/* Print Report Area Wrapper */}
                <div className="print-report-area space-y-6">
                    {/* Header Report Kop (Only visible during print / formatted cleanly) */}
                    <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4 mb-6">
                        <img src="/images/logo-kemenag.png" alt="Logo Kemenag" className="h-14 w-auto object-contain shrink-0" />
                        <div className="text-center flex-1 px-4">
                            <h2 className="text-xl font-bold uppercase text-slate-900 leading-none">MI Nurussalam Sidogede</h2>
                            <h3 className="text-sm font-semibold text-slate-700 mt-1 uppercase tracking-wide">Laporan Penerimaan Murid Baru (SPMB) Sesi 2026/2027</h3>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Laporan di-generate pada: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <img src="/images/logo-nurussalam.png" alt="Logo Nurussalam" className="h-14 w-auto object-contain shrink-0" />
                    </div>

                    {/* Stats Grid Cards Summary */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 mb-6 gsap-stagger-container">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-850 dark:bg-slate-950 shadow-sm text-center gsap-stagger-item">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Total</span>
                            <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1">{stats.total}</span>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-850 dark:bg-slate-950 shadow-sm text-center gsap-stagger-item">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Lulus</span>
                            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block mt-1">{stats.lulus}</span>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-850 dark:bg-slate-950 shadow-sm text-center gsap-stagger-item">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Tidak Lulus</span>
                            <span className="text-2xl font-black text-red-600 dark:text-red-400 block mt-1">{stats.tidak_lulus}</span>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-850 dark:bg-slate-950 shadow-sm text-center gsap-stagger-item">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Verifikasi</span>
                            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 block mt-1">{stats.menunggu}</span>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-850 dark:bg-slate-950 shadow-sm text-center gsap-stagger-item">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Laki-Laki</span>
                            <span className="text-2xl font-black text-slate-800 dark:text-slate-200 block mt-1">{stats.laki_laki}</span>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-850 dark:bg-slate-950 shadow-sm text-center gsap-stagger-item">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Perempuan</span>
                            <span className="text-2xl font-black text-slate-800 dark:text-slate-200 block mt-1">{stats.perempuan}</span>
                        </div>
                    </div>

                    {/* Table Data */}
                    <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden dark:border-slate-850 dark:bg-slate-950 shadow-sm gsap-fade-up">
                        <table className="w-full text-left text-xs text-slate-655 dark:text-slate-400">
                            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-850">
                                <tr>
                                    <th className="px-4 py-3">Nama Lengkap</th>
                                    <th className="px-4 py-3">L/P</th>
                                    <th className="px-4 py-3">Tempat, Tgl Lahir</th>
                                    <th className="px-4 py-3">Orang Tua / Wali</th>
                                    <th className="px-4 py-3">No. HP Wali</th>
                                    <th className="px-4 py-3">Alamat</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                                {pendaftarans.length > 0 ? (
                                    pendaftarans.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{item.nama_lengkap}</td>
                                            <td className="px-4 py-3 font-semibold">{item.jenis_kelamin}</td>
                                            <td className="px-4 py-3 font-semibold">
                                                {item.tempat_lahir || ''}
                                                {item.tempat_lahir && item.tanggal_lahir ? ', ' : ''}
                                                {item.tanggal_lahir
                                                    ? new Date(item.tanggal_lahir).toLocaleDateString('id-ID', {
                                                          day: 'numeric',
                                                          month: 'short',
                                                          year: 'numeric',
                                                      })
                                                    : ''}
                                            </td>
                                            <td className="px-4 py-3 font-semibold">{item.nama_orang_tua || '-'}</td>
                                            <td className="px-4 py-3 font-semibold">{item.no_hp_wali || '-'}</td>
                                            <td className="px-4 py-3 font-semibold max-w-[150px] truncate">{item.alamat || '-'}</td>
                                            <td className="px-4 py-3 text-center font-bold uppercase text-[10px]">
                                                <span className={
                                                    item.status === 'lulus'
                                                        ? 'text-emerald-600'
                                                        : item.status === 'tidak_lulus'
                                                        ? 'text-red-600'
                                                        : item.status === 'menunggu_verifikasi'
                                                        ? 'text-blue-600'
                                                        : 'text-slate-500'
                                                }>
                                                    {item.status ? item.status.replace('_', ' ') : '-'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-8 text-center text-slate-400 font-semibold">
                                            Tidak ada data untuk laporan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
