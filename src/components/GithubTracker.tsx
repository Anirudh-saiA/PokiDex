import { useMemo } from 'react'
import { liveTrackers } from '../data/content'
import { useFetch } from '../hooks/useFetch'
import { timeAgo } from '../lib/time'
import { TrackerError, TrackerLoading } from './TrackerStatus'
import { Highlight } from './RichText'

const USERNAME = liveTrackers.githubUsername
const PROFILE_URL = `https://api.github.com/users/${USERNAME}`
const REPOS_URL = `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=6`
const EVENTS_URL = `https://api.github.com/users/${USERNAME}/events/public?per_page=15`
const CONTRIBUTIONS_URL = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`

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

interface GithubEvent {
  id: string
  type: string
  repo: { name: string }
  created_at: string
  payload: { action?: string; commits?: unknown[]; ref_type?: string; ref?: string }
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

function describeEvent(event: GithubEvent): string {
  const repo = event.repo.name.split('/')[1] ?? event.repo.name
  switch (event.type) {
    case 'PushEvent': {
      const count = event.payload.commits?.length ?? 1
      return `Pushed ${count} commit${count === 1 ? '' : 's'} to ${repo}`
    }
    case 'PullRequestEvent':
      return `${capitalize(event.payload.action ?? 'updated')} a pull request in ${repo}`
    case 'CreateEvent':
      return `Created ${event.payload.ref_type ?? 'repo'}${event.payload.ref ? ` "${event.payload.ref}"` : ''} in ${repo}`
    case 'WatchEvent':
      return `Starred ${repo}`
    case 'ForkEvent':
      return `Forked ${repo}`
    case 'IssuesEvent':
      return `${capitalize(event.payload.action ?? 'updated')} an issue in ${repo}`
    case 'IssueCommentEvent':
      return `Commented on an issue in ${repo}`
    default:
      return `${event.type.replace('Event', '')} in ${repo}`
  }
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function GithubTracker() {
  const profile = useFetch<GithubProfile>(PROFILE_URL)
  const repos = useFetch<GithubRepo[]>(REPOS_URL)
  const events = useFetch<GithubEvent[]>(EVENTS_URL)
  const contributions = useFetch<ContributionsResponse>(CONTRIBUTIONS_URL)

  const weeks = useMemo(
    () => (contributions.status === 'success' ? buildWeeks(contributions.data.contributions) : []),
    [contributions],
  )

  return (
    <section id="github" className="mx-auto max-w-205 px-4 py-10">
      <div className="screen">
        <h2 className="font-pixel mb-5 inline-block bg-ink px-3 py-2 text-sm text-cream">
          GitHub Log — Live Trainer Card
        </h2>

        {profile.status === 'loading' && <TrackerLoading label="trainer card" />}
        {profile.status === 'error' && (
          <TrackerError label="GitHub" message={profile.error} href={`https://github.com/${USERNAME}`} />
        )}
        {profile.status === 'success' && (
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <img
              src={profile.data.avatar_url}
              alt={`${profile.data.login}'s GitHub avatar`}
              width={72}
              height={72}
              className="border-[3px] border-ink"
              style={{ imageRendering: 'auto' }}
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
              {profile.data.bio && <p className="mt-1.5 mb-2 text-lg">{profile.data.bio}</p>}
              <div className="flex flex-wrap gap-2 text-base">
                <Highlight>{profile.data.public_repos} repos</Highlight>
                <Highlight>{profile.data.followers} followers</Highlight>
                <Highlight>{profile.data.following} following</Highlight>
              </div>
            </div>
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
              <div className="grid w-max grid-flow-col grid-rows-7 gap-[3px]">
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

        {/* Activity log */}
        <h3 className="font-pixel my-4 text-[13px] text-blue">Battle Log — Recent Pushes &amp; Pulls</h3>
        {events.status === 'loading' && <TrackerLoading label="activity log" />}
        {events.status === 'error' && (
          <TrackerError label="the activity log" message={events.error} href={`https://github.com/${USERNAME}`} />
        )}
        {events.status === 'success' && (
          <ul className="mb-6 border-[3px] border-ink bg-panel divide-y-2 divide-ink/15 text-[17px]">
            {events.data.length === 0 && <li className="p-3 opacity-70">No public activity recently.</li>}
            {events.data.slice(0, 8).map((event) => (
              <li key={event.id} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 p-3">
                <span>{describeEvent(event)}</span>
                <span className="text-sm opacity-60">{timeAgo(event.created_at)}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Recent repos */}
        <h3 className="font-pixel my-4 text-[13px] text-blue">Recently Updated Repos</h3>
        {repos.status === 'loading' && <TrackerLoading label="repositories" />}
        {repos.status === 'error' && (
          <TrackerError label="the repo list" message={repos.error} href={`https://github.com/${USERNAME}?tab=repositories`} />
        )}
        {repos.status === 'success' && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5">
            {repos.data.map((repo) => (
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
