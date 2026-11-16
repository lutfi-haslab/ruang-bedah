import { Link, Navigate, useParams } from 'react-router-dom'
import { Badge, Button } from '../components/primitives'
import { AnatomyFigure, Callout, OxygenLegend, SpecTable } from '../components/wiki'
import HeartLab from '../components/HeartLab'
import { AppendectomyCaseBody, CabgLessonBody, CardiacCycleLessonBody, ConductionLessonBody, LungsLessonBody, VesselsLessonBody } from '../components/lesson-bodies'
import { EkgDivider, FlashCards, Quiz } from '../components/study-tools'
import { Breadcrumb, badgeFor } from '../components/syllabus'
import { getLessonBySlug, lessonNeighbors, subjectSlug } from '../data/curriculum'
import type { LessonContext } from '../data/curriculum'
import { useProgress } from '../hooks'

function NeighborCard({ ctx, kind }: { ctx: LessonContext; kind: 'prev' | 'next' }) {
  return (
    <Link
      to={`/lesson/${ctx.slug}`}
      className="group flex-1 rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-lift)]"
    >
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-400">
        {kind === 'prev' ? '← Previous lesson' : 'Next lesson →'}
      </p>
      <p className="mt-1.5 font-display text-lg font-bold leading-snug tracking-tight text-ink-950 group-hover:text-primary-700">
        {ctx.lesson.title}
      </p>
      <p className="mt-1 font-mono text-xs text-ink-500">
        {ctx.subject.name} › {ctx.topic.title} · {ctx.lesson.minutes} min
        {ctx.lesson.status === 'soon' ? ' · in production' : ''}
      </p>
    </Link>
  )
}

function HeartLessonBody() {
  return (
    <>
      <section aria-label="Interactive lab">
        <h2 className="mb-4 flex items-baseline gap-3 font-display text-[1.4rem] font-extrabold tracking-tight text-ink-950">
          <span className="font-mono text-sm font-normal text-arterial-500">A</span> The lab
        </h2>
        <HeartLab />
      </section>

      <EkgDivider />

      <section aria-label="Reading chapter">
        <h2 className="mb-4 flex items-baseline gap-3 font-display text-[1.4rem] font-extrabold tracking-tight text-ink-950">
          <span className="font-mono text-sm font-normal text-arterial-500">B</span> The reading chapter
        </h2>
        <article className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
          <h3 className="max-w-2xl font-display text-3xl font-extrabold leading-tight tracking-tight text-ink-950">
            Four Chambers, One Pump
          </h3>
          <div className="prose-wiki mt-4 max-w-3xl">
            <p>
              The honest way to read the heart is to follow its blood. Blood that has given up its
              oxygen returns through the two great veins — the <strong>superior</strong> and{' '}
              <strong>inferior vena cava</strong> — into the <strong>right atrium</strong>, then down
              into the <strong>right ventricle</strong>, which pumps it through the{' '}
              <strong>pulmonary artery</strong> to the lungs. Oxygen-rich blood comes back through the{' '}
              <strong>pulmonary veins</strong> to the <strong>left atrium</strong> and the thick-walled{' '}
              <strong>left ventricle</strong>, and out through the <strong>aorta</strong> to the entire
              body.
            </p>
            <p>
              Two pumps, side by side, beating as one. The right side works a short, low-pressure
              circuit — just to the lungs and back. The left side drives the long circuit around the
              whole body, which is why its wall is three times thicker. Every structure in the lab
              above exists to serve that one journey, and the journey takes about a minute.
            </p>
          </div>
          <div className="mt-6">
            <SpecTable
              head={['Chamber', 'Receives from', 'Pumps to']}
              rows={[
                ['Right atrium', 'Superior & inferior vena cava', 'Right ventricle'],
                ['Right ventricle', 'Right atrium', 'Pulmonary artery → lungs'],
                ['Left atrium', 'Pulmonary veins', 'Left ventricle'],
                ['Left ventricle', 'Left atrium', 'Aorta → the whole body'],
              ]}
            />
          </div>
          <div className="mt-6">
            <OxygenLegend />
          </div>
          <div className="mt-6">
            <AnatomyFigure
              src="/assets/refs/ref-heart-gray493.png"
              alt="Gray's Anatomy plate 493: the heart viewed from the front, opened to show its chambers and valves"
              caption="Real anatomy reference — the heart from the front, drawn from dissection more than a century ago: the same four chambers and great vessels as the lab above, in real proportions. The schematic simplifies; this is what it simplifies from."
              credit="Gray's Anatomy (1918), plate 493 · Public domain · via Wikimedia Commons"
            />
          </div>
        </article>
      </section>

      <EkgDivider />

      <section aria-label="Exercises">
        <h2 className="mb-4 flex items-baseline gap-3 font-display text-[1.4rem] font-extrabold tracking-tight text-ink-950">
          <span className="font-mono text-sm font-normal text-arterial-500">C</span> Check yourself
        </h2>
        <h3 className="mb-4 font-display text-lg font-bold tracking-tight text-ink-950">Flashcards — tap to flip</h3>
        <FlashCards />
        <h3 className="mb-4 mt-10 font-display text-lg font-bold tracking-tight text-ink-950">Quick quiz — three questions</h3>
        <Quiz />
      </section>

      <div className="mt-8">
        <Callout kind="key">
          The pulmonary artery is the only artery that carries oxygen-poor blood, and the pulmonary
          veins are the only veins that carry oxygen-rich blood. Vessels are named by the direction
          they carry blood — away from the heart, or toward it — never by oxygen content.
        </Callout>
      </div>
    </>
  )
}

