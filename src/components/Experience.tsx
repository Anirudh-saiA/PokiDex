import { experience } from '../data/content'
import { RichText } from './RichText'
import { SectionBanner } from './SectionBanner'
import { StatTile } from './StatTile'

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-205 px-4 py-10">
      <div className="screen">
        <SectionBanner title="Wild Battle Encounter: Industry Exp" tag="ML Intern" />

        <div className="border-[3px] border-ink bg-panel p-4.5">
          <div className="font-pixel mb-2.5 flex flex-wrap justify-between gap-2 text-xs text-red">
            <span>Wild {experience.company.toUpperCase()} Internship</span>
            <span>{experience.role.toUpperCase()}</span>
          </div>
          <p className="mb-2 text-sm opacity-75">
            {experience.period} · {experience.location}
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-[19px]">
            {experience.moves.map((move) => (
              <li key={move}>
                <RichText text={move} />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
          {experience.stats.map((stat) => (
            <StatTile key={stat.label} label={stat.label} accent={stat.accent} value={stat.value} suffix={stat.suffix} />
          ))}
        </div>
      </div>
    </section>
  )
}
