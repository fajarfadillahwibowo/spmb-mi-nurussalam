import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

/**
 * Halaman Pengaturan Status SPMB (Buka/Tutup)
 * Admin dapat mengaktifkan atau menonaktifkan pendaftaran.
 */
export default function StatusSpmb({ statusSpmb, flash_status, flash_error }) {
    const { data, setData, post, processing } = useForm({ status: statusSpmb });
    const isOpen = data.status === 'buka';

    const handleToggle = (val) => setData('status', val);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('pengaturan.status.update'));
    };

    return (
        <AuthenticatedLayout header="Pengaturan Status SPMB">
            <Head title="Status SPMB" />

            <div className="max-w-2xl mx-auto space-y-6">

                {/* Flash Messages */}
                {flash_status && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold"
                        style={{ background: 'rgba(153,204,51,0.12)', border: '1px solid rgba(153,204,51,0.3)', color: '#003333' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#99CC33" className="h-5 w-5 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        {flash_status}
                    </div>
                )}
                {flash_error && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold"
                        style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', color: '#dc2626' }}>
                        {flash_error}
                    </div>
                )}

                {/* Status Card */}
                <div className="rounded-2xl overflow-hidden shadow-lg"
                    style={{ background: '#fff', border: '1px solid rgba(0,51,51,0.1)' }}>

                    {/* Header */}
                    <div className="px-6 py-5 flex items-center gap-4"
                        style={{ background: 'linear-gradient(135deg, #002222 0%, #003333 100%)', borderBottom: '3px solid #99CC33' }}>
                        <div className="flex items-center justify-center h-12 w-12 rounded-xl"
                            style={{ background: 'rgba(153,204,51,0.15)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="#99CC33" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-white font-extrabold text-lg tracking-tight">Status Pendaftaran SPMB</h2>
                            <p className="text-xs font-medium mt-0.5" style={{ color: 'rgba(153,204,51,0.7)' }}>
                                Kontrol apakah halaman publik menerima pendaftar baru
                            </p>
                        </div>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-8">

                        {/* Current Status Visual */}
                        <div className="flex items-center justify-center py-6">
                            <div className="relative">
                                {/* Glow effect */}
                                <div className="absolute inset-0 rounded-full blur-2xl transition-all duration-700"
                                    style={{
                                        background: isOpen
                                            ? 'rgba(153,204,51,0.3)'
                                            : 'rgba(220,38,38,0.25)',
                                        transform: 'scale(1.5)',
                                    }} />
                                {/* Circle */}
                                <div className="relative flex flex-col items-center justify-center h-36 w-36 rounded-full shadow-2xl transition-all duration-500"
                                    style={{
                                        background: isOpen
                                            ? 'linear-gradient(135deg, #99CC33, #66AA00)'
                                            : 'linear-gradient(135deg, #ef4444, #dc2626)',
                                    }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="white" className="h-10 w-10 mb-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                                    </svg>
                                    <span className="text-white font-black text-xl tracking-widest">
                                        {isOpen ? 'BUKA' : 'TUTUP'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Toggle Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Buka */}
                            <button
                                type="button"
                                onClick={() => handleToggle('buka')}
                                className="flex flex-col items-center gap-2 py-5 px-4 rounded-2xl font-bold text-sm transition-all duration-300"
                                style={{
                                    background: data.status === 'buka'
                                        ? 'linear-gradient(135deg, #99CC33, #66AA00)'
                                        : 'rgba(153,204,51,0.06)',
                                    border: data.status === 'buka'
                                        ? '2px solid #99CC33'
                                        : '2px solid rgba(153,204,51,0.25)',
                                    color: data.status === 'buka' ? '#fff' : '#003333',
                                    boxShadow: data.status === 'buka' ? '0 8px 24px rgba(153,204,51,0.35)' : 'none',
                                    transform: data.status === 'buka' ? 'scale(1.03)' : 'scale(1)',
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-8 w-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <span className="font-black text-base">BUKA</span>
                                <span className="text-xs opacity-75 font-normal text-center">Pendaftaran aktif,{'\n'}tombol publik berfungsi</span>
                            </button>

                            {/* Tutup */}
                            <button
                                type="button"
                                onClick={() => handleToggle('tutup')}
                                className="flex flex-col items-center gap-2 py-5 px-4 rounded-2xl font-bold text-sm transition-all duration-300"
                                style={{
                                    background: data.status === 'tutup'
                                        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                                        : 'rgba(220,38,38,0.06)',
                                    border: data.status === 'tutup'
                                        ? '2px solid #ef4444'
                                        : '2px solid rgba(220,38,38,0.25)',
                                    color: data.status === 'tutup' ? '#fff' : '#003333',
                                    boxShadow: data.status === 'tutup' ? '0 8px 24px rgba(220,38,38,0.3)' : 'none',
                                    transform: data.status === 'tutup' ? 'scale(1.03)' : 'scale(1)',
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-8 w-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <span className="font-black text-base">TUTUP</span>
                                <span className="text-xs opacity-75 font-normal text-center">Pendaftaran ditutup,{'\n'}tombol publik disabled</span>
                            </button>
                        </div>

                        {/* Preview Info */}
                        <div className="rounded-xl p-4 text-sm"
                            style={{
                                background: isOpen ? 'rgba(153,204,51,0.06)' : 'rgba(220,38,38,0.06)',
                                border: `1px solid ${isOpen ? 'rgba(153,204,51,0.2)' : 'rgba(220,38,38,0.2)'}`,
                            }}>
                            <p className="font-bold mb-1" style={{ color: isOpen ? '#003333' : '#dc2626' }}>
                                {isOpen ? '✓ Halaman publik: Tombol aktif' : '⚠ Halaman publik: Tombol akan dinonaktifkan'}
                            </p>
                            <p className="text-xs" style={{ color: 'rgba(0,51,51,0.6)' }}>
                                {isOpen
                                    ? 'Halaman Beranda & Informasi SPMB akan menampilkan tombol pendaftaran yang dapat diklik oleh calon siswa.'
                                    : 'Semua tombol pendaftaran di halaman publik akan berubah warna merah, disabled, dan tidak bisa diklik (pointer-events: none).'}
                            </p>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing || data.status === statusSpmb}
                            className="w-full py-3.5 rounded-xl font-bold text-base transition-all duration-200"
                            style={{
                                background: (processing || data.status === statusSpmb)
                                    ? 'rgba(0,51,51,0.1)'
                                    : 'linear-gradient(135deg, #003333, #004444)',
                                color: (processing || data.status === statusSpmb) ? 'rgba(0,51,51,0.4)' : '#99CC33',
                                cursor: (processing || data.status === statusSpmb) ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {processing ? 'Menyimpan...' : data.status === statusSpmb ? 'Tidak ada perubahan' : 'Simpan Perubahan'}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}