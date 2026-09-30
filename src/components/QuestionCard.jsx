import { useEffect } from 'react'
import { useIsPresent } from 'framer-motion'

export default function QuestionCard({ label, text, onAnswer: answer }) {
  // Ignore input while this card is animating out
  const isPresent = useIsPresent()
  const onAnswer = (ans) => isPresent && answer(ans)

  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLInputElement || e.repeat) return
      const k = e.key.toLowerCase()
      if (k === 'y') onAnswer('yes')
      if (k === 'n') onAnswer('no')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="text-center">
      <p className="text-lg font-semibold uppercase tracking-wider text-indigo-500">{label}</p>
      <h2 className="mt-3 text-3xl font-bold leading-snug text-slate-800 sm:text-4xl">{text}</h2>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6">
        <button
          onClick={() => onAnswer('yes')}
          className="rounded-2xl bg-emerald-500 py-5 text-3xl font-bold text-white shadow-lg transition hover:bg-emerald-600 active:scale-95"
        >
          Yes
        </button>
        <button
          onClick={() => onAnswer('no')}
          className="rounded-2xl bg-rose-500 py-5 text-3xl font-bold text-white shadow-lg transition hover:bg-rose-600 active:scale-95"
        >
          No
        </button>
      </div>
      <p className="mt-6 hidden text-base text-slate-400 sm:block">Keyboard: Y = Yes, N = No</p>
    </div>
  )
}
