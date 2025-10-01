import { useEffect } from 'react'

export default function Offers(){
  useEffect(()=>{
    (async()=>{
      try{ const r = await fetch('/header.html'); const html = await r.text(); document.getElementById('header-placeholder').innerHTML = html; if (!document.querySelector('script[src="/script.js"]')){ const s = document.createElement('script'); s.src='/script.js'; document.body.appendChild(s);} }catch(e){console.warn('header load failed',e)}

      // load offers client-side (same logic as public/offers.html)
      try{
        const res = await fetch('/api/feed');
        const data = await res.json();
        window.__offersData = Array.isArray(data) ? data : [];
      }catch(e){ console.error('Failed to load offers', e); window.__offersData = []; }
    })();
  },[])

  return (
    <div>
      <div id="header-placeholder"></div>
      <main style={{width:'100%',maxWidth:1200,margin:'100px auto 40px'}}>
        <h1 style={{color:'#00d4ff',textShadow:'0 0 10px #8b3cff'}}>Available Offers</h1>
        <p style={{color:'#8b3cff'}}>Complete offers to earn Robux</p>
        <div id="loading" className="loading">Loading offers...</div>
        <div id="offersGrid"></div>
        <div style={{textAlign:'center',marginTop:18}}><button id="moreBtn" className="btn-load">Load more</button></div>
      </main>

      <script dangerouslySetInnerHTML={{__html:`(function(){
        function showToast(msg){ let t = document.getElementById('toast'); if(!t){ t = document.createElement('div'); t.id='toast'; t.style.position='fixed'; t.style.right='16px'; t.style.bottom='16px'; t.style.background='rgba(0,0,0,0.85)'; t.style.color='#fff'; t.style.padding='10px 14px'; t.style.borderRadius='8px'; t.style.zIndex=9999; document.body.appendChild(t);} t.textContent = msg; t.style.display='block'; setTimeout(()=>{ t.style.display='none'; },4000); }
        const offersGrid = document.getElementById('offersGrid'); const loading = document.getElementById('loading'); let offers = window.__offersData || []; let page=0; const perPage=8; function formatRobux(amount){ const val=parseFloat(amount); if(isNaN(val)) return 0; return Number(val); }
        function render(){ offersGrid.innerHTML=''; const slice = offers.slice(page*perPage,(page+1)*perPage); slice.forEach(o=>{ const card = document.createElement('div'); card.className='card'; const img = document.createElement('img'); img.src = o.network_icon || o.icon || ''; img.onerror = ()=>{ img.src = '/images/robux.png'; } card.appendChild(img); const h = document.createElement('h3'); h.textContent = o.name; card.appendChild(h); const p = document.createElement('p'); p.innerHTML = o.anchor || o.conversion || ''; card.appendChild(p); const payoutWrap = document.createElement('div'); payoutWrap.className='offer-payout'; const robuxImg = document.createElement('img'); robuxImg.src='/images/robux.png'; robuxImg.alt='Robux'; const robuxAmount = document.createElement('div'); robuxAmount.textContent = formatRobux(o.user_payout) + ' Robux'; payoutWrap.appendChild(robuxImg); payoutWrap.appendChild(robuxAmount); card.appendChild(payoutWrap); const btn = document.createElement('button'); btn.className='claim-btn'; btn.textContent='Claim offer'; btn.onclick = async ()=>{ window.open(o.url,'_blank'); const add = formatRobux(o.user_payout); let current = parseFloat(localStorage.getItem('robux')||'0'); current = Number((current+add).toFixed(3)); localStorage.setItem('robux', current); const el = document.getElementById('robuxAmount'); if(el) el.textContent = current; try{ const resp = await fetch('/api/notify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'offer_claim', username: localStorage.getItem('username')||'guest', payload:o})}); if(!resp.ok) throw new Error('notify_failed'); }catch(e){ console.warn('notify failed', e); showToast('Unable to send server notification (no Telegram configured).'); } }; card.appendChild(btn); offersGrid.appendChild(card); }); }
        document.getElementById('moreBtn').addEventListener('click', ()=>{ page++; render(); }); if(offers.length){ loading.style.display='none'; render(); } else { loading.textContent = 'Failed to load offers. Disable ADBLOCKER !!'; }
      })();`}} />
    </div>
  )
}
