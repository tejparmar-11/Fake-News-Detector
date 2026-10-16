import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ArrowRight, Shield, Brain, Globe, Zap, Eye, AlertTriangle, Users, BarChart2 } from 'lucide-react'
import ParticleBackground from '../components/ParticleBackground'
import StatCounter from '../components/StatCounter'
import NewsTicker from '../components/NewsTicker'

const TYPEWRITER_HEADLINES = [
  '"New miracle cure discovered — doctors hate this!"',
  '"BREAKING: Government secretly banning free speech"',
  '"Scientists confirm 5G causes mind control"',
  '"Celebrity caught funding global conspiracy"',
  '"This one fruit cures ALL diseases overnight"',
]

function TypewriterHeadline() {
  const [idx, setIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const target = TYPEWRITER_HEADLINES[idx]
    if (!deleting && displayed.length < target.length) {
      timeoutRef.current = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 48)
    } else if (!deleting && displayed.length === target.length) {
      timeoutRef.current = setTimeout(() => setDeleting(true), 2200)
    } else if (deleting && displayed.length > 0) {
      timeoutRef.current = setTimeout(() => setDisplayed(d => d.slice(0, -1)), 22)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setIdx(i => (i + 1) % TYPEWRITER_HEADLINES.length)
    }
    return () => clearTimeout(timeoutRef.current)
  }, [displayed, deleting, idx])

  return (
    <div style={{
      background: 'rgba(255,76,76,0.08)', border: '1px solid rgba(255,76,76,0.25)',
      borderRadius: 12, padding: '12px 20px', display: 'inline-block',
      maxWidth: '90%', textAlign: 'left', minHeight: 52,
    }}>
      <span style={{ color: '#FF8080', fontStyle: 'italic', fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>
        {displayed}
        <span style={{ borderRight: '2px solid #FF4C4C', marginLeft: 2, animation: 'blink 1s step-end infinite' }} />
      </span>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  )
}

const FEATURES = [
  { icon: '🧠', title: 'NLP Analysis', desc: 'Deep linguistic pattern recognition using distilled transformer models trained on 50,000+ articles.' },
  { icon: '🔗', title: 'Source Credibility', desc: '10,000+ domains rated against NewsGuard & Media Bias/Fact Check databases.' },
  { icon: '💬', title: 'Sentiment Analysis', desc: 'Emotional charge detection — fake news uses fear and outrage more than facts.' },
  { icon: '⚡', title: 'Clickbait Detection', desc: 'Identifies ALL-CAPS, excessive punctuation, and sensational language patterns.' },
  { icon: '⚖️', title: 'Bias Detection', desc: 'Left/right/neutral political bias meter using keyword and framing analysis.' },
  { icon: '🔴', title: 'Multilingual Ready', desc: 'Detection in 10+ languages including Hindi, Spanish, French, and Arabic.' },
  { icon: '🖼️', title: 'Image Verification', desc: 'Upload images to check if they\'re recycled, manipulated, or AI-generated.' },
  { icon: '📊', title: 'Real-Time Database', desc: 'Cross-referenced against 200,000+ debunked stories from Snopes, PolitiFact & more.' },
]

const TESTIMONIALS = [
  {
    name: 'Sarah Chen', role: 'Investigative Journalist, Reuters',
    quote: 'TruthLens has become an essential tool in our newsroom. The linguistic analysis catches things human editors miss.',
    avatar: '👩‍💼',
  },
  {
    name: 'Dr. Arjun Mehta', role: 'Media Studies Professor, MIT',
    quote: 'The ensemble model approach is genuinely state-of-the-art. This rivals commercial fact-checking platforms.',
    avatar: '👨‍🔬',
  },
  {
    name: 'Lisa Okonkwo', role: 'Fact-Checker, AFP Fact Check',
    quote: 'The multilingual support is a game changer. 70% of the misinformation we track is in non-English languages.',
    avatar: '👩‍💻',
  },
]

const STEPS = [
  { icon: '📋', title: 'Paste Your News', desc: 'Input any article, headline, URL, or block of text' },
  { icon: '🤖', title: 'AI Analyzes It', desc: 'NLP model runs linguistic, sentiment, and database checks in milliseconds' },
  { icon: '🎯', title: 'Get Your Verdict', desc: 'Receive a clear REAL/FAKE verdict with confidence score and full breakdown' },
]

export default function Home() {
  return (
    <div style={{ position: 'relative', paddingTop: 64 }}>
      <ParticleBackground />

      {/* ── Hero ─────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 40px', textAlign: 'center', position: 'relative', zIndex: 1,
      }}>
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 18px', borderRadius: 50,
            background: 'rgba(30,144,255,0.1)', border: '1px solid rgba(30,144,255,0.3)',
            marginBottom: 28, fontSize: '0.8rem', color: '#7DD3FC',
          }}
        >
          <span className="pulse-dot" style={{ background: '#00E676' }} />
          AI-Powered Fake News Detection · Real-Time · Free
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}
          style={{
            fontSize: 'clamp(2.2rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.1,
            marginBottom: 10, color: '#fff',
          }}
          className="font-orbitron"
        >
          Can You Trust<br />
          <span className="gradient-text">What You Read?</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ marginBottom: 14 }}
        >
          <TypewriterHeadline />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ color: '#94A3B8', fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', maxWidth: 580, lineHeight: 1.7, marginBottom: 36 }}
        >
          TruthLens uses AI + real-time global news data to verify any news in seconds.
          See through the noise. Find the truth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 56 }}
        >
          <Link to="/analyze" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
            <Search size={18} /> Analyze News Now
          </Link>
          <Link to="/about" className="btn-secondary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
            See How It Works <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          style={{ width: '100%', maxWidth: 800 }}
        >
          <StatCounter />
        </motion.div>
      </section>

      {/* ── News Ticker ───────────────────────── */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <NewsTicker />
      </div>

      {/* ── How It Works ─────────────────────── */}
      <section style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ color: '#1E90FF', fontWeight: 600, marginBottom: 10, fontSize: '0.85rem', letterSpacing: 2, textTransform: 'uppercase' }}>Simple Process</div>
            <h2 className="font-orbitron" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 800, color: '#fff' }}>
              How <span className="gradient-text">TruthLens</span> Works
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28, position: 'relative' }}>
            {STEPS.map(({ icon, title, desc }, i) => (
              <motion.div
                key={i}
                className="step-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="step-number">{i + 1}</div>
                <div style={{ fontSize: '2.5rem', marginTop: 8 }}>{icon}</div>
                <h3 style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '1.1rem' }}>{title}</h3>
                <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.7 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────── */}
      <section style={{
        padding: '80px 24px',
        background: 'rgba(5,8,18,0.5)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ color: '#1E90FF', fontWeight: 600, marginBottom: 10, fontSize: '0.85rem', letterSpacing: 2, textTransform: 'uppercase' }}>Capabilities</div>
            <h2 className="font-orbitron" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', fontWeight: 800, color: '#fff' }}>
              Feature Highlights
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {FEATURES.map(({ icon, title, desc }, i) => (
              <motion.div
                key={i}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>{icon}</div>
                <h3 style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '0.95rem', marginBottom: 8 }}>{title}</h3>
                <p style={{ color: '#64748B', fontSize: '0.82rem', lineHeight: 1.6 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────── */}
      <section style={{ padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="font-orbitron" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 800, color: '#fff' }}>
              Trusted by Journalists & Researchers
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {TESTIMONIALS.map(({ name, role, quote, avatar }, i) => (
              <motion.div
                key={i}
                className="glass"
                style={{ padding: 28 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div style={{ fontSize: '1.2rem', color: '#1E90FF', marginBottom: 14 }}>❝</div>
                <p style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic' }}>
                  {quote}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'rgba(30,144,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem',
                  }}>{avatar}</div>
                  <div>
                    <div style={{ color: '#E2E8F0', fontWeight: 600, fontSize: '0.875rem' }}>{name}</div>
                    <div style={{ color: '#64748B', fontSize: '0.78rem' }}>{role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14, marginTop: 48 }}>
            {['🤖 Powered by NLP', '📂 Open Source Dataset', '✅ Verified by 10M+ Checks', '🌍 50+ Countries', '🔒 Privacy First'].map(badge => (
              <span key={badge} style={{
                padding: '8px 20px',
                background: 'rgba(30,144,255,0.08)',
                border: '1px solid rgba(30,144,255,0.2)',
                borderRadius: 50, color: '#7DD3FC', fontSize: '0.82rem',
              }}>{badge}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────── */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, rgba(30,144,255,0.08), rgba(124,58,237,0.08))',
        borderTop: '1px solid rgba(30,144,255,0.15)',
        borderBottom: '1px solid rgba(30,144,255,0.15)',
        textAlign: 'center',
        position: 'relative', zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="font-orbitron" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff', marginBottom: 14 }}>
            Stop Spreading <span className="gradient-text-red">Misinformation</span>
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1rem', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
            Verify before you share. It takes 5 seconds to save someone from being misinformed.
          </p>
          <Link to="/analyze" className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.05rem' }}>
            <Shield size={20} /> Start Verifying Now — It's Free
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
