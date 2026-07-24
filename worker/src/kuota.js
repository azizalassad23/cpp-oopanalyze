/**
 * Pembatas pemakaian harian.
 *
 * Dua lapis:
 *   1. per murid  — agar satu orang tidak menghabiskan jatah kelas
 *   2. total kelas — jaring pengaman bila kode akses bocor ke luar
 *
 * Penghitungnya disimpan di Durable Object, bukan KV. KV menyimpan hasil baca
 * di cache selama sekitar 60 detik, sehingga permintaan yang datang beruntun
 * membaca angka lama dan menulis angka yang sama berulang-ulang — batas
 * hariannya jadi tidak berlaku untuk pemakaian cepat. Durable Object
 * memberikan hitungan yang selalu tepat karena seluruh permintaan diproses
 * berurutan pada satu tempat.
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

/** Semua penghitung kelas ditaruh pada satu Durable Object yang sama. */
function penghitung(env) {
  return env.PENGHITUNG.get(env.PENGHITUNG.idFromName('kuota-harian'))
}

async function tanya(env, aksi, muatan) {
  const respons = await penghitung(env).fetch('https://kuota/', {
    method: 'POST',
    body: JSON.stringify({ aksi, ...muatan }),
  })
  return respons.json()
}

function batasan(env) {
  return {
    batasMurid: parseInt(env.BATAS_HARIAN_MURID, 10) || 30,
    batasTotal: parseInt(env.BATAS_HARIAN_TOTAL, 10) || 400,
  }
}

/**
 * Memeriksa apakah masih ada jatah, TANPA menguranginya.
 *
 * Pemeriksaan dan pengurangan sengaja dipisah supaya jatah murid hanya
 * berkurang bila Gemini benar-benar menjawab. Kalau server Gemini sedang
 * bermasalah, murid tidak ikut dirugikan.
 *
 * @returns {{boleh: boolean, alasan?: string, sisa: number, batas: number}}
 */
export async function periksaKuota(env, clientId) {
  const { batasMurid, batasTotal } = batasan(env)
  const { pakaiMurid, pakaiTotal } = await tanya(env, 'lihat', {
    hari: tanggalHariIni(),
    clientId,
  })

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

  return { boleh: true, sisa: batasMurid - pakaiMurid, batas: batasMurid }
}

/** Mengurangi jatah. Dipanggil hanya setelah permintaan berhasil dilayani. */
export async function naikkanKuota(env, clientId) {
  const { batasMurid } = batasan(env)
  const { pakaiMurid } = await tanya(env, 'naikkan', {
    hari: tanggalHariIni(),
    clientId,
  })
  return { sisa: Math.max(0, batasMurid - pakaiMurid), batas: batasMurid }
}

/** Melihat sisa kuota tanpa menguranginya. */
export async function lihatKuota(env, clientId) {
  const { batasMurid } = batasan(env)
  const { pakaiMurid } = await tanya(env, 'lihat', { hari: tanggalHariIni(), clientId })
  return { sisa: Math.max(0, batasMurid - pakaiMurid), batas: batasMurid }
}

/**
 * Durable Object penyimpan penghitung.
 *
 * Cloudflare menjamin hanya ada satu salinan aktif dan permintaannya diproses
 * satu per satu, sehingga tidak ada dua permintaan yang membaca angka sama
 * lalu sama-sama menulis angka+1.
 */
export class PenghitungKuota {
  constructor(state) {
    this.state = state
  }

  async fetch(request) {
    const { aksi, hari, clientId } = await request.json()

    // Ganti hari berarti semua hitungan kemarin sudah tidak berguna.
    const hariTersimpan = await this.state.storage.get('hari')
    if (hariTersimpan !== hari) {
      await this.state.storage.deleteAll()
      await this.state.storage.put('hari', hari)
    }

    const kunciMurid = `m:${clientId}`
    const kunciTotal = 't'

    let pakaiMurid = (await this.state.storage.get(kunciMurid)) || 0
    let pakaiTotal = (await this.state.storage.get(kunciTotal)) || 0

    if (aksi === 'naikkan') {
      pakaiMurid += 1
      pakaiTotal += 1
      await this.state.storage.put({ [kunciMurid]: pakaiMurid, [kunciTotal]: pakaiTotal })
    }

    return new Response(JSON.stringify({ pakaiMurid, pakaiTotal }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
