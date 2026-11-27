import { Suspense, lazy, useState } from 'react'
import { NephronLab } from './lesson-labs'

const KidneyModel3D = lazy(() => import('./KidneyModel3D'))

/*
 * NephronLabCard — one card, two ways to look at the nephron: the
 * animated 2D nephron lab and the Three.js 3D explorer of the kidney it
 * lives inside, joined by a tab switcher. Mirrors BloodPressureLabCard:
 * both views stay mounted once visited; the 3D chunk loads lazily on
 * first switch. `?view=3d` opens the 3D tab directly.
 */
export default function NephronLabCard() {
  const [tab, setTab] = useState<'2d' | '3d'>(() =>
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('view') === '3d'
      ? '3d'
      : '2d',
  )
  const [visited3d, setVisited3d] = useState(tab === '3d')

  const switchTo = (t: '2d' | '3d') => {
    setTab(t)
    if (t === '3d') setVisited3d(true)
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-3.5">
        <p className="mr-auto font-mono text-xs tracking-widest text-ink-400">
          THE NEPHRON LAB · ONE FILTER, TWO VIEWS
        </p>
        <div className="flex rounded-full border border-line bg-paper p-1" role="tablist" aria-label="Nephron viewer">
          {(
            [
              ['2d', '2D Nephron lab'],
              ['3d', '3D Explorer'],
            ] as const
          ).map(([t, label]) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => switchTo(t)}
              className={`rounded-full px-4 py-1.5 font-display text-sm font-bold transition-colors ${
                tab === t ? 'bg-primary-600 text-white' : 'text-ink-700 hover:text-ink-950'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={tab === '2d' ? '' : 'hidden'}>
        <NephronLab bare />
      </div>

      {visited3d && (
        <div className={tab === '3d' ? '' : 'hidden'}>
          <Suspense
            fallback={
              <div className="grid h-[340px] place-items-center bg-[#17100d] sm:h-[460px]">
                <p className="animate-pulse font-mono text-xs tracking-widest text-[#cdb9ae]">
                  LOADING 3D EXPLORER…
                </p>
              </div>
            }
          >
            <KidneyModel3D bare />
          </Suspense>
        </div>
      )}
    </div>
  )
}
