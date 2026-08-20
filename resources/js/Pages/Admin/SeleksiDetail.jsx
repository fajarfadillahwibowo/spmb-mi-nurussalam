import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SeleksiDetail({ pendaftaran, status }) {
    const { data, setData, post, processing, errors } = useForm({
        status_seleksi: pendaftaran.seleksi?.status_seleksi || '',
        catatan: pendaftaran.seleksi?.catatan || '',
    });

    const [activeTab, setActiveTab] = useState('kk'); // kk | ktp | akta | ijazah | pkh_kks

    const submit = (e) => {
        e.preventDefault();
        post(route('seleksi.evaluate', pendaftaran.id));
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

    const getFileUrl = (path) => {
        if (!path) return null;
        return `/storage/${path}`;
    };

    const isPdf = (path) => {
        if (!path) return false;
        return path.toLowerCase().endsWith('.pdf');
    };

    const renderDocumentInline = (path, name) => {
        const url = getFileUrl(path);
        if (!url) {
            return (
                <div className="flex h-96 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-400 dark:border-slate-800">
                    <span className="text-sm font-semibold">{name} belum diunggah oleh pendaftar.</span>
                </div>
            );
        }

        if (isPdf(path)) {
            return (
                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white dark:border-slate-800 w-full h-[550px]">
                    <iframe src={url} className="w-full h-full" title={name}></iframe>
                </div>
            );
        }

        return (
            <div className="flex justify-center items-center rounded-2xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900 w-full min-h-[450px]">
                <img src={url} alt={name} className="max-w-full max-h-[500px] object-contain rounded-xl shadow-md" />
            </div>
        );
    };

    return (
        <AuthenticatedLayout header="Detail & Evaluasi Pendaftar">
            <Head title="Tinjau Berkas | SPMB MI Nurussalam" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Student Biodata & Decision Card */}
                <div className="lg:col-span-5 space-y-6 gsap-fade-right">
                    {/* Biodata Card */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-850 dark:bg-slate-950 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profil Pendaftar</h3>
                            <Link href={route('seleksi.index')} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
                                &larr; Kembali
                            </Link>
                        </div>

                        <div className="space-y-4 text-sm font-semibold">
                            <div className="border-b border-slate-100 pb-3 dark:border-slate-850">
                                <span className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Nama Lengkap</span>
                                <span className="text-slate-800 dark:text-slate-200">{pendaftaran.nama_lengkap}</span>
                            </div>

                            <div className="border-b border-slate-100 pb-3 dark:border-slate-850 grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Tempat Lahir</span>
                                    <span className="text-slate-800 dark:text-slate-200">{pendaftaran.tempat_lahir}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Tanggal Lahir</span>
                                    <span className="text-slate-800 dark:text-slate-200">
                                        {new Date(pendaftaran.tanggal_lahir).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>

                            <div className="border-b border-slate-100 pb-3 dark:border-slate-850">
                                <span className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Jenis Kelamin</span>
                                <span className="text-slate-800 dark:text-slate-200">
                                    {pendaftaran.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                </span>
                            </div>

                            <div className="border-b border-slate-100 pb-3 dark:border-slate-850">
                                <span className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Alamat Lengkap</span>
                                <span className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium block">
                                    {pendaftaran.alamat}
                                </span>
                            </div>

                            <div className="border-b border-slate-100 pb-3 dark:border-slate-850 grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Nama Wali</span>
                                    <span className="text-slate-800 dark:text-slate-200">{pendaftaran.nama_orang_tua}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-slate-400 uppercase tracking-widest mb-1">No. HP Wali</span>
                                    <span className="text-slate-800 dark:text-slate-200">{pendaftaran.no_hp_wali}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Evaluation decision form */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-850 dark:bg-slate-950 shadow-sm space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Keputusan Seleksi</h3>
                            <p className="text-xs text-slate-500 mt-1">Masukkan hasil penilaian dan catatan mengenai berkas dokumen pendaftar.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <InputLabel htmlFor="status_seleksi" value="Pilih Hasil Keputusan" />
                                <select
                                    id="status_seleksi"
                                    name="status_seleksi"
                                    value={data.status_seleksi}
                                    onChange={(e) => setData('status_seleksi', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                                    required
                                >
                                    <option value="">Pilih Hasil...</option>
                                    <option value="lulus">Lulus (Diterima)</option>
                                    <option value="tidak_lulus">Tidak Lulus (Ditolak)</option>
                                </select>
                                <InputError message={errors.status_seleksi} className="mt-1" />
                            </div>

                            <div className="space-y-2">
                                <InputLabel htmlFor="catatan" value="Catatan Penilaian" />
                                <textarea
                                    id="catatan"
                                    name="catatan"
                                    value={data.catatan}
                                    onChange={(e) => setData('catatan', e.target.value)}
                                    rows="4"
                                    placeholder="Masukkan alasan penerimaan/penolakan atau catatan tambahan berkas..."
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                                ></textarea>
                                <InputError message={errors.catatan} className="mt-1" />
                            </div>

                            <div className="pt-2 border-t border-slate-100 dark:border-slate-850 space-y-3">
                                {/* WA auto-notify info */}
                                <div className="flex items-start gap-2.5 rounded-xl bg-[#25D366]/8 border border-[#25D366]/20 px-3.5 py-3">
                                    <div className="shrink-0 mt-0.5 flex h-6 w-6 items-center justify-center rounded-lg bg-[#25D366]">
                                        <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Notifikasi WA Otomatis</p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                                            Saat status berubah, pesan WA akan terkirim otomatis ke wali siswa:
                                            <span className="ml-1 font-bold text-[#25D366]">{pendaftaran.no_hp_wali || '(nomor belum diisi)'}</span>
                                        </p>
                                    </div>
                                </div>

                                <PrimaryButton
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 focus:ring-emerald-500 py-3"
                                    disabled={processing}
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Keputusan'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Side: Document Previewer Tabs */}
                <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-850 dark:bg-slate-950 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4 dark:border-slate-850">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Audit Dokumen Terunggah</h3>
                        
                        {/* Tab Buttons */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveTab('kk')}
                                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                    activeTab === 'kk'
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                                        : 'bg-slate-100 text-slate-655 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-350'
                                }`}
                            >
                                Kartu Keluarga
                            </button>
                            <button
                                onClick={() => setActiveTab('ktp')}
                                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                    activeTab === 'ktp'
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                                        : 'bg-slate-100 text-slate-655 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-350'
                                }`}
                            >
                                KTP Orang Tua
                            </button>
                            <button
                                onClick={() => setActiveTab('akta')}
                                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                    activeTab === 'akta'
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                                        : 'bg-slate-100 text-slate-655 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-350'
                                }`}
                            >
                                Akta Kelahiran
                            </button>
                            <button
                                onClick={() => setActiveTab('ijazah')}
                                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                    activeTab === 'ijazah'
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                                        : 'bg-slate-100 text-slate-655 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-350'
                                }`}
                            >
                                Ijazah RA/TK
                            </button>
                            <button
                                onClick={() => setActiveTab('pkh_kks')}
                                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                    activeTab === 'pkh_kks'
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                                        : 'bg-slate-100 text-slate-655 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-350'
                                }`}
                            >
                                PKH/KKS (Opsional)
                            </button>
                        </div>
                    </div>

                    {/* View Document area */}
                    <div className="w-full">
                        {activeTab === 'kk' && renderDocumentInline(pendaftaran.dokumen?.kartu_keluarga_path, 'Scan Kartu Keluarga (KK)')}
                        {activeTab === 'ktp' && renderDocumentInline(pendaftaran.dokumen?.identitas_ortu_path, 'Scan KTP Orang Tua')}
                        {activeTab === 'akta' && renderDocumentInline(pendaftaran.dokumen?.akta_kelahiran_path, 'Scan Akta Kelahiran')}
                        {activeTab === 'ijazah' && renderDocumentInline(pendaftaran.dokumen?.ijazah_path, 'Scan Ijazah RA/TK')}
                        {activeTab === 'pkh_kks' && renderDocumentInline(pendaftaran.dokumen?.pkh_kks_path, 'Scan Kartu PKH/KKS/Jaminan Sosial')}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
