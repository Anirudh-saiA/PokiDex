/**
 * An original 8-bit-style background loop synthesized entirely with the Web
 * Audio API — no external audio file, so nothing to host and nothing
 * copyrighted. This is a from-scratch composition (four voices: a
 * square-wave lead, a triangle-wave bass, a soft sine harmony pad, and a
 * filtered-noise tick for rhythm) and deliberately does not reproduce or
 * arrange any existing melody from any game or franchise.
 */

const STEP_MS = 185

// Two-bar original phrase (16 steps) in C major, lead voice.
const LEAD_HZ = [
  392.0, 440.0, 523.25, 587.33, 523.25, 440.0, 392.0, 329.63, 349.23, 392.0, 440.0, 523.25, 440.0, 392.0, 349.23,
  329.63,
]

// Bass root notes, one every 4 steps: C - Am - F - G (a simple original progression).
const BASS_HZ = [130.81, 130.81, 130.81, 130.81, 220.0, 220.0, 220.0, 220.0, 174.61, 174.61, 174.61, 174.61, 196.0, 196.0, 196.0, 196.0]

// Harmony pad: sustained fifth above each bass root, softly under everything.
const PAD_HZ = [196.0, 196.0, 196.0, 196.0, 164.81, 164.81, 164.81, 164.81, 261.63, 261.63, 261.63, 261.63, 293.66, 293.66, 293.66, 293.66]

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
    this.masterGain.gain.value = 0.055
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

  private playTone(freq: number, durationMs: number, type: OscillatorType, gainValue: number) {
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

  /** A short filtered burst of noise for a soft rhythmic tick, not a melodic voice. */
  private playTick(durationMs: number, gainValue: number) {
    const ctx = this.ctx
    const master = this.masterGain
    if (!ctx || !master) return
    const bufferSize = Math.floor(ctx.sampleRate * (durationMs / 1000))
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1

    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 6000
    const gain = ctx.createGain()
    const now = ctx.currentTime
    gain.gain.setValueAtTime(gainValue, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000)

    noise.connect(filter).connect(gain).connect(master)
    noise.start(now)
  }

  private scheduleNext() {
    if (!this.playing) return
    const i = this.step % LEAD_HZ.length

    this.playTone(LEAD_HZ[i], STEP_MS * 0.8, 'square', 0.45)
    this.playTick(STEP_MS * 0.3, 0.12)
    if (i % 4 === 0) {
      this.playTone(BASS_HZ[i], STEP_MS * 3.6, 'triangle', 0.55)
      this.playTone(PAD_HZ[i], STEP_MS * 3.6, 'sine', 0.18)
    }

    this.timer = window.setTimeout(() => {
      this.step += 1
      this.scheduleNext()
    }, STEP_MS)
  }
}
