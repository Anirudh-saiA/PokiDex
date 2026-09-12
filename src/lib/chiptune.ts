/**
 * A tiny, original 8-bit-style background loop synthesized entirely with the
 * Web Audio API — no external audio file, so nothing to host and nothing
 * copyrighted (this deliberately does not reproduce any real Game Boy/
 * Pokémon melody). Two voices: a square-wave arpeggio lead and a soft
 * triangle-wave bass, both scheduled step-by-step and looping.
 */

const STEP_MS = 190

// C major pentatonic, one bar of 8 steps, played twice per loop.
const LEAD_HZ = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 293.66, 329.63]
const BASS_HZ = [130.81, 130.81, 164.81, 164.81, 174.61, 174.61, 146.83, 146.83]

export class Chiptune {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private timer: number | null = null
  private step = 0
  private playing = false

  get isPlaying() {
    return this.playing
  }

  /** Must be called from a user gesture (click) — browsers block audio otherwise. */
  start() {
    if (this.playing) return
    const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    this.ctx = new AudioCtx()
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.value = 0.05
    this.masterGain.connect(this.ctx.destination)
    this.playing = true
    this.step = 0
    this.scheduleNext()
  }

  stop() {
    this.playing = false
    if (this.timer !== null) window.clearTimeout(this.timer)
    this.timer = null
    this.ctx?.close().catch(() => {})
    this.ctx = null
    this.masterGain = null
  }

  private playNote(freq: number, durationMs: number, type: OscillatorType, gainValue: number) {
    const ctx = this.ctx
    const master = this.masterGain
    if (!ctx || !master) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    const now = ctx.currentTime
    gain.gain.setValueAtTime(gainValue, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000)
    osc.connect(gain).connect(master)
    osc.start(now)
    osc.stop(now + durationMs / 1000)
  }

  private scheduleNext() {
    if (!this.playing) return
    const i = this.step % LEAD_HZ.length
    this.playNote(LEAD_HZ[i], STEP_MS * 0.85, 'square', 0.5)
    if (i % 2 === 0) this.playNote(BASS_HZ[i], STEP_MS * 1.7, 'triangle', 0.6)

    this.timer = window.setTimeout(() => {
      this.step += 1
      this.scheduleNext()
    }, STEP_MS)
  }
}
