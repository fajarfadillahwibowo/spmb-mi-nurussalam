import Dropdown from '@/Components/Dropdown';
import Sidebar from '@/Components/Sidebar';
import NotificationBell from '@/Components/NotificationBell';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const currentRoute = route().current() || '';
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isSiswa = user.role === 'siswa';

    const isActive = (routePattern) => {
        if (routePattern === 'dashboard') return currentRoute === 'dashboard';
        return currentRoute.startsWith(routePattern);
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Bottom nav active style helper
    const bottomNavActive = (patterns) => {
        const active = patterns.some(p => isActive(p));
        return active
            ? { color: '#99CC33', fontWeight: 800 }
            : { color: 'rgba(255,255,255,0.5)' };
    };

    return (
        <div className="min-h-screen" style={{ background: '#f4f7f4' }}>
            {/* Sidebar */}
            <Sidebar
                user={user}
                currentRoute={currentRoute}
                isOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            {/* Content Area */}
            <div className="lg:pl-72 flex flex-col min-h-screen">

                {/* Header Navbar */}
                <header
                    className="sticky top-0 z-30 flex h-16 w-full items-center justify-between px-6"
                    style={{
                        background: '#003333',
                        borderBottom: '1px solid rgba(153,204,51,0.2)',
                        boxShadow: '0 2px 20px rgba(0,51,51,0.25)',
                    }}
                >
                    {/* Mobile hamburger */}
                    <button
                        onClick={toggleSidebar}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all lg:hidden"
                        style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>

                    {/* Page Title (desktop) */}
                    <div className="hidden lg:block">
                        {header && (
                            <h2 className="text-base font-extrabold tracking-tight text-white">
                                {header}
                            </h2>
                        )}
                    </div>

                    {/* Right side: breadcrumb hint + notif bell + user dropdown */}
                    <div className="flex items-center gap-3 ml-auto">
                        {/* Accent dot */}
                        <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-white/50">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#99CC33' }} />
                            SPMB Portal
                        </div>

                        {/* Ikon Notifikasi [BARU] */}
                        <NotificationBell />

                        {/* User dropdown */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md">
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-white/80 hover:text-white transition-all"
                                        style={{
                                            background: 'rgba(255,255,255,0.08)',
                                            border: '1px solid rgba(153,204,51,0.25)',
                                        }}
                                    >
                                        {user.profile_photo_path ? (
                                            <img src={`/storage/${user.profile_photo_path}`} alt="Profile" className="h-6 w-6 rounded-full object-cover border border-[#99CC33]" />
                                        ) : (
                                            <div
                                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-extrabold text-xs text-[#003333]"
                                                style={{ background: '#99CC33' }}
                                            >
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span className="hidden sm:block">{user.username}</span>
                                        <svg className="-me-0.5 ms-0.5 h-4 w-4 opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </span>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>Profil Saya</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">Keluar</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Mobile Page Title Banner */}
                {header && (
                    <div
                        className="px-6 py-3.5 lg:hidden"
                        style={{
                            background: 'rgba(0,51,51,0.06)',
                            borderBottom: '1px solid rgba(0,51,51,0.08)',
                        }}
                    >
                        <h2 className="text-base font-extrabold tracking-tight" style={{ color: '#003333' }}>
                            {header}
                        </h2>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8">
                    {children}
                </main>

                {/* Bottom Nav — Mobile Only */}
                <nav
                    className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center px-1 py-1.5 pb-safe lg:hidden"
                    style={{
                        background: '#002222',
                        borderTop: '1px solid rgba(153,204,51,0.2)',
                        boxShadow: '0 -4px 20px rgba(0,51,51,0.3)',
                    }}
                >
                    {/* Home */}
                    <Link href={route('dashboard')} className="flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-all" style={bottomNavActive(['dashboard'])}>
                        <div className="relative flex justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-[18px] w-[18px]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            {isActive('dashboard') && <div className="absolute -inset-1 -z-10 rounded-full blur-sm" style={{ background: 'rgba(153,204,51,0.25)' }} />}
                        </div>
                        <span className="text-[9px]">Home</span>
                    </Link>

                    {/* Pendaftaran / Data Pendaftar */}
                    <Link
                        href={isSiswa ? route('pendaftaran.index') : route('data-pendaftar.index')}
                        className="flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-all"
                        style={bottomNavActive(['pendaftaran', 'data-pendaftar'])}
                    >
                        <div className="relative flex justify-center">
                            {isSiswa ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-[18px] w-[18px]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-[18px] w-[18px]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                </svg>
                            )}
                            {(isActive('pendaftaran') || isActive('data-pendaftar')) && <div className="absolute -inset-1 -z-10 rounded-full blur-sm" style={{ background: 'rgba(153,204,51,0.25)' }} />}
                        </div>
                        <span className="text-[9px]">{isSiswa ? 'Daftar' : 'Pendaftar'}</span>
                    </Link>

                    {/* Dokumen / Verifikasi */}
                    <Link
                        href={isSiswa ? route('dokumen.index') : route('verifikasi-berkas.index')}
                        className="flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-all"
                        style={bottomNavActive(['dokumen', 'verifikasi-berkas'])}
                    >
                        <div className="relative flex justify-center">
                            {isSiswa ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-[18px] w-[18px]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5h10.5a2.25 2.25 0 0 0 2.25-2.25v-10.5A2.25 2.25 0 0 0 16.5 4.5H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-[18px] w-[18px]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                                </svg>
                            )}
                            {(isActive('dokumen') || isActive('verifikasi-berkas')) && <div className="absolute -inset-1 -z-10 rounded-full blur-sm" style={{ background: 'rgba(153,204,51,0.25)' }} />}
                        </div>
                        <span className="text-[9px]">{isSiswa ? 'Dokumen' : 'Verifikasi'}</span>
                    </Link>

                    {/* Seleksi */}
                    <Link
                        href={isSiswa ? route('seleksi-siswa.index') : route('seleksi.index')}
                        className="flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-all"
                        style={bottomNavActive(['seleksi-siswa', 'seleksi'])}
                    >
                        <div className="relative flex justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-[18px] w-[18px]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            {(isActive('seleksi-siswa') || isActive('seleksi')) && <div className="absolute -inset-1 -z-10 rounded-full blur-sm" style={{ background: 'rgba(153,204,51,0.25)' }} />}
                        </div>
                        <span className="text-[9px]">Seleksi</span>
                    </Link>

                    {/* Pengumuman */}
                    <Link
                        href={isSiswa ? route('pengumuman.index') : route('pengumuman-admin.index')}
                        className="flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-all"
                        style={bottomNavActive(['pengumuman', 'pengumuman-admin'])}
                    >
                        <div className="relative flex justify-center">
                            {isSiswa ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-[18px] w-[18px]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a9.04 9.04 0 0 1-5.714 0M3.181 12.062a18.8 18.8 0 0 1 17.638 0M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm1.89 3.487A9.04 9.04 0 0 1 12 15a9.04 9.04 0 0 1-4.89-1.513M21 12v6.75A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-[18px] w-[18px]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38a.747.747 0 0 1-1.027-.3 48.627 48.627 0 0 1-1.062-2.125m2.124-6.249A48.02 48.02 0 0 1 7.5 12.75c0-.663.013-1.324.04-1.983m2.8 5.073a48.276 48.276 0 0 0 5.66 0m-5.66 0c.065.653.16 1.298.282 1.934m5.378-1.934a47.715 47.715 0 0 0-.282-1.934m5.66 0a48.394 48.394 0 0 0-12-6.879 48.09 48.09 0 0 0 12-6.879" />
                                </svg>
                            )}
                            {(isActive('pengumuman') || isActive('pengumuman-admin')) && <div className="absolute -inset-1 -z-10 rounded-full blur-sm" style={{ background: 'rgba(153,204,51,0.25)' }} />}
                        </div>
                        <span className="text-[9px]">Info</span>
                    </Link>

                    {/* Pembayaran */}
                    <Link
                        href={isSiswa ? route('pembayaran.index') : route('pembayaran-admin.index')}
                        className="flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-all"
                        style={bottomNavActive(['pembayaran', 'pembayaran-admin'])}
                    >
                        <div className="relative flex justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-[18px] w-[18px]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                            </svg>
                            {(isActive('pembayaran') || isActive('pembayaran-admin')) && <div className="absolute -inset-1 -z-10 rounded-full blur-sm" style={{ background: 'rgba(153,204,51,0.25)' }} />}
                        </div>
                        <span className="text-[9px]">Bayar</span>
                    </Link>

                    {/* Laporan — Admin Only */}
                    {!isSiswa && (
                        <Link
                            href={route('laporan.index')}
                            className="flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-all"
                            style={bottomNavActive(['laporan'])}
                        >
                            <div className="relative flex justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-[18px] w-[18px]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                                </svg>
                                {isActive('laporan') && <div className="absolute -inset-1 -z-10 rounded-full blur-sm" style={{ background: 'rgba(153,204,51,0.25)' }} />}
                            </div>
                            <span className="text-[9px]">Laporan</span>
                        </Link>
                    )}
                </nav>
            </div>
        </div>
    );
}
