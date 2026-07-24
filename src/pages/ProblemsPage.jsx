import { useState } from 'react'
import SoalView from '../components/SoalView.jsx'
import { MATERI, TINGKAT } from '../data/materi.js'
import BANK_SOAL from '../data/bank-soal.json'
import { buatSoal, GalatApi } from '../lib/api.js'

const WARNA = {
  violet: 'bg-violet-50 text-violet-700 ring-violet-100',
  sky: 'bg-sky-50 text-sky-700 ring-sky-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  rose: 'bg-rose-50 text-rose-700 ring-rose-100',
  cyan: 'bg-cyan-50 text-cyan-700 ring-cyan-100',
}

const WARNA_TINGKAT = {
  mudah: 'bg-emerald-100 text-emerald-700',
  sedang: 'bg-amber-100 text-amber-700',
  sulit: 'bg-rose-100 text-rose-700',
}

export default function ProblemsPage({ onKuotaBerubah, onKerjakan }) {
  const [materiId, setMateriId] = useState(MATERI[0].id)
  const [tingkat, setTingkat] = useState('mudah')
  const [dibuka, setDibuka] = useState(null) // { soal, dibuatAI }
  const [membuat, setMembuat] = useState(false)
  const [galat, setGalat] = useState('')

  const materi = MATERI.find((m) => m.id === materiId)
  const soalTerpilih = BANK_SOAL.filter((s) => s.materiId === materiId && s.tingkat === tingkat)

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
          onKerjakan={onKerjakan}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Latihan soal</h2>
        <p className="mt-1 text-sm text-slate-500">
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
                aktif ? WARNA[m.warna] : 'bg-white text-slate-600 ring-slate-200 hover:ring-slate-300'
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
        <span className="text-xs text-slate-500">Tingkat:</span>
        {TINGKAT.map((t) => {
          const aktif = t.id === tingkat
          return (
            <button
              key={t.id}
              onClick={() => setTingkat(t.id)}
              title={t.ringkas}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                aktif ? WARNA_TINGKAT[t.id] : 'bg-white text-slate-600 ring-1 ring-slate-200'
              }`}
            >
              {t.nama}
            </button>
          )
        })}
      </div>

      {materi && (
        <p className="text-xs leading-relaxed text-slate-500">
          <b className="text-slate-700">{materi.nama}</b> — {materi.ringkas}
        </p>
      )}

      {galat && (
        <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {galat}
        </p>
      )}

      {/* Daftar soal */}
      <div className="grid gap-3 sm:grid-cols-2">
        {soalTerpilih.map((s) => (
          <button
            key={s.id}
            onClick={() => setDibuka({ soal: s, dibuatAI: false })}
            className="flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-300"
          >
            <span className="text-sm font-semibold text-slate-900">{s.judul}</span>
            <span className="line-clamp-2 text-xs leading-relaxed text-slate-500">{s.cerita}</span>
            <span className="mt-1 font-mono text-[11px] text-slate-400">
              Target: {s.kompleksitasHarapan}
            </span>
          </button>
        ))}

        <button
          onClick={tekanBuatSoal}
          disabled={membuat}
          className="flex min-h-[110px] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center transition hover:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {membuat ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
              <span className="text-xs font-medium text-slate-600">Sedang menyusun soal…</span>
            </>
          ) : (
            <>
              <span className="text-xl" aria-hidden="true">✨</span>
              <span className="text-xs font-medium text-slate-700">Buat soal baru</span>
              <span className="text-[11px] text-slate-400">
                Soal segar dari AI, memakai jatah harianmu
              </span>
            </>
          )}
        </button>
      </div>

      <p className="text-[11px] leading-relaxed text-slate-400">
        Soal pada daftar di atas sudah diperiksa gurumu dan contoh keluarannya sudah diuji dengan
        compiler sungguhan. Soal buatan AI belum melalui pemeriksaan itu.
      </p>
    </div>
  )
}
