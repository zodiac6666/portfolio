// src/hooks/useScrollSpy.js
import { useEffect, useState } from 'react'

export function useScrollSpy(ids, offset = 80) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const observers = []

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id)
        },
        { rootMargin: `-${offset}px 0px -60% 0px`, threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [ids, offset])

  return activeId
}