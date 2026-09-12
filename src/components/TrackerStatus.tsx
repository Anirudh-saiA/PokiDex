/** Loading / error placeholder shared by the live trackers — never the whole section, just the slot the data would fill. */
export function TrackerLoading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 border-[3px] border-dashed border-ink/40 bg-cream/60 px-4 py-6 text-base opacity-70">
      <span className="inline-block h-2.5 w-2.5 animate-pulse bg-blue motion-reduce:animate-none" aria-hidden="true" />
      Loading {label}…
    </div>
  )
}

export function TrackerError({ label, message, href }: { label: string; message: string; href: string }) {
  return (
    <div className="border-[3px] border-ink bg-cream px-4 py-4 text-base">
      <p className="m-0">
        Couldn't reach {label} right now ({message}). Free public APIs like this occasionally sleep or rate-limit —
        it isn't a broken page.
      </p>
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue underline">
        View the profile directly →
      </a>
    </div>
  )
}
