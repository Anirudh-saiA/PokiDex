import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/content'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const STEP = 18
const SPRITE_WIDTH = 22
const MARGIN = 4

const SPARKLES = [
  { left: 15, top: 30, delay: 0 },
  { left: 45, top: 55, delay: 1.2 },
  { left: 70, top: 25, delay: 2.1 },
  { left: 85, top: 60, delay: 0.7 },
  { left: 30, top: 70, delay: 3 },
]

export function Hero() {
  const reducedMotion = usePrefersReducedMotion()
  const stageRef = useRef<HTMLDivElement | null>(null)
  const [position, setPosition] = useState(20)
  // Start with real content on first paint (never an empty string) — if every
  // effect below failed to run, the bio would still read as one full character
  // rather than a blank box.
  const [typed, setTyped] = useState(reducedMotion ? profile.intro : profile.intro.slice(0, 1))
  const timeoutRef = useRef<number | null>(null)

  // Typewriter intro, once. Purely a visual layer on top of content that's
  // already present — the effect only ever reveals more of `profile.intro`,
  // it never gates whether the paragraph exists.
  useEffect(() => {
    if (reducedMotion) return

    // React 19 Strict Mode runs this effect twice in dev: mount, cleanup,
    // mount again. Track the pending timeout in a ref (not a closure local)
    // and clear it defensively before scheduling a new one, so the second
    // invocation can't leave a stray timer racing the first.
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    let index = 1 // char 0 is already on screen from initial state
    const tick = () => {
      index += 1
      setTyped(profile.intro.slice(0, index))
      if (index < profile.intro.length) {
        timeoutRef.current = window.setTimeout(tick, 14)
      }
    }
    timeoutRef.current = window.setTimeout(tick, 14)

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
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
      <div className="banner banner-red mx-auto mb-5 max-w-150 text-left">
        <h1 className="font-pixel text-[11px] leading-relaxed sm:text-xs">■ Route 01 — Pallet Town HQ</h1>
        <span className="font-pixel shrink-0 border-2 border-cream/70 px-2 py-1 text-[9px]">Signal: Online</span>
      </div>
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
        {!reducedMotion &&
          SPARKLES.map((s, i) => (
            <span
              key={i}
              className="sparkle"
              style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s` }}
              aria-hidden="true"
            />
          ))}
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
