import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import AccessGate from './components/AccessGate.jsx'
import AnalyzePage from './pages/AnalyzePage.jsx'
import ProblemsPage from './pages/ProblemsPage.jsx'
import { ambilKodeAkses, hapusKodeAkses, cekAkses } from './lib/api.js'
import { useTema } from './lib/tema.js'

export default function App() {
  // Tab disimpan sebagai state biasa, bukan router — GitHub Pages tidak bisa
  // melayani rute dalam (deep link) tanpa trik 404.html.
  const [tab, setTab] = useState('analisa')
  const [status, setStatus] = useState('memeriksa') // memeriksa | perlu-kode | siap
  const [kuota, setKuota] = useState(null)
  // Soal yang sedang dikerjakan, dibawa dari tab Latihan Soal ke tab Analisa.
  const [soalAktif, setSoalAktif] = useState(null)
  const [tema, gantiTema] = useTema()

  // Kode akses tersimpan di perangkat, jadi murid cukup mengetiknya sekali.
  useEffect(() => {
    if (!ambilKodeAkses()) {
      setStatus('perlu-kode')
      return
    }
    cekAkses()
      .then((data) => {
        setKuota(data.kuota)
        setStatus('siap')
      })
      .catch(() => {
        hapusKodeAkses()
        setStatus('perlu-kode')
      })
  }, [])

  function keluar() {
    hapusKodeAkses()
    setKuota(null)
    setStatus('perlu-kode')
  }

  if (status === 'memeriksa') {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">
        Memuat…
      </div>
    )
  }

  if (status === 'perlu-kode') {
    return (
      <AccessGate
        tema={tema}
        onGantiTema={gantiTema}
        onBerhasil={(k) => {
          setKuota(k)
          setStatus('siap')
        }}
      />
    )
  }

  return (
    <div className="min-h-screen">
      <Header
        tabAktif={tab}
        onGantiTab={setTab}
        kuota={kuota}
        onKeluar={keluar}
        tema={tema}
        onGantiTema={gantiTema}
      />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/*
          Kedua halaman sengaja tetap dipasang dan hanya disembunyikan.
          Bila dilepas, isi editor dan hasil analisa murid akan hilang setiap
          kali ia menengok tab Latihan Soal lalu kembali.
        */}
        <div className={tab === 'analisa' ? '' : 'hidden'}>
          <AnalyzePage
            onKuotaBerubah={setKuota}
            soalAktif={soalAktif}
            onTutupSoal={() => setSoalAktif(null)}
            tema={tema}
          />
        </div>

        <div className={tab === 'soal' ? '' : 'hidden'}>
          <ProblemsPage
            onKuotaBerubah={setKuota}
            onKerjakan={(soal) => {
              setSoalAktif(soal)
              setTab('analisa')
            }}
          />
        </div>
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-8 pt-2 text-center text-xs text-slate-400 dark:text-slate-500">
        M. Aziz Al Assad, S.T., Gr. — 2026
      </footer>
    </div>
  )
}
