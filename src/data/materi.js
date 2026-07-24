/**
 * Enam materi yang dicakup aplikasi ini.
 *
 * `rubrik` adalah checklist khusus per materi yang nanti disisipkan ke prompt
 * Gemini pada Tahap 4. Inilah yang membuat analisa terasa seperti diperiksa
 * guru, bukan sekadar komentar umum dari chatbot.
 */
export const MATERI = [
  {
    id: 'rekursi',
    nama: 'Rekursi',
    ikon: '🔁',
    warna: 'violet',
    ringkas: 'Fungsi yang memanggil dirinya sendiri untuk memecah masalah besar jadi kecil.',
    subtopik: [
      'Base case & recursive case',
      'Faktorial, Fibonacci, pangkat',
      'Rekursi pada array & string',
      'Backtracking sederhana',
      'Memoization',
    ],
    rubrik: [
      'Apakah base case ada, benar, dan pasti tercapai?',
      'Apakah setiap pemanggilan rekursif membuat masalah menjadi lebih kecil (konvergen)?',
      'Adakah risiko stack overflow karena kedalaman rekursi terlalu besar?',
      'Adakah subproblem yang dihitung berulang-ulang sehingga sebaiknya di-memoize?',
      'Apakah parameter dikirim by value padahal seharusnya by reference (boros memori)?',
      'Apakah nilai kembalian di setiap cabang benar-benar di-return?',
    ],
  },
  {
    id: 'pencarian-pengurutan',
    nama: 'Pencarian dan Pengurutan',
    ikon: '🔍',
    warna: 'sky',
    ringkas: 'Cara mencari data dan menyusun data agar terurut secara efisien.',
    subtopik: [
      'Linear search & binary search',
      'Bubble, selection, insertion sort',
      'Merge sort & quick sort',
      'sort() dan binary_search() dari STL',
      'Pengurutan dengan comparator',
    ],
    rubrik: [
      'Apakah binary search dipakai pada data yang benar-benar sudah terurut?',
      'Apakah batas low/high/mid benar dan loop pasti berhenti (tidak infinite loop)?',
      'Adakah risiko overflow pada perhitungan mid = (low + high) / 2?',
      'Apakah pemilihan algoritma sesuai ukuran data (O(n^2) untuk n besar akan TLE)?',
      'Apakah indeks batas array sudah aman (tidak out of bounds)?',
      'Apakah comparator konsisten (strict weak ordering) bila memakai sort kustom?',
    ],
  },
  {
    id: 'strategi-pemecahan',
    nama: 'Strategi Pemecahan Masalah',
    ikon: '🧩',
    warna: 'amber',
    ringkas: 'Pola berpikir untuk menyusun solusi: greedy, divide and conquer, dan sejenisnya.',
    subtopik: [
      'Brute force & optimasi',
      'Greedy',
      'Divide and conquer',
      'Dynamic programming dasar',
      'Two pointer & sliding window',
    ],
    rubrik: [
      'Apakah strategi yang dipilih benar-benar menghasilkan jawaban optimal, atau hanya kebetulan benar pada contoh?',
      'Jika greedy: adakah kasus di mana pilihan lokal terbaik justru merugikan di akhir?',
      'Apakah semua kasus khusus (data kosong, satu elemen, semua sama) sudah ditangani?',
      'Apakah kompleksitas solusi memenuhi batasan soal?',
      'Jika DP: apakah definisi state dan transisinya jelas dan benar?',
      'Apakah ada cara yang jauh lebih sederhana untuk hasil yang sama?',
    ],
  },
  {
    id: 'struktur-data',
    nama: 'Struktur Data',
    ikon: '🗂️',
    warna: 'emerald',
    ringkas: 'Cara menyimpan data agar operasi yang sering dipakai menjadi cepat.',
    subtopik: [
      'Array & vector',
      'Stack & queue',
      'Linked list',
      'Map, set, dan unordered_map',
      'Priority queue (heap)',
    ],
    rubrik: [
      'Apakah struktur data yang dipilih tepat untuk operasi yang paling sering dilakukan?',
      'Adakah kebocoran memori atau pointer menggantung pada linked list / alokasi manual?',
      'Apakah pointer diperiksa null sebelum di-dereference?',
      'Apakah pop/top dipanggil pada stack atau queue yang mungkin kosong?',
      'Apakah pemakaian map vs unordered_map sudah tepat (butuh terurut atau tidak)?',
      'Adakah penyalinan container besar yang tidak perlu (seharusnya pakai referensi)?',
    ],
  },
  {
    id: 'graf-tree',
    nama: 'Graf dan Tree',
    ikon: '🌳',
    warna: 'rose',
    ringkas: 'Merepresentasikan hubungan antar objek dan menelusurinya.',
    subtopik: [
      'Representasi graf (adjacency list & matrix)',
      'BFS & DFS',
      'Binary tree & traversal',
      'Binary search tree',
      'Shortest path sederhana',
    ],
    rubrik: [
      'Apakah simpul yang sudah dikunjungi ditandai, sehingga tidak terjebak siklus tak berujung?',
      'Apakah representasi graf sesuai (adjacency list untuk graf jarang, matrix untuk graf padat)?',
      'Apakah graf berarah / tak berarah ditangani konsisten saat menambah sisi?',
      'Apakah BFS memakai queue dan DFS memakai stack/rekursi dengan benar?',
      'Apakah kasus graf tidak terhubung (ada simpul yang tak terjangkau) sudah dipikirkan?',
      'Pada tree: apakah pointer anak null diperiksa sebelum ditelusuri?',
    ],
  },
  {
    id: 'geometri-dasar',
    nama: 'Geometri Dasar',
    ikon: '📐',
    warna: 'cyan',
    ringkas: 'Perhitungan titik, garis, dan bangun datar di bidang koordinat.',
    subtopik: [
      'Titik, jarak, dan gradien',
      'Luas & keliling bangun datar',
      'Perpotongan garis',
      'Cross product & orientasi titik',
      'Titik di dalam / luar bangun',
    ],
    rubrik: [
      'Apakah perbandingan bilangan pecahan memakai toleransi epsilon, bukan == langsung?',
      'Adakah pembagian yang berpotensi dibagi nol (misal garis vertikal)?',
      'Apakah tipe data cukup besar (int bisa overflow saat mengalikan koordinat)?',
      'Apakah rumus geometri yang dipakai sudah benar, termasuk penggunaan nilai mutlak?',
      'Apakah kasus degenerat (tiga titik segaris, panjang sisi nol) sudah ditangani?',
      'Apakah satuan sudut konsisten (radian vs derajat)?',
    ],
  },
]

export const getMateri = (id) => MATERI.find((m) => m.id === id)

export const TINGKAT = [
  { id: 'mudah', nama: 'Mudah', ringkas: 'Latihan dasar, satu konsep saja' },
  { id: 'sedang', nama: 'Sedang', ringkas: 'Gabungan konsep, perlu sedikit analisa' },
  { id: 'sulit', nama: 'Sulit', ringkas: 'Perlu strategi dan optimasi' },
]
