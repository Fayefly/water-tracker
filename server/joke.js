const db = require('./db');

const DEEPSEEK_API = 'https://api.deepseek.com/chat/completions';

const SYSTEM_PROMPT = `你是一个冷笑话大师。用户喝水打卡后，你要讲一个冷笑话。
要求：
- 经典冷笑话格式，要有反转或谐音梗
- 不一定跟喝水相关，什么主题都行
- 要够冷，让人一愣然后忍不住笑
- 每次不一样
- 不超过60个字
示例：
"你知道星星有多重吗？8克，因为星巴克。"
"为什么蚕宝宝很有钱？因为它会结茧（节俭）。"
"什么动物最容易摔倒？狐狸，因为它很狡猾（脚滑）。"`;

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
