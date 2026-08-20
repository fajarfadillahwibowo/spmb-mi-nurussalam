import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div
            className="relative flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0"
            style={{
                backgroundImage: "url('/images/kelas2.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Overlay — tema #003333 */}
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, rgba(0,51,51,0.82) 0%, rgba(0,80,50,0.75) 100%)' }}
            />

            {/* Decorative glow orbs */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, #99CC33 0%, transparent 70%)' }} />
            <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, #99CC33 0%, transparent 70%)' }} />

            {/* Logo + School Name */}
            <div className="relative z-10 flex flex-col items-center gap-3 mb-2">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20 group-hover:bg-white/15 transition-all duration-300">
                        <img src="/images/logo-kemenag.png" alt="Logo Kemenag" className="h-10 w-auto object-contain" />
                        <img src="/images/logo-nurussalam.png" alt="Logo Nurussalam" className="h-10 w-auto object-contain" />
                        <div className="ml-1.5">
                            <span className="block font-extrabold text-sm uppercase tracking-wider text-white">MI Nurussalam</span>
                            <span className="block text-[10px] font-bold tracking-widest uppercase" style={{ color: '#99CC33' }}>SPMB Portal</span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Card Form */}
            <div
                className="relative z-10 mt-4 w-full overflow-hidden px-6 py-7 sm:max-w-md sm:rounded-3xl"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1.5px solid rgba(153,204,51,0.25)',
                    boxShadow: '0 20px 60px rgba(0,51,51,0.35), 0 0 0 1px rgba(255,255,255,0.15)',
                }}
            >
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: 'linear-gradient(90deg, #003333, #99CC33, #003333)' }} />
                {children}
            </div>

            {/* Footer text */}
            <p className="relative z-10 mt-6 text-xs text-white/50 text-center">
                © {new Date().getFullYear()} MI Nurussalam Sidogede. Hak cipta dilindungi.
            </p>
        </div>
    );
}
