export default function History() {
  const data = JSON.parse(localStorage.getItem('history') || '[]')

  return (
    <div style={{ paddingTop: '100px', color: 'white', textAlign: 'center' }}>
      <h1>Your History</h1>

      {data.length === 0 ? (
        <p>No history yet</p>
      ) : (
        data.map((item, i) => (
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
        ))
      )}
    </div>
  )
}