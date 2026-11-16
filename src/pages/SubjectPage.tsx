import { Link, Navigate, useParams } from 'react-router-dom'
import { Badge } from '../components/primitives'
import { Breadcrumb, LessonRow, ProgressBar, badgeFor } from '../components/syllabus'
import { getSubjectBySlug, lessonSlug, subjectAvailable, subjectLessons } from '../data/curriculum'
import { useProgress } from '../hooks'

export default function SubjectPage() {
  const { slug } = useParams()
  const subject = slug ? getSubjectBySlug(slug) : undefined
  const { isDone } = useProgress()

  if (!subject) return <Navigate to="/" replace />

  const lessons = subjectLessons(subject)
  const ready = subjectAvailable(subject)
  const completed = lessons.filter((l) => isDone(lessonSlug(l))).length

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumb trail={[{ label: 'Catalog', to: '/' }, { label: subject.name }]} />

      <header className="border-b border-line pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink-950 sm:text-5xl">
            {subject.name}
          </h1>
          <Badge category={badgeFor(subject.name)} />
        </div>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-700">{subject.blurb}</p>
        <div className="mt-6 max-w-md">
          <div className="flex items-baseline justify-between font-mono text-xs text-ink-500">
            <span>
              {subject.topics.length} topics · {lessons.length} lessons · {ready} ready
            </span>
            <span>{completed} completed</span>
          </div>
          <ProgressBar value={completed} total={lessons.length} className="mt-2 h-2" />
        </div>
      </header>

      <div className="grid gap-10 py-8">
        {subject.topics.map((topic, ti) => (
          <section key={topic.title}>
            <h2 className="flex items-baseline gap-3 font-display text-[1.4rem] font-extrabold tracking-tight text-ink-950">
              <span className="font-mono text-sm font-normal text-arterial-500">
                {String(ti + 1).padStart(2, '0')}
              </span>
              {topic.title}
              <span className="font-mono text-xs font-normal text-ink-400">{topic.lessons.length} lessons</span>
            </h2>
            <div className="mt-3 rounded-[var(--radius-card)] border border-line bg-surface px-3 py-1.5 shadow-[var(--shadow-card)]">
              <ul className="divide-y divide-line/70">
                {topic.lessons.map((lesson) => (
                  <li key={lesson.title}>
                    <LessonRow lesson={lesson} completed={isDone(lessonSlug(lesson))} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <p className="border-t border-line pt-6">
        <Link to="/" className="font-display text-[0.95rem] font-bold text-primary-700 hover:underline">
          ← Back to the catalog
        </Link>
      </p>
    </main>
  )
}
