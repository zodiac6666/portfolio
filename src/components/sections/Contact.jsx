// src/components/sections/Contact.jsx
import { useState } from 'react'
import { AlertCircle, CheckCircle2, ExternalLink, GitFork, Loader2, Mail, Send } from 'lucide-react'
import { FadeIn } from '../ui/FadeIn'
import { Button } from '../ui/Button'
import { submitContact } from '../../utils/api'
import { cn } from '../../utils/cn'

const inputCls =
  'w-full bg-[#1A1D26] border border-[#2E3340] rounded-lg px-4 py-3 text-sm text-[#E8E9ED] placeholder-[#6B7280] outline-none focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6] transition-all duration-200'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [serverError, setServerError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim())   e.email   = 'Email is required'
    else if (!EMAIL_RE.test(form.email.trim())) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }))
    if (status === 'error') { setStatus('idle'); setServerError('') }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    // Honeypot — if filled, silently reject (bot)
    if (form.company) return

    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setStatus('submitting')

    try {
      await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      // The GitHub Pages build is static, so the PHP form endpoint doesn't
      // exist there — point visitors at email instead of a raw error.
      setServerError(
        import.meta.env.PROD
          ? 'This online demo can\u2019t send messages directly \u2014 please email me at yahyabaji0374@gmail.com instead.'
          : err.message || 'Something went wrong. Please try again.'
      )
    }
  }

  const resetForm = () => {
    setForm({ name: '', email: '', message: '', company: '' })
    setErrors({})
    setStatus('idle')
    setServerError('')
  }

  return (
    <section id="contact" className="bg-[#0B0C10] py-28">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <p className="font-mono text-xs text-[#14B8A6] tracking-widest uppercase mb-3">Contact</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#E8E9ED] mb-4">
            Get in touch
          </h2>
          <p className="text-[#9AA0AB] text-sm mb-16 max-w-lg">
            Have a question or want to work together? Send me a message — I'll get back to you.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Form */}
          <FadeIn delay={100}>
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center gap-4 p-12 rounded-xl border border-[#2E3340] bg-[#1A1D26] text-center">
                <CheckCircle2 size={40} className="text-[#34D399]" />
                <h3 className="font-display text-xl font-semibold text-[#E8E9ED]">Message sent!</h3>
                <p className="text-sm text-[#9AA0AB]">Thanks for reaching out. I'll get back to you soon.</p>
                <button
                  onClick={resetForm}
                  className="text-xs text-[#14B8A6] hover:text-[#2DD4BF] underline transition-colors mt-2 cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Honeypot — hidden from real users, bots fill it */}
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] -top-[9999px] h-0 w-0 opacity-0 overflow-hidden"
                />

                <div>
                  <label htmlFor="name" className="block text-xs font-mono text-[#9AA0AB] mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    disabled={status === 'submitting'}
                    className={cn(inputCls, errors.name && 'border-red-500 focus:border-red-500 focus:ring-red-500')}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-xs text-red-400 mt-1.5">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-mono text-[#9AA0AB] mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    disabled={status === 'submitting'}
                    className={cn(inputCls, errors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500')}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-xs text-red-400 mt-1.5">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-mono text-[#9AA0AB] mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="What's on your mind?"
                    disabled={status === 'submitting'}
                    className={cn(inputCls, 'resize-none', errors.message && 'border-red-500 focus:border-red-500 focus:ring-red-500')}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="text-xs text-red-400 mt-1.5">{errors.message}</p>
                  )}
                </div>

                {/* Server error */}
                {status === 'error' && serverError && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-start gap-2">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    {serverError}
                  </div>
                )}

                <Button type="submit" variant="primary" className="w-full justify-center" disabled={status === 'submitting'}>
                  {status === 'submitting' ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send message
                    </>
                  )}
                </Button>

                <p className="text-xs text-[#6B7280] text-center">
                  Or email directly: <a href="mailto:yahyabaji0374@gmail.com" className="text-[#14B8A6] hover:underline">
                    yahyabaji0374@gmail.com
                  </a>
                </p>
              </form>
            )}
          </FadeIn>

          {/* Links side */}
          <FadeIn delay={200}>
            <div className="space-y-4">
              <p className="font-mono text-xs text-[#6B7280] tracking-widest uppercase mb-6">
                Find me on
              </p>
              {[
                { icon: GitFork,    label: 'GitHub',   sub: 'github.com/zodiac6666',          href: 'https://github.com/zodiac6666'          },
                { icon: ExternalLink, label: 'LinkedIn', sub: 'linkedin.com/in/zodiac6666',    href: 'https://linkedin.com/in/zodiac6666'      },
                { icon: Mail,       label: 'Email',     sub: 'yahyabaji0374@gmail.com',        href: 'mailto:yahyabaji0374@gmail.com'                    },
              ].map(({ icon: Icon, label, sub, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-[#2E3340] bg-[#1A1D26] hover:border-[#14B8A6]/40 hover:bg-[#1E2130] transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#242832] group-hover:bg-[#14B8A6]/10 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Icon size={18} className="text-[#14B8A6]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#E8E9ED]">{label}</p>
                    <p className="text-xs text-[#6B7280] font-mono">{sub}</p>
                  </div>
                </a>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}