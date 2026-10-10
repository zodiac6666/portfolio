// src/components/ui/Logo.jsx
// Navbar brand mark — "YB" monogram badge + YahyaBaji wordmark.
import { cn } from '../../utils/cn'

export function Logo({ className }) {
  return (
    <a
      href="#"
      aria-label="YahyaBaji — back to top"
      className={cn('group flex items-center gap-3', className)}
    >
      {/* Monogram badge */}
      <span
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
          bg-gradient-to-br from-[#14B8A6] to-[#0B8F85]
          shadow-[0_0_16px_rgba(20,184,166,0.35)] ring-1 ring-[#14B8A6]/40
          transition-all duration-300
          group-hover:-rotate-6 group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(20,184,166,0.55)]"
      >
        <span className="font-mono text-[13px] leading-none font-bold text-[#0B0C10]">YB</span>
        <span
          className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#2DD4BF] ring-2 ring-[#0B0C10]"
          aria-hidden="true"
        />
      </span>

      {/* Wordmark */}
      <span className="font-display text-lg font-bold leading-none tracking-tight whitespace-nowrap">
        <span className="text-[#E8E9ED]">Yahya</span>
        <span className="text-[#14B8A6] transition-colors group-hover:text-[#2DD4BF]">Baji</span>
        <span className="text-[#14B8A6]" aria-hidden="true">.</span>
      </span>
    </a>
  )
}