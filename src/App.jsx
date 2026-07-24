import { useState } from 'react'
import Header from './components/Header.jsx'
import AnalyzePage from './pages/AnalyzePage.jsx'
import ProblemsPage from './pages/ProblemsPage.jsx'

export default function App() {
  // Tab disimpan sebagai state biasa, bukan router — GitHub Pages tidak bisa
  // melayani rute dalam (deep link) tanpa trik 404.html.
  const [tab, setTab] = useState('analisa')

  return (
    <div className="min-h-screen">
      <Header tabAktif={tab} onGantiTab={setTab} />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {tab === 'analisa' ? <AnalyzePage /> : <ProblemsPage />}
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-8 pt-2 text-center text-xs text-slate-400">
        CppAnalyze — alat bantu belajar, bukan pengganti latihan mandiri.
      </footer>
    </div>
  )
}
