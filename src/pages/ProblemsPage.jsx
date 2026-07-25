import { useState } from 'react'
import SoalView from '../components/SoalView.jsx'
import { MATERI, TINGKAT } from '../data/materi.js'
import BANK_SOAL from '../data/bank-soal.json'
import KERANGKA from '../data/kerangka.json'
import { buatSoal, GalatApi } from '../lib/api.js'

const WARNA = {
  violet:
    'bg-violet-50 text-violet-700 ring-violet-100 dark:bg-violet-950/60 dark:text-violet-300 dark:ring-violet-900',
  sky: 'bg-sky-50 text-sky-700 ring-sky-100 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-900',
  amber:
    'bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-900',
  emerald:
    'bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-900',
  rose: 'bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-900',
  cyan: 'bg-cyan-50 text-cyan-700 ring-cyan-100 dark:bg-cyan-950/60 dark:text-cyan-300 dark:ring-cyan-900',
}

const WARNA_TINGKAT = {
  mudah: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  sedang: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  sulit: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
}

export default function ProblemsPage({ onKuotaBerubah, onKerjakan }) {
  const [materiId, setMateriId] = useState(MATERI[0].id)
  const [tingkat, setTingkat] = useState('mudah')
  const [dibuka, setDibuka] = useState(null) // { soal, dibuatAI }
  const [membuat, setMembuat] = useState(false)
  const [galat, setGalat] = useState('')

  const materi = MATERI.find((m) => m.id === materiId)
  const soalTerpilih = BANK_SOAL.filter((s) => s.materiId === materiId && s.tingkat === tingkat)

  // Soal bank mengambil kerangka dari berkas, soal buatan AI membawanya sendiri.
  function kerjakan(soal) {
    onKerjakan?.({ ...soal, kerangka: soal.kerangka || KERANGKA[soal.id] || '' })
  }

  async function tekanBuatSoal() {
    setMembuat(true)
    setGalat('')
    try {
      const data = await buatSoal({ materiId, tingkat })
      setDibuka({ soal: data.hasil, dibuatAI: true })
      onKuotaBerubah?.(data.kuota)
    } catch (e) {
      setGalat(e instanceof GalatApi ? e.message : 'Gagal membuat soal. Coba lagi.')
      if (e.kuota) onKuotaBerubah?.(e.kuota)
    } finally {
      setMembuat(false)
    }
  }

  if (dibuka) {
    return (
      <div className="mx-auto max-w-3xl">
        <SoalView
          soal={dibuka.soal}
          dibuatAI={dibuka.dibuatAI}
          onKembali={() => setDibuka(null)}
          onKerjakan={kerjakan}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Latihan soal</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Pilih materi dan tingkat kesulitan, lalu kerjakan soalnya di editor.
        </p>
      </div>

      {/* Pemilih materi */}
      <div className="flex flex-wrap gap-2">
        {MATERI.map((m) => {
          const aktif = m.id === materiId
          return (
            <button
              key={m.id}
              onClick={() => setMateriId(m.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ring-1 transition ${
                aktif
                  ? WARNA[m.warna]
                  : 'bg-white text-slate-600 ring-slate-200 hover:ring-slate-300 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800 dark:hover:ring-slate-700'
              }`}
            >
              <span aria-hidden="true">{m.ikon}</span>
              {m.nama}
            </button>
          )
        })}
      </div>

      {/* Pemilih tingkat */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400">Tingkat:</span>
        {TINGKAT.map((t) => {
          const aktif = t.id === tingkat
          return (
            <button
              key={t.id}
              onClick={() => setTingkat(t.id)}
              title={t.ringkas}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                aktif
                  ? WARNA_TINGKAT[t.id]
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800'
              }`}
            >
              {t.nama}
            </button>
          )
        })}
      </div>

      {materi && (
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          <b className="text-slate-700 dark:text-slate-200">{materi.nama}</b> — {materi.ringkas}
        </p>
      )}

      {galat && (
        <p
          role="alert"
          className="rounded-lg bg-rose-50 px-4 py-3 text-xs text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
        >
          {galat}
        </p>
      )}

      {/* Daftar soal */}
      <div className="grid gap-3 sm:grid-cols-2">
        {soalTerpilih.map((s) => (
          <button
            key={s.id}
            onClick={() => setDibuka({ soal: s, dibuatAI: false })}
            className="flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
          >
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {s.judul}
            </span>
            <span className="line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {s.cerita}
            </span>
            <span className="mt-1 font-mono text-[11px] text-slate-400 dark:text-slate-500">
              Target: {s.kompleksitasHarapan}
            </span>
          </button>
        ))}

        <button
          onClick={tekanBuatSoal}
          disabled={membuat}
          className="flex min-h-[110px] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center transition hover:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900"
        >
          {membuat ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Sedang menyusun soal…
              </span>
            </>
          ) : (
            <>
              <span className="text-xl" aria-hidden="true">✨</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                Buat soal baru
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Soal segar dari AI, memakai jatah harianmu
              </span>
            </>
          )}
        </button>
      </div>

      <p className="text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
        Soal pada daftar di atas sudah diperiksa gurumu dan contoh keluarannya sudah diuji dengan
        compiler sungguhan. Soal buatan AI belum melalui pemeriksaan itu.
      </p>
    </div>
  )
}
