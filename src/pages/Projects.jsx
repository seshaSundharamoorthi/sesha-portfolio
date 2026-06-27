import { useState, useEffect } from 'react'
import { Github, ExternalLink, X, Rocket } from 'lucide-react'
import { getProjects } from '../utils/storage'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const p = await getProjects()
      setProjects(p)
      setLoading(false)
    }
    load()
  }, [])

  const COLORS = ['#7C3AED', '#EC4899', '#F97316', '#06B6D4', '#10B981', '#8B5CF6']

  return (
    <main style={{ minHeight: 'calc(100vh - 64px)', position: 'relative', overflow: 'hidden' }}>
      <div className="blob" style={{ width: 400, height: 400, background: '#7C3AED', top: -50, right: -100 }} />
      <div className="blob" style={{ width: 300, height: 300, background: '#F97316', bottom: 0, left: -50 }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{ color: '#7C3AED', fontWeight: 600, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Portfolio</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#1a1a2e', marginBottom: 16 }}>My <span className="gradient-text">Projects</span></h2>
          <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>A collection of projects I've built — from real-world applications to personal experiments.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #7C3AED', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: '#9ca3af' }}>Loading projects...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {projects.map((proj, i) => {
              const color = proj.color || COLORS[i % COLORS.length]
              return (
                <div key={proj.id} className="card-hover" style={{ background: '#fff', borderRadius: 20, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: 5, background: color }} />
                  <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Rocket size={20} color={color} />
                      </div>
                      <div>
                        <h3 style={{ fontWeight: 800, fontSize: 16, color: '#1a1a2e', lineHeight: 1.3 }}>{proj.name}</h3>
                        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{proj.shortDesc}</p>
                      </div>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, marginBottom: 16, flex: 1 }}>
                      {proj.description.length > 120 ? proj.description.slice(0, 120) + '...' : proj.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                      {(Array.isArray(proj.tech) ? proj.tech : proj.tech.split(',')).map((t, ti) => (
                        <span key={ti} style={{ padding: '3px 10px', borderRadius: 6, background: color + '12', color: color, fontSize: 12, fontWeight: 600 }}>{t.trim()}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {proj.github && (
                        <a href={proj.github} target="_blank" rel="noreferrer" className="btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '9px 16px', fontSize: 13 }}>
                          <Github size={15} /> GitHub
                        </a>
                      )}
                      {proj.demo && (
                        <a href={proj.demo} target="_blank" rel="noreferrer" className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '9px 16px', fontSize: 13, background: color }}>
                          <ExternalLink size={15} /> Live Demo
                        </a>
                      )}
                      <button onClick={() => setSelected(proj)} style={{ padding: '9px 14px', borderRadius: 50, border: `1px solid ${color}33`, background: color + '10', color: color, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* More Coming Soon */}
            <div style={{ background: '#fafafa', borderRadius: 20, border: '2px dashed #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center', minHeight: 280 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED22, #EC489922)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 24 }}>🚀</div>
              <h3 style={{ fontWeight: 800, fontSize: 16, color: '#1a1a2e', marginBottom: 8 }}>More Coming Soon</h3>
              <p style={{ color: '#9ca3af', fontSize: 14 }}>Working on exciting new projects. Stay tuned!</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setSelected(null)}>
          <div style={{ background: '#fff', borderRadius: 24, maxWidth: 560, width: '100%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 40px 80px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ height: 6, background: selected.color || '#7C3AED', borderRadius: '24px 24px 0 0' }} />
            <div style={{ padding: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <h2 style={{ fontWeight: 900, fontSize: 22, color: '#1a1a2e' }}>{selected.name}</h2>
                <button onClick={() => setSelected(null)} style={{ background: '#f8fafc', border: 'none', borderRadius: 8, cursor: 'pointer', padding: 8, color: '#6b7280' }}><X size={18} /></button>
              </div>
              <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: 20, fontSize: 15 }}>{selected.description}</p>
              <h4 style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', marginBottom: 12 }}>Technologies Used</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                {(Array.isArray(selected.tech) ? selected.tech : selected.tech.split(',')).map((t, i) => (
                  <span key={i} style={{ padding: '5px 14px', borderRadius: 8, background: (selected.color || '#7C3AED') + '12', color: selected.color || '#7C3AED', fontSize: 13, fontWeight: 600 }}>{t.trim()}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {selected.github && <a href={selected.github} target="_blank" rel="noreferrer" className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}><Github size={16} /> GitHub</a>}
                {selected.demo && <a href={selected.demo} target="_blank" rel="noreferrer" className="btn-primary" style={{ flex: 1, justifyContent: 'center', background: selected.color || '#7C3AED' }}><ExternalLink size={16} /> Live Demo</a>}
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  )
}
