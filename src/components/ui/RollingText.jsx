// src/components/ui/RollingText.jsx
//
// Characters "roll up" on hover and an identical copy rolls in from below —
// the text-flip effect used on landonorris.com. Each letter is staggered a
// little so the roll sweeps across the word.
//
// Put it inside an element that has the `group` class (or use `group/name` and
// the matching `group-hover/name:` variant) so hover on the whole control
// triggers the roll.
import { cn } from '../../utils/cn'

export function RollingText({ text, className, charDelay = 20 }) {
  return (
    <span className={cn('inline-block leading-none', className)}>
      {/* Real text for screen readers / SEO */}
      <span className="sr-only">{text}</span>

      {/* Decorative rolling copy */}
      <span aria-hidden="true" className="inline-flex leading-none">
        {Array.from(text).map((char, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden"
            style={{ height: '1.15em' }}
          >
            <span
              className="flex flex-col transition-transform duration-500 group-hover:-translate-y-1/2 motion-reduce:transition-none"
              style={{
                transitionDelay: `${i * charDelay}ms`,
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <span
                className="flex items-center justify-center"
                style={{ height: '1.15em' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
              <span
                className="flex items-center justify-center"
                style={{ height: '1.15em' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            </span>
          </span>
        ))}
      </span>
    </span>
  )
}
