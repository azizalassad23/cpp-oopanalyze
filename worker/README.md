# Worker CppAnalyze

Perantara antara halaman web dan Gemini. Tugasnya tiga:

1. **Menyimpan kunci Gemini** supaya tidak pernah terlihat di browser murid
2. **Memeriksa kode akses kelas** sebelum meneruskan permintaan
3. **Membatasi pemakaian** 30 kali/murid/hari dan 400 kali/kelas/hari

Penghitung kuota memakai Durable Object. KV sempat dipakai, tetapi hasil
bacanya disimpan di cache selama sekitar 60 detik sehingga permintaan yang
datang beruntun membaca angka lama dan batas hariannya tidak berlaku.

Prompt dan rubrik penilaian juga disimpan di sini, bukan di frontend. Jadi murid
tidak bisa membuka DevTools lalu memaksa Mode Petunjuk berubah jadi Mode
Pembahasan — permintaannya tetap diproses server sesuai aturan.

## Persiapan (cukup sekali)

### 1. Ambil kunci Gemini

Buka <https://aistudio.google.com/apikey> → **Create API key** → salin kuncinya.

### 2. Masuk ke Cloudflare

```bash
cd worker && npx wrangler login
```

Browser akan terbuka, klik **Allow**.

### 3. Terbitkan Worker

```bash
npx wrangler deploy
```

Cloudflare akan mencetak alamat seperti
`https://cpp-oopanalyze-api.namaanda.workers.dev`.

> **Urutannya penting.** Deploy harus dilakukan SEBELUM menyimpan rahasia,
> karena `wrangler secret put` menaruh rahasia ke Worker yang sudah ada di
> Cloudflare. Bila Worker-nya belum pernah diterbitkan, perintah itu gagal
> dengan pesan bahwa Worker tidak ditemukan.

Pada tahap ini Worker sudah hidup tetapi belum bisa dipakai — wajar, karena
rahasianya belum diisi. Lanjut ke langkah berikutnya.

### 4. Simpan dua rahasia

```bash
npx wrangler secret put GEMINI_API_KEY
```

Tempel kunci Gemini saat diminta, lalu tekan Enter. Ulangi untuk kode kelas:

```bash
npx wrangler secret put KODE_AKSES
```

Isi dengan kode akses kelas Anda. Rahasia langsung berlaku tanpa perlu deploy
ulang.

**Salin alamat itu ke [../src/config.js](../src/config.js)**, lalu commit dan
push agar halaman web tahu ke mana harus mengirim permintaan.

## Perawatan

| Keperluan | Perintah |
|---|---|
| Ganti kode akses kelas | `npx wrangler secret put KODE_AKSES` |
| Ganti kunci Gemini | `npx wrangler secret put GEMINI_API_KEY` |
| Ubah batas kuota / model | edit `[vars]` di `wrangler.toml`, lalu `npx wrangler deploy` |
| Melihat catatan galat langsung | `npx wrangler tail` |

Mengganti kode akses tidak perlu deploy ulang, dan efeknya langsung terasa —
kode lama otomatis tidak berlaku, murid tinggal memasukkan yang baru.

## Titik akhir

| Alamat | Kegunaan |
|---|---|
| `GET /sehat` | Memeriksa kode akses & melihat sisa kuota |
| `POST /analisa` | Menganalisa kode C++ |
| `POST /soal` | Membuat satu soal latihan |

Semuanya wajib membawa header `X-Kode-Akses` dan `X-Client-Id`.
