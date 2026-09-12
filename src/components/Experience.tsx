import { experience } from '../data/content'
import { RichText } from './RichText'

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-205 px-4 py-10">
      <div className="screen">
        <h2 className="font-pixel mb-5 inline-block bg-ink px-3 py-2 text-sm text-cream">
          Wild Encounter — Work Experience
        </h2>

        <div className="border-[3px] border-ink bg-panel p-4.5">
          <div className="font-pixel mb-2.5 flex flex-wrap justify-between gap-2 text-xs text-red">
            <span>{experience.company.toUpperCase()}</span>
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
      </div>
    </section>
  )
}
