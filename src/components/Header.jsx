const TABS = [
  { id: 'analisa', nama: 'Analisa Kode', ikon: '🔬' },
  { id: 'soal', nama: 'Latihan Soal', ikon: '📝' },
]

export default function Header({ tabAktif, onGantiTab, kuota, onKeluar }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 font-mono text-sm font-bold text-white">
            C++
          </div>
          <div className="leading-tight">
            <h1 className="text-base font-semibold text-slate-900">CppAnalyze</h1>
            <p className="text-xs text-slate-500">Analisa kode &amp; latihan soal pemrograman</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <nav className="flex flex-1 gap-1 rounded-xl bg-slate-100 p-1">
            {TABS.map((tab) => {
              const aktif = tab.id === tabAktif
              return (
                <button
                  key={tab.id}
                  onClick={() => onGantiTab(tab.id)}
                  aria-current={aktif ? 'page' : undefined}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition sm:flex-none ${
                    aktif
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span aria-hidden="true">{tab.ikon}</span>
                  {tab.nama}
                </button>
              )
            })}
          </nav>

          {kuota && <SisaKuota kuota={kuota} />}

          <button
            onClick={onKeluar}
            title="Keluar dan hapus kode akses dari perangkat ini"
            className="shrink-0 rounded-lg px-2 py-2 text-xs font-medium text-slate-400 transition hover:text-slate-700"
          >
            Keluar
          </button>
        </div>
      </div>
    </header>
  )
}

/** Sisa jatah pemakaian hari ini, agar murid bisa mengatur sendiri pemakaiannya. */
function SisaKuota({ kuota }) {
  const menipis = kuota.sisa <= 5

  return (
    <div
      title={`Jatah hari ini: ${kuota.sisa} dari ${kuota.batas}`}
      className={`hidden shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium sm:block ${
        menipis ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'
      }`}
    >
      Sisa {kuota.sisa}
      <span className="text-slate-400">/{kuota.batas}</span>
    </div>
  )
}
