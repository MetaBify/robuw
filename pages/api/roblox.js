import axios from 'axios';

const MAX_RETRIES = 5;
const INITIAL_DELAY = 2000;

async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES, delay = INITIAL_DELAY) {
  try {
    return await axios({ url, ...options });
  } catch (err) {
    const status = err.response && err.response.status;
    if (status === 429 && retries > 0) {
      console.warn(`Rate limited. Retrying in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw err;
  }
}

export default async function handler(req, res) {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: 'username is required' });

  try {
    const usersResp = await fetchWithRetry('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      data: { usernames: [username] },
      headers: { 'Content-Type': 'application/json' },
    });

    const user = usersResp.data && usersResp.data.data && usersResp.data.data[0];
    if (!user) return res.status(404).json({ error: 'user not found' });

    const userId = user.id;
    const detailsResp = await fetchWithRetry(`https://users.roblox.com/v1/users/${userId}`);

    const [avatarResp, headResp] = await Promise.all([
      fetchWithRetry(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=720x720&format=png&isCircular=false`),
      fetchWithRetry(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=png&isCircular=true`),
    ]);

    const avatarUrl = avatarResp.data && avatarResp.data.data && avatarResp.data.data[0] && avatarResp.data.data[0].imageUrl;
    const headshotUrl = headResp.data && headResp.data.data && headResp.data.data[0] && headResp.data.data[0].imageUrl;

    return res.status(200).json({
      username,
      id: userId,
      displayName: detailsResp.data && detailsResp.data.displayName,
      avatarUrl: avatarUrl || null,
      headshotUrl: headshotUrl || null,
      raw: {
        userSearch: usersResp.data,
        userDetails: detailsResp.data,
        avatarThumb: avatarResp.data,
        headThumb: headResp.data,
      },
    });
  } catch (err) {
    console.error('API route error', err && err.toString());
    const status = err.response && err.response.status;
    if (status === 429) return res.status(429).json({ error: 'rate_limited' });
    return res.status(500).json({ error: 'proxy_error', detail: err.message });
  }
}
