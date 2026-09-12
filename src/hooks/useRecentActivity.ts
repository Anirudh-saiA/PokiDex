import { useEffect, useState } from 'react'
import type { FetchState } from './useFetch'

export interface ActivityItem {
  id: string
  kind: 'commit' | 'pull_request'
  text: string
  repo: string
  url: string
  date: string
}

export interface RecentActivity {
  items: ActivityItem[]
  totalPullRequests: number
}

interface RawCommit {
  sha: string
  html_url: string
  commit: { message: string; author: { date: string } }
}

interface RawPull {
  id: number
  html_url: string
  title: string
  state: string
  updated_at: string
  repository_url: string
  pull_request?: { merged_at: string | null }
}

/**
 * GitHub's public Events API (/users/:user/events/public) is well known to
 * be unreliable — it can simply never generate an event for a given repo's
 * pushes, independent of any caching delay (verified: /repos/:o/:r/events
 * returned an empty array for a repo with several confirmed, real pushes).
 * Per-repo commit history and the PR search endpoint are both reliable and
 * reflect changes immediately, so the activity feed is built from those
 * instead of the events feed. The PR search response's `total_count` also
 * gives an honest, exact pull-request count for the stat tile — no fabricated
 * "total commits" number is shown, since GitHub's REST API has no cheap way
 * to get that count without paginating every repo's full commit history.
 */
export function useRecentActivity(username: string, repoNames: string[] | null): FetchState<RecentActivity> {
  const key = repoNames?.join(',') ?? null
  const [state, setState] = useState<FetchState<RecentActivity>>({ status: 'loading', data: null, error: null })

  useEffect(() => {
    if (!repoNames || repoNames.length === 0) return
    let cancelled = false
    setState({ status: 'loading', data: null, error: null })

    const commitCalls = repoNames.slice(0, 4).map((repo) =>
      fetch(`https://api.github.com/repos/${username}/${repo}/commits?per_page=3`)
        .then((res) => (res.ok ? (res.json() as Promise<RawCommit[]>) : []))
        .then((commits) =>
          commits.map(
            (c): ActivityItem => ({
              id: c.sha,
              kind: 'commit',
              text: `${c.commit.message.split('\n')[0]}`,
              repo,
              url: c.html_url,
              date: c.commit.author.date,
            }),
          ),
        )
        .catch(() => [] as ActivityItem[]),
    )

    const pullCall = fetch(
      `https://api.github.com/search/issues?q=author:${username}+type:pr&sort=updated&order=desc&per_page=5`,
    )
      .then((res) => (res.ok ? res.json() : { items: [], total_count: 0 }))
      .then((data: { items: RawPull[]; total_count: number }) => ({
        totalCount: data.total_count,
        items: data.items.map(
          (pr): ActivityItem => ({
            id: `pr-${pr.id}`,
            kind: 'pull_request',
            text: `${pr.pull_request?.merged_at ? 'Merged' : pr.state === 'closed' ? 'Closed' : 'Opened'} pull request: ${pr.title}`,
            repo: pr.repository_url.split('/').slice(-1)[0],
            url: pr.html_url,
            date: pr.updated_at,
          }),
        ),
      }))
      .catch(() => ({ totalCount: 0, items: [] as ActivityItem[] }))

    Promise.all([Promise.all(commitCalls), pullCall]).then(([commitResults, pullResult]) => {
      if (cancelled) return
      const merged = [...commitResults.flat(), ...pullResult.items]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8)
      setState({ status: 'success', data: { items: merged, totalPullRequests: pullResult.totalCount }, error: null })
    })

    return () => {
      cancelled = true
    }
  }, [username, key])

  return state
}
