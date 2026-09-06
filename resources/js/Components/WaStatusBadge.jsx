import React from 'react';

/**
 * Komponen Indikator Status Pengiriman Notifikasi WhatsApp (WA) Gateway
 *
 * @param {Object} props
 * @param {('terkirim'|'belum_terkirim'|string)} props.status Status pengiriman WA
 * @param {string|null} [props.sentAt] Waktu kirim (ISO string / date string)
 * @param {string} [props.className] Custom CSS classes
 * @param {boolean} [props.showIcon] Menampilkan logo WA (default: true)
 */
export default function WaStatusBadge({ status, sentAt = null, className = '', showIcon = true }) {
    const isTerkirim = status === 'terkirim';

    const formattedTime = sentAt
        ? new Date(sentAt).toLocaleString('id-ID', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
          })
        : null;

    const tooltipTitle = isTerkirim
        ? `WhatsApp berhasil dikirim ke gateway${formattedTime ? ` pada ${formattedTime}` : ''}`
        : 'WhatsApp belum terkirim atau gagal menghubungi gateway';

    return (
        <span
            title={tooltipTitle}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-tight transition-all border shadow-xs ${
                isTerkirim
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-50 text-rose-700 border-rose-300/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
            } ${className}`}
        >
            {showIcon && (
                <svg
                    className={`h-3 w-3 shrink-0 ${
                        isTerkirim
                            ? 'fill-[#25D366]'
                            : 'fill-rose-500 dark:fill-rose-400'
                    }`}
                    viewBox="0 0 24 24"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
            )}

            {/* Indicator Dot */}
            <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    isTerkirim ? 'bg-emerald-500 shadow-sm shadow-emerald-400' : 'bg-rose-500 shadow-sm shadow-rose-400'
                }`}
            />

            <span>
                {isTerkirim ? 'Status: Terkirim' : 'Status: Belum Terkirim'}
            </span>
        </span>
    );
}
