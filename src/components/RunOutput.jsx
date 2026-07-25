const TAMPILAN = {
  berhasil: {
    ikon: '✅',
    judul: 'Program berjalan sampai selesai',
    kelas:
      'bg-emerald-50 text-emerald-800 ring-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-200 dark:ring-emerald-900',
  },
  'gagal-compile': {
    ikon: '🚫',
    judul: 'Kode gagal dicompile',
    kelas:
      'bg-rose-50 text-rose-800 ring-rose-100 dark:bg-rose-950/50 dark:text-rose-200 dark:ring-rose-900',
    catatan:
      'Program belum sempat berjalan. Baca pesan compiler paling ATAS lebih dulu — galat di bawahnya sering hanya akibat beruntun dari yang pertama.',
  },
  'gagal-jalan': {
    ikon: '⚠️',
    judul: 'Program berhenti tidak wajar',
    kelas:
      'bg-amber-50 text-amber-800 ring-amber-100 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-900',
    catatan:
      'Kodenya berhasil dicompile, tetapi berhenti di tengah jalan. Biasanya karena membaca indeks di luar array, membagi dengan nol, atau rekursi yang tidak pernah berhenti.',
  },
  'kehabisan-waktu': {
    ikon: '⏱️',
    judul: 'Program dihentikan karena kelamaan',
    kelas:
      'bg-amber-50 text-amber-800 ring-amber-100 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-900',
    catatan:
      'Program berjalan terlalu lama lalu dihentikan server. Kemungkinan ada perulangan atau rekursi yang tidak pernah berhenti, atau algoritmanya terlalu lambat.',
  },
}

export default function RunOutput({ hasil }) {
  const tampilan = TAMPILAN[hasil.status] || TAMPILAN['gagal-jalan']

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Hasil menjalankan kode
        </h3>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          {hasil.detik.toFixed(1)} detik
        </span>
      </div>

      <div className={`flex items-start gap-2.5 rounded-lg px-3 py-2.5 ring-1 ${tampilan.kelas}`}>
        <span aria-hidden="true">{tampilan.ikon}</span>
        <div className="min-w-0">
          <p className="text-xs font-semibold">{tampilan.judul}</p>
          {tampilan.catatan && (
            <p className="mt-1 text-[11px] leading-relaxed opacity-90">{tampilan.catatan}</p>
          )}
        </div>
      </div>

      {hasil.status !== 'gagal-compile' && (
        <Kotak
          judul="Keluaran program"
          isi={hasil.keluaran}
          kosong="(program tidak mencetak apa pun)"
        />
      )}

      {hasil.compile && (
        <Kotak
          judul={hasil.status === 'gagal-compile' ? 'Pesan compiler' : 'Peringatan compiler'}
          isi={hasil.compile}
          nada={hasil.status === 'gagal-compile' ? 'galat' : 'peringatan'}
        />
      )}

      {hasil.galat && <Kotak judul="Pesan galat saat berjalan" isi={hasil.galat} nada="galat" />}

      {hasil.status === 'gagal-jalan' && (
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Kode keluar program: {hasil.kodeKeluar}
        </p>
      )}
    </section>
  )
}

function Kotak({ judul, isi, kosong, nada = 'biasa' }) {
  const warna = {
    biasa: 'bg-slate-900 text-slate-100',
    galat: 'bg-rose-950 text-rose-100',
    peringatan: 'bg-amber-950 text-amber-100',
  }[nada]

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{judul}</span>
      <pre
        className={`max-h-56 overflow-auto rounded-lg px-3 py-2.5 font-mono text-xs leading-relaxed whitespace-pre-wrap ${warna}`}
      >
        {isi || <span className="opacity-50">{kosong}</span>}
      </pre>
    </div>
  )
}
