import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SearchInput } from './primitives'

export function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-xl bg-primary-600 text-white"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h4l2.5-6 4 12 2.5-6H22" />
      </svg>
    </span>
  )
}

const NAV: { label: string; to: string }[] = [
  { label: 'Anatomy', to: '/subject/anatomy' },
  { label: 'Physiology', to: '/subject/physiology' },
  { label: 'Surgery', to: '/subject/surgery' },
  { label: 'Medical Terms', to: '/subject/medical-terms' },
  { label: 'Cases', to: '/subject/cases' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  /* Close the mobile menu whenever the route changes. */
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center gap-4 px-4 sm:gap-6 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <LogoMark />
          <span className="leading-none">
            <span className="block font-display text-[1.15rem] font-extrabold tracking-tight text-ink-950">
              Ruang<span className="text-primary-600">Bedah</span>
            </span>
            <span className="mt-0.5 block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-ink-500">
              Health &amp; Medicine Wiki
            </span>
          </span>
        </Link>
        <nav className="ml-2 hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="rounded-full px-3.5 py-2 font-display text-[0.92rem] font-semibold text-ink-700 transition-colors hover:bg-sand hover:text-ink-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <SearchInput wrapperClassName="ml-auto hidden w-56 md:flex xl:w-72" placeholder="Search organs, terms, procedures…" />
        <button
          className="ml-auto grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-ink-900 md:ml-0 lg:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? (
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" className="border-t border-line bg-paper lg:hidden" aria-label="Mobile">
          <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
            <li>
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-line/60 py-3.5 font-display text-base font-semibold text-ink-900"
              >
                Course catalog
                <span aria-hidden className="text-primary-700">→</span>
              </Link>
            </li>
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between border-b border-line/60 py-3.5 font-display text-base font-semibold text-ink-900 last:border-0"
                >
                  {item.label}
                  <span aria-hidden className="text-primary-700">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink-950 text-ink-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark />
            <span className="font-display text-lg font-extrabold tracking-tight text-white">
              Ruang<span className="text-primary-100">Bedah</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-400">
            A health and medicine wiki — human anatomy, physiology, and the fundamentals of surgery,
            with labeled illustrations drawn specifically for people who are learning.
          </p>
        </div>
        <nav aria-label="Explore">
          <p className="font-display text-sm font-bold uppercase tracking-[0.1em] text-white">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-400">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.1em] text-white">Disclaimer</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-400">
            All content is educational and is not a substitute for professional diagnosis, advice, or
            treatment. If you have a health concern, consult a physician.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 font-mono text-xs text-ink-500 sm:px-6">
          Ruang Bedah — written by Lutfi Ikbal Majid with Bewustein (Muse).
        </p>
      </div>
    </footer>
  )
}
