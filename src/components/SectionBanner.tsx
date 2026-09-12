import type { ReactNode } from 'react'

const TONE_CLASS = {
  red: 'banner-red',
  green: 'banner-green',
  blue: 'banner-blue',
} as const

export function SectionBanner({
  title,
  tag,
  tone = 'red',
}: {
  title: string
  tag?: ReactNode
  tone?: keyof typeof TONE_CLASS
}) {
  return (
    <div className={`banner ${TONE_CLASS[tone]}`}>
      <h2 className="font-pixel text-[13px] leading-relaxed sm:text-sm">■ {title}</h2>
      {tag && <span className="font-pixel shrink-0 border-2 border-cream/70 px-2 py-1 text-[10px]">{tag}</span>}
    </div>
  )
}
