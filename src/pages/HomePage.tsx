import { Link } from 'react-router-dom'
import { Badge, SearchInput } from '../components/primitives'
import { Callout } from '../components/wiki'
import { ProgressBar, badgeFor } from '../components/syllabus'
import { Reveal } from '../components/study-tools'
import {
  CURRICULUM,
  TOTAL_LESSONS,
  TOTAL_TOPICS,
  lessonSlug,
  subjectAvailable,
  subjectLessons,
  subjectSlug,
} from '../data/curriculum'
import { useProgress } from '../hooks'

const HEART_LESSON = CURRICULUM[0].topics[0].lessons[0]

export default function HomePage() {
  const { done, isDone } = useProgress()
  const heartDone = isDone(lessonSlug(HEART_LESSON))

  return (
    <main>
      {/* ------------------------------- Hero ------------------------------- */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:pt-16">
          <div>
            <p className="font-mono text-sm text-arterial-500">a health &amp; medicine wiki</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink-950 sm:text-6xl">
              Learn medicine from the anatomy up.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-700">
              A structured course, not a pile of articles. Pick a subject, work through its topics
              lesson by lesson — every lesson is built to be touched: diagrams you can click,
              processes you can play, quizzes that check you got it.
            </p>
            <SearchInput wrapperClassName="mt-7 max-w-xl" placeholder="Search organs, terms, procedures…" />
            <p className="mt-6 font-mono text-xs leading-relaxed text-ink-500">
              {CURRICULUM.length} subjects · {TOTAL_TOPICS} topics · {TOTAL_LESSONS} lessons · English-first
            </p>
          </div>

          {/* Continue learning */}
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-7">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary-700">
              {heartDone ? 'Lesson completed' : 'Start learning'}
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-ink-950">
              Lesson 1 · The Heart
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-500">
              Anatomy › Cardiovascular System — chambers, valves, and vessels, with the interactive
              heart lab, a reading chapter, flashcards, and a quiz.
            </p>
            <div className="mt-5">
              <div className="flex items-baseline justify-between font-mono text-xs text-ink-500">
                <span>Your progress</span>
                <span>
                  {done.length} of {TOTAL_LESSONS} lessons
                </span>
              </div>
              <ProgressBar value={done.length} total={TOTAL_LESSONS} className="mt-2 h-2" />
            </div>
            <Link
              to={`/lesson/${lessonSlug(HEART_LESSON)}`}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-primary-600 px-5 font-display text-[0.95rem] font-bold text-white shadow-sm transition-colors hover:bg-primary-700"
            >
              {heartDone ? 'Review the lesson' : 'Open the lesson'} →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------- Course catalog ---------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
            <div>
              <p className="font-mono text-sm text-arterial-500">01</p>
              <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink-950">Course catalog</h2>
              <p className="mt-1 max-w-xl text-ink-700">
                Five subjects, one body. Open a subject to see its topics and lessons.
              </p>
            </div>
            <p className="font-mono text-xs text-ink-500">Progress is saved in your browser</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {CURRICULUM.map((subject) => {
              const lessons = subjectLessons(subject)
              const ready = subjectAvailable(subject)
              const completed = lessons.filter((l) => isDone(lessonSlug(l))).length
              return (
                <Link
                  key={subject.name}
                  to={`/subject/${subjectSlug(subject)}`}
                  className="group flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-lift)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-[1.35rem] font-extrabold tracking-tight text-ink-950 group-hover:text-primary-700">
                      {subject.name}
                    </h3>
                    <Badge category={badgeFor(subject.name)} />
                  </div>
                  <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-ink-700">{subject.blurb}</p>
                  <p className="mt-4 font-mono text-xs text-ink-500">
                    {subject.topics.length} topics · {lessons.length} lessons · {ready} ready
                  </p>
                  <div className="mt-2.5">
                    <ProgressBar value={completed} total={lessons.length} />
                    <p className="mt-1.5 font-mono text-[0.68rem] text-ink-400">{completed} completed</p>
                  </div>
                  <span className="mt-4 font-display text-[0.95rem] font-bold text-primary-700">
                    View subject →
                  </span>
                </Link>
              )
            })}

            {/* How lessons work */}
            <div className="flex flex-col justify-center rounded-[var(--radius-card)] border border-dashed border-line bg-paper p-6">
              <h3 className="font-display text-[1.35rem] font-extrabold tracking-tight text-ink-950">
                How every lesson works
              </h3>
              <ol className="mt-3 space-y-2 text-[0.95rem] leading-relaxed text-ink-700">
                <li>
                  <strong className="font-semibold text-ink-950">1 · Lab.</strong> An interactive diagram
                  or motion demo of the process.
                </li>
                <li>
                  <strong className="font-semibold text-ink-950">2 · Read.</strong> A short chapter that
                  tells the same story slowly.
                </li>
                <li>
                  <strong className="font-semibold text-ink-950">3 · Check.</strong> Flashcards and a
                  quiz — then mark the lesson complete.
                </li>
              </ol>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------ Disclaimer ------------------------------ */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <Reveal>
          <Callout kind="warning" title="Medical disclaimer">
            Ruang Bedah is an educational wiki, not medical care. Nothing here diagnoses, treats, or
            replaces the judgment of a physician. If something in your body worries you, the correct
            next step is a doctor — not a wiki.
          </Callout>
        </Reveal>
      </section>
    </main>
  )
}
