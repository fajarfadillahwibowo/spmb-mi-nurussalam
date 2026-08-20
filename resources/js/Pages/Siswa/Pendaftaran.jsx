import React, { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import WhatsAppAdminButton from '@/Components/WhatsAppAdminButton';
import PhotoUpload from '@/Components/PhotoUpload';
import { Head, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Pendaftaran({ pendaftaran, status }) {
    const { data, setData, post, processing, errors } = useForm({
        nik: pendaftaran?.nik || '',
        nama_lengkap: pendaftaran?.nama_lengkap || '',
        asal_sekolah: pendaftaran?.asal_sekolah || '',
        tempat_lahir: pendaftaran?.tempat_lahir || '',
        tanggal_lahir: pendaftaran?.tanggal_lahir || '',
        jenis_kelamin: pendaftaran?.jenis_kelamin || '',
        alamat: pendaftaran?.alamat || '',
        nama_orang_tua: pendaftaran?.nama_orang_tua || '',
        no_hp_wali: pendaftaran?.no_hp_wali || '',
        pas_foto: null,
    });

    const [nikValidation, setNikValidation] = useState({ valid: false, message: '', info: null });

    useEffect(() => {
        if (pendaftaran?.nik) {
            validateNik(pendaftaran.nik);
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
    }, []);

    useEffect(() => {
        if (status) {
            Swal.fire({
                title: 'Berhasil!',
                text: status,
                icon: 'success',
                confirmButtonColor: '#059669',
                background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
                color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#1e293b',
                customClass: {
                    popup: 'rounded-3xl border border-slate-200 dark:border-slate-800',
                    confirmButton: 'rounded-xl font-bold px-6 py-2.5 shadow-sm',
                }
            });
        }
    }, [status]);

    const validateNik = (value) => {
        // Only allow numbers
        const cleaned = value.replace(/[^0-9]/g, '').slice(0, 16);
        setData('nik', cleaned);

        if (cleaned.length === 0) {
            setNikValidation({ valid: false, message: '', info: null });
            return;
        }

        if (cleaned.length < 16) {
            setNikValidation({
                valid: false,
                message: `NIK harus 16 digit. Saat ini baru ${cleaned.length} digit.`,
                info: null
            });
            return;
        }

        // Extract info from NIK
        // Digits 1-2: Province code
        // Digits 3-4: City/Regency code
        // Digits 5-6: District code
        // Digits 7-12: Birth date (DDMMYY, for females DD+40)
        const birthDateDigits = cleaned.substring(6, 12);
        let day = parseInt(birthDateDigits.substring(0, 2));
        const month = parseInt(birthDateDigits.substring(2, 4));
        const year = parseInt(birthDateDigits.substring(4, 6));

        const gender = day > 40 ? 'Perempuan' : 'Laki-laki';
        if (day > 40) day -= 40;

        const fullYear = year > 30 ? 1900 + year : 2000 + year;
        const monthNames = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        if (month < 1 || month > 12 || day < 1 || day > 31) {
            setNikValidation({
                valid: false,
                message: 'NIK tidak valid \u2014 tanggal lahir yang ter-encode tidak sesuai.',
                info: null
            });
            return;
        }

        setNikValidation({
            valid: true,
            message: 'NIK valid (16 digit terverifikasi)',
            info: {
                gender,
                birthDate: `${day} ${monthNames[month]} ${fullYear}`,
                provinceCode: cleaned.substring(0, 2),
                cityCode: cleaned.substring(2, 4),
                districtCode: cleaned.substring(4, 6),
            }
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('pendaftaran.store'));
    };

    return (
        <AuthenticatedLayout header="Isi Biodata Calon Murid">
            <Head title="Isi Biodata | SPMB MI Nurussalam" />

            <div className="mx-auto max-w-3xl space-y-6">
                {pendaftaran && (
                    <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-900/50 dark:bg-blue-950/20 shadow-sm flex items-start gap-3">
                        <span className="text-2xl">💡</span>
                        <div>
                            <h4 className="font-extrabold text-blue-900 dark:text-blue-300 text-sm">Mode Edit Tersedia</h4>
                            <p className="mt-1 text-xs font-semibold text-blue-750 dark:text-blue-450 leading-relaxed">
                                Biodata Anda telah tersimpan. Anda masih dapat mengedit atau memperbarui data di bawah ini jika terdapat kesalahan atau perubahan informasi.
                            </p>
                        </div>
                    </div>
                )}

                <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 dark:border-slate-800 dark:bg-slate-950 shadow-sm space-y-6 gsap-fade-up">
                    <div className="gsap-fade-right">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Formulir Biodata</h3>
                        <p className="text-xs text-slate-500 mt-1">Harap isi seluruh informasi di bawah ini dengan benar sesuai dengan dokumen kependudukan resmi.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Pas Foto Upload */}
                        <PhotoUpload 
                            existingPhotoUrl={pendaftaran?.pas_foto_path ? `/storage/${pendaftaran.pas_foto_path}` : null}
                            onPhotoChange={(file) => setData('pas_foto', file)}
                            errorMessage={errors.pas_foto}
                        />

                        {/* Nama Lengkap */}
                        <div className="space-y-1">
                            <InputLabel htmlFor="nama_lengkap" value="Nama Lengkap Calon Murid" />
                            <TextInput
                                id="nama_lengkap"
                                type="text"
                                name="nama_lengkap"
                                value={data.nama_lengkap}
                                className="mt-1 block w-full border-slate-350 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-500"
                                onChange={(e) => setData('nama_lengkap', e.target.value)}
                                required
                            />
                            <InputError message={errors.nama_lengkap} className="mt-1" />
                        </div>

                        {/* Asal Sekolah */}
                        <div className="space-y-1">
                            <InputLabel htmlFor="asal_sekolah" value="Asal Sekolah / RA / TK" />
                            <TextInput
                                id="asal_sekolah"
                                type="text"
                                name="asal_sekolah"
                                value={data.asal_sekolah}
                                placeholder="Masukkan nama sekolah asal (TK/RA)"
                                className="mt-1 block w-full border-slate-350 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-500"
                                onChange={(e) => setData('asal_sekolah', e.target.value)}
                            />
                            <InputError message={errors.asal_sekolah} className="mt-1" />
                        </div>


                        {/* TTL & Jenis Kelamin Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Tempat Lahir */}
                            <div className="space-y-1">
                                <InputLabel htmlFor="tempat_lahir" value="Tempat Lahir" />
                                <TextInput
                                    id="tempat_lahir"
                                    type="text"
                                    name="tempat_lahir"
                                    value={data.tempat_lahir}
                                    className="mt-1 block w-full border-slate-350 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-500"
                                    onChange={(e) => setData('tempat_lahir', e.target.value)}
                                    required
                                />
                                <InputError message={errors.tempat_lahir} className="mt-1" />
                            </div>

                            {/* Tanggal Lahir */}
                            <div className="space-y-1">
                                <InputLabel htmlFor="tanggal_lahir" value="Tanggal Lahir" />
                                <TextInput
                                    id="tanggal_lahir"
                                    type="date"
                                    name="tanggal_lahir"
                                    value={data.tanggal_lahir}
                                    className="mt-1 block w-full border-slate-355 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-500"
                                    onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                    required
                                />
                                <InputError message={errors.tanggal_lahir} className="mt-1" />
                            </div>

                            {/* Jenis Kelamin */}
                            <div className="space-y-1">
                                <InputLabel htmlFor="jenis_kelamin" value="Jenis Kelamin" />
                                <select
                                    id="jenis_kelamin"
                                    name="jenis_kelamin"
                                    value={data.jenis_kelamin}
                                    onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                                    required
                                >
                                    <option value="">Pilih...</option>
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                                <InputError message={errors.jenis_kelamin} className="mt-1" />
                            </div>
                        </div>

                        {/* Alamat Lengkap */}
                        <div className="space-y-1">
                            <InputLabel htmlFor="alamat" value="Alamat Lengkap Rumah" />
                            <textarea
                                id="alamat"
                                name="alamat"
                                value={data.alamat}
                                rows="4"
                                className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                                onChange={(e) => setData('alamat', e.target.value)}
                                required
                            ></textarea>
                            <InputError message={errors.alamat} className="mt-1" />
                        </div>

                        {/* Wali & No HP Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nama Wali */}
                            <div className="space-y-1">
                                <InputLabel htmlFor="nama_orang_tua" value="Nama Orang Tua / Wali" />
                                <TextInput
                                    id="nama_orang_tua"
                                    type="text"
                                    name="nama_orang_tua"
                                    value={data.nama_orang_tua}
                                    className="mt-1 block w-full border-slate-360 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-500"
                                    onChange={(e) => setData('nama_orang_tua', e.target.value)}
                                    required
                                />
                                <InputError message={errors.nama_orang_tua} className="mt-1" />
                            </div>

                            {/* No HP Wali */}
                            <div className="space-y-1">
                                <InputLabel htmlFor="no_hp_wali" value="No. HP / WhatsApp Wali" />
                                <TextInput
                                    id="no_hp_wali"
                                    type="text"
                                    name="no_hp_wali"
                                    value={data.no_hp_wali}
                                    placeholder="Contoh: 0856xxxxxx"
                                    className="mt-1 block w-full border-slate-365 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-500"
                                    onChange={(e) => setData('no_hp_wali', e.target.value)}
                                    required
                                />
                                <InputError message={errors.no_hp_wali} className="mt-1" />
                            </div>
                        </div>

                        {/* NIK */}
                        <div className="space-y-1">
                            <InputLabel htmlFor="nik" value="Nomor Induk Kependudukan (NIK)" />
                            <div className="relative">
                                <TextInput
                                    id="nik"
                                    type="text"
                                    name="nik"
                                    value={data.nik}
                                    placeholder="Masukkan 16 digit NIK"
                                    className={`mt-1 block w-full border-slate-300 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-500 ${
                                        data.nik.length > 0 && !nikValidation.valid ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''
                                    } ${
                                        nikValidation.valid ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500' : ''
                                    }`}
                                    onChange={(e) => validateNik(e.target.value)}
                                    maxLength={16}
                                    required
                                />
                                {data.nik.length > 0 && (
                                    <div className={`absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                        nikValidation.valid
                                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                                            : 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400'
                                    }`}>
                                        {nikValidation.valid ? '✓' : '!'}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <div>
                                    {nikValidation.message && (
                                        <p className={`text-xs font-semibold ${
                                            nikValidation.valid ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                                        }`}>
                                            {nikValidation.message}
                                        </p>
                                    )}
                                    <InputError message={errors.nik} className="mt-1" />
                                </div>
                                <span className="text-xs text-slate-400 font-mono">{data.nik.length}/16</span>
                            </div>

                            {/* NIK Info Card */}
                            {nikValidation.valid && nikValidation.info && (
                                <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                                    <div className="flex items-center gap-2 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4 text-emerald-600 dark:text-emerald-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                        </svg>
                                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Informasi dari NIK</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="rounded-lg bg-white/70 dark:bg-slate-900/50 p-2">
                                            <span className="font-bold text-slate-500 block">Jenis Kelamin</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200">{nikValidation.info.gender}</span>
                                        </div>
                                        <div className="rounded-lg bg-white/70 dark:bg-slate-900/50 p-2">
                                            <span className="font-bold text-slate-500 block">Tanggal Lahir</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200">{nikValidation.info.birthDate}</span>
                                        </div>
                                        <div className="rounded-lg bg-white/70 dark:bg-slate-900/50 p-2">
                                            <span className="font-bold text-slate-500 block">Kode Provinsi</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200">{nikValidation.info.provinceCode}</span>
                                        </div>
                                        <div className="rounded-lg bg-white/70 dark:bg-slate-900/50 p-2">
                                            <span className="font-bold text-slate-500 block">Kode Kab/Kota</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200">{nikValidation.info.cityCode}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
                            <PrimaryButton
                                className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 focus:ring-emerald-500"
                                disabled={processing}
                            >
                                {pendaftaran ? 'Perbarui Biodata' : 'Simpan Biodata'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
            <WhatsAppAdminButton pageName="Pendaftaran" />
        </AuthenticatedLayout>
    );
}
