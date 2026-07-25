import { useEffect, useState } from 'react'

const KUNCI = 'cppanalyze:tema'

/** Pilihan tersimpan, atau ikuti pengaturan sistem bila belum pernah memilih. */
export function temaAwal() {
  const tersimpan = localStorage.getItem(KUNCI)
  if (tersimpan === 'terang' || tersimpan === 'gelap') return tersimpan
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang'
}

export function useTema() {
  const [tema, setTema] = useState(temaAwal)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'gelap')
    localStorage.setItem(KUNCI, tema)
  }, [tema])

  return [tema, () => setTema((t) => (t === 'gelap' ? 'terang' : 'gelap'))]
}
