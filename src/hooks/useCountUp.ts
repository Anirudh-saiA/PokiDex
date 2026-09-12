import { useEffect, useRef, useState } from 'react'

/** Animates 0 -> target once `active` becomes true. Jumps straight to target under reduced motion. */
export function useCountUp(target: number, active: boolean, reducedMotion: boolean, duration = 1000): number {
  const [value, setValue] = useState(reducedMotion ? target : 0)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!active || startedRef.current) return
    startedRef.current = true

    if (reducedMotion) {
      setValue(target)
      return
    }

    const start = performance.now()
    let frame: number
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - progress) * (1 - progress) // ease-out quad
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, target, reducedMotion, duration])

  return value
}
