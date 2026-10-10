// src/pages/admin/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, LogIn, Loader2, ShieldCheck } from 'lucide-react'
import { login } from '../../utils/api'
import { cn } from '../../utils/cn'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const inputCls =
  'w-full bg-[#1A1D26] border border-[#2E3340] rounded-lg px-4 py-3 text-sm text-[#E8E9ED] placeholder-[#6B7280] outline-none focus:border-[#14B8A6] focus:ring-1 focus-ring-[#14B8A6] transition-all duration-200'

export function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const validate = () => {
    const e = {}
    if (!email.trim()) e.email = 'Email is required'
    else if (!EMAIL_RE.test(email.trim())) e.email = 'Enter a valid email address'
    if (!password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()

    // Clear previous server error
    setServerError('')

    // Client-side validation
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setLoading(true)

    try {
      await login(email.trim(), password)
      // Mark session as logged in
      sessionStorage.setItem('adminLoggedIn', 'true')
      navigate('/admin/messages', { replace: true })
    } catch (err) {
      setServerError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field) => (ev) => {
    const value = ev.target.value
    if (field === 'email') setEmail(value)
    if (field === 'password') setPassword(value)
    // Clear field-level error as the user types
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    // Clear server error on any input change
    if (serverError) setServerError('')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-[#2E3340] bg-[#1A1D26] p-8 shadow-xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-xl bg-[#14B8A6]/10 flex items-center justify-center">
              <ShieldCheck size={28} className="text-[#14B8A6]" />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-xl font-bold text-center text-[#E8E9ED] mb-2">
            Admin Login
          </h1>
          <p className="text-sm text-[#6B7280] text-center mb-8">
            Sign in to manage your messages
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-mono text-[#9AA0AB] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleChange('email')}
                  placeholder="admin@example.com"
                  disabled={loading}
                  className={cn(inputCls, 'pl-10', errors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500')}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-mono text-[#9AA0AB] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={handleChange('password')}
                  placeholder="Enter your password"
                  disabled={loading}
                  className={cn(inputCls, 'pl-10', errors.password && 'border-red-500 focus:border-red-500 focus:ring-red-500')}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1.5">{errors.password}</p>
              )}
            </div>

            {/* Server error */}
            {serverError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {serverError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#14B8A6] text-white font-medium text-sm px-5 py-3 hover:bg-[#0D9488] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Sign in
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-[#6B7280] mt-6">
          Protected area — authorised access only
        </p>
      </div>
    </div>
  )
}