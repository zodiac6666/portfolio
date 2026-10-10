// src/components/sections/About.jsx
import { MapPin, Code2, BookOpen, Target } from 'lucide-react'
import { FadeIn } from '../ui/FadeIn'

const glanceItems = [
  { icon: Code2,    label: 'Role',          value: 'Full-Stack Developer'           },
  { icon: MapPin,   label: 'Location',      value: 'Morocco'                       },
  { icon: BookOpen, label: 'Learning',       value: 'React patterns, PHP & Laravel' },
  { icon: Target,   label: 'Current focus', value: 'Building real-world projects'  },
]

export function About() {
  return (
    <section id="about" className="bg-[#12141A] py-28">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <p className="font-mono text-xs text-[#14B8A6] tracking-widest uppercase mb-3">About</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#E8E9ED] mb-16">
            A bit about me
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Text side */}
          <FadeIn delay={100}>
            <div className="space-y-5 text-[#9AA0AB] leading-relaxed">
              <p>
                I&apos;m Yahya, a junior frontend developer who&apos;s passionate about building
                things for the web. I started learning HTML and CSS out of curiosity, and I
                quickly got hooked — there&apos;s something satisfying about writing a few lines
                of code and seeing something real appear on screen.
              </p>
              <p>
                Right now I&apos;m focused on strengthening my React skills and learning how to
                build clean, maintainable component architectures. I care a lot about the
                details — good spacing, readable code, and interfaces that actually work well
                on mobile.
              </p>
              <p>
                I&apos;m early in my journey, but I&apos;m putting in the work every day. I
                learn best by building, so most of my time outside studying goes into making
                actual projects.
              </p>
            </div>

            {/* Currently learning callout */}
            <div className="mt-8 p-5 rounded-xl border border-[#2E3340] bg-[#1A1D26]">
              <p className="font-mono text-xs text-[#14B8A6] tracking-widest uppercase mb-3">
                What I&apos;m working on
              </p>
              <ul className="space-y-2 text-sm text-[#9AA0AB]">
                <li className="flex items-start gap-2">
                  <span className="text-[#14B8A6] mt-0.5">→</span>
                  Learning React Router and multi-page app patterns
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#14B8A6] mt-0.5">→</span>
                  Practicing responsive design at all screen sizes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#14B8A6] mt-0.5">→</span>
                  Building this portfolio (meta, I know)
                </li>
              </ul>
            </div>
          </FadeIn>

          {/* At a glance */}
          <FadeIn delay={200}>
            <div className="space-y-4">
              <p className="font-mono text-xs text-[#6B7280] tracking-widest uppercase mb-6">
                At a glance
              </p>
              {glanceItems.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-4 rounded-xl border border-[#2E3340] bg-[#1A1D26] hover:border-[#363B47] transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#242832] flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-[#14B8A6]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] font-mono">{label}</p>
                    <p className="text-sm text-[#E8E9ED] font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
