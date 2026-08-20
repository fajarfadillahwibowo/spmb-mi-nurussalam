import { router } from '@inertiajs/react';

/**
 * PeriodeFilterBar — Komponen reusable dropdown filter periode
 *
 * Menampilkan dropdown "Pilih Periode" di bagian atas setiap halaman admin.
 * Admin dapat memilih periode historis untuk melihat data lama.
 *
 * Props:
 *   periodes       — array [{id, tahun, is_aktif}]
 *   selectedPeriode — id periode yang sedang dipilih (atau null = aktif)
 *   routeName      — nama route untuk redirect (contoh: 'data-pendaftar.index')
 *   extraParams    — parameter query tambahan yang harus dipertahankan
 */
export default function PeriodeFilterBar({ periodes = [], selectedPeriode = null, routeName, extraParams = {} }) {
    const handleChange = (e) => {
        const val = e.target.value;
        router.get(
            route(routeName),
            { ...extraParams, periode_id: val || undefined },
            { preserveState: true, replace: true }
        );
    };

    const periodeAktif = periodes.find(p => p.is_aktif);
    const labelAktif   = periodeAktif ? `${periodeAktif.tahun} (Aktif)` : 'Semua Data';

    return (
        <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl mb-4"
            style={{ background: 'rgba(153,204,51,0.08)', border: '1px solid rgba(153,204,51,0.2)' }}
        >
            {/* Icon */}
            <div className="flex items-center justify-center h-8 w-8 rounded-lg shrink-0" style={{ background: 'rgba(153,204,51,0.15)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#99CC33" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
            </div>

            {/* Label */}
            <span className="text-sm font-bold shrink-0" style={{ color: '#003333' }}>
                Filter Periode:
            </span>

            {/* Dropdown */}
            <select
                value={selectedPeriode || ''}
                onChange={handleChange}
                className="flex-1 max-w-xs text-sm font-semibold rounded-lg px-3 py-1.5 border-0 outline-none cursor-pointer"
                style={{ background: 'rgba(0,51,51,0.06)', color: '#003333' }}
            >
                <option value="">{labelAktif}</option>
                {periodes.filter(p => !p.is_aktif).map(p => (
                    <option key={p.id} value={p.id}>
                        Periode {p.tahun}
                    </option>
                ))}
            </select>

            {/* Indicator */}
            {selectedPeriode && (
                <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: '#f59e0b', color: '#fff' }}>
                    Melihat data historis
                </span>
            )}
        </div>
    );
}