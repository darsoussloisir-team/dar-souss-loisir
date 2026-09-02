import { useState, useEffect, useRef } from 'react'
import { X, Send, Loader } from 'lucide-react'
import './ChatWidget.css'

const SESSION_ID = `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`

const WELCOME = {
  role: 'assistant',
  content: 'Hello! I am the Dar Souss Loisir virtual assistant. Ask me anything about our camel ride experiences in Agadir.',
}

// ── Robot SVG icon ────────────────────────────────────────────────────────────
function RobotIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Head */}
      <rect x="5" y="6" width="14" height="10" rx="2" />
      {/* Eyes */}
      <circle cx="9" cy="11" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="11" r="1.2" fill="currentColor" stroke="none" />
      {/* Mouth */}
      <path d="M9 14h6" />
      {/* Antenna */}
      <line x1="12" y1="6" x2="12" y2="3" />
      <circle cx="12" cy="2.5" r="0.8" fill="currentColor" stroke="none" />
      {/* Neck */}
      <line x1="12" y1="16" x2="12" y2="18" />
      {/* Body */}
      <rect x="7" y="18" width="10" height="4" rx="1.5" />
      {/* Arms */}
      <line x1="7" y1="19.5" x2="4" y2="19.5" />
      <line x1="17" y1="19.5" x2="20" y2="19.5" />
    </svg>
  )
}

export default function ChatWidget() {
  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const bottomRef               = useRef(null)
  const inputRef                = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 280)
  }, [open])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, session_id: SESSION_ID }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.detail || 'Something went wrong.')
      }
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError(err.message || 'Could not reach the assistant. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      {/* Chat window */}
      <div className={`cw ${open ? 'cw--open' : ''}`} role="dialog" aria-label="AI Assistant">

        {/* Header */}
        <div className="cw__header">
          <div className="cw__header-left">
            <div className="cw__avatar">
              <RobotIcon size={20} />
              <span className="cw__online" />
            </div>
            <div>
              <p className="cw__name">AI Assistant</p>
              <p className="cw__sub">Dar Souss Loisir</p>
            </div>
          </div>
          <button className="cw__close" onClick={() => setOpen(false)} aria-label="Close">
            <X size={17} />
          </button>
        </div>

        {/* Messages */}
        <div className="cw__messages">
          {messages.map((m, i) => (
            <div key={i} className={`cw__msg cw__msg--${m.role}`}>
              {m.role === 'assistant' && (
                <div className="cw__msg-avatar"><RobotIcon size={14} /></div>
              )}
              <p className="cw__msg-text">{m.content}</p>
            </div>
          ))}

          {loading && (
            <div className="cw__msg cw__msg--assistant">
              <div className="cw__msg-avatar"><RobotIcon size={14} /></div>
              <div className="cw__typing"><span /><span /><span /></div>
            </div>
          )}

          {error && (
            <div className="cw__msg cw__msg--error">
              <p className="cw__msg-text">{error}</p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="cw__input-row">
          <textarea
            ref={inputRef}
            className="cw__input"
            placeholder="Ask about our experiences..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            rows={1}
            disabled={loading}
          />
          <button className="cw__send" onClick={send} disabled={!input.trim() || loading} aria-label="Send">
            {loading
              ? <Loader size={15} className="cw__spin" />
              : <Send size={15} />
            }
          </button>
        </div>

        <p className="cw__footer">
          AI assistant · For bookings use{' '}
          <a href="https://wa.me/212615726781" target="_blank" rel="noreferrer">WhatsApp</a>
        </p>
      </div>

      {/* Floating trigger button */}
      <button
        className={`cw__bubble ${open ? 'cw__bubble--open' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close assistant' : 'Open AI assistant'}
      >
        {open ? <X size={20} /> : <RobotIcon size={24} />}
        {!open && <span className="cw__bubble-dot" />}
      </button>
    </>
  )
}