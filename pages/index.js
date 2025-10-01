import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
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
    })()
  }, [])

  return (
    <div>
      <div id="header-placeholder"></div>

      <main
        style={{
          width: '100%',
          maxWidth: 1200,
          margin: '100px auto 40px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ color: '#00d4ff', textShadow: '0 0 10px #8b3cff', marginBottom: '40px' }}>
          Welcome
        </h1>

        <button
          onClick={() => router.push('/offers')}
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            border: 'none',
            background: '#00c3ff',
            color: '#000',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Begin
        </button>
      </main>
    </div>
  )
}
