import { motion } from 'framer-motion'

const SCORE_CONFIGS = [
  {
    key: 'roberta',
    label: 'RoBERTa LLM',
    desc: 'Deep learning zero-shot classification trained on AI/Fake data',
    icon: '🤖',
    goodHigh: false, 
  },
  {
    key: 'distilbert',
    label: 'DistilBERT Ensemble',
    desc: 'Transformer fine-tuned on LIAR/Kaggle datasets',
    icon: '🧠',
    goodHigh: false,
  },
  {
    key: 'linguistic',
    label: 'Linguistic Analysis',
    desc: 'Writing style, grammar patterns typical of fake news',
    icon: '📝',
    goodHigh: true,
  },
  {
    key: 'clickbait',
    label: 'Clickbait Score',
    desc: 'Sensational language, ALL CAPS, excessive punctuation',
    icon: '⚡',
    goodHigh: false,
  },
  {
    key: 'source_credibility',
    label: 'Source Credibility',
    desc: 'Domain trust rating against known credible/blacklisted sources',
    icon: '🔗',
    goodHigh: true,
  },
  {
    key: 'database_match',
    label: 'Database TF-IDF Match',
    desc: 'Cosine similarity to verified fake news records',
    icon: '🗄️',
    goodHigh: false, 
  },
]

function getBarColor(score, goodHigh) {
  const normalized = goodHigh ? score : 100 - score
  if (normalized >= 70) return '#00E676'
  if (normalized >= 45) return '#FFA726'
  return '#FF4C4C'
}

function ScoreBar({ score, goodHigh, delay }) {
  const color = getBarColor(score, goodHigh)
  return (
    <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden', marginTop: 8 }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.9, delay, ease: 'easeOut' }}
        style={{ height: '100%', background: color, borderRadius: 4, boxShadow: `0 0 8px ${color}80` }}
      />
    </div>
  )
}

export default function ScoreBreakdown({ scores, biasLabel }) {
  return (
    <div className="glass" style={{ padding: 28 }}>
      <h3 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 22, fontSize: '1rem' }}>
        📊 Analysis Breakdown
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
        {SCORE_CONFIGS.map(({ key, label, desc, icon, goodHigh }, i) => {
          const score = scores[key] ?? 50
          const color = getBarColor(score, goodHigh)
          const displayScore = goodHigh ? score : 100 - score
          const rating = displayScore >= 70 ? 'Good' : displayScore >= 45 ? 'Moderate' : 'Poor'

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: '16px 18px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                  <div>
                    <div style={{ color: '#E2E8F0', fontWeight: 600, fontSize: '0.85rem' }}>{label}</div>
                    <div style={{ color: '#64748B', fontSize: '0.75rem', marginTop: 2, maxWidth: 180 }}>{desc}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ color, fontWeight: 700, fontSize: '1.1rem' }}>{score.toFixed(0)}</div>
                  <div style={{ color: '#475569', fontSize: '0.7rem' }}>{rating}</div>
                </div>
              </div>
              <ScoreBar score={score} goodHigh={goodHigh} delay={i * 0.07 + 0.2} />
            </motion.div>
          )
        })}
      </div>

      {/* Bias label pill */}
      {biasLabel && (
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#64748B', fontSize: '0.85rem' }}>Narrative framing:</span>
          <span style={{
            padding: '4px 14px', borderRadius: 50,
            background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
            color: '#A78BFA', fontSize: '0.8rem', fontWeight: 600,
          }}>⚖️ {biasLabel}</span>
        </div>
      )}
    </div>
  )
}
