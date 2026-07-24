/**
 * Menjalankan kode C++ sungguhan lewat Wandbox, layanan terbuka dan gratis.
 *
 * Kode benar-benar dicompile dengan g++ lalu dijalankan. Jadi murid melihat
 * pesan compiler yang asli — bukan tebakan. Hasilnya juga dikirim ke Gemini
 * pada tahap analisa supaya penjelasannya berpijak pada kenyataan.
 *
 * Catatan: sebelumnya bagian ini memakai Piston, tetapi API publiknya ditutup
 * menjadi daftar putih pada 15 Februari 2026.
 */
const WANDBOX = 'https://wandbox.org/api/compile.json'

const COMPILER = 'gcc-13.2.0'
const OPSI = 'warning,gnu++17'
const BATAS_TUNGGU_MS = 30000

export class GalatRunner extends Error {}

/**
 * @returns {{status, compile, keluaran, galat, kodeKeluar, detik}}
 *   status: 'berhasil' | 'gagal-compile' | 'gagal-jalan' | 'kehabisan-waktu'
 */
export async function jalankanKode({ kode, stdin = '' }) {
  const mulai = Date.now()
  const batal = new AbortController()
  const pewaktu = setTimeout(() => batal.abort(), BATAS_TUNGGU_MS)

  let respons
  try {
    respons = await fetch(WANDBOX, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: batal.signal,
      body: JSON.stringify({
        compiler: COMPILER,
        code: kode,
        stdin,
        options: OPSI,
        save: false,
      }),
    })
  } catch (e) {
    throw new GalatRunner(
      e.name === 'AbortError'
        ? 'Server penjalan kode terlalu lama menjawab. Coba lagi sebentar lagi.'
        : 'Tidak bisa menghubungi server penjalan kode. Periksa koneksi internetmu.',
    )
  } finally {
    clearTimeout(pewaktu)
  }

  if (respons.status === 429) {
    throw new GalatRunner('Terlalu banyak yang menjalankan kode barusan. Tunggu beberapa detik.')
  }
  if (!respons.ok) {
    throw new GalatRunner('Server penjalan kode sedang bermasalah. Coba lagi nanti.')
  }

  const data = await respons.json()
  const detik = (Date.now() - mulai) / 1000
  const pesanCompiler = rapikan(data.compiler_error)
  const kodeKeluar = parseInt(data.status, 10)

  // Wandbox tidak menandai gagal-compile secara khusus: pesan galat dan
  // peringatan sama-sama masuk ke compiler_error. Yang membedakan, g++ selalu
  // menuliskan "error:" bila kompilasi benar-benar gagal.
  if (/\berror:/.test(pesanCompiler)) {
    return {
      status: 'gagal-compile',
      compile: pesanCompiler,
      keluaran: '',
      galat: '',
      kodeKeluar,
      detik,
    }
  }

  const keluaran = rapikan(data.program_output)
  const galat = rapikan(data.program_error)

  // Kode keluar di atas 128 berarti program dihentikan paksa oleh sistem.
  // 139 = 128+11 (SIGSEGV), biasanya akibat rekursi tanpa henti atau indeks
  // di luar array. 137 = 128+9 (SIGKILL), biasanya karena kelamaan berjalan.
  if (kodeKeluar === 137 || kodeKeluar === 124 || data.signal === 'Killed') {
    return {
      status: 'kehabisan-waktu',
      compile: pesanCompiler,
      keluaran,
      galat: galat || 'Program dihentikan karena berjalan terlalu lama.',
      kodeKeluar,
      detik,
    }
  }

  return {
    status: kodeKeluar === 0 ? 'berhasil' : 'gagal-jalan',
    // Peringatan compiler tetap ditampilkan walau kompilasi berhasil — sering
    // justru di situ letak petunjuk bug-nya.
    compile: pesanCompiler,
    keluaran,
    galat: galat || jelaskanKodeKeluar(kodeKeluar),
    kodeKeluar,
    detik,
  }
}

/**
 * Program yang mati karena sinyal sering tidak mencetak pesan apa pun, jadi
 * murid hanya melihat layar kosong. Angka mentahnya kita terjemahkan.
 */
function jelaskanKodeKeluar(kode) {
  if (kode === 139) {
    return 'Program berhenti mendadak (segmentation fault) — biasanya karena membaca indeks di luar array, memakai pointer kosong, atau rekursi yang tidak pernah berhenti.'
  }
  if (kode === 136) {
    return 'Program berhenti mendadak karena kesalahan hitung — biasanya pembagian atau modulo dengan nol.'
  }
  if (kode === 134) {
    return 'Program menghentikan dirinya sendiri (abort) — sering karena memori habis atau pemeriksaan di dalam pustaka gagal.'
  }
  return ''
}

/** Membuang nama berkas sementara Wandbox agar pesan galat tidak membingungkan. */
function rapikan(teks) {
  if (!teks) return ''
  return teks.replace(/\bprog\.cc\b/g, 'kode kamu').trim()
}
