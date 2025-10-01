// Safe init function that can be called multiple times
async function initHeader() {
  if (window._robuxInit) return; // idempotent
  window._robuxInit = true;

  const profileBtn = document.getElementById("profileBtn");
  const robloxUserDiv = document.getElementById("roblox-user");
  const robuxAmountEl = document.getElementById("robuxAmount");

  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  if (profileBtn) {
    if (isLoggedIn) {
      profileBtn.href = "profile.html";
      profileBtn.textContent = "Profile";
    } else {
      profileBtn.href = "login.html";
      profileBtn.textContent = "Login";
    }
  }

  if (robloxUserDiv) {
    if (isLoggedIn) {
      const username = localStorage.getItem("username") || "user1";
      robloxUserDiv.style.display = "flex";
      robloxUserDiv.innerHTML = `<span id="rbx-username" style="font-weight:500;margin-right:8px;color:#f5f6fa"></span><img id="rbx-avatar" src="" alt="avatar" style="width:32px;height:32px;border-radius:50%;background:#23272f;">`;
      const nameEl = document.getElementById("rbx-username");
      if (nameEl) nameEl.textContent = username;

      try {
        // Prefer local proxy if available to avoid CORS/rate limits
        let avatarUrl = null;
        try {
          const p = await fetch(`/api/roblox?username=${encodeURIComponent(username)}`);
          if (p.ok) {
            const pj = await p.json();
            if (!pj.error) avatarUrl = pj.headshotUrl || pj.avatarUrl || null;
          }
        } catch (e) {
          // proxy unavailable, fall back to direct fetch
          console.warn('Proxy fetch failed, falling back to direct Roblox calls', e);
        }

        if (!avatarUrl) {
          const res = await fetch(`https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(username)}`);
          const search = await res.json();
          const user = search.data && search.data[0];
          const userId = user && user.id;
          if (userId) {
            const thumb = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=100x100&format=png&isCircular=true`);
            const thumbJson = await thumb.json();
            avatarUrl = thumbJson.data && thumbJson.data[0] && thumbJson.data[0].imageUrl;
          }
        }

        const img = document.getElementById("rbx-avatar");
        if (img) img.src = avatarUrl || '';
      } catch (e) {
        // ignore network errors
        console.warn('Failed to fetch roblox avatar', e);
      }
    } else {
      robloxUserDiv.style.display = "none";
    }
  }

  // Robux counter (safe update)
  if (robuxAmountEl) {
    let robux = localStorage.getItem("robux") || 0;
    robuxAmountEl.textContent = robux;
  }
}

// expose for onload callers
window.initHeader = initHeader;

// Exported helper to add Robux
window.addRobux = function(amount){
  let current = parseInt(localStorage.getItem("robux") || "0", 10);
  current += amount;
  localStorage.setItem("robux", current);
  const el = document.getElementById("robuxAmount");
  if (el) el.textContent = current;
};

// Try to init immediately in case header is already present
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initHeader, 0);
} else {
  document.addEventListener('DOMContentLoaded', initHeader);
}
