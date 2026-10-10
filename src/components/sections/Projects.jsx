// src/components/sections/Projects.jsx
//
// Projects are shown as a "fanned deck" of cards (like a hand of cards).
// On scroll the cards rise from a stack and fan out; on hover the hovered card
// lifts and grows while its neighbours spread apart with an elastic motion.
// The motion is a port of the animation used on landonorris.com.
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ExternalLink, ChevronLeft, ChevronRight, GitFork, Image } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../../data/projects'
import { FadeIn } from '../ui/FadeIn'
import { cn } from '../../utils/cn'

gsap.registerPlugin(ScrollTrigger)

// Project images live in src/assets/images/. Drop a file in that folder and set
// `image` in src/data/projects.js — a project with no image falls back to the
// placeholder drawn on the card.
const projectImages = import.meta.glob('../../assets/images/*', {
  eager: true,
  import: 'default',
})

function getProjectImage(fileName) {
  if (!fileName) return null
  return projectImages[`../../assets/images/${fileName}`] ?? null
}

// ─── Fan geometry ────────────────────────────────────────────────────────────
// Ratios are relative to the card width, so the deck scales as one unit.
// Index 0 = centre card, 1 = first neighbour, 2 = next, 3 = outermost.
const ROT = [0, 7, 14, 21] // degrees
const X_RATIO = [0, 0.55, 1.1, 1.5] // horizontal spread
const Y_RATIO = [0, 0.065, 0.2, 0.365] // downward drop
const SCALE = [1, 0.9346, 0.8498, 0.7756]

const lerp = (a, b, t) => a + (b - a) * t

// Sample a table at a (possibly fractional) distance, clamped at the ends.
function sample(table, distance) {
  const k = Math.min(Math.floor(distance), table.length - 1)
  if (k >= table.length - 1) return table[table.length - 1]
  return lerp(table[k], table[k + 1], distance - k)
}

function buildPositions(count, cardWidth) {
  const center = (count - 1) / 2
  return Array.from({ length: count }, (_, i) => {
    const offset = i - center
    const distance = Math.abs(offset)
    const sign = offset < 0 ? -1 : 1
    return {
      x: sample(X_RATIO, distance) * cardWidth * sign,
      y: sample(Y_RATIO, distance) * cardWidth,
      rotation: sample(ROT, distance) * sign,
      scale: sample(SCALE, distance),
      zIndex: Math.round(10 - distance * 3),
    }
  })
}

// Design size of the deck (px). The whole stage is scaled to fit its container.
const STAGE_W = 1280
const STAGE_H = 780
const CARD_W = 320
const CARD_H = 560

// Movement constants derived from the card width (matches the original design).
const BASE_Y = CARD_W * 0.5 // initial offset below centre
const RISE = CARD_W * 0.125 // how far the hovered card lifts
const SPREAD = CARD_W * 0.4 // how far neighbours push away
const LAST_LIFT = CARD_W * 0.05

