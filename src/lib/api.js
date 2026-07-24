import { API_URL, API_BELUM_DISETEL } from '../config.js'

const KUNCI_KODE = 'cppanalyze:kode-akses'
const KUNCI_CLIENT = 'cppanalyze:client-id'

/** Kesalahan yang pesannya memang sudah layak ditampilkan apa adanya ke murid. */
export class GalatApi extends Error {
  constructor(kode, pesan, tambahan = {}) {
    super(pesan)
    this.kode = kode
    Object.assign(this, tambahan)
  }
}

/* ── Identitas perangkat ───────────────────────────────────────────── */

/**
 * Penanda acak per browser, dipakai server untuk menghitung jatah harian.
 * Bukan alat keamanan — murid bisa saja menghapusnya. Pengaman sebenarnya
 * adalah batas total kelas di Worker.
 */
export function clientId() {
  let id = localStorage.getItem(KUNCI_CLIENT)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KUNCI_CLIENT, id)
  }
  return id
}

/* ── Kode akses kelas ──────────────────────────────────────────────── */

export const ambilKodeAkses = () => localStorage.getItem(KUNCI_KODE) || ''
export const simpanKodeAkses = (kode) => localStorage.setItem(KUNCI_KODE, kode.trim())
export const hapusKodeAkses = () => localStorage.removeItem(KUNCI_KODE)

/* ── Pemanggilan ───────────────────────────────────────────────────── */

async function panggil(jalur, { metode = 'POST', badan } = {}) {
  if (API_BELUM_DISETEL) {
    throw new GalatApi(
      'belum_disetel',
      'Alamat server belum disetel di src/config.js. Hubungi gurumu.',
    )
  }

  let respons
  try {
    respons = await fetch(`${API_URL}${jalur}`, {
      method: metode,
      headers: {
        'Content-Type': 'application/json',
        'X-Kode-Akses': ambilKodeAkses(),
        'X-Client-Id': clientId(),
      },
      body: badan ? JSON.stringify(badan) : undefined,
    })
  } catch {
    throw new GalatApi(
      'jaringan',
      'Tidak bisa menghubungi server. Periksa koneksi internetmu, lalu coba lagi.',
    )
  }

  let data
  try {
    data = await respons.json()
  } catch {
    throw new GalatApi('balasan_rusak', 'Balasan server tidak bisa dibaca. Coba lagi.')
  }

  if (!respons.ok || data.ok === false) {
    throw new GalatApi(data.kode || 'galat', data.pesan || 'Terjadi kesalahan.', {
      kuota: data.kuota,
    })
  }

  return data
}

/** Memastikan kode akses benar sekaligus melihat sisa jatah harian. */
export const cekAkses = () => panggil('/sehat', { metode: 'GET' })

export const analisaKode = ({ kode, materiId, mode, stdin, hasilEksekusi }) =>
  panggil('/analisa', {
    badan: {
      kode,
      materiId: materiId === 'auto' ? null : materiId,
      mode,
      stdin,
      hasilEksekusi,
    },
  })

export const buatSoal = ({ materiId, tingkat }) =>
  panggil('/soal', { badan: { materiId, tingkat } })
