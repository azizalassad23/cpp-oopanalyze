/**
 * Memeriksa bank soal dengan cara menjalankan solusi referensi sungguhan.
 *
 * Setiap contoh masukan dijalankan lewat Wandbox, lalu keluarannya
 * dibandingkan dengan contoh keluaran yang tertulis di bank soal. Contoh yang
 * keluarannya salah hitung adalah kesalahan paling merusak pada aplikasi
 * belajar: murid mengerjakan dengan benar tetapi merasa dirinya keliru.
 *
 * Jalankan: npm run verifikasi-soal
 */
import { readFile } from 'node:fs/promises'
import { SOLUSI } from './solusi-referensi.mjs'

const WANDBOX = 'https://wandbox.org/api/compile.json'
const JEDA_MS = 400

const jeda = (ms) => new Promise((r) => setTimeout(r, ms))

async function jalankan(kode, stdin) {
  const respons = await fetch(WANDBOX, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      compiler: 'gcc-13.2.0',
      code: kode,
      stdin,
      options: 'warning,gnu++17',
      save: false,
    }),
  })
  if (!respons.ok) throw new Error(`Wandbox membalas ${respons.status}`)
  return respons.json()
}

/** Spasi di ujung baris dan baris kosong di akhir tidak dianggap beda. */
const samakan = (teks) =>
  (teks || '')
    .replace(/\r/g, '')
    .split('\n')
    .map((b) => b.trimEnd())
    .join('\n')
    .trim()

const soalSemua = JSON.parse(await readFile(new URL('../src/data/bank-soal.json', import.meta.url)))

let lolos = 0
let gagal = 0
const masalah = []

for (const soal of soalSemua) {
  const solusi = SOLUSI[soal.id]
  if (!solusi) {
    masalah.push(`${soal.id}: belum punya solusi referensi`)
    gagal++
    continue
  }

  for (const [i, contoh] of soal.contoh.entries()) {
    const label = `${soal.id} contoh ${i + 1}`
    try {
      const hasil = await jalankan(solusi, contoh.input)

      if (/\berror:/.test(hasil.compiler_error || '')) {
        masalah.push(`${label}: solusi referensi gagal dicompile\n${hasil.compiler_error}`)
        gagal++
        continue
      }

      const didapat = samakan(hasil.program_output)
      const diharapkan = samakan(contoh.output)

      if (didapat === diharapkan) {
        console.log(`  lolos  ${label}`)
        lolos++
      } else {
        console.log(`  GAGAL  ${label}`)
        masalah.push(
          `${label}\n    masukan     : ${JSON.stringify(contoh.input)}` +
            `\n    di bank soal: ${JSON.stringify(diharapkan)}` +
            `\n    sebenarnya  : ${JSON.stringify(didapat)}`,
        )
        gagal++
      }
    } catch (e) {
      console.log(`  GALAT  ${label}`)
      masalah.push(`${label}: ${e.message}`)
      gagal++
    }
    await jeda(JEDA_MS)
  }
}

console.log(`\n${lolos} lolos, ${gagal} gagal, dari ${soalSemua.length} soal\n`)

if (masalah.length) {
  console.log('Rincian masalah:\n')
  for (const m of masalah) console.log(`- ${m}\n`)
  process.exit(1)
}
