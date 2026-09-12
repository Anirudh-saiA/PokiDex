import { skillGroups, type Skill } from '../data/content'
import { useInView } from '../hooks/useInView'

const fillColor: Record<Skill['level'], string> = {
  strong: 'bg-hp-green',
  solid: 'bg-hp-yellow',
  growing: 'bg-hp-red',
}

function StatRow({ skill }: { skill: Skill }) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div ref={ref} className="mb-3.5">
      <div className="flex justify-between text-lg">
        <span>{skill.name.toUpperCase()}</span>
      </div>
      <div
        className="mt-1 h-3.5 border-2 border-ink bg-[#e6e2d0]"
        role="meter"
        aria-label={`${skill.name} proficiency`}
        aria-valuenow={skill.value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full transition-[width] duration-[1100ms] ease-out ${fillColor[skill.level]}`}
          style={{ width: inView ? `${skill.value}%` : '0%' }}
        />
      </div>
    </div>
  )
}

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-205 px-4 py-10">
      <div className="screen">
        <h2 className="font-pixel mb-5 inline-block bg-ink px-3 py-2 text-sm text-cream">
          Pokédex — Skill Entries
        </h2>

        {skillGroups.map((group) => (
          <div key={group.title} className="mb-2">
            <h3 className="font-pixel my-5 text-[13px] text-blue">{group.title.toUpperCase()}</h3>
            {group.skills.map((skill) => (
              <StatRow key={skill.name} skill={skill} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
