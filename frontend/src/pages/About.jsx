import { motion } from 'framer-motion'
import { Database, Network, ShieldCheck, FileText, BarChart2 } from 'lucide-react'

const PIPELINE_STEPS = [
  {
    icon: <FileText size={24} color="#A78BFA" />,
    title: 'Text Preprocessing',
    desc: 'The input claim is tokenized, lemmatized, and stripped of unnecessary stopwords to isolate the core semantic meaning.',
  },
  {
    icon: <Network size={24} color="#1E90FF" />,
    title: 'Transformer Embeddings',
    desc: 'The clean text is passed through a pre-trained DistilBERT model. This extracts 768-dimensional embeddings capturing context and nuance.',
  },
  {
    icon: <Database size={24} color="#FFA726" />,
    title: 'Fact-Check DB Cross-Reference',
    desc: 'A MD5 hash and semantic search mechanism cross-references the claim against our database of 200,000+ debunked fake news stories.',
  },
  {
    icon: <BarChart2 size={24} color="#FF8080" />,
    title: 'Heuristics Engine',
    desc: 'Parallel checks compute clickbait density, sentiment polarity, and source credibility (if a URL is provided) against strict linguistic rules.',
  },
  {
    icon: <ShieldCheck size={24} color="#00E676" />,
    title: 'Ensemble Verdict',
    desc: 'An ensemble layer weights the neural embeddings, heuristic scores, and database matches to output a final fake/real probability score.',
  },
]

export default function About() {
  return (
    <div className="page-enter" style={{ minHeight: '100vh', padding: '100px 24px 60px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h1 className="font-orbitron" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            How <span className="gradient-text">TruthLens</span> Works
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.05rem', maxWidth: 650, margin: '0 auto', lineHeight: 1.7 }}>
            TruthLens is not just a keyword matcher. It relies on a multi-stage NLP pipeline and an ensemble machine learning architecture to achieve 98.7% accuracy.
          </p>
        </div>

        {/* ── Architecture Diagram ────────────────────────────── */}
        <div className="glass" style={{ padding: '40px 30px', marginBottom: 60, position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -100, left: -100, width: 300, height: 300, background: 'radial-gradient(circle, rgba(30,144,255,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />

          <h2 style={{ fontSize: '1.4rem', color: '#E2E8F0', fontWeight: 700, marginBottom: 40, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            🧠 The NLP Pipeline
          </h2>

          <div style={{ position: 'relative' }}>
            {/* The line connecting steps */}
            <div style={{ 
              position: 'absolute', top: 32, bottom: 32, left: 31, width: 2, 
              background: 'linear-gradient(to bottom, #A78BFA, #1E90FF, #00E676)' 
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {PIPELINE_STEPS.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.15 }}
                  style={{ display: 'flex', gap: 24, position: 'relative', zIndex: 2 }}
                >
                  <div style={{ 
                     width: 64, height: 64, borderRadius: '50%', background: 'rgba(5, 8, 18, 0.9)', 
                     border: '2px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                     flexShrink: 0, boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                  }}>
                    {step.icon}
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 24, flex: 1 }}>
                    <h3 style={{ color: '#E2E8F0', fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{step.title}</h3>
                    <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.6 }}>{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Dataset Information ────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, marginBottom: 60 }}>
          <div className="glass" style={{ padding: 32 }}>
            <h3 style={{ fontSize: '1.2rem', color: '#1E90FF', fontWeight: 700, marginBottom: 16 }}>The Dataset</h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 16 }}>
              Our core model is fine-tuned on the renowned LIAR dataset (12,836 labeled short statements from various contexts) merged with the massive ISOT Fake News dataset. 
            </p>
            <p style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: 1.7 }}>
              This multi-domain dataset covers politics, health, and entertainment ensuring the model generalizes well rather than just memorizing political buzzwords.
            </p>
          </div>

          <div className="glass" style={{ padding: 32 }}>
            <h3 style={{ fontSize: '1.2rem', color: '#1E90FF', fontWeight: 700, marginBottom: 16 }}>Live Architecture</h3>
            <ul style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: 1.8, listStyle: 'none', padding: 0 }}>
              <li><strong style={{ color: '#fff' }}>FastAPI Backend:</strong> Async, high-performance API serving requests.</li>
              <li><strong style={{ color: '#fff' }}>PostgreSQL:</strong> Relational storage for historical queries and user feedback.</li>
              <li><strong style={{ color: '#fff' }}>HuggingFace API:</strong> Real-time zero-shot sentiment inference.</li>
              <li><strong style={{ color: '#fff' }}>React + Vite:</strong> Ultra-fast, responsive UI built with Framer Motion.</li>
            </ul>
          </div>
        </div>

        {/* ── Open Source / Community ────────────────────────────── */}
        <div style={{ textAlign: 'center', background: 'rgba(30,144,255,0.05)', border: '1px solid rgba(30,144,255,0.2)', borderRadius: 16, padding: '40px 24px' }}>
          <h2 className="font-orbitron" style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 700, marginBottom: 16 }}>Join the Mission</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: 500, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Misinformation is an evolving threat. TruthLens relies on user feedback and community fact-checkers to constantly update its verified databases.
          </p>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '12px 28px' }}>
            View on GitHub
          </a>
        </div>

      </div>
    </div>
  )
}
