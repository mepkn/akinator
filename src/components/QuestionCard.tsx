import { useEffect } from 'react'
import { useIsPresent } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { bigButton } from '@/lib/styles'
import type { Answer } from '../utils/tree.ts'

type Props = { label: string; text: string; onAnswer: (answer: Answer) => void }

export default function QuestionCard({ label, text, onAnswer: answer }: Props) {
  // Ignore input while this card is animating out
  const isPresent = useIsPresent()
  const onAnswer = (ans: Answer) => {
    if (isPresent) answer(ans)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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
      <p className="text-lg font-semibold uppercase tracking-wider text-primary">{label}</p>
      <h2 className="mt-3 text-3xl font-bold leading-snug text-foreground sm:text-4xl">{text}</h2>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6">
        <Button
          onClick={() => onAnswer('yes')}
          className={`py-5 text-3xl ${bigButton} bg-emerald-500 text-white hover:bg-emerald-600`}
        >
          Yes
        </Button>
        <Button
          onClick={() => onAnswer('no')}
          className={`py-5 text-3xl ${bigButton} bg-rose-500 text-white hover:bg-rose-600`}
        >
          No
        </Button>
      </div>
      <p className="mt-6 hidden text-base text-muted-foreground sm:block">Keyboard: Y = Yes, N = No</p>
    </div>
  )
}
