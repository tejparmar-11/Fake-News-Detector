export default function Trending() {
  const data = [
    {
      text: "Stock market crashes due to global recession fears",
      verdict: "REAL",
      confidence: 92
    },
    {
      text: "Drinking hot water cures all diseases instantly",
      verdict: "FAKE",
      confidence: 87
    },
    {
      text: "AI will replace 50% jobs by 2030",
      verdict: "REAL",
      confidence: 78
    }
  ]

  return (
    <div style={{ paddingTop: '100px', color: 'white', textAlign: 'center' }}>
      <h1>Trending News</h1>

      {data.map((item, i) => (
        <div key={i} style={{
          margin: '20px auto',
          padding: '20px',
          width: '60%',
          background: '#111827'
        }}>
          <p>{item.text}</p>
          <p>
            <b style={{
              color: item.verdict === 'FAKE' ? 'red' : 'limegreen'
            }}>
              {item.verdict}
            </b> ({item.confidence}%)
          </p>
        </div>
      ))}
    </div>
  )
}