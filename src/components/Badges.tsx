import { badges, education } from '../data/content'

export function Badges() {
  return (
    <section id="badges" className="mx-auto max-w-205 px-4 py-10">
      <div className="screen">
        <h2 className="font-pixel mb-5 inline-block bg-ink px-3 py-2 text-sm text-cream">
          Gym Badges — Education &amp; Certs
        </h2>
        <p className="mt-0 mb-4">
          {education.school} — {education.degree}, {education.detail}.
        </p>
        <ul className="flex flex-wrap gap-3.5">
          {badges.map((badge) => (
            <li
              key={badge}
              className="w-[150px] border-[3px] border-ink bg-panel p-3 text-center"
            >
              <span
                className="mx-auto mb-2 block h-11 w-11 rounded-full border-[3px] border-ink bg-yellow"
                aria-hidden="true"
              />
              <p className="m-0 mt-1 text-[15px]">{badge}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
