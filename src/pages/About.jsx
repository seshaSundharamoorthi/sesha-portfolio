import { getPhoto } from '../utils/storage'
import { useEffect, useState } from 'react'
import { OWNER } from '../data/defaults'
import { MapPin, GraduationCap, Briefcase } from 'lucide-react'

export default function About() {
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const p = await getPhoto()
      setPhoto(p)
      setLoading(false)
    }
    load()
  }, [])

  const tags = [
    { icon: <GraduationCap size={14} />, label: 'CS Graduate', color: '#7C3AED', bg: '#f3f0ff' },
    { icon: <MapPin size={14} />, label: 'Based in India', color: '#059669', bg: '#ecfdf5' },
    { icon: <Briefcase size={14} />, label: 'Open to Opportunities', color: '#ea580c', bg: '#fff7ed' },
  ]

  return (
    <main style={{ minHeight: 'calc(100vh - 64px)', position: 'relative', overflow: 'hidden' }}>
      <div className="blob" style={{ width: 400, height: 400, background: '#7C3AED', top: -50, right: -100 }} />
      <div className="blob" style={{ width: 300, height: 300, background: '#06B6D4', bottom: 100, left: -50 }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 70 }}>
          <p style={{ color: '#7C3AED', fontWeight: 600, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Who I Am</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#1a1a2e', marginBottom: 16 }}>About <span className="gradient-text">Me</span></h2>
          <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>Get to know who I am, what drives me, and the tech I work with.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 60, alignItems: 'start' }} className="about-grid">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 280, height: 320, borderRadius: 24,
              background: photo ? 'transparent' : 'linear-gradient(135deg, #7C3AED22, #EC489922)',
              border: '2px solid rgba(124,58,237,0.15)',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(124,58,237,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {loading ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #7C3AED', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                </div>
              ) : photo ? (
                <img src={photo} alt="Sesha S" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#fff', fontWeight: 800, fontSize: 28 }}>SS</div>
                  <p style={{ color: '#9ca3af', fontSize: 13 }}>Upload photo in Admin</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a2e', marginBottom: 20 }}>Passionate Full Stack Developer</h3>
            <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: 16, fontSize: 15 }}>{OWNER.about}</p>
            <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: 16, fontSize: 15 }}>I love collaborating with teams, learning new technologies, and pushing the boundaries of what's possible on the web.</p>
            <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: 28, fontSize: 15 }}>When I'm not coding, you'll find me exploring new frameworks, contributing to open-source, or brainstorming solutions to real-world challenges.</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {tags.map((t, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 50, background: t.bg, color: t.color, fontSize: 13, fontWeight: 600, border: `1px solid ${t.color}22` }}>
                  {t.icon} {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .about-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  )
}
