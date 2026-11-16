import { useCallback, useState } from 'react'

const KEY = 'ruang-bedah-progress-v1'

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

/** Lesson completion stored locally in the learner's browser. */
export function useProgress() {
  const [done, setDone] = useState<string[]>(read)

  const toggle = useCallback((slug: string) => {
    setDone((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {
        /* storage unavailable — progress simply will not persist */
      }
      return next
    })
  }, [])

  const isDone = useCallback((slug: string) => done.includes(slug), [done])

  return { done, toggle, isDone }
}
