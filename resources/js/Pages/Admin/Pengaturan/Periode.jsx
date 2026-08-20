import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

const MONTHS = [
    '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const TAHUN_OPTIONS = Array.from({ length: 20 }, (_, i) => 2026 + i);

function SectionCard({ title, icon, children, color = '#99CC33' }) {
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

function DateRangeInput({ label, startName, endName, startVal, endVal, onChange }) {
    return (
        <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(0,51,51,0.5)' }}>{label}</p>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Tanggal Mulai</label>
                    <input
                        type="date"
                        value={startVal || ''}
                        onChange={e => onChange(startName, e.target.value)}
                        className="w-full rounded-xl px-3 py-2 text-sm font-semibold border outline-none transition"
                        style={{ border: '1.5px solid rgba(0,51,51,0.15)', color: '#003333', background: '#fafafa' }}
                    />
                </div>
                <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Tanggal Selesai</label>
                    <input
                        type="date"
                        value={endVal || ''}
                        onChange={e => onChange(endName, e.target.value)}
                        className="w-full rounded-xl px-3 py-2 text-sm font-semibold border outline-none transition"
                        style={{ border: '1.5px solid rgba(0,51,51,0.15)', color: '#003333', background: '#fafafa' }}
                    />
                </div>
            </div>
        </div>
    );
}

export default function Periode({ periodes, periodeAktif, flash_status, flash_error }) {
    const [selectedTahun, setSelectedTahun] = useState(periodeAktif?.tahun || 2026);

    const existingPeriode = periodes.find(p => p.tahun === selectedTahun);

    // Helper: ganti tahun pada date string, pertahankan bulan & hari
    const replaceYear = (dateStr, newYear) => {
        if (!dateStr) return '';
        const plain = (dateStr + '').substring(0, 10);
        const parts = plain.split('-');
        if (parts.length < 3) return dateStr;
        return `${newYear}-${parts[1]}-${parts[2]}`;
    };

    const { data, setData, post, processing, reset } = useForm({
        tahun:          selectedTahun,
        is_aktif:       existingPeriode?.is_aktif ?? false,
        bulan_berjalan: existingPeriode?.bulan_berjalan ?? new Date().getMonth() + 1,
        tahun_berjalan: existingPeriode?.tahun_berjalan ?? new Date().getFullYear(),
        gel1_mulai:     existingPeriode?.gel1_mulai ? replaceYear(existingPeriode.gel1_mulai, selectedTahun) : '',
        gel1_selesai:   existingPeriode?.gel1_selesai ? replaceYear(existingPeriode.gel1_selesai, selectedTahun) : '',
        gel2_mulai:     existingPeriode?.gel2_mulai ? replaceYear(existingPeriode.gel2_mulai, selectedTahun) : '',
        gel2_selesai:   existingPeriode?.gel2_selesai ? replaceYear(existingPeriode.gel2_selesai, selectedTahun) : '',
        gel3_mulai:     existingPeriode?.gel3_mulai ? replaceYear(existingPeriode.gel3_mulai, selectedTahun) : '',
        gel3_selesai:   existingPeriode?.gel3_selesai ? replaceYear(existingPeriode.gel3_selesai, selectedTahun) : '',
    });

    const handleTahunChange = (tahun) => {
        setSelectedTahun(tahun);
        const p = periodes.find(x => x.tahun === tahun);

        setData({
            tahun,
            is_aktif:       p?.is_aktif ?? false,
            bulan_berjalan: p?.bulan_berjalan ?? new Date().getMonth() + 1,
            tahun_berjalan: p?.tahun_berjalan ?? new Date().getFullYear(),
            // Replace tahun agar selalu sesuai tahun yang dipilih
            gel1_mulai:   p?.gel1_mulai ? replaceYear(p.gel1_mulai, tahun) : '',
            gel1_selesai: p?.gel1_selesai ? replaceYear(p.gel1_selesai, tahun) : '',
            gel2_mulai:   p?.gel2_mulai ? replaceYear(p.gel2_mulai, tahun) : '',
            gel2_selesai: p?.gel2_selesai ? replaceYear(p.gel2_selesai, tahun) : '',
            gel3_mulai:   p?.gel3_mulai ? replaceYear(p.gel3_mulai, tahun) : '',
            gel3_selesai: p?.gel3_selesai ? replaceYear(p.gel3_selesai, tahun) : '',
        });
    };

    const handleDateChange = (field, val) => setData(field, val);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('pengaturan.periode.update'));
    };

    const fmt = (d) => {
        if (!d) return '-';
        return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long' });
    };

    return (
        <AuthenticatedLayout header="Pengaturan Periode & Gelombang">
            <Head title="Periode SPMB" />

            <div className="max-w-3xl mx-auto space-y-6">

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

                {/* Active Period Banner */}
                {periodeAktif && (
                    <div className="flex items-center gap-3 px-5 py-3 rounded-xl"
                        style={{ background: 'rgba(153,204,51,0.1)', border: '1px solid rgba(153,204,51,0.25)' }}>
                        <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: '#99CC33' }} />
                        <span className="text-sm font-bold" style={{ color: '#003333' }}>
                            Periode Aktif Saat Ini: <strong style={{ color: '#66AA00' }}>Tahun {periodeAktif.tahun}</strong>
                        </span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Pilih Tahun */}
                    <SectionCard title="Pilih Tahun Periode" icon="📅">
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                            {TAHUN_OPTIONS.map(yr => {
                                const hasPeriode = periodes.some(p => p.tahun === yr);
                                const isAktif = periodes.find(p => p.tahun === yr)?.is_aktif;
                                const isSelected = selectedTahun === yr;
                                return (
                                    <button
                                        key={yr}
                                        type="button"
                                        onClick={() => handleTahunChange(yr)}
                                        className="py-2.5 px-2 rounded-xl text-sm font-bold transition-all duration-200 relative"
                                        style={{
                                            background: isSelected
                                                ? 'linear-gradient(135deg, #003333, #004444)'
                                                : hasPeriode
                                                    ? 'rgba(153,204,51,0.1)'
                                                    : 'rgba(0,51,51,0.04)',
                                            border: isSelected
                                                ? '2px solid #99CC33'
                                                : hasPeriode
                                                    ? '1.5px solid rgba(153,204,51,0.3)'
                                                    : '1.5px solid rgba(0,51,51,0.08)',
                                            color: isSelected ? '#99CC33' : '#003333',
                                        }}
                                    >
                                        {yr}
                                        {isAktif && (
                                            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full" style={{ background: '#99CC33' }} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs mt-3 font-medium" style={{ color: 'rgba(0,51,51,0.5)' }}>
                            🟢 Titik hijau = periode aktif · Warna hijau muda = sudah ada data
                        </p>
                    </SectionCard>

                    {/* Aktivasi Periode */}
                    <SectionCard title={`Pengaturan Periode Tahun ${selectedTahun}`} icon="⚙️">
                        <div className="space-y-5">
                            {/* Toggle Aktif */}
                            <div className="flex items-center justify-between p-4 rounded-xl"
                                style={{ background: data.is_aktif ? 'rgba(153,204,51,0.08)' : 'rgba(0,51,51,0.04)', border: `1.5px solid ${data.is_aktif ? 'rgba(153,204,51,0.3)' : 'rgba(0,51,51,0.1)'}` }}>
                                <div>
                                    <p className="font-bold text-sm" style={{ color: '#003333' }}>Jadikan Periode Aktif</p>
                                    <p className="text-xs mt-0.5" style={{ color: 'rgba(0,51,51,0.55)' }}>
                                        Data siswa akan disaring berdasarkan periode ini. Periode lain akan dinonaktifkan.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setData('is_aktif', !data.is_aktif)}
                                    className="relative h-7 w-14 rounded-full transition-all duration-300 shrink-0 ml-4"
                                    style={{ background: data.is_aktif ? '#99CC33' : 'rgba(0,51,51,0.2)' }}
                                >
                                    <span className="absolute top-1 transition-all duration-300 h-5 w-5 rounded-full bg-white shadow-sm"
                                        style={{ left: data.is_aktif ? 'calc(100% - 1.5rem)' : '0.25rem' }} />
                                </button>
                            </div>

                            {/* Bulan & Tahun Berjalan */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'rgba(0,51,51,0.5)' }}>
                                        Bulan Berjalan
                                    </label>
                                    <select
                                        value={data.bulan_berjalan || ''}
                                        onChange={e => setData('bulan_berjalan', parseInt(e.target.value))}
                                        className="w-full rounded-xl px-3 py-2.5 text-sm font-semibold border outline-none"
                                        style={{ border: '1.5px solid rgba(0,51,51,0.15)', color: '#003333', background: '#fafafa' }}
                                    >
                                        {MONTHS.slice(1).map((m, i) => (
                                            <option key={i + 1} value={i + 1}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'rgba(0,51,51,0.5)' }}>
                                        Tahun Berjalan
                                    </label>
                                    <select
                                        value={data.tahun_berjalan || ''}
                                        onChange={e => setData('tahun_berjalan', parseInt(e.target.value))}
                                        className="w-full rounded-xl px-3 py-2.5 text-sm font-semibold border outline-none"
                                        style={{ border: '1.5px solid rgba(0,51,51,0.15)', color: '#003333', background: '#fafafa' }}
                                    >
                                        {TAHUN_OPTIONS.map(yr => <option key={yr} value={yr}>{yr}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Gelombang Pendaftaran */}
                    <SectionCard title="Rentang Tanggal Gelombang" icon="📆">
                        <div className="space-y-6">
                            {[
                                { label: 'Gelombang I', mulai: 'gel1_mulai', selesai: 'gel1_selesai' },
                                { label: 'Gelombang II', mulai: 'gel2_mulai', selesai: 'gel2_selesai' },
                                { label: 'Gelombang III', mulai: 'gel3_mulai', selesai: 'gel3_selesai' },
                            ].map((gel, idx) => (
                                <DateRangeInput
                                    key={idx}
                                    label={gel.label}
                                    startName={gel.mulai}
                                    endName={gel.selesai}
                                    startVal={data[gel.mulai]}
                                    endVal={data[gel.selesai]}
                                    onChange={handleDateChange}
                                />
                            ))}
                        </div>
                    </SectionCard>

                    {/* Summary Preview */}
                    {(data.gel1_mulai || data.gel2_mulai || data.gel3_mulai) && (
                        <SectionCard title="Preview Jadwal Gelombang" icon="👁">
                            <div className="space-y-2">
                                {[
                                    { label: 'Gelombang I', m: data.gel1_mulai, s: data.gel1_selesai },
                                    { label: 'Gelombang II', m: data.gel2_mulai, s: data.gel2_selesai },
                                    { label: 'Gelombang III', m: data.gel3_mulai, s: data.gel3_selesai },
                                ].map((g, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg"
                                        style={{ background: 'rgba(153,204,51,0.06)', border: '1px solid rgba(153,204,51,0.15)' }}>
                                        <span className="text-sm font-bold" style={{ color: '#003333' }}>{g.label}</span>
                                        <span className="text-xs font-semibold" style={{ color: '#66AA00' }}>
                                            {g.m && g.s ? `${fmt(g.m)} — ${fmt(g.s)}` : '-'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    )}

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
                        {processing ? 'Menyimpan...' : `Simpan Periode Tahun ${selectedTahun}`}
                    </button>
                </form>

                {/* Daftar Periode */}
                {periodes.length > 0 && (
                    <SectionCard title="Daftar Periode Tersimpan" icon="📋">
                        <div className="space-y-2">
                            {periodes.map(p => (
                                <div key={p.id}
                                    className="flex items-center justify-between py-2.5 px-4 rounded-xl cursor-pointer transition-all"
                                    onClick={() => handleTahunChange(p.tahun)}
                                    style={{
                                        background: p.is_aktif ? 'rgba(153,204,51,0.1)' : 'rgba(0,51,51,0.04)',
                                        border: p.is_aktif ? '1px solid rgba(153,204,51,0.3)' : '1px solid rgba(0,51,51,0.08)',
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        {p.is_aktif && <span className="h-2 w-2 rounded-full" style={{ background: '#99CC33' }} />}
                                        <span className="font-bold text-sm" style={{ color: '#003333' }}>Tahun {p.tahun}</span>
                                        {p.is_aktif && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#99CC33', color: '#fff' }}>AKTIF</span>}
                                    </div>
                                    <span className="text-xs font-medium" style={{ color: 'rgba(0,51,51,0.5)' }}>Klik untuk edit</span>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                )}
            </div>
        </AuthenticatedLayout>
    );
}