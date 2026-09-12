import { useEffect, useRef, useState } from 'react'

const FALLBACK_DELAY_MS = 1500

/**
 * Fires once, the first time the element scrolls into view.
 *
 * Also force-resolves to `true` after a short fallback delay regardless of
 * whether the IntersectionObserver ever actually fired — a fast scroll (an
 * instant anchor jump, a nav click when smooth-scroll is off) can skip an
 * element past the viewport in a single frame, and an observer-only signal
 * would then leave whatever depends on it (an HP bar, a stat tile's
 * count-up) permanently stuck at its zero state. Verified: this happened to
 * the Experience stat tiles after a script jumped straight to a later
 * section — same root cause already fixed once for `Reveal`; fixed here at
 * the shared hook so every consumer gets it for free.
 */
export function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || inView) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            observer.disconnect()
          }
        }
      },
      { threshold },
    )
    observer.observe(node)

    const fallback = window.setTimeout(() => setInView(true), FALLBACK_DELAY_MS)

    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [inView, threshold])

  return { ref, inView } as const
}
