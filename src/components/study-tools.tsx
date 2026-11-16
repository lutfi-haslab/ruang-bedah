import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Button } from './primitives'

/* ------------------------- Scroll reveal wrapper ------------------------ */

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const show = () => el.classList.add('is-visible')
    /* Already in view on mount: show immediately, no observer needed. */
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      show()
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          show()
          io.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    io.observe(el)
    /* Failsafe: content must never stay hidden if the observer lags. */
    const fallback = setTimeout(show, 1500)
    return () => {
      io.disconnect()
      clearTimeout(fallback)
    }
  }, [])
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}

/* ---------------------------- EKG divider ------------------------------- */

export function EkgDivider() {
  const seg = (x: number) => `H${x + 130} l8 -2 l6 -12 l8 22 l6 -10 l3 4`
  const d = `M0 20 ${[0, 400, 800].map(seg).join(' ')} H1200`
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6" aria-hidden>
      <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="h-7 w-full opacity-70">
        <path d={d} fill="none" stroke="#E0D9C6" strokeWidth="2" />
        <path d={d} fill="none" stroke="#0E7C86" strokeWidth="2" className="ekg-anim" opacity="0.55" />
      </svg>
    </div>
  )
}

/* ----------------------------- Flashcards ------------------------------- */

export type FlashCardData = {
  term: string
  latin: string
  back: string
}

const FLASHCARDS: FlashCardData[] = [
  {
    term: 'Systole',
    latin: 'systole',
    back: 'The contraction phase of the heartbeat — the ventricles squeeze and eject blood into the arteries.',
  },
  {
    term: 'Diastole',
    latin: 'diastole',
    back: 'The relaxation phase — the chambers loosen, pressure falls, and blood flows in to refill them.',
  },
  {
    term: 'Myocardium',
    latin: 'myocardium',
    back: 'The muscular middle wall of the heart. It is the tissue that actually contracts — thickest around the left ventricle.',
  },
  {
    term: 'Apex',
    latin: 'apex cordis',
    back: 'The pointed tip of the heart, formed by the left ventricle, pointing down and to the left.',
  },
]

function FlashCard({ term, latin, back }: FlashCardData) {
  const [flipped, setFlipped] = useState(false)
  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      className="flip-scene h-44 w-full text-left focus:outline-none"
    >
      <span className={`flip-inner relative block h-full w-full ${flipped ? 'is-flipped' : ''}`}>
        <span className="flip-face absolute inset-0 flex flex-col justify-between rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <span>
            <span className="block font-display text-xl font-extrabold tracking-tight text-ink-950">{term}</span>
            <span className="mt-0.5 block font-serif text-sm italic text-ink-500">{latin}</span>
          </span>
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-primary-700">Tap to flip ↻</span>
        </span>
        <span className="flip-face flip-back absolute inset-0 flex flex-col justify-between rounded-[var(--radius-card)] border border-primary-600/30 bg-primary-50 p-5">
          <span className="text-[0.92rem] leading-relaxed text-ink-900">{back}</span>
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-primary-700">Tap to flip back</span>
        </span>
      </span>
    </button>
  )
}

export function FlashCards({ cards = FLASHCARDS }: { cards?: FlashCardData[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => (
        <FlashCard key={c.term} {...c} />
      ))}
    </div>
  )
}

/* -------------------------------- Quiz ---------------------------------- */

export type QuizQuestion = {
  q: string
  options: string[]
  answer: number
  why: string
}

const QUESTIONS: QuizQuestion[] = [
  {
    q: 'Which chamber pumps blood to the entire body?',
    options: ['Right atrium', 'Right ventricle', 'Left ventricle', 'Left atrium'],
    answer: 2,
    why: 'The left ventricle — its wall is three times thicker than the right side’s because the whole body is its workload.',
  },
  {
    q: 'The pulmonary artery is unusual because it carries…',
    options: ['Oxygen-rich blood to the lungs', 'Oxygen-poor blood to the lungs', 'Blood back to the heart', 'Only blood to the brain'],
    answer: 1,
    why: 'Arteries are named by direction — away from the heart — not by oxygen. This one carries oxygen-poor blood to the lungs.',
  },
  {
    q: 'The first heart sound, the “lub”, happens when…',
    options: [
      'The semilunar valves open',
      'The AV valves close at the start of systole',
      'The atria refill',
      'The aorta expands',
    ],
    answer: 1,
    why: '“Lub” is the tricuspid and mitral (AV) valves snapping shut as the ventricles begin to contract.',
  },
]

export function Quiz({ questions = QUESTIONS }: { questions?: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<(number | null)[]>(questions.map(() => null))
  const done = answers.every((a) => a !== null)
  const score = answers.reduce<number>((acc, a, i) => acc + (a === questions[i].answer ? 1 : 0), 0)

  const choose = (qi: number, oi: number) =>
    setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)))

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {questions.map((item, qi) => (
          <fieldset key={qi}>
            <legend className="font-display text-[1.05rem] font-bold leading-snug tracking-tight text-ink-950">
              <span className="mr-2 font-mono text-sm text-arterial-500">Q{qi + 1}</span>
              {item.q}
            </legend>
            <div className="mt-3 grid gap-2">
              {item.options.map((opt, oi) => {
                const chosen = answers[qi] === oi
                const answered = answers[qi] !== null
                const isRight = oi === item.answer
                let cls = 'border-line bg-paper text-ink-800 hover:border-primary-600/50'
                if (answered && isRight) cls = 'border-success-500 bg-success-50 text-ink-950'
                else if (answered && chosen && !isRight) cls = 'border-arterial-500 bg-arterial-50 text-ink-950'
                else if (answered) cls = 'border-line bg-paper text-ink-400'
                return (
                  <button
                    key={oi}
                    onClick={() => choose(qi, oi)}
                    className={`rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition-colors ${cls}`}
                  >
                    {opt}
                    {answered && isRight ? ' ✓' : ''}
                    {answered && chosen && !isRight ? ' ✗' : ''}
                  </button>
                )
              })}
            </div>
            {answers[qi] !== null && <p className="mt-3 text-sm leading-relaxed text-ink-700">{item.why}</p>}
          </fieldset>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-5">
        <p className="font-display text-lg font-extrabold tracking-tight text-ink-950">
          {done ? `Score: ${score} / ${questions.length}` : 'Answer all three to see your score'}
        </p>
        {done && (
          <p className="text-sm text-ink-700">
            {score === questions.length
              ? 'Perfect. This lesson is yours.'
              : score === questions.length - 1
                ? 'Close — review the lab and the reading chapter, then try again.'
                : 'Good start — the lab and reading above are the answer key. Review them, then retry.'}
          </p>
        )}
        {done && (
          <Button size="sm" variant="secondary" onClick={() => setAnswers(questions.map(() => null))}>
            Reset quiz
          </Button>
        )}
      </div>
    </div>
  )
}
