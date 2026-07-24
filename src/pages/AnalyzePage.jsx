import { useState } from 'react'
import CodeEditor, { KODE_CONTOH } from '../components/CodeEditor.jsx'
import { MATERI } from '../data/materi.js'

export default function AnalyzePage() {
  const [kode, setKode] = useState(KODE_CONTOH)
  const [materiId, setMateriId] = useState('auto')
  const [mode, setMode] = useState('petunjuk')
  const [stdin, setStdin] = useState('5')

  const jumlahBaris = kode.split('\n').length

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* ── Kolom kiri: editor & pengaturan ───────────────────────── */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900">Kode C++ kamu</h2>
          <span className="text-xs text-slate-400">{jumlahBaris} baris</span>
        </div>

        <div className="h-[420px]">
          <CodeEditor value={kode} onChange={setKode} />
        </div>

        <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-700">Materi</span>
            <select
              value={materiId}
              onChange={(e) => setMateriId(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
            >
              <option value="auto">Deteksi otomatis</option>
              {MATERI.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.ikon} {m.nama}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-700">Input program (stdin)</span>
            <input
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Kosongkan bila program tidak butuh input"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-800 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
            />
          </label>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-xs font-medium text-slate-700">Cara membantu</span>
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
              <ModeButton
                aktif={mode === 'petunjuk'}
                onClick={() => setMode('petunjuk')}
                judul="Mode Petunjuk"
                ringkas="Ditunjukkan letak salahnya, kamu yang perbaiki"
              />
              <ModeButton
                aktif={mode === 'pembahasan'}
                onClick={() => setMode('pembahasan')}
                judul="Mode Pembahasan"
                ringkas="Penjelasan lengkap beserta kode perbaikan"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            disabled
            className="flex-1 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ▶ Jalankan Kode
          </button>
          <button
            disabled
            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            🔬 Analisa Kode
          </button>
        </div>
      </section>

      {/* ── Kolom kanan: hasil ────────────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-slate-900">Hasil</h2>
        <div className="flex min-h-[420px] flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <span className="text-3xl" aria-hidden="true">🔬</span>
          <p className="text-sm font-medium text-slate-700">Belum ada hasil</p>
          <p className="max-w-xs text-xs text-slate-500">
            Tulis atau tempel kode C++ di sebelah kiri, lalu tekan <b>Jalankan Kode</b> untuk
            melihat keluarannya, atau <b>Analisa Kode</b> untuk penjelasan lengkap.
          </p>
          <p className="mt-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700">
            Tombol aktif setelah Tahap 3 &amp; 4 selesai
          </p>
        </div>
      </section>
    </div>
  )
}

function ModeButton({ aktif, onClick, judul, ringkas }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-md px-3 py-2 text-left transition ${
        aktif ? 'bg-white shadow-sm' : 'hover:bg-slate-200/60'
      }`}
    >
      <span className={`block text-xs font-semibold ${aktif ? 'text-indigo-700' : 'text-slate-600'}`}>
        {judul}
      </span>
      <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">{ringkas}</span>
    </button>
  )
}
