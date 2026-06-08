const db = require('./db');

const HITOKOTO_API = 'https://v1.hitokoto.cn/?encode=json&max_length=50';

async function fetchHitokoto() {
  try {
    const res = await fetch(HITOKOTO_API);
    const data = await res.json();
    const source = data.from_who ? `——${data.from_who}「${data.from}」` : (data.from ? `——「${data.from}」` : '');
    return `${data.hitokoto} ${source}`;
  } catch (err) {
    console.error('Hitokoto API error:', err);
    return null;
  }
}

async function getJokeForUser(userId) {
  const cached = await db.getPendingJoke(userId);

  setImmediate(async () => {
    try {
      const next = await fetchHitokoto();
      if (next) {
        await db.savePendingJoke(userId, next);
      }
    } catch (err) {
      console.error('Failed to pre-fetch hitokoto:', err);
    }
  });

  return cached;
}

module.exports = { fetchHitokoto, getJokeForUser };
