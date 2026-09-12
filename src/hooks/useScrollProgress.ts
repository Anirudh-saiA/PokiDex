import { useEffect, useState } from 'react'

/** 0-100 progress through the page's scrollable height. */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - doc.clientHeight
      setProgress(scrollable > 0 ? Math.min(100, (doc.scrollTop / scrollable) * 100) : 0)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return progress
}
