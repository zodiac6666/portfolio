// src/components/ui/FadeIn.jsx
import { useFadeIn } from '../../hooks/useFadeIn'
import { cn } from '../../utils/cn'

export function FadeIn({ children, className, delay = 0 }) {
  const ref = useFadeIn()
  return (
    <div
      ref={ref}
      className={cn('fade-in-up', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}