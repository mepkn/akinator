import Robot from './Robot.tsx'

type Props = { count: number; onStart: () => void; onReset: () => void }

export default function StartScreen({ count, onStart, onReset }: Props) {
  return (
    <div className="text-center">
      <Robot className="mx-auto h-32 w-32 sm:h-40 sm:w-40" />
      <p className="mt-4 text-base font-semibold uppercase tracking-widest text-indigo-500">
        Expert Systems · 1980s
      </p>
      <h1 className="mt-1 text-5xl font-extrabold text-slate-800 sm:text-6xl">Guess the Animal</h1>
      <p className="mx-auto mt-5 max-w-xl text-2xl text-slate-600">
        Think of an animal. I will guess it by asking yes/no questions.
      </p>
      <button
        autoFocus
        onClick={onStart}
        className="mt-8 rounded-2xl bg-indigo-600 px-12 py-4 text-2xl font-bold text-white shadow-lg transition hover:bg-indigo-700 active:scale-95"
      >
        Start
      </button>
      <p className="mt-6 text-lg text-slate-500">
        I know <span className="font-bold text-slate-700">{count}</span> animals
      </p>
      <button onClick={onReset} className="mt-2 text-base text-slate-400 underline hover:text-rose-500">
        Reset brain
      </button>
    </div>
  )
}
