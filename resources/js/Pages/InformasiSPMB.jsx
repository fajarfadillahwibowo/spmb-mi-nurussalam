import GuestInfoLayout from '@/Layouts/GuestInfoLayout';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DotGrid from '@/Components/DotGrid';

gsap.registerPlugin(ScrollTrigger);

// ─── Icon Components ──────────────────────────────────────────────────────────
const IconBook = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
);
const IconScale = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.589-1.202L18.75 4.97Zm-12.75 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.589-1.202L6 4.97Z" />
    </svg>
);
const IconCalendar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
);
const IconStar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.499Z" />
    </svg>
);
const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);
const IconInfo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
);
const IconDocument = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);
const IconArrow = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
);
const IconGlobe = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const timelineData = [
    {
        tahun: 'Langkah Pertama',
        fase: 'Buat Akun',
        desc: 'Daftarkan akun baru dengan email aktif Anda, lalu verifikasi melalui email yang dikirimkan.',
        color: '#99CC33',
    },
    {
        tahun: 'Langkah Kedua',
        fase: 'Isi Formulir',
        desc: 'Lengkapi data diri calon siswa dan informasi orang tua/wali pada formulir pendaftaran.',
        color: '#66AA00',
    },
    {
        tahun: 'Langkah Ketiga',
        fase: 'Upload Berkas',
        desc: 'Unggah dokumen persyaratan seperti akta kelahiran, kartu keluarga, foto, dan KTP orang tua.',
        color: '#4A9000',
    },
    {
        tahun: 'Langkah Keempat',
        fase: 'Pengumuman',
        desc: 'Pantau status pendaftaran dan hasil seleksi melalui halaman pengumuman di akun Anda.',
        color: '#007744',
    },
];

const regulasiData = [
    {
        nomor: 'UU No. 20 Tahun 2003',
        judul: 'Sistem Pendidikan Nasional',
        ringkasan: 'Landasan hukum utama penyelenggaraan pendidikan nasional di Indonesia. Pasal 12 menjamin hak peserta didik untuk mendapatkan pendidikan sesuai minat, bakat, dan kemampuan tanpa diskriminasi.',
        icon: <IconScale />,
        highlight: 'Pasal 12 & 34',
    },
    {
        nomor: 'PP No. 17 Tahun 2010',
        judul: 'Pengelolaan dan Penyelenggaraan Pendidikan',
        ringkasan: 'Mengatur teknis penyelenggaraan pendidikan formal termasuk mekanisme penerimaan peserta didik baru pada setiap jenjang pendidikan dasar dan menengah.',
        icon: <IconDocument />,
        highlight: 'Pasal 69 – 75',
    },
    {
        nomor: 'Permendikbud No. 1 Tahun 2021',
        judul: 'Penerimaan Peserta Didik Baru (PPDB)',
        ringkasan: 'Regulasi teknis PPDB dari Kemendikbud yang mengatur jalur zonasi, afirmasi, perpindahan orang tua, dan jalur prestasi untuk SD/MI, SMP/MTs, SMA/MA, dan SMK.',
        icon: <IconBook />,
        highlight: 'Jalur Zonasi & Prestasi',
    },
    {
        nomor: 'PMA No. 90 Tahun 2013',
        judul: 'Penyelenggaraan Pendidikan Madrasah',
        ringkasan: 'Peraturan Menteri Agama yang mengatur secara khusus penyelenggaraan pendidikan di madrasah, termasuk MI (Madrasah Ibtidaiyah) seluruh Indonesia.',
        icon: <IconGlobe />,
        highlight: 'Madrasah & MI',
    },
    {
        nomor: 'Juknis PPDB Kemenag 2025/2026',
        judul: 'Petunjuk Teknis PPDB Madrasah',
        ringkasan: 'Petunjuk teknis tahunan dari Kementerian Agama RI yang menjadi acuan operasional SPMB di madrasah, mulai dari persyaratan usia, dokumen, hingga proses seleksi.',
        icon: <IconCalendar />,
        highlight: 'TA 2025/2026',
    },
];

const infoKardData = [
    {
        icon: '🎓',
        title: 'Jalur Reguler',
        points: [
            'Berusia 6 – 12 tahun per 1 Juli tahun berjalan',
            'Memiliki Akta Kelahiran resmi',
            'Mengisi formulir pendaftaran online',
            'Melengkapi berkas administrasi',
        ],
        color: '#99CC33',
    },
    {
        icon: '🌟',
        title: 'Jalur Prestasi',
        points: [
            'Memiliki sertifikat prestasi akademik/non-akademik',
            'Rekomendasi dari sekolah asal (TK/RA)',
            'Nilai rapor TK/RA di atas rata-rata',
            'Wawancara dengan panitia seleksi',
        ],
        color: '#66AA00',
    },
    {
        icon: '🤝',
        title: 'Jalur Afirmasi',
        points: [
            'Terdaftar sebagai keluarga tidak mampu (DTKS)',
            'Memiliki Kartu Indonesia Pintar (KIP)',
            'Berdomisili di wilayah sekitar madrasah',
            'Mendapat prioritas kursi tertentu',
        ],
        color: '#4A9000',
    },
];

