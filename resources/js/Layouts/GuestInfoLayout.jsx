import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Konfigurasi navigasi publik — dipakai oleh header desktop & bottom nav mobile
// ─────────────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
    {
        href: '/',
        label: 'Beranda',
        shortLabel: 'Home',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-[18px] w-[18px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
        ),
    },
    {
        href: '/informasi-spmb',
        label: 'Informasi SPMB',
        shortLabel: 'Info',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-[18px] w-[18px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
        ),
    },
    {
        href: '/profil-sekolah',
        label: 'Profil Sekolah',
        shortLabel: 'Profil',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-[18px] w-[18px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
            </svg>
        ),
    },
    {
        href: '/visi-misi',
        label: 'Visi & Misi',
        shortLabel: 'Visi',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-[18px] w-[18px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
        ),
    },
    {
        href: '/kontak',
        label: 'Kontak',
        shortLabel: 'Kontak',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-[18px] w-[18px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
        ),
    },
];

export default function GuestInfoLayout({ auth, title, children, spmbSettings }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState('/');

    const spmbTutup = spmbSettings?.status === 'tutup';

    // Gunakan useEffect agar currentPath selalu akurat di client-side
    useEffect(() => {
        setCurrentPath(window.location.pathname);
    }, []);

    const isActive = (href) => {
        if (href === '/') return currentPath === '/';
        return currentPath.startsWith(href);
    };

    return (
        <>
            <Head title={`${title} | SPMB MI Nurussalam Sidogede`} />

            <div
                className="min-h-screen flex flex-col text-[#003333] transition-colors duration-300"
                style={{ background: 'linear-gradient(180deg, rgba(240,248,235,1) 0%, rgba(255,255,255,0.95) 30%, rgba(240,250,235,0.9) 100%)' }}
            >
                {/* Decorative Background Blobs */}
                <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full blur-3xl" style={{ background: 'rgba(153,204,51,0.08)' }} />
                    <div className="absolute top-1/3 -left-40 h-[500px] w-[500px] rounded-full blur-3xl" style={{ background: 'rgba(153,204,51,0.06)' }} />
                    <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full blur-3xl" style={{ background: 'rgba(0,51,51,0.04)' }} />
                </div>

                {/* ── Navbar / Header ──────────────────────────────────── */}
                <header
                    className="sticky top-0 z-50 w-full"
                    style={{ borderBottom: '1px solid rgba(0,51,51,0.15)', background: 'rgba(0,51,51,0.95)', backdropFilter: 'blur(20px)' }}
                >
                    <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <img src="/images/logo-kemenag.png" alt="Logo Kemenag" className="h-9 w-auto object-contain transition-transform group-hover:scale-105 sm:h-10" />
                                <img src="/images/logo-nurussalam.png" alt="Logo Nurussalam" className="h-9 w-auto object-contain transition-transform group-hover:scale-105 sm:h-10" />
                            </div>
                            <div className="hidden xs:block">
                                <span className="font-extrabold text-base leading-tight tracking-tight block sm:text-lg" style={{ color: '#99CC33' }}>MI Nurussalam</span>
                                <span className="text-[9px] font-bold tracking-widest block -mt-0.5 sm:text-[10px]" style={{ color: 'rgba(153,204,51,0.6)' }}>SIDOGEDE</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation — hidden on mobile */}
                        <nav className="hidden md:flex items-center gap-1">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 lg:px-4 ${isActive(link.href)
                                        ? 'text-[#99CC33] font-bold'
                                        : 'text-slate-300 hover:text-[#99CC33]'
                                        }`}
                                    style={isActive(link.href) ? { background: 'rgba(0,51,51,0.8)' } : {}}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Auth Buttons + Mobile hamburger */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-bold shadow-lg transition-all sm:px-4"
                                    style={{ background: '#003333', color: '#99CC33', border: '1px solid rgba(153,204,51,0.3)' }}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex text-xs font-semibold transition-colors px-2 py-1.5 rounded-lg sm:text-sm sm:px-3 sm:py-2"
                                        style={{ color: 'rgba(255,255,255,0.8)' }}
                                    >
                                        Masuk
                                    </Link>
                                    {spmbTutup ? (
                                        <span
                                            className="inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-bold shadow-lg sm:px-4 sm:py-2 sm:text-sm"
                                            style={{
                                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                                color: '#fff',
                                                pointerEvents: 'none',
                                                cursor: 'not-allowed',
                                                opacity: 0.85,
                                            }}
                                        >
                                            🔒 Ditutup
                                        </span>
                                    ) : (
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-bold shadow-lg transition-all hover:opacity-90 sm:px-4 sm:py-2 sm:text-sm"
                                            style={{ background: '#99CC33', color: '#003333' }}
                                        >
                                            Daftar
                                        </Link>
                                    )}
                                </>
                            )}

                            {/* Mobile hamburger — hanya tampil di sm ke bawah BUKAN md */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-white/10 transition-colors"
                                aria-label="Toggle menu"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Dropdown Menu (hamburger) — tetap ada tapi opsional */}
                    {mobileMenuOpen && (
                        <div
                            className="md:hidden"
                            style={{ borderTop: '1px solid rgba(153,204,51,0.15)', background: 'rgba(0,30,30,0.97)', backdropFilter: 'blur(20px)' }}
                        >
                            <nav className="flex flex-col p-4 space-y-1">
                                {NAV_LINKS.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive(link.href) ? 'text-[#99CC33]' : 'text-slate-300'
                                            }`}
                                        style={isActive(link.href) ? { background: 'rgba(0,51,51,0.8)' } : {}}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                {!auth?.user && (
                                    <Link
                                        href={route('login')}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-3 rounded-xl text-sm font-semibold"
                                        style={{ color: 'rgba(255,255,255,0.8)' }}
                                    >
                                        Masuk
                                    </Link>
                                )}
                            </nav>
                        </div>
                    )}
                </header>

                {/* ── Main Content ─────────────────────────────────────── */}
                {/*
                    pb-20 di mobile: memberi ruang agar konten tidak tertutup bottom nav.
                    md:pb-0: di desktop, tidak perlu padding karena bottom nav tidak tampil.
                */}
                <main className="flex-1 pb-20 md:pb-0">
                    {children}
                </main>

                {/* ── Footer — Diberi padding bawah di mobile agar tidak terhalang bottom nav */}
                <footer className="relative mt-auto pb-20 md:pb-0" style={{ background: '#003333', borderTop: '1px solid rgba(153,204,51,0.15)' }}>
                    {/* Top accent line */}
                    <div className="h-1" style={{ background: 'linear-gradient(to right, #99CC33, #002222, #99CC33)' }} />

                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                            {/* Column 1: Identitas */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                        <img src="/images/logo-kemenag.png" alt="Logo Kemenag" className="h-8 w-auto object-contain" />
                                        <img src="/images/logo-nurussalam.png" alt="Logo Nurussalam" className="h-8 w-auto object-contain" />
                                    </div>
                                    <div>
                                        <span className="font-extrabold block" style={{ color: '#99CC33' }}>MI Nurussalam</span>
                                        <span className="text-xs font-bold tracking-wider" style={{ color: 'rgba(153,204,51,0.6)' }}>Sidogede</span>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                    "Membentuk generasi islami yang berakhlakul karimah, cerdas, dan mandiri"
                                </p>
                            </div>

                            {/* Column 2: Alamat */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#99CC33' }}>Alamat</h4>
                                <div className="space-y-3 text-sm" style={{ color: 'rgba(200,230,200,0.7)' }}>
                                    <div className="flex items-start gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#99CC33' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                        </svg>
                                        <span>Desa Sidogede, RT 02 RW 01, Kec. Belitang, Kab. OKU Timur, Sumatera Selatan</span>
                                    </div>
                                </div>
                            </div>

                            {/* Column 3: Kontak */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#99CC33' }}>Kontak</h4>
                                <div className="space-y-3 text-sm" style={{ color: 'rgba(200,230,200,0.7)' }}>
                                    <div className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0" style={{ color: '#99CC33' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                        </svg>
                                        <span>0813-8185-1165</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0" style={{ color: '#99CC33' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                        </svg>
                                        <span>misnurussalam1@gmail.com</span>
                                    </div>
                                </div>
                            </div>

                            {/* Column 4: Jam Operasional */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#99CC33' }}>Jam Operasional</h4>
                                <div className="space-y-3 text-sm" style={{ color: 'rgba(200,230,200,0.7)' }}>
                                    <div className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0" style={{ color: '#99CC33' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <div>
                                            <p className="font-semibold" style={{ color: 'rgba(153,204,51,0.8)' }}>Senin – Sabtu</p>
                                            <p>07:00 – 13:00 WIB</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0" style={{ color: '#99CC33' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                        </svg>
                                        <div>
                                            <p className="font-semibold" style={{ color: 'rgba(153,204,51,0.8)' }}>Minggu & Hari Libur</p>
                                            <p>Tutup</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider & Copyright */}
                        <div
                            className="mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
                            style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                <p>© 2026 MI Nurussalam Sidogede. Seluruh hak cipta dilindungi.</p>
                                <div className="mt-2 text-xs flex flex-col gap-0.5 font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                    <p>Developer: fajarfadillahwibowo@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <a href="https://wa.me/6281381851165" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#99CC33] transition-colors" title="WhatsApp">
                                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                                </a>
                                <a href="https://facebook.com/MisNurussalamSidogede" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#99CC33] transition-colors" title="Facebook">
                                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>

                {/* ══════════════════════════════════════════════════════════
                    BOTTOM NAVIGATION — Mobile Only (md ke bawah)
                    Menampilkan 5 link navigasi publik persis seperti
                    bottom nav di halaman siswa yang sudah login.
                    ══════════════════════════════════════════════════════════ */}
                <nav
                    className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-1 py-1.5 md:hidden"
                    style={{
                        background: '#002222',
                        borderTop: '1px solid rgba(153,204,51,0.2)',
                        boxShadow: '0 -4px 20px rgba(0,51,51,0.3)',
                        paddingBottom: 'max(6px, env(safe-area-inset-bottom))', // iOS safe area
                    }}
                >
                    {NAV_LINKS.map((link) => {
                        const active = isActive(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-all"
                                style={active ? { color: '#99CC33', fontWeight: 800 } : { color: 'rgba(255,255,255,0.5)' }}
                            >
                                <div className="relative flex justify-center">
                                    {link.icon}
                                    {active && (
                                        <div
                                            className="absolute -inset-1 -z-10 rounded-full blur-sm"
                                            style={{ background: 'rgba(153,204,51,0.25)' }}
                                        />
                                    )}
                                </div>
                                <span className="text-[9px] leading-none">{link.shortLabel}</span>
                            </Link>
                        );
                    })}

                    {/* Tombol Daftar / Dashboard — sebagai item ke-6 di pojok kanan */}
                    {auth?.user ? (
                        <Link
                            href={route('dashboard')}
                            className="flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-all"
                            style={{ color: '#99CC33', fontWeight: 800 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-[18px] w-[18px]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                            </svg>
                            <span className="text-[9px] leading-none">Portal</span>
                        </Link>
                    ) : spmbTutup ? (
                        <span
                            className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all"
                            style={{
                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                color: '#fff',
                                fontWeight: 800,
                                boxShadow: '0 2px 8px rgba(220,38,38,0.4)',
                                pointerEvents: 'none',
                                opacity: 0.85,
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-[18px] w-[18px]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                            <span className="text-[9px] leading-none">Ditutup</span>
                        </span>
                    ) : (
                        <Link
                            href={route('register')}
                            className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all"
                            style={{
                                background: 'linear-gradient(135deg, #99CC33, #7aaa1a)',
                                color: '#003333',
                                fontWeight: 800,
                                boxShadow: '0 2px 8px rgba(153,204,51,0.4)',
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-[18px] w-[18px]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                            </svg>
                            <span className="text-[9px] leading-none">Daftar</span>
                        </Link>
                    )}
                </nav>

            </div>
        </>
    );
}
