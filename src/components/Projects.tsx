import { useState } from 'react'
import { projects, type Project } from '../data/content'
import { RichText } from './RichText'
import { SectionBanner } from './SectionBanner'
import { TypeBadge } from './TypeBadge'

function ProjectCard({ project }: { project: Project }) {
  const [flipped, setFlipped] = useState(false)
  const frontId = `${project.name}-front`
  const backId = `${project.name}-back`

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      className="group h-80 w-full text-left perspective-[1000px] transition-transform duration-200 hover:-translate-y-1 motion-reduce:hover:translate-y-0"
      aria-pressed={flipped}
      aria-label={`${project.name}, ${project.type}. Press to ${flipped ? 'show the front' : 'reveal details'}.`}
    >
      <div
        className="relative h-full w-full transition-transform duration-600 transform-3d motion-reduce:transition-none"
        style={{ transform: flipped ? 'rotateY(180deg)' : 'none' }}
      >
        <div
          id={frontId}
          className="absolute inset-0 flex flex-col justify-between border-[3px] border-ink bg-panel p-4 backface-hidden"
        >
          <div>
            <TypeBadge tone={project.tone}>{project.type}</TypeBadge>
            <div className="font-pixel mt-2.5 text-xs leading-relaxed">{project.name.toUpperCase()}</div>
            <p className="mt-3 text-lg">{project.summary}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span key={tech} className="border border-ink/40 px-1.5 py-0.5 text-sm opacity-70">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right text-sm opacity-70">tap ▶</div>
        </div>

        <div
          id={backId}
          className="absolute inset-0 overflow-auto border-[3px] border-ink bg-panel p-4 text-[17px] backface-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="font-pixel mb-2 text-xs">{project.name.toUpperCase()}</div>
          {project.details.map((line) => (
            <p key={line} className="mb-2">
              <RichText text={line} />
            </p>
          ))}
        </div>
      </div>
    </button>
  )
}

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-205 px-4 py-10">
      <div className="screen">
        <SectionBanner title="Silph Bag: Key AI Repositories" tag="3 items" />
        <p className="-mt-2 mb-4 text-base opacity-70">Tap or press Enter on a card to flip it.</p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4.5">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
