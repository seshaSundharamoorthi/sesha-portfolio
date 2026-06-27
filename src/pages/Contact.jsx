import { OWNER } from '../data/defaults'
import { Mail, MessageCircle, Github, Linkedin, MapPin, Send } from 'lucide-react'
import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const contacts = [
    {
      icon: <Mail size={20} />,
      label: 'EMAIL',
      value: OWNER.email,
      href: `mailto:${OWNER.email}`,
      color: '#7C3AED', bg: '#f3f0ff',
    },
    {
      icon: <MessageCircle size={20} />,
      label: 'WHATSAPP',
      value: 'Chat on WhatsApp',
      href: `https://wa.me/${OWNER.whatsapp}`,
      color: '#16a34a', bg: '#f0fdf4',
    },
    {
      icon: <Github size={20} />,
      label: 'GITHUB',
      value: 'github.com/seshaSundharamoorthi',
      href: OWNER.github,
      color: '#1a1a2e', bg: '#f8fafc',
    },
    {
      icon: <Linkedin size={20} />,
      label: 'LINKEDIN',
      value: 'linkedin.com/in/sesha-s',
      href: `https://${OWNER.linkedin}`,
      color: '#0077b5', bg: '#eff6ff',
    },
  ]

  const handleSend = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    // Opens email client with pre-filled content
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`)
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`)
    window.open(`mailto:${OWNER.email}?subject=${subject}&body=${body}`)
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setForm({ name: '', email: '', message: '' })
    }, 800)
  }

  return (
    <main style={{ minHeight: 'calc(100vh - 64px)', position: 'relative', overflow: 'hidden' }}>
      <div className="blob" style={{ width: 400, height: 400, background: '#7C3AED', top: -50, left: -100 }} />
      <div className="blob" style={{ width: 300, height: 300, background: '#EC4899', bottom: 0, right: -50 }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{ color: '#7C3AED', fontWeight: 600, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Get In Touch</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#1a1a2e', marginBottom: 16 }}>
            Contact <span className="gradient-text">Me</span>
          </h2>
          <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
            Have a project in mind or just want to say hello? My inbox is always open.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.2fr',
          gap: 50, alignItems: 'start',
        }} className="contact-grid">

          {/* Left: Contact links */}
          <div>
            <h3 style={{ fontWeight: 800, fontSize: 20, color: '#1a1a2e', marginBottom: 8 }}>Let's Connect</h3>
            <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
              Whether you have a question, a project idea, or just want to chat about tech — reach out and I'll get back to you as soon as possible.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {contacts.map((c, i) => (
                <a key={i} href={c.href} target={c.href.startsWith('mailto') ? '_self' : '_blank'} rel="noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 18px', borderRadius: 14,
                    background: c.bg, border: `1px solid ${c.color}22`,
                    textDecoration: 'none',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateX(6px)'
                    e.currentTarget.style.boxShadow = `0 4px 20px ${c.color}22`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateX(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: c.color + '18',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: c.color, flexShrink: 0,
                  }}>
                    {c.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: c.color, letterSpacing: 1 }}>{c.label}</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{c.value}</p>
                  </div>
                </a>
              ))}

              {/* Location */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 18px', borderRadius: 14,
                background: '#fff7ed', border: '1px solid #fdba7422',
              }}>
                <MapPin size={16} color="#ea580c" />
                <span style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>{OWNER.location}</span>
              </div>
            </div>
          </div>

          {/* Right: Contact form */}
          <div style={{
            background: '#fff', borderRadius: 20,
            border: '1px solid #f1f5f9',
            padding: 32,
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
          }}>
            <h3 style={{ fontWeight: 800, fontSize: 18, color: '#1a1a2e', marginBottom: 24 }}>Send a Message</h3>

            {sent ? (
              <div style={{
                textAlign: 'center', padding: '40px 20px',
                background: '#f0fdf4', borderRadius: 14,
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <h4 style={{ fontWeight: 700, color: '#16a34a', marginBottom: 8 }}>Message Sent!</h4>
                <p style={{ color: '#6b7280', fontSize: 14 }}>Thanks for reaching out. I'll get back to you soon!</p>
                <button onClick={() => setSent(false)} className="btn-primary" style={{ marginTop: 20 }}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Your Name</label>
                  <input className="input-style" placeholder="John Doe"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Email Address</label>
                  <input className="input-style" type="email" placeholder="john@example.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Message</label>
                  <textarea className="input-style" placeholder="Write your message here..."
                    rows={5} value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })} required
                    style={{ resize: 'vertical' }} />
                </div>
                <button type="submit" className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', opacity: sending ? 0.7 : 1 }}
                  disabled={sending}>
                  <Send size={16} />
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
