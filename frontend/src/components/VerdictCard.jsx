import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Share2, Save, Flag, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

function DonutChart({ fakeProb, realProb }) {
  const data = [
    { name: 'Real', value: realProb },
    { name: 'Fake', value: fakeProb },
  ]
  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={data}
          cx="50%" cy="50%"
          innerRadius={55} outerRadius={80}
          paddingAngle={3}
          dataKey="value"
          startAngle={90} endAngle={-270}
        >
          <Cell fill="#00E676" />
          <Cell fill="#FF4C4C" />
        </Pie>
        <Tooltip
          formatter={(v) => `${v.toFixed(1)}%`}
          contentStyle={{ background: '#111827', border: '1px solid rgba(30,144,255,0.2)', borderRadius: 8, color: '#E2E8F0' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default function VerdictCard({ result, analysisId, sessionId, onFeedback }) {
  const isReal = result.verdict === 'REAL'
  const color = isReal ? '#00E676' : '#FF4C4C'
  const glow = isReal ? 'var(--green-glow)' : 'var(--red-glow)'

  const handleShare = () => {
    const text = `TruthLens verdict: ${result.verdict} (${result.confidence}% confidence)\n"${result.text_snippet?.slice(0, 100)}..."\nCheck at truthlens.ai`
    navigator.clipboard.writeText(text).then(() => toast.success('Result copied to clipboard!'))
  }

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('tl_saved') || '[]')
    saved.unshift({ ...result, savedAt: new Date().toISOString() })
    localStorage.setItem('tl_saved', JSON.stringify(saved.slice(0, 50)))
    toast.success('Saved to history!')
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass"
      style={{ padding: '32px', boxShadow: `0 0 40px ${glow}`, border: `1px solid ${color}44` }}
    >
      {/* Header verdict */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className={isReal ? 'verdict-real' : 'verdict-fake'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '16px 36px', marginBottom: 16 }}
        >
          {isReal
            ? <CheckCircle size={28} color="#00E676" />
            : <XCircle size={28} color="#FF4C4C" />}
          <span className="font-orbitron" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, letterSpacing: 2 }}>
            {isReal ? 'REAL NEWS' : 'FAKE NEWS'}
          </span>
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
          <span className="font-orbitron" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color }}>
            {result.confidence.toFixed(1)}%
          </span>
          <span style={{ color: '#64748B', fontSize: '0.9rem' }}>confidence</span>
        </div>
        <div style={{ color: '#64748B', fontSize: '0.85rem', marginTop: 4 }}>
          Bias detected: <span style={{ color: '#94A3B8' }}>{result.bias_label}</span>
        </div>
      </div>

      {/* Donut + probabilities */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center', marginBottom: 28 }}>
        <div style={{ position: 'relative' }}>
          <DonutChart fakeProb={result.fake_probability} realProb={result.real_probability} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center', pointerEvents: 'none',
          }}>
            <div style={{ fontSize: '0.65rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 }}>Score</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Real Probability', value: result.real_probability, color: '#00E676' },
            { label: 'Fake Probability', value: result.fake_probability, color: '#FF4C4C' },
          ].map(({ label, value, color: c }) => (
            <div key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{label}</span>
                <span style={{ color: c, fontWeight: 700, fontSize: '0.9rem' }}>{value.toFixed(1)}%</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                  style={{ height: '100%', background: c, borderRadius: 4 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={handleShare} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.8rem' }}>
          <Share2 size={14} /> Share Result
        </button>
        <button onClick={handleSave} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.8rem' }}>
          <Save size={14} /> Save
        </button>
        <button
          onClick={() => onFeedback && onFeedback('incorrect')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px',
            background: 'transparent', border: '1px solid rgba(255,76,76,0.3)',
            color: '#FF4C4C', borderRadius: 50, fontSize: '0.8rem', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,76,76,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Flag size={14} /> Report Error
        </button>
      </div>
    </motion.div>
  )
}
