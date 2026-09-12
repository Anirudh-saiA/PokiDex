import { badges, education } from '../data/content'
import { SectionBanner } from './SectionBanner'

export function Badges() {
  return (
    <section id="badges" className="mx-auto max-w-205 px-4 py-10">
      <div className="screen">
        <SectionBanner title={`Kanto League: ${badges.length} Certified Badges`} tag="Verified" tone="green" />
        <p className="mt-0 mb-4">
          {education.school} — {education.degree}, {education.detail}.
        </p>
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3.5">
          {badges.map((badge, i) => (
            <li
              key={badge}
              className="group relative w-full border-[3px] border-ink bg-panel p-3 text-center transition-transform duration-200 hover:-translate-y-0.5"
            >
              <span className="font-pixel absolute top-1 left-1.5 text-[10px] opacity-40">
                {(i + 1).toString().padStart(2, '0')}
              </span>
              <span
                className="mx-auto mb-2 block h-11 w-11 rounded-full border-[3px] border-ink bg-yellow group-hover:animate-[badge-wobble_0.5s_ease-in-out] motion-reduce:group-hover:animate-none"
                aria-hidden="true"
              />
              <p className="m-0 mt-1 text-[15px]">{badge}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm opacity-60">Earned through coursework, hackathons, and industry programs.</p>
      </div>
    </section>
  )
}