// ─── A single project card in the deck ───────────────────────────────────────
function FanCard({ project, index }) {
  const imageSrc = getProjectImage(project.image)

  return (
    <article
      className="fan-card absolute left-1/2 top-1/2 will-change-transform [backface-visibility:hidden]"
      style={{ width: CARD_W, height: CARD_H }}
    >
      <div className="group relative h-full w-full overflow-hidden rounded-[3.3rem] border border-[#2E3340] bg-[#1A1D26] shadow-[0_30px_70px_rgba(0,0,0,0.55)]">
        {/* Media */}
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`${project.title} preview`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#3A3F4D]">
            <Image size={44} strokeWidth={1.25} />
            <span className="font-mono text-[11px] uppercase tracking-widest">Project Image</span>
          </div>
        )}

        {/* Readability overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-7">
          <span className="font-mono text-[11px] tracking-widest text-[#14B8A6]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="mt-1 font-display text-2xl font-semibold leading-tight text-white">
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#C7CBD3]">
            {project.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-[#14B8A6]/15 px-2 py-0.5 font-mono text-[10px] text-[#2DD4BF]"
              >
                {tag}
              </span>
            ))}
          </div>

          {(project.sourceUrl || project.liveUrl) && (
            <div className="mt-4 flex items-center gap-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {project.sourceUrl && (
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} source code`}
                  className="inline-flex items-center gap-1.5 text-xs text-[#9AA0AB] transition-colors hover:text-[#14B8A6]"
                >
                  <GitFork size={14} />
                  Code
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} live demo`}
                  className="inline-flex items-center gap-1.5 text-xs text-[#9AA0AB] transition-colors hover:text-[#14B8A6]"
                >
                  <ExternalLink size={14} />
                  Live Demo
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

// ─── The animated fanned deck (desktop) ──────────────────────────────────────
function FanDeck() {
  const wrapRef = useRef(null)
  const stageRef = useRef(null)
  const [scale, setScale] = useState(1)

  // Scale the fixed-size stage down to fit narrow desktops.
  useLayoutEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const measure = () => {
      const available = wrap.clientWidth
      setScale(Math.min(1, available / STAGE_W))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  // GSAP setup: reveal on scroll + hover fan-out.
  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const stage = stageRef.current
    if (!wrap || !stage) return

    const cards = Array.from(stage.querySelectorAll('.fan-card'))
    if (!cards.length) return

    const count = cards.length
    const positions = buildPositions(count, CARD_W)
    const center = (count - 1) / 2
    const mid = Math.floor(count / 2)

    let activeIndex = null
    let leaveTimer = null
    const listeners = []

    cards.forEach((card, i) => {
      card.style.zIndex = String(positions[i].zIndex)
    })

    const ctx = gsap.context(() => {
      // Everything starts stacked in the middle, pushed down, ready to rise.
      gsap.set(cards, {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: BASE_Y,
        scale: 1,
        rotation: 0,
        transformOrigin: 'center center',
        opacity: 1,
      })

      // Return every card to its "resting" fanned position (centre outward).
      const settle = () => {
        const tl = gsap.timeline()
        const ordered = cards
          .map((card, i) => ({ card, i, dist: Math.abs(i - center) }))
          .sort((a, b) => a.dist - b.dist)
        ordered.forEach(({ card, i, dist }) => {
          const p = positions[i]
          tl.to(
            card,
            {
              x: p.x,
              y: p.y,
              scale: p.scale,
              rotation: p.rotation,
              duration: 0.5,
              ease: 'elastic.out(1, 0.75)',
              overwrite: 'auto',
            },
            dist * 0.02,
          )
        })
        return tl
      }

      // Fan out around the hovered card.
      const fanOut = (n) => {
        const tl = gsap.timeline()
        const ordered = cards
          .map((card, i) => ({ card, i, dist: Math.abs(i - n) }))
          .sort((a, b) => {
            if (a.i === n) return -1
            if (b.i === n) return 1
            return a.dist - b.dist
          })

        const last = count - 1

        ordered.forEach(({ card, i, dist }) => {
          const p = positions[i]
          const isLeft = i < n
          const isRight = i > n
          const isSelf = i === n
          const isLast = i === last

          const h = (i - mid) / mid
          const proximity = 1 - Math.abs(h)
          const push = 1 + 0.2 * Math.max(0, 3 - dist)

          let vars = null
          if (isSelf) {
            vars = {
              y: p.y - RISE,
              x: p.x,
              scale: p.scale * 1.08,
              rotation: p.rotation,
            }
          } else if (isLeft) {
            vars = {
              x: p.x - SPREAD * proximity * push,
              y: p.y,
              scale: p.scale,
              rotation: p.rotation - 3 / (dist + 1),
            }
          } else if (isRight) {
            vars = {
              x: p.x + (isLast ? 0 : SPREAD * proximity * push),
              y: p.y + (isLast ? -LAST_LIFT : 0),
              scale: p.scale,
              rotation: p.rotation + 3 / (dist + 1),
            }
          }

          if (vars) {
            tl.to(
              card,
              { ...vars, duration: 0.5, ease: 'elastic.out(1, 0.75)', overwrite: 'auto' },
              dist * 0.02,
            )
          }
        })
        return tl
      }

      const attachHover = () => {
        cards.forEach((card, i) => {
          const onEnter = () => {
            if (leaveTimer) {
              clearTimeout(leaveTimer)
              leaveTimer = null
            }
            activeIndex = i
            fanOut(i)
          }
          const onLeave = () => {
            if (activeIndex === i) {
              leaveTimer = setTimeout(() => {
                if (activeIndex === i) {
                  activeIndex = null
                  settle()
                }
                leaveTimer = null
              }, 50)
            }
          }
          card.addEventListener('mouseenter', onEnter)
          card.addEventListener('mouseleave', onLeave)
          listeners.push([card, onEnter, onLeave])
        })

        const onWrapLeave = () => {
          if (leaveTimer) {
            clearTimeout(leaveTimer)
            leaveTimer = null
          }
          activeIndex = null
          settle()
        }
        wrap.addEventListener('mouseleave', onWrapLeave)
        listeners.push([wrap, 'mouseleave', onWrapLeave])
      }

      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top 85%',
          once: true,
        },
      })

      reveal
        .to(cards, {
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: { amount: 0.5, from: 'end' },
        })
        .to(
          cards,
          {
            x: (i) => positions[i].x,
            y: (i) => positions[i].y,
            scale: (i) => positions[i].scale,
            rotation: (i) => positions[i].rotation,
            duration: 1.2,
            ease: 'elastic.out(1, 0.75)',
            stagger: { amount: 0.2, from: 'center' },
            onComplete: attachHover,
          },
          '-=0.4',
        )
    }, stage)

    return () => {
      if (leaveTimer) clearTimeout(leaveTimer)
      listeners.forEach(([el, type, fn]) => el.removeEventListener(type, fn))
      ctx.revert()
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className="relative w-full"
      style={{ height: STAGE_H * scale }}
    >
      <div
        ref={stageRef}
        className="absolute left-1/2 top-0"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          marginLeft: -STAGE_W / 2,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        {projects.map((project, i) => (
          <FanCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </div>
  )
}

// ─── Mobile / tablet card + carousel ─────────────────────────────────────────
function MobileCard({ project, index }) {
  const imageSrc = getProjectImage(project.image)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#2E3340] bg-[#1A1D26]">
      <div className="relative h-40 overflow-hidden border-b border-[#2E3340] bg-[#242832]">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`${project.title} preview`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#3A3F4D]">
            <Image size={32} strokeWidth={1.5} />
            <span className="font-mono text-xs tracking-wide">Project Image</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="font-mono text-[10px] tracking-widest text-[#14B8A6]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="mt-1 font-display text-lg font-semibold text-[#E8E9ED]">
          {project.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[#9AA0AB]">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-[#14B8A6]/10 px-2 py-1 font-mono text-[10px] text-[#14B8A6]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

function Carousel() {
  const scrollRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    return () => el.removeEventListener('scroll', updateScrollState)
  }, [])

  const scrollTo = (index) => {
    const el = scrollRef.current
    if (!el) return
    const card = el.children[index]
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft - 20, behavior: 'smooth' })
  }

  const handlePrev = () => {
    const newIndex = Math.max(0, activeIndex - 1)
    setActiveIndex(newIndex)
    scrollTo(newIndex)
  }

  const handleNext = () => {
    const newIndex = Math.min(projects.length - 1, activeIndex + 1)
    setActiveIndex(newIndex)
    scrollTo(newIndex)
  }

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const center = el.scrollLeft + el.clientWidth / 2
    let closest = 0
    let minDist = Infinity
    Array.from(el.children).forEach((child, i) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2
      const dist = Math.abs(center - childCenter)
      if (dist < minDist) {
        minDist = dist
        closest = i
      }
    })
    setActiveIndex(closest)
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {projects.map((project, i) => (
          <div key={project.id} className="w-[85%] max-w-sm flex-shrink-0 snap-center">
            <MobileCard project={project} index={i} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={handlePrev}
          disabled={!canScrollLeft}
          aria-label="Previous project"
          className={cn(
            'rounded-full border border-[#2E3340] p-2 text-[#9AA0AB] transition-all',
            'hover:border-[#14B8A6] hover:text-[#14B8A6]',
            'disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#2E3340] disabled:hover:text-[#9AA0AB]',
          )}
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveIndex(i)
                scrollTo(i)
              }}
              aria-label={`Go to project ${i + 1}`}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i === activeIndex ? 'w-6 bg-[#14B8A6]' : 'w-2 bg-[#2E3340] hover:bg-[#3A3F4D]',
              )}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!canScrollRight}
          aria-label="Next project"
          className={cn(
            'rounded-full border border-[#2E3340] p-2 text-[#9AA0AB] transition-all',
            'hover:border-[#14B8A6] hover:text-[#14B8A6]',
            'disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#2E3340] disabled:hover:text-[#9AA0AB]',
          )}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}

// ─── Media query hook ────────────────────────────────────────────────────────
function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

// ─── Main section ────────────────────────────────────────────────────────────
export function Projects() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return (
    <section id="projects" className="relative overflow-x-clip bg-[#12141A] py-28">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#14B8A6]">
            Projects
          </p>
          <h2 className="mb-4 font-display text-3xl font-bold text-[#E8E9ED] md:text-4xl">
            Things I&apos;ve built
          </h2>
          <p className="mb-4 max-w-lg text-sm text-[#9AA0AB]">
            A selection of projects I&apos;ve worked on while learning. Hover a card to bring it
            forward.
          </p>
        </FadeIn>
      </div>

      <div className="mt-16">
        {isDesktop ? (
          <FanDeck />
        ) : (
          <div className="mx-auto max-w-6xl px-6">
            <Carousel />
          </div>
        )}
      </div>
    </section>
  )
}
