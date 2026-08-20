import GuestInfoLayout from '@/Layouts/GuestInfoLayout';
import Modal from '@/Components/Modal';
import ShapeGrid from '@/Components/ShapeGrid';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VisiMisi({ auth }) {
    const [showPengajarModal, setShowPengajarModal] = useState(false);
    const [showPrestasiModal, setShowPrestasiModal] = useState(false);
    const [showEkstraModal, setShowEkstraModal] = useState(false);
    const [showKarakterModal, setShowKarakterModal] = useState(false);

    // ===== KEUNGGULAN SHOWCASE STATE =====
    const keunggulanList = [
        {
            id: 'pengajar',
            icon: '👨‍🏫',
            title: 'Tenaga Pengajar Profesional',
            img: '/images/pengajar1.jpg',
            badge: 'S1 & S2',
            desc: 'Tenaga pendidik berpengalaman dengan kualifikasi akademik S1 & S2, kompeten secara pedagogik dan profesional untuk memberikan bimbingan akademis serta akhlak mulia secara optimal kepada seluruh peserta didik.',
            detail: () => setShowPengajarModal(true),
        },
        {
            id: 'prestasi',
            icon: '🏆',
            title: 'Prestasi Gemilang',
            img: '/images/prestasi.jpg',
            badge: 'Regional',
            desc: 'Pencapaian membanggakan dalam kompetisi akademik maupun non-akademik tingkat kabupaten dan regional, menjadi bukti nyata kualitas pendidikan di MI Nurussalam Sidogede.',
            detail: () => setShowPrestasiModal(true),
        },
        {
            id: 'ekstrakurikuler',
            icon: '⚽',
            title: 'Ekstrakurikuler Beragam',
            img: '/images/ekstra_pramuka.jpg',
            badge: '5+ Program',
            desc: 'Wadah pengembangan minat dan bakat siswa melalui Pramuka, Seni Tari Kreasi, Drumband, Seni Hadroh, dan Seni Beladiri. Membentuk karakter percaya diri, kreatif, dan berprestasi.',
            detail: () => setShowEkstraModal(true),
        },
        {
            id: 'karakter',
            icon: '🕌',
            title: 'Pembinaan Karakter Islami',
            img: '/images/karakter1.jpg',
            badge: 'Islami',
            desc: 'Pembiasaan ibadah harian, adab islami, hafalan surat pendek, dan kepedulian sosial menjadi fondasi untuk membentuk generasi yang berakhlak mulia dan bertakwa.',
            detail: () => setShowKarakterModal(true),
        },
    ];
    const [activeKeunggulanId, setActiveKeunggulanId] = useState(keunggulanList[0].id);
    const keunggulanRef = useRef(null);

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

    // ===== GSAP: Crossfade saat tab keunggulan berganti =====
    useEffect(() => {
        if (!keunggulanRef.current) return;
        gsap.fromTo(
            keunggulanRef.current,
            { opacity: 0, y: 28, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' }
        );
    }, [activeKeunggulanId]);

    return (
        <GuestInfoLayout auth={auth} title="Visi & Misi">
            {/* ═══════════════════════════════════════════════
                HERO SECTION — ShapeGrid Background
            ═══════════════════════════════════════════════ */}
            <section className="relative overflow-hidden" style={{ background: '#001a1a', minHeight: '480px' }}>

                {/* ShapeGrid Canvas — full cover */}
                <div className="absolute inset-0 z-0">
                    <ShapeGrid
                        speed={0.4}
                        squareSize={44}
                        direction="diagonal"
                        borderColor="rgba(153,204,51,0.18)"
                        hoverFillColor="rgba(153,204,51,0.22)"
                        shape="square"
                        hoverTrailAmount={6}
                    />
                </div>

                {/* Radial vignette — centre bright, edges dark */}
                <div
                    className="absolute inset-0 z-[1] pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,26,26,0) 0%, rgba(0,26,26,0.55) 60%, rgba(0,10,10,0.92) 100%)',
                    }}
                />
                {/* Bottom fade so it merges with the section below */}
                <div
                    className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none h-32"
                    style={{ background: 'linear-gradient(to bottom, transparent, #001a1a)' }}
                />

                {/* Content */}
                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center"
                    style={{ minHeight: '480px' }}>
                    <div className="text-center space-y-5 max-w-3xl mx-auto gsap-fade-down py-20">
                        {/* Pill label */}
                        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
                            style={{ background: 'rgba(153,204,51,0.15)', border: '1px solid rgba(153,204,51,0.35)', color: '#99CC33' }}>
                            <span className="inline-block h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: '#99CC33' }} />
                            Visi &amp; Misi
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                            Fondasi Nilai
                            <span className="block" style={{ color: '#99CC33' }}>MI Nurussalam</span>
                        </h1>

                        <div className="h-px w-24 mx-auto" style={{ background: 'linear-gradient(to right, transparent, #99CC33, transparent)' }} />

                        <p className="text-base sm:text-lg text-white/75 font-medium leading-relaxed max-w-xl mx-auto">
                            Visi dan misi menjadi landasan setiap langkah kami dalam mendidik
                            dan membina generasi penerus bangsa yang berilmu dan berakhlak.
                        </p>

                        {/* Stats row */}
                        <div className="flex flex-wrap justify-center gap-6 pt-2">
                            {[
                                { value: '6', label: 'Poin Misi Strategis', onClick: () => document.getElementById('misi-madrasah')?.scrollIntoView({ behavior: 'smooth' }) },
                                { value: '5+', label: 'Program Ekstra', onClick: () => { setActiveKeunggulanId('ekstrakurikuler'); document.getElementById('keunggulan-madrasah')?.scrollIntoView({ behavior: 'smooth' }); } },
                                { value: '100%', label: 'Berbasis Islami' },
                            ].map((s) => (
                                <div key={s.label} className={`text-center ${s.onClick ? 'cursor-pointer hover:scale-110 transition-transform duration-300' : ''}`} onClick={s.onClick}>
                                    <p className="text-2xl font-black" style={{ color: '#99CC33' }}>{s.value}</p>
                                    <p className={`text-[11px] font-semibold uppercase tracking-wider transition-colors ${s.onClick ? 'text-white/80 hover:text-white' : 'text-white/50'}`}>{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Visi Madrasah Card — floating di hero ── */}
                    <div className="gsap-fade-up pb-14">
                        <div
                            className="rounded-3xl p-7 lg:p-10"
                            style={{
                                background: 'rgba(0,51,51,0.82)',
                                border: '1px solid rgba(153,204,51,0.3)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
                            }}
                        >
                            <div className="flex flex-col lg:flex-row gap-7 items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl shadow-xl" style={{ background: 'linear-gradient(135deg, #99CC33, #88bb22)', boxShadow: '0 10px 25px rgba(153,204,51,0.3)' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-10 w-10 text-[#003333]">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="space-y-3 text-center lg:text-left">
                                    <h3 className="text-2xl lg:text-3xl font-extrabold" style={{ color: '#99CC33' }}>
                                        Visi Madrasah
                                    </h3>
                                    <p className="text-xl lg:text-2xl text-white/85 font-medium italic leading-relaxed">
                                        "Terwujudnya Generasi yang Berakhlakul Karimah, islami, berprestasi, dan Mandiri."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visi, Misi, Keunggulan */}
            <section className="py-12 lg:py-16" style={{ background: '#f8fafc' }}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* ═══════ MISI MADRASAH — 3D FLIP CARDS ═══════ */}
                    <div id="misi-madrasah" className="mb-16 scroll-mt-24">
                        {/* Section Header */}
                        <div className="text-center space-y-3 max-w-2xl mx-auto mb-14 gsap-fade-down">
                            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] px-4 py-1 rounded-full"
                                style={{ color: '#99CC33', background: 'rgba(153,204,51,0.1)', border: '1px solid rgba(153,204,51,0.25)' }}>
                                Pilar Strategis
                            </span>
                            <h3 className="text-3xl lg:text-4xl font-extrabold text-[#002b2b]">Misi Madrasah</h3>
                            <div className="h-px w-16 mx-auto" style={{ background: 'linear-gradient(to right, transparent, #99CC33, transparent)' }} />
                            <p className="text-[#003333]/60 text-sm leading-relaxed">
                                Langkah-langkah strategis yang kami tempuh untuk mewujudkan visi madrasah secara nyata dan terukur.
                            </p>
                        </div>

                        {/* Inline styles for 3D flip */}
                        <style>{`
                            .misi-flip-card {
                                perspective: 1000px;
                                height: 240px;
                            }
                            .misi-flip-inner {
                                position: relative;
                                width: 100%;
                                height: 100%;
                                transition: transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1);
                                transform-style: preserve-3d;
                            }
                            .misi-flip-card:hover .misi-flip-inner {
                                transform: rotateY(180deg);
                            }
                            .misi-flip-front,
                            .misi-flip-back {
                                position: absolute;
                                inset: 0;
                                backface-visibility: hidden;
                                -webkit-backface-visibility: hidden;
                                border-radius: 20px;
                                overflow: hidden;
                            }
                            .misi-flip-back {
                                transform: rotateY(180deg);
                            }
                            .misi-num-ring {
                                background: conic-gradient(#99CC33 0deg, rgba(153,204,51,0.15) 0deg);
                                animation: ring-spin 8s linear infinite;
                            }
                            @keyframes ring-spin {
                                to { transform: rotate(360deg); }
                            }
                            .misi-card-glow {
                                transition: box-shadow 0.4s ease;
                            }
                            .misi-flip-card:hover .misi-card-glow {
                                box-shadow: 0 0 40px rgba(153,204,51,0.25), 0 20px 60px rgba(0,51,51,0.3);
                            }
                        `}</style>

                        {/* 3D Flip Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gsap-stagger-container">
                            {[
                                {
                                    num: '01',
                                    icon: '🕌',
                                    title: 'Pendidikan Keagamaan Intensif',
                                    tagline: 'Fondasi Aqidah & Akhlak',
                                    desc: 'Menyelenggarakan pembelajaran keagamaan intensif untuk membiasakan adab santun Islami, ibadah harian, dan pemahaman dasar-dasar Aqidah Islam sejak usia dini.',
                                    accent: '#99CC33',
                                    bgNum: 'rgba(153,204,51,0.06)',
                                },
                                {
                                    num: '02',
                                    icon: '📚',
                                    title: 'Kurikulum Terpadu Berkualitas',
                                    tagline: 'Sains + Agama Berpadu',
                                    desc: 'Menerapkan kurikulum pembelajaran terpadu yang menggabungkan kurikulum nasional dengan muatan keagamaan, guna menunjang prestasi akademik di berbagai kompetensi sains, bahasa, dan matematika.',
                                    accent: '#33aacc',
                                    bgNum: 'rgba(51,170,204,0.06)',
                                },
                                {
                                    num: '03',
                                    icon: '📖',
                                    title: "Program Tahfidz Al-Qur'an",
                                    tagline: 'Target Hafalan Juz 30',
                                    desc: "Membina kemampuan baca tulis dan hafalan Al-Qur'an secara rutin terstruktur menggunakan metode qiroati dengan target minimal menghafal juz 30 dan surat-surat pilihan.",
                                    accent: '#cc9933',
                                    bgNum: 'rgba(204,153,51,0.06)',
                                },
                                {
                                    num: '04',
                                    icon: '🌟',
                                    title: 'Kepemimpinan & Kemandirian',
                                    tagline: 'Karakter Pemimpin Masa Depan',
                                    desc: 'Mengembangkan bakat kepemimpinan, keterampilan mandiri, serta disiplin bersosialisasi yang tinggi melalui kegiatan organisasi, pramuka, dan program pengembangan diri.',
                                    accent: '#cc5533',
                                    bgNum: 'rgba(204,85,51,0.06)',
                                },
                                {
                                    num: '05',
                                    icon: '🏫',
                                    title: 'Lingkungan Belajar Kondusif',
                                    tagline: 'Nyaman, Aman & Islami',
                                    desc: 'Menciptakan suasana belajar yang nyaman, aman, dan islami sehingga setiap peserta didik dapat tumbuh dan berkembang secara optimal baik secara intelektual, spiritual, maupun emosional.',
                                    accent: '#8833cc',
                                    bgNum: 'rgba(136,51,204,0.06)',
                                },
                                {
                                    num: '06',
                                    icon: '🤝',
                                    title: 'Kemitraan Orang Tua & Masyarakat',
                                    tagline: 'Ekosistem Pendidikan Harmonis',
                                    desc: 'Menjalin komunikasi dan kerjasama yang harmonis dengan orang tua/wali murid serta masyarakat sekitar dalam rangka membangun ekosistem pendidikan yang saling mendukung.',
                                    accent: '#33cc88',
                                    bgNum: 'rgba(51,204,136,0.06)',
                                },
                            ].map((item, idx) => (
                                <div key={item.num} className="misi-flip-card gsap-stagger-item">
                                    <div className="misi-flip-inner misi-card-glow">

                                        {/* ─── FRONT FACE ─── */}
                                        <div
                                            className="misi-flip-front flex flex-col justify-between p-6"
                                            style={{
                                                background: 'linear-gradient(145deg, #002e2e, #004040)',
                                                border: `1px solid ${item.accent}30`,
                                            }}
                                        >
                                            {/* Top row: number + icon */}
                                            <div className="flex items-start justify-between">
                                                {/* Spinning ring number */}
                                                <div className="relative flex items-center justify-center" style={{ width: 52, height: 52 }}>
                                                    <div
                                                        className="absolute inset-0 rounded-full misi-num-ring"
                                                        style={{
                                                            background: `conic-gradient(${item.accent} ${(idx + 1) * 60}deg, rgba(255,255,255,0.05) 0deg)`,
                                                            padding: 2,
                                                        }}
                                                    />
                                                    <div
                                                        className="relative z-10 flex items-center justify-center rounded-full"
                                                        style={{ width: 44, height: 44, background: '#001f1f' }}
                                                    >
                                                        <span className="text-xs font-black" style={{ color: item.accent }}>{item.num}</span>
                                                    </div>
                                                </div>
                                                <span className="text-3xl mt-1" style={{ filter: `drop-shadow(0 2px 8px ${item.accent}88)` }}>{item.icon}</span>
                                            </div>

                                            {/* Title */}
                                            <div className="mt-4 space-y-1.5">
                                                <p className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: item.accent }}>
                                                    {item.tagline}
                                                </p>
                                                <h4 className="text-base font-extrabold text-white leading-snug">{item.title}</h4>
                                            </div>

                                            {/* Flip hint */}
                                            <div className="mt-5 flex items-center gap-1.5">
                                                <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${item.accent}60, transparent)` }} />
                                                <span className="text-[10px] font-bold" style={{ color: `${item.accent}99` }}>Hover untuk detail ↻</span>
                                            </div>

                                            {/* Corner glow */}
                                            <div
                                                className="absolute bottom-0 right-0 h-24 w-24 rounded-tl-full pointer-events-none"
                                                style={{ background: `radial-gradient(circle at 100% 100%, ${item.accent}18, transparent 70%)` }}
                                            />
                                        </div>

                                        {/* ─── BACK FACE ─── */}
                                        <div
                                            className="misi-flip-back flex flex-col justify-between p-6"
                                            style={{
                                                background: `linear-gradient(145deg, ${item.accent}18, #001a1a)`,
                                                border: `1px solid ${item.accent}50`,
                                            }}
                                        >
                                            {/* Header */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-xl">{item.icon}</span>
                                                <span
                                                    className="text-xs font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full"
                                                    style={{ background: `${item.accent}25`, color: item.accent }}
                                                >
                                                    Misi {item.num}
                                                </span>
                                            </div>

                                            {/* Description */}
                                            <p className="text-sm text-white/80 leading-relaxed flex-1">
                                                {item.desc}
                                            </p>

                                            {/* Bottom accent bar */}
                                            <div className="mt-4 h-1 w-full rounded-full" style={{ background: `linear-gradient(to right, ${item.accent}, transparent)` }} />
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Keunggulan Madrasah — INTERACTIVE SHOWCASE EXPLORER */}
                    <div id="keunggulan-madrasah" className="mb-16 scroll-mt-24">
                        <div className="text-center space-y-4 max-w-2xl mx-auto mb-10 gsap-fade-up">
                            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#99CC33' }}>Keunggulan</h3>
                            <p className="text-2xl font-extrabold text-[#003333]">Keunggulan MI Nurussalam</p>
                            <div className="h-1 w-20 rounded-full mx-auto" style={{ background: '#99CC33' }} />
                            <p className="text-sm text-[#003333]/60 max-w-md mx-auto">
                                Pilih kategori keunggulan di bawah untuk melihat detail program dan pencapaian kami.
                            </p>
                        </div>

                        {/* Showcase Container */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start gsap-stagger-container">

                            {/* Left/Top Column: Tab Menu */}
                            <div className="lg:col-span-4 gsap-stagger-item">
                                {/* Scroll hint mobile */}
                                <div className="flex items-center justify-between lg:hidden mb-2 px-1 text-xs text-[#003333]/50">
                                    <span>Geser menu ke samping ➔</span>
                                    <span>({keunggulanList.length} Keunggulan)</span>
                                </div>
                                <div
                                    className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 snap-x scroll-smooth"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                    <style dangerouslySetInnerHTML={{__html: `.keunggulan-tabs::-webkit-scrollbar { display: none; }`}} />
                                    {keunggulanList.map((item) => {
                                        const isActive = activeKeunggulanId === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => setActiveKeunggulanId(item.id)}
                                                className="flex items-center gap-3 px-5 py-4 rounded-2xl text-left transition-all duration-300 shrink-0 snap-align-start border text-sm font-bold w-auto lg:w-full group"
                                                style={{
                                                    background: isActive ? '#003333' : 'rgba(0,51,51,0.04)',
                                                    borderColor: isActive ? '#99CC33' : 'rgba(0,51,51,0.08)',
                                                    color: isActive ? '#ffffff' : '#003333',
                                                    boxShadow: isActive ? '0 10px 20px rgba(0,51,51,0.15)' : 'none',
                                                    transform: isActive ? 'translateX(4px)' : 'none',
                                                }}
                                            >
                                                <span
                                                    className="text-2xl transition-transform duration-300 group-hover:scale-110"
                                                    style={{ filter: isActive ? 'drop-shadow(0 2px 4px rgba(153,204,51,0.4))' : 'none' }}
                                                >
                                                    {item.icon}
                                                </span>
                                                <div className="flex-1">
                                                    <span className="block tracking-tight">{item.title}</span>
                                                    <span
                                                        className="hidden lg:inline-block text-xs font-semibold mt-1 px-2 py-0.5 rounded-full"
                                                        style={{
                                                            background: isActive ? 'rgba(153,204,51,0.2)' : 'rgba(0,51,51,0.06)',
                                                            color: isActive ? '#99CC33' : 'rgba(0,51,51,0.5)',
                                                        }}
                                                    >
                                                        {item.badge}
                                                    </span>
                                                </div>
                                                <span
                                                    className="hidden lg:block transition-all duration-300"
                                                    style={{
                                                        opacity: isActive ? 1 : 0,
                                                        transform: isActive ? 'translateX(0)' : 'translateX(-5px)',
                                                        color: '#99CC33',
                                                    }}
                                                >
                                                    ➔
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Right Column: Featured Display Card */}
                            <div className="lg:col-span-8 gsap-stagger-item">
                                {keunggulanList.map((item) => {
                                    if (item.id !== activeKeunggulanId) return null;
                                    return (
                                        <div
                                            key={item.id}
                                            ref={keunggulanRef}
                                            className="rounded-3xl border border-slate-200/80 bg-white shadow-xl overflow-hidden relative group"
                                            style={{ boxShadow: '0 20px 50px rgba(0,51,51,0.06)' }}
                                        >
                                            {/* Image Area */}
                                            <div className="relative w-full h-[220px] sm:h-[340px] overflow-hidden bg-[#001f1f]">
                                                <img
                                                    src={item.img}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-[7000ms] ease-out scale-100 group-hover:scale-105"
                                                    style={{ transformOrigin: 'center' }}
                                                />
                                                {/* Gradient overlay bottom */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#001f1f]/80 via-transparent to-transparent" />
                                                {/* Badge overlay */}
                                                <div className="absolute top-4 left-4 flex items-center gap-2">
                                                    <span className="text-3xl drop-shadow-lg">{item.icon}</span>
                                                    <span
                                                        className="text-xs font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-sm"
                                                        style={{ background: 'rgba(153,204,51,0.85)', color: '#003333' }}
                                                    >
                                                        {item.badge}
                                                    </span>
                                                </div>
                                                {/* Title on image */}
                                                <div className="absolute bottom-4 left-5 right-5">
                                                    <h3 className="text-xl font-extrabold text-white drop-shadow-lg">{item.title}</h3>
                                                </div>
                                            </div>

                                            {/* Content Area */}
                                            <div className="p-6 space-y-5">
                                                <p className="text-sm text-[#003333]/75 leading-relaxed">{item.desc}</p>

                                                {/* Action Button → opens detail modal */}
                                                <button
                                                    onClick={item.detail}
                                                    className="inline-flex items-center gap-2 bg-[#003333] text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg hover:bg-[#004444] hover:-translate-y-0.5 transition-all duration-300"
                                                    style={{ boxShadow: '0 8px 20px rgba(0,51,51,0.2)' }}
                                                >
                                                    <span>Lihat Detail Lengkap</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Bottom accent line */}
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#99CC33] to-[#008855]" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Modal Foto Tenaga Pengajar */}
                        <Modal show={showPengajarModal} onClose={() => setShowPengajarModal(false)} maxWidth="4xl">
                            <div className="p-6 space-y-6 bg-white dark:bg-slate-900 rounded-2xl">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">👨‍🏫</span>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            Tenaga Pengajar Profesional
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setShowPengajarModal(false)}
                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-850 dark:hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                                        <img src="/images/pengajar1.jpg" alt="Guru MI Nurussalam 1" className="w-full h-auto object-contain" />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                                        <img src="/images/pengajar2.jpg" alt="Guru MI Nurussalam 2" className="w-full h-auto object-contain" />
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-emerald-50/50 p-4 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-emerald-300 leading-relaxed">
                                        MI Nurussalam Sidogede didukung oleh tenaga pendidik profesional yang memiliki kualifikasi akademik Strata 1 (S1) dan Strata 2 (S2) dari perguruan tinggi terakreditasi. Para pengajar kami memiliki kompetensi pedagogik, kepribadian, sosial, dan profesional yang tinggi, serta berpengalaman di bidangnya masing-masing untuk memberikan bimbingan akademis dan akhlak mulia secara optimal kepada seluruh peserta didik.
                                    </p>
                                </div>
                            </div>
                        </Modal>

                        {/* Modal Foto Prestasi Gemilang */}
                        <Modal show={showPrestasiModal} onClose={() => setShowPrestasiModal(false)} maxWidth="2xl">
                            <div className="p-6 space-y-6 bg-white dark:bg-slate-900 rounded-2xl">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🏆</span>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            Prestasi Gemilang
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setShowPrestasiModal(false)}
                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-850 dark:hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex justify-center bg-slate-50 dark:bg-slate-950">
                                    <img src="/images/prestasi.jpg" alt="Trophy Prestasi MI Nurussalam" className="max-w-full h-auto max-h-[70vh] object-contain" />
                                </div>

                                <div className="rounded-2xl bg-emerald-50/50 p-4 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-emerald-300 leading-relaxed">
                                        MI Nurussalam Sidogede secara konsisten mendampingi siswa-siswi dalam mengasah minat dan bakat mereka, sehingga berhasil meraih berbagai prestasi gemilang. Sekolah kami telah memenangkan kompetisi di tingkat kecamatan hingga kabupaten, termasuk Juara 1 Umum, Juara 1 Lomba Adzan, Juara 2 Tahfidz Al-Qur'an, Juara 3 Lomba Pidato/Story Telling Putra, serta Juara 3 Lomba Atletik Putri. Raihan trofi ini merupakan bukti nyata dari komitmen kami dalam membimbing generasi yang unggul dan berdaya saing tinggi.
                                    </p>
                                </div>
                            </div>
                        </Modal>

                        {/* Modal Foto Ekstrakurikuler */}
                        <Modal show={showEkstraModal} onClose={() => setShowEkstraModal(false)} maxWidth="4xl">
                            <div className="p-6 space-y-6 bg-white dark:bg-slate-900 rounded-2xl">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">⚽</span>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            Kegiatan Ekstrakurikuler
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setShowEkstraModal(false)}
                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-850 dark:hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="group relative rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex flex-col bg-slate-50 dark:bg-slate-950 transition-all hover:shadow-md">
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <img src="/images/ekstra_pramuka.jpg" alt="Ekstrakurikuler Pramuka" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                        </div>
                                        <div className="p-3 text-center border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Pramuka</span>
                                        </div>
                                    </div>
                                    <div className="group relative rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex flex-col bg-slate-50 dark:bg-slate-950 transition-all hover:shadow-md">
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <img src="/images/ekstra_tari.jpg" alt="Ekstrakurikuler Seni Tari Kreasi" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                        </div>
                                        <div className="p-3 text-center border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Seni Tari Kreasi</span>
                                        </div>
                                    </div>
                                    <div className="group relative rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex flex-col bg-slate-50 dark:bg-slate-950 transition-all hover:shadow-md">
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <img src="/images/ekstra_drumband.jpg" alt="Ekstrakurikuler Drumband" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                        </div>
                                        <div className="p-3 text-center border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Drumband</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-emerald-50/50 p-5 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 space-y-4">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-emerald-300 leading-relaxed">
                                        MI Nurussalam Sidogede menyediakan berbagai wadah kegiatan ekstrakurikuler untuk mengembangkan minat, bakat, karakter, dan kreativitas peserta didik di luar kegiatan akademis formal:
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-3">
                                            <div className="flex gap-3">
                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-bold">1</div>
                                                <div>
                                                    <h4 className="font-extrabold text-slate-900 dark:text-white">Pramuka</h4>
                                                    <p className="text-xs text-slate-650 dark:text-slate-400 mt-0.5 leading-relaxed">Membentuk karakter disiplin, kemandirian, kepemimpinan, kepedulian sosial, serta rasa cinta tanah air melalui berbagai kegiatan kepanduan.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-bold">2</div>
                                                <div>
                                                    <h4 className="font-extrabold text-slate-900 dark:text-white">Seni Tari Kreasi</h4>
                                                    <p className="text-xs text-slate-650 dark:text-slate-400 mt-0.5 leading-relaxed">Wadah ekspresi seni tari tradisional dan kreasi baru untuk menumbuhkan kecintaan terhadap seni budaya serta melatih keselarasan gerak.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-bold">3</div>
                                                <div>
                                                    <h4 className="font-extrabold text-slate-900 dark:text-white">Drumband</h4>
                                                    <p className="text-xs text-slate-650 dark:text-slate-400 mt-0.5 leading-relaxed">Mengembangkan bakat musik, ritme ketukan nada, kekompakan baris-berbaris, serta kerja sama tim yang harmonis.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex gap-3">
                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-bold">4</div>
                                                <div>
                                                    <h4 className="font-extrabold text-slate-900 dark:text-white">Seni Hadroh</h4>
                                                    <p className="text-xs text-slate-650 dark:text-slate-400 mt-0.5 leading-relaxed">Membina keterampilan seni musik rebana islami, teknik vokal religi, serta lantunan shalawat guna mempertebal rasa cinta kepada Rasulullah SAW.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-bold">5</div>
                                                <div>
                                                    <h4 className="font-extrabold text-slate-900 dark:text-white">Seni Beladiri</h4>
                                                    <p className="text-xs text-slate-650 dark:text-slate-400 mt-0.5 leading-relaxed">Melatih pertahanan diri praktis, kebugaran fisik, konsentrasi mental, kecepatan reaksi, serta rasa percaya diri.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal>

                        {/* Modal Foto Program Pembinaan Karakter */}
                        <Modal show={showKarakterModal} onClose={() => setShowKarakterModal(false)} maxWidth="4xl">
                            <div className="p-6 space-y-6 bg-white dark:bg-slate-900 rounded-2xl">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🕌</span>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            Program Pembinaan Karakter
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setShowKarakterModal(false)}
                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-850 dark:hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="group relative rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex flex-col bg-slate-50 dark:bg-slate-950 transition-all hover:shadow-md">
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <img src="/images/karakter1.jpg" alt="Pembinaan Karakter 1" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                        </div>
                                    </div>
                                    <div className="group relative rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex flex-col bg-slate-50 dark:bg-slate-950 transition-all hover:shadow-md">
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <img src="/images/karakter2.jpg" alt="Pembinaan Karakter 2" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                        </div>
                                    </div>
                                    <div className="group relative rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex flex-col bg-slate-50 dark:bg-slate-950 transition-all hover:shadow-md">
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <img src="/images/karakter3.jpg" alt="Pembinaan Karakter 3" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                        </div>
                                    </div>
                                    <div className="group relative rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex flex-col bg-slate-50 dark:bg-slate-950 transition-all hover:shadow-md">
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <img src="/images/karakter4.jpg" alt="Pembinaan Karakter 4" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-emerald-50/50 p-5 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 space-y-4">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-emerald-300 leading-relaxed">
                                        MI Nurussalam Sidogede secara konsisten melaksanakan berbagai program harian, mingguan, dan berkala guna membentuk kepribadian siswa yang berkarakter Islami, sehat fisik, dan peduli sosial:
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-3">
                                            <div className="flex gap-3">
                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-bold">1</div>
                                                <div>
                                                    <h4 className="font-extrabold text-slate-900 dark:text-white">Tadarus Pagi</h4>
                                                    <p className="text-xs text-slate-650 dark:text-slate-400 mt-0.5 leading-relaxed">Pembiasaan membaca Al-Qur'an secara rutin setiap pagi sebelum memulai pelajaran untuk melatih kelancaran membaca dan mendekatkan hati siswa kepada kitab suci sejak dini.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-bold">2</div>
                                                <div>
                                                    <h4 className="font-extrabold text-slate-900 dark:text-white">Shalat Dhuha Terbimbing</h4>
                                                    <p className="text-xs text-slate-650 dark:text-slate-400 mt-0.5 leading-relaxed">Ibadah sunnah dhuha yang dilakukan secara bersama-sama dengan bimbingan guru pendidik guna mengajarkan tata cara, doa, serta kedisiplinan ibadah.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-bold">3</div>
                                                <div>
                                                    <h4 className="font-extrabold text-slate-900 dark:text-white">Infaq Jumat</h4>
                                                    <p className="text-xs text-slate-650 dark:text-slate-400 mt-0.5 leading-relaxed">Kegiatan pengumpulan infaq sukarela setiap hari Jumat untuk menanamkan rasa empati, gemar berbagi, dan kepedulian sosial terhadap sesama.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex gap-3">
                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-bold">4</div>
                                                <div>
                                                    <h4 className="font-extrabold text-slate-900 dark:text-white">Senam Pagi</h4>
                                                    <p className="text-xs text-slate-650 dark:text-slate-400 mt-0.5 leading-relaxed">Aktivitas olahraga senam pagi bersama secara rutin untuk menjaga kebugaran jasmani, kesehatan fisik, dan semangat belajar seluruh siswa.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-bold">5</div>
                                                <div>
                                                    <h4 className="font-extrabold text-slate-900 dark:text-white">Shalat Dzuhur Berjamaah</h4>
                                                    <p className="text-xs text-slate-650 dark:text-slate-400 mt-0.5 leading-relaxed">Melaksanakan shalat fardhu dzuhur berjamaah sebelum pulang sekolah untuk melatih pembiasaan ibadah wajib tepat waktu dan beradab islami.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </div>

                    {/* Tujuan Pendidikan */}
                    <div className="mb-16">
                        <div className="text-center space-y-4 max-w-2xl mx-auto mb-10 gsap-fade-up">
                            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#99CC33' }}>Tujuan</h3>
                            <p className="text-2xl font-extrabold text-[#003333]">Tujuan Pendidikan Kami</p>
                            <div className="h-1 w-20 rounded-full mx-auto" style={{ background: '#99CC33' }} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gsap-stagger-container">
                            {[
                                { icon: '📿', title: 'Berakhlak Mulia', desc: 'Membentuk siswa yang memiliki budi pekerti luhur, sopan santun, dan taat beribadah sesuai ajaran Islam.' },
                                { icon: '📖', title: 'Cinta Al-Qur\'an', desc: 'Menumbuhkan kecintaan terhadap Al-Qur\'an sehingga menjadi pedoman hidup sehari-hari bagi setiap siswa.' },
                                { icon: '🎓', title: 'Prestasi Akademik', desc: 'Mencetak lulusan yang memiliki kemampuan akademik tinggi dan siap melanjutkan ke jenjang pendidikan yang lebih baik.' },
                                { icon: '🌟', title: 'Mandiri & Berkarakter', desc: 'Menghasilkan siswa yang mandiri, percaya diri, bertanggung jawab, dan memiliki jiwa kepemimpinan.' },
                            ].map((item, i) => (
                                <div key={i} className="rounded-2xl backdrop-blur-sm p-6 text-center transition-all hover:shadow-lg gsap-stagger-item" style={{ background: '#003333', border: '1px solid rgba(153,204,51,0.2)' }}>
                                    <span className="text-3xl block mb-3">{item.icon}</span>
                                    <h4 className="text-base font-extrabold text-white mb-2">{item.title}</h4>
                                    <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Motto */}
                    <div className="rounded-3xl p-10 text-center shadow-2xl gsap-fade-left" style={{ background: 'linear-gradient(135deg, #003333 0%, #002222 100%)', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#99CC33' }}>Motto Madrasah</p>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white italic">
                            "Berakhlak, Berilmu, Berprestasi"
                        </h2>
                        <p className="text-white/70 mt-4 max-w-xl mx-auto">
                            Tiga pilar utama yang menjadi pedoman seluruh kegiatan pembelajaran dan pembinaan di MI Nurussalam Sidogede.
                        </p>
                    </div>
                </div>
            </section>
        </GuestInfoLayout>
    );
}
