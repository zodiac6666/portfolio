// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { navItems } from '../../data/navItems'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { cn } from '../../utils/cn'
import { RollingText } from '../ui/RollingText'
import { Logo } from '../ui/Logo'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const activeId = useScrollSpy(['about', 'skills', 'projects', 'contact'])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNavClick = () => setMenuOpen(false)

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[#0B0C10]/90 backdrop-blur-md border-b border-[#2E3340]'
            : 'bg-transparent'
        )}
      >
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {navItems.map(({ label, href }) => {
              const id = href.replace('#', '')
              const isActive = activeId === id
              return (
                <li key={label}>
                  <a
                    href={href}
                    className={cn(
                      'nav-link group text-sm font-medium transition-colors',
                      isActive
                        ? 'text-[#E8E9ED] active'
                        : 'text-[#9AA0AB] hover:text-[#E8E9ED]'
                    )}
                  >
                    <RollingText text={label} />
                  </a>
                </li>
              )
            })}
          </ul>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden text-[#9AA0AB] hover:text-[#E8E9ED] transition-colors p-1"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* Mobile overlay menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-[#0B0C10]/95 backdrop-blur-lg flex flex-col justify-center items-center gap-10 transition-all duration-300 md:hidden',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {navItems.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            onClick={handleNavClick}
            className="group font-display text-4xl font-bold text-[#9AA0AB] hover:text-[#14B8A6] transition-colors"
          >
            <RollingText text={label} />
          </a>
        ))}
      </div>
    </>
  )
}
