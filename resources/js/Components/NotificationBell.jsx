import { useState, useRef, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

/**
 * NotificationBell — Komponen Ikon Notifikasi untuk Navbar
 *
 * Menampilkan ikon lonceng dengan badge counter merah di pojok kanan.
 * Klik ikon membuka dropdown berisi daftar notifikasi terbaru.
 *
 * Data notifikasi diambil dari Inertia shared props (dikirim via
 * HandleInertiaRequests) sehingga tidak perlu fetch terpisah.
 *
 * Fitur:
 *  - Badge counter angka unread (merah)
 *  - Dropdown slide-down dengan animasi
 *  - Klik item → navigasi ke link_url + auto-mark as read
 *  - Tombol "Tandai Semua Dibaca"
 *  - Indikator dot merah untuk item yang belum dibaca
 */
export default function NotificationBell() {
    const { notifications = [], unreadCount = 0 } = usePage().props;

    const [isOpen, setIsOpen]         = useState(false);
    const [localNotifs, setLocalNotifs] = useState(notifications);
    const [localUnread, setLocalUnread] = useState(unreadCount);
    const [isLoading, setIsLoading]   = useState(false);

    const dropdownRef = useRef(null);

    // Sync dengan props saat navigasi Inertia
    useEffect(() => {
        setLocalNotifs(notifications);
        setLocalUnread(unreadCount);
    }, [notifications, unreadCount]);

    // Tutup dropdown saat klik di luar
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsOpen(prev => !prev);

    /** Tandai satu notifikasi sebagai dibaca lalu navigasi ke link */
    const handleItemClick = async (notif) => {
        if (!notif.is_read) {
            // Optimistic update
            setLocalNotifs(prev =>
                prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n)
            );
            setLocalUnread(prev => Math.max(0, prev - 1));

            try {
                await fetch(route('notifikasi.baca', { id: notif.id }), {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });
            } catch (e) {
                // Ignore — optimistic update sudah terapply
            }
        }

        setIsOpen(false);

        if (notif.link_url) {
            router.visit(notif.link_url);
        }
    };

    /** Tandai semua notifikasi sebagai dibaca */
    const handleMarkAllRead = async () => {
        if (localUnread === 0) return;
        setIsLoading(true);

        // Optimistic update
        setLocalNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
        setLocalUnread(0);

        try {
            await fetch(route('notifikasi.baca-semua'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
        } catch (e) {
            // Ignore
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* ── Ikon Lonceng ──────────────────────────────────────── */}
            <button
                id="notification-bell-btn"
                onClick={toggleDropdown}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 hover:scale-110 focus:outline-none"
                style={{
                    background: isOpen ? 'rgba(153,204,51,0.2)' : 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(153,204,51,0.25)',
                    color: isOpen ? '#99CC33' : 'rgba(255,255,255,0.75)',
                }}
                aria-label={`Notifikasi${localUnread > 0 ? ` (${localUnread} belum dibaca)` : ''}`}
            >
                {/* Ikon lonceng SVG */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="h-5 w-5"
                    style={{
                        animation: localUnread > 0 && !isOpen ? 'bell-ring 2.5s ease-in-out infinite' : 'none',
                    }}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                    />
                </svg>

                {/* Badge counter merah */}
                {localUnread > 0 && (
                    <span
                        className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-black text-white"
                        style={{ background: '#ef4444', lineHeight: 1 }}
                    >
                        {localUnread > 99 ? '99+' : localUnread}
                    </span>
                )}
            </button>

            {/* ── Dropdown Panel ────────────────────────────────────── */}
            {isOpen && (
                <div
                    className="absolute right-0 z-50 mt-2 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                        background: '#0a2424',
                        border: '1px solid rgba(153,204,51,0.2)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(153,204,51,0.1)',
                        animation: 'dropdown-in 0.18s ease-out',
                    }}
                >
                    {/* Header dropdown */}
                    <div
                        className="flex items-center justify-between px-4 py-3"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                    >
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="#99CC33" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                            </svg>
                            <span className="text-sm font-extrabold text-white">Notifikasi</span>
                            {localUnread > 0 && (
                                <span
                                    className="rounded-full px-2 py-0.5 text-[10px] font-black text-white"
                                    style={{ background: '#ef4444' }}
                                >
                                    {localUnread} baru
                                </span>
                            )}
                        </div>

                        {/* Tombol tandai semua dibaca */}
                        {localUnread > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                disabled={isLoading}
                                className="text-xs font-bold transition-colors hover:opacity-80"
                                style={{ color: '#99CC33' }}
                            >
                                {isLoading ? 'Memproses...' : 'Baca Semua'}
                            </button>
                        )}
                    </div>

                    {/* Daftar notifikasi */}
                    <div className="max-h-80 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(153,204,51,0.3) transparent' }}>
                        {localNotifs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-2 py-10">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="rgba(255,255,255,0.2)" className="h-10 w-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                </svg>
                                <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                    Belum ada notifikasi
                                </p>
                            </div>
                        ) : (
                            localNotifs.map((notif, idx) => (
                                <button
                                    key={notif.id}
                                    onClick={() => handleItemClick(notif)}
                                    className="w-full text-left transition-all duration-150"
                                    style={{
                                        background: notif.is_read ? 'transparent' : 'rgba(153,204,51,0.06)',
                                        borderBottom: idx < localNotifs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                        padding: '12px 16px',
                                        display: 'block',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={e => e.currentTarget.style.background = notif.is_read ? 'transparent' : 'rgba(153,204,51,0.06)'}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Dot indikator unread */}
                                        <div className="mt-1.5 shrink-0">
                                            {notif.is_read ? (
                                                <div className="h-2 w-2 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
                                            ) : (
                                                <div className="h-2 w-2 rounded-full" style={{ background: '#99CC33', boxShadow: '0 0 6px rgba(153,204,51,0.6)' }} />
                                            )}
                                        </div>

                                        {/* Konten teks */}
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className="text-xs font-bold leading-tight truncate"
                                                style={{ color: notif.is_read ? 'rgba(255,255,255,0.55)' : 'white' }}
                                            >
                                                {notif.title}
                                            </p>
                                            <p
                                                className="mt-0.5 text-[11px] leading-relaxed"
                                                style={{
                                                    color: 'rgba(255,255,255,0.45)',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {notif.message}
                                            </p>
                                            <p className="mt-1 text-[10px] font-semibold" style={{ color: 'rgba(153,204,51,0.6)' }}>
                                                {notif.created_at}
                                            </p>
                                        </div>

                                        {/* Panah navigasi jika ada link */}
                                        {notif.link_url && (
                                            <div className="shrink-0 mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-3 w-3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {localNotifs.length > 0 && (
                        <div
                            className="px-4 py-2.5 text-center"
                            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
                        >
                            <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.3)' }}>
                                Menampilkan {localNotifs.length} notifikasi terbaru
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* CSS Animations */}
            <style>{`
                @keyframes bell-ring {
                    0%, 90%, 100% { transform: rotate(0deg); }
                    92% { transform: rotate(-12deg); }
                    96% { transform: rotate(12deg); }
                    98% { transform: rotate(-8deg); }
                }
                @keyframes dropdown-in {
                    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}

