import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { startingTree } from './data/animals.js'
import { countAnimals, getNode, insertAnimal, validateTree, withArticle } from './utils/tree.js'
import StartScreen from './components/StartScreen.jsx'
import QuestionCard from './components/QuestionCard.jsx'
import LearnForm from './components/LearnForm.jsx'
import Robot from './components/Robot.jsx'

const STORAGE_KEY = 'guess-the-animal:tree'

function loadTree() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved && validateTree(saved).length === 0) return saved
  } catch {
    // storage unavailable or corrupt – fall back to the starting tree
  }
  return startingTree
}

function saveTree(tree) {
  try {
    if (tree === startingTree) localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(tree))
  } catch {
    // keep it in memory only
  }
}

// States: start → asking → guessing → correct | learning → learned
export default function App() {
  const [tree, setTree] = useState(loadTree)
  const [phase, setPhase] = useState('start')
  const [path, setPath] = useState([])

  useEffect(() => saveTree(tree), [tree])

  const node = getNode(tree, path)

  const start = () => {
    setPath([])
    setPhase(tree.type === 'animal' ? 'guessing' : 'asking')
  }

  const answerQuestion = useCallback((ans) => {
    const next = [...path, ans]
    setPath(next)
    if (getNode(tree, next).type === 'animal') setPhase('guessing')
  }, [path, tree])

  const answerGuess = useCallback((ans) => {
    if (ans === 'yes') {
      setPhase('correct')
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
    } else {
      setPhase('learning')
    }
  }, [])

  const learn = (name, question, ans) => {
    setTree(insertAnimal(tree, path, name, question, ans))
    setPhase('learned')
  }

  const reset = () => {
    if (window.confirm('Forget everything I learned and go back to the starting animals?')) {
      setTree(startingTree)
    }
  }

  let content
  let key = phase
  if (phase === 'start') {
    content = <StartScreen count={countAnimals(tree)} onStart={start} onReset={reset} />
  } else if (phase === 'asking') {
    key = `q${path.length}`
    content = <QuestionCard label={`Question ${path.length + 1}`} text={node.text} onAnswer={answerQuestion} />
  } else if (phase === 'guessing') {
    content = (
      <>
        <Robot mood="think" className="mx-auto mb-4 h-24 w-24" />
        <QuestionCard label="My guess" text={`Is it ${withArticle(node.name)}?`} onAnswer={answerGuess} />
      </>
    )
  } else if (phase === 'learning') {
    content = <LearnForm tree={tree} oldAnimal={node.name} onLearn={learn} />
  } else {
    content = (
      <div className="text-center">
        <Robot mood="happy" className="mx-auto h-32 w-32" />
        <h2 className="mt-4 text-4xl font-extrabold text-slate-800">
          {phase === 'correct' ? 'I got it!' : 'Thanks! I learned a new animal.'}
        </h2>
        <p className="mt-3 text-2xl text-slate-600">
          {phase === 'correct'
            ? `It was ${withArticle(node.name)}. Guessed in ${path.length} questions.`
            : `I now know ${countAnimals(tree)} animals.`}
        </p>
        <button
          autoFocus
          onClick={() => setPhase('start')}
          className="mt-8 rounded-2xl bg-indigo-600 px-10 py-4 text-2xl font-bold text-white shadow-lg transition hover:bg-indigo-700 active:scale-95"
        >
          Play again
        </button>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl bg-white/80 p-6 shadow-xl ring-1 ring-slate-200 backdrop-blur sm:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
