export default function HighlightedText({ text, flaggedPhrases = [] }) {
  if (!text || !flaggedPhrases.length) {
    return (
      <div className="glass" style={{ padding: 24 }}>
        <h3 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 14, fontSize: '1rem' }}>🔍 Text Analysis View</h3>
        <p style={{ color: '#94A3B8', lineHeight: 1.8, fontSize: '0.9rem' }}>{text}</p>
      </div>
    )
  }

  // Build segments with highlights
  const triggers = flaggedPhrases.filter(f => f.type === 'trigger').map(f => f.phrase.toLowerCase())
  const credibles = flaggedPhrases.filter(f => f.type === 'credible').map(f => f.phrase.toLowerCase())
  const allPhrases = [...triggers, ...credibles].sort((a, b) => b.length - a.length)

  // Simple tokenizer: split text into highlighted/plain segments
  const segments = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    let matched = false
    for (const phrase of allPhrases) {
      const idx = remaining.toLowerCase().indexOf(phrase)
      if (idx === 0) {
        const isTrigger = triggers.includes(phrase)
        segments.push(
          <mark
            key={key++}
            className={isTrigger ? 'highlight-fake' : 'highlight-credible'}
            title={isTrigger ? '⚠️ Suspicious phrase' : '✅ Credible indicator'}
          >
            {remaining.slice(0, phrase.length)}
          </mark>
        )
        remaining = remaining.slice(phrase.length)
        matched = true
        break
      } else if (idx > 0) {
        segments.push(<span key={key++}>{remaining.slice(0, idx)}</span>)
        remaining = remaining.slice(idx)
        matched = true
        break
      }
    }
    if (!matched) {
      segments.push(<span key={key++}>{remaining}</span>)
      remaining = ''
    }
  }

  return (
    <div className="glass" style={{ padding: 24 }}>
      <h3 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 8, fontSize: '1rem' }}>🔍 Text Analysis View</h3>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#94A3B8' }}>
          <span className="highlight-fake" style={{ padding: '1px 6px' }}>red phrase</span> = suspicious / trigger word
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#94A3B8' }}>
          <span className="highlight-credible" style={{ padding: '1px 6px' }}>green phrase</span> = credible indicator
        </span>
      </div>
      <p style={{ color: '#CBD5E1', lineHeight: 1.9, fontSize: '0.9rem' }}>{segments}</p>
    </div>
  )
}
