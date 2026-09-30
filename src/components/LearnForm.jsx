import { useState } from 'react'
import QuestionCard from './QuestionCard.jsx'
import { cleanAnimalName, cleanQuestion, hasAnimal, withArticle } from '../utils/tree.js'

const inputClass =
  'mt-6 w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-2xl outline-none focus:border-indigo-500'
const submitClass =
  'mt-5 rounded-2xl bg-indigo-600 px-10 py-4 text-2xl font-bold text-white shadow-lg transition hover:bg-indigo-700 active:scale-95'

export default function LearnForm({ tree, oldAnimal, onLearn }) {
  const [step, setStep] = useState('name')
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [question, setQuestion] = useState('')

  const submit = (e) => {
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
        <h2 className="text-3xl font-bold text-slate-800">I give up! What animal were you thinking of?</h2>
      ) : (
        <>
          <h2 className="text-3xl font-bold leading-snug text-slate-800">
            Give me a yes/no question that is true for {withArticle(name)} but false for {withArticle(oldAnimal)}.
          </h2>
          <p className="mt-3 text-lg text-slate-500">Example: “Does it have a very long neck?”</p>
        </>
      )}
      <input
        key={step}
        autoFocus
        value={value}
        onChange={(e) => { setValue(e.target.value); setError('') }}
        maxLength={step === 'name' ? 30 : 100}
        placeholder={step === 'name' ? 'e.g. Giraffe' : 'Does it …?'}
        className={inputClass}
        autoComplete="off"
        aria-invalid={!!error}
      />
      <p className="mt-3 min-h-7 text-lg font-medium text-rose-600" role="alert">{error}</p>
      <button type="submit" className={submitClass}>Next</button>
    </form>
  )
}
