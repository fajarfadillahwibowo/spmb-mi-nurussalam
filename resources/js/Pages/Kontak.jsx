import GuestInfoLayout from '@/Layouts/GuestInfoLayout';
import React, { useState, useEffect } from 'react';
import MagicRings from '@/Components/MagicRings';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Kontak({ auth }) {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 5000);
    };

    useEffect(() => {
        let ctx = gsap.context(() => {
            const animations = [
                { class: '.gsap-fade-up', vars: { y: 60 } },
                { class: '.gsap-fade-down', vars: { y: -60 } },
                { class: '.gsap-fade-right', vars: { x: -60 } },
                { class: '.gsap-fade-left', vars: { x: 60 } },
            ];
            
            animations.forEach(({ class: className, vars }) => {
                gsap.utils.toArray(className).forEach((el) => {
                    gsap.set(el, { ...vars, opacity: 0 });
                    gsap.to(el, {
                        x: 0, y: 0, opacity: 1, duration: 1.5, ease: 'power3.out',
                        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play reverse play reverse' }
                    });
                });
            });

            gsap.utils.toArray('.gsap-stagger-container').forEach((container) => {
                const items = container.querySelectorAll('.gsap-stagger-item');
                gsap.set(items, { y: 60, opacity: 0 });
                gsap.to(items, {
                    y: 0, opacity: 1, duration: 1.2, stagger: 0.25, ease: 'power3.out',
                    scrollTrigger: { trigger: container, start: 'top 85%', toggleActions: 'play reverse play reverse' }
                });
            });
        });

        return () => ctx.revert();
    }, []);

    // ── Developer Modal ──────────────────────────────────────────────────────
    const [showDevModal, setShowDevModal] = useState(false);

    useEffect(() => {
        if (showDevModal) {
            document.body.style.overflow = 'hidden';
            // animate modal in
            gsap.fromTo('#dev-modal-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
            gsap.fromTo('#dev-modal-card', { scale: 0.85, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.4)', delay: 0.05 });
        } else {
            document.body.style.overflow = '';
        }
    }, [showDevModal]);

    const closeModal = () => {
        gsap.to('#dev-modal-card', { scale: 0.88, opacity: 0, y: 20, duration: 0.25, ease: 'power2.in' });
        gsap.to('#dev-modal-backdrop', { opacity: 0, duration: 0.3, delay: 0.15, onComplete: () => setShowDevModal(false) });
    };

    return (
        <GuestInfoLayout auth={auth} title="Kontak">

            {/* ── Developer Modal ──────────────────────────────────────────── */}
            {showDevModal && (
                <div
                    id="dev-modal-backdrop"
                    onClick={closeModal}
                    className="fixed inset-0 z-[999] flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0,34,34,0.75)', backdropFilter: 'blur(8px)' }}
                >
                    <div
                        id="dev-modal-card"
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-sm overflow-hidden rounded-3xl text-white shadow-2xl"
                        style={{ background: 'linear-gradient(160deg, #001a1a 0%, #003333 50%, #0a4a1a 100%)', border: '1px solid rgba(153,204,51,0.25)' }}
                    >
                        {/* Decorative orbs */}
                        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #99CC33, transparent)' }} />
                        <div className="pointer-events-none absolute -left-8 bottom-8 h-28 w-28 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #34d399, transparent)' }} />

                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Top gradient banner */}
                        <div className="h-24 w-full relative" style={{ background: 'linear-gradient(135deg, #003333 0%, #0a5c2a 100%)' }}>
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #99CC33 0%, transparent 50%), radial-gradient(circle at 80% 20%, #34d399 0%, transparent 40%)' }} />
                            <div className="absolute bottom-0 left-0 right-0 h-8 rounded-t-3xl" style={{ background: 'linear-gradient(160deg, #001a1a, #003333)' }} />
                        </div>

                        {/* Avatar — overlaps the banner */}
                        <div className="flex justify-center -mt-16 relative z-10">
                            <div className="relative">
                                <div className="h-28 w-28 rounded-full p-1 shadow-xl" style={{ background: 'linear-gradient(135deg, #99CC33, #34d399, #059669)' }}>
                                    <img
                                        src="/images/developer-fajar.jpg"
                                        alt="Fajar Fadillah Wibowo"
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                </div>
                                {/* Online badge */}
                                <span className="absolute bottom-2 right-2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#003333]" style={{ background: '#99CC33' }}>
                                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 pb-6 pt-4 text-center relative z-10">
                            {/* Name & role */}
                            <h3 className="text-xl font-extrabold text-white tracking-tight">Fajar Fadillah Wibowo</h3>
                            <span className="mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-bold" style={{ background: 'rgba(153,204,51,0.18)', color: '#99CC33', border: '1px solid rgba(153,204,51,0.3)' }}>
                                Web Developer &amp; Designer
                            </span>

                            {/* Info pills */}
                            <div className="mt-4 space-y-2.5">
                                <div className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-left" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl" style={{ background: 'rgba(153,204,51,0.15)', color: '#99CC33' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-white/80 font-medium">Sidogede, OKU Timur, Sumatera Selatan</span>
                                </div>
                                <a href="mailto:fajarfadillahwibowo@gmail.com" className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-left transition-all hover:scale-[1.01]" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl" style={{ background: 'rgba(153,204,51,0.15)', color: '#99CC33' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-white/80 font-medium truncate">fajarfadillahwibowo@gmail.com</span>
                                </a>
                            </div>

                            {/* Divider */}
                            <div className="my-4 flex items-center gap-3">
                                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
                                <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: 'rgba(153,204,51,0.7)' }}>Media Sosial</span>
                                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
                            </div>

                            {/* Social Media Buttons */}
                            <div className="flex flex-col gap-2.5">
                                {/* WhatsApp */}
                                <a
                                    href="https://wa.me/6285607746031?text=Halo%20Fajar%2C%20saya%20menghubungi%20Anda%20terkait%20website%20SPMB%20MI%20Nurussalam."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                                    style={{ background: 'linear-gradient(135deg, #25D366, #20ba5a)', boxShadow: '0 4px 15px rgba(37,211,102,0.25)' }}
                                >
                                    <svg className="h-5 w-5 fill-current shrink-0" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                                    </svg>
                                    <div className="flex-1 text-left">
                                        <p className="text-xs font-extrabold">WhatsApp</p>
                                        <p className="text-[10px] font-medium opacity-80">0856-0774-6031</p>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4 opacity-60 group-hover:translate-x-1 transition-transform">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </a>

                                {/* Instagram */}
                                <a
                                    href="https://www.instagram.com/fajarfdlwb_?igsh=ZDNlYmUwOXBzaTJ5&utm_source=qr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                                    style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', boxShadow: '0 4px 15px rgba(220,39,67,0.25)' }}
                                >
                                    <svg className="h-5 w-5 fill-current shrink-0" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                    <div className="flex-1 text-left">
                                        <p className="text-xs font-extrabold">Instagram</p>
                                        <p className="text-[10px] font-medium opacity-80">@fajarfdlwb_</p>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4 opacity-60 group-hover:translate-x-1 transition-transform">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </a>

                                {/* TikTok */}
                                <a
                                    href="https://www.tiktok.com/@ahappyone_"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                                    style={{ background: 'linear-gradient(135deg, #000000, #1A1A1A)', boxShadow: '0 4px 15px rgba(0,0,0,0.25)' }}
                                >
                                    <svg className="h-5 w-5 fill-current shrink-0" viewBox="0 0 24 24">
                                        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
                                    </svg>
                                    <div className="flex-1 text-left">
                                        <p className="text-xs font-extrabold">TikTok</p>
                                        <p className="text-[10px] font-medium opacity-80">@ahappyone_</p>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4 opacity-60 group-hover:translate-x-1 transition-transform">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </a>

                                {/* Facebook */}
                                <a
                                    href="https://www.facebook.com/share/1DGhsEBx9J/?mibextid=wwXIfr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                                    style={{ background: 'linear-gradient(135deg, #1877F2, #166fe5)', boxShadow: '0 4px 15px rgba(24,119,242,0.25)' }}
                                >
                                    <svg className="h-5 w-5 fill-current shrink-0" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                    <div className="flex-1 text-left">
                                        <p className="text-xs font-extrabold">Facebook</p>
                                        <p className="text-[10px] font-medium opacity-80">Fajar Fadil</p>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4 opacity-60 group-hover:translate-x-1 transition-transform">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </a>
                            </div>

                            {/* Divider Lokasi */}
                            <div className="my-4 flex items-center gap-3">
                                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
                                <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: 'rgba(153,204,51,0.7)' }}>Lokasi Rumah</span>
                                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
                            </div>

                            {/* Location Button */}
                            <a
                                href="https://maps.app.goo.gl/1enCb67vLWoWGvNH6?g_st=iw"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(153,204,51,0.3)' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5" style={{ color: '#99CC33' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                                <span>Buka di Google Maps</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4 opacity-60 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                                </svg>
                            </a>

                            {/* Footer copyright */}
                            <p className="mt-5 text-[10px] font-medium text-white/30">
                                © 2025 Dibuat dengan ❤️ oleh Fajar Fadillah Wibowo
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                HERO SECTION — Headline + Info Cards sebagai header strip
            ══════════════════════════════════════════════════════════════════ */}
            <section className="relative" style={{ background: '#002b2b' }}>
                {/* MagicRings WebGL Background */}
                <div className="absolute inset-0 z-0 opacity-80 overflow-hidden">
                    <MagicRings
                        color="#99CC33"
                        colorTwo="#ffffff"
                        ringCount={8}
                        speed={1.5}
                        attenuation={15}
                        lineThickness={3}
                        baseRadius={0.4}
                        radiusStep={0.15}
                        scaleRate={0.15}
                        opacity={1}
                        blur={0.5}
                        noiseAmount={0.08}
                        rotation={15}
                        ringGap={1.2}
                        fadeIn={0.7}
                        fadeOut={0.5}
                        followMouse={true}
                        mouseInfluence={0.15}
                        hoverScale={1.1}
                        parallax={0.08}
                        clickBurst={true}
                    />
                </div>
                
                {/* Subtle overlay */}
                <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-[#001a1a]/60 to-[#003d1a]/80" />

                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* ── Headline ── */}
                    <div className="text-center space-y-4 max-w-3xl mx-auto pt-20 pb-16 gsap-fade-down">
                        <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#99CC33' }}>Hubungi Kami</h2>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                            Informasi &amp; Layanan Kontak
                        </h1>
                        <div className="h-1 w-20 rounded-full mx-auto" style={{ background: '#99CC33' }} />
                        <p className="text-lg text-white/80 font-medium">
                            Kami siap membantu menjawab pertanyaan Anda seputar pendaftaran, program pendidikan, dan informasi lainnya.
                        </p>
                    </div>

                    {/* ── Info Cards Strip — floating header, overlap ke body ── */}
                    <div
                        className="gsap-stagger-container grid grid-cols-2 lg:grid-cols-4 gap-4 pb-10"
                    >
                        {/* Alamat */}
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=MI+Nurussalam+Sidogede"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gsap-stagger-item group flex items-center gap-3 rounded-2xl px-5 py-4 transition-all hover:scale-[1.02] cursor-pointer"
                            style={{
                                background: 'rgba(0,51,51,0.88)',
                                border: '1px solid rgba(153,204,51,0.3)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
                            }}
                        >
                            <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-xl transition-colors group-hover:bg-[#99CC33] group-hover:text-[#003333]" style={{ background: 'rgba(153,204,51,0.15)', color: '#99CC33' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-extrabold uppercase tracking-widest mb-0.5" style={{ color: '#99CC33' }}>Alamat</p>
                                <p className="text-xs text-white/80 leading-relaxed line-clamp-2">Desa Sidogede, RT 02 RW 01, Kec. Belitang, Kab. OKU Timur, Sumatera Selatan</p>
                            </div>
                        </a>

                        {/* Telepon */}
                        <a
                            href="https://wa.me/6281381851165?text=Halo%20Admin%20MI%20Nurussalam%20Sidogede"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gsap-stagger-item group flex items-center gap-3 rounded-2xl px-5 py-4 transition-all hover:scale-[1.02] cursor-pointer"
                            style={{
                                background: 'rgba(0,51,51,0.88)',
                                border: '1px solid rgba(153,204,51,0.3)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
                            }}
                        >
                            <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-xl transition-colors group-hover:bg-[#99CC33] group-hover:text-[#003333]" style={{ background: 'rgba(153,204,51,0.15)', color: '#99CC33' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-extrabold uppercase tracking-widest mb-0.5" style={{ color: '#99CC33' }}>Telepon</p>
                                <p className="text-xs font-bold text-white">0813-8185-1165</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">(a.n. Usth Siti Maisaroh S.pd.)</p>
                            </div>
                        </a>

                        {/* Email */}
                        <a
                            href="mailto:misnurussalam1@gmail.com"
                            className="gsap-stagger-item group flex items-center gap-3 rounded-2xl px-5 py-4 transition-all hover:scale-[1.02] cursor-pointer"
                            style={{
                                background: 'rgba(0,51,51,0.88)',
                                border: '1px solid rgba(153,204,51,0.3)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
                            }}
                        >
                            <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-xl transition-colors group-hover:bg-[#99CC33] group-hover:text-[#003333]" style={{ background: 'rgba(153,204,51,0.15)', color: '#99CC33' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-extrabold uppercase tracking-widest mb-0.5" style={{ color: '#99CC33' }}>Email</p>
                                <p className="text-xs font-bold text-white truncate">misnurussalam1@gmail.com</p>
                            </div>
                        </a>

                        {/* Jam Operasional */}
                        <div
                            className="gsap-stagger-item group flex items-center gap-3 rounded-2xl px-5 py-4 transition-all hover:scale-[1.02]"
                            style={{
                                background: 'rgba(0,51,51,0.88)',
                                border: '1px solid rgba(153,204,51,0.3)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
                            }}
                        >
                            <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'rgba(153,204,51,0.15)', color: '#99CC33' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-extrabold uppercase tracking-widest mb-0.5" style={{ color: '#99CC33' }}>Jam Operasional</p>
                                <p className="text-xs text-white/80">Senin – Sabtu</p>
                                <p className="text-xs font-bold" style={{ color: '#99CC33' }}>07:00 – 13:00 WIB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════
                BODY SECTION — Form, Social, FAQ, Peta
            ══════════════════════════════════════════════════════════════════ */}
            <section className="pt-10 pb-16 lg:pb-20" style={{ background: '#001f1f' }}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Thin accent divider */}
                    <div className="flex items-center gap-4 mb-14 gsap-fade-down">
                        <div className="h-px flex-1" style={{ background: 'rgba(153,204,51,0.15)' }} />
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.2em]" style={{ color: 'rgba(153,204,51,0.6)' }}>Layanan &amp; Informasi</span>
                        <div className="h-px flex-1" style={{ background: 'rgba(153,204,51,0.15)' }} />
                    </div>

                    {/* Contact Form & Social */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                        {/* Form */}
                        <div className="lg:col-span-7 gsap-fade-right">
                            <div className="rounded-3xl p-8" style={{ background: '#003333', border: '1px solid rgba(153,204,51,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                                <h3 className="text-xl font-extrabold text-white mb-6">Kirim Pesan Kepada Kami</h3>
                                {submitted ? (
                                    <div className="flex flex-col items-center justify-center text-center space-y-3 py-16">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-8 w-8">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-400">Pesan Berhasil Dikirim!</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Terima kasih. Kami akan segera merespons pesan Anda via email.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-white">Nama Lengkap</label>
                                                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama lengkap" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-[#99CC33] focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#99CC33]/30 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-white">Alamat Email</label>
                                                <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="contoh@email.com" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-[#99CC33] focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#99CC33]/30 transition-all" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-white">Subjek</label>
                                            <input type="text" name="subject" required value={formData.subject} onChange={handleInputChange} placeholder="Tentang apa pesan Anda?" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-[#99CC33] focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#99CC33]/30 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-white">Isi Pesan</label>
                                            <textarea name="message" rows="5" required value={formData.message} onChange={handleInputChange} placeholder="Tuliskan pesan Anda di sini..." className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-[#99CC33] focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#99CC33]/30 transition-all"></textarea>
                                        </div>
                                        <button type="submit" className="w-full inline-flex items-center justify-center rounded-xl py-3.5 text-sm font-bold text-[#003333] shadow-xl transition-all" style={{ background: '#99CC33' }}>
                                            Kirim Pesan
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* ── Developer Button (Terpisah) ──────────────────────────── */}
                            <div className="mt-6 rounded-3xl backdrop-blur-sm p-6" style={{ background: '#003333', border: '1px solid rgba(153,204,51,0.2)' }}>
                                <button
                                    onClick={() => setShowDevModal(true)}
                                    className="group w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                                    style={{ background: 'rgba(153,204,51,0.08)', border: '1px solid rgba(153,204,51,0.2)' }}
                                >
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div className="h-14 w-14 rounded-full p-0.5 shadow-md" style={{ background: 'linear-gradient(135deg, #99CC33, #34d399)' }}>
                                            <img
                                                src="/images/developer-fajar.jpg"
                                                alt="Developer"
                                                className="h-full w-full rounded-full object-cover"
                                            />
                                        </div>
                                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#003333]" style={{ background: '#99CC33' }}>
                                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                        </span>
                                    </div>
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-extrabold uppercase tracking-widest mb-1" style={{ color: 'rgba(153,204,51,0.7)' }}>PROFIL PEMBUAT WEB</p>
                                        <p className="text-base font-extrabold text-white truncate">Fajar Fadillah Wibowo</p>
                                        <p className="text-xs text-white/60 font-medium">Web Developer &amp; Designer</p>
                                    </div>
                                    {/* Arrow icon */}
                                    <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl transition-all group-hover:translate-x-1" style={{ background: 'rgba(153,204,51,0.15)', color: '#99CC33' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Right Side Info */}
                        <div className="lg:col-span-5 flex flex-col gap-6 gsap-fade-left">
                            {/* Social Media */}
                            <div className="rounded-3xl backdrop-blur-sm p-8" style={{ background: '#003333', border: '1px solid rgba(153,204,51,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                                <h3 className="text-lg font-extrabold text-white mb-4">Media Sosial</h3>
                                <p className="text-sm text-white/70 mb-6">Ikuti kami di media sosial untuk mendapatkan informasi terbaru seputar madrasah dan pendaftaran.</p>
                                <div className="flex flex-col gap-3">
                                    <a href="https://wa.me/6281381851165?text=Halo%20Admin%20MI%20Nurussalam%20Sidogede" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/20 transition-all hover:bg-[#20ba5a]">
                                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                                        WhatsApp Chat
                                    </a>
                                    <a href="https://facebook.com/MisNurussalamSidogede" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl bg-[#1877F2] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#1877F2]/20 transition-all hover:bg-[#166fe5]">
                                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                        Mis Nurussalam Sidogede
                                    </a>
                                </div>
                            </div>

                            {/* FAQ Singkat */}
                            <div className="rounded-3xl backdrop-blur-sm p-8" style={{ background: '#003333', border: '1px solid rgba(153,204,51,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                                <h3 className="text-lg font-extrabold text-white mb-4">Pertanyaan Umum</h3>
                                <div className="space-y-4">
                                    {[
                                        { q: 'Kapan pendaftaran dibuka?', a: 'Pendaftaran SPMB dibuka setiap awal tahun ajaran baru. Informasi lengkap dapat dilihat di halaman Beranda.' },
                                        { q: 'Apakah ada biaya pendaftaran?', a: 'Informasi terkait biaya pendaftaran dapat ditanyakan langsung melalui WhatsApp atau datang ke madrasah.' },
                                        { q: 'Dokumen apa saja yang diperlukan?', a: 'Akta kelahiran, kartu keluarga, foto 3x4, ijazah TK/RA, dan KTP orang tua.' },
                                    ].map((faq, i) => (
                                        <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10">
                                            <h4 className="text-sm font-bold text-white mb-1">{faq.q}</h4>
                                            <p className="text-xs text-white/70 leading-relaxed">{faq.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Peta Lokasi */}
                    <div className="mt-14 rounded-3xl backdrop-blur-sm p-6 lg:p-8 gsap-fade-up" style={{ background: '#003333', border: '1px solid rgba(153,204,51,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-extrabold text-white mb-2">Lokasi Madrasah</h3>
                            <p className="text-sm text-white/70">Temukan lokasi MIS Nurussalam Sidogede melalui peta interaktif di bawah ini.</p>
                        </div>
                        <div className="w-full h-[350px] sm:h-[400px] rounded-2xl overflow-hidden shadow-sm border border-emerald-100 dark:border-emerald-800/50 relative">
                            <iframe 
                                src="https://maps.google.com/maps?q=MIS%20Nurussalam%20Sidogede,%20Belitang,%20OKU%20Timur&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Peta Lokasi MIS Nurussalam Sidogede"
                                className="absolute top-0 left-0"
                            ></iframe>
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[#003333] dark:text-slate-200">MIS Nurussalam Sidogede</h4>
                                    <p className="text-xs text-[#003333]/70 dark:text-slate-400 mt-0.5">VMF5+C8H, Sidogede, Kec. Belitang, Kab. OKU Timur, Sumatera Selatan 32382</p>
                                </div>
                            </div>
                            <a href="https://maps.google.com/maps?q=MIS+Nurussalam+Sidogede" target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-bold text-emerald-600 shadow-sm border border-emerald-200 hover:bg-emerald-50 dark:bg-slate-900 dark:border-slate-700 dark:text-emerald-400 dark:hover:bg-slate-800 transition-colors">
                                Buka di Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </GuestInfoLayout>
    );
}
