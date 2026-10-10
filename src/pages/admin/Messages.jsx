// src/pages/admin/Messages.jsx
// Admin messages list — view, expand, delete with confirmation.
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertCircle, Check, ChevronDown, Copy, Inbox, Mail, MailOpen, Send, Trash2, X,
} from 'lucide-react'
import { getMessages, deleteMessage } from '../../utils/api'
import { cn } from '../../utils/cn'

export function Messages() {
  const navigate = useNavigate()

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')

  // Expansion state: which message IDs are expanded
  const [expanded, setExpanded] = useState(new Set())
  // Delete-confirmation state: which message ID is awaiting confirm
  const [confirmingDelete, setConfirmingDelete] = useState(null)
  // Reply dialog state: the message currently being replied to (or null)
  const [replyingTo, setReplyingTo] = useState(null)

  // ---- Data fetching ----
  const fetchMessages = useCallback(async () => {
    setLoading(true)
    setFetchError('')

    try {
      const data = await getMessages()
      // Expect either an array or { messages: [...] }
      const list = Array.isArray(data) ? data : data.messages || []
      setMessages(list)
    } catch (err) {
      setFetchError(err.message || 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Guard: redirect if not logged in
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true'
    if (!isLoggedIn) {
      navigate('/admin/login', { replace: true })
      return
    }
    fetchMessages()
  }, [fetchMessages, navigate])

  // ---- Expand / collapse ----
  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    // Collapse delete confirmation when toggling a message
    if (confirmingDelete === id) setConfirmingDelete(null)
  }

  // ---- Delete with two-step confirmation ----
  const handleDelete = async (id) => {
    // First click — ask for confirmation
    if (confirmingDelete !== id) {
      setConfirmingDelete(id)
      return
    }

    // Second click — actually delete
    setConfirmingDelete(null)

    // Optimistic removal
    setMessages((prev) => prev.filter((m) => m.id !== id))

    try {
      await deleteMessage(id)
    } catch (err) {
      // Rollback on failure
      setFetchError(err.message || 'Failed to delete message')
      fetchMessages()
    }
  }

  // ---- Render ----

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-[#E8E9ED] mb-6">Messages</h1>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-[#2E3340] bg-[#1A1D26] p-5 animate-pulse"
          >
            <div className="h-4 w-32 bg-[#242832] rounded mb-3" />
            <div className="h-3 w-48 bg-[#242832] rounded mb-2" />
            <div className="h-3 w-full bg-[#242832] rounded" />
          </div>
        ))}
      </div>
    )
  }

  // Error state
  if (fetchError) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold text-[#E8E9ED] mb-6">Messages</h1>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <AlertCircle size={32} className="text-red-400 mx-auto mb-3" />
          <p className="text-sm text-red-400 mb-4">{fetchError}</p>
          <button
            onClick={fetchMessages}
            className="inline-flex items-center gap-2 rounded-lg border border-[#2E3340] text-[#E8E9ED] text-sm px-4 py-2 hover:border-[#14B8A6] transition-colors cursor-pointer"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  // Empty state
  if (messages.length === 0) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold text-[#E8E9ED] mb-6">Messages</h1>
        <div className="rounded-xl border border-[#2E3340] bg-[#1A1D26] p-12 text-center">
          <Inbox size={40} className="text-[#6B7280] mx-auto mb-4" />
          <p className="text-sm text-[#9AA0AB] mb-1">No messages yet</p>
          <p className="text-xs text-[#6B7280]">
            When someone submits the contact form, their message will appear here.
          </p>
        </div>
      </div>
    )
  }

  // Message list
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[#E8E9ED] mb-6">
        Messages <span className="text-[#6B7280] font-normal text-lg">({messages.length})</span>
      </h1>

      <div className="space-y-3">
        {messages.map((msg) => {
          const isExpanded = expanded.has(msg.id)
          const isConfirming = confirmingDelete === msg.id

          return (
            <div
              key={msg.id}
              className={cn(
                'rounded-xl border bg-[#1A1D26] transition-colors',
                isExpanded ? 'border-[#14B8A6]/40' : 'border-[#2E3340]',
              )}
            >
              {/* Header row — always visible */}
              <button
                onClick={() => toggleExpand(msg.id)}
                className="w-full flex items-start gap-4 p-5 text-left cursor-pointer"
              >
                {/* Icon */}
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                  isExpanded ? 'bg-[#14B8A6]/10' : 'bg-[#242832]',
                )}>
                  {isExpanded
                    ? <MailOpen size={18} className="text-[#14B8A6]" />
                    : <Mail size={18} className="text-[#6B7280]" />
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <p className="text-sm font-medium text-[#E8E9ED] truncate">
                      {msg.name}
                    </p>
                    <span className="text-xs text-[#6B7280] font-mono flex-shrink-0">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] mb-1.5 truncate">{msg.email}</p>
                  <p className={cn(
                    'text-sm text-[#9AA0AB] leading-relaxed',
                    !isExpanded && 'line-clamp-1',
                  )}>
                    {msg.message}
                  </p>
                </div>

                {/* Chevron */}
                <ChevronDown
                  size={16}
                  className={cn(
                    'text-[#6B7280] flex-shrink-0 mt-1 transition-transform duration-200',
                    isExpanded && 'rotate-180',
                  )}
                />
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-0 border-t border-[#2E3340]">
                  <div className="pt-4 space-y-4">
                    {/* Full message */}
                    <div className="rounded-lg bg-[#0B0C10] p-4">
                      <p className="font-mono text-xs text-[#6B7280] mb-2">Message</p>
                      <p className="text-sm text-[#9AA0AB] leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center justify-between text-xs text-[#6B7280] font-mono">
                      <span>ID: {msg.id}</span>
                      <span>Received: {formatDate(msg.created_at)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setReplyingTo(msg)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#2E3340] text-[#E8E9ED] text-xs px-3 py-2 hover:border-[#14B8A6] hover:text-[#14B8A6] transition-colors cursor-pointer"
                      >
                        <Mail size={14} />
                        Reply
                      </button>

                      {/* Delete — two-step confirm */}
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className={cn(
                          'inline-flex items-center gap-2 rounded-lg border text-xs px-3 py-2 transition-colors cursor-pointer',
                          isConfirming
                            ? 'border-red-500 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                            : 'border-[#2E3340] text-[#9AA0AB] hover:border-red-500/50 hover:text-red-400',
                        )}
                      >
                        <Trash2 size={14} />
                        {isConfirming ? 'Confirm delete?' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Reply compose dialog */}
      {replyingTo && (
        <ReplyDialog message={replyingTo} onClose={() => setReplyingTo(null)} />
      )}
    </div>
  )
}

/** Format an ISO date string into a readable label */
function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr

  const now = new Date()
  const diffMs = now - d
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

const replyFieldCls =
  'w-full bg-[#0B0C10] border border-[#2E3340] rounded-lg px-3 py-2.5 text-sm text-[#E8E9ED] placeholder-[#6B7280] outline-none focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6] transition-all duration-200'

/**
 * ReplyDialog — in-app compose box for replying to a message.
 *
 * Instead of jumping straight to a bare mailto: (which silently does nothing
 * when no email app is configured), it shows a compose form and then opens the
 * user's email app with everything pre-filled. A "Copy email" fallback is
 * always available too.
 */
function ReplyDialog({ message, onClose }) {
  const [subject, setSubject] = useState(`Re: Contact from ${message.name}`)
  const [body, setBody] = useState(
    `Hi ${message.name},\n\n\n-------- Original message --------\n${message.message}`,
  )
  const [copied, setCopied] = useState(false)

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(message.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable — ignore; the address is visible on screen.
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Reply to ${message.name}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-lg rounded-2xl border border-[#2E3340] bg-[#11131A] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2E3340]">
          <h2 className="font-display text-base font-bold text-[#E8E9ED]">
            Reply to {message.name}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-[#6B7280] hover:text-[#E8E9ED] transition-colors p-1 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* To + copy */}
          <div className="rounded-lg bg-[#0B0C10] border border-[#2E3340] px-3 py-2.5 flex items-center justify-between gap-3">
            <span className="text-xs text-[#6B7280] font-mono truncate">
              To: <span className="text-[#E8E9ED]">{message.email}</span>
            </span>
            <button
              onClick={copyEmail}
              className="inline-flex items-center gap-1.5 text-xs text-[#14B8A6] hover:text-[#2DD4BF] transition-colors flex-shrink-0 cursor-pointer"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Subject */}
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            autoFocus
            className={replyFieldCls}
          />

          {/* Body */}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={7}
            placeholder="Write your reply…"
            className={`${replyFieldCls} resize-y leading-relaxed`}
          />

          {/* Actions */}
          <div className="space-y-3 pt-1">
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(message.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#14B8A6] text-[#0B0C10] text-sm font-semibold px-4 py-2 hover:bg-[#2DD4BF] transition-colors"
            >
              <Send size={14} />
              Send via Gmail
            </a>
            <p className="text-xs text-[#6B7280]">
              Opens Gmail in a new tab with the reply ready &mdash; just press Send
              there.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
