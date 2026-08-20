import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import WhatsAppAdminButton from '@/Components/WhatsAppAdminButton';
import { Head, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function UploadDokumen({ dokumen, status, error }) {
    const { data, setData, post, processing, errors } = useForm({
        akta_kelahiran: null,
        kartu_keluarga: null,
        identitas_ortu: null,
        ijazah: null,
        pkh_kks: null,
    });

    const [clientErrors, setClientErrors] = useState({});

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

    // Client-side file validation
    const validateFile = (file, fieldName) => {
        if (!file) return true;

        const maxSize = 2 * 1024 * 1024; // 2MB
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

        let errorMsg = null;

        if (file.size > maxSize) {
            errorMsg = 'Ukuran berkas melebihi batas 2 MB.';
        } else if (!allowedTypes.includes(file.type)) {
            errorMsg = 'Format berkas tidak valid. Harap unggah PDF, JPG, atau PNG.';
        }

        setClientErrors((prev) => ({
            ...prev,
            [fieldName]: errorMsg,
        }));

        return !errorMsg;
    };

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            const isValid = validateFile(file, fieldName);
            if (isValid) {
                setData(fieldName, file);
            } else {
                setData(fieldName, null);
                e.target.value = null; // Reset input field
            }
        }
    };

    const submit = (e) => {
        e.preventDefault();

        // Check if any errors exist
        const hasErrors = Object.values(clientErrors).some((err) => err !== null);
        if (hasErrors) return;

        post(route('dokumen.store'), {
            forceFormData: true,
        });
    };

    const getFileUrl = (path) => `/storage/${path}`;

    const renderStatusIndicator = (path, name) => {
        if (path) {
            return (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-emerald-50/50 p-4 border border-emerald-200/50 dark:bg-emerald-950/20 dark:border-emerald-900/50">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                            ✓
                        </div>
                        <div>
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">{name} Terunggah</span>
                            <span className="text-xs text-slate-500 font-medium block">Berkas siap diverifikasi panitia</span>
                        </div>
                    </div>
                    <a
                        href={getFileUrl(path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-350 dark:hover:bg-slate-900"
                    >
                        Lihat Berkas
                    </a>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-3 rounded-2xl bg-amber-50/50 p-4 border border-amber-200/50 dark:bg-amber-950/20 dark:border-amber-900/50">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                    !
                </div>
                <div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">{name} Belum Diunggah</span>
                    <span className="text-xs text-slate-500 font-medium block">Silakan pilih file dan unggah di bawah ini</span>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout header="Unggah Berkas Dokumen">
            <Head title="Unggah Dokumen | SPMB MI Nurussalam" />

            <div className="mx-auto max-w-3xl space-y-6 gsap-fade-up">
                {/* Status banner removed in favor of SweetAlert2 */}

                {(error || errors.error) && (
                    <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-800 dark:bg-red-950/60 dark:text-red-400 border border-red-200/50 dark:border-red-800/50">
                        {error || errors.error}
                    </div>
                )}

                {/* File Status List */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 dark:border-slate-800 dark:bg-slate-950 shadow-sm space-y-4">
                    <h3 className="text-base font-bold">Status Berkas Dokumen</h3>
                    <div className="space-y-3">
                        {renderStatusIndicator(dokumen?.kartu_keluarga_path, 'Scan Kartu Keluarga (KK)')}
                        {renderStatusIndicator(dokumen?.identitas_ortu_path, 'Scan KTP Orang Tua')}
                        {renderStatusIndicator(dokumen?.akta_kelahiran_path, 'Scan Akta Kelahiran')}
                        {renderStatusIndicator(dokumen?.ijazah_path, 'Ijazah RA/TK')}
                        {dokumen?.pkh_kks_path ? (
                            renderStatusIndicator(dokumen?.pkh_kks_path, 'Kartu PKH/KKS/Jaminan Sosial')
                        ) : (
                            <div className="flex items-center gap-3 rounded-2xl bg-slate-50/50 p-4 border border-slate-200/50 dark:bg-slate-900/20 dark:border-slate-800/50">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                                    —
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">Kartu PKH/KKS/Jaminan Sosial</span>
                                    <span className="text-xs text-slate-400 font-medium block">Opsional — tidak wajib diunggah</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Upload Form */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 dark:border-slate-800 dark:bg-slate-950 shadow-sm space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Unggah Berkas Baru</h3>
                        <p className="text-xs text-slate-500 mt-1">Harap pastikan file berformat PDF, JPG, atau PNG dengan ukuran maksimal 2 MB per file.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Kartu Keluarga */}
                        <div className="space-y-2">
                            <InputLabel htmlFor="kartu_keluarga" value="Scan Kartu Keluarga (KK) (PDF, JPG, PNG - Max 2MB)" />
                            <input
                                id="kartu_keluarga"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e, 'kartu_keluarga')}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-900 dark:file:text-slate-350"
                            />
                            {clientErrors.kartu_keluarga && <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1">{clientErrors.kartu_keluarga}</p>}
                            <InputError message={errors.kartu_keluarga} className="mt-1" />
                        </div>

                        {/* KTP Orang Tua */}
                        <div className="space-y-2">
                            <InputLabel htmlFor="identitas_ortu" value="Scan KTP Orang Tua (PDF, JPG, PNG - Max 2MB)" />
                            <input
                                id="identitas_ortu"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e, 'identitas_ortu')}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-900 dark:file:text-slate-350"
                            />
                            {clientErrors.identitas_ortu && <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1">{clientErrors.identitas_ortu}</p>}
                            <InputError message={errors.identitas_ortu} className="mt-1" />
                        </div>

                        {/* Akta Kelahiran */}
                        <div className="space-y-2">
                            <InputLabel htmlFor="akta_kelahiran" value="Scan Akta Kelahiran (PDF, JPG, PNG - Max 2MB)" />
                            <input
                                id="akta_kelahiran"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e, 'akta_kelahiran')}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-900 dark:file:text-slate-350"
                            />
                            {clientErrors.akta_kelahiran && <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1">{clientErrors.akta_kelahiran}</p>}
                            <InputError message={errors.akta_kelahiran} className="mt-1" />
                        </div>

                        {/* Ijazah RA/TK */}
                        <div className="space-y-2">
                            <InputLabel htmlFor="ijazah" value="Scan Ijazah RA/TK (PDF, JPG, PNG - Max 2MB)" />
                            <input
                                id="ijazah"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e, 'ijazah')}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-900 dark:file:text-slate-350"
                            />
                            {clientErrors.ijazah && <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1">{clientErrors.ijazah}</p>}
                            <InputError message={errors.ijazah} className="mt-1" />
                        </div>

                        {/* Kartu PKH/KKS/Jaminan Sosial (Opsional) */}
                        <div className="space-y-2">
                            <InputLabel htmlFor="pkh_kks" value="Scan Kartu PKH/KKS/Jaminan Sosial (Opsional - PDF, JPG, PNG - Max 2MB)" />
                            <p className="text-xs text-slate-400 -mt-1">Dokumen ini bersifat opsional. Tidak wajib diunggah.</p>
                            <input
                                id="pkh_kks"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e, 'pkh_kks')}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-900 dark:file:text-slate-350"
                            />
                            {clientErrors.pkh_kks && <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1">{clientErrors.pkh_kks}</p>}
                            <InputError message={errors.pkh_kks} className="mt-1" />
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
                            <PrimaryButton
                                className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 focus:ring-emerald-500"
                                disabled={processing || Object.values(clientErrors).some(err => err !== null)}
                            >
                                Unggah Dokumen
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
            <WhatsAppAdminButton pageName="Upload Dokumen" />
        </AuthenticatedLayout>
    );
}
