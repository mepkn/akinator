import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { startingTree } from './data/animals.ts'
import { countAnimals, getNode, insertAnimal, validateTree, withArticle } from './utils/tree.ts'
import type { Answer, TreeNode } from './utils/tree.ts'
import StartScreen from './components/StartScreen.tsx'
import QuestionCard from './components/QuestionCard.tsx'
import LearnForm from './components/LearnForm.tsx'
import Robot from './components/Robot.tsx'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { bigButton } from '@/lib/styles'

const STORAGE_KEY = 'guess-the-animal:tree'

type Phase = 'start' | 'asking' | 'guessing' | 'correct' | 'learning' | 'learned'

function loadTree(): TreeNode {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (saved && validateTree(saved).length === 0) return saved as TreeNode
  } catch {
    // storage unavailable or corrupt – fall back to the starting tree
  }
  return startingTree
}

function saveTree(tree: TreeNode) {
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
  const [phase, setPhase] = useState<Phase>('start')
  const [path, setPath] = useState<Answer[]>([])

  useEffect(() => saveTree(tree), [tree])

  const node = getNode(tree, path)
  // The phase decides which kind of node is current.
  const questionText = node.type === 'question' ? node.text : ''
  const animalName = node.type === 'animal' ? node.name : ''

  const start = () => {
    setPath([])
    setPhase(tree.type === 'animal' ? 'guessing' : 'asking')
  }

  const answerQuestion = useCallback((ans: Answer) => {
    const next = [...path, ans]
    setPath(next)
    if (getNode(tree, next).type === 'animal') setPhase('guessing')
  }, [path, tree])

  const answerGuess = useCallback((ans: Answer) => {
    if (ans === 'yes') {
      setPhase('correct')
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
    } else {
      setPhase('learning')
    }
  }, [])

  const learn = (name: string, question: string, ans: Answer) => {
    setTree(insertAnimal(tree, path, name, question, ans))
    setPhase('learned')
  }

  const reset = () => setTree(startingTree)

  let content
  let key: string = phase
  if (phase === 'start') {
    content = <StartScreen count={countAnimals(tree)} onStart={start} onReset={reset} />
  } else if (phase === 'asking') {
    key = `q${path.length}`
    content = <QuestionCard label={`Question ${path.length + 1}`} text={questionText} onAnswer={answerQuestion} />
  } else if (phase === 'guessing') {
    content = (
      <>
        <Robot mood="think" className="mx-auto mb-4 h-24 w-24" />
        <QuestionCard label="My guess" text={`Is it ${withArticle(animalName)}?`} onAnswer={answerGuess} />
      </>
    )
  } else if (phase === 'learning') {
    content = <LearnForm tree={tree} oldAnimal={animalName} onLearn={learn} />
  } else {
    content = (
      <div className="text-center">
        <Robot mood="happy" className="mx-auto h-32 w-32" />
        <h2 className="mt-4 text-4xl font-extrabold text-foreground">
          {phase === 'correct' ? 'I got it!' : 'Thanks! I learned a new animal.'}
        </h2>
        <p className="mt-3 text-2xl text-muted-foreground">
          {phase === 'correct'
            ? `It was ${withArticle(animalName)}. Guessed in ${path.length} questions.`
            : `I now know ${countAnimals(tree)} animals.`}
        </p>
        <Button autoFocus size="lg" onClick={() => setPhase('start')} className={`mt-8 px-10 ${bigButton}`}>
          Play again
        </Button>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-2xl gap-0 rounded-3xl p-6 text-base shadow-xl backdrop-blur sm:p-10">
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
      </Card>
    </main>
  )
}
