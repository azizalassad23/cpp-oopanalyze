/**
 * Pembatas pemakaian harian.
 *
 * Dua lapis:
 *   1. per murid  — agar satu orang tidak menghabiskan jatah kelas
 *   2. total kelas — jaring pengaman bila kode akses bocor ke luar
 *
 * KV bersifat eventually consistent, jadi hitungan bisa meleset satu-dua bila
 * ada dua permintaan tepat bersamaan. Untuk kelas berisi 10 murid, selisih
 * sekecil itu tidak masalah.
 */

/** Tanggal hari ini menurut zona waktu Indonesia Barat, format YYYY-MM-DD. */
export function tanggalHariIni() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

const KEDALUWARSA_DETIK = 60 * 60 * 36 // 36 jam, cukup untuk melewati pergantian hari

async function baca(env, kunci) {
  const nilai = await env.KUOTA.get(kunci)
  return nilai ? parseInt(nilai, 10) || 0 : 0
}

async function tambah(env, kunci, sekarang) {
  await env.KUOTA.put(kunci, String(sekarang + 1), { expirationTtl: KEDALUWARSA_DETIK })
}

/**
 * Memeriksa sekaligus menaikkan penghitung.
 * @returns {{boleh: boolean, alasan?: string, sisa: number, batas: number}}
 */
export async function pakaiKuota(env, clientId) {
  const hari = tanggalHariIni()
  const batasMurid = parseInt(env.BATAS_HARIAN_MURID, 10) || 30
  const batasTotal = parseInt(env.BATAS_HARIAN_TOTAL, 10) || 400

  const kunciMurid = `kuota:${hari}:${clientId}`
  const kunciTotal = `kuota:${hari}:__total__`

  const [pakaiMurid, pakaiTotal] = await Promise.all([
    baca(env, kunciMurid),
    baca(env, kunciTotal),
  ])

  if (pakaiMurid >= batasMurid) {
    return {
      boleh: false,
      alasan: `Jatah harianmu sudah habis (${batasMurid} kali per hari). Coba lagi besok, atau minta gurumu menaikkan batasnya.`,
      sisa: 0,
      batas: batasMurid,
    }
  }

  if (pakaiTotal >= batasTotal) {
    return {
      boleh: false,
      alasan: 'Jatah harian seluruh kelas sudah habis. Coba lagi besok ya.',
      sisa: 0,
      batas: batasMurid,
    }
  }

  await Promise.all([
    tambah(env, kunciMurid, pakaiMurid),
    tambah(env, kunciTotal, pakaiTotal),
  ])

  return { boleh: true, sisa: batasMurid - pakaiMurid - 1, batas: batasMurid }
}

/** Melihat sisa kuota tanpa menguranginya. */
export async function lihatKuota(env, clientId) {
  const hari = tanggalHariIni()
  const batasMurid = parseInt(env.BATAS_HARIAN_MURID, 10) || 30
  const pakaiMurid = await baca(env, `kuota:${hari}:${clientId}`)
  return { sisa: Math.max(0, batasMurid - pakaiMurid), batas: batasMurid }
}
