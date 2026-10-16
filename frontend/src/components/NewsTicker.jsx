import { useEffect, useRef, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const MOCK_TICKER = [
  { headline: "US Federal Reserve holds interest rates steady", source: "Reuters", verdict: "REAL", confidence: 97.2 },
  { headline: "SECRET: Bill Gates admits microchips in vaccines — LEAKED", source: "truthbomb.net", verdict: "FAKE", confidence: 98.8 },
  { headline: "WHO declares end to mpox public health emergency", source: "BBC News", verdict: "REAL", confidence: 96.1 },
  { headline: "EXPOSED: Moon is hologram projected by NASA satellites", source: "realawakening.co", verdict: "FAKE", confidence: 99.1 },
  { headline: "NASA's Artemis mission successfully orbits the Moon", source: "AP News", verdict: "REAL", confidence: 98.4 },
  { headline: "Doctors FORBIDDEN from telling you this fruit cures diabetes", source: "healthfreedom.org", verdict: "FAKE", confidence: 94.5 },
  { headline: "India surpasses China as world's most populous nation", source: "The Guardian", verdict: "REAL", confidence: 99.0 },
  { headline: "5G towers shrink brain cells — Chinese study claims", source: "radiationwatch.today", verdict: "FAKE", confidence: 95.8 },
  { headline: "SpaceX Starship completes first successful orbital flight", source: "The Verge", verdict: "REAL", confidence: 97.7 },
  { headline: "Government secretly banning cash by March 2025 — act NOW", source: "libertybell.info", verdict: "FAKE", confidence: 97.3 },
  { headline: "Global EV sales top 20 million units for first time", source: "Reuters", verdict: "REAL", confidence: 96.5 },
  { headline: "Chemtrails CONFIRMED: Pilots spray lithium to control masses", source: "skywatchers.net", verdict: "FAKE", confidence: 98.2 },
]

export default function NewsTicker() {
  const [items, setItems] = useState(MOCK_TICKER)

  useEffect(() => {
    axios.get(`${API}/api/ticker`).then(r => {
      if (r.data?.items?.length) setItems(r.data.items)
    }).catch(() => {})
  }, [])

  const doubled = [...items, ...items]

  return (
    <div style={{
      background: 'rgba(5,8,18,0.9)',
      borderTop: '1px solid rgba(30,144,255,0.15)',
      borderBottom: '1px solid rgba(30,144,255,0.15)',
      padding: '10px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Label */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 10,
        display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg, #1E90FF, #7C3AED)',
        padding: '0 18px',
        fontWeight: 700, fontSize: '0.75rem', letterSpacing: 1, color: '#fff',
        whiteSpace: 'nowrap',
      }}>
        🔴 LIVE
      </div>

      {/* Fade edges */}
      <div style={{
        position: 'absolute', left: 80, top: 0, bottom: 0, width: 60, zIndex: 5,
        background: 'linear-gradient(to right, rgba(5,8,18,0.9), transparent)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, zIndex: 5,
        background: 'linear-gradient(to left, rgba(5,8,18,0.9), transparent)',
        pointerEvents: 'none',
      }} />

      <div style={{ marginLeft: 90, overflow: 'hidden' }}>
        <div className="ticker-track">
          {doubled.map((item, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '0 28px', whiteSpace: 'nowrap',
              fontSize: '0.82rem', color: '#CBD5E1',
              borderRight: '1px solid rgba(255,255,255,0.08)',
            }}>
              <span style={{
                padding: '2px 8px', borderRadius: 50,
                background: item.verdict === 'REAL' ? 'rgba(0,230,118,0.15)' : 'rgba(255,76,76,0.15)',
                color: item.verdict === 'REAL' ? '#00E676' : '#FF4C4C',
                fontWeight: 700, fontSize: '0.7rem',
              }}>
                {item.verdict === 'REAL' ? '✅ REAL' : '❌ FAKE'}
              </span>
              <span style={{ color: '#94A3B8' }}>{item.source}</span>
              <span>{item.headline}</span>
              <span style={{ color: '#475569', fontSize: '0.75rem' }}>{item.confidence}%</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
