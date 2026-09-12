import { useInView } from '../hooks/useInView'
import { useCountUp } from '../hooks/useCountUp'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const ACCENT_CLASS = {
  red: 'border-t-red',
  blue: 'border-t-blue',
  green: 'border-t-green',
  yellow: 'border-t-yellow',
  purple: 'border-t-purple',
  orange: 'border-t-orange',
} as const

type Accent = keyof typeof ACCENT_CLASS

interface StatTileProps {
  label: string
  accent?: Accent
  /** A number animates 0 -> value on first view. A string (e.g. "Top 8%") renders as-is. */
  value: number | string
  prefix?: string
  suffix?: string
}

export function StatTile({ label, accent = 'red', value, prefix = '', suffix = '' }: StatTileProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const reducedMotion = usePrefersReducedMotion()
  const isNumeric = typeof value === 'number'
  const animated = useCountUp(isNumeric ? value : 0, inView && isNumeric, reducedMotion)

  return (
    <div ref={ref} className={`stat-tile border-t-4 ${ACCENT_CLASS[accent]}`}>
      <p className="stat-tile-value tabular-nums">
        {prefix}
        {isNumeric ? animated.toLocaleString('en-US') : value}
        {suffix}
      </p>
      <p className="stat-tile-label">{label.toUpperCase()}</p>
    </div>
  )
}
