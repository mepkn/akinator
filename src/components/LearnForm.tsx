import { useState, type FormEvent } from 'react'
import QuestionCard from './QuestionCard.tsx'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { bigButton } from '@/lib/styles'
import { cleanAnimalName, cleanQuestion, hasAnimal, withArticle } from '../utils/tree.ts'
import type { Answer, TreeNode } from '../utils/tree.ts'

type Props = {
  tree: TreeNode
  oldAnimal: string
  onLearn: (name: string, question: string, answer: Answer) => void
}

export default function LearnForm({ tree, oldAnimal, onLearn }: Props) {
  const [step, setStep] = useState<'name' | 'question' | 'answer'>('name')
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [question, setQuestion] = useState('')

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (step === 'name') {
      const res = cleanAnimalName(value)
      if (!res.ok) return setError(res.error)
      if (hasAnimal(tree, res.value)) {
        return setError(`I already know ${withArticle(res.value)}! Maybe one of your answers was different from mine.`)
      }
      setName(res.value)
      setStep('question')
    } else {
      const res = cleanQuestion(value)
      if (!res.ok) return setError(res.error)
      setQuestion(res.value)
      setStep('answer')
    }
    setValue('')
    setError('')
  }

  if (step === 'answer') {
    return (
      <QuestionCard
        label={question}
        text={`For ${withArticle(name)}, is the answer Yes or No?`}
        onAnswer={(ans) => onLearn(name, question, ans)}
      />
    )
  }

  return (
    <form onSubmit={submit} className="text-center">
      {step === 'name' ? (
        <h2 className="text-3xl font-bold text-foreground">I give up! What animal were you thinking of?</h2>
      ) : (
        <>
          <h2 className="text-3xl font-bold leading-snug text-foreground">
            Give me a yes/no question that is true for {withArticle(name)} but false for {withArticle(oldAnimal)}.
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">Example: “Does it have a very long neck?”</p>
        </>
      )}
      <Input
        key={step}
        autoFocus
        value={value}
        onChange={(e) => { setValue(e.target.value); setError('') }}
        maxLength={step === 'name' ? 30 : 100}
        placeholder={step === 'name' ? 'e.g. Giraffe' : 'Does it …?'}
        className="mt-6 h-auto rounded-2xl border-2 bg-white px-5 py-4 text-2xl md:text-2xl"
        autoComplete="off"
        aria-invalid={!!error}
      />
      <p className="mt-3 min-h-7 text-lg font-medium text-destructive" role="alert">{error}</p>
      <Button type="submit" className={`mt-5 px-10 ${bigButton}`}>Next</Button>
    </form>
  )
}
