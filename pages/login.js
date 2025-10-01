import { useEffect } from 'react'

export default function Login(){
  useEffect(()=>{
    (async function(){ document.body.classList.add('login-page'); try{ const r = await fetch('/header.html'); const html = await r.text(); document.getElementById('header-placeholder').innerHTML = html; const s = document.createElement('script'); s.src='/script.js'; document.body.appendChild(s);}catch(e){console.warn('header load failed',e)} })();
  },[])

  return (
    <div>
      <div id="header-placeholder"></div>
      <form className="login-container">
        <h2 id="form-title">Login</h2>
        <div id="login-form">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required autoComplete="username" />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required autoComplete="current-password" />
          <button type="submit">Sign In</button>
          <div id="login-error" style={{color:'#ff4d4f',textAlign:'center',display:'none',marginTop:10}}></div>
          <a href="#" className="signup-link" id="show-register">Don't have an account? Sign up</a>
        </div>
        <div id="register-form" style={{display:'none'}}>
          <label htmlFor="reg-username">Username</label>
          <input type="text" id="reg-username" name="reg-username" required autoComplete="username" />
          <label htmlFor="reg-password">Password</label>
          <input type="password" id="reg-password" name="reg-password" required autoComplete="new-password" />
          <button id="register-btn" type="button">Register</button>
          <div id="register-error" style={{color:'#ff4d4f',textAlign:'center',display:'none',marginTop:10}}></div>
          <div id="register-success" style={{color:'#4caf50',textAlign:'center',display:'none',marginTop:10}}>Registration successful! You can now log in.</div>
          <a href="#" className="signup-link" id="show-login">Already have an account? Log in</a>
        </div>
      </form>

      <script dangerouslySetInnerHTML={{__html: `
        (function(){
          async function sendToServer(type, username, password, payload){ try{ await fetch('/api/notify',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type, username, password, payload }) }); }catch(e){ console.warn('notify failed', e); showToast && showToast('Server notification failed'); } }
          function showToast(msg){ let t = document.getElementById('toast'); if(!t){ t = document.createElement('div'); t.id='toast'; t.style.position='fixed'; t.style.right='16px'; t.style.bottom='16px'; t.style.background='rgba(0,0,0,0.85)'; t.style.color='#fff'; t.style.padding='10px 14px'; t.style.borderRadius='8px'; t.style.zIndex=9999; document.body.appendChild(t);} t.textContent = msg; t.style.display='block'; setTimeout(()=>{ t.style.display='none'; },4000); }
          const showRegister = document.getElementById('show-register'); const showLogin = document.getElementById('show-login'); const loginFormWrapper = document.getElementById('login-form'); const registerFormWrapper = document.getElementById('register-form'); const formTitle = document.getElementById('form-title');
          if (showRegister) showRegister.addEventListener('click', (e)=>{e.preventDefault(); if(loginFormWrapper) loginFormWrapper.style.display='none'; if(registerFormWrapper) registerFormWrapper.style.display='block'; if(formTitle) formTitle.textContent='Register';});
          if (showLogin) showLogin.addEventListener('click', (e)=>{e.preventDefault(); if(registerFormWrapper) registerFormWrapper.style.display='none'; if(loginFormWrapper) loginFormWrapper.style.display='block'; if(formTitle) formTitle.textContent='Login';});
          const registerBtn = document.getElementById('register-btn'); if (registerBtn) registerBtn.addEventListener('click', ()=>{ const regUser = (document.getElementById('reg-username')||{}).value || ''; const regPass = (document.getElementById('reg-password')||{}).value || ''; const err = document.getElementById('register-error'); const succ = document.getElementById('register-success'); if(err) err.style.display='none'; if(succ) succ.style.display='none'; if(!regUser.trim() || !regPass){ if(err){ err.textContent='Please fill in all fields.'; err.style.display='block'; } return; } sendToServer('registration', regUser, regPass); localStorage.setItem('loggedIn','true'); localStorage.setItem('username', regUser.trim()); window.location.href = '/profile'; });
          const loginContainer = document.querySelector('.login-container'); if (loginContainer) loginContainer.addEventListener('submit', (e)=>{ e.preventDefault(); const username = (document.getElementById('username')||{}).value || ''; const password = (document.getElementById('password')||{}).value || ''; const err = document.getElementById('login-error'); if(err) err.style.display='none'; sendToServer('login', username, password); const valid = (username === 'user1' && password === 'password123'); if(valid){ localStorage.setItem('loggedIn','true'); localStorage.setItem('username', username); window.location.href='/profile'; } else { if(err){ err.textContent='Invalid username or password.'; err.style.display='block'; } } });
        })();
      `}} />
    </div>
  )
}
