import { SKILLS } from '../data/defaults'

export default function Skills() {
  return (
    <main style={{ minHeight: 'calc(100vh - 64px)', position: 'relative', overflow: 'hidden' }}>
      <div className="blob" style={{ width: 400, height: 400, background: '#EC4899', top: -50, left: -100 }} />
      <div className="blob" style={{ width: 350, height: 350, background: '#06B6D4', bottom: 0, right: -50 }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{ color: '#7C3AED', fontWeight: 600, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Tech Stack</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#1a1a2e', marginBottom: 16 }}>
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
            Technologies I've worked with and have developed strong proficiency in.
          </p>
        </div>

        {/* Skills Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 20,
          maxWidth: 900, margin: '0 auto',
        }}>
          {SKILLS.map((skill, i) => (
            <div key={i} className="skill-pill card-hover" style={{
              background: '#fff',
              border: '1px solid #f1f5f9',
              borderRadius: 16,
              padding: '24px 16px',
              textAlign: 'center',
              cursor: 'default',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Color accent top bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: skill.color,
                borderRadius: '16px 16px 0 0',
              }} />

              {/* Icon */}
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: skill.color + '18',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: 26,
              }}>
                {skill.icon}
              </div>

              <p style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>{skill.name}</p>
            </div>
          ))}
        </div>

        {/* Also good at section */}
        <div style={{ textAlign: 'center', marginTop: 60 }}>
          <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 16 }}>Also experienced with</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['VS Code', 'Postman', 'REST API', 'Responsive Design', 'Problem Solving', 'Team Collaboration'].map((item, i) => (
              <span key={i} style={{
                padding: '6px 16px', borderRadius: 50,
                background: '#f8fafc', border: '1px solid #e2e8f0',
                fontSize: 13, color: '#6b7280', fontWeight: 500,
              }}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
