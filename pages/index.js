import { useEffect } from 'react'

export default function Home(){
  useEffect(()=>{
    (async()=>{
      try{ const r = await fetch('/header.html'); const html = await r.text(); document.getElementById('header-placeholder').innerHTML = html; if (!document.querySelector('script[src="/script.js"]')){ const s = document.createElement('script'); s.src='/script.js'; document.body.appendChild(s);} }catch(e){console.warn('header load failed',e)}
    })();
  },[])

  return (
    <div>
      <div id="header-placeholder"></div>
      <main style={{width:'100%',maxWidth:1200,margin:'100px auto 40px'}}>
        <h1 style={{color:'#00d4ff',textShadow:'0 0 10px #8b3cff'}}>Welcome</h1>
        <p style={{color:'#8b3cff'}}>Home page - static design preserved</p>
      </main>
    </div>
  )
}
