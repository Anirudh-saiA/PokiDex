import { useEffect, useState } from 'react'

export type FetchState<T> =
  | { status: 'loading'; data: null; error: null }
  | { status: 'error'; data: null; error: string }
  | { status: 'success'; data: T; error: null }

/**
 * Fetches `url` once and reports loading/success/error. Never throws into
 * the render tree — a failed or slow endpoint degrades to a status message
 * in whatever section uses it, it never blocks or hides the rest of the page.
 */
export function useFetch<T>(url: string | null): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ status: 'loading', data: null, error: null })

  useEffect(() => {
    if (!url) return
    let cancelled = false
    setState({ status: 'loading', data: null, error: null })

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        return res.json() as Promise<T>
      })
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Request failed'
          setState({ status: 'error', data: null, error: message })
        }
      })

    return () => {
      cancelled = true
    }
  }, [url])

  return state
}
