// src/components/sections/Skills.jsx
import {
  Code2, Palette, Braces, Component, Wind,
  Server, Database, Layers, Globe,
  GitBranch, Code, PenTool, Package,
} from 'lucide-react'
import { skillGroups } from '../../data/skills'
import { FadeIn } from '../ui/FadeIn'

const iconMap = {
  Code2, Palette, Braces, Component, Wind,
  Server, Database, Layers, Globe,
  GitBranch, Code, PenTool, Package,
}

export function Skills() {
  return (
    <section id="skills" className="bg-[#0B0C10] py-28">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <p className="font-mono text-xs text-[#14B8A6] tracking-widest uppercase mb-3">Skills</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#E8E9ED] mb-4">
            What I work with
          </h2>
          <p className="text-[#9AA0AB] text-sm mb-16 max-w-lg">
            An honest look at my stack — no fake progress bars, just the tools I actually use.
          </p>
        </FadeIn>

        <div className="space-y-16">
          {skillGroups.map((group, gi) => (
            <div key={group.id}>
              <FadeIn delay={gi * 80}>
                <div className="flex items-center gap-3 mb-8">
                  <p className="font-mono text-xs text-[#6B7280] tracking-widest uppercase">
                    {group.label}
                  </p>
                  <div className="flex-1 h-px bg-[#2E3340]" aria-hidden="true" />
                </div>
              </FadeIn>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.skills.map((skill, si) => {
                  const Icon = iconMap[skill.icon] || Code2
                  return (
                    <FadeIn key={skill.name} delay={gi * 80 + si * 60}>
                      <div className="group flex items-start gap-4 p-5 rounded-xl border border-[#2E3340] bg-[#1A1D26] hover:border-[#14B8A6]/40 hover:bg-[#1E2130] hover:shadow-lg hover:shadow-[#14B8A6]/5 transition-all duration-200 hover:-translate-y-0.5">
                        <div className="w-10 h-10 rounded-lg bg-[#242832] group-hover:bg-[#14B8A6]/10 flex items-center justify-center flex-shrink-0 transition-colors">
                          <Icon size={18} className="text-[#14B8A6]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#E8E9ED] mb-1">{skill.name}</p>
                          <p className="text-xs text-[#6B7280] leading-relaxed">{skill.note}</p>
                        </div>
                      </div>
                    </FadeIn>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
