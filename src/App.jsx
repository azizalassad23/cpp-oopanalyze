import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import AccessGate from './components/AccessGate.jsx'
import AnalyzePage from './pages/AnalyzePage.jsx'
import ProblemsPage from './pages/ProblemsPage.jsx'
import { ambilKodeAkses, hapusKodeAkses, cekAkses } from './lib/api.js'

export default function App() {
  // Tab disimpan sebagai state biasa, bukan router — GitHub Pages tidak bisa
  // melayani rute dalam (deep link) tanpa trik 404.html.
  const [tab, setTab] = useState('analisa')
  const [status, setStatus] = useState('memeriksa') // memeriksa | perlu-kode | siap
  const [kuota, setKuota] = useState(null)
  // Soal yang sedang dikerjakan, dibawa dari tab Latihan Soal ke tab Analisa.
  const [soalAktif, setSoalAktif] = useState(null)

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
        onBerhasil={(k) => {
          setKuota(k)
          setStatus('siap')
        }}
      />
    )
  }

  return (
    <div className="min-h-screen">
      <Header tabAktif={tab} onGantiTab={setTab} kuota={kuota} onKeluar={keluar} />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {tab === 'analisa' ? (
          <AnalyzePage
            onKuotaBerubah={setKuota}
            soalAktif={soalAktif}
            onTutupSoal={() => setSoalAktif(null)}
          />
        ) : (
          <ProblemsPage
            onKuotaBerubah={setKuota}
            onKerjakan={(soal) => {
              setSoalAktif(soal)
              setTab('analisa')
            }}
          />
        )}
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-8 pt-2 text-center text-xs text-slate-400">
        M. Aziz Al Assad, S.T., Gr. — 2026
      </footer>
    </div>
  )
}
