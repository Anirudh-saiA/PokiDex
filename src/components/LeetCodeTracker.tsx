import { leetcodeTopics, liveTrackers } from '../data/content'
import { useFetch } from '../hooks/useFetch'
import { useInView } from '../hooks/useInView'
import { SectionBanner } from './SectionBanner'
import { StatTile } from './StatTile'
import { TrackerError, TrackerLoading } from './TrackerStatus'

const USERNAME = liveTrackers.leetcodeUsername
const STATS_URL = `https://leetcode-api-faisalshohag.vercel.app/${USERNAME}`

interface LeetCodeStats {
  totalSolved: number
  totalQuestions: number
  totalSubmissions: { difficulty: string; count: number; submissions: number }[]
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
  const allSubs = stats.status === 'success' ? stats.data.totalSubmissions.find((s) => s.difficulty === 'All') : null
  const acceptanceRate = allSubs && allSubs.submissions > 0 ? Math.round((allSubs.count / allSubs.submissions) * 100) : null

  return (
    <section id="leetcode" className="mx-auto max-w-205 px-4 py-10">
      <div className="screen">
        <SectionBanner title="Battle Tower: Algorithm Arena" tag="Live" />

        {stats.status === 'loading' && <TrackerLoading label="training record" />}
        {stats.status === 'error' && (
          <TrackerError label="LeetCode" message={stats.error} href={liveTrackers.leetcodeProfileUrl} />
        )}
        {stats.status === 'success' && (
          <>
            <div className="mb-6 grid grid-cols-3 gap-3">
              <StatTile label="Problems Solved" value={stats.data.totalSolved} accent="red" />
              <StatTile label="Global Rank" value={stats.data.ranking} prefix="#" accent="blue" />
              {acceptanceRate !== null && <StatTile label="Acceptance Rate" value={acceptanceRate} suffix="%" accent="green" />}
            </div>

            <h3 className="font-pixel my-4 text-[13px] text-blue">Clearance Meters by Difficulty</h3>
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

            <h3 className="font-pixel my-4 text-[13px] text-blue">Signature Battle Moves</h3>
            <div className="flex flex-wrap gap-2">
              {leetcodeTopics.map((topic) => (
                <span key={topic} className="type-pill bg-purple">
                  {topic}
                </span>
              ))}
            </div>
          </>
        )}

        <a
          href={liveTrackers.leetcodeProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block text-base text-blue underline"
        >
          View full profile on LeetCode →
        </a>
      </div>
    </section>
  )
}
