import { skillGroups, type Skill } from '../data/content'
import { useInView } from '../hooks/useInView'
import { SectionBanner } from './SectionBanner'

const fillColor: Record<Skill['level'], string> = {
  strong: 'bg-hp-green',
  solid: 'bg-hp-yellow',
  growing: 'bg-hp-red',
}

function StatRow({ skill }: { skill: Skill }) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div ref={ref} className="mb-3.5 last:mb-0">
      <div className="flex justify-between text-lg">
        <span>{skill.name.toUpperCase()}</span>
        <span className="tabular-nums text-sm opacity-60">{skill.value}/100</span>
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
          className={`h-full transition-[width] duration-1100 ease-out ${fillColor[skill.level]}`}
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
        <SectionBanner title="Pokédex Database: Skill Inventory" tag={`No. 001–${skillGroups.reduce((n, g) => n + g.skills.length, 0).toString().padStart(3, '0')}`} />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {skillGroups.map((group) => (
            <div key={group.title} className="border-[3px] border-ink bg-panel p-3.5">
              <h3 className="font-pixel mb-3 text-[12px] text-blue">{group.title.toUpperCase()}</h3>
              {group.skills.map((skill) => (
                <StatRow key={skill.name} skill={skill} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
