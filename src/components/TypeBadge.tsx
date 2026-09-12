const TONE_BG = {
  red: 'bg-red',
  blue: 'bg-blue',
  green: 'bg-green',
  purple: 'bg-purple',
  orange: 'bg-orange',
  yellow: 'bg-yellow',
} as const

export type BadgeTone = keyof typeof TONE_BG

export function TypeBadge({ children, tone = 'blue' }: { children: string; tone?: BadgeTone }) {
  return <span className={`type-pill ${TONE_BG[tone]}`}>{children.toUpperCase()}</span>
}
