import { liveTrackers } from '../data/content'
import { useFetch } from '../hooks/useFetch'
import { useInView } from '../hooks/useInView'
import { Highlight } from './RichText'
import { TrackerError, TrackerLoading } from './TrackerStatus'

const USERNAME = liveTrackers.leetcodeUsername
const STATS_URL = `https://leetcode-api-faisalshohag.vercel.app/${USERNAME}`

interface LeetCodeStats {
  totalSolved: number
  totalQuestions: number
  easySolved: number
  totalEasy: number
  mediumSolved: number
  totalMedium: number
  hardSolved: number
  totalHard: number
  ranking: number
}

const DIFFICULTIES = [
  { key: 'easySolved', total: 'totalEasy', label: 'Easy', colorClass: 'bg-hp-green' },
  { key: 'mediumSolved', total: 'totalMedium', label: 'Medium', colorClass: 'bg-hp-yellow' },
  { key: 'hardSolved', total: 'totalHard', label: 'Hard', colorClass: 'bg-hp-red' },
] as const

function DifficultyBar({
  label,
  solved,
  total,
  share,
  colorClass,
}: {
  label: string
  solved: number
  total: number
  share: number
  colorClass: string
}) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div ref={ref} className="mb-3.5">
      <div className="flex justify-between text-lg">
        <span>{label.toUpperCase()}</span>
        <span className="tabular-nums">
          {solved} / {total} solved
        </span>
      </div>
      <div className="mt-1 h-3.5 border-2 border-ink bg-[#e6e2d0]">
        <div
          className={`h-full transition-[width] duration-1100 ease-out ${colorClass}`}
          style={{ width: inView ? `${share}%` : '0%' }}
        />
      </div>
    </div>
  )
}

export function LeetCodeTracker() {
  const stats = useFetch<LeetCodeStats>(STATS_URL)

  return (
    <section id="leetcode" className="mx-auto max-w-205 px-4 py-10">
      <div className="screen">
        <h2 className="font-pixel mb-5 inline-block bg-ink px-3 py-2 text-sm text-cream">
          LeetCode Log — Training Record
        </h2>

        {stats.status === 'loading' && <TrackerLoading label="training record" />}
        {stats.status === 'error' && (
          <TrackerError label="LeetCode" message={stats.error} href={liveTrackers.leetcodeProfileUrl} />
        )}
        {stats.status === 'success' && (
          <>
            <div className="mb-5 flex flex-wrap items-center gap-3 text-lg">
              <Highlight>{stats.data.totalSolved} solved</Highlight>
              <span>out of {stats.data.totalQuestions} questions</span>
              <Highlight>Rank #{stats.data.ranking.toLocaleString('en-US')}</Highlight>
            </div>
            <p className="mb-1 text-sm opacity-70">Bar width shows how your solved problems split across difficulties.</p>
            {DIFFICULTIES.map((d) => {
              const solved = stats.data[d.key]
              const share = stats.data.totalSolved > 0 ? (solved / stats.data.totalSolved) * 100 : 0
              return (
                <DifficultyBar
                  key={d.key}
                  label={d.label}
                  solved={solved}
                  total={stats.data[d.total]}
                  share={share}
                  colorClass={d.colorClass}
                />
              )
            })}
          </>
        )}

        <a
          href={liveTrackers.leetcodeProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-base text-blue underline"
        >
          View full profile on LeetCode →
        </a>
      </div>
    </section>
  )
}