const dokumenWajib = [
    'Fotokopi Kartu Keluarga (KK)',
    'Fotokopi Akta Kelahiran',
    'Fotokopi KTP Orang Tua / Wali',
    'Pas foto terbaru (3×4 dan 4×6)',
    'Fotokopi Ijazah / Surat Keterangan Lulus (TK/RA)',
    'Surat rekomendasi dari kepala TK/RA (bila ada)',
    'Sertifikat prestasi (untuk jalur prestasi)',
    'Surat keterangan tidak mampu (untuk jalur afirmasi)',
];

const faqData = [
    {
        q: 'Apa itu SPMB?',
        a: 'SPMB (Sistem Penerimaan Murid Baru) adalah sistem resmi penerimaan peserta didik baru yang diselenggarakan oleh satuan pendidikan berdasarkan regulasi Kementerian Pendidikan dan Kementerian Agama RI untuk menjamin proses seleksi yang transparan, akuntabel, dan berkeadilan.',
    },
    {
        q: 'Berapa kuota penerimaan di MI Nurussalam?',
        a: 'Setiap tahun ajaran, MI Nurussalam Sidogede membuka kuota penerimaan sesuai kapasitas kelas yang tersedia. Umumnya terdapat 1–2 rombongan belajar dengan kapasitas 20–30 siswa per kelas. Informasi kuota resmi diumumkan saat sosialisasi SPMB berlangsung.',
    },
    {
        q: 'Apakah ada biaya pendaftaran?',
        a: 'Biaya pendaftaran dan administrasi disesuaikan dengan kebijakan madrasah tahun berjalan. Untuk informasi biaya terkini, silakan hubungi langsung panitia SPMB MI Nurussalam Sidogede melalui kontak resmi.',
    },
    {
        q: 'Bagaimana jika dokumen tidak lengkap saat mendaftar?',
        a: 'Calon peserta didik masih dapat mendaftar meskipun dokumen belum lengkap, namun wajib melengkapi seluruh berkas sebelum batas waktu yang ditetapkan. Berkas yang tidak lengkap dapat menyebabkan gugurnya status pendaftaran.',
    },
    {
        q: 'Kapan pengumuman hasil seleksi diumumkan?',
        a: 'Hasil seleksi akan diumumkan pada menu pengumuman setelah Anda login sebagai calon siswa, maka dari itu pastikan untuk memantau terus sistem. Selain itu, Anda akan menerima notifikasi otomatis melalui WhatsApp ketika calon siswa dinyatakan diterima.',
    },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InformasiSPMB({ auth, spmbSettings }) {
    // [BARU] Logika status SPMB
    const spmbTutup = spmbSettings?.status === 'tutup';
    const [activeFaq, setActiveFaq] = useState(null);
    const [activeTab, setActiveTab] = useState('definisi');
    const heroRef = useRef(null);
    const particlesRef = useRef([]);

    // GSAP scroll animations
    useEffect(() => {
        let ctx = gsap.context(() => {
            const animations = [
                { class: '.gsap-fade-up', vars: { y: 70 } },
                { class: '.gsap-fade-left', vars: { x: 60 } },
                { class: '.gsap-fade-right', vars: { x: -60 } },
            ];
            animations.forEach(({ class: className, vars }) => {
                gsap.utils.toArray(className).forEach((el) => {
                    gsap.set(el, { ...vars, opacity: 0 });
                    gsap.to(el, {
                        x: 0, y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
                        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play reverse play reverse' }
                    });
                });
            });
            gsap.utils.toArray('.gsap-stagger-container').forEach((container) => {
                const items = container.querySelectorAll('.gsap-stagger-item');
                gsap.set(items, { y: 50, opacity: 0 });
                gsap.to(items, {
                    y: 0, opacity: 1, duration: 1, stagger: 0.18, ease: 'power3.out',
                    scrollTrigger: { trigger: container, start: 'top 88%', toggleActions: 'play reverse play reverse' }
                });
            });

            // Counter animation
            gsap.utils.toArray('.gsap-counter').forEach((el) => {
                const target = parseInt(el.dataset.target, 10);
                gsap.fromTo(el, { textContent: 0 }, {
                    textContent: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
                });
            });
        });
        return () => ctx.revert();
    }, []);

    // Hero floating particles
    useEffect(() => {
        particlesRef.current.forEach((el, i) => {
            if (!el) return;
            gsap.to(el, {
                y: -30 - i * 8,
                x: (i % 2 === 0 ? 1 : -1) * (10 + i * 5),
                rotation: i % 2 === 0 ? 15 : -15,
                duration: 3 + i * 0.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.3,
            });
        });
    }, []);

    const tabs = [
        { id: 'definisi', label: 'Pengertian', icon: <IconBook /> },
        { id: 'regulasi', label: 'Regulasi & UU', icon: <IconScale /> },
        { id: 'jadwal', label: 'Alur & Jadwal', icon: <IconCalendar /> },
        { id: 'syarat', label: 'Syarat & Dokumen', icon: <IconDocument /> },
    ];

    return (
        <GuestInfoLayout auth={auth} title="Informasi SPMB">
            <style>{`
                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes floatUp {
                    0% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
                    100% { transform: translateY(-120px) rotate(15deg); opacity: 0; }
                }
                @keyframes pulse-green {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(153,204,51,0.4); }
                    50% { box-shadow: 0 0 0 12px rgba(153,204,51,0); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                .animate-gradient-text {
                    background: linear-gradient(135deg, #99CC33 0%, #ffffff 40%, #99CC33 70%, #66AA00 100%);
                    background-size: 300% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: shimmer 4s linear infinite;
                }
                .card-hover-lift {
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
                }
                .card-hover-lift:hover {
                    transform: translateY(-8px) scale(1.01);
                    box-shadow: 0 24px 48px rgba(0,0,0,0.3);
                }
                .tab-indicator {
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .faq-answer {
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                }
                .timeline-line::before {
                    content: '';
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 2px;
                    height: 100%;
                    background: linear-gradient(180deg, #99CC33 0%, rgba(153,204,51,0.1) 100%);
                    top: 0;
                }
                .glow-btn:hover {
                    box-shadow: 0 0 30px rgba(153,204,51,0.5), 0 8px 24px rgba(0,0,0,0.3);
                }
            `}</style>

            {/* ── Hero Section ── */}
            <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #001a1a 0%, #002b2b 40%, #003d1a 70%, #001a00 100%)' }}
            >
                {/* Animated background grid */}
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(153,204,51,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(153,204,51,0.04) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }} />

                {/* Glowing orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(153,204,51,0.15) 0%, transparent 70%)' }} />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(0,100,50,0.2) 0%, transparent 70%)' }} />

                {/* Floating particles */}
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        ref={el => particlesRef.current[i] = el}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            width: 6 + i * 3,
                            height: 6 + i * 3,
                            background: `rgba(153,204,51,${0.3 + i * 0.04})`,
                            left: `${10 + i * 10}%`,
                            top: `${20 + (i % 3) * 25}%`,
                            filter: 'blur(1px)',
                        }}
                    />
                ))}

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center" ref={heroRef}>
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
                        style={{ background: 'rgba(153,204,51,0.1)', borderColor: 'rgba(153,204,51,0.3)', color: '#99CC33' }}>
                        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                        <span className="text-sm font-bold tracking-widest uppercase">Tahun Ajaran 2025/2026</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-none tracking-tight">
                        <span className="animate-gradient-text">Informasi</span>
                        <br />
                        <span className="text-white">SPMB</span>
                    </h1>

                    <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
                        style={{ color: 'rgba(200,230,200,0.75)' }}>
                        Sistem Penerimaan Murid Baru — panduan lengkap, transparan, dan berkeadilan
                        untuk calon peserta didik <strong style={{ color: '#99CC33' }}>MI Nurussalam Sidogede</strong>.
                    </p>

                    {/* Stats row */}
                    <div className="flex flex-wrap justify-center gap-8 mb-10">
                        {[
                            { label: 'Tahun Berdiri', value: 1967, suffix: '', link: 'https://www.google.com/search?q=sejarah+berdiri+MI+Nurussalam+Sidogede+1967' },
                            { label: 'Alumni Sukses', value: 1000, suffix: '+', link: 'https://www.google.com/search?q=alumni+sukses+mi+nurussalam+sidogede+pimpinan+ponpes' },
                            { label: 'Akreditasi', value: 'B', suffix: '', noCount: true, link: 'https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/60705039' },

                        ].map((stat, i) => {
                            const Element = stat.link ? 'a' : 'div';
                            const linkProps = stat.link ? { href: stat.link, target: '_blank', rel: 'noopener noreferrer' } : {};
                            return (
                                <Element key={i} {...linkProps} className={`text-center ${stat.link ? 'cursor-pointer hover:scale-110 transition-transform duration-300 block' : ''}`}>
                                    <div className="text-3xl font-black" style={{ color: '#99CC33' }}>
                                        {stat.noCount ? (
                                            <span>{stat.value}</span>
                                        ) : (
                                            <><span className="gsap-counter" data-target={stat.value}>0</span>{stat.suffix}</>
                                        )}
                                    </div>
                                    <div className="text-xs font-semibold mt-1 uppercase tracking-widest" style={{ color: stat.link ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)' }}>
                                        {stat.label}
                                    </div>
                                </Element>
                            );
                        })}
                    </div>

                    {/* CTA Button */}
                    {spmbTutup ? (
                        <span
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base"
                            style={{
                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                color: '#fff',
                                pointerEvents: 'none',
                                cursor: 'not-allowed',
                                opacity: 0.85,
                                boxShadow: '0 6px 20px rgba(220,38,38,0.3)',
                            }}
                        >
                            <span>🔒 Pendaftaran Ditutup</span>
                        </span>
                    ) : (
                        <a href={route('register')}
                            className="glow-btn inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300"
                            style={{ background: 'linear-gradient(135deg, #99CC33, #66AA00)', color: '#001a00' }}>
                            <span>Daftar Sekarang</span>
                            <IconArrow />
                        </a>
                    )}
                </div>

                {/* Bottom wave */}
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0,60 C360,0 1080,60 1440,20 L1440,60 Z" fill="rgba(240,248,235,0.95)" />
                    </svg>
                </div>
            </section>

            {/* ── Tabs Navigation ── */}
            <section className="sticky top-16 z-40 shadow-xl" style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,51,51,0.1)' }}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex overflow-x-auto gap-1 py-2 scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="tab-indicator flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap flex-shrink-0"
                                style={{
                                    background: activeTab === tab.id ? 'linear-gradient(135deg, #99CC33, #66AA00)' : 'transparent',
                                    color: activeTab === tab.id ? '#001a00' : '#003333',
                                    boxShadow: activeTab === tab.id ? '0 4px 16px rgba(153,204,51,0.4)' : 'none',
                                }}
                            >
                                <span style={{ color: activeTab === tab.id ? '#001a00' : '#99CC33' }}>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Tab Content ── */}
            <div style={{ background: 'linear-gradient(180deg, rgba(240,248,235,0.9) 0%, rgba(255,255,255,0.95) 50%, rgba(240,250,235,0.9) 100%)' }}>

                {/* ──── DEFINISI TAB ──── */}
                {activeTab === 'definisi' && (
                    <section className="py-20">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

                            {/* Definition card */}
                            <div className="gsap-fade-up">
                                <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12"
                                    style={{ background: 'linear-gradient(135deg, #003333 0%, #001a1a 100%)', boxShadow: '0 32px 64px rgba(0,51,51,0.25)' }}>
                                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
                                        style={{ background: 'rgba(153,204,51,0.1)' }} />
                                    <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start">
                                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                                            style={{ background: 'rgba(153,204,51,0.15)', color: '#99CC33' }}>
                                            📚
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#99CC33' }}>
                                                Definisi Resmi
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
                                                Apa itu SPMB?
                                            </h2>
                                            <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(200,230,200,0.8)' }}>
                                                <strong style={{ color: '#99CC33' }}>SPMB (Sistem Penerimaan Murid Baru)</strong> adalah mekanisme resmi yang digunakan oleh satuan pendidikan di Indonesia untuk menerima peserta didik baru secara terstruktur, transparan, dan berkeadilan.
                                            </p>
                                            <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(200,230,200,0.8)' }}>
                                                Sebelumnya dikenal sebagai <strong style={{ color: 'rgba(153,204,51,0.8)' }}>PPDB (Penerimaan Peserta Didik Baru)</strong>, kini diperbarui menjadi SPMB sesuai arah kebijakan Kemendikbudristek dan Kemenag RI guna memastikan setiap anak Indonesia mendapatkan hak pendidikan yang setara dan merata.
                                            </p>
                                            <p className="text-base leading-relaxed" style={{ color: 'rgba(200,230,200,0.8)' }}>
                                                Di lingkungan madrasah, pelaksanaan SPMB mengacu pada Peraturan Menteri Agama dan petunjuk teknis tahunan dari Kementerian Agama RI, yang memastikan proses penerimaan berlangsung secara akuntabel dan sesuai nilai-nilai keislaman.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tujuan & Prinsip */}
                            <div>
                                <div className="text-center mb-12 gsap-fade-up">
                                    <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
                                        style={{ background: 'rgba(153,204,51,0.15)', color: '#003333' }}>
                                        Tujuan & Prinsip
                                    </span>
                                    <h2 className="text-3xl sm:text-4xl font-black" style={{ color: '#003333' }}>
                                        Mengapa SPMB Penting?
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gsap-stagger-container">
                                    {[
                                        { emoji: '⚖️', title: 'Berkeadilan', desc: 'Memberi kesempatan yang sama bagi semua calon peserta didik tanpa diskriminasi latar belakang sosial-ekonomi.', },
                                        { emoji: '🔍', title: 'Transparan', desc: 'Seluruh proses seleksi dilakukan secara terbuka dan dapat dipertanggungjawabkan kepada publik.', },
                                        { emoji: '📊', title: 'Akuntabel', desc: 'Setiap tahap penerimaan tercatat dan dapat ditelusuri, menjamin integritas proses seleksi.', },
                                        { emoji: '🌍', title: 'Zonasi & Afirmasi', desc: 'Mengutamakan peserta didik di wilayah sekitar sekolah dan memberikan prioritas bagi keluarga kurang mampu.', },
                                        { emoji: '🏆', title: 'Berbasis Prestasi', desc: 'Memberi penghargaan bagi peserta didik berprestasi melalui jalur khusus yang terukur.', },
                                        { emoji: '📱', title: 'Digitalisasi', desc: 'Mendorong pengelolaan pendaftaran berbasis teknologi untuk kemudahan akses dan efisiensi administrasi.', },
                                    ].map((item, i) => (
                                        <div key={i} className="gsap-stagger-item card-hover-lift rounded-2xl p-6 border"
                                            style={{ background: 'white', borderColor: 'rgba(0,51,51,0.08)', boxShadow: '0 4px 16px rgba(0,51,51,0.06)' }}>
                                            <div className="text-3xl mb-4">{item.emoji}</div>
                                            <h3 className="text-lg font-bold mb-2" style={{ color: '#003333' }}>{item.title}</h3>
                                            <p className="text-sm leading-relaxed" style={{ color: '#4a7070' }}>{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Perbedaan PPDB vs SPMB */}
                            <div className="gsap-fade-up">
                                <div className="text-center mb-10">
                                    <h2 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: '#003333' }}>
                                        PPDB vs SPMB — Apa Bedanya?
                                    </h2>
                                    <p className="text-sm" style={{ color: '#4a7070' }}>Perubahan nomenklatur dan penyempurnaan sistem</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        {
                                            label: 'PPDB (Lama)', color: '#4a7070', bg: 'rgba(74,112,112,0.06)',
                                            points: ['Nama resmi hingga 2023', 'Fokus pada administrasi offline', 'Proses manual rentan manipulasi', 'Belum seragam antar daerah'],
                                        },
                                        {
                                            label: 'SPMB (Baru)', color: '#003333', bg: 'rgba(153,204,51,0.08)',
                                            points: ['Nama baru mulai TA 2024/2025', 'Digitalisasi penuh berbasis online', 'Sistem terintegrasi & akuntabel', 'Seragam secara nasional'],
                                        },
                                    ].map((item, i) => (
                                        <div key={i} className="rounded-2xl p-6 border" style={{ background: item.bg, borderColor: `${item.color}20` }}>
                                            <h3 className="text-lg font-black mb-4 flex items-center gap-2" style={{ color: item.color }}>
                                                <span className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                                                {item.label}
                                            </h3>
                                            <ul className="space-y-2">
                                                {item.points.map((p, j) => (
                                                    <li key={j} className="flex items-center gap-2 text-sm" style={{ color: item.color }}>
                                                        <span style={{ color: '#99CC33' }}><IconCheck /></span>
                                                        {p}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ──── REGULASI TAB ──── */}
                {activeTab === 'regulasi' && (
                    <section className="py-20">
                        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-14 gsap-fade-up">
                                <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
                                    style={{ background: 'rgba(153,204,51,0.15)', color: '#003333' }}>
                                    Dasar Hukum
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: '#003333' }}>
                                    Landasan Regulasi & Undang-Undang
                                </h2>
                                <p className="text-base max-w-xl mx-auto" style={{ color: '#4a7070' }}>
                                    SPMB di madrasah dilandasi berbagai regulasi dari Kementerian Pendidikan dan Kementerian Agama RI.
                                </p>
                            </div>

                            {/* Ministry info cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12 gsap-stagger-container">
                                {[
                                    { emoji: '🏛️', name: 'Kemendikbudristek', fullname: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi', role: 'Menerbitkan regulasi PPDB/SPMB untuk sekolah umum (SD/SMP/SMA/SMK)', color: '#003366' },
                                    { emoji: '🕌', name: 'Kemenag RI', fullname: 'Kementerian Agama Republik Indonesia', role: 'Menerbitkan regulasi SPMB khusus madrasah (MI/MTs/MA/MAK) melalui Juknis tahunan', color: '#003333' },
                                ].map((m, i) => (
                                    <div key={i} className="gsap-stagger-item card-hover-lift rounded-2xl p-6 border flex gap-5"
                                        style={{ background: 'white', borderColor: 'rgba(0,51,51,0.1)', boxShadow: '0 4px 20px rgba(0,51,51,0.07)' }}>
                                        <div className="text-4xl flex-shrink-0">{m.emoji}</div>
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#99CC33' }}>{m.name}</div>
                                            <div className="font-bold text-sm mb-2" style={{ color: m.color }}>{m.fullname}</div>
                                            <p className="text-xs leading-relaxed" style={{ color: '#4a7070' }}>{m.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Regulasi list */}
                            <div className="space-y-5 gsap-stagger-container">
                                {regulasiData.map((reg, i) => (
                                    <div key={i} className="gsap-stagger-item card-hover-lift rounded-2xl p-6 sm:p-8 border flex flex-col sm:flex-row gap-6"
                                        style={{ background: 'white', borderColor: 'rgba(0,51,51,0.08)', boxShadow: '0 4px 20px rgba(0,51,51,0.06)' }}>
                                        {/* Number badge */}
                                        <div className="flex-shrink-0 flex flex-col items-center sm:items-start">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
                                                style={{ background: 'linear-gradient(135deg, rgba(153,204,51,0.15), rgba(0,51,51,0.08))', color: '#003333' }}>
                                                {reg.icon}
                                            </div>
                                            <span className="text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap"
                                                style={{ background: 'rgba(153,204,51,0.12)', color: '#003333' }}>
                                                {reg.highlight}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#99CC33' }}>{reg.nomor}</div>
                                            <h3 className="text-lg font-black mb-2" style={{ color: '#003333' }}>{reg.judul}</h3>
                                            <p className="text-sm leading-relaxed" style={{ color: '#4a7070' }}>{reg.ringkasan}</p>
                                        </div>
                                        <div className="flex items-center justify-end sm:justify-center flex-shrink-0">
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center"
                                                style={{ background: 'rgba(153,204,51,0.1)', color: '#99CC33' }}>
                                                {i + 1}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Disclaimer */}
                            <div className="mt-10 gsap-fade-up rounded-2xl p-6 border flex gap-4"
                                style={{ background: 'rgba(153,204,51,0.06)', borderColor: 'rgba(153,204,51,0.2)' }}>
                                <div className="text-xl flex-shrink-0" style={{ color: '#99CC33' }}><IconInfo /></div>
                                <div>
                                    <p className="text-sm font-bold mb-1" style={{ color: '#003333' }}>Catatan Penting</p>
                                    <p className="text-xs leading-relaxed" style={{ color: '#4a7070' }}>
                                        Regulasi SPMB dapat berubah setiap tahun ajaran mengikuti kebijakan terbaru Kemendikbudristek dan Kemenag RI.
                                        Selalu cek petunjuk teknis (Juknis) terbaru dan pengumuman resmi dari madrasah untuk informasi yang akurat dan terkini.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ──── JADWAL & ALUR TAB ──── */}
                {activeTab === 'jadwal' && (
                    <section className="py-20">
                        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-14 gsap-fade-up">
                                <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
                                    style={{ background: 'rgba(153,204,51,0.15)', color: '#003333' }}>
                                    Alur Pendaftaran
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: '#003333' }}>
                                    Jadwal & Tahapan SPMB
                                </h2>
                                <p className="text-base max-w-xl mx-auto" style={{ color: '#4a7070' }}>
                                    Ikuti setiap tahapan dengan cermat untuk memastikan kelancaran proses pendaftaran Anda.
                                </p>
                            </div>

                            {/* Timeline */}
                            <div className="relative gsap-stagger-container">
                                {/* Vertical line */}
                                <div className="absolute left-8 top-0 bottom-0 w-0.5 hidden sm:block"
                                    style={{ background: 'linear-gradient(180deg, #99CC33, rgba(153,204,51,0.1))' }} />

                                <div className="space-y-8">
                                    {timelineData.map((item, i) => (
                                        <div key={i} className="gsap-stagger-item flex gap-6 sm:gap-10 items-start relative">
                                            {/* Circle */}
                                            <div className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-black text-sm z-10 relative"
                                                style={{
                                                    background: `linear-gradient(135deg, ${item.color}, rgba(0,51,51,0.8))`,
                                                    color: 'white',
                                                    boxShadow: `0 0 0 4px rgba(255,255,255,0.9), 0 0 0 6px ${item.color}40`,
                                                    animation: 'pulse-green 3s ease-in-out infinite',
                                                    animationDelay: `${i * 0.5}s`,
                                                }}>
                                                {i + 1}
                                            </div>
                                            {/* Content */}
                                            <div className="flex-1 rounded-2xl p-5 sm:p-6 border card-hover-lift"
                                                style={{ background: 'white', borderColor: 'rgba(0,51,51,0.08)', boxShadow: '0 4px 16px rgba(0,51,51,0.06)' }}>
                                                <div className="flex flex-wrap gap-3 items-center mb-2">
                                                    <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                                                        style={{ background: `${item.color}18`, color: item.color }}>
                                                        {item.tahun}
                                                    </span>
                                                    <h3 className="text-lg font-black" style={{ color: '#003333' }}>{item.fase}</h3>
                                                </div>
                                                <p className="text-sm leading-relaxed" style={{ color: '#4a7070' }}>{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Jalur Penerimaan */}
                            <div className="mt-20">
                                <div className="text-center mb-12 gsap-fade-up">
                                    <h2 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: '#003333' }}>Jalur Penerimaan</h2>
                                    <p className="text-sm" style={{ color: '#4a7070' }}>Pilih jalur yang sesuai dengan kondisi dan prestasi Anda</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 gsap-stagger-container">
                                    {infoKardData.map((kard, i) => (
                                        <div key={i} className="gsap-stagger-item card-hover-lift rounded-2xl overflow-hidden border"
                                            style={{ background: 'white', borderColor: 'rgba(0,51,51,0.08)', boxShadow: '0 4px 20px rgba(0,51,51,0.07)' }}>
                                            <div className="h-2" style={{ background: `linear-gradient(135deg, ${kard.color}, rgba(0,51,51,0.4))` }} />
                                            <div className="p-6">
                                                <div className="text-3xl mb-3">{kard.icon}</div>
                                                <h3 className="text-lg font-black mb-4" style={{ color: '#003333' }}>{kard.title}</h3>
                                                <ul className="space-y-2">
                                                    {kard.points.map((p, j) => (
                                                        <li key={j} className="flex items-start gap-2 text-sm" style={{ color: '#4a7070' }}>
                                                            <span className="mt-0.5 flex-shrink-0" style={{ color: kard.color }}><IconCheck /></span>
                                                            {p}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ──── SYARAT & DOKUMEN TAB ──── */}
                {activeTab === 'syarat' && (
                    <section className="py-20">
                        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-14 gsap-fade-up">
                                <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
                                    style={{ background: 'rgba(153,204,51,0.15)', color: '#003333' }}>
                                    Persyaratan
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: '#003333' }}>
                                    Syarat & Dokumen Wajib
                                </h2>
                                <p className="text-base max-w-xl mx-auto" style={{ color: '#4a7070' }}>
                                    Siapkan semua dokumen berikut sebelum melakukan pendaftaran.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Syarat Umum */}
                                <div className="gsap-fade-right rounded-2xl p-6 sm:p-8 border"
                                    style={{ background: 'white', borderColor: 'rgba(0,51,51,0.08)', boxShadow: '0 4px 24px rgba(0,51,51,0.07)' }}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{ background: 'rgba(153,204,51,0.12)', color: '#003333' }}>
                                            <IconStar />
                                        </div>
                                        <h3 className="text-xl font-black" style={{ color: '#003333' }}>Syarat Umum Calon Peserta Didik</h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {[
                                            'Berusia 6 – 12 tahun per 1 Juli tahun ajaran berjalan',
                                            'Lulus dari TK/RA atau setara (dibuktikan surat keterangan)',
                                            'Sehat jasmani dan rohani',
                                            'Berdomisili di wilayah yang dapat dijangkau madrasah',
                                            'Orang tua/wali sanggup memenuhi ketentuan madrasah',
                                            'Tidak sedang terdaftar di satuan pendidikan lain',
                                        ].map((s, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#4a7070' }}>
                                                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                                                    style={{ background: 'rgba(153,204,51,0.15)', color: '#99CC33' }}>
                                                    <IconCheck />
                                                </span>
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Dokumen wajib */}
                                <div className="gsap-fade-left rounded-2xl p-6 sm:p-8 border"
                                    style={{ background: 'white', borderColor: 'rgba(0,51,51,0.08)', boxShadow: '0 4px 24px rgba(0,51,51,0.07)' }}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{ background: 'rgba(153,204,51,0.12)', color: '#003333' }}>
                                            <IconDocument />
                                        </div>
                                        <h3 className="text-xl font-black" style={{ color: '#003333' }}>Dokumen Wajib</h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {dokumenWajib.map((d, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#4a7070' }}>
                                                <span className="mt-0.5 flex-shrink-0 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center"
                                                    style={{ background: 'rgba(0,51,51,0.07)', color: '#003333' }}>
                                                    {i + 1}
                                                </span>
                                                {d}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Alur Online */}
                            <div className="mt-14 gsap-fade-up rounded-3xl p-8 sm:p-10 border"
                                style={{ background: 'linear-gradient(135deg, #003333 0%, #001a1a 100%)', borderColor: 'rgba(153,204,51,0.2)', boxShadow: '0 24px 48px rgba(0,51,51,0.2)' }}>
                                <div className="text-center mb-8">
                                    <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Cara Mendaftar Online</h3>
                                    <p className="text-sm" style={{ color: 'rgba(200,230,200,0.65)' }}>Ikuti 4 langkah mudah berikut</p>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[
                                        { step: '01', title: 'Buat Akun', desc: 'Daftar dengan email aktif orang tua/wali' },
                                        { step: '02', title: 'Isi Formulir', desc: 'Lengkapi data diri dan data keluarga' },
                                        { step: '03', title: 'Upload Dokumen', desc: 'Unggah semua berkas yang diperlukan' },
                                        { step: '04', title: 'Tunggu Hasil', desc: 'Pantau status melalui dashboard akun' },
                                    ].map((s, i) => (
                                        <div key={i} className="text-center p-4 rounded-2xl"
                                            style={{ background: 'rgba(255,255,255,0.06)' }}>
                                            <div className="text-3xl font-black mb-2" style={{ color: '#99CC33' }}>{s.step}</div>
                                            <h4 className="font-bold text-sm text-white mb-1">{s.title}</h4>
                                            <p className="text-xs leading-relaxed" style={{ color: 'rgba(200,230,200,0.55)' }}>{s.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 text-center">
                                    {spmbTutup ? (
                                        <span
                                            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm"
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
                                        <a href={route('register')}
                                            className="glow-btn inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm transition-all"
                                            style={{ background: 'linear-gradient(135deg, #99CC33, #66AA00)', color: '#001a00' }}>
                                            Mulai Pendaftaran
                                            <IconArrow />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {/* ── FAQ Section ── */}
            <section className="py-20 relative overflow-hidden" style={{ background: 'white' }}>
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
                <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14 gsap-fade-up">
                        <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
                            style={{ background: 'rgba(153,204,51,0.12)', color: '#003333' }}>
                            FAQ
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: '#003333' }}>
                            Pertanyaan yang Sering Diajukan
                        </h2>
                        <p className="text-base" style={{ color: '#4a7070' }}>
                            Temukan jawaban atas pertanyaan umum seputar SPMB MI Nurussalam
                        </p>
                    </div>

                    <div className="space-y-3 gsap-stagger-container">
                        {faqData.map((faq, i) => (
                            <div key={i} className="gsap-stagger-item rounded-2xl border overflow-hidden"
                                style={{ borderColor: activeFaq === i ? 'rgba(153,204,51,0.4)' : 'rgba(0,51,51,0.08)', background: 'white', boxShadow: activeFaq === i ? '0 8px 32px rgba(153,204,51,0.1)' : '0 2px 8px rgba(0,51,51,0.04)', transition: 'all 0.3s ease' }}>
                                <button
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                                >
                                    <span className="font-bold text-base pr-4" style={{ color: '#003333' }}>{faq.q}</span>
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                                        style={{
                                            background: activeFaq === i ? 'linear-gradient(135deg, #99CC33, #66AA00)' : 'rgba(0,51,51,0.07)',
                                            color: activeFaq === i ? '#001a00' : '#003333',
                                            transform: activeFaq === i ? 'rotate(90deg)' : 'rotate(0deg)',
                                        }}>
                                        <IconArrow />
                                    </span>
                                </button>
                                <div className="faq-answer" style={{ maxHeight: activeFaq === i ? '300px' : '0px' }}>
                                    <p className="px-5 sm:px-6 pb-5 text-sm leading-relaxed" style={{ color: '#4a7070' }}>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="py-20 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #001a1a 0%, #002b2b 50%, #003d1a 100%)' }}>
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(153,204,51,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0,100,50,0.1) 0%, transparent 50%)',
                    }} />
                <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center gsap-fade-up">
                    <div className="text-5xl mb-6">🎓</div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                        Siap Bergabung dengan Keluarga
                        <span className="block" style={{ color: '#99CC33' }}>MI Nurussalam Sidogede?</span>
                    </h2>
                    <p className="text-base mb-8" style={{ color: 'rgba(200,230,200,0.7)' }}>
                        Daftarkan putra-putri Anda sekarang dan jadilah bagian dari generasi islami yang cerdas, berkarakter, dan berprestasi.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {spmbTutup ? (
                            <span
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm"
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
                            <a href={route('register')}
                                className="glow-btn inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300"
                                style={{ background: 'linear-gradient(135deg, #99CC33, #66AA00)', color: '#001a00' }}>
                                Daftar Sekarang
                                <IconArrow />
                            </a>
                        )}
                        <a href={route('kontak')}
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm border transition-all duration-300 hover:bg-white/10"
                            style={{ borderColor: 'rgba(153,204,51,0.4)', color: '#99CC33' }}>
                            Hubungi Kami
                        </a>
                    </div>
                </div>
            </section>
        </GuestInfoLayout>
    );
}
