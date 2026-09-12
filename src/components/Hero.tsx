import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/content'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const STEP = 18
const SPRITE_WIDTH = 22
const MARGIN = 4

export function Hero() {
  const reducedMotion = usePrefersReducedMotion()
  const stageRef = useRef<HTMLDivElement | null>(null)
  const [position, setPosition] = useState(20)
  const [typed, setTyped] = useState(reducedMotion ? profile.intro : '')

  // Typewriter intro, once.
  useEffect(() => {
    if (reducedMotion) return
    let index = 0
    let frame: number
    const tick = () => {
      index += 1
      setTyped(profile.intro.slice(0, index))
      if (index < profile.intro.length) {
        frame = window.setTimeout(tick, 14)
      }
    }
    frame = window.setTimeout(tick, 14)
    return () => window.clearTimeout(frame)
  }, [reducedMotion])

  // Arrow-key walker easter egg.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const stage = stageRef.current
      if (!stage) return
      const max = stage.clientWidth - SPRITE_WIDTH - MARGIN
      if (event.key === 'ArrowRight') {
        setPosition((prev) => Math.min(prev + STEP, max))
      } else if (event.key === 'ArrowLeft') {
        setPosition((prev) => Math.max(prev - STEP, MARGIN))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <section id="about" className="mx-auto max-w-205 px-4 pt-9 text-center" aria-label="About">
      <div
        ref={stageRef}
        className="relative mx-auto mb-3 h-[120px] max-w-[600px] overflow-hidden border-[3px] border-ink"
        style={{
          background:
            'linear-gradient(180deg, #cdeab0 0%, #cdeab0 70%, #a9d17e 70%, #a9d17e 100%)',
        }}
        role="img"
        aria-label="Pixel overworld tile with a walking sprite"
      >
        <div
          className="absolute bottom-3.5 h-7 w-[22px] border-2 border-ink bg-red transition-[left] duration-75 ease-linear"
          style={{ left: `${position}px` }}
        >
          <span className="absolute -top-2.5 left-0.5 h-2.5 w-3.5 border-2 border-ink bg-[#f2c199]" />
        </div>
      </div>
      <p className="mt-1.5 text-sm opacity-70">use ← → arrow keys to walk</p>

      <h1 className="font-pixel my-4 text-2xl tracking-wide text-balance">{profile.name.toUpperCase()}</h1>
      <p className="mb-5 text-base text-green">{profile.tagline.toUpperCase()}</p>

      <div className="relative border-[3px] border-ink bg-panel px-5 py-4 text-left text-[22px] min-h-[110px]">
        <p aria-live="polite">{typed}</p>
        <span
          className="absolute bottom-2 right-3.5 animate-pulse text-sm motion-reduce:hidden"
          aria-hidden="true"
        >
          ▼
        </span>
      </div>
    </section>
  )
}
