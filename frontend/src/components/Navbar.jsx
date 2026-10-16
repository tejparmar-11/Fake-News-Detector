import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      padding: '15px 30px',
      background: '#0a0f1e',
      display: 'flex',
      justifyContent: 'space-between',
      zIndex: 1000
    }}>
      <h2 style={{ color: '#1E90FF' }}>TruthLens</h2>

      <div>
        <Link to="/" style={{ margin: 10, color: 'white' }}>Home</Link>
        <Link to="/analyze" style={{ margin: 10, color: 'white' }}>Analyze</Link>
        <Link to="/trending" style={{ margin: 10, color: 'white' }}>Trending</Link>
        <Link to="/history" style={{ margin: 10, color: 'white' }}>History</Link>
      </div>
    </nav>
  )
}