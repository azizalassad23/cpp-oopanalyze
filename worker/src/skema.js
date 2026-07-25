/**
 * Bentuk jawaban yang WAJIB dipatuhi Gemini.
 *
 * Karena strukturnya pasti, tampilan di web bisa dirender jadi kartu-kartu
 * yang rapi — bukan gumpalan teks panjang yang bikin murid malas membaca.
 */

const teks = (deskripsi) => ({ type: 'STRING', description: deskripsi })

const pilihan = (nilai, deskripsi) => ({
  type: 'STRING',
  format: 'enum',
  enum: nilai,
  description: deskripsi,
})

/**
 * Skema analisa kode.
 * @param {'petunjuk'|'pembahasan'} mode
 *   Pada mode 'petunjuk', properti `perbaikan` sengaja TIDAK dimasukkan ke
 *   skema sama sekali. Jadi kode jadi tidak mungkin bocor — bukan sekadar
 *   disembunyikan di tampilan, tapi memang tidak pernah dibuat.
 */
export function skemaAnalisa(mode) {
  const temuan = {
    type: 'OBJECT',
    properties: {
      baris: {
        type: 'INTEGER',
        description: 'Nomor baris kode yang bermasalah. Isi 0 bila masalahnya menyeluruh.',
      },
      keparahan: pilihan(
        ['kritis', 'penting', 'saran'],
        'kritis = program salah/gagal jalan, penting = jalan tapi bisa keliru pada kasus tertentu, saran = sekadar perbaikan gaya',
      ),
      judul: teks('Ringkasan masalah dalam satu kalimat pendek dan jelas.'),
      penjelasan: teks(
        'Penjelasan mengapa ini masalah, ditulis untuk siswa SMA. Gunakan bahasa sehari-hari dan analogi bila perlu.',
      ),
      contohGagal: teks(
        'Contoh input konkret yang membuat kode ini keliru, beserta hasil yang keluar dan hasil yang seharusnya. Kosongkan bila tidak relevan.',
      ),
      petunjuk: teks(
        'Arahan cara memperbaikinya TANPA menuliskan kode jadi. Boleh berupa pertanyaan pemandu.',
      ),
    },
    required: ['baris', 'keparahan', 'judul', 'penjelasan', 'petunjuk'],
    propertyOrdering: ['baris', 'keparahan', 'judul', 'penjelasan', 'contohGagal', 'petunjuk'],
  }

  if (mode === 'pembahasan') {
    temuan.properties.perbaikan = teks(
      'Potongan kode C++ yang sudah diperbaiki untuk bagian ini saja, bukan seluruh program.',
    )
    temuan.required.push('perbaikan')
    temuan.propertyOrdering.push('perbaikan')
  }

  return {
    type: 'OBJECT',
    properties: {
      ringkasan: teks(
        'Dua sampai tiga kalimat: sebenarnya kode ini melakukan apa? Tulis seolah menjelaskan ke teman sekelas.',
      ),
      materiTerdeteksi: pilihan(
        [
          'rekursi',
          'pencarian-pengurutan',
          'strategi-pemecahan',
          'struktur-data',
          'graf-tree',
          'geometri-dasar',
          'lainnya',
        ],
        'Materi yang paling menonjol pada kode ini.',
      ),
      status: pilihan(
        ['benar', 'hampir', 'salah'],
        'benar = tidak ada masalah berarti, hampir = jalan tapi ada kasus yang keliru, salah = tidak berjalan atau hasilnya keliru',
      ),
      temuan: {
        type: 'ARRAY',
        description:
          'Daftar masalah, diurutkan dari yang paling parah. Kosongkan array bila kode sudah benar. Maksimal 6 temuan.',
        items: temuan,
      },
      kompleksitas: {
        type: 'OBJECT',
        properties: {
          waktu: teks('Notasi O besar untuk waktu, contoh: O(n log n)'),
          memori: teks('Notasi O besar untuk memori, contoh: O(n)'),
          penjelasan: teks(
            'Artinya apa dalam bahasa sehari-hari. Sebutkan perkiraan jumlah langkah pada data besar, misal "kalau datanya 1 juta, butuh sekitar 1 triliun langkah sehingga pasti kehabisan waktu".',
          ),
        },
        required: ['waktu', 'memori', 'penjelasan'],
        propertyOrdering: ['waktu', 'memori', 'penjelasan'],
      },
      pemeriksaanRubrik: {
        type: 'ARRAY',
        description: 'Hasil pemeriksaan terhadap setiap poin rubrik materi yang diberikan.',
        items: {
          type: 'OBJECT',
          properties: {
            poin: teks('Poin rubrik yang diperiksa, disalin persis.'),
            hasil: pilihan(['lolos', 'gagal', 'tidakRelevan'], 'Hasil pemeriksaan poin ini.'),
            catatan: teks('Satu kalimat alasan singkat.'),
          },
          required: ['poin', 'hasil', 'catatan'],
          propertyOrdering: ['poin', 'hasil', 'catatan'],
        },
      },
      skor: {
        type: 'OBJECT',
        description: 'Penilaian 0-100 per aspek.',
        properties: {
          kebenaran: { type: 'INTEGER' },
          efisiensi: { type: 'INTEGER' },
          keterbacaan: { type: 'INTEGER' },
        },
        required: ['kebenaran', 'efisiensi', 'keterbacaan'],
        propertyOrdering: ['kebenaran', 'efisiensi', 'keterbacaan'],
      },
      langkahBerikutnya: {
        type: 'ARRAY',
        description: 'Dua sampai empat saran singkat: sebaiknya murid ini belajar/berlatih apa.',
        items: { type: 'STRING' },
      },
    },
    required: [
      'ringkasan',
      'materiTerdeteksi',
      'status',
      'temuan',
      'kompleksitas',
      'pemeriksaanRubrik',
      'skor',
      'langkahBerikutnya',
    ],
    propertyOrdering: [
      'ringkasan',
      'materiTerdeteksi',
      'status',
      'temuan',
      'kompleksitas',
      'pemeriksaanRubrik',
      'skor',
      'langkahBerikutnya',
    ],
  }
}

