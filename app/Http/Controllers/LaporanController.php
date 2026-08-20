<?php

namespace App\Http\Controllers;

// ─── Framework & Third-Party Imports ──────────────────────────────────────────
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

// ─── Internal Imports ─────────────────────────────────────────────────────────
use App\Models\Pendaftaran;
use App\Models\PeriodeSpmb;

/**
 * Controller Laporan (Pelaporan dan Statistik Data Pendaftaran)
 *
 * Menyediakan halaman laporan rekap data pendaftaran beserta statistik
 * agregat yang ditujukan khusus untuk pengguna berstatus 'admin'.
 * Data pada halaman ini bersifat read-only dan digunakan sebagai acuan
 * pengambilan keputusan oleh panitia penerimaan.
 */
class LaporanController extends Controller
{
    /**
     * Menampilkan laporan statistik dan direktori data peserta didik.
     *
     * Mendukung pemfilteran berdasarkan status berkas dan jenis kelamin.
     * Statistik agregat (total, lulus, tidak lulus, dll.) dihitung secara
     * langsung dari database untuk memastikan data selalu mutakhir (real-time).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request): Response
    {
        // Hanya admin yang berwenang mengakses halaman laporan.
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Aksi ditolak.');
        }

        $status = $request->query('status');
        $gender = $request->query('gender');
        
        // [BARU] Filter periode
        $periodeId = $request->query('periode_id');
        $periodes  = PeriodeSpmb::orderBy('tahun', 'desc')->get();
        $periode   = $periodeId ? PeriodeSpmb::find($periodeId) : PeriodeSpmb::getAktif();

        // Eager load semua relasi untuk menghindari N+1 query problem pada tampilan tabel.
        $query = Pendaftaran::with(['user', 'dokumen', 'seleksi']);

        if ($periode) {
            $query->whereBetween('created_at', [
                $periode->getStartDate(),
                $periode->getEndDate(),
            ]);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($gender) {
            $query->where('jenis_kelamin', $gender);
        }

        $pendaftarans = $query->orderBy('nama_lengkap', 'asc')->get();

        // Base query untuk stats agar filter periode teraplikasi pada perhitungan statistik
        $baseQuery = Pendaftaran::query();
        if ($periode) {
            $baseQuery->whereBetween('created_at', [
                $periode->getStartDate(),
                $periode->getEndDate(),
            ]);
        }

        // Statistik agregat dihitung langsung dari database (bukan dari collection)
        // agar hasil selalu mencerminkan total keseluruhan data, bukan hanya data terfilter.
        $stats = [
            'total'       => (clone $baseQuery)->count(),
            'lulus'       => (clone $baseQuery)->where('status', 'lulus')->count(),
            'tidak_lulus' => (clone $baseQuery)->where('status', 'tidak_lulus')->count(),
            'menunggu'    => (clone $baseQuery)->where('status', 'menunggu_verifikasi')->count(),
            'laki_laki'   => (clone $baseQuery)->where('jenis_kelamin', 'L')->count(),
            'perempuan'   => (clone $baseQuery)->where('jenis_kelamin', 'P')->count(),
        ];

        return Inertia::render('Admin/Laporan', [
            'pendaftarans' => $pendaftarans,
            'stats'        => $stats,
            'filters'      => [
                'status' => $status,
                'gender' => $gender,
            ],
            'periodes'         => $periodes,           // [BARU]
            'selectedPeriodeId'=> $periodeId ? (int) $periodeId : null, // [BARU]
        ]);
    }

    /**
     * Ekspor data laporan ke format Excel (.xlsx) menggunakan native PHP ZipArchive
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function exportExcel(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Aksi ditolak.');
        }

        $status    = $request->query('status');
        $gender    = $request->query('gender');
        $periodeId = $request->query('periode_id');
        $periode   = $periodeId ? PeriodeSpmb::find($periodeId) : PeriodeSpmb::getAktif();

        $query = Pendaftaran::query();

        if ($periode) {
            $query->whereBetween('created_at', [
                $periode->getStartDate(),
                $periode->getEndDate(),
            ]);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($gender) {
            $query->where('jenis_kelamin', $gender);
        }

        $pendaftarans = $query->orderBy('nama_lengkap', 'asc')->get();

        // ── Build worksheet XML ──────────────────────────────────────────────────
        $headers = [
            'No', 'NIK', 'Nama Lengkap', 'Jenis Kelamin', 'Tempat Lahir',
            'Tanggal Lahir', 'Asal Sekolah', 'Nama Orang Tua', 'No HP Wali',
            'Status Seleksi', 'Tanggal Daftar',
        ];

        // Helper: escape XML
        $esc = fn($v) => htmlspecialchars((string) $v, ENT_XML1, 'UTF-8');

        // Shared strings akan kita pakai untuk string cells
        $sharedStrings = [];
        $ssIndex       = [];
        $addSS = function (string $val) use (&$sharedStrings, &$ssIndex): int {
            if (!isset($ssIndex[$val])) {
                $ssIndex[$val]        = count($sharedStrings);
                $sharedStrings[]      = $val;
            }
            return $ssIndex[$val];
        };

        // Kumpulkan rows
        $rows = [];

        // Header row (style index 1 = bold+green)
        $headerRow = [];
        foreach ($headers as $h) {
            $headerRow[] = ['t' => 's', 'v' => $addSS($h), 's' => 1];
        }
        $rows[] = $headerRow;

        // Data rows
        $i = 1;
        foreach ($pendaftarans as $p) {
            $rows[] = [
                ['t' => 'n', 'v' => $i++,      's' => 0],
                ['t' => 's', 'v' => $addSS((string)($p->nik ?? '')),                                  's' => 0],
                ['t' => 's', 'v' => $addSS((string)($p->nama_lengkap ?? '')),                         's' => 0],
                ['t' => 's', 'v' => $addSS($p->jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'),   's' => 0],
                ['t' => 's', 'v' => $addSS((string)($p->tempat_lahir ?? '')),                         's' => 0],
                ['t' => 's', 'v' => $addSS($p->tanggal_lahir ? $p->tanggal_lahir->format('d-m-Y') : ''), 's' => 0],
                ['t' => 's', 'v' => $addSS((string)($p->asal_sekolah ?? '')),                         's' => 0],
                ['t' => 's', 'v' => $addSS((string)($p->nama_orang_tua ?? '')),                       's' => 0],
                ['t' => 's', 'v' => $addSS((string)($p->no_hp_wali ?? '')),                           's' => 0],
                ['t' => 's', 'v' => $addSS(str_replace('_', ' ', strtoupper($p->status ?? ''))),      's' => 0],
                ['t' => 's', 'v' => $addSS($p->created_at ? $p->created_at->format('d-m-Y H:i:s') : ''), 's' => 0],
            ];
        }

        // ── Generate worksheet XML ───────────────────────────────────────────────
        $colLetters = ['A','B','C','D','E','F','G','H','I','J','K'];
        $wsXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n";
        $wsXml .= '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
        $wsXml .= '<sheetData>';
        foreach ($rows as $rIdx => $rowCells) {
            $rNum = $rIdx + 1;
            $wsXml .= '<row r="' . $rNum . '">';
            foreach ($rowCells as $cIdx => $cell) {
                $coord = $colLetters[$cIdx] . $rNum;
                $s     = $cell['s'];
                if ($cell['t'] === 'n') {
                    $wsXml .= '<c r="' . $coord . '" s="' . $s . '"><v>' . $cell['v'] . '</v></c>';
                } else {
                    $wsXml .= '<c r="' . $coord . '" t="s" s="' . $s . '"><v>' . $cell['v'] . '</v></c>';
                }
            }
            $wsXml .= '</row>';
        }
        $wsXml .= '</sheetData></worksheet>';

        // ── Shared strings XML ───────────────────────────────────────────────────
        $count  = count($sharedStrings);
        $ssXml  = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n";
        $ssXml .= '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="' . $count . '" uniqueCount="' . $count . '">';
        foreach ($sharedStrings as $s) {
            $ssXml .= '<si><t xml:space="preserve">' . $esc($s) . '</t></si>';
        }
        $ssXml .= '</sst>';

        // ── Styles XML (2 xf: normal + header bold+green) ────────────────────────
        $stylesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n";
        $stylesXml .= '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
        $stylesXml .= '<fonts count="2">';
        $stylesXml .= '<font><sz val="11"/><name val="Calibri"/></font>'; // font 0: normal
        $stylesXml .= '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>'; // font 1: bold white
        $stylesXml .= '</fonts>';
        $stylesXml .= '<fills count="3">';
        $stylesXml .= '<fill><patternFill patternType="none"/></fill>'; // fill 0
        $stylesXml .= '<fill><patternFill patternType="gray125"/></fill>'; // fill 1
        $stylesXml .= '<fill><patternFill patternType="solid"><fgColor rgb="FF1A7A4A"/></patternFill></fill>'; // fill 2: green
        $stylesXml .= '</fills>';
        $stylesXml .= '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>';
        $stylesXml .= '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>';
        $stylesXml .= '<cellXfs count="2">';
        $stylesXml .= '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>';  // xf 0: normal
        $stylesXml .= '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>'; // xf 1: header
        $stylesXml .= '</cellXfs>';
        $stylesXml .= '</styleSheet>';

        // ── Workbook XML ─────────────────────────────────────────────────────────
        $wbXml  = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n";
        $wbXml .= '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">';
        $wbXml .= '<sheets><sheet name="Data Pendaftar" sheetId="1" r:id="rId1"/></sheets>';
        $wbXml .= '</workbook>';

        // ── Relationships ────────────────────────────────────────────────────────
        $wbRels  = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n";
        $wbRels .= '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';
        $wbRels .= '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>';
        $wbRels .= '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>';
        $wbRels .= '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>';
        $wbRels .= '</Relationships>';

        $rootRels  = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n";
        $rootRels .= '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';
        $rootRels .= '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>';
        $rootRels .= '</Relationships>';

        $contentTypes  = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n";
        $contentTypes .= '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">';
        $contentTypes .= '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>';
        $contentTypes .= '<Default Extension="xml" ContentType="application/xml"/>';
        $contentTypes .= '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>';
        $contentTypes .= '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
        $contentTypes .= '<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>';
        $contentTypes .= '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>';
        $contentTypes .= '</Types>';

        // ── Buat file .xlsx (ZIP) di memory ──────────────────────────────────────
        $tmpFile  = tempnam(sys_get_temp_dir(), 'xlsx_');
        $zip      = new \ZipArchive();
        $zip->open($tmpFile, \ZipArchive::OVERWRITE);

        $zip->addFromString('[Content_Types].xml',              $contentTypes);
        $zip->addFromString('_rels/.rels',                      $rootRels);
        $zip->addFromString('xl/workbook.xml',                  $wbXml);
        $zip->addFromString('xl/_rels/workbook.xml.rels',       $wbRels);
        $zip->addFromString('xl/worksheets/sheet1.xml',         $wsXml);
        $zip->addFromString('xl/sharedStrings.xml',             $ssXml);
        $zip->addFromString('xl/styles.xml',                    $stylesXml);
        $zip->close();

        $fileName = 'Laporan_Pendaftar_SPMB_MI_Nurussalam_' . date('Y-m-d') . '.xlsx';
        $content  = file_get_contents($tmpFile);
        @unlink($tmpFile);

        return response($content, 200, [
            'Content-Type'        => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
            'Cache-Control'       => 'max-age=0',
        ]);
    }
}
