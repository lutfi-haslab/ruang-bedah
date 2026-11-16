import type { ReactNode } from 'react'
import { Badge, type Category } from './primitives'

/* --------------------------------- Callouts -------------------------------- */

type CalloutKind = 'info' | 'warning' | 'key'

const calloutStyles: Record<CalloutKind, { box: string; title: string; label: string }> = {
  info: {
    box: 'border-venous-500/40 bg-venous-50',
    title: 'text-venous-600',
    label: 'Note',
  },
  warning: {
    box: 'border-amber-500/50 bg-amber-50',
    title: 'text-amber-600',
    label: 'Important',
  },
  key: {
    box: 'border-primary-600/30 bg-primary-50',
    title: 'text-primary-700',
    label: 'Key fact',
  },
}

export function Callout({
  kind = 'info',
  title,
  children,
}: {
  kind?: CalloutKind
  title?: string
  children: ReactNode
}) {
  const s = calloutStyles[kind]
  return (
    <aside className={`rounded-[var(--radius-card)] border-l-4 border px-5 py-4 ${s.box}`}>
      <p className={`font-display text-[0.72rem] font-bold uppercase tracking-[0.1em] ${s.title}`}>
        {title ?? s.label}
      </p>
      <div className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-900">{children}</div>
    </aside>
  )
}

/* ------------------------------ Definition box ----------------------------- */

export function DefinitionBox({
  term,
  latin,
  children,
}: {
  term: string
  latin?: string
  children: ReactNode
}) {
  return (
    <aside className="rounded-[var(--radius-card)] border border-line bg-surface px-5 py-4 shadow-[var(--shadow-card)]">
      <p className="font-display text-lg font-bold tracking-tight text-ink-950">
        {term}
        {latin ? <span className="ml-2 font-serif text-base font-normal italic text-ink-500">{latin}</span> : null}
      </p>
      <div className="mt-1 text-[0.95rem] leading-relaxed text-ink-700">{children}</div>
    </aside>
  )
}

/* ------------------------------ Anatomy figure ----------------------------- */

export function AnatomyFigure({
  src,
  alt,
  caption,
  credit,
}: {
  src: string
  alt: string
  caption: string
  credit?: string
}) {
  return (
    <figure className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--shadow-card)]">
      <img src={src} alt={alt} className="w-full" loading="lazy" />
      <figcaption className="border-t border-line px-5 py-3.5">
        <p className="text-sm leading-relaxed text-ink-700">{caption}</p>
        {credit ? <p className="mt-1 font-mono text-xs text-ink-400">{credit}</p> : null}
      </figcaption>
    </figure>
  )
}

/* ------------------------------- Article card ------------------------------ */

export function ArticleCard({
  category,
  title,
  excerpt,
  meta,
}: {
  category: Category
  title: string
  excerpt: string
  meta: string
}) {
  return (
    <article className="group flex h-full cursor-pointer flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-center justify-between gap-3">
        <Badge category={category} />
        <span className="font-mono text-xs text-ink-400">{meta}</span>
      </div>
      <h3 className="mt-3 font-display text-lg font-bold leading-snug tracking-tight text-ink-950 group-hover:text-primary-700">
        {title}
      </h3>
      <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-ink-700">{excerpt}</p>
      <span className="mt-auto pt-4 font-display text-sm font-semibold text-primary-700">
        Read article <span aria-hidden>→</span>
      </span>
    </article>
  )
}

/* --------------------------------- Term card ------------------------------- */

export function TermCard({
  term,
  latin,
  definition,
}: {
  term: string
  latin: string
  definition: string
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
      <p className="font-display text-base font-bold text-ink-950">{term}</p>
      <p className="font-serif text-sm italic text-ink-500">{latin}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">{definition}</p>
    </div>
  )
}

/* -------------------------------- Spec table ------------------------------- */

export function SpecTable({
  head,
  rows,
}: {
  head: [string, string, string]
  rows: [string, string, string][]
}) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--shadow-card)]">
      <table className="w-full min-w-[540px] text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-sand/60 font-display text-[0.72rem] uppercase tracking-[0.09em] text-ink-700">
            {head.map((h) => (
              <th key={h} className="px-5 py-3 font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row[0]} className={i % 2 ? 'bg-paper/60' : ''}>
              <td className="px-5 py-3 font-display font-semibold text-ink-950">{row[0]}</td>
              <td className="px-5 py-3 text-ink-700">{row[1]}</td>
              <td className="px-5 py-3 text-ink-700">{row[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------- Oxygen legend ------------------------------ */

export function OxygenLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-700">
      <span className="inline-flex items-center gap-2">
        <span className="h-3.5 w-3.5 rounded-[4px] bg-arterial-500" /> Oxygen-rich blood
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-3.5 w-3.5 rounded-[4px] bg-venous-500" /> Oxygen-poor blood
      </span>
    </div>
  )
}
