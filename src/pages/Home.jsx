import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, ArrowRight, MapPin } from 'lucide-react'
import { OWNER } from '../data/defaults'
import { getPhoto, getResume } from '../utils/storage'

const CODE_LINES = [
  { key: 'const developer', sym: '= {', color: '#c792ea' },
  { key: '  name', val: '"Sesha S"', kc: '#80cbc4', vc: '#c3e88d' },
  { key: '  role', val: '"Full Stack Dev"', kc: '#80cbc4', vc: '#c3e88d' },
  { key: '  passion', val: '"Building"', kc: '#80cbc4', vc: '#c3e88d' },
  { key: '}', sym: '', color: '#c792ea' },
]

export default function Home() {
  const [photo, setPhoto] = useState(null)
  const [resume, setResume] = useState({ data: null, name: 'Resume.pdf' })
  const [typed, setTyped] = useState('')
  const [loading, setLoading] = useState(true)
  const fullText = OWNER.tagline

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [p, r] = await Promise.all([getPhoto(), getResume()])
      setPhoto(p)
      setResume(r)
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    let i = 0
    setTyped('')
    const timer = setInterval(() => {
      if (i <= fullText.length) { setTyped(fullText.slice(0, i)); i++ }
      else clearInterval(timer)
    }, 45)
    return () => clearInterval(timer)
  }, [])

  const handleDownloadResume = () => {
    if (resume.data) {
      const link = document.createElement('a')
      link.href = resume.data
      link.download = resume.name
      link.click()
    } else {
      alert('Resume not uploaded yet. Please upload from Admin panel!')
    }
  }

  return (
    <main style={{ minHeight: 'calc(100vh - 64px)', position: 'relative', overflow: 'hidden' }}>
      <div className="blob" style={{ width: 500, height: 500, background: '#7C3AED', top: -100, left: -150 }} />
      <div className="blob" style={{ width: 400, height: 400, background: '#EC4899', top: 200, right: -100 }} />
      <div className="blob" style={{ width: 300, height: 300, background: '#06B6D4', bottom: 0, left: '40%' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }} className="hero-grid">

          {/* LEFT — Photo + Code card */}
          <div className="float-anim" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)',
              borderRadius: 24, padding: 32,
              boxShadow: '0 20px 60px rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.1)',
              width: '100%', maxWidth: 360,
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 110, height: 110, borderRadius: '50%',
                  background: photo ? 'transparent' : 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  border: '4px solid white',
                  boxShadow: '0 0 0 3px rgba(124,58,237,0.3)',
                  overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {loading ? (
                    <div style={{ width: 30, height: 30, borderRadius: '50%', border: '3px solid #fff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                  ) : photo ? (
                    <img src={photo} alt="Sesha S" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: 32 }}>SS</span>
                  )}
                </div>
              </div>

              <div style={{
                background: '#1e1e2e', borderRadius: 12,
                padding: '16px 18px', fontFamily: "'Fira Code', monospace",
                fontSize: 13, lineHeight: 1.8, marginBottom: 16,
              }}>
                {CODE_LINES.map((l, i) => (
                  <div key={i}>
                    {l.val ? (
                      <><span style={{ color: l.kc }}>{l.key}</span><span style={{ color: '#89ddff' }}>: </span><span style={{ color: l.vc }}>{l.val}</span><span style={{ color: '#89ddff' }}>,</span></>
                    ) : (
                      <span style={{ color: l.color }}>{l.key}{l.sym}</span>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#16a34a', fontWeight: 500 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)', display: 'inline-block' }} />
                  Available for work
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
              <span className="badge">● Freelancer</span>
              <span className="badge" style={{ background: '#fdf2ff', color: '#a21caf', borderColor: '#f5d0fe' }}>● Full Stack Developer</span>
            </div>

            <h1 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, lineHeight: 1.15, color: '#1a1a2e', marginBottom: 20, letterSpacing: -1 }}>
              {typed.split(' ').map((word, i) => {
                const colorWords = ['Code', 'Engineer', 'Solutions', 'Into', 'Reality']
                const isColored = colorWords.some(cw => word.includes(cw))
                return <span key={i}><span className={isColored ? 'gradient-text' : ''}>{word}</span>{' '}</span>
              })}
              <span className="cursor-blink" style={{ color: '#7C3AED' }}>|</span>
            </h1>

            <p style={{ fontSize: 16, color: '#6b7280', lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>{OWNER.bio}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9ca3af', fontSize: 14, marginBottom: 32 }}>
              <MapPin size={14} />{OWNER.location}
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
              <button className="btn-primary" onClick={handleDownloadResume}>
                <Download size={18} /> Download Resume
              </button>
              <Link to="/contact" className="btn-outline">
                Contact Me <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
              {OWNER.stats.map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg, #7C3AED, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }
      `}</style>
    </main>
  )
}
