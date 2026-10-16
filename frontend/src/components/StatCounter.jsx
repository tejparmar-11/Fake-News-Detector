import { useEffect, useRef, useState } from 'react'

function useCountUp(target, duration = 2000, start = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // ease out
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return value
}

function StatItem({ value, suffix = '', label, started }) {
  const num = useCountUp(value, 2200, started)
  const formatted = num >= 1_000_000
    ? (num / 1_000_000).toFixed(1) + 'M'
    : num >= 1_000
    ? (num / 1_000).toFixed(0) + 'K'
    : num.toString()

  return (
    <div style={{ textAlign: 'center', padding: '0 24px' }}>
      <div className="font-orbitron" style={{
        fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
        fontWeight: 900,
        background: 'linear-gradient(135deg, #1E90FF, #7C3AED)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        {formatted}{suffix}
      </div>
      <div style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: 4, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  )
}

export default function StatCounter() {
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStarted(true); obs.disconnect() }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const stats = [
    { value: 2347821, suffix: '+', label: 'Articles Analyzed' },
    { value: 98.7, suffix: '%', label: 'Accuracy Rate' },
    { value: 54, suffix: '+', label: 'Countries Covered' },
    { value: 0, suffix: 'ms', label: 'Avg. Response Time', override: '<800ms' },
  ]

  return (
    <div
      ref={ref}
      style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
        gap: 8,
        background: 'rgba(10,15,30,0.8)',
        border: '1px solid rgba(30,144,255,0.15)',
        borderRadius: 20,
        padding: '28px 16px',
      }}
    >
      {stats.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          {s.override ? (
            <div style={{ textAlign: 'center', padding: '0 24px' }}>
              <div className="font-orbitron" style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 900,
                background: 'linear-gradient(135deg, #1E90FF, #7C3AED)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{s.override}</div>
              <div style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: 4 }}>{s.label}</div>
            </div>
          ) : (
            <StatItem value={s.value} suffix={s.suffix} label={s.label} started={started} />
          )}
          {i < stats.length - 1 && (
            <div style={{ width: 1, height: 48, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />
          )}
        </div>
      ))}
    </div>
  )
}
