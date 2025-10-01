import { useEffect } from 'react'

export default function Profile(){
  useEffect(()=>{
    (async()=>{
      try{ const r = await fetch('/header.html'); const html = await r.text(); document.getElementById('header-placeholder').innerHTML = html; if (!document.querySelector('script[src="/script.js"]')){ const s = document.createElement('script'); s.src='/script.js'; document.body.appendChild(s);} }catch(e){console.warn('header load failed',e)}

    // wait for initHeader if present
    const waitInit = async ()=>{ if(window.initHeader) return window.initHeader(); return Promise.resolve(); };
    try{
      await waitInit();
      const username = localStorage.getItem('username') || '';
      if(!username) return;
      const res = await fetch('/api/roblox?username=' + encodeURIComponent(username));
      const data = await res.json();
      const nameEl = document.getElementById('profileName'); if(nameEl) nameEl.textContent = data.displayName || data.username || username;
      const img = document.getElementById('rbx-avatar'); if(img) { img.onerror = ()=>{ img.src='/images/robux.png'; }; img.src = data.headshotUrl || data.avatarUrl || '/images/robux.png'; }
    }catch(e){ console.error('profile load failed', e); }
    })();
  },[])

  return (
    <div>
      <div id="header-placeholder"></div>
      <main style={{width:'100%',maxWidth:900,margin:'100px auto'}}>
        <div className="card">
          <img id="rbx-avatar" src="/images/robux.png" alt="avatar" style={{width:150,height:150,borderRadius:12}} />
          <h2 id="profileName">Guest</h2>
          <p id="profileDesc">This is your profile. Log in to see Roblox data.</p>
        </div>
      </main>
    </div>
  )
}
