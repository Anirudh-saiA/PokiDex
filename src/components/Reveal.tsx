import { motion, useAnimationControls, useInView } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const VISIBLE = { opacity: 1, y: 0 }
const FALLBACK_DELAY_MS = 1200

/**
 * Fades + lifts a section in once, the first time it scrolls into view.
 * A no-op wrapper when reduced motion is preferred.
 *
 * IntersectionObserver-driven reveals can miss a section entirely if a
 * user's scroll jumps straight past it in one frame (an instant anchor
 * jump, a fast nav click when smooth-scroll is disabled) — the section
 * never registers as "intersecting" and stays at opacity: 0 forever. Real
 * resume content can't be allowed to disappear that way, so this also
 * force-reveals after a short delay regardless of whether it was ever
 * observed entering the viewport.
 */
export function Reveal({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  const controls = useAnimationControls()

  useEffect(() => {
    if (inView) controls.start(VISIBLE)
  }, [inView, controls])

  useEffect(() => {
    const timeout = window.setTimeout(() => controls.start(VISIBLE), FALLBACK_DELAY_MS)
    return () => window.clearTimeout(timeout)
  }, [controls])

  if (reducedMotion) return <>{children}</>

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={controls}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
