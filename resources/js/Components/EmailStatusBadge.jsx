import React from 'react';

/**
 * Komponen Indikator Status Pengiriman Notifikasi Email Gateway
 *
 * @param {Object} props
 * @param {('terkirim'|'belum_terkirim'|string)} props.status Status pengiriman email
 * @param {string|null} [props.sentAt] Waktu kirim (ISO string / date string)
 * @param {string} [props.className] Custom CSS classes
 * @param {boolean} [props.showIcon] Menampilkan logo/ikon amplop email (default: true)
 */
export default function EmailStatusBadge({ status, sentAt = null, className = '', showIcon = true }) {
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
        ? `Email berhasil dikirim via SMTP MI Nurussalam${formattedTime ? ` pada ${formattedTime}` : ''}`
        : 'Email belum terkirim atau gagal menghubungi server SMTP';

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
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-3 w-3 shrink-0 ${
                        isTerkirim
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
            )}

            {/* Indicator Dot */}
            <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    isTerkirim
                        ? 'bg-emerald-500 shadow-sm shadow-emerald-400'
                        : 'bg-rose-500 shadow-sm shadow-rose-400'
                }`}
            />

            <span>
                {isTerkirim ? 'Status Email: Terkirim' : 'Status Email: Belum Terkirim'}
            </span>
        </span>
    );
}
