const db = require('./db');

const DEEPSEEK_API = 'https://api.deepseek.com/chat/completions';

const BASE_PROMPT = `你是一个冷笑话大师。用户喝水打卡后，你要讲一个冷笑话。
要求：
- 经典冷笑话格式，要有反转或谐音梗
- 不一定跟喝水相关，什么主题都行
- 要够冷，让人一愣然后忍不住笑
- 每次不一样
- 不超过60个字`;

async function buildPrompt() {
  let prompt = BASE_PROMPT;

  try {
    const liked = await db.getRecentLikedJokes(3);
    const disliked = await db.getRecentDislikedJokes(3);

    if (liked.length > 0) {
      prompt += `\n\n以下是用户觉得好笑的，请参考这个风格：\n${liked.map(j => `- "${j}"`).join('\n')}`;
    }
    if (disliked.length > 0) {
      prompt += `\n\n以下是用户觉得不好笑的，请避免类似风格：\n${disliked.map(j => `- "${j}"`).join('\n')}`;
    }
  } catch (err) {
    console.error('Failed to load ratings for prompt:', err);
  }

  return prompt;
}

async function generateJoke() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;

  try {
    const systemPrompt = await buildPrompt();
    const res = await fetch(DEEPSEEK_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
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
  const joke = await db.getPendingJoke(userId);

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
