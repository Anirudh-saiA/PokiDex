import { motion } from 'framer-motion'
import { useState } from 'react'
import { navItems } from '../data/content'
import { useActiveSection } from '../hooks/useActiveSection'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const ids = navItems.map((item) => item.id)

export function Nav() {
  const [pressed, setPressed] = useState<string | null>(null)
  const active = useActiveSection(ids)
  const progress = useScrollProgress()
  const reducedMotion = usePrefersReducedMotion()

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setPressed(id)
    window.setTimeout(() => setPressed((current) => (current === id ? null : current)), 150)
  }

  return (
    <nav aria-label="Section navigation" className="sticky top-0 z-50 border-b-4 border-ink bg-panel">
      <div className="flex flex-wrap justify-center gap-2 px-2 py-2.5">
        {navItems.map((item) => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClick(item.id)}
              aria-current={isActive ? 'true' : undefined}
              className={`relative font-pixel pixel-border pixel-shadow px-3.5 py-2.5 text-[11px] text-ink transition-transform duration-75 hover:bg-yellow ${
                pressed === item.id ? 'pixel-shadow-active' : ''
              }`}
            >
              {isActive &&
                (reducedMotion ? (
                  <span className="absolute inset-0 -z-10 bg-yellow" />
                ) : (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 bg-yellow"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                ))}
              {!isActive && <span className="absolute inset-0 -z-10 bg-cream" />}
              {item.label.toUpperCase()}
            </button>
          )
        })}
      </div>
      {/* XP bar: fills as you journey down the page */}
      <div className="h-1.5 w-full bg-[#e6e2d0]" role="presentation">
        <div
          className="h-full bg-hp-green transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </nav>
  )
}
