import { profile } from '../data/content'

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-205 px-4 py-10">
      <div className="screen text-center py-8">
        <p className="font-pixel text-sm">SAVING…</p>
        <p className="text-[22px]">Would you like to save this contact before you go?</p>
        <div className="mt-5 flex flex-wrap justify-center gap-4">
          <a
            href={`mailto:${profile.email}`}
            className="font-pixel pixel-shadow border-[3px] border-ink bg-green-light px-5 py-3 text-[13px] text-ink no-underline transition-transform duration-75 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            YES
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-pixel pixel-shadow border-[3px] border-ink bg-cream px-5 py-3 text-[13px] text-ink no-underline transition-transform duration-75 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            GITHUB
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-pixel pixel-shadow border-[3px] border-ink bg-cream px-5 py-3 text-[13px] text-ink no-underline transition-transform duration-75 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            LINKEDIN
          </a>
        </div>
        <p className="mt-5 text-base">{profile.phone}</p>
      </div>
    </section>
  )
}
