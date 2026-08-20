import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

function SectionCard({ title, icon, children }) {
    return (
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: '#fff', border: '1px solid rgba(0,51,51,0.08)' }}>
            <div className="flex items-center gap-3 px-5 py-4" style={{ background: 'rgba(0,51,51,0.03)', borderBottom: '1px solid rgba(0,51,51,0.06)' }}>
                <span className="text-lg">{icon}</span>
                <h3 className="font-extrabold text-sm tracking-tight" style={{ color: '#003333' }}>{title}</h3>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

function InputField({ label, name, type = 'text', value, onChange, placeholder, maxLength }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest block" style={{ color: 'rgba(0,51,51,0.55)' }}>{label}</label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(name, e.target.value)}
                placeholder={placeholder}
                maxLength={maxLength}
                className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold border outline-none transition-all"
                style={{ border: '1.5px solid rgba(0,51,51,0.15)', color: '#003333', background: '#fafafa' }}
            />
        </div>
    );
}

export default function Sistem({ teksPengumuman, kontakWa, emailSekolah, persyaratanDokumen, flash_status, flash_error }) {
    const { data, setData, post, processing } = useForm({
        teks_pengumuman: teksPengumuman || '',
        kontak_wa:       kontakWa || '',
        email_sekolah:   emailSekolah || '',
        persyaratan:     persyaratanDokumen || [],
    });

    const [newPersyaratan, setNewPersyaratan] = useState('');

    const handleFieldChange = (field, val) => setData(field, val);

    const handleTogglePersyaratan = (id) => {
        setData('persyaratan', data.persyaratan.map(p =>
            p.id === id ? { ...p, aktif: !p.aktif } : p
        ));
    };

    const handleAddPersyaratan = () => {
        const nama = newPersyaratan.trim();
        if (!nama) return;
        const maxId = data.persyaratan.reduce((max, p) => Math.max(max, p.id), 0);
        setData('persyaratan', [...data.persyaratan, { id: maxId + 1, nama, aktif: true }]);
        setNewPersyaratan('');
    };

    const handleRemovePersyaratan = (id) => {
        setData('persyaratan', data.persyaratan.filter(p => p.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('pengaturan.sistem.update'));
    };

    return (
        <AuthenticatedLayout header="Pengaturan Sistem">
            <Head title="Pengaturan Sistem" />

            <div className="max-w-2xl mx-auto space-y-6">

                {/* Flash Messages */}
                {flash_status && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold"
                        style={{ background: 'rgba(153,204,51,0.12)', border: '1px solid rgba(153,204,51,0.3)', color: '#003333' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#99CC33" className="h-5 w-5 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        {flash_status}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Teks Pengumuman */}
                    <SectionCard title="Teks Pengumuman Dashboard Siswa" icon="📢">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest block" style={{ color: 'rgba(0,51,51,0.55)' }}>
                                Teks Pengumuman
                            </label>
                            <textarea
                                value={data.teks_pengumuman}
                                onChange={e => setData('teks_pengumuman', e.target.value)}
                                rows={4}
                                maxLength={1000}
                                placeholder="Masukkan teks pengumuman yang akan ditampilkan di dashboard siswa..."
                                className="w-full rounded-xl px-4 py-3 text-sm font-medium border outline-none transition-all resize-none"
                                style={{ border: '1.5px solid rgba(0,51,51,0.15)', color: '#003333', background: '#fafafa', lineHeight: 1.7 }}
                            />
                            <p className="text-xs font-medium text-right" style={{ color: 'rgba(0,51,51,0.4)' }}>
                                {data.teks_pengumuman.length}/1000 karakter
                            </p>
                        </div>
                        {data.teks_pengumuman && (
                            <div className="mt-3 p-3 rounded-xl text-sm"
                                style={{ background: 'rgba(153,204,51,0.06)', border: '1px solid rgba(153,204,51,0.2)' }}>
                                <p className="text-xs font-bold mb-1" style={{ color: '#66AA00' }}>Preview Dashboard Siswa:</p>
                                <p className="text-xs leading-relaxed" style={{ color: '#003333' }}>{data.teks_pengumuman}</p>
                            </div>
                        )}
                    </SectionCard>

                    {/* Kontak */}
                    <SectionCard title="Informasi Kontak Sekolah" icon="📞">
                        <div className="space-y-4">
                            <InputField
                                label="Nomor WhatsApp Admin"
                                name="kontak_wa"
                                type="tel"
                                value={data.kontak_wa}
                                onChange={handleFieldChange}
                                placeholder="contoh: 6281234567890 (tanpa + atau strip)"
                                maxLength={20}
                            />
                            <InputField
                                label="Email Sekolah"
                                name="email_sekolah"
                                type="email"
                                value={data.email_sekolah}
                                onChange={handleFieldChange}
                                placeholder="contoh: minurussalam@gmail.com"
                                maxLength={100}
                            />
                            <div className="flex items-start gap-2 p-3 rounded-xl text-xs"
                                style={{ background: 'rgba(0,51,51,0.04)', border: '1px dashed rgba(0,51,51,0.15)' }}>
                                <span>ℹ️</span>
                                <p style={{ color: 'rgba(0,51,51,0.6)' }}>
                                    Nomor WA akan digunakan untuk tombol chat WhatsApp di halaman Kontak publik.
                                    Format: kode negara + nomor (contoh: 62812xxxxxxx)
                                </p>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Persyaratan Dokumen */}
                    <SectionCard title="Manajemen Persyaratan Dokumen" icon="📋">
                        <div className="space-y-3">
                            <p className="text-xs font-medium" style={{ color: 'rgba(0,51,51,0.55)' }}>
                                Toggle untuk mengaktifkan/menonaktifkan persyaratan. Persyaratan yang aktif akan ditampilkan di halaman Informasi SPMB.
                            </p>

                            {/* List */}
                            <div className="space-y-2">
                                {data.persyaratan.map((p) => (
                                    <div
                                        key={p.id}
                                        className="flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all"
                                        style={{
                                            background: p.aktif ? 'rgba(153,204,51,0.06)' : 'rgba(0,51,51,0.03)',
                                            border: p.aktif ? '1px solid rgba(153,204,51,0.2)' : '1px solid rgba(0,51,51,0.08)',
                                        }}
                                    >
                                        {/* Toggle */}
                                        <button
                                            type="button"
                                            onClick={() => handleTogglePersyaratan(p.id)}
                                            className="relative h-6 w-11 rounded-full transition-all duration-300 shrink-0"
                                            style={{ background: p.aktif ? '#99CC33' : 'rgba(0,51,51,0.2)' }}
                                        >
                                            <span
                                                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300"
                                                style={{ left: p.aktif ? 'calc(100% - 1.375rem)' : '0.125rem' }}
                                            />
                                        </button>

                                        {/* Nama */}
                                        <span className="flex-1 text-sm font-medium" style={{ color: p.aktif ? '#003333' : 'rgba(0,51,51,0.4)' }}>
                                            {p.nama}
                                        </span>

                                        {/* Status badge */}
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                                            style={{
                                                background: p.aktif ? 'rgba(153,204,51,0.15)' : 'rgba(0,51,51,0.08)',
                                                color: p.aktif ? '#66AA00' : 'rgba(0,51,51,0.4)',
                                            }}>
                                            {p.aktif ? 'Aktif' : 'Nonaktif'}
                                        </span>

                                        {/* Delete */}
                                        <button
                                            type="button"
                                            onClick={() => handleRemovePersyaratan(p.id)}
                                            className="shrink-0 text-red-400 hover:text-red-600 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add new */}
                            <div className="flex gap-2 mt-3">
                                <input
                                    type="text"
                                    value={newPersyaratan}
                                    onChange={e => setNewPersyaratan(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddPersyaratan())}
                                    placeholder="Tambah persyaratan baru..."
                                    className="flex-1 rounded-xl px-3 py-2 text-sm font-medium border outline-none"
                                    style={{ border: '1.5px solid rgba(0,51,51,0.15)', color: '#003333', background: '#fafafa' }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddPersyaratan}
                                    className="px-4 py-2 rounded-xl font-bold text-sm transition-all"
                                    style={{ background: 'rgba(153,204,51,0.15)', color: '#003333', border: '1.5px solid rgba(153,204,51,0.3)' }}
                                >
                                    + Tambah
                                </button>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 rounded-xl font-bold text-base transition-all duration-200"
                        style={{
                            background: processing ? 'rgba(0,51,51,0.1)' : 'linear-gradient(135deg, #003333, #004444)',
                            color: processing ? 'rgba(0,51,51,0.4)' : '#99CC33',
                            cursor: processing ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Semua Pengaturan Sistem'}
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}