import GuestInfoLayout from '@/Layouts/GuestInfoLayout';
import { Link } from '@inertiajs/react';
import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DotGrid from '@/Components/DotGrid';

gsap.registerPlugin(ScrollTrigger);

export default function Welcome({ auth, spmbSettings }) {
    // [BARU] Logika status SPMB — tombol disabled jika status = 'tutup'
    const spmbTutup = spmbSettings?.status === 'tutup';
    const { periodeAktif } = spmbSettings || {};

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const now = new Date();
    const getGelombangStatus = (start, end) => {
        if (!start || !end) return { isActive: false, label: 'TIDAK TERSEDIA' };
        const startDate = new Date(start);
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);
        
        if (now < startDate) return { isActive: false, label: 'SEGERA DIBUKA' };
        if (now > endDate) return { isActive: false, label: 'SUDAH DITUTUP' };
        return { isActive: true, label: '🔥 SEDANG BERLANGSUNG' };
    };

    const gelombangData = [
        {
            id: 'I',
            name: 'Gelombang I',
            start: periodeAktif?.gel1_mulai,
            end: periodeAktif?.gel1_selesai,
            statusObj: getGelombangStatus(periodeAktif?.gel1_mulai, periodeAktif?.gel1_selesai),
            fallbackDate: '01 April 2026 — 30 Mei 2026',
            gradient: 'linear-gradient(to right, #99CC33, #008855)'
        },
        {
            id: 'II',
            name: 'Gelombang II',
            start: periodeAktif?.gel2_mulai,
            end: periodeAktif?.gel2_selesai,
            statusObj: getGelombangStatus(periodeAktif?.gel2_mulai, periodeAktif?.gel2_selesai),
            fallbackDate: '01 Juni 2026 — 30 Juli 2026',
            gradient: 'linear-gradient(to right, #008855, #00bbcc)'
        },
        {
            id: 'III',
            name: 'Gelombang III',
            start: periodeAktif?.gel3_mulai,
            end: periodeAktif?.gel3_selesai,
            statusObj: getGelombangStatus(periodeAktif?.gel3_mulai, periodeAktif?.gel3_selesai),
            fallbackDate: '1 Agustus 2026 — 30 September 2026',
            gradient: 'linear-gradient(to right, #00bbcc, #3b82f6)'
        }
    ];

    const features = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
            ),
            title: 'Aman & Terpercaya',
            desc: 'Sistem pendaftaran aman dan terpercaya',
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>
            ),
            title: 'Cepat & Mudah',
            desc: 'Proses pendaftaran cepat dan mudah',
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" />
                </svg>
            ),
            title: 'Online 24/7',
            desc: 'Daftar kapan saja dan di mana saja',
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.016 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                </svg>
            ),
            title: 'Terintegrasi',
            desc: 'Sistem terintegrasi untuk pengalaman terbaik',
        },
    ];

    const steps = [
        {
            step: '1',
            title: 'Buat Akun',
            desc: 'Daftarkan akun baru dengan email aktif Anda, lalu verifikasi melalui email yang dikirimkan.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
            ),
            tag: 'Langkah Pertama',
        },
        {
            step: '2',
            title: 'Isi Formulir',
            desc: 'Lengkapi data diri calon siswa dan informasi orang tua/wali pada formulir pendaftaran.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
            ),
            tag: 'Langkah Kedua',
        },
        {
            step: '3',
            title: 'Upload Berkas',
            desc: 'Unggah dokumen persyaratan seperti akta kelahiran, kartu keluarga, foto, dan KTP orang tua.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
            ),
            tag: 'Langkah Ketiga',
        },
        {
            step: '4',
            title: 'Pengumuman',
            desc: 'Pantau status pendaftaran dan hasil seleksi melalui halaman pengumuman di akun Anda.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 1 8.835-2.535m0 0A23.74 23.74 0 0 1 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
                </svg>
            ),
            tag: 'Langkah Keempat',
        },
    ];

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Animasi individual fade-up
            const fadeUpElements = gsap.utils.toArray('.gsap-fade-up');
            fadeUpElements.forEach((el) => {
                gsap.set(el, { y: 60, opacity: 0 });
                gsap.to(el, {
                    y: 0,
                    opacity: 1,
                    duration: 1.5,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play reverse play reverse'
                    }
                });
            });

            // Animasi individual fade-up (langsung muncul on load)
            const fadeUpOnloadElements = gsap.utils.toArray('.gsap-fade-up-onload');
            fadeUpOnloadElements.forEach((el) => {
                gsap.set(el, { y: 60, opacity: 0 });
                gsap.to(el, {
                    y: 0,
                    opacity: 1,
                    duration: 1.5,
                    ease: 'power3.out'
                });
            });

            // ============ ANIMASI HERO IMAGE ON-LOAD ============
            // Desktop: zoom-in + fade saat halaman load, lalu float kontinyu
            const heroImgDesktop = document.querySelector('.hero-img-desktop');
            if (heroImgDesktop) {
                // Set initial state: zoom out sedikit + invisible
                gsap.set(heroImgDesktop, { scale: 1.18, opacity: 0, x: 20 });

                // Timeline: fade + zoom in saat load
                gsap.timeline()
                    .to(heroImgDesktop, {
                        scale: 1.05,
                        opacity: 1,
                        x: 0,
                        duration: 1.6,
                        ease: 'power3.out',
                        delay: 0.2
                    })
                    // Setelah masuk, mulai float halus naik-turun + geser sedikit (infinite)
                    .to(heroImgDesktop, {
                        y: -12,
                        scale: 1.08,
                        duration: 5,
                        ease: 'sine.inOut',
                        repeat: -1,
                        yoyo: true
                    });
            }

            // Mobile: zoom-in + slide dari bawah saat load, lalu float kontinyu
            const heroImgMobile = document.querySelector('.hero-img-mobile');
            if (heroImgMobile) {
                // Set initial state: geser ke bawah + invisible
                gsap.set(heroImgMobile, { scale: 1.15, opacity: 0, y: 30 });

                // Timeline: fade + slide up saat load
                gsap.timeline()
                    .to(heroImgMobile, {
                        scale: 1.05,
                        opacity: 1,
                        y: 0,
                        duration: 1.4,
                        ease: 'power3.out',
                        delay: 0.5
                    })
                    // Float naik-turun halus (infinite)
                    .to(heroImgMobile, {
                        y: -10,
                        scale: 1.07,
                        duration: 4.5,
                        ease: 'sine.inOut',
                        repeat: -1,
                        yoyo: true
                    });
            }

            // Animasi stagger untuk grup elemen (seperti cards)
            const staggerContainers = gsap.utils.toArray('.gsap-stagger-container');
            staggerContainers.forEach((container) => {
                const items = container.querySelectorAll('.gsap-stagger-item');
                gsap.set(items, { y: 60, opacity: 0 });
                gsap.to(items, {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.25,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: container,
                        start: 'top 85%',
                        toggleActions: 'play reverse play reverse'
                    }
                });
            });

            // Animasi stagger (langsung muncul on load)
            const staggerOnloadContainers = gsap.utils.toArray('.gsap-stagger-container-onload');
            staggerOnloadContainers.forEach((container) => {
                const items = container.querySelectorAll('.gsap-stagger-item');
                gsap.set(items, { y: 60, opacity: 0 });
                gsap.to(items, {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.25,
                    ease: 'power3.out'
                });
            });

            // ============ ANIMASI IGNITEPAD-STYLE UNTUK ALUR PENDAFTARAN ============
            const stepsSection = document.querySelector('.steps-ignitepad-section');
            if (stepsSection) {
                // 1. Animasi heading & subheading: fade up bertahap
                const headingEl = stepsSection.querySelector('.steps-heading');
                const subheadingEl = stepsSection.querySelector('.steps-subheading');
                const dividerEl = stepsSection.querySelector('.steps-divider');

                if (headingEl) {
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: stepsSection,
                            start: 'top 80%',
                            toggleActions: 'play reverse play reverse'
                        }
                    });
                    tl.fromTo(subheadingEl, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
                      .fromTo(headingEl, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.3')
                      .fromTo(dividerEl, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2');
                }

                // 2. Animasi kartu step: stagger fade-up + scale dari bawah
                const stepCards = stepsSection.querySelectorAll('.step-card-ignitepad');
                if (stepCards.length > 0) {
                    gsap.set(stepCards, { y: 50, opacity: 0, scale: 0.95 });
                    gsap.to(stepCards, {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.7,
                        stagger: 0.15,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: stepsSection.querySelector('.steps-cards-grid'),
                            start: 'top 82%',
                            toggleActions: 'play reverse play reverse'
                        }
                    });
                }

                // 3. Animasi badge nomor: pop-in dengan elastic scale setelah kartu muncul
                const stepBadges = stepsSection.querySelectorAll('.step-badge-pop');
                if (stepBadges.length > 0) {
                    gsap.set(stepBadges, { scale: 0, opacity: 0 });
                    gsap.to(stepBadges, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.6,
                        stagger: 0.15,
                        ease: 'back.out(1.7)',
                        delay: 0.4,
                        scrollTrigger: {
                            trigger: stepsSection.querySelector('.steps-cards-grid'),
                            start: 'top 82%',
                            toggleActions: 'play reverse play reverse'
                        }
                    });
                }

                // 4. Animasi icon di dalam badge: fade + rotate setelah badge muncul
                const stepIcons = stepsSection.querySelectorAll('.step-icon-anim');
                if (stepIcons.length > 0) {
                    gsap.set(stepIcons, { rotation: -20, opacity: 0 });
                    gsap.to(stepIcons, {
                        rotation: 0,
                        opacity: 1,
                        duration: 0.5,
                        stagger: 0.15,
                        ease: 'power2.out',
                        delay: 0.7,
                        scrollTrigger: {
                            trigger: stepsSection.querySelector('.steps-cards-grid'),
                            start: 'top 82%',
                            toggleActions: 'play reverse play reverse'
                        }
                    });
                }

                // 5. Animasi garis konektor: tumbuh dari kiri ke kanan
                const connectors = stepsSection.querySelectorAll('.step-connector-line');
                if (connectors.length > 0) {
                    gsap.set(connectors, { scaleX: 0, transformOrigin: 'left center' });
                    gsap.to(connectors, {
                        scaleX: 1,
                        duration: 0.6,
                        stagger: 0.15,
                        ease: 'power2.inOut',
                        delay: 0.55,
                        scrollTrigger: {
                            trigger: stepsSection.querySelector('.steps-cards-grid'),
                            start: 'top 82%',
                            toggleActions: 'play reverse play reverse'
                        }
                    });
                }
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <GuestInfoLayout auth={auth} title="Beranda">

            {/* ============ HERO SECTION ============ */}
            <section className="relative overflow-hidden z-10" style={{ borderBottom: '1px solid rgba(0,51,51,0.06)', background: '#003333' }}>

                {/* Background Image — desktop only (absolute right side) */}
                <div className="hidden lg:block absolute inset-y-0 right-0 w-[65%] z-0 overflow-hidden">
                    <img
                        src="/images/hero-bg.jpg"
                        alt="MI Nurussalam Sidogede"
                        className="hero-img-desktop w-full h-full object-cover object-center"
                        style={{ transformOrigin: 'center center' }}
                    />
                    {/* Desktop gradient overlay — fade dari kiri */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(to right, #003333 0%, rgba(0,51,51,0.7) 35%, rgba(0,51,51,0.1) 70%, transparent 100%)',
                        }}
                    />
                </div>

                <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Mobile: grid 2 baris (teks atas, gambar bawah) | Desktop: 2 kolom */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 items-center lg:min-h-[480px]">

                        {/* Kolom Kiri: Text Content */}
                        <div className="space-y-6 text-center lg:text-left pt-10 pb-8 lg:pt-16 lg:pb-16 gsap-fade-up-onload">
                             {/* Badge */}
                             <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold" style={{ border: '1px solid rgba(153,204,51,0.4)', background: 'rgba(153,204,51,0.1)', color: '#99CC33' }}>
                                 <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ background: '#99CC33' }} />
                                 Pendaftaran Tahun Ajaran 2026/2027 Telah Dibuka
                             </span>

                             {/* Headline */}
                             <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
                                 Selamat Datang di SPMB<br className="hidden sm:block" />{' '}
                                 <span style={{ color: '#99CC33' }}>MI Nurussalam Sidogede</span>
                             </h1>

                             {/* Subtitle */}
                             <p className="text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
                                 Membentuk generasi cerdas, berakhlak mulia, islami, berwawasan luas, dan siap
                                 menyongsong masa depan yang cerah berlandaskan nilai-nilai Islam.
                             </p>

                             {/* CTA Buttons */}
                             <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                 {/* [BARU] Tombol disabled otomatis jika SPMB ditutup admin */}
                                 <Link
                                     href={spmbTutup ? '#' : route('register')}
                                     onClick={spmbTutup ? (e) => e.preventDefault() : undefined}
                                     className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold shadow-lg transition-all"
                                     style={spmbTutup ? {
                                         background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                         color: '#fff',
                                         pointerEvents: 'none',
                                         cursor: 'not-allowed',
                                         opacity: 0.85,
                                         boxShadow: '0 6px 20px rgba(220,38,38,0.3)',
                                     } : {
                                         background: '#99CC33',
                                         color: '#003333',
                                         boxShadow: '0 10px 25px rgba(0,51,51,0.35)',
                                     }}
                                 >
                                     {spmbTutup ? '🔒 Pendaftaran Ditutup' : 'Mulai Pendaftaran'}
                                     {!spmbTutup && (
                                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                                             <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                         </svg>
                                     )}
                                 </Link>
                                 <Link
                                     href="/profil-sekolah"
                                     className="inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-base font-bold transition-all"
                                     style={{ border: '2px solid rgba(255,255,255,0.4)', color: '#ffffff', background: 'rgba(255,255,255,0.08)' }}
                                 >
                                     Pelajari Profil
                                 </Link>
                             </div>
                        </div>

                        {/* Kolom Kanan: Gambar — tampil di mobile sebagai blok bawah, desktop sebagai spacer (gambar di absolute bg) */}
                        <div className="lg:hidden relative w-full overflow-hidden" style={{ height: '280px' }}>
                            <img
                                src="/images/hero-bg.jpg"
                                alt="Siswa MI Nurussalam Sidogede"
                                className="hero-img-mobile w-full h-full object-cover object-top"
                                style={{ borderRadius: '20px 20px 0 0', transformOrigin: 'center top' }}
                            />
                            {/* Gradient atas supaya menyatu dengan background section */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: 'linear-gradient(to bottom, #003333 0%, transparent 25%, transparent 75%, #003333 100%)',
                                    borderRadius: '20px 20px 0 0'
                                }}
                            />
                            {/* Subtle left/right fade */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: 'linear-gradient(to right, rgba(0,51,51,0.4) 0%, transparent 20%, transparent 80%, rgba(0,51,51,0.4) 100%)',
                                    borderRadius: '20px 20px 0 0'
                                }}
                            />
                        </div>

                        {/* Desktop spacer — gambar dari absolute bg di kanan */}
                        <div className="hidden lg:block h-full min-h-[480px]" />
                    </div>
                </div>
            </section>

            {/* ============ INFO & GELOMBANG SECTION ============ */}
            <section className="py-12 relative" style={{ background: 'rgba(240,248,235,0.55)', borderBottom: '1px solid rgba(0,51,51,0.06)' }}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                     {/* ============ FEATURE CARDS STRIP ============ */}
                     <div className="pb-4 gsap-stagger-container-onload">
                         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 backdrop-blur-md rounded-2xl shadow-lg p-5" style={{ background: 'rgba(0,51,51,0.92)', border: '1px solid rgba(153,204,51,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                             {features.map((f, i) => (
                                 <div key={i} className="flex items-start gap-3 gsap-stagger-item">
                                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: 'rgba(153,204,51,0.1)', border: '1px solid rgba(153,204,51,0.2)', color: '#99CC33' }}>
                                         {f.icon}
                                     </div>
                                     <div>
                                         <p className="text-sm font-extrabold" style={{ color: '#99CC33' }}>{f.title}</p>
                                         <p className="text-xs mt-0.5 leading-snug" style={{ color: 'rgba(255,255,255,0.7)' }}>{f.desc}</p>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>

                     {/* ============ GELOMBANG PENDAFTARAN ============ */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 gsap-stagger-container">
                         {gelombangData.map((g, idx) => {
                             const isActive = g.statusObj.isActive;
                             const dateText = (g.start && g.end) ? `${formatDate(g.start)} — ${formatDate(g.end)}` : g.fallbackDate;

                             if (isActive) {
                                 return (
                                     <div key={idx} className="relative rounded-2xl p-7 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-center overflow-hidden gsap-stagger-item" style={{ background: 'linear-gradient(135deg, rgba(60,40,0,0.95) 0%, rgba(40,30,0,0.95) 100%)', border: '2px solid rgba(245,158,11,0.5)', boxShadow: '0 0 30px rgba(245,158,11,0.2)' }}>
                                         <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-t-2xl" />
                                         <div className="absolute top-4 right-4">
                                             <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                                                 <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                                                 OPEN
                                             </span>
                                         </div>
                                         <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 shadow-lg shadow-amber-500/25">
                                             <span className="text-white font-black text-lg">{g.id}</span>
                                         </div>
                                         <h3 className="text-lg font-extrabold text-white mb-1">{g.name}</h3>
                                         <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 animate-pulse">{g.statusObj.label}</p>
                                         <div className="rounded-xl p-3 text-sm font-semibold" style={{ background: 'rgba(40,25,0,0.7)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }}>
                                             {dateText}
                                         </div>
                                     </div>
                                 );
                             }

                             return (
                                 <div key={idx} className="relative rounded-2xl p-7 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center overflow-hidden gsap-stagger-item" style={{ background: '#003333', border: '2px solid rgba(153,204,51,0.25)' }}>
                                     <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-2xl" style={{ background: g.gradient }} />
                                     <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl shadow-lg" style={{ background: 'rgba(153,204,51,0.1)', border: '1px solid rgba(153,204,51,0.2)' }}>
                                         <span className="font-black text-lg" style={{ color: '#99CC33' }}>{g.id}</span>
                                     </div>
                                     <h3 className="text-lg font-extrabold text-white mb-1">{g.name}</h3>
                                     <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>{g.statusObj.label}</p>
                                     <div className="rounded-xl p-3 text-sm font-semibold" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(153,204,51,0.15)', color: 'rgba(255,255,255,0.7)' }}>
                                         {dateText}
                                     </div>
                                 </div>
                             );
                         })}
                     </div>
                </div>
            </section>
 
 
             {/* ============ ALUR PENDAFTARAN — IGNITEPAD STYLE ============ */}
             <section className="py-20 steps-ignitepad-section relative overflow-hidden" style={{ background: 'rgba(240,248,235,0.5)' }}>
                 <DotGrid
                     dotSize={6}
                     gap={25}
                     baseColor="#e2e8f0"
                     activeColor="#99CC33"
                     proximity={120}
                     shockRadius={250}
                     shockStrength={5}
                     resistance={750}
                     returnDuration={1.5}
                 />
                 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

                     {/* Header */}
                     <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
                         <p className="steps-subheading text-xs font-bold uppercase tracking-widest" style={{ color: '#99CC33', letterSpacing: '0.2em' }}>Panduan Pendaftaran</p>
                         <h2 className="steps-heading text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: '#003333' }}>
                             Alur Pendaftaran Online
                         </h2>
                         <div className="steps-divider h-1 w-16 rounded-full mx-auto" style={{ background: 'linear-gradient(to right, #99CC33, #008855)', transformOrigin: 'center' }} />
                         <p className="text-sm mt-2" style={{ color: 'rgba(0,51,51,0.65)' }}>
                             Ikuti empat langkah mudah berikut untuk menyelesaikan pendaftaran Anda.
                         </p>
                     </div>

                     {/* Cards Grid */}
                     <div className="steps-cards-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                         {/* Garis konektor horizontal (hanya tampil di lg) */}
                         <div className="hidden lg:flex absolute top-[92px] left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] items-center justify-between z-0 pointer-events-none">
                             {[0,1,2].map(i => (
                                 <div key={i} className="flex-1 flex items-center justify-center px-2">
                                     <div
                                         className="step-connector-line h-0.5 w-full"
                                         style={{ background: 'linear-gradient(to right, rgba(153,204,51,0.6), rgba(0,136,85,0.6))' }}
                                     />
                                     <div className="shrink-0 ml-1 text-[#99CC33] opacity-70">
                                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4">
                                             <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                         </svg>
                                     </div>
                                 </div>
                             ))}
                         </div>

                         {steps.map((item, i) => (
                             <div
                                 key={i}
                                 className="step-card-ignitepad relative z-10 rounded-2xl p-6 text-center group"
                                 style={{
                                     background: '#003333',
                                     border: '1px solid rgba(153,204,51,0.2)',
                                     boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                     transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease'
                                 }}
                                 onMouseEnter={e => {
                                     e.currentTarget.style.transform = 'translateY(-8px)';
                                     e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(153,204,51,0.4)';
                                     e.currentTarget.style.borderColor = 'rgba(153,204,51,0.5)';
                                 }}
                                 onMouseLeave={e => {
                                     e.currentTarget.style.transform = 'translateY(0)';
                                     e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                                     e.currentTarget.style.borderColor = 'rgba(153,204,51,0.2)';
                                 }}
                             >
                                 {/* Tag label */}
                                 <div className="mb-4">
                                     <span
                                         className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                                         style={{ background: 'rgba(153,204,51,0.12)', color: '#99CC33', border: '1px solid rgba(153,204,51,0.25)' }}
                                     >
                                         {item.tag}
                                     </span>
                                 </div>

                                 {/* Badge nomor dengan icon */}
                                 <div className="step-badge-pop mx-auto mb-5 relative flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(135deg, #aade44, #99CC33)', boxShadow: '0 10px 25px rgba(153,204,51,0.35)' }}>
                                     {/* Nomor (hilang saat hover, icon muncul) */}
                                     <span className="text-[#003333] text-xl font-black transition-all duration-300 group-hover:opacity-0 group-hover:scale-0 absolute">
                                         {item.step}
                                     </span>
                                     {/* Icon (muncul saat hover) */}
                                     <span className="step-icon-anim text-[#003333] transition-all duration-300 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 absolute">
                                         {item.icon}
                                     </span>
                                 </div>

                                 {/* Konten */}
                                 <h3 className="text-base font-extrabold text-white mb-2 tracking-tight">{item.title}</h3>
                                 <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{item.desc}</p>

                                 {/* Bottom accent line */}
                                 <div
                                     className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl"
                                     style={{ background: 'linear-gradient(to right, transparent, rgba(153,204,51,0.5), transparent)' }}
                                 />
                             </div>
                         ))}
                     </div>

                     {/* Bottom CTA hint */}
                     <div className="mt-10 text-center">
                         <p className="text-sm" style={{ color: 'rgba(0,51,51,0.55)' }}>
                             Butuh bantuan?{' '}
                             <a href="/kontak" className="font-semibold underline underline-offset-2" style={{ color: '#003333' }}>Hubungi kami</a>
                         </p>
                     </div>
                 </div>
             </section>
 
             {/* ============ CTA SECTION ============ */}
             <section className="py-16" style={{ background: 'rgba(240,248,235,0.5)' }}>
                 <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                     <div className="rounded-3xl p-10 text-center shadow-2xl gsap-fade-up" style={{ background: 'linear-gradient(135deg, #003333 0%, #002222 100%)', border: '1px solid rgba(153,204,51,0.3)', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}>
                         <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Siap Bergabung Bersama Kami?</h2>
                         <p className="mb-8 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.8)' }}>
                             Jangan lewatkan kesempatan untuk mendaftarkan putra-putri Anda di MI Nurussalam Sidogede. Pendaftaran terbatas!
                         </p>
                         <div className="flex flex-wrap items-center justify-center gap-4">
                             {spmbTutup ? (
                                 <span
                                     className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold shadow-xl transition-all"
                                     style={{
                                         background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                         color: '#fff',
                                         pointerEvents: 'none',
                                         cursor: 'not-allowed',
                                         opacity: 0.9,
                                     }}
                                 >
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                                         <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                     </svg>
                                     Pendaftaran Ditutup
                                 </span>
                             ) : (
                                 <Link
                                     href={route('register')}
                                     className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold shadow-xl transition-all hover:opacity-90 transform hover:-translate-y-0.5"
                                     style={{ background: '#99CC33', color: '#003333' }}
                                 >
                                     Daftar Sekarang
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                                         <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                     </svg>
                                 </Link>
                             )}
                             <Link
                                 href="/kontak"
                                 className="inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-base font-bold transition-all"
                                 style={{ border: '2px solid rgba(153,204,51,0.4)', color: '#99CC33' }}
                             >
                                 Hubungi Kami
                             </Link>
                         </div>
                     </div>
                 </div>
             </section>

        </GuestInfoLayout>
    );
}
