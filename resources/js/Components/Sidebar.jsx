import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

// ─── PengaturanSubMenu Component (BARU — MODULAR) ────────────────────────────
// Komponen terpisah untuk menu Pengaturan admin. Dipisahkan agar
// tidak memodifikasi struktur kode Sidebar yang sudah ada.
function PengaturanSubMenu({ isActive, linkClasses, activeLinkStyle, inactiveLinkStyle }) {
    const isAnyActive = isActive('pengaturan');
    const [isExpanded, setIsExpanded] = useState(isAnyActive);

    const subLinks = [
        {
            href: route('pengaturan.status'),
            pattern: 'pengaturan.status',
            label: 'Status SPMB',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                </svg>
            ),
        },
        {
            href: route('pengaturan.periode'),
            pattern: 'pengaturan.periode',
            label: 'Periode & Gelombang',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
            ),
        },
        {
            href: route('pengaturan.sistem'),
            pattern: 'pengaturan.sistem',
            label: 'Pengaturan Sistem',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="mt-3">
            {/* Section divider */}
            <div className="px-4 pb-1 pt-3" style={{ borderTop: '1px solid rgba(153,204,51,0.1)' }}>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex w-full items-center justify-between text-[9px] font-extrabold uppercase tracking-widest transition-all hover:opacity-100"
                    style={{ color: isAnyActive ? '#99CC33' : 'rgba(153,204,51,0.5)' }}
                >
                    <span>Pengaturan</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth="2.5" stroke="currentColor"
                        className="h-3 w-3 transition-transform duration-200"
                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
            </div>

            {/* Sub-links */}
            {isExpanded && (
                <div className="space-y-0.5 pl-3">
                    {subLinks.map((link) => (
                        <Link
                            key={link.pattern}
                            href={link.href}
                            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-200 ${
                                isActive(link.pattern)
                                    ? 'text-white shadow-lg'
                                    : 'text-white/55 hover:bg-white/10 hover:text-white'
                            }`}
                            style={isActive(link.pattern) ? {
                                background: 'linear-gradient(90deg, rgba(153,204,51,0.22) 0%, rgba(153,204,51,0.08) 100%)',
                                borderLeft: '3px solid #99CC33',
                                paddingLeft: '10px',
                            } : {
                                borderLeft: '3px solid transparent',
                                paddingLeft: '10px',
                            }}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
// ─── End PengaturanSubMenu ────────────────────────────────────────────────────

export default function Sidebar({ user, currentRoute, isOpen, toggleSidebar }) {
    const isSiswa = user.role === 'siswa';
    const isAdmin = user.role === 'admin';
    const isKepalaSekolah = user.role === 'kepala_sekolah';
    const isSupervisor = isAdmin || isKepalaSekolah;

    const isActive = (routePattern) => {
        if (routePattern === 'dashboard') return currentRoute === 'dashboard';
        return currentRoute.startsWith(routePattern);
    };

    const linkClasses = (active) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
            active
                ? 'text-white shadow-lg'
                : 'text-white/65 hover:bg-white/10 hover:text-white'
        }`;

    const activeLinkStyle = {
        background: 'linear-gradient(90deg, rgba(153,204,51,0.22) 0%, rgba(153,204,51,0.08) 100%)',
        borderLeft: '3px solid #99CC33',
        paddingLeft: '13px',
    };

    const inactiveLinkStyle = {
        borderLeft: '3px solid transparent',
        paddingLeft: '13px',
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    onClick={toggleSidebar}
                    className="fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
                    style={{ backgroundColor: 'rgba(0,51,51,0.55)' }}
                />
            )}

            {/* Sidebar Shell */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                style={{ background: '#002222', borderRight: '1px solid rgba(153,204,51,0.15)' }}
            >
                {/* Header Area — Logo + School */}
                <div
                    className="flex h-16 items-center gap-3 px-5"
                    style={{ borderBottom: '1px solid rgba(153,204,51,0.15)' }}
                >
                    <div className="flex items-center gap-1.5">
                        <img src="/images/logo-kemenag.png" alt="Logo Kemenag" className="h-8 w-auto object-contain" />
                        <img src="/images/logo-nurussalam.png" alt="Logo Nurussalam" className="h-8 w-auto object-contain" />
                    </div>
                    <div>
                        <span className="font-extrabold text-sm uppercase tracking-wider text-white block">MI Nurussalam</span>
                        <span className="text-[10px] font-bold tracking-widest block -mt-0.5" style={{ color: '#99CC33' }}>SPMB PORTAL</span>
                    </div>
                </div>

                {/* User Badge */}
                <div className="mx-4 mt-4 mb-2 rounded-xl px-4 py-3" style={{ background: 'rgba(153,204,51,0.1)', border: '1px solid rgba(153,204,51,0.2)' }}>
                    <div className="flex items-center gap-3">
                        {user.profile_photo_path ? (
                            <img src={`/storage/${user.profile_photo_path}`} alt="Profile" className="h-9 w-9 rounded-full object-cover border border-[#99CC33]" />
                        ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-extrabold text-sm text-[#003333]" style={{ background: '#99CC33' }}>
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <span className="block text-sm font-extrabold text-white truncate max-w-[150px]">{user.username}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#99CC33' }}>
                                {isAdmin && 'Operator Sekolah'}
                                {isKepalaSekolah && 'Kepala Sekolah (Pengawas)'}
                                {isSiswa && 'Calon Siswa'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 space-y-0.5 px-3 py-3 overflow-y-auto">
                    {/* Section label */}
                    <p className="px-4 pt-2 pb-1 text-[9px] font-extrabold uppercase tracking-widest" style={{ color: 'rgba(153,204,51,0.5)' }}>
                        Menu Utama
                    </p>

                    {/* Dashboard */}
                    <Link
                        href={route('dashboard')}
                        className={linkClasses(isActive('dashboard'))}
                        style={isActive('dashboard') ? activeLinkStyle : inactiveLinkStyle}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        Dashboard
                    </Link>

                    {/* Siswa Paths */}
                    {isSiswa && (
                        <>
                            <div className="pt-3 pb-1 px-4">
                                <span className="text-[9px] font-black uppercase tracking-wider block" style={{ color: '#99CC33' }}>
                                    Alur Pendaftaran SPMB
                                </span>
                            </div>

                            {/* Langkah 1: Formulir Biodata */}
                            <Link
                                href={route('pendaftaran.index')}
                                className={linkClasses(isActive('pendaftaran'))}
                                style={isActive('pendaftaran') ? activeLinkStyle : inactiveLinkStyle}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                                <div className="flex flex-col min-w-0">
                                    <span className="truncate">Formulir Pendaftaran</span>
                                    <span className="text-[10px] font-normal text-white/50 -mt-0.5">Langkah 1 • Isi Biodata</span>
                                </div>
                            </Link>

                            {/* Langkah 2: Upload Dokumen */}
                            <Link
                                href={route('dokumen.index')}
                                className={linkClasses(isActive('dokumen'))}
                                style={isActive('dokumen') ? activeLinkStyle : inactiveLinkStyle}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5h10.5a2.25 2.25 0 0 0 2.25-2.25v-10.5A2.25 2.25 0 0 0 16.5 4.5H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                                <div className="flex flex-col min-w-0">
                                    <span className="truncate">Upload Dokumen</span>
                                    <span className="text-[10px] font-normal text-white/50 -mt-0.5">Langkah 2 • Berkas Persyaratan</span>
                                </div>
                            </Link>

                            {/* Langkah 3: Pembayaran */}
                            <Link
                                href={route('pembayaran.index')}
                                className={linkClasses(isActive('pembayaran'))}
                                style={isActive('pembayaran') ? activeLinkStyle : inactiveLinkStyle}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                </svg>
                                <div className="flex flex-col min-w-0">
                                    <span className="truncate">Pembayaran</span>
                                    <span className="text-[10px] font-normal text-white/50 -mt-0.5">Langkah 3 • Biaya Pendaftaran</span>
                                </div>
                            </Link>

                            {/* Langkah 4: Seleksi */}
                            <Link
                                href={route('seleksi-siswa.index')}
                                className={linkClasses(isActive('seleksi-siswa'))}
                                style={isActive('seleksi-siswa') ? activeLinkStyle : inactiveLinkStyle}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <div className="flex flex-col min-w-0">
                                    <span className="truncate">Seleksi</span>
                                    <span className="text-[10px] font-normal text-white/50 -mt-0.5">Langkah 4 • Proses Seleksi</span>
                                </div>
                            </Link>

                            {/* Langkah 5: Pengumuman */}
                            <Link
                                href={route('pengumuman.index')}
                                className={linkClasses(isActive('pengumuman'))}
                                style={isActive('pengumuman') ? activeLinkStyle : inactiveLinkStyle}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a9.04 9.04 0 0 1-5.714 0M3.181 12.062a18.8 18.8 0 0 1 17.638 0M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm1.89 3.487A9.04 9.04 0 0 1 12 15a9.04 9.04 0 0 1-4.89-1.513M21 12v6.75A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V12" />
                                </svg>
                                <div className="flex flex-col min-w-0">
                                    <span className="truncate">Pengumuman</span>
                                    <span className="text-[10px] font-normal text-white/50 -mt-0.5">Langkah 5 • Hasil Kelulusan</span>
                                </div>
                            </Link>
                        </>
                    )}

                    {/* Supervisor Paths (Admin & Kepala Sekolah) */}
                    {isSupervisor && (
                        <>
                            <Link href={route('data-pendaftar.index')} className={linkClasses(isActive('data-pendaftar'))} style={isActive('data-pendaftar') ? activeLinkStyle : inactiveLinkStyle}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                </svg>
                                Data Pendaftar
                            </Link>

                            <Link href={route('verifikasi-berkas.index')} className={linkClasses(isActive('verifikasi-berkas'))} style={isActive('verifikasi-berkas') ? activeLinkStyle : inactiveLinkStyle}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                                </svg>
                                Verifikasi Berkas
                            </Link>

                            <Link href={route('seleksi.index')} className={linkClasses(isActive('seleksi'))} style={isActive('seleksi') ? activeLinkStyle : inactiveLinkStyle}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                Hasil Seleksi
                            </Link>

                            <Link href={route('pengumuman-admin.index')} className={linkClasses(isActive('pengumuman-admin'))} style={isActive('pengumuman-admin') ? activeLinkStyle : inactiveLinkStyle}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38a.747.747 0 0 1-1.027-.3 48.627 48.627 0 0 1-1.062-2.125m2.124-6.249A48.02 48.02 0 0 1 7.5 12.75c0-.663.013-1.324.04-1.983m2.8 5.073a48.276 48.276 0 0 0 5.66 0m-5.66 0c.065.653.16 1.298.282 1.934m5.378-1.934a47.715 47.715 0 0 0-.282-1.934m5.66 0a48.394 48.394 0 0 0-12-6.879 48.09 48.09 0 0 0 12-6.879" />
                                </svg>
                                Pengumuman
                            </Link>

                            <Link href={route('laporan.index')} className={linkClasses(isActive('laporan'))} style={isActive('laporan') ? activeLinkStyle : inactiveLinkStyle}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                                </svg>
                                Laporan
                            </Link>

                            <Link href={route('pembayaran-admin.index')} className={linkClasses(isActive('pembayaran-admin'))} style={isActive('pembayaran-admin') ? activeLinkStyle : inactiveLinkStyle}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                </svg>
                                Pembayaran
                            </Link>

                            {/* ── Pengaturan (Hanya Admin) ─────────────────────────── */}
                            {isAdmin && (
                                <PengaturanSubMenu isActive={isActive} linkClasses={linkClasses} activeLinkStyle={activeLinkStyle} inactiveLinkStyle={inactiveLinkStyle} />
                            )}
                        </>
                    )}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4" style={{ borderTop: '1px solid rgba(153,204,51,0.15)' }}>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/60 hover:text-white transition-all duration-200 hover:bg-white/10"
                        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                        </svg>
                        Keluar / Logout
                    </Link>
                </div>
            </aside>
        </>
    );
}
