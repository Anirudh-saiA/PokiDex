import { useEffect, useRef, useState } from 'react'
import { Chiptune } from '../lib/chiptune'

/**
 * Floating BGM toggle. Browsers block audio with sound from autoplaying
 * without a user gesture, so this always starts silent — the click that
 * turns it on *is* the required gesture. The loop itself is an original
 * synthesized chiptune (see lib/chiptune.ts), not a reproduction of any
 * real game's music.
 */
export function BgmPlayer() {
  const chiptuneRef = useRef<Chiptune | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    chiptuneRef.current = new Chiptune()
    return () => chiptuneRef.current?.stop()
  }, [])

  const toggle = () => {
    const chiptune = chiptuneRef.current
    if (!chiptune) return
    if (chiptune.isPlaying) {
      chiptune.stop()
      setPlaying(false)
    } else {
      chiptune.start()
      setPlaying(true)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? 'Mute background music' : 'Play background music'}
      className={`font-pixel fixed right-4 bottom-4 z-40 flex h-12 w-12 flex-col items-center justify-center gap-0.5 border-[3px] border-ink text-[8px] leading-none shadow-[3px_3px_0_var(--color-ink)] transition-transform active:translate-x-0.75 active:translate-y-0.75 active:shadow-none ${
        playing ? 'bg-yellow' : 'bg-panel'
      }`}
    >
      <span aria-hidden="true">♪</span>
      <span>{playing ? 'ON' : 'OFF'}</span>
    </button>
  )
}
