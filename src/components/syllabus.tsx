import { Link } from 'react-router-dom'
import { lessonSlug } from '../data/curriculum'
import type { Lesson } from '../data/curriculum'

export const badgeFor = (subjectName: string) =>
  subjectName === 'Medical Terms' ? ('Terms' as const) : (subjectName as 'Anatomy' | 'Physiology' | 'Surgery' | 'Cases')

export function ProgressBar({ value, total, className = '' }: { value: number; total: number; className?: string }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100)
  return (
    <span className={`block h-1.5 w-full overflow-hidden rounded-full bg-line ${className}`} aria-hidden>
      <span className="block h-full rounded-full bg-primary-600 transition-all duration-500" style={{ width: `${pct}%` }} />
    </span>
  )
}

export function Breadcrumb({ trail }: { trail: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 font-mono text-xs text-ink-500">
      {trail.map((crumb, i) => (
        <span key={`${crumb.label}-${i}`} className="inline-flex items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden className="text-ink-300">
              ›
            </span>
          )}
          {crumb.to ? (
            <Link to={crumb.to} className="hover:text-primary-700 hover:underline">
              {crumb.label}
            </Link>
          ) : (
            <span className={i === trail.length - 1 ? 'font-semibold text-primary-700' : ''}>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

function StatusIcon({ lesson, completed }: { lesson: Lesson; completed: boolean }) {
  if (completed) {
    return (
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success-500 text-white" aria-label="Completed">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
    )
  }
  if (lesson.status === 'available') {
    return (
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-600 text-white" aria-label="Available">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M7 4.5v15l13-7.5-13-7.5z" />
        </svg>
      </span>
    )
  }
  return (
    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sand text-ink-400" aria-label="Coming soon">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    </span>
  )
}

export function LessonRow({ lesson, completed = false }: { lesson: Lesson; completed?: boolean }) {
  const isOpen = lesson.status === 'available'
  return (
    <Link
      to={`/lesson/${lessonSlug(lesson)}`}
      className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-primary-50"
    >
      <StatusIcon lesson={lesson} completed={completed} />
      <span className={`min-w-0 flex-1 ${isOpen || completed ? 'font-semibold text-ink-950' : 'text-ink-500'}`}>
        {lesson.title}
        {!isOpen && !completed && <span className="ml-2 font-mono text-[0.65rem] uppercase tracking-wide text-ink-400">in production</span>}
        {completed && <span className="ml-2 font-mono text-[0.65rem] uppercase tracking-wide text-success-600">done</span>}
      </span>
      <span className="hidden shrink-0 font-mono text-[0.68rem] text-ink-400 sm:block">{lesson.format}</span>
      <span className="shrink-0 font-mono text-[0.68rem] text-ink-400">{lesson.minutes} min</span>
    </Link>
  )
}
