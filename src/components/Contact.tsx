import { profile } from '../data/content'
import { SectionBanner } from './SectionBanner'

const options = [
  { label: 'Yes — Send Email', caption: profile.email, href: `mailto:${profile.email}`, bg: 'bg-red text-cream' },
  { label: 'Yes — LinkedIn', caption: 'Connect professionally', href: profile.linkedin, bg: 'bg-blue text-cream' },
  { label: 'Yes — GitHub Repos', caption: 'See the code', href: profile.github, bg: 'bg-green text-cream' },
] as const

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-205 px-4 py-10">
      <div className="screen text-center py-8">
        <SectionBanner title="Transmit Comms: Save Game?" tag="Battery OK" />
        <p className="text-[22px]">Would you like to save this contact before you go?</p>
        <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5 text-left">
          {options.map((opt) => (
            <a
              key={opt.label}
              href={opt.href}
              target={opt.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={opt.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              className={`pixel-shadow block border-[3px] border-ink px-4 py-3 no-underline transition-transform duration-75 active:translate-x-0.75 active:translate-y-0.75 active:shadow-none ${opt.bg}`}
            >
              <span className="font-pixel block text-[12px]">{opt.label}</span>
              <span className="mt-1 block text-sm opacity-85">{opt.caption}</span>
            </a>
          ))}
        </div>
        <p className="mt-5 text-base">{profile.phone}</p>
      </div>
    </section>
  )
}
