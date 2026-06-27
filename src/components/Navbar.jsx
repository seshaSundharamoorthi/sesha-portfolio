import { NavLink } from 'react-router-dom'
import { Github, Linkedin, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { OWNER } from '../data/defaults'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/skills', label: 'Skills' },
    { to: '/projects', label: 'Projects' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #f1f5f9',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 64,
      }}>
        {/* Logo */}
        <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 16, letterSpacing: -0.5,
          }}>SS</div>
          <span style={{ fontWeight: 700, fontSize: 17, color: '#1a1a2e' }}>Portfolio</span>
        </NavLink>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}
          className="desktop-nav">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href={OWNER.github} target="_blank" rel="noopener noreferrer"
            style={{ color: '#6b7280', transition: 'color .2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#7C3AED'}
            onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
            <Github size={20} />
          </a>
          <a href={OWNER.linkedin} target="_blank" rel="noopener noreferrer"
            style={{ color: '#6b7280', transition: 'color .2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#7C3AED'}
            onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
            <Linkedin size={20} />
          </a>
          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', cursor: 'pointer',
              color: '#6b7280', display: 'none' }}
            className="mobile-menu-btn">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: '#fff', borderTop: '1px solid #f1f5f9',
          padding: '16px 24px 20px', display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
              style={{ fontSize: 16 }}>
              {l.label}
            </NavLink>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
