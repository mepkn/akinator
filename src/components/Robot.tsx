type Props = { mood?: 'think' | 'happy' | 'sad'; className?: string }

export default function Robot({ mood = 'think', className = '' }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <line x1="60" y1="22" x2="60" y2="8" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" />
      <circle cx="60" cy="8" r="7" fill="#f59e0b" className={mood === 'think' ? 'animate-pulse' : ''} />
      <rect x="14" y="22" width="92" height="76" rx="22" fill="#6366f1" />
      <rect x="24" y="34" width="72" height="50" rx="14" fill="#e0e7ff" />
      <circle cx="44" cy="56" r="8" fill="#1e293b" />
      <circle cx="76" cy="56" r="8" fill="#1e293b" />
      <circle cx="47" cy="53" r="2.5" fill="#fff" />
      <circle cx="79" cy="53" r="2.5" fill="#fff" />
      {mood === 'happy' ? (
        <path d="M46 70 Q60 82 74 70" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />
      ) : mood === 'sad' ? (
        <path d="M48 76 Q60 68 72 76" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />
      ) : (
        <rect x="50" y="71" width="20" height="4" rx="2" fill="#1e293b" />
      )}
      <rect x="4" y="48" width="10" height="22" rx="5" fill="#818cf8" />
      <rect x="106" y="48" width="10" height="22" rx="5" fill="#818cf8" />
    </svg>
  )
}
