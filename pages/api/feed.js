import axios from 'axios';

let cache = { data: null, ts: 0 };
const CACHE_TTL = 60 * 5 * 1000; // 5 minutes

export default async function handler(req, res) {
  const feedUrl = 'https://d3k0q5ez56odtk.cloudfront.net/public/offers/feed.php?user_id=623910&api_key=525aedb31fa76c26997f25d2b15e501f&s1=&s2=';
  try {
    const now = Date.now();
    if (cache.data && (now - cache.ts) < CACHE_TTL) {
      return res.status(200).json(cache.data);
    }
    const r = await axios.get(feedUrl, { timeout: 8000 });
    cache = { data: r.data, ts: Date.now() };
    return res.status(200).json(r.data);
  } catch (err) {
    console.error('feed proxy failed', err && err.toString());
    if (cache.data) return res.status(200).json(cache.data);
    return res.status(500).json({ error: 'feed_unavailable' });
  }
}
