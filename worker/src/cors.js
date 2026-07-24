/** Hanya situs milik kita yang boleh memanggil Worker ini. */
export function headerCors(request, env) {
  const asal = request.headers.get('Origin') || ''
  const daftar = (env.ASAL_DIIZINKAN || '').split(',').map((s) => s.trim())
  const diizinkan = daftar.includes(asal)

  return {
    'Access-Control-Allow-Origin': diizinkan ? asal : daftar[0] || '',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Kode-Akses, X-Client-Id',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

export function balasJson(data, { status = 200, cors = {} } = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors },
  })
}

/** Galat dengan pesan berbahasa Indonesia yang bisa langsung dibaca murid. */
export function balasGalat(kode, pesan, { status = 400, cors = {}, ...tambahan } = {}) {
  return balasJson({ ok: false, kode, pesan, ...tambahan }, { status, cors })
}
