import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useEffect } from 'react';
import WhatsAppAdminButton from '@/Components/WhatsAppAdminButton';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Pengumuman({ pendaftaran }) {
    const status = pendaftaran?.status || 'belum_daftar';
    const seleksi = pendaftaran?.seleksi;

    const handlePrint = () => {
        window.print();
    };

    // Helper to format date
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
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
            <Head title="Pengumuman Kelulusan | SPMB MI Nurussalam" />

            {/* Print CSS Styles Override */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-letter-area, .print-letter-area * {
                        visibility: visible;
                    }
                    .print-letter-area {
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

            <div className="mx-auto max-w-3xl space-y-6 gsap-fade-up">
                
                {status === 'belum_daftar' && (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-950 space-y-4">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-900">
                            !
                        </div>
                        <h3 className="text-xl font-bold">Belum Terdaftar</h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto">
                            Anda belum melengkapi formulir pendaftaran. Silakan isi biodata dan upload dokumen terlebih dahulu.
                        </p>
                    </div>
                )}

                {status === 'belum_lengkap' && (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-950 space-y-4">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500 dark:bg-amber-950/40">
                            !
                        </div>
                        <h3 className="text-xl font-bold">Pendaftaran Belum Lengkap</h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto">
                            Biodata Anda sudah tersimpan, namun berkas dokumen belum lengkap terunggah. Selesaikan upload berkas untuk memicu proses seleksi.
                        </p>
                    </div>
                )}

                {(status === 'menunggu_verifikasi' || status === 'proses_seleksi') && (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-950 space-y-6">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-blue-950/40 animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-8 w-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sedang Dalam Proses Peninjauan</h3>
                            <p className="text-sm text-slate-500 max-w-md mx-auto font-medium">
                                Berkas pendaftaran Anda telah lengkap disubmit ke sistem MySQL kami. Saat ini, panitia PMB sedang melakukan audit dan seleksi berkas administrasi calon murid.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900 max-w-sm mx-auto border border-slate-100 dark:border-slate-800">
                            <span className="text-xs font-semibold text-slate-450 uppercase block">Status Pendaftaran</span>
                            <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 block uppercase mt-0.5">Menunggu Evaluasi</span>
                        </div>
                    </div>
                )}

                {status === 'lulus' && (
                    <div className="space-y-6 font-sans">
                        {/* Peringatan Pembayaran Biaya */}
                        {pendaftaran?.payment_status === 'belum_bayar' && (
                            <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 dark:border-amber-955 dark:bg-amber-950/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-400 font-extrabold text-lg">
                                        ⚠️
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-extrabold text-amber-900 dark:text-amber-300 text-sm">Peringatan: Administrasi Biaya Madrasah</h4>
                                        <p className="text-xs text-amber-750 dark:text-amber-450 font-medium leading-relaxed">
                                            Status kelulusan Anda adalah <strong>Diterima</strong>. Harap segera menyelesaikan administrasi biaya sekolah calon murid.
                                            <span className="block mt-1 font-bold text-emerald-700 dark:text-emerald-450">
                                                💡 Info: Biaya pendaftaran dan seragam sekolah dapat dicicil (tidak harus dibayar lunas sekaligus untuk dapat diterima).
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={route('pembayaran.index')}
                                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 active:bg-amber-700 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-500/10 transition-all text-center shrink-0"
                                >
                                    Rincian Biaya & Bayar →
                                </a>
                            </div>
                        )}

                        {pendaftaran?.payment_status === 'cicilan' && (
                            <div className="rounded-3xl border border-blue-200 bg-blue-50/60 p-6 dark:border-blue-950/40 dark:bg-blue-950/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-400 font-extrabold text-lg">
                                        ℹ️
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-extrabold text-blue-900 dark:text-blue-350 text-sm">Status Pembayaran: Dicicil</h4>
                                        <p className="text-xs text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
                                            Anda telah membayar sebagian administrasi (Rp {new Intl.NumberFormat('id-ID').format(pendaftaran?.amount_paid || 0)}). 
                                            Terima kasih atas cicilan pembayaran Anda. Sisa cicilan dapat diselesaikan menyusul.
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={route('pembayaran.index')}
                                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/10 transition-all text-center shrink-0"
                                >
                                    Lihat Riwayat & Bayar →
                                </a>
                            </div>
                        )}

                        {pendaftaran?.payment_status === 'lunas' && (
                            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 dark:border-emerald-950/40 dark:bg-emerald-950/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400 font-extrabold text-lg">
                                        ✓
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-extrabold text-emerald-900 dark:text-emerald-355 text-sm">Pembayaran Lunas</h4>
                                        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                                            Seluruh administrasi biaya sekolah murid baru telah terbayar lunas. Terima kasih.
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={route('pembayaran.index')}
                                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/10 transition-all text-center shrink-0"
                                >
                                    Kuitansi Pembayaran
                                </a>
                            </div>
                        )}

                        {/* Print Action Card */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-850 dark:bg-slate-950 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">Selamat, Anda Diterima!</h4>
                                <p className="text-xs text-slate-500 mt-0.5">Silakan cetak surat keputusan penerimaan murid baru resmi di bawah ini.</p>
                            </div>
                            <button
                                onClick={handlePrint}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.617 0-1.11-.461-1.12-1.078L5.789 18m12.1-.096a42.94 42.94 0 0 0-12.1 0M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                                </svg>
                                Cetak Surat Keputusan
                            </button>
                        </div>

                        {/* Official Letter Area */}
                        <div className="print-letter-area rounded-3xl border border-slate-200 bg-white p-8 md:p-12 dark:border-slate-850 dark:bg-slate-950 shadow-md text-slate-900 space-y-8">
                            
                            {/* Kop Surat Header */}
                            <div className="flex items-center justify-between border-b-4 border-double border-slate-800 pb-6 dark:border-emerald-500/50">
                                <img src="/images/logo-kemenag.png" alt="Logo Kemenag" className="h-16 w-auto object-contain shrink-0" />
                                <div className="text-center flex-1 px-4">
                                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none">MI Nurussalam Sidogede</h2>
                                    <h3 className="text-sm font-bold text-slate-700 dark:text-emerald-400 mt-1 uppercase tracking-wide">Penerimaan Murid Baru Sesi 2026/2027</h3>
                                    <span className="text-[10px] text-slate-400 block mt-0.5">Sidogede, Belitang, OKU Timur, Sumatera Selatan | No HP: 085607746031</span>
                                </div>
                                <img src="/images/logo-nurussalam.png" alt="Logo Nurussalam" className="h-16 w-auto object-contain shrink-0" />
                            </div>

                            {/* Letter Body */}
                            <div className="space-y-6 text-sm leading-relaxed dark:text-slate-200">
                                <div className="text-center font-bold space-y-1">
                                    <h4 className="text-base uppercase tracking-wider underline">Surat Keputusan Penerimaan Murid Baru</h4>
                                    <p className="text-xs text-slate-500 font-semibold">Nomor: SK-PMB/2026/MIS/{pendaftaran.id}</p>
                                </div>

                                <p className="font-semibold">Berdasarkan hasil seleksi berkas administrasi dan kelayakan calon siswa, Panitia Penerimaan Murid Baru MI Nurussalam Sidogede dengan ini menyatakan:</p>

                                {/* Student Details */}
                                <div className="rounded-2xl bg-slate-50 p-6 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 grid grid-cols-1 sm:grid-cols-12 gap-4 font-semibold text-slate-750 dark:text-slate-300">
                                    <div className="sm:col-span-4 text-slate-450 uppercase text-xs tracking-wider">Nama Calon Murid</div>
                                    <div className="sm:col-span-8 text-slate-900 dark:text-white">: {pendaftaran.nama_lengkap}</div>

                                    <div className="sm:col-span-4 text-slate-450 uppercase text-xs tracking-wider">Tempat, Tanggal Lahir</div>
                                    <div className="sm:col-span-8">: {pendaftaran.tempat_lahir}, {formatDate(pendaftaran.tanggal_lahir)}</div>

                                    <div className="sm:col-span-4 text-slate-450 uppercase text-xs tracking-wider">Jenis Kelamin</div>
                                    <div className="sm:col-span-8">: {pendaftaran.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</div>

                                    <div className="sm:col-span-4 text-slate-450 uppercase text-xs tracking-wider">Wali Murid</div>
                                    <div className="sm:col-span-8">: {pendaftaran.nama_orang_tua}</div>

                                    <div className="sm:col-span-4 text-slate-450 uppercase text-xs tracking-wider">Status Kelayakan</div>
                                    <div className="sm:col-span-8 text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wide animate-pulse">: Diterima (Lulus Seleksi)</div>
                                </div>

                                <div className="space-y-2">
                                    <span className="block font-bold">Catatan Keputusan:</span>
                                    <p className="rounded-xl border border-slate-100 p-4 bg-white/50 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 italic font-medium">
                                        "{seleksi?.catatan || 'Berkas lengkap dan sesuai standar kelayakan MI Nurussalam Sidogede.'}"
                                    </p>
                                </div>

                                <p className="font-medium text-slate-600 dark:text-slate-400">
                                    Selamat bergabung dengan keluarga besar MI Nurussalam Sidogede. Harap siapkan berkas fisik saat melakukan daftar ulang ke sekolah sesuai waktu yang ditentukan.
                                </p>
                            </div>

                            {/* Signatures */}
                            <div className="pt-12 flex justify-end">
                                <div className="text-center font-bold space-y-2">
                                    <div>
                                        <span className="block text-xs text-slate-400">Belitang, {formatDate(new Date())}</span>
                                        <span className="block text-sm text-slate-900 dark:text-white">Kepala Sekolah MI Nurussalam</span>
                                    </div>
                                    <div className="flex justify-center items-center my-2">
                                         <img src="/images/tanda_tangan.png" alt="Tanda Tangan" className="h-20 object-contain" />
                                     </div>
                                    <div className="w-48 border-t border-slate-800 mx-auto dark:border-slate-200 pt-1.5 text-xs tracking-widest font-bold">
                                        Ust. Umar, S.Pd
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {status === 'tidak_lulus' && (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 dark:border-slate-850 dark:bg-slate-950 shadow-md text-slate-850 space-y-6">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/40">
                            ✕
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Keputusan Hasil Seleksi</h3>
                            <p className="text-xs text-slate-500 font-semibold">Nomor: SK-PMB/2026/MIS/{pendaftaran.id}</p>
                        </div>
                        <div className="space-y-4 text-sm leading-relaxed dark:text-slate-300 font-medium">
                            <p>Setelah melakukan peninjauan berkas pendaftaran calon siswa:</p>
                            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/50 dark:bg-slate-900 dark:border-slate-800/50">
                                <span className="text-xs text-slate-400 uppercase tracking-widest">Nama Pendaftar</span>
                                <span className="block font-bold text-slate-900 dark:text-white mt-0.5">{pendaftaran.nama_lengkap}</span>
                            </div>
                            <p>
                                Panitia Penerimaan Murid Baru menyatakan bahwa pendaftaran Anda saat ini dinyatakan <strong className="text-red-600 dark:text-red-400">TIDAK LULUS SELEKSI</strong>.
                            </p>
                            
                            <div className="space-y-2">
                                <span className="block font-bold">Catatan Penolakan Berkas:</span>
                                <p className="rounded-xl border border-slate-100 p-4 bg-white/50 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 italic font-semibold">
                                    "{seleksi?.catatan || 'Berkas dokumen kurang lengkap atau tidak sesuai kriteria penerimaan.'}"
                                </p>
                            </div>

                            <p className="text-slate-500 dark:text-slate-400 text-xs">
                                Terima kasih atas partisipasi dan antusiasme Anda mendaftar di MI Nurussalam Sidogede. Semoga sukses di institusi lainnya.
                            </p>
                        </div>
                    </div>
                )}

            </div>
            <WhatsAppAdminButton pageName="Pengumuman" />
        </AuthenticatedLayout>
    );
}
