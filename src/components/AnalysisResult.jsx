import { getMateri } from '../data/materi.js'

const STATUS = {
  benar: { ikon: '✅', judul: 'Kodenya sudah benar', kelas: 'bg-emerald-50 text-emerald-800 ring-emerald-100' },
  hampir: { ikon: '🟡', judul: 'Hampir benar, masih ada yang perlu diperbaiki', kelas: 'bg-amber-50 text-amber-800 ring-amber-100' },
  salah: { ikon: '❌', judul: 'Masih ada kesalahan yang membuat hasilnya keliru', kelas: 'bg-rose-50 text-rose-800 ring-rose-100' },
}

const KEPARAHAN = {
  kritis: { label: 'Kritis', kelas: 'bg-rose-100 text-rose-700' },
  penting: { label: 'Penting', kelas: 'bg-amber-100 text-amber-700' },
  saran: { label: 'Saran', kelas: 'bg-sky-100 text-sky-700' },
}

const HASIL_RUBRIK = {
  lolos: { ikon: '✓', kelas: 'text-emerald-600' },
  gagal: { ikon: '✕', kelas: 'text-rose-600' },
  tidakRelevan: { ikon: '–', kelas: 'text-slate-300' },
}

export default function AnalysisResult({ hasil, mode }) {
  const status = STATUS[hasil.status] || STATUS.hampir
  const materi = getMateri(hasil.materiTerdeteksi)

  return (
    <div className="flex flex-col gap-3">
      {/* Kesimpulan cepat */}
      <div className={`flex items-start gap-2.5 rounded-xl px-4 py-3 ring-1 ${status.kelas}`}>
        <span aria-hidden="true">{status.ikon}</span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{status.judul}</p>
          <p className="mt-0.5 text-xs opacity-80">
            Materi: {materi ? `${materi.ikon} ${materi.nama}` : 'di luar enam materi kelas'}
            {mode === 'petunjuk' && ' · Mode Petunjuk'}
          </p>
        </div>
      </div>

      <Kartu judul="Kode ini sebenarnya melakukan apa">
        <p className="text-sm leading-relaxed text-slate-700">{hasil.ringkasan}</p>
      </Kartu>

      <Skor skor={hasil.skor} />

      {hasil.temuan?.length > 0 ? (
        <Kartu judul={`Yang perlu diperbaiki (${hasil.temuan.length})`}>
          <div className="flex flex-col gap-3">
            {hasil.temuan.map((t, i) => (
              <Temuan key={i} temuan={t} />
            ))}
          </div>
        </Kartu>
      ) : (
        <Kartu judul="Yang perlu diperbaiki">
          <p className="text-sm text-slate-600">
            Tidak ditemukan masalah berarti. Kerja bagus! 🎉
          </p>
        </Kartu>
      )}

      <Kartu judul="Seberapa cepat dan boros kodenya">
        <div className="flex flex-wrap gap-2">
          <Lencana label="Waktu" nilai={hasil.kompleksitas.waktu} />
          <Lencana label="Memori" nilai={hasil.kompleksitas.memori} />
        </div>
        <p className="mt-2.5 text-sm leading-relaxed text-slate-700">
          {hasil.kompleksitas.penjelasan}
        </p>
      </Kartu>

      {hasil.pemeriksaanRubrik?.length > 0 && (
        <Kartu judul="Pemeriksaan poin demi poin">
          <ul className="flex flex-col gap-2.5">
            {hasil.pemeriksaanRubrik.map((p, i) => {
              const h = HASIL_RUBRIK[p.hasil] || HASIL_RUBRIK.tidakRelevan
              return (
                <li key={i} className="flex gap-2.5">
                  <span className={`mt-px shrink-0 font-bold ${h.kelas}`} aria-hidden="true">
                    {h.ikon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-700">{p.poin}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{p.catatan}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </Kartu>
      )}

      {hasil.langkahBerikutnya?.length > 0 && (
        <Kartu judul="Sebaiknya kamu pelajari berikutnya">
          <ul className="flex flex-col gap-2">
            {hasil.langkahBerikutnya.map((l, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed text-slate-700">
                <span className="text-indigo-400" aria-hidden="true">
                  →
                </span>
                {l}
              </li>
            ))}
          </ul>
        </Kartu>
      )}
    </div>
  )
}

function Temuan({ temuan }) {
  const k = KEPARAHAN[temuan.keparahan] || KEPARAHAN.saran

  return (
    <article className="rounded-lg border border-slate-200 p-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${k.kelas}`}>
          {k.label}
        </span>
        {temuan.baris > 0 && (
          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-600">
            baris {temuan.baris}
          </span>
        )}
      </div>

      <h4 className="mt-2 text-sm font-semibold text-slate-900">{temuan.judul}</h4>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{temuan.penjelasan}</p>

      {temuan.contohGagal && (
        <Bagian judul="Contoh yang bikin gagal" nada="rose">
          {temuan.contohGagal}
        </Bagian>
      )}

      {temuan.petunjuk && (
        <Bagian judul="Petunjuk memperbaiki" nada="indigo">
          {temuan.petunjuk}
        </Bagian>
      )}

      {temuan.perbaikan && (
        <div className="mt-2.5">
          <p className="mb-1 text-[11px] font-medium text-slate-500">Contoh perbaikan</p>
          <pre className="overflow-x-auto rounded-lg bg-slate-900 px-3 py-2.5 font-mono text-xs leading-relaxed text-slate-100">
            {temuan.perbaikan}
          </pre>
        </div>
      )}
    </article>
  )
}

function Bagian({ judul, nada, children }) {
  const kelas = {
    rose: 'border-rose-200 bg-rose-50/60 text-rose-900',
    indigo: 'border-indigo-200 bg-indigo-50/60 text-indigo-900',
  }[nada]

  return (
    <div className={`mt-2.5 rounded-lg border px-3 py-2 ${kelas}`}>
      <p className="text-[11px] font-semibold opacity-70">{judul}</p>
      <p className="mt-1 text-xs leading-relaxed whitespace-pre-wrap">{children}</p>
    </div>
  )
}

function Skor({ skor }) {
  if (!skor) return null

  const baris = [
    { label: 'Kebenaran', nilai: skor.kebenaran },
    { label: 'Efisiensi', nilai: skor.efisiensi },
    { label: 'Keterbacaan', nilai: skor.keterbacaan },
  ]

  return (
    <Kartu judul="Penilaian">
      <div className="flex flex-col gap-2.5">
        {baris.map((b) => (
          <div key={b.label} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs text-slate-600">{b.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${
                  b.nilai >= 70 ? 'bg-emerald-500' : b.nilai >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, b.nilai))}%` }}
              />
            </div>
            <span className="w-8 shrink-0 text-right font-mono text-xs text-slate-500">
              {b.nilai}
            </span>
          </div>
        ))}
      </div>
    </Kartu>
  )
}

function Lencana({ label, nilai }) {
  return (
    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
      {label}: <b className="font-mono text-slate-800">{nilai}</b>
    </span>
  )
}

function Kartu({ judul, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-2.5 text-sm font-semibold text-slate-900">{judul}</h3>
      {children}
    </section>
  )
}
