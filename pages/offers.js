import { useEffect, useState } from 'react'

export default function Offers() {
  const [offers, setOffers] = useState([])
  const [page, setPage] = useState(0)
  const perPage = 8

  useEffect(() => {
    ;(async () => {
      // Load header
      try {
        const r = await fetch('/header.html')
        const html = await r.text()
        const header = document.getElementById('header-placeholder')
        if (header) header.innerHTML = html

        if (!document.querySelector('script[src="/script.js"]')) {
          const s = document.createElement('script')
          s.src = '/script.js'
          document.body.appendChild(s)
        }
      } catch (e) {
        console.warn('header load failed', e)
      }

      // Fetch offers
      try {
        const res = await fetch('/api/feed')
        const data = await res.json()
        setOffers(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error('Failed to load offers', e)
        setOffers([])
      }
    })()
  }, [])

  const formatRobux = (amount) => {
    const val = parseFloat(amount)
    return isNaN(val) ? 0 : val
  }

  const handleClaim = (offer) => {
    window.open(offer.url, '_blank')
    const add = formatRobux(offer.user_payout)
    let current = parseFloat(localStorage.getItem('robux') || '0')
    current = Number((current + add).toFixed(3))
    localStorage.setItem('robux', current)
    const el = document.getElementById('robuxAmount')
    if (el) el.textContent = current
  }

  const currentOffers = offers.slice(0, (page + 1) * perPage)

  return (
    <div>
      <div id="header-placeholder"></div>

      <main style={{ maxWidth: 1200, margin: '80px auto 40px', padding: '0 16px' }}>
        {/* Title */}
        <h1
          style={{
            color: '#00d4ff',
            textShadow: '0 0 12px #8b3cff',
            textAlign: 'center',
            marginBottom: 8,
            fontSize: 32,
          }}
        >
          Available Offers
        </h1>
        <p style={{ color: '#8b3cff', textAlign: 'center', marginBottom: 24, fontSize: 16 }}>
          Complete these offers to earn Robux!
        </p>

        {/* Offers Grid */}
        <div
          id="offersGrid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)', // desktop: 5 per row
            gap: '20px',
          }}
        >
          {currentOffers.map((o) => (
            <div
              key={o.id}
              className="card"
              style={{
                background: '#181a20',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              }}
            >
              <img
                src={o.network_icon || '/images/robux.png'}
                alt={o.name}
                style={{ width: 100, height: 100, objectFit: 'cover', marginBottom: 12 }}
                onError={(e) => (e.target.src = '/images/robux.png')}
              />
              <h3 style={{ color: '#00c3ff', textAlign: 'center', marginBottom: 6 }}>{o.name}</h3>
              <p
                style={{
                  color: '#8b3cff',
                  textAlign: 'center',
                  fontSize: 14,
                  marginBottom: 12,
                }}
              >
                {o.anchor || o.conversion}
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 12,
                  background: '#23272f',
                  padding: '4px 8px',
                  borderRadius: 8,
                }}
              >
                <img src="/images/robux.png" alt="Robux" style={{ width: 20, height: 20 }} />
                <span style={{ color: '#f5f6fa', fontWeight: 500 }}>
                  {formatRobux(o.user_payout)} Robux
                </span>
              </div>
              <button
                onClick={() => handleClaim(o)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#00c3ff',
                  color: '#000',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Claim offer
              </button>
            </div>
          ))}
        </div>

        {/* Load More */}
        {currentOffers.length < offers.length && (
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button
              onClick={() => setPage((p) => p + 1)}
              style={{
                padding: '12px 24px',
                borderRadius: 10,
                border: 'none',
                background: '#00c3ff',
                color: '#000',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Load More Offers
            </button>
          </div>
        )}
      </main>

      {/* Responsive CSS */}
      <style jsx>{`
        @media (max-width: 1200px) {
          #offersGrid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 768px) {
          #offersGrid {
            display: flex;
            overflow-x: auto;
            gap: 12px;
            padding: 0 12px;
          }
          #offersGrid .card {
            flex: 0 0 80%;
          }
        }
      `}</style>
    </div>
  )
}

