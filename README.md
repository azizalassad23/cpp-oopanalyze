# CppAnalyze

Alat bantu belajar pemrograman C++ untuk siswa: **analisa kode** dan **latihan soal**,
dibatasi pada enam materi berikut.

| Materi | Cakupan |
|---|---|
| 🔁 Rekursi | base case, backtracking, memoization |
| 🔍 Pencarian dan Pengurutan | linear/binary search, sorting |
| 🧩 Strategi Pemecahan Masalah | greedy, divide & conquer, DP dasar |
| 🗂️ Struktur Data | array, stack, queue, linked list, map |
| 🌳 Graf dan Tree | BFS, DFS, traversal, shortest path |
| 📐 Geometri Dasar | jarak, luas, perpotongan garis |

## Arsitektur

```
GitHub Pages (static)  ──►  Cloudflare Worker  ──►  Gemini API
   Vite + React                (simpan API key,
   CodeMirror 6                 kode akses kelas,
                                rate limit)
        │
        └──────────────►  Wandbox API (compile & run C++)
```

API key Gemini **tidak pernah** ada di kode frontend — key disimpan sebagai secret
di Cloudflare Worker. Frontend hanya mengirim kode akses kelas.

## Menjalankan di komputer sendiri

```bash
npm install
```

```bash
npm run dev
```

## Deploy

Push ke branch `main` akan otomatis membangun dan menerbitkan situs lewat GitHub
Actions ke <https://azizalassad23.github.io/cpp-oopanalyze>.

Sekali saja di awal: buka **Settings → Pages** pada repo, lalu setel
**Source** menjadi **GitHub Actions**.

## Status pengerjaan

- [x] Tahap 1 — Fondasi: layout, editor C++, deploy otomatis
- [x] Tahap 2 — Cloudflare Worker sebagai proxy Gemini
- [x] Tahap 3 — Eksekusi kode C++ via Wandbox
- [x] Tahap 4 — Analisa kode berrubrik per materi
- [ ] Tahap 5 — Bank soal dan generate soal

## Catatan teknis

Penjalan kode memakai [Wandbox](https://wandbox.org), bukan Piston. API publik
Piston ditutup menjadi daftar putih pada 15 Februari 2026.
