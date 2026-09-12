import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const HOLD_MS = 1400
const FADE_MS = 400

/**
 * A one-time Game Boy power-on flourish: a growing bar "snaps" into the
 * title, holds briefly, then fades. Purely decorative chrome overlaid on
 * top of the real page — the page underneath is already fully rendered,
 * so this never gates content, and it unmounts on a hard timer (not an
 * observer or a user action) so it can never get stuck open.
 */
export function BootScreen() {
  const reducedMotion = usePrefersReducedMotion()
  const [visible, setVisible] = useState(!reducedMotion)

  useEffect(() => {
    if (reducedMotion) return
    const timeout = window.setTimeout(() => setVisible(false), HOLD_MS)
    return () => window.clearTimeout(timeout)
  }, [reducedMotion])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_MS / 1000, ease: 'easeOut' }}
          aria-hidden="true"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-1 w-40 bg-green-light"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="font-pixel absolute text-xs tracking-widest text-cream"
          >
            ANIRUDH.EXE
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
