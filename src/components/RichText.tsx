import type { ReactNode } from 'react'

/**
 * Tiny inline markup for body copy: {{...}} wraps a standout figure in the
 * accent-yellow highlight chip, [[...]] renders a genuinely important word
 * in the Pokémon-red accent. Kept out of the content strings' plain reading
 * (they degrade to the marker characters if ever rendered raw) but easy to
 * scan in data/content.ts.
 */
const PATTERN = /\{\{(.+?)\}\}|\[\[(.+?)\]\]/g

export function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block whitespace-nowrap border-[3px] border-ink bg-yellow px-1.5 text-ink shadow-[3px_3px_0_var(--color-ink)]">
      {children}
    </span>
  )
}

export function RichText({ text }: { text: string }) {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let key = 0
  let match: RegExpExecArray | null

  PATTERN.lastIndex = 0
  while ((match = PATTERN.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))
    if (match[1] !== undefined) {
      nodes.push(<Highlight key={key++}>{match[1]}</Highlight>)
    } else if (match[2] !== undefined) {
      nodes.push(
        <strong key={key++} className="text-red font-normal">
          {match[2]}
        </strong>,
      )
    }
    lastIndex = PATTERN.lastIndex
  }
  nodes.push(text.slice(lastIndex))

  return <>{nodes}</>
}
