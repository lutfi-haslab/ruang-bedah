import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

/* ---------------------------------- Button --------------------------------- */

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-600/40',
  accent:
    'bg-arterial-500 text-white hover:bg-arterial-600 focus-visible:ring-arterial-500/40',
  secondary:
    'bg-surface text-ink-900 border border-line hover:border-ink-400 focus-visible:ring-ink-900/20',
  ghost: 'text-primary-700 hover:bg-primary-50 focus-visible:ring-primary-600/30',
}

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[0.95rem]',
  lg: 'h-12 px-6 text-base',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold tracking-tight transition-colors focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50 ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
      {...props}
    />
  )
}

/* ---------------------------------- Badge ---------------------------------- */

export type Category = 'Anatomy' | 'Physiology' | 'Surgery' | 'Terms' | 'Cases'

const categoryStyles: Record<Category, string> = {
  Anatomy: 'bg-primary-50 text-primary-700 ring-primary-600/20',
  Physiology: 'bg-venous-50 text-venous-600 ring-venous-600/20',
  Surgery: 'bg-arterial-50 text-arterial-600 ring-arterial-500/25',
  Terms: 'bg-amber-50 text-amber-600 ring-amber-500/30',
  Cases: 'bg-success-50 text-success-600 ring-success-500/25',
}

export function Badge({ category }: { category: Category }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 font-display text-[0.7rem] font-bold uppercase tracking-[0.08em] ring-1 ring-inset ${categoryStyles[category]}`}
    >
      {category}
    </span>
  )
}

/* ------------------------------- Search input ------------------------------ */

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string
}

export function SearchInput({ wrapperClassName = '', ...props }: SearchInputProps) {
  return (
    <label
      className={`flex items-center gap-2.5 rounded-full border border-line bg-surface px-4 h-11 text-ink-500 transition-colors focus-within:border-primary-600 focus-within:ring-4 focus-within:ring-primary-600/15 ${wrapperClassName}`}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.8-3.8" />
      </svg>
      <input
        type="search"
        className="w-full bg-transparent text-[0.95rem] text-ink-900 placeholder:text-ink-400 focus:outline-none"
        {...props}
      />
    </label>
  )
}

/* ------------------------- Design-system page helpers ----------------------- */

export function SectionHeading({
  index,
  title,
  children,
}: {
  index: string
  title: string
  children?: ReactNode
}) {
  return (
    <div className="mb-8">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-sm font-medium text-arterial-500">{index}</span>
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">{title}</h2>
      </div>
      {children ? <p className="mt-2 max-w-2xl leading-relaxed text-ink-700">{children}</p> : null}
      <div className="mt-5 h-px bg-line" />
    </div>
  )
}

export function Swatch({
  name,
  token,
  hex,
  dark = false,
}: {
  name: string
  token: string
  hex: string
  dark?: boolean
}) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--shadow-card)]">
      <div className="h-20" style={{ backgroundColor: hex }} />
      <div className="px-4 py-3">
        <p className="font-display text-sm font-bold text-ink-950">{name}</p>
        <p className={`font-mono text-xs ${dark ? 'text-ink-500' : 'text-ink-500'}`}>
          {token} · {hex}
        </p>
      </div>
    </div>
  )
}
