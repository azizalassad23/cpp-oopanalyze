import { useState } from 'react'
import { simpanKodeAkses, hapusKodeAkses, cekAkses } from '../lib/api.js'

export default function AccessGate({ onBerhasil }) {
  const [kode, setKode] = useState('')
  const [memuat, setMemuat] = useState(false)
  const [galat, setGalat] = useState('')

  async function kirim(e) {
    e.preventDefault()
    if (!kode.trim()) return

    setMemuat(true)
    setGalat('')
    simpanKodeAkses(kode)

    try {
      const data = await cekAkses()
      onBerhasil(data.kuota)
    } catch (err) {
      hapusKodeAkses()
      setGalat(err.message)
    } finally {
      setMemuat(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 font-mono text-sm font-bold text-white">
            C++
          </div>
          <h1 className="text-xl font-semibold text-slate-900">CppAnalyze</h1>
          <p className="mt-1 text-sm text-slate-500">
            Masukkan kode akses kelas untuk mulai belajar.
          </p>
        </div>

        <form
          onSubmit={kirim}
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-700">Kode akses kelas</span>
            <input
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              autoFocus
              autoComplete="off"
              spellCheck={false}
              placeholder="Contoh: NAMAKELAS2026"
              className="rounded-lg border border-slate-200 px-3 py-2.5 font-mono text-sm tracking-wide text-slate-800 uppercase focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
            />
          </label>

          {galat && (
            <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {galat}
            </p>
          )}

          <button
            type="submit"
            disabled={memuat || !kode.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {memuat ? 'Memeriksa…' : 'Masuk'}
          </button>

          <p className="text-center text-[11px] leading-relaxed text-slate-400">
            Kode ini diberikan gurumu. Cukup dimasukkan sekali di perangkat ini.
          </p>
        </form>
      </div>
    </div>
  )
}