function lessonBodyFor(slug: string) {
  switch (slug) {
    case 'the-heart-chambers-valves-and-vessels':
      return <HeartLessonBody />
    case 'arteries-veins-and-capillaries':
      return <VesselsLessonBody />
    case 'the-lungs-and-the-pleura':
      return <LungsLessonBody />
    case 'the-cardiac-cycle-systole-and-diastole':
      return <CardiacCycleLessonBody />
    case 'the-conduction-system-the-hearts-wiring':
      return <ConductionLessonBody />
    case 'coronary-bypass-cabg-building-the-detour':
      return <CabgLessonBody />
    case 'appendicectomy-the-easy-case':
      return <AppendectomyCaseBody />
    default:
      return null
  }
}

export default function LessonPage() {
  const { slug } = useParams()
  const ctx = slug ? getLessonBySlug(slug) : undefined
  const { isDone, toggle } = useProgress()

  if (!ctx || !slug) return <Navigate to="/" replace />

  const { lesson, subject, topic } = ctx
  const { prev, next } = lessonNeighbors(slug)
  const completed = isDone(slug)
  const body = lessonBodyFor(slug)
  const available = lesson.status === 'available' && body !== null

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumb
        trail={[
          { label: 'Catalog', to: '/' },
          { label: subject.name, to: `/subject/${subjectSlug(subject)}` },
          { label: topic.title },
          { label: 'Lesson' },
        ]}
      />

      <header className="border-b border-line pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <Badge category={badgeFor(subject.name)} />
          <span className="font-mono text-xs text-ink-400">
            {lesson.format} · {lesson.minutes} min
          </span>
          {completed && (
            <span className="rounded-full bg-success-50 px-3 py-1 font-mono text-xs font-medium text-success-600 ring-1 ring-success-500/25">
              Completed ✓
            </span>
          )}
        </div>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-950 sm:text-5xl">
          {lesson.title}
        </h1>
        {available ? (
          <div className="mt-6">
            <Button variant={completed ? 'secondary' : 'primary'} onClick={() => toggle(slug)}>
              {completed ? '✓ Completed — tap to undo' : 'Mark lesson complete'}
            </Button>
          </div>
        ) : (
          <p className="mt-6 inline-block rounded-2xl border border-amber-500/50 bg-amber-50 px-4 py-3 text-[0.95rem] leading-relaxed text-ink-800">
            <strong className="font-semibold">This lesson is in production.</strong> It will ship as a{' '}
            {lesson.format.toLowerCase()} lesson of about {lesson.minutes} minutes — the syllabus slot,
            the plan, and its place in the course are final; the material itself is being built.
          </p>
        )}
      </header>

      {available && body && (
        <div className="grid gap-12 py-10 [&>*]:min-w-0" key={slug}>
          {body}
        </div>
      )}

      <nav className="flex flex-col gap-4 border-t border-line pt-8 sm:flex-row" aria-label="Lesson navigation">
        {prev ? <NeighborCard ctx={prev} kind="prev" /> : <span className="flex-1" />}
        {next ? <NeighborCard ctx={next} kind="next" /> : <span className="flex-1" />}
      </nav>
    </main>
  )
}