/** Skema soal latihan. */
export const SKEMA_SOAL = {
  type: 'OBJECT',
  properties: {
    judul: teks('Judul soal yang singkat dan menarik.'),
    cerita: teks(
      'Latar cerita soal, 2-4 kalimat, memakai konteks keseharian siswa Indonesia (sekolah, warung, angkot, dan sejenisnya).',
    ),
    tugas: teks('Kalimat tegas berisi apa yang harus dihitung atau dicetak program.'),
    formatInput: teks('Penjelasan baris demi baris bentuk masukan.'),
    formatOutput: teks('Penjelasan bentuk keluaran.'),
    batasan: {
      type: 'ARRAY',
      description: 'Batasan nilai, contoh: 1 <= n <= 1000',
      items: { type: 'STRING' },
    },
    contoh: {
      type: 'ARRAY',
      description:
        'Tepat dua contoh kasus. Hitung ulang dengan teliti agar keluarannya benar-benar cocok dengan masukannya.',
      items: {
        type: 'OBJECT',
        properties: {
          input: teks('Masukan persis seperti yang diketik, pakai baris baru bila perlu.'),
          output: teks('Keluaran yang benar untuk masukan di atas.'),
          penjelasan: teks('Mengapa keluarannya demikian, langkah demi langkah.'),
        },
        required: ['input', 'output', 'penjelasan'],
        propertyOrdering: ['input', 'output', 'penjelasan'],
      },
    },
    petunjuk: {
      type: 'ARRAY',
      description:
        'Dua sampai tiga petunjuk bertingkat, dari yang paling samar ke yang paling jelas. Jangan pernah memuat kode jadi.',
      items: { type: 'STRING' },
    },
    kompleksitasHarapan: teks('Kompleksitas solusi yang diharapkan, contoh: O(n log n)'),
    kerangka: teks(
      'Kerangka kode C++ awal. Bagian membaca masukan dan mencetak keluaran WAJIB sudah lengkap dan benar sesuai format soal. Bagian logika penyelesaiannya dikosongkan dan diganti komentar berawalan "// TODO:" beserta petunjuk singkat. Kerangka ini WAJIB bisa dicompile apa adanya.',
    ),
  },
  required: [
    'judul',
    'cerita',
    'tugas',
    'formatInput',
    'formatOutput',
    'batasan',
    'contoh',
    'petunjuk',
    'kompleksitasHarapan',
    'kerangka',
  ],
  propertyOrdering: [
    'judul',
    'cerita',
    'tugas',
    'formatInput',
    'formatOutput',
    'batasan',
    'contoh',
    'petunjuk',
    'kompleksitasHarapan',
    'kerangka',
  ],
}
