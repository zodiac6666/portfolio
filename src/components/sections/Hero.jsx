// src/components/sections/Hero.jsx
import { useState } from 'react'
import { ArrowDown, Download, FolderOpen, Mail } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from '../ui/SocialIcons'
import { Button } from '../ui/Button'
import { useTypewriter } from '../../hooks/useTypewriter'

// Drop your photo in the public folder as `profile.jpg` (or .png — then change
// the src below). If the file is missing, the initials fallback is shown.
const PROFILE_PHOTO = '/profile.jpg'

const roles = [
  'Full-Stack Developer',
  'React Developer',
  'PHP & Laravel Developer',
]

export function Hero() {
  const typedText = useTypewriter(roles)
  const [photoOk, setPhotoOk] = useState(true)

  return (
    <section className="relative min-h-screen flex items-center bg-[#0B0C10] overflow-hidden">
      {/* Dot grid decorative background */}
      <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none" aria-hidden="true" />

      {/* Subtle accent glow */}
      <div
        className="absolute top-1/3 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20 w-full">
        <div className="max-w-3xl">
          {/* Label */}
          <p
            className="font-mono text-sm text-[#14B8A6] tracking-widest uppercase mb-6 animate-slide-up"
            style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
          >
            Welcome to my portfolio
          </p>

          {/* Name */}
          <h1
            className="font-display text-5xl md:text-7xl font-bold text-[#E8E9ED] leading-none tracking-tight mb-6 animate-slide-up"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            Hi, I&apos;m{' '}
            <span className="text-[#14B8A6]">Yahya</span>
            <span className="text-[#E8E9ED]"> Baji</span>
          </h1>

          {/* Typing animation */}
          <div
            className="h-10 flex items-center mb-6 animate-slide-up"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            <span className="text-xl md:text-2xl text-[#9AA0AB] font-medium">
              {typedText}
            </span>
            <span className="ml-1 w-0.5 h-6 bg-[#14B8A6] animate-pulse" aria-hidden="true" />
          </div>

          {/* Tagline */}
          <p
            className="text-lg md:text-xl text-[#9AA0AB] leading-relaxed mb-10 max-w-2xl animate-slide-up"
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
          >
            I build modern, responsive websites and turn ideas into clean, functional digital experiences.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap items-center gap-4 mb-12 animate-slide-up"
            style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
          >
            <Button href="#projects" variant="primary">
              <FolderOpen size={16} />
              View Projects
            </Button>
            <Button href="#contact" variant="ghost">
              <Mail size={16} />
              Contact Me
            </Button>
            <Button href="/cv.pdf" variant="ghost">
              <Download size={16} />
              Download CV
            </Button>
          </div>

          {/* Social links + scroll hint */}
          <div
            className="flex items-center gap-6 animate-fade-in"
            style={{ animationDelay: '0.8s', animationFillMode: 'both' }}
          >
            <a
              href="https://github.com/zodiac6666"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-[#6B7280] hover:text-[#E8E9ED] transition-colors"
            >
              <GitHubIcon size={20} />
            </a>
            <a
              href="https://linkedin.com/in/zodiac6666"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[#6B7280] hover:text-[#E8E9ED] transition-colors"
            >
              <LinkedInIcon size={20} />
            </a>

            <span className="w-px h-4 bg-[#2E3340]" aria-hidden="true" />

            <a
              href="#about"
              className="flex items-center gap-2 text-xs text-[#6B7280] hover:text-[#9AA0AB] transition-colors font-mono"
            >
              scroll down <ArrowDown size={14} />
            </a>
          </div>
        </div>

        {/* Profile photo slot */}
        <div
          className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 animate-fade-in"
          style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
        >
          <div className="w-48 h-48 rounded-full bg-[#1A1D26] border-2 border-[#14B8A6]/30 flex items-center justify-center shadow-lg shadow-[#14B8A6]/10 overflow-hidden">
            {photoOk ? (
              <img
                src={PROFILE_PHOTO}
                alt="Yahya Baji"
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => setPhotoOk(false)}
              />
            ) : (
              <span className="text-5xl font-bold text-[#14B8A6] font-display">YB</span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
