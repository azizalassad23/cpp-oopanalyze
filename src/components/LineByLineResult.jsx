import { getMateri } from '../data/materi.js'

/**
 * Tampilan mode "baris per baris".
 *
 * Fokusnya membantu murid memahami arti kode, bukan menilainya. Karena itu
 * tidak ada skor atau daftar kesalahan — hanya ringkasan, tujuan tiap fungsi,
 * lalu penelusuran baris demi baris.
 */
export default function LineByLineResult({ hasil }) {
  const materi = getMateri(hasil.materiTerdeteksi)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2.5 rounded-xl bg-sky-50 px-4 py-3 ring-1 ring-sky-100 dark:bg-sky-950/50 dark:ring-sky-900">
        <span aria-hidden="true">🔢</span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-sky-800 dark:text-sky-200">
            Penjelasan baris per baris
          </p>
          <p className="mt-0.5 text-xs text-sky-700/80 dark:text-sky-300/80">
            Materi: {materi ? `${materi.ikon} ${materi.nama}` : 'di luar enam materi kelas'}
          </p>
        </div>
      </div>

      <Kartu judul="Secara keseluruhan, program ini melakukan apa">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {hasil.ringkasan}
        </p>
      </Kartu>

      {hasil.penjelasanPerFungsi?.length > 0 && (
        <Kartu judul="Tujuan tiap bagian">
          <ul className="flex flex-col gap-2.5">
            {hasil.penjelasanPerFungsi.map((f, i) => (
              <li key={i} className="flex flex-col gap-0.5">
                <span className="font-mono text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  {f.nama}
                </span>
                <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {f.tujuan}
                </span>
              </li>
            ))}
          </ul>
        </Kartu>
      )}

      {hasil.langkah?.length > 0 && (
        <Kartu judul="Arti tiap baris">
          <ol className="flex flex-col gap-3">
            {hasil.langkah.map((l, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1.5 w-10 shrink-0 text-right font-mono text-[11px] text-slate-400 dark:text-slate-500">
                  {l.baris}
                </span>
                <div className="min-w-0 flex-1">
                  <pre className="overflow-x-auto rounded-lg bg-slate-900 px-3 py-2 font-mono text-xs leading-relaxed text-slate-100 dark:bg-slate-950">
                    {l.kode}
                  </pre>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {l.penjelasan}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Kartu>
      )}

      <p className="text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
        Sudah paham cara membaca kodenya? Coba mode <b>Pembahasan Menyeluruh</b> untuk melihat
        apakah ada yang perlu diperbaiki.
      </p>
    </div>
  )
}

function Kartu({ judul, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100">{judul}</h3>
      {children}
    </section>
  )
}
