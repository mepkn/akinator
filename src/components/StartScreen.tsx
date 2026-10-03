import { useState } from 'react'
import Robot from './Robot.tsx'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { bigButton } from '@/lib/styles'

type Props = { count: number; onStart: () => void; onReset: () => void }

export default function StartScreen({ count, onStart, onReset }: Props) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="text-center">
      <Robot className="mx-auto h-32 w-32 sm:h-40 sm:w-40" />
      <p className="mt-4 text-base font-semibold uppercase tracking-widest text-primary">
        Expert Systems · 1980s
      </p>
      <h1 className="mt-1 text-5xl font-extrabold text-foreground sm:text-6xl">Guess the Animal</h1>
      <p className="mx-auto mt-5 max-w-xl text-2xl text-muted-foreground">
        Think of an animal. I will guess it by asking yes/no questions.
      </p>
      <Button autoFocus onClick={onStart} className={`mt-8 px-12 ${bigButton}`}>
        Start
      </Button>
      <p className="mt-6 text-lg text-muted-foreground">
        I know <span className="font-bold text-foreground">{count}</span> animals
      </p>
      <Button
        variant="link"
        onClick={() => setConfirming(true)}
        className="mt-2 text-base text-muted-foreground underline hover:text-destructive"
      >
        Reset brain
      </Button>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset brain?</AlertDialogTitle>
            <AlertDialogDescription>
              I will forget every animal you taught me and go back to the starting animals.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                onReset()
                setConfirming(false)
              }}
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
