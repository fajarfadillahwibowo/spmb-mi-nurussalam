import GuestInfoLayout from '@/Layouts/GuestInfoLayout';
import { Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import Particles from '@/Components/Particles';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);



export default function ProfilSekolah({ auth, spmbSettings }) {
    const spmbTutup = spmbSettings?.status === 'tutup';
    const [showMckModal, setShowMckModal] = useState(false);
    const [showAsriModal, setShowAsriModal] = useState(false);
    const [showKelasModal, setShowKelasModal] = useState(false);
    const [showKomputerModal, setShowKomputerModal] = useState(false);
    const [showMasjidModal, setShowMasjidModal] = useState(false);
    const [showLapanganModal, setShowLapanganModal] = useState(false);
    const [showUksModal, setShowUksModal] = useState(false);
    const [showPerpustakaanModal, setShowPerpustakaanModal] = useState(false);

    // ===== FACILITIES SHOWCASE STATE =====
    const facilitiesList = [
        {
            id: 'kelas',
            icon: '🏫',
            title: 'Ruang Kelas Nyaman',
            img: '/images/kelas1.jpg',
            desc: 'Ruang kelas yang luas, bersih, dan berventilasi baik dengan perlengkapan belajar memadai untuk menunjang proses pembelajaran yang kondusif, interaktif, dan menyenangkan bagi siswa.',
        },
        {
            id: 'masjid',
            icon: '🕌',
            title: 'Masjid Madrasah',
            img: '/images/masjid1.jpg',
            desc: 'Masjid yang representatif sebagai pusat ibadah dan kegiatan keagamaan siswa, termasuk shalat berjamaah, tadarus Al-Qur\'an, dan pembinaan rohani sehari-hari.',
        },
        {
            id: 'perpustakaan',
            icon: '📚',
            title: 'Perpustakaan',
            img: '/images/perpustakaan1.jpg',
            desc: 'Koleksi buku pelajaran, buku cerita islami, ensiklopedia anak, dan bahan bacaan edukatif lainnya yang terus diperbarui, didukung sistem administrasi digital modern.',
        },
        {
            id: 'komputer',
            icon: '💻',
            title: 'Ruang Komputer',
            img: '/images/computer_room1.png',
            desc: 'Laboratorium komputer yang dilengkapi perangkat modern untuk menunjang pembelajaran teknologi informasi dan meningkatkan literasi digital siswa sejak dini.',
        },
        {
            id: 'uks',
            icon: '🏥',
            title: 'Ruang Kesehatan (UKS)',
            img: '/images/uks1.jpg',
            desc: 'Fasilitas kesehatan sekolah yang dilengkapi obat-obatan dasar, peralatan P3K, dan tempat istirahat untuk penanganan awal kesehatan siswa selama jam sekolah.',
        },
        {
            id: 'lapangan',
            icon: '⚽',
            title: 'Lapangan Olahraga',
            img: '/images/lapangan1.jpg',
            desc: 'Area lapangan luas untuk kegiatan olahraga rutin, senam pagi bersama, upacara bendera, dan berbagai kegiatan ekstrakurikuler siswa yang aktif dan menyenangkan.',
        },
        {
            id: 'mck',
            icon: '🚿',
            title: 'MCK / Toilet Sehat',
            img: '/images/fasilitas_mck.jpg',
            desc: 'Fasilitas sanitasi yang bersih, terawat, dan memadai untuk menjaga kebersihan serta kenyamanan seluruh siswa dan tenaga pendidik di lingkungan madrasah.',
        },
        {
            id: 'asri',
            icon: '🌳',
            title: 'Lingkungan Hijau & Asri',
            img: '/images/asri1.jpg',
            desc: 'Halaman madrasah yang rindang dan asri, menciptakan suasana belajar yang sejuk, nyaman, dan menyenangkan bagi seluruh warga madrasah setiap harinya.',
        },
    ];
    const [activeFacilityId, setActiveFacilityId] = useState(facilitiesList[0].id);
    const showcaseRef = useRef(null);

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
                    // Set initial state directly to avoid flash/React strict mode issues
                    gsap.set(el, { ...vars, opacity: 0 });
                    gsap.to(el, {
                        x: 0, y: 0, opacity: 1, duration: 1.5, ease: 'power3.out',
                        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play reverse play reverse' }
                    });
                });
            });

            // Animations immediately on load (without scrollTrigger) for above the fold content
            const onloadAnimations = [
                { class: '.gsap-fade-right-onload', vars: { x: -60 } },
                { class: '.gsap-fade-left-onload', vars: { x: 60 } },
            ];

            onloadAnimations.forEach(({ class: className, vars }) => {
                gsap.utils.toArray(className).forEach((el) => {
                    gsap.set(el, { ...vars, opacity: 0 });
                    gsap.to(el, {
                        x: 0, y: 0, opacity: 1, duration: 1.5, ease: 'power3.out'
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

    // ===== GSAP: Animasi crossfade saat berganti tab fasilitas =====
    useEffect(() => {
        if (!showcaseRef.current) return;
        gsap.fromTo(
            showcaseRef.current,
            { opacity: 0, y: 24, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' }
        );
    }, [activeFacilityId]);

    return (
        <GuestInfoLayout auth={auth} title="Profil Sekolah">
            {/* ======== HEADER — dengan WebGL Particle Background ======== */}
            <section className="relative overflow-hidden py-16 lg:py-24" style={{ background: 'linear-gradient(135deg, #001a1a 0%, #002b2b 60%, #003d1a 100%)' }}>
                {/* WebGL Particles background — full absolute cover */}
                <div className="absolute inset-0 z-0">
                    <Particles
                        particleColors={['#99CC33', '#66AA00', '#ccff66', '#ffffff']}
                        particleCount={600}
                        particleSpread={12}
                        speed={0.08}
                        particleBaseSize={80}
                        moveParticlesOnHover={true}
                        particleHoverFactor={1.5}
                        alphaParticles={true}
                        sizeRandomness={1.2}
                        cameraDistance={22}
                        disableRotation={false}
                        pixelRatio={window.devicePixelRatio || 1}
                    />
                </div>

                {/* Subtle dark overlay so text remains readable */}
                <div className="absolute inset-0 z-[1] pointer-events-none"
                    style={{ background: 'linear-gradient(180deg, rgba(0,26,26,0.45) 0%, rgba(0,26,26,0.25) 50%, rgba(0,26,26,0.6) 100%)' }} />

                {/* Konten di atas canvas */}
                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 max-w-3xl mx-auto mb-16 gsap-fade-down">
                        <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#99CC33' }}>Profil Madrasah</h2>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                            MI Nurussalam Sidogede
                        </h1>
                        <div className="h-1 w-20 rounded-full mx-auto" style={{ background: '#99CC33' }} />
                        <p className="text-lg font-medium" style={{ color: 'rgba(200,240,200,0.8)' }}>
                            Madrasah Ibtidaiyah berciri khas Islam yang berkomitmen mencetak generasi islami, berakhlak mulia, dan berprestasi.
                        </p>
                        {/* Hint interaksi */}
                        <p className="text-xs animate-pulse select-none pt-1" style={{ color: 'rgba(153,204,51,0.55)' }}>
                            ✦ Gerakkan mouse di atas partikel untuk berinteraksi
                        </p>
                    </div>

                    {/* Tentang Madrasah */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div className="grid grid-cols-1 gap-6 gsap-fade-right-onload">
                            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                                <img src="/images/gedung1.jpg" alt="Gedung MI Nurussalam" className="w-full object-contain hover:scale-102 transition-transform duration-300" />
                            </div>
                            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                                <img src="/images/foto_bersama.jpg" alt="Foto Bersama MI Nurussalam" className="w-full h-56 object-cover hover:scale-102 transition-transform duration-300" />
                            </div>
                        </div>
                        <div className="space-y-6 gsap-fade-left-onload">
                            <h3 className="text-2xl font-extrabold text-white">
                                Tentang <span style={{ color: '#99CC33' }}>MI Nurussalam Sidogede</span>
                            </h3>
                            <p className="text-white/80 leading-relaxed font-medium">
                                Madrasah Ibtidaiyah (MI) Nurussalam Sidogede merupakan lembaga pendidikan dasar Islam yang berlokasi di Desa Sidogede, RT 02 RW 01, Kecamatan Belitang, Kabupaten OKU Timur, Provinsi Sumatera Selatan. Madrasah ini hadir dengan semangat menyebarkan cahaya ilmu pengetahuan dan keagamaan bagi anak-anak di lingkungan sekitar.
                            </p>
                            <p className="text-white/80 leading-relaxed font-medium">
                                Sejak berdiri, MI Nurussalam berkomitmen menyelenggarakan pendidikan dasar berciri khas <em className="text-[#99CC33]">Islam Ahlussunnah wal Jama'ah</em>. Madrasah ini berfokus menyeimbangkan kecakapan akademik, pembinaan adab santun, hafalan Al-Qur'an (tahfidz), dan penguasaan dasar keagamaan sebagai bekal pokok akhlak anak didik.
                            </p>
                            <p className="text-white/80 leading-relaxed font-medium">
                                Madrasah ini berada di tengah-tengah lingkungan pesantren modern yang bernuansa religi dengan seluruh pembelajaran bernafaskan nilai-nilai keagamaan seperti pembiasaan ibadah harian, kajian adab santun, dan pembacaan do'a bersama dinamis selaras dengan perkembangan teknologi informasi modern, menghadirkan inovasi metode belajar interaktif, serta responsif terhadap kebutuhan peserta didik masa kini dan menyenangkan proses pembelajaran dikemas secara kreatif melalui pendekatan yang suportif dan ramah anak, sehingga setiap siswa terdorong untuk mengeksplorasi potensi terbaiknya tanpa rasa tertekan dan meraih prestasi secara mandiri.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Konten utama profil sekolah */}
            <section className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Kepala Sekolah */}
                    <div className="rounded-3xl backdrop-blur-sm p-8 lg:p-10 mb-20 gsap-fade-up" style={{ background: '#003333' }}>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-3 flex justify-center">
                                <div className="w-48 h-64 rounded-2xl overflow-hidden border-2 border-[#99CC33]/30 dark:border-emerald-800 shadow-md">
                                    <img
                                        src="/images/kepala_sekolah.jpg"
                                        alt="Foto Kepala Sekolah"
                                        className="w-full h-full object-cover object-top"
                                        style={{ imageRendering: 'auto', WebkitFontSmoothing: 'antialiased' }}
                                        loading="eager"
                                    />
                                </div>
                            </div>
                            <div className="lg:col-span-9 space-y-4">
                                <div className="inline-flex items-center gap-2 rounded-full bg-[#99CC33]/15 dark:bg-emerald-950/60 px-3.5 py-1 text-xs font-bold text-[#99CC33] dark:text-emerald-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-3.5 w-3.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                    Kepala Madrasah
                                </div>
                                <h3 className="text-2xl font-extrabold text-white">
                                    Bapak Umar S.pd.
                                </h3>
                                <p className="text-white/70 dark:text-slate-400 leading-relaxed">
                                    Sebagai Kepala Madrasah, Bapak Umar S.pd. memimpin MI Nurussalam Sidogede dengan visi kuat untuk menciptakan lingkungan pendidikan yang islami, inovatif, dan berdaya saing. Beliau senantiasa mendorong seluruh civitas akademika untuk terus meningkatkan kualitas pembelajaran dan pelayanan pendidikan.
                                </p>
                                <blockquote className="border-l-4 border-[#99CC33] pl-4 italic text-white/60 dark:text-slate-400 text-sm">
                                    "Kami berkomitmen menjadikan MI Nurussalam sebagai madrasah yang unggul, menghasilkan lulusan berakhlak mulia yang mampu bersaing di era global tanpa meninggalkan nilai-nilai keislaman."
                                </blockquote>
                            </div>
                        </div>
                    </div>

                    {/* Identitas Madrasah */}
                    <div className="mb-20">
                        <div className="text-center space-y-4 max-w-2xl mx-auto mb-10 gsap-fade-down">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-[#99CC33] dark:text-emerald-400">Data Madrasah</h2>
                            <p className="text-2xl font-extrabold text-[#003333]">Identitas Resmi</p>
                        </div>
                        <div className="rounded-3xl backdrop-blur-sm overflow-hidden gsap-stagger-container" style={{ background: '#003333' }}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#99CC33]/20 dark:divide-emerald-900/30">
                                {[
                                    { label: 'Nama Madrasah', value: 'MI Nurussalam' },
                                    { label: 'Status', value: 'Swasta' },
                                    { label: 'Jenjang', value: 'Madrasah Ibtidaiyah (SD/MI)' },
                                    { label: 'Akreditasi', value: 'Terakreditasi B' },
                                    { label: 'Kurikulum', value: 'Merdeka berbasis cinta' },
                                    { label: 'Kepala Madrasah', value: 'Bapak Umar S.pd.' },
                                    { label: 'Alamat', value: 'Desa Sidogede, RT 02 RW 01' },
                                    { label: 'Kecamatan', value: 'Belitang' },
                                    { label: 'Kabupaten', value: 'OKU Timur' },
                                    { label: 'Provinsi', value: 'Sumatera Selatan' },
                                ].map((item, i) => (
                                    <div key={i} className="p-5 flex flex-col gsap-stagger-item">
                                        <span className="text-xs font-bold uppercase tracking-widest text-[#99CC33] dark:text-emerald-400 mb-1">{item.label}</span>
                                        <span className="text-sm font-bold text-white/90 dark:text-slate-200">{item.value}</span>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Fasilitas Unggulan — INTERACTIVE SHOWCASE EXPLORER */}
                    <div className="mb-20">
                        <div className="text-center space-y-4 max-w-2xl mx-auto mb-12 gsap-fade-down">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-[#99CC33]">Sarana & Prasarana</h2>
                            <p className="text-3xl font-extrabold text-[#003333] tracking-tight">Fasilitas Unggulan Madrasah</p>
                            <div className="h-1 w-20 bg-[#99CC33] rounded-full mx-auto" />
                            <p className="text-sm text-[#003333]/60 max-w-md mx-auto">
                                Klik menu fasilitas di bawah ini untuk melihat pratinjau foto dan detail sarana prasarana kami.
                            </p>
                        </div>

                        {/* Showcase Container */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start gsap-stagger-container">
                            {/* Left/Top Column: Tabs Menu */}
                            <div className="lg:col-span-4 gsap-stagger-item">
                                {/* Scroll hint on mobile */}
                                <div className="flex items-center justify-between lg:hidden mb-2 px-1 text-xs text-[#003333]/50">
                                    <span>Geser menu ke samping ➔</span>
                                    <span>({facilitiesList.length} Fasilitas)</span>
                                </div>
                                <div 
                                    className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 snap-x scrollbar-thin scroll-smooth"
                                    style={{
                                        scrollbarWidth: 'none', /* Firefox */
                                        msOverflowStyle: 'none', /* IE/Edge */
                                    }}
                                >
                                    {/* Webkit scrollbar hider inline to make sure it hides on chrome/safari */}
                                    <style dangerouslySetInnerHTML={{__html: `
                                        .scrollbar-thin::-webkit-scrollbar { display: none; }
                                    `}} />

                                    {facilitiesList.map((item) => {
                                        const isActive = activeFacilityId === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => setActiveFacilityId(item.id)}
                                                className="flex items-center gap-3 px-5 py-4 rounded-2xl text-left transition-all duration-300 shrink-0 snap-align-start border text-sm font-bold w-auto lg:w-full group"
                                                style={{
                                                    background: isActive ? '#003333' : 'rgba(255,255,255,0.7)',
                                                    borderColor: isActive ? '#99CC33' : 'rgba(0,51,51,0.08)',
                                                    color: isActive ? '#ffffff' : '#003333',
                                                    boxShadow: isActive ? '0 10px 20px rgba(0,51,51,0.15)' : 'none',
                                                    transform: isActive ? 'translateX(4px)' : 'none'
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
                                                        className="hidden lg:block text-xs font-normal mt-0.5 opacity-60 truncate max-w-[200px]"
                                                        style={{ color: isActive ? 'rgba(255,255,255,0.7)' : '#003333' }}
                                                    >
                                                        {item.desc}
                                                    </span>
                                                </div>
                                                {/* Active arrow indicator on desktop only */}
                                                <span 
                                                    className="hidden lg:block transition-all duration-300"
                                                    style={{ 
                                                        opacity: isActive ? 1 : 0, 
                                                        transform: isActive ? 'translateX(0)' : 'translateX(-5px)',
                                                        color: '#99CC33'
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
                                {facilitiesList.map((item) => {
                                    if (item.id !== activeFacilityId) return null;
                                    return (
                                        <div 
                                            key={item.id}
                                            ref={showcaseRef}
                                            className="rounded-3xl border border-slate-200/80 bg-white shadow-xl overflow-hidden relative group"
                                            style={{ boxShadow: '0 20px 50px rgba(0,51,51,0.06)' }}
                                        >
                                            {/* Image container */}
                                            <div className="relative w-full h-[240px] sm:h-[400px] overflow-hidden bg-slate-900">
                                                <img 
                                                    src={item.img} 
                                                    alt={item.title} 
                                                    className="w-full h-full object-cover transition-transform duration-[8000ms] ease-out scale-100 group-hover:scale-105"
                                                    style={{ transformOrigin: 'center' }}
                                                />
                                                {/* Gradient overlay on image */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                                                
                                                {/* Floater icon + title */}
                                                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between z-10 text-white">
                                                    <span className="inline-flex items-center gap-2 bg-[#003333]/85 backdrop-blur-md border border-[#99CC33]/30 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase">
                                                        <span>{item.icon}</span> {item.title}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Details body */}
                                            <div className="p-6 sm:p-8 space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-[#99CC33] animate-ping" />
                                                    <span className="text-xs font-black uppercase tracking-widest text-[#99CC33]">Fasilitas Unggulan</span>
                                                </div>
                                                <h3 className="text-2xl font-black text-[#003333] tracking-tight">{item.title}</h3>
                                                <p className="text-sm sm:text-base leading-relaxed text-[#003333]/75">
                                                    {item.desc}
                                                </p>
                                                
                                                {/* Action Button */}
                                                <div className="pt-2 flex flex-wrap gap-4">
                                                    <button
                                                        onClick={() => {
                                                            if (item.id === 'kelas') setShowKelasModal(true);
                                                            if (item.id === 'mck') setShowMckModal(true);
                                                            if (item.id === 'asri') setShowAsriModal(true);
                                                            if (item.id === 'masjid') setShowMasjidModal(true);
                                                            if (item.id === 'lapangan') setShowLapanganModal(true);
                                                            if (item.id === 'komputer') setShowKomputerModal(true);
                                                            if (item.id === 'uks') setShowUksModal(true);
                                                            if (item.id === 'perpustakaan') setShowPerpustakaanModal(true);
                                                        }}
                                                        className="inline-flex items-center gap-2 bg-[#99CC33] text-[#003333] font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-[#99CC33]/25 hover:shadow-xl hover:shadow-[#99CC33]/35 hover:-translate-y-0.5 transition-all duration-300"
                                                    >
                                                        Lihat Galeri Foto & Keterangan Lengkap 🔍
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Dynamic bottom accent line */}
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#99CC33] to-[#008855]" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Modal Foto MCK / Toilet Sehat */}
                    <Modal show={showMckModal} onClose={() => setShowMckModal(false)} maxWidth="4xl">
                        <div className="p-6 space-y-6 bg-[#002828] dark:bg-slate-900 rounded-2xl">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🚿</span>
                                    <h3 className="text-lg font-bold text-white">MCK / Toilet Sehat</h3>
                                </div>
                                <button onClick={() => setShowMckModal(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-100/80 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex justify-center bg-slate-50 dark:bg-slate-950">
                                <img src="/images/fasilitas_mck.jpg" alt="MCK / Toilet Sehat MI Nurussalam" className="max-w-full h-auto max-h-[60vh] object-contain" />
                            </div>
                            <div className="rounded-2xl bg-[#99CC33]/10 p-4">
                                <p className="text-sm font-semibold text-emerald-100/80 leading-relaxed">MI Nurussalam Sidogede berkomitmen tinggi dalam menyediakan fasilitas sanitasi yang sehat dan layak bagi seluruh siswa dan guru. Toilet sehat ini dirancang bersih, terawat, berventilasi udara baik, dan dilengkapi dengan sarana air bersih yang memadai serta tempat cuci tangan khusus guna mendukung program PHBS di lingkungan madrasah.</p>
                            </div>
                        </div>
                    </Modal>

                    {/* Modal Foto Lingkungan Hijau & Asri */}
                    <Modal show={showAsriModal} onClose={() => setShowAsriModal(false)} maxWidth="4xl">
                        <div className="p-6 space-y-6 bg-[#002828] dark:bg-slate-900 rounded-2xl">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🌳</span>
                                    <h3 className="text-lg font-bold text-white">Lingkungan Hijau & Asri</h3>
                                </div>
                                <button onClick={() => setShowAsriModal(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-100/80 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex items-center justify-center bg-slate-50 dark:bg-slate-950 aspect-[4/3]">
                                    <img src="/images/asri1.jpg" alt="Lingkungan Hijau & Asri 1" className="w-full h-full object-cover" />
                                </div>
                                <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex items-center justify-center bg-slate-50 dark:bg-slate-950 aspect-[4/3]">
                                    <img src="/images/asri2.jpg" alt="Lingkungan Hijau & Asri 2" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="rounded-2xl bg-[#99CC33]/10 p-4">
                                <p className="text-sm font-semibold text-emerald-100/80 leading-relaxed">MI Nurussalam Sidogede menciptakan suasana belajar yang rindang, sejuk, dan asri dengan menata tanaman hias di sepanjang koridor kelas serta memelihara pepohonan rindang di sekitar halaman madrasah. Lingkungan hijau ini menjadi sarana edukasi bagi siswa untuk mencintai lingkungan dan menjaga kelestarian alam sejak usia dini.</p>
                            </div>
                        </div>
                    </Modal>

                        {/* Modal Foto Masjid Madrasah */}
                        <Modal show={showMasjidModal} onClose={() => setShowMasjidModal(false)} maxWidth="4xl">
                            <div className="p-6 space-y-6 bg-[#002828] dark:bg-slate-900 rounded-2xl">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🕌</span>
                                        <h3 className="text-lg font-bold text-white">
                                            Masjid Madrasah
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setShowMasjidModal(false)}
                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-100/80 dark:hover:bg-slate-850 dark:hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex items-center justify-center bg-slate-50 dark:bg-slate-950 aspect-[4/3]">
                                        <img src="/images/masjid1.jpg" alt="Masjid Madrasah 1" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex items-center justify-center bg-slate-50 dark:bg-slate-950 aspect-[4/3]">
                                        <img src="/images/masjid2.jpg" alt="Masjid Madrasah 2" className="w-full h-full object-cover" />
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-[#99CC33]/10 p-4 dark:bg-emerald-950/20 /50 ">
                                    <p className="text-sm font-semibold text-emerald-100/80 dark:text-emerald-300 leading-relaxed">
                                        Masjid MI Nurussalam Sidogede merupakan pusat kegiatan ibadah dan pembinaan rohani bagi seluruh warga madrasah. Di masjid ini, para siswa melaksanakan shalat berjamaah, tadarus Al-Qur'an, dan berbagai kegiatan keagamaan lainnya yang menjadi ciri khas pendidikan Islam di madrasah kami.
                                    </p>
                                </div>
                            </div>
                        </Modal>

                        {/* Modal Foto Ruang Komputer */}
                        <Modal show={showKomputerModal} onClose={() => setShowKomputerModal(false)} maxWidth="4xl">
                            <div className="p-6 space-y-6 bg-[#002828] dark:bg-slate-900 rounded-2xl">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">💻</span>
                                        <h3 className="text-lg font-bold text-white">
                                            Ruang Komputer
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setShowKomputerModal(false)}
                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-100/80 dark:hover:bg-slate-850 dark:hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex items-center justify-center bg-slate-50 dark:bg-slate-950 aspect-[4/3]">
                                        <img src="/images/computer_room1.png" alt="Ruang Komputer 1" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex items-center justify-center bg-slate-50 dark:bg-slate-950 aspect-[4/3]">
                                        <img src="/images/computer_room2.png" alt="Ruang Komputer 2" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-[#99CC33]/10 p-4 dark:bg-emerald-950/20 /50 ">
                                    <p className="text-sm font-semibold text-emerald-100/80 dark:text-emerald-300 leading-relaxed">
                                        Laboratorium komputer MI Nurussalam dilengkapi dengan perangkat modern, termasuk PC dengan spesifikasi tinggi, akses internet cepat, dan perangkat lunak pendidikan terkini, mendukung proses belajar mengajar serta pengembangan literasi digital siswa.
                                    </p>
                                </div>
                            </div>
                        </Modal>

                        {/* Modal Foto Lapangan Olahraga */}
                        <Modal show={showLapanganModal} onClose={() => setShowLapanganModal(false)} maxWidth="4xl">
                            <div className="p-6 space-y-6 bg-[#002828] dark:bg-slate-900 rounded-2xl">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">⚽</span>
                                        <h3 className="text-lg font-bold text-white">
                                            Lapangan Olahraga
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setShowLapanganModal(false)}
                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-100/80 dark:hover:bg-slate-850 dark:hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex justify-center bg-slate-50 dark:bg-slate-950">
                                    <img src="/images/lapangan1.jpg" alt="Lapangan Olahraga MI Nurussalam" className="max-w-full h-auto max-h-[60vh] object-contain" />
                                </div>

                                <div className="rounded-2xl bg-[#99CC33]/10 p-4 dark:bg-emerald-950/20 /50 ">
                                    <p className="text-sm font-semibold text-emerald-100/80 dark:text-emerald-300 leading-relaxed">
                                        Lapangan olahraga MI Nurussalam Sidogede merupakan area luas yang digunakan untuk berbagai kegiatan fisik siswa, termasuk olahraga rutin, senam pagi, upacara bendera, serta kegiatan ekstrakurikuler seperti sepak bola dan permainan tradisional. Lapangan ini menjadi sarana penting dalam membentuk karakter disiplin, sportivitas, dan kebugaran jasmani seluruh peserta didik.
                                    </p>
                                </div>
                            </div>
                        </Modal>

                        {/* Modal Foto Ruang Kelas Nyaman */}
                        <Modal show={showKelasModal} onClose={() => setShowKelasModal(false)} maxWidth="4xl">
                            <div className="p-6 space-y-6 bg-[#002828] dark:bg-slate-900 rounded-2xl">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🏫</span>
                                        <h3 className="text-lg font-bold text-white">
                                            Ruang Kelas Nyaman
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setShowKelasModal(false)}
                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-100/80 dark:hover:bg-slate-850 dark:hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex items-center justify-center bg-slate-50 dark:bg-slate-950 aspect-[4/3]">
                                        <img src="/images/kelas1.jpg" alt="Ruang Kelas 1" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex items-center justify-center bg-slate-50 dark:bg-slate-950 aspect-[4/3]">
                                        <img src="/images/kelas2.jpg" alt="Ruang Kelas 2" className="w-full h-full object-cover" />
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-[#99CC33]/10 p-4 dark:bg-emerald-950/20 /50 ">
                                    <p className="text-sm font-semibold text-emerald-100/80 dark:text-emerald-300 leading-relaxed">
                                        MI Nurussalam Sidogede menyediakan ruang kelas yang representatif, bersih, dan sejuk untuk menunjang kenyamanan belajar siswa. Setiap kelas ditata secara rapi dengan pencahayaan alami yang cukup serta sirkulasi udara yang baik agar tercipta suasana belajar mengajar yang kondusif, interaktif, dan penuh semangat.
                                    </p>
                                </div>
                            </div>
                        </Modal>

                        {/* Modal Foto Ruang Kesehatan (UKS) */}
                        <Modal show={showUksModal} onClose={() => setShowUksModal(false)} maxWidth="4xl">
                            <div className="p-6 space-y-6 bg-[#002828] dark:bg-slate-900 rounded-2xl">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🏥</span>
                                        <h3 className="text-lg font-bold text-white">
                                            Ruang Kesehatan (UKS)
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setShowUksModal(false)}
                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-100/80 dark:hover:bg-slate-850 dark:hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex items-center justify-center bg-slate-50 dark:bg-slate-950 aspect-[4/3]">
                                        <img src="/images/uks1.jpg" alt="Ruang Kesehatan (UKS) 1" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex items-center justify-center bg-slate-50 dark:bg-slate-950 aspect-[4/3]">
                                        <img src="/images/uks2.jpg" alt="Ruang Kesehatan (UKS) 2" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex items-center justify-center bg-slate-50 dark:bg-slate-950 aspect-[4/3]">
                                        <img src="/images/uks3.jpg" alt="Ruang Kesehatan (UKS) 3" className="w-full h-full object-cover" />
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-[#99CC33]/10 p-4 dark:bg-emerald-950/20 /50 ">
                                    <p className="text-sm font-semibold text-emerald-100/80 dark:text-emerald-300 leading-relaxed">
                                        Ruang Kesehatan (UKS) MI Nurussalam Sidogede hadir sebagai fasilitas pertolongan pertama bagi siswa yang membutuhkan penanganan kesehatan selama jam sekolah. Ruangan ini dilengkapi dengan tempat tidur pemeriksaan, obat-obatan dasar, peralatan P3K, serta ditangani oleh tenaga yang terlatih — memastikan setiap siswa mendapatkan perhatian dan perawatan awal dengan sigap, aman, dan penuh kasih sayang.
                                    </p>
                                </div>
                            </div>
                        </Modal>

                        {/* Modal Foto Perpustakaan */}
                        <Modal show={showPerpustakaanModal} onClose={() => setShowPerpustakaanModal(false)} maxWidth="4xl">
                            <div className="p-6 space-y-6 bg-[#002828] dark:bg-slate-900 rounded-2xl">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">📚</span>
                                        <h3 className="text-lg font-bold text-white">
                                            Perpustakaan Madrasah
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setShowPerpustakaanModal(false)}
                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-100/80 dark:hover:bg-slate-850 dark:hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 aspect-[4/3]">
                                        <img src="/images/perpustakaan1.jpg" alt="Koleksi Kitab & Buku Islami" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 aspect-[4/3]">
                                        <img src="/images/perpustakaan2.jpg" alt="Ruang Administrasi & Layanan Digital" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 aspect-[4/3]">
                                        <img src="/images/perpustakaan3.jpg" alt="Rak Buku & Ruang Baca" className="w-full h-full object-cover" />
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-[#99CC33]/10 p-5 dark:bg-emerald-950/20 /50  space-y-3">
                                    <p className="text-sm font-semibold text-slate-200 dark:text-emerald-300 leading-relaxed">
                                        Perpustakaan MI Nurussalam Sidogede dirancang sebagai pusat literasi dan cakrawala pengetahuan bagi para siswa dan tenaga pendidik. Fasilitas ini memiliki koleksi buku yang lengkap dan beragam, yang terbagi dalam beberapa area fungsional:
                                    </p>
                                    <ul className="text-sm text-emerald-100/70 dark:text-slate-400 list-disc pl-5 space-y-2">
                                        <li>
                                            <strong className="text-slate-850 dark:text-slate-200">Koleksi Kitab & Buku Islami (Foto 1):</strong> Rak-rak buku khusus yang berisi buku pelajaran, buku cerita islami, kitab keagamaan, serta ensiklopedia pendidikan anak yang disusun secara tematis untuk memudahkan siswa mendalami ilmu agama dan adab sejak dini.
                                        </li>
                                        <li>
                                            <strong className="text-slate-850 dark:text-slate-200">Meja Layanan & Administrasi Digital (Foto 2):</strong> Area administrasi perpustakaan yang modern dengan fasilitas komputer ganda. Sistem pencatatan digital ini membantu pustakawan dalam mengelola sirkulasi peminjaman buku serta pencarian katalog koleksi perpustakaan secara cepat dan tertib.
                                        </li>
                                        <li>
                                            <strong className="text-slate-850 dark:text-slate-200">Rak Buku Terbuka & Ruang Baca (Foto 3):</strong> Jajaran rak kayu kokoh berisi berbagai buku penunjang kurikulum sekolah, buku referensi umum, dan karya sastra anak. Ruangan ini dirancang agar bersih, terang, dan tenang guna memberikan kenyamanan maksimal bagi para siswa selama membaca dan belajar.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Modal>
                    </div>


                    {/* CTA */}
                    <div className="rounded-3xl p-10 text-center shadow-2xl gsap-fade-up" style={{ background: 'linear-gradient(135deg, #003333 0%, #002222 100%)', border: '1px solid rgba(153,204,51,0.3)' }}>
                        <h2 className="text-2xl font-extrabold text-white mb-3">Tertarik Bergabung?</h2>
                        <p className="mb-6 max-w-lg mx-auto" style={{ color: 'rgba(180,220,180,0.8)' }}>Daftarkan putra-putri Anda sekarang dan jadilah bagian dari keluarga besar MI Nurussalam Sidogede.</p>
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
                            <Link href={route('register')} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold shadow-xl transition-all transform hover:-translate-y-0.5" style={{ background: '#99CC33', color: '#003333' }}>
                                Daftar Sekarang
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </GuestInfoLayout>
    );
}
