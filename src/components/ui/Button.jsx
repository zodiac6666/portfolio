// src/components/ui/Button.jsx
import { Children } from 'react'
import { cn } from '../../utils/cn'
import { RollingText } from './RollingText'

// Wrap any plain-text child in the rolling-text hover effect; leave icons and
// other elements untouched.
function rollText(children) {
  return Children.map(children, (child) =>
    typeof child === 'string' && child.trim() ? <RollingText text={child} /> : child,
  )
}

export function Button({ children, variant = 'primary', href, onClick, disabled, className, ...props }) {
  const base = 'group inline-flex items-center gap-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C10] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'

  const variants = {
    primary: 'bg-[#14B8A6] text-white px-5 py-2.5 hover:bg-[#0D9488] active:scale-95',
    ghost:   'border border-[#2E3340] text-[#E8E9ED] px-5 py-2.5 hover:border-[#14B8A6] hover:text-[#14B8A6] active:scale-95',
    icon:    'text-[#9AA0AB] hover:text-[#E8E9ED] p-2 rounded-md hover:bg-[#1A1D26]',
  }

  const cls = cn(base, variants[variant], className)

  if (href) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...props}>
        {rollText(children)}
      </a>
    )
  }

  return (
    <button onClick={onClick} disabled={disabled} className={cls} {...props}>
      {rollText(children)}
    </button>
  )
}
