import { useEffect, useState } from 'react'

function getPreference(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function usePrefersReducedMotion(): boolean {
  // Read the real value synchronously on first render (lazy initializer),
  // rather than defaulting to `false` and correcting it a tick later via an
  // effect. Consumers that branch their *own* first render or first effect
  // on this value (e.g. Hero's typewriter) would otherwise commit to the
  // wrong branch during that gap and never revisit it.
  const [reduced, setReduced] = useState(getPreference)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches)
    query.addEventListener('change', listener)
    return () => query.removeEventListener('change', listener)
  }, [])

  return reduced
}
