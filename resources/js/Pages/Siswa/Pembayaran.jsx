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

export default function Pembayaran({ pendaftaran, status }) {
    const currentStatus = pendaftaran?.payment_status || 'belum_bayar';
    const currentAmountPaid = parseFloat(pendaftaran?.amount_paid || 0);

    // Fixed Components of Fee
    const FEES = {
        pendaftaran: 0,
        kaosOlahraga: 160000,
        bukuRapor: 100000,
        bukuLks: 100000,
        foto: 20000,
        ekskul: 50000,
    };

    // Wakaf option state
    const [wakafAmount, setWakafAmount] = useState(100000);
    const [paymentOption, setPaymentOption] = useState('lunas'); // lunas | cicilan
    const [customAmount, setCustomAmount] = useState('');
    const [clientError, setClientError] = useState('');

    const fixedTotal = FEES.kaosOlahraga + FEES.bukuRapor + FEES.bukuLks + FEES.foto + FEES.ekskul;
    const totalBill = fixedTotal + wakafAmount;
    const remainingBalance = Math.max(0, totalBill - currentAmountPaid);

    const { data, setData, post, processing, errors } = useForm({
        payment_status: 'lunas',
        amount_paid: 0,
        bukti_pembayaran: null,
    });

    useEffect(() => {
        const amt = paymentOption === 'lunas' ? remainingBalance : (parseFloat(customAmount) || 0);
        setData({
            ...data,
            payment_status: paymentOption,
            amount_paid: amt
        });
    }, [paymentOption, customAmount, remainingBalance, wakafAmount]);

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

    const formatRupiah = (num) => {
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const maxSize = 2 * 1024 * 1024; // 2MB
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

        if (file.size > maxSize) {
            setClientError('Ukuran bukti pembayaran melebihi batas 2 MB.');
            setData('bukti_pembayaran', null);
            e.target.value = null;
        } else if (!allowedTypes.includes(file.type)) {
            setClientError('Format berkas harus berupa PDF, JPG, atau PNG.');
            setData('bukti_pembayaran', null);
            e.target.value = null;
        } else {
            setClientError('');
            setData('bukti_pembayaran', file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (clientError) return;

        if (paymentOption === 'cicilan') {
            const amt = parseFloat(customAmount) || 0;
            if (amt <= 0) {
                setClientError('Nominal angsuran cicilan harus diisi.');
                return;
            }
            if (amt > remainingBalance) {
                setClientError(`Nominal angsuran tidak boleh melebihi sisa tagihan (${formatRupiah(remainingBalance)}).`);
                return;
            }
        }

        post(route('pembayaran.pay'), {
            forceFormData: true,
        });
    };


    return (
        <AuthenticatedLayout header="Pembayaran & Biaya Sekolah">
            <Head title="Pembayaran | SPMB MI Nurussalam" />

            <div className="mx-auto max-w-5xl space-y-6 gsap-fade-up">
                {/* Status banner removed in favor of SweetAlert2 */}

                {pendaftaran?.catatan_pembayaran && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 dark:border-rose-900/50 dark:bg-rose-950/20">
                        <div className="flex items-start gap-3">
                            <span className="text-xl">⚠️</span>
                            <div>
                                <h4 className="font-extrabold text-rose-800 dark:text-rose-400 text-sm">Catatan Verifikasi Pembayaran</h4>
                                <p className="mt-1 text-xs font-semibold text-rose-700 dark:text-rose-450">{pendaftaran.catatan_pembayaran}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Billing Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 gsap-stagger-container">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm flex items-center gap-4 gsap-stagger-item">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-xl">
                            📋
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-450 block uppercase">Total Tagihan</span>
                            <span className="text-lg font-black text-slate-800 dark:text-white block">{formatRupiah(totalBill)}</span>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm flex items-center gap-4 gsap-stagger-item">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-xl text-emerald-600">
                            ✓
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-450 block uppercase">Jumlah Terbayar</span>
                            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 block">{formatRupiah(currentAmountPaid)}</span>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm flex items-center gap-4 gsap-stagger-item">
                        <div className="h-12 w-12 rounded-2xl bg-amber-100 dark:bg-amber-955/50 flex items-center justify-center text-xl text-amber-600">
                            ⏳
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-450 block uppercase">Sisa Tagihan</span>
                            <span className="text-lg font-black text-amber-600 dark:text-amber-400 block">{formatRupiah(remainingBalance)}</span>
                        </div>
                    </div>
                </div>

                {/* Cicilan/Installment Info Banner */}
                <div className="rounded-3xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900/50 dark:bg-blue-950/20 shadow-sm">
                    <div className="flex gap-4">
                        <span className="text-2xl">💡</span>
                        <div className="space-y-1">
                            <h4 className="font-extrabold text-blue-900 dark:text-blue-300 text-sm">Pembayaran Dapat Dicicil</h4>
                            <p className="text-xs text-blue-750 dark:text-blue-450 font-semibold leading-relaxed">
                                Biaya masuk MI Nurussalam <strong>tidak harus langsung lunas</strong> agar calon siswa diterima. Pembayaran dapat diangsur secara bertahap sesuai kemampuan.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Fee Breakdown */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 dark:border-slate-800 dark:bg-slate-950 shadow-sm space-y-6">
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Rincian Komponen Biaya</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Berikut adalah 7 komponen biaya penerimaan murid baru:</p>
                            </div>

                            <div className="space-y-3.5 divide-y divide-slate-100 dark:divide-slate-900">
                                <div className="flex justify-between items-center pt-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                    <span>1. Biaya Pendaftaran</span>
                                    <span className="text-emerald-600 dark:text-emerald-400">Rp 0 (Gratis)</span>
                                </div>
                                <div className="flex justify-between items-center pt-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    <span>2. Uang Kaos Olahraga</span>
                                    <span>{formatRupiah(FEES.kaosOlahraga)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    <span>3. Uang Buku Rapor</span>
                                    <span>{formatRupiah(FEES.bukuRapor)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    <span>4. Uang Buku Paket / LKS</span>
                                    <span>{formatRupiah(FEES.bukuLks)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    <span>5. Uang Foto</span>
                                    <span>{formatRupiah(FEES.foto)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    <span>6. Uang Kegiatan Eskul</span>
                                    <span>{formatRupiah(FEES.ekskul)}</span>
                                </div>
                                <div className="pt-4 space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">7. Uang Wakaf Pengembangan Madrasah</span>
                                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full inline-block mt-0.5">
                                                Layanan ZISWAF Wakaf, Zakat, Infaq, Sedekah
                                            </span>
                                        </div>
                                        <select
                                            value={wakafAmount}
                                            onChange={(e) => setWakafAmount(parseInt(e.target.value))}
                                            disabled={currentStatus !== 'belum_bayar'}
                                            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold focus:border-emerald-500 focus:outline-none dark:border-slate-850 dark:bg-slate-900"
                                        >
                                            <option value={100000}>Rp 100.000</option>
                                            <option value={500000}>Rp 500.000</option>
                                            <option value={1000000}>Rp 1.000.000</option>
                                            <option value={3000000}>Rp 3.000.000</option>
                                        </select>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                                        Wakaf Pembangunan disalurkan untuk infrastruktur, sarana kelas, mushola, serta fasilitas penunjang pendidikan MI Nurussalam.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Manual Payment Form */}
                    <div className="lg:col-span-5 space-y-6">
                        {currentStatus === 'menunggu_konfirmasi' ? (
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 dark:border-slate-800 dark:bg-slate-950 shadow-sm text-center space-y-4">
                                <span className="text-4xl">⏳</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Menunggu Verifikasi</h3>
                                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                                    Bukti transfer pembayaran Anda telah terkirim dan sedang diproses verifikasi oleh panitia penerimaan siswa baru.
                                </p>
                                {pendaftaran?.bukti_pembayaran_path && (
                                    <a
                                        href={`/storage/${pendaftaran.bukti_pembayaran_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex w-full justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350 dark:hover:bg-slate-800"
                                    >
                                        Lihat Bukti Yang Diunggah
                                    </a>
                                )}
                            </div>
                        ) : remainingBalance <= 0 ? (
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 dark:border-slate-800 dark:bg-slate-950 shadow-sm text-center space-y-4">
                                <span className="text-4xl">🎉</span>
                                <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Pembayaran Lunas!</h3>
                                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                                    Administrasi pembiayaan Anda telah diverifikasi oleh panitia dan dinyatakan Lunas. Terima kasih atas kontribusi Anda!
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 dark:border-slate-800 dark:bg-slate-950 shadow-sm space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Metode Transfer Manual</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Silakan lakukan transfer ke rekening resmi di bawah.</p>
                                </div>

                                {/* Bank Accounts */}
                                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-850 space-y-3">
                                    <div className="text-xs space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 font-bold uppercase text-[9px]">Nama Bank</span>
                                            <span className="font-extrabold text-slate-700 dark:text-slate-200">Bank Mandiri</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 font-bold uppercase text-[9px]">No. Rekening</span>
                                            <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">1120019293146</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 font-bold uppercase text-[9px]">Atas Nama</span>
                                            <span className="font-bold text-slate-700 dark:text-slate-200">MI Nurussalam Sidogede</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Upload Form */}
                                <form onSubmit={submit} className="space-y-4">
                                    {/* Payment Options */}
                                    <div className="space-y-2">
                                        <InputLabel value="Opsi Pembayaran" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setPaymentOption('lunas')}
                                                className={`rounded-xl border p-2.5 text-center text-xs font-bold transition-all ${
                                                    paymentOption === 'lunas'
                                                        ? 'border-emerald-600 bg-emerald-50/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/20'
                                                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900'
                                                }`}
                                            >
                                                Bayar Lunas
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPaymentOption('cicilan')}
                                                className={`rounded-xl border p-2.5 text-center text-xs font-bold transition-all ${
                                                    paymentOption === 'cicilan'
                                                        ? 'border-emerald-600 bg-emerald-50/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/20'
                                                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900'
                                                }`}
                                            >
                                                Bayar Cicilan
                                            </button>
                                        </div>
                                    </div>

                                    {/* Custom Amount for Installment */}
                                    {paymentOption === 'cicilan' && (
                                        <div className="space-y-1">
                                            <InputLabel htmlFor="custom_amount" value="Nominal Yang Ditransfer" />
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                                                <input
                                                    id="custom_amount"
                                                    type="number"
                                                    value={customAmount}
                                                    onChange={(e) => setCustomAmount(e.target.value)}
                                                    placeholder="Masukkan nominal transfer"
                                                    className="w-full pl-8 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-800 bg-white focus:border-emerald-500 focus:outline-none dark:bg-slate-900 font-bold"
                                                    required
                                                />
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-semibold block">Maksimal transfer saat ini: {formatRupiah(remainingBalance)}</span>
                                        </div>
                                    )}

                                    {/* File Input */}
                                    <div className="space-y-2">
                                        <InputLabel htmlFor="bukti_pembayaran" value="Unggah Bukti Transfer (PDF, JPG, PNG - Max 2MB)" />
                                        <input
                                            id="bukti_pembayaran"
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-900 dark:file:text-slate-300"
                                            required
                                        />
                                        {clientError && <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1">{clientError}</p>}
                                        <InputError message={errors.bukti_pembayaran} className="mt-1" />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-2">
                                        <PrimaryButton
                                            className="w-full justify-center bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 py-3"
                                            disabled={processing || !!clientError}
                                        >
                                            Kirim Bukti Pembayaran
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <WhatsAppAdminButton pageName="Pembayaran" />
        </AuthenticatedLayout>
    );
}
