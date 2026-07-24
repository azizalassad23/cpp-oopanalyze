import { MATERI } from '../../src/data/materi.js'
import { headerCors, balasJson, balasGalat } from './cors.js'
import { periksaKuota, naikkanKuota, lihatKuota } from './kuota.js'

export { PenghitungKuota } from './kuota.js'
import { mintaJson, GalatGemini } from './gemini.js'
import { skemaAnalisa, SKEMA_SOAL } from './skema.js'
import {
  sistemAnalisa,
  perintahAnalisa,
  sistemSoal,
  perintahSoal,
} from './prompts.js'

const ID_MATERI = MATERI.map((m) => m.id)
const TINGKAT = ['mudah', 'sedang', 'sulit']
const MAKS_PANJANG_KODE = 20000
const MAKS_PANJANG_STDIN = 2000

export default {
  async fetch(request, env) {
    const cors = headerCors(request, env)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    const { pathname } = new URL(request.url)

    try {
      if (pathname === '/sehat') return await tanganiSehat(request, env, cors)
      if (pathname === '/analisa') return await tanganiAnalisa(request, env, cors)
      if (pathname === '/soal') return await tanganiSoal(request, env, cors)
      return balasGalat('tidak_ditemukan', 'Alamat tidak dikenal.', { status: 404, cors })
    } catch (e) {
      if (e instanceof GalatGemini) {
        console.error('Gemini gagal:', e.status, e.rincian)
        return balasGalat('gemini_gagal', e.pesanUntukMurid(), { status: 502, cors })
      }
      console.error('Galat tak terduga:', e?.stack || e)
      return balasGalat('galat_server', 'Terjadi kesalahan di server. Coba lagi ya.', {
        status: 500,
        cors,
      })
    }
  },
}

/* ── Penjaga pintu ─────────────────────────────────────────────────── */

/** Membandingkan dua teks dalam waktu tetap agar kode akses tidak bisa ditebak bertahap. */
function samaAman(a = '', b = '') {
  if (a.length !== b.length) return false
  let beda = 0
  for (let i = 0; i < a.length; i++) beda |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return beda === 0
}

/**
 * Memeriksa kode akses kelas dan identitas perangkat.
 * @returns {{galat?: Response, clientId?: string}}
 */
function periksaAkses(request, env, cors) {
  // Dirapikan di kedua sisi: nilai secret sering membawa spasi atau baris baru
  // yang tak terlihat saat ditempel dari clipboard atau disalurkan lewat pipa.
  const kode = (request.headers.get('X-Kode-Akses') || '').trim()
  if (!samaAman(kode, (env.KODE_AKSES || '').trim())) {
    return {
      galat: balasGalat('kode_salah', 'Kode akses kelas salah. Tanyakan lagi ke gurumu.', {
        status: 401,
        cors,
      }),
    }
  }

  const clientId = request.headers.get('X-Client-Id') || ''
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(clientId)) {
    return {
      galat: balasGalat('id_tidak_sah', 'Identitas perangkat tidak sah. Muat ulang halaman.', {
        status: 400,
        cors,
      }),
    }
  }

  return { clientId }
}

async function bacaBadan(request) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

/* ── Titik akhir ───────────────────────────────────────────────────── */

async function tanganiSehat(request, env, cors) {
  const { galat, clientId } = periksaAkses(request, env, cors)
  if (galat) return galat

  const kuota = await lihatKuota(env, clientId)
  return balasJson({ ok: true, kuota }, { cors })
}

async function tanganiAnalisa(request, env, cors) {
  if (request.method !== 'POST') {
    return balasGalat('metode_salah', 'Gunakan POST.', { status: 405, cors })
  }

  const { galat, clientId } = periksaAkses(request, env, cors)
  if (galat) return galat

  const badan = await bacaBadan(request)
  if (!badan) return balasGalat('badan_salah', 'Isi permintaan bukan JSON.', { status: 400, cors })

  const kode = typeof badan.kode === 'string' ? badan.kode : ''
  if (kode.trim().length < 10) {
    return balasGalat('kode_kosong', 'Kodenya masih kosong atau terlalu pendek.', {
      status: 400,
      cors,
    })
  }
  if (kode.length > MAKS_PANJANG_KODE) {
    return balasGalat(
      'kode_kepanjangan',
      `Kode terlalu panjang (maksimal ${MAKS_PANJANG_KODE} karakter).`,
      { status: 413, cors },
    )
  }

  const mode = badan.mode === 'pembahasan' ? 'pembahasan' : 'petunjuk'
  const materiId = ID_MATERI.includes(badan.materiId) ? badan.materiId : null
  const stdin = String(badan.stdin || '').slice(0, MAKS_PANJANG_STDIN)
  const hasilEksekusi = bersihkanHasilEksekusi(badan.hasilEksekusi)

  const jatah = await periksaKuota(env, clientId)
  if (!jatah.boleh) {
    return balasGalat('kuota_habis', jatah.alasan, { status: 429, cors, kuota: jatah })
  }

  const hasil = await mintaJson(env, {
    sistem: sistemAnalisa(mode),
    perintah: perintahAnalisa({ kode, materiId, stdin, hasilEksekusi }),
    skema: skemaAnalisa(mode),
    suhu: 0.2,
  })

  const kuota = await naikkanKuota(env, clientId)
  return balasJson({ ok: true, mode, hasil, kuota }, { cors })
}

async function tanganiSoal(request, env, cors) {
  if (request.method !== 'POST') {
    return balasGalat('metode_salah', 'Gunakan POST.', { status: 405, cors })
  }

  const { galat, clientId } = periksaAkses(request, env, cors)
  if (galat) return galat

  const badan = await bacaBadan(request)
  if (!badan) return balasGalat('badan_salah', 'Isi permintaan bukan JSON.', { status: 400, cors })

  if (!ID_MATERI.includes(badan.materiId)) {
    return balasGalat('materi_salah', 'Materi tidak dikenal.', { status: 400, cors })
  }
  const tingkat = TINGKAT.includes(badan.tingkat) ? badan.tingkat : 'sedang'

  const jatah = await periksaKuota(env, clientId)
  if (!jatah.boleh) {
    return balasGalat('kuota_habis', jatah.alasan, { status: 429, cors, kuota: jatah })
  }

  const hasil = await mintaJson(env, {
    sistem: sistemSoal(),
    perintah: perintahSoal({ materiId: badan.materiId, tingkat }),
    skema: SKEMA_SOAL,
    // Soal boleh lebih bervariasi daripada analisa, tapi jangan sampai ngawur.
    suhu: 0.9,
  })

  const kuota = await naikkanKuota(env, clientId)
  return balasJson(
    { ok: true, hasil: { ...hasil, materiId: badan.materiId, tingkat }, kuota },
    { cors },
  )
}

/** Hanya ambil bidang yang kita kenal, dan potong agar prompt tidak membengkak. */
function bersihkanHasilEksekusi(mentah) {
  if (!mentah || typeof mentah !== 'object') return null
  const ambil = (v) => (typeof v === 'string' ? v.slice(0, 4000) : '')
  return {
    status: ambil(mentah.status),
    compile: ambil(mentah.compile),
    keluaran: ambil(mentah.keluaran),
    galat: ambil(mentah.galat),
  }
}
