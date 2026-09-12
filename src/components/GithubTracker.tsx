import { useMemo } from 'react'
import { liveTrackers } from '../data/content'
import { useFetch } from '../hooks/useFetch'
import { useRecentActivity } from '../hooks/useRecentActivity'
import { timeAgo } from '../lib/time'
import { TrackerError, TrackerLoading } from './TrackerStatus'
import { Highlight } from './RichText'
import { SectionBanner } from './SectionBanner'
import { StatTile } from './StatTile'

const USERNAME = liveTrackers.githubUsername
const PROFILE_URL = `https://api.github.com/users/${USERNAME}`
// per_page=100 covers this account's full repo list in one call, so the
// star total below is accurate rather than only summing the 6 shown below.
const REPOS_URL = `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`
const CONTRIBUTIONS_URL = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`
const REPOS_SHOWN = 6

interface GithubProfile {
  login: string
  name: string | null
  bio: string | null
  avatar_url: string
  html_url: string
  public_repos: number
  followers: number
  following: number
}

interface GithubRepo {
  id: number
  name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
}

interface ContributionDay {
  date: string
  count: number
  level: number
}

interface ContributionsResponse {
  total: Record<string, number>
  contributions: ContributionDay[]
}

const LEVEL_COLORS = ['#e6e2d0', '#c9e8a8', '#9bd66b', '#6bbf4a', '#4f7a34']

const LOG_TAG: Record<'commit' | 'pull_request', { label: string; color: string }> = {
  commit: { label: 'COMMIT', color: '#9bd66b' },
  pull_request: { label: 'PULL REQ', color: '#8fc4ff' },
}

function buildWeeks(days: ContributionDay[]): (ContributionDay | null)[][] {
  const weeks: (ContributionDay | null)[][] = []
  let week: (ContributionDay | null)[] = new Array(7).fill(null)
  for (const day of days) {
    const dow = new Date(`${day.date}T00:00:00Z`).getUTCDay()
    week[dow] = day
    if (dow === 6) {
      weeks.push(week)
      week = new Array(7).fill(null)
    }
  }
  if (week.some((d) => d !== null)) weeks.push(week)
  return weeks
}

export function GithubTracker() {
  const profile = useFetch<GithubProfile>(PROFILE_URL)
  const repos = useFetch<GithubRepo[]>(REPOS_URL)
  const contributions = useFetch<ContributionsResponse>(CONTRIBUTIONS_URL)
  const repoNames = repos.status === 'success' ? repos.data.map((r) => r.name) : null
  const activity = useRecentActivity(USERNAME, repoNames)

  const weeks = useMemo(
    () => (contributions.status === 'success' ? buildWeeks(contributions.data.contributions) : []),
    [contributions],
  )
  const totalStars = repos.status === 'success' ? repos.data.reduce((sum, r) => sum + r.stargazers_count, 0) : 0

  return (
    <section id="github" className="mx-auto max-w-205 px-4 py-10">
      <div className="screen">
        <SectionBanner title="Trainer Card: GitHub Telemetry" tag="Live" />

        {profile.status === 'loading' && <TrackerLoading label="trainer card" />}
        {profile.status === 'error' && (
          <TrackerError label="GitHub" message={profile.error} href={`https://github.com/${USERNAME}`} />
        )}
        {profile.status === 'success' && (
          <div className="mb-5 flex flex-wrap items-center gap-4">
            <img
              src={profile.data.avatar_url}
              alt={`${profile.data.login}'s GitHub avatar`}
              width={64}
              height={64}
              className="border-[3px] border-ink"
            />
            <div className="min-w-0 flex-1">
              <a
                href={profile.data.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-pixel text-xs text-ink no-underline hover:text-blue"
              >
                @{profile.data.login}
              </a>
              {profile.data.bio && <p className="mt-1.5 mb-0 text-lg">{profile.data.bio}</p>}
            </div>
          </div>
        )}

        {/* Stat tiles */}
        {profile.status === 'success' && repos.status === 'success' && (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label="Public Repos" value={profile.data.public_repos} accent="red" />
            <StatTile label="Followers" value={profile.data.followers} accent="blue" />
            <StatTile
              label="Pull Requests"
              value={activity.status === 'success' ? activity.data.totalPullRequests : 0}
              accent="green"
            />
            <StatTile label="Stars Earned" value={totalStars} accent="orange" />
          </div>
        )}

        {/* Contribution heatmap */}
        <h3 className="font-pixel my-4 text-[13px] text-blue">Route Map — Contributions</h3>
        {contributions.status === 'loading' && <TrackerLoading label="contribution map" />}
        {contributions.status === 'error' && (
          <TrackerError
            label="the contribution map"
            message={contributions.error}
            href={`https://github.com/${USERNAME}`}
          />
        )}
        {contributions.status === 'success' && (
          <div>
            <p className="mb-2 text-base">
              <Highlight>{contributions.data.total.lastYear ?? 0} contributions</Highlight> in the last year
            </p>
            <div className="overflow-x-auto pb-2">
              <div className="grid w-max grid-flow-col grid-rows-7 gap-0.75">
                {weeks.flatMap((week, wi) =>
                  week.map((day, di) => (
                    <div
                      key={`${wi}-${di}`}
                      title={day ? `${day.date}: ${day.count} contribution${day.count === 1 ? '' : 's'}` : undefined}
                      className="h-2.5 w-2.5 border border-ink/30"
                      style={{ background: day ? LEVEL_COLORS[day.level] : 'transparent', borderColor: day ? undefined : 'transparent' }}
                    />
                  )),
                )}
              </div>
            </div>
          </div>
        )}

        {/* Activity log, terminal style */}
        <h3 className="font-pixel my-4 text-[13px] text-blue">Recent Repository Log</h3>
        {(activity.status === 'loading' || (repos.status === 'loading' && activity.status !== 'success')) && (
          <TrackerLoading label="activity log" />
        )}
        {activity.status === 'error' && (
          <TrackerError label="the activity log" message={activity.error} href={`https://github.com/${USERNAME}`} />
        )}
        {activity.status === 'success' && (
          <div className="terminal-log mb-6">
            {activity.data.items.length === 0 && <p className="terminal-log-line opacity-70">No recent activity to show.</p>}
            {activity.data.items.map((item) => {
              const tag = LOG_TAG[item.kind]
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="terminal-log-line block hover:underline"
                >
                  <span style={{ color: tag.color }}>[{tag.label}]</span> {item.text}{' '}
                  <span className="opacity-60">→ {item.repo}</span>{' '}
                  <span className="opacity-50">({timeAgo(item.date)})</span>
                </a>
              )
            })}
          </div>
        )}

        {/* Recent repos */}
        <h3 className="font-pixel my-4 text-[13px] text-blue">Recently Updated Repos</h3>
        {repos.status === 'loading' && <TrackerLoading label="repositories" />}
        {repos.status === 'error' && (
          <TrackerError label="the repo list" message={repos.error} href={`https://github.com/${USERNAME}?tab=repositories`} />
        )}
        {repos.status === 'success' && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5">
            {repos.data.slice(0, REPOS_SHOWN).map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border-[3px] border-ink bg-panel p-3.5 text-ink no-underline transition-transform hover:-translate-y-0.5"
              >
                <p className="font-pixel mb-2 text-[11px]">{repo.name}</p>
                {repo.description && <p className="mb-2 text-base opacity-80 line-clamp-2">{repo.description}</p>}
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm opacity-70">
                  {repo.language && <span>● {repo.language}</span>}
                  <span>★ {repo.stargazers_count}</span>
                  <span>⑂ {repo.forks_count}</span>
                  <span>Updated {timeAgo(repo.updated_at)}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
