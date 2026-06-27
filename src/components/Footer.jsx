import { OWNER } from '../data/defaults'
import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #f1f5f9',
      padding: '28px 24px',
      textAlign: 'center',
      background: '#fafafa',
    }}>
      <p style={{ color: '#9ca3af', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        Built with <Heart size={14} fill="#EC4899" color="#EC4899" /> by <span style={{ color: '#7C3AED', fontWeight: 600 }}>{OWNER.name}</span> · {new Date().getFullYear()}
      </p>
    </footer>
  )
}
