export default function TemaToggle({ tema, onGanti }) {
  const gelap = tema === 'gelap'

  return (
    <button
      onClick={onGanti}
      title={gelap ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
      aria-label={gelap ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base transition hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      <span aria-hidden="true">{gelap ? '☀️' : '🌙'}</span>
    </button>
  )
}
