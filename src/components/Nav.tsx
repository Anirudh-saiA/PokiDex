import { useState } from 'react'
import { navItems } from '../data/content'
import { useActiveSection } from '../hooks/useActiveSection'

const ids = navItems.map((item) => item.id)

export function Nav() {
  const [pressed, setPressed] = useState<string | null>(null)
  const active = useActiveSection(ids)

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setPressed(id)
    window.setTimeout(() => setPressed((current) => (current === id ? null : current)), 150)
  }

  return (
    <nav
      aria-label="Section navigation"
      className="sticky top-0 z-50 flex flex-wrap justify-center gap-2 border-b-4 border-ink bg-panel px-2 py-2.5"
    >
      {navItems.map((item) => {
        const isActive = active === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleClick(item.id)}
            aria-current={isActive ? 'true' : undefined}
            className={`font-pixel pixel-border pixel-shadow px-3.5 py-2.5 text-[11px] text-ink transition-transform duration-75 hover:bg-yellow ${
              isActive ? 'bg-yellow' : 'bg-cream'
            } ${pressed === item.id ? 'pixel-shadow-active' : ''}`}
          >
            {item.label.toUpperCase()}
          </button>
        )
      })}
    </nav>
  )
}
