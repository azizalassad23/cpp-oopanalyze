import { useState } from 'react'
import { getMateri } from '../data/materi.js'

const WARNA_TINGKAT = {
  mudah: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  sedang: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  sulit: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
}

export default function SoalView({ soal, dibuatAI = false, onKembali, onKerjakan }) {
  // Petunjuk dibuka satu per satu supaya murid mencoba berpikir dulu.
  const [petunjukTerbuka, setPetunjukTerbuka] = useState(0)
  const materi = getMateri(soal.materiId)

  return (
    <article className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {onKembali && (
          <button
            onClick={onKembali}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
          >
            ← Kembali
          </button>
        )}
        {materi && (
          <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {materi.ikon} {materi.nama}
          </span>
        )}
        <span
          className={`rounded-md px-2 py-1 text-[11px] font-semibold capitalize ${
            WARNA_TINGKAT[soal.tingkat] || WARNA_TINGKAT.sedang
          }`}
        >
          {soal.tingkat}
        </span>
        {soal.kompleksitasHarapan && (
          <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {soal.kompleksitasHarapan}
          </span>
        )}
      </div>

      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{soal.judul}</h2>

      {dibuatAI && (
        <p className="rounded-lg bg-amber-50 px-4 py-2.5 text-xs leading-relaxed text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
          ⚠️ Soal ini baru dibuat otomatis dan belum diperiksa gurumu. Contoh keluarannya
          sesekali bisa salah hitung. Kalau jawabanmu berbeda tetapi kamu yakin benar,
          tunjukkan ke gurumu.
        </p>
      )}

      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{soal.cerita}</p>

      <div className="rounded-xl border-l-4 border-indigo-500 bg-indigo-50/50 px-4 py-3 dark:bg-indigo-950/40">
        <p className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">TUGASMU</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
          {soal.tugas}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Kartu judul="Format masukan">{soal.formatInput}</Kartu>
        <Kartu judul="Format keluaran">{soal.formatOutput}</Kartu>
      </div>

      {soal.batasan?.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Batasan</h3>
          <ul className="flex flex-col gap-1">
            {soal.batasan.map((b, i) => (
              <li key={i} className="font-mono text-xs text-slate-600 dark:text-slate-400">
                • {b}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100">Contoh</h3>
        <div className="flex flex-col gap-4">
          {soal.contoh?.map((c, i) => (
            <div key={i}>
              <p className="mb-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Contoh {i + 1}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <BlokTeks label="Masukan" isi={c.input} />
                <BlokTeks label="Keluaran" isi={c.output} />
              </div>
              {c.penjelasan && (
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {c.penjelasan}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {soal.petunjuk?.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Petunjuk</h3>
          <p className="mt-0.5 mb-2.5 text-xs text-slate-500 dark:text-slate-400">
            Coba kerjakan sendiri dulu. Buka petunjuk hanya kalau benar-benar buntu.
          </p>

          <div className="flex flex-col gap-2">
            {soal.petunjuk.slice(0, petunjukTerbuka).map((p, i) => (
              <div key={i} className="rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-800">
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                  Petunjuk {i + 1}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {p}
                </p>
              </div>
            ))}
          </div>

          {petunjukTerbuka < soal.petunjuk.length && (
            <button
              onClick={() => setPetunjukTerbuka(petunjukTerbuka + 1)}
              className="mt-2.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-600 dark:text-slate-300 dark:hover:text-indigo-300"
            >
              💡 Buka petunjuk {petunjukTerbuka + 1} dari {soal.petunjuk.length}
            </button>
          )}
        </section>
      )}

      {onKerjakan && (
        <button
          onClick={() => onKerjakan(soal)}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          ✍️ Kerjakan soal ini di editor
        </button>
      )}
    </article>
  )
}

function Kartu({ judul, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100">{judul}</h3>
      <p className="text-xs leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-400">
        {children}
      </p>
    </section>
  )
}

function BlokTeks({ label, isi }) {
  return (
    <div>
      <p className="mb-1 text-[11px] text-slate-400 dark:text-slate-500">{label}</p>
      <pre className="overflow-x-auto rounded-lg bg-slate-900 px-3 py-2.5 font-mono text-xs leading-relaxed text-slate-100">
        {isi}
      </pre>
    </div>
  )
}
