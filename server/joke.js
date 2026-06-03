const db = require('./db');

const DEEPSEEK_API = 'https://api.deepseek.com/chat/completions';

const SYSTEM_PROMPT = `你是一个幽默段子手。用户每次喝水打卡后，你要生成一条简短有趣的段子（1-2句话）。
要求：
- 跟喝水、健康、职场摸鱼、办公室生活相关
- 风格：轻松、有梗、偶尔毒舌但不过分
- 不要重复，每次都要不一样
- 不超过50个字`;

async function generateJoke() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(DEEPSEEK_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: '来一条' },
        ],
        max_tokens: 100,
        temperature: 1.2,
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error('DeepSeek API error:', err);
    return null;
  }
}

async function getJokeForUser(userId) {
  // Get pre-generated joke
  const joke = await db.getPendingJoke(userId);

  // Async generate next one (non-blocking)
  setImmediate(async () => {
    try {
      const newJoke = await generateJoke();
      if (newJoke) {
        await db.savePendingJoke(userId, newJoke);
      }
    } catch (err) {
      console.error('Failed to pre-generate joke:', err);
    }
  });

  return joke;
}

module.exports = { generateJoke, getJokeForUser };
