import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import VerdictCard from '../components/VerdictCard'
import ScoreBreakdown from '../components/ScoreBreakdown'
import HighlightedText from '../components/HighlightedText'

const LOADING_STEPS = [
  "Initializing FAKE-NEWS transformers...",
  "Running RoBERTa zero-shot analysis...",
  "DistilBERT LIAR dataset classification...",
  "Cross-referencing Google Fact Check API...",
  "Extracting NER entities via spaCy...",
  "Calculating TF-IDF cosine similarity to verified DB...",
  "Finalizing weighted ensemble prediction...",
]

export default function Analyze() {
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [result, setResult] = useState(null)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const handleFeedback = async (type) => {
    try {
      await axios.post('http://localhost:8000/feedback', {
        analysis_id: result.id || 0,
        feedback_type: type,
        comment: "User reported via UI",
        session_id: "web-session"
      })
      setFeedbackSubmitted(type)
    } catch (err) {
      console.error("Feedback error", err)
    }
  }

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!text.trim()) return alert("Enter some text")

    setLoading(true)
    setResult(null)
    setLoadingStep(0)

    // Simulate loading steps UI (we make this slightly slower to feel like a massive ML pipeline)
    const interval = setInterval(() => {
      setLoadingStep(s => (s < LOADING_STEPS.length - 1 ? s + 1 : s))
    }, 1200)

    try {
      const res = await axios.post('http://localhost:8000/analyze', {
        text,
        source_url: url
      })

      const data = res.data
      setResult(data)

      // Save to history
      const old = JSON.parse(localStorage.getItem('history') || '[]')
      old.unshift({
        text: text.substring(0, 100) + '...',
        verdict: data.verdict,
        confidence: data.confidence,
        date: new Date().toISOString()
      })
      localStorage.setItem('history', JSON.stringify(old))
    } catch (err) {
      alert("Backend error or disconnected")
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  return (
    <div className="page-enter" style={{ minHeight: '100vh', padding: '100px 24px 60px', position: 'relative' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 className="font-orbitron" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: 12 }}>
            Deep <span className="gradient-text">Analysis</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto' }}>
            Paste any claim. TruthLens runs it through fine-tuned LLMs, TF-IDF scaling, and explicit fact-checker API validations.
          </p>
        </div>

        {/* ── Input Section ──────────────────────────────────────── */}
        <div className="glass-strong" style={{ padding: '32px', marginBottom: 40 }}>
          <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ position: 'relative' }}>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste the full article text, suspicious claim, or social media post here..."
                  style={{
                    width: '100%', minHeight: 180, padding: '16px 20px',
                    background: 'rgba(5, 8, 18, 0.6)', border: '1px solid rgba(30,144,255,0.2)',
                    borderRadius: 12, color: '#F8FAFC', fontSize: '0.95rem',
                    lineHeight: 1.6, resize: 'vertical',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(30,144,255,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(30,144,255,0.2)'}
                />
              </div>
            </div>

            <div>
               <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: 8 }}>Source URL (Optional - For Credibility Scoring)</label>
               <input
                 type="url"
                 value={url}
                 onChange={(e) => setUrl(e.target.value)}
                 placeholder="https://example.com/article"
                 style={{
                   width: '100%', padding: '12px 16px',
                   background: 'rgba(5, 8, 18, 0.6)', border: '1px solid rgba(30,144,255,0.2)',
                   borderRadius: 8, color: '#F8FAFC', fontSize: '0.9rem',
                 }}
               />
            </div>

            <div style={{ marginTop: 10, textAlign: 'center' }}>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading}
                style={{ 
                  width: '100%', maxWidth: 300, padding: '16px', fontSize: '1.1rem',
                  opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' 
                }}
              >
                {loading ? 'Initializing Pipeline...' : 'Check News'}
              </button>
            </div>
          </form>
        </div>

        {/* ── Loading State ──────────────────────────────────────── */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="glass" style={{ padding: '40px', textAlign: 'center', marginBottom: 40 }}>
                <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 24px' }}>
                  <div className="spinner" style={{ width: 80, height: 80, borderTopColor: '#7C3AED', position: 'absolute', top: 0, left: 0 }} />
                  <div className="spinner" style={{ width: 60, height: 60, borderTopColor: '#1E90FF', position: 'absolute', top: 10, left: 10, animationDirection: 'reverse', animationDuration: '1.2s' }} />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 24 }}>🧠</div>
                </div>
                <h3 className="font-orbitron" style={{ color: '#fff', fontSize: '1.2rem', marginBottom: 16 }}>
                  Running Heavy ML Pipeline
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 350, margin: '0 auto', textAlign: 'left' }}>
                  {LOADING_STEPS.map((step, i) => (
                    <div key={i} style={{ 
                      display: 'flex', alignItems: 'center', gap: 10,
                      color: i <= loadingStep ? '#E2E8F0' : '#475569',
                      opacity: i <= loadingStep ? 1 : 0.5,
                      transition: 'all 0.3s'
                    }}>
                      {i < loadingStep ? <span style={{ color: '#00E676' }}>✓</span> : i === loadingStep ? <span className="pulse-dot" style={{ background: '#1E90FF', width: 8, height: 8 }} /> : <span>○</span>}
                      <span style={{ fontSize: '0.9rem' }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results Section ──────────────────────────────────────── */}
        <AnimatePresence>
          {!loading && result && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              <div style={{ textAlign: 'center', marginBottom: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <div style={{ height: 1, flex: 1, background: 'linear-gradient(to right, transparent, rgba(30,144,255,0.3))' }} />
                <h2 className="font-orbitron" style={{ color: '#1E90FF', fontSize: '1.4rem', letterSpacing: 2 }}>ENSEMBLE COMPLETE</h2>
                <div style={{ height: 1, flex: 1, background: 'linear-gradient(to left, transparent, rgba(30,144,255,0.3))' }} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <VerdictCard result={result} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, marginBottom: 40 }}>
                <ScoreBreakdown scores={result.scores || {}} biasLabel={result.bias_label} />
                <HighlightedText text={result.text_snippet || text} flaggedPhrases={result.flagged_phrases || []} />
              </div>

              {/* Feedback Section */}
              <div className="glass" style={{ padding: '24px', textAlign: 'center', marginBottom: 40 }}>
                <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: 16 }}>
                  {feedbackSubmitted ? "Thank you! Your feedback helps TruthLens learn." : "Is this result accurate?"}
                </p>
                {!feedbackSubmitted ? (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
                    <button onClick={() => handleFeedback('correct')} className="btn-secondary" style={{ padding: '10px 24px', borderColor: '#00E676', color: '#00E676' }}>
                      👍 Yes, correct
                    </button>
                    <button onClick={() => handleFeedback('incorrect')} className="btn-secondary" style={{ padding: '10px 24px', borderColor: '#FF5252', color: '#FF5252' }}>
                      👎 No, incorrect
                    </button>
                  </div>
                ) : (
                  <div style={{ color: feedbackSubmitted === 'correct' ? '#00E676' : '#FF5252', fontWeight: 600 }}>
                    {feedbackSubmitted === 'correct' ? "Marked as Correct" : "Marked as Incorrect"}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}