const BASIS = 'https://generativelanguage.googleapis.com/v1beta/models'

/**
 * Memanggil Gemini dan memaksa jawabannya berbentuk JSON sesuai skema.
 * Dengan begitu tampilan di web selalu rapi dan tidak bergantung pada
 * format tulisan bebas yang berubah-ubah tiap panggilan.
 */
export async function mintaJson(env, { sistem, perintah, skema, suhu = 0.3 }) {
  const model = env.GEMINI_MODEL || 'gemini-2.5-flash'

  const respons = await fetch(`${BASIS}/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: sistem }] },
      contents: [{ role: 'user', parts: [{ text: perintah }] }],
      generationConfig: {
        temperature: suhu,
        responseMimeType: 'application/json',
        responseSchema: skema,
      },
    }),
  })

  if (!respons.ok) {
    const rincian = await respons.text()
    throw new GalatGemini(respons.status, rincian)
  }

  const data = await respons.json()

  const alasanBerhenti = data?.candidates?.[0]?.finishReason
  if (alasanBerhenti === 'MAX_TOKENS') {
    throw new GalatGemini(502, 'Jawaban terpotong karena kodenya terlalu panjang.')
  }

  const teks = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
  if (!teks) throw new GalatGemini(502, 'Gemini tidak mengembalikan isi apa pun.')

  try {
    return JSON.parse(teks)
  } catch {
    throw new GalatGemini(502, 'Jawaban Gemini bukan JSON yang sah.')
  }
}

export class GalatGemini extends Error {
  constructor(status, rincian) {
    super(`Gemini gagal (${status})`)
    this.status = status
    this.rincian = rincian
  }

  /** Pesan yang aman dan mudah dimengerti untuk ditampilkan ke murid. */
  pesanUntukMurid() {
    if (this.status === 429) {
      return 'Server Gemini sedang sibuk atau kuota harian habis. Tunggu sebentar lalu coba lagi.'
    }
    if (this.status === 400) {
      return 'Permintaan ditolak Gemini. Coba perpendek kodenya, lalu ulangi.'
    }
    if (this.status === 401 || this.status === 403) {
      return 'Kunci API di server bermasalah. Laporkan ke gurumu.'
    }
    return 'Gagal menghubungi Gemini. Coba lagi beberapa saat lagi.'
  }
}
