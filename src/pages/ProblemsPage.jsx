import { MATERI, TINGKAT } from '../data/materi.js'

const WARNA = {
  violet: 'bg-violet-50 text-violet-700 ring-violet-100',
  sky: 'bg-sky-50 text-sky-700 ring-sky-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  rose: 'bg-rose-50 text-rose-700 ring-rose-100',
  cyan: 'bg-cyan-50 text-cyan-700 ring-cyan-100',
}

export default function ProblemsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Pilih materi latihan</h2>
        <p className="mt-1 text-sm text-slate-500">
          Setiap materi berisi soal bertingkat: {TINGKAT.map((t) => t.nama).join(', ')}.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MATERI.map((m) => (
          <article
            key={m.id}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg ring-1 ${WARNA[m.warna]}`}
                aria-hidden="true"
              >
                {m.ikon}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900">{m.nama}</h3>
                <p className="mt-0.5 text-xs leading-snug text-slate-500">{m.ringkas}</p>
              </div>
            </div>

            <ul className="flex flex-wrap gap-1.5">
              {m.subtopik.map((s) => (
                <li
                  key={s}
                  className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-600"
                >
                  {s}
                </li>
              ))}
            </ul>

            <button
              disabled
              className="mt-auto rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Lihat soal
            </button>
          </article>
        ))}
      </div>

      <p className="rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-800">
        Bank soal dan tombol <b>Buat soal baru</b> akan diisi pada Tahap 5.
      </p>
    </div>
  )
}
