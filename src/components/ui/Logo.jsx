// src/components/ui/Logo.jsx
// Navbar brand wordmark — just the name.
import { cn } from '../../utils/cn'

export function Logo({ className }) {
  return (
    <a
      href="#"
      aria-label="YahyaBaji — back to top"
      className={cn('group font-display text-lg font-bold leading-none tracking-tight whitespace-nowrap', className)}
    >
      <span className="text-[#E8E9ED]">Yahya</span>
      <span className="text-[#14B8A6] transition-colors group-hover:text-[#2DD4BF]">Baji</span>
      <span className="text-[#14B8A6]" aria-hidden="true">.</span>
    </a>
  )
}