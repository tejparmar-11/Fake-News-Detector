import { Link } from 'react-router-dom'
import { Github, Twitter, Linkedin, Globe } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      background: 'rgba(5, 8, 18, 0.95)',
      borderTop: '1px solid rgba(30,144,255,0.15)',
      padding: '48px 24px 24px',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 24 }}>🔍</span>
              <span className="font-orbitron" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                Truth<span style={{ color: '#1E90FF' }}>Lens</span>
              </span>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 240 }}>
              See Through the Noise. Find the Truth. AI-powered misinformation detection for a better-informed world.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              {[Github, Twitter, Linkedin, Globe].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(30,144,255,0.1)',
                  border: '1px solid rgba(30,144,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#94A3B8', textDecoration: 'none', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,144,255,0.2)'; e.currentTarget.style.color = '#1E90FF'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(30,144,255,0.1)'; e.currentTarget.style.color = '#94A3B8'; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ color: '#E2E8F0', fontWeight: 600, marginBottom: 16, fontSize: '0.9rem' }}>Platform</h4>
            {[
              { to: '/analyze', label: 'Analyze News' },
              { to: '/trending', label: 'Trending Fakes' },
              { to: '/history', label: 'My History' },
              { to: '/about', label: 'How It Works' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{
                display: 'block', color: '#64748B', textDecoration: 'none',
                fontSize: '0.875rem', marginBottom: 10, transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#1E90FF'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
              >{label}</Link>
            ))}
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ color: '#E2E8F0', fontWeight: 600, marginBottom: 16, fontSize: '0.9rem' }}>Resources</h4>
            {['API Docs', 'Open Dataset', 'Research Paper', 'Browser Extension (Soon)', 'GitHub'].map(label => (
              <a key={label} href="#" style={{
                display: 'block', color: '#64748B', textDecoration: 'none',
                fontSize: '0.875rem', marginBottom: 10, transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#1E90FF'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
              >{label}</a>
            ))}
          </div>

          {/* Trust Badges */}
          <div>
            <h4 style={{ color: '#E2E8F0', fontWeight: 600, marginBottom: 16, fontSize: '0.9rem' }}>Trusted By</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['🤖 Powered by NLP', '📂 Open Source Database', '✅ Verified by 10M+ checks', '🌍 50+ Countries Covered'].map(badge => (
                <span key={badge} style={{
                  display: 'inline-block', padding: '6px 14px',
                  background: 'rgba(30,144,255,0.08)', border: '1px solid rgba(30,144,255,0.2)',
                  borderRadius: 50, color: '#94A3B8', fontSize: '0.8rem',
                }}>{badge}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 20,
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10,
        }}>
          <p style={{ color: '#475569', fontSize: '0.8rem' }}>
            © 2025 TruthLens. Built for a better-informed world.
          </p>
          <p style={{ color: '#475569', fontSize: '0.8rem' }}>
            Built with ❤️ using FastAPI + React + NLP
          </p>
        </div>
      </div>
    </footer>
  )
}
