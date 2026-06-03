const express = require('express');
const path = require('path');
const webpush = require('web-push');
const db = require('./db');
const { getJokeForUser } = require('./joke');

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:water@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

app.post('/api/register', async (req, res) => {
  try {
    const { userName } = req.body;
    if (!userName || !userName.trim()) {
      return res.status(400).json({ error: '用户名不能为空' });
    }
    const trimmed = userName.trim();
    const existing = await db.findUserByName(trimmed);
    if (existing) {
      return res.json({ user: { uid: existing.uid, userName: existing.user_name, registeredAt: existing.registered_at } });
    }
    const newUser = await db.createUser(trimmed);
    res.json({ user: { uid: newUser.uid, userName: newUser.user_name, registeredAt: newUser.registered_at } });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/user/:uid', async (req, res) => {
  try {
    const user = await db.findUserById(req.params.uid);
    if (!user) return res.status(404).json({ error: '用户不存在' });
    res.json({ user: { uid: user.uid, userName: user.user_name, registeredAt: user.registered_at } });
  } catch (err) {
    console.error('get user error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/friends/search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ error: '请输入ID或用户名' });
    }
    const user = await db.searchUser(query.trim());
    if (!user) return res.status(404).json({ error: '未找到该用户' });
    res.json({ user: { uid: user.uid, userName: user.user_name, registeredAt: user.registered_at } });
  } catch (err) {
    console.error('search error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/friends/add', async (req, res) => {
  try {
    const { currentUserId, friendId } = req.body;
    if (!currentUserId || !friendId) {
      return res.status(400).json({ error: '参数不完整' });
    }
    if (currentUserId === friendId) {
      return res.status(400).json({ error: '不能添加自己' });
    }
    const friendUser = await db.findUserById(friendId);
    if (!friendUser) return res.status(404).json({ error: '好友不存在' });
    const already = await db.areFriends(currentUserId, friendId);
    if (already) return res.status(400).json({ error: '已经是好友了' });
    await db.addFriend(currentUserId, friendId);
    res.json({ success: true });
  } catch (err) {
    console.error('add friend error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/friends/:uid', async (req, res) => {
  try {
    const friends = await db.getFriends(req.params.uid);
    res.json({ friends: friends.map(f => ({ uid: f.uid, userName: f.user_name, registeredAt: f.registered_at })) });
  } catch (err) {
    console.error('get friends error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/friends/remove', async (req, res) => {
  try {
    const { currentUserId, friendId } = req.body;
    await db.removeFriend(currentUserId, friendId);
    res.json({ success: true });
  } catch (err) {
    console.error('remove friend error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/push/vapid-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY || '' });
});

app.post('/api/push/subscribe', async (req, res) => {
  try {
    const { userId, subscription } = req.body;
    if (!userId || !subscription || !subscription.endpoint) {
      return res.status(400).json({ error: '参数不完整' });
    }
    const keys = subscription.keys || {};
    if (!keys.p256dh || !keys.auth) {
      return res.status(400).json({ error: '订阅信息不完整' });
    }
    await db.savePushSubscription(userId, subscription.endpoint, keys.p256dh, keys.auth);
    res.json({ success: true });
  } catch (err) {
    console.error('push subscribe error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/joke/new', async (req, res) => {
  try {
    const { generateJoke } = require('./joke');
    const joke = await generateJoke();
    res.json({ joke: joke || null });
  } catch (err) {
    console.error('new joke error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/joke/rate', async (req, res) => {
  try {
    const { userId, joke, rating } = req.body;
    if (!userId || !joke || !['like', 'dislike'].includes(rating)) {
      return res.status(400).json({ error: '参数不完整' });
    }
    await db.saveJokeRating(userId, joke, rating);
    res.json({ success: true });
  } catch (err) {
    console.error('joke rate error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/checkin', async (req, res) => {
  try {
    const { userId, userName, amount, tip, timestamp } = req.body;
    if (!userId || !amount) {
      return res.status(400).json({ error: '参数不完整' });
    }
    const isBackfill = !!timestamp;
    const record = await db.addCheckin(userId, userName || userId, amount, tip || '', timestamp);
    const joke = isBackfill ? null : await getJokeForUser(userId);
    res.json({ record: { id: record.id, userId: record.user_id, userName: record.user_name, amount: record.amount, timestamp: record.timestamp, tip: record.tip }, joke });

    // Push notification to friends (non-blocking, skip for backfill)
    if (process.env.VAPID_PUBLIC_KEY && !isBackfill) {
      setImmediate(async () => {
        try {
          const friendIds = await db.getFriendIds(userId);
          if (friendIds.length === 0) return;
          const subs = await db.getPushSubscriptions(friendIds);
          const payload = JSON.stringify({
            title: '💧 喝水提醒',
            body: `你的好友${userName || userId}喝水了，提醒你也喝水～`,
          });
          for (const sub of subs) {
            const pushSub = {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            };
            webpush.sendNotification(pushSub, payload).catch(err => {
              if (err.statusCode === 410 || err.statusCode === 404) {
                db.removePushSubscription(sub.endpoint);
              }
            });
          }
        } catch (err) {
          console.error('push notify error:', err);
        }
      });
    }
  } catch (err) {
    console.error('checkin error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/records/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;
    const friendIds = await db.getFriendIds(uid);
    const visibleIds = [uid, ...friendIds];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const records = await db.getRecordsSince(visibleIds, today.getTime());
    res.json({
      records: records.map(r => ({
        id: r.id, userId: r.user_id, userName: r.user_name,
        amount: r.amount, timestamp: r.timestamp, tip: r.tip
      }))
    });
  } catch (err) {
    console.error('get records error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/today-total/:uid', async (req, res) => {
  try {
    const total = await db.getTodayTotal(req.params.uid);
    res.json({ total });
  } catch (err) {
    console.error('today total error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/history/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;
    const allRecords = await db.getUserRecordsLast7Days(uid);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      const records = allRecords.filter(r => r.timestamp >= dayStart.getTime() && r.timestamp <= dayEnd.getTime());
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      days.push({
        date: dateStr,
        total: records.reduce((sum, r) => sum + r.amount, 0),
        records: records.map(r => ({
          id: r.id, userId: r.user_id, userName: r.user_name,
          amount: r.amount, timestamp: r.timestamp, tip: r.tip
        }))
      });
    }
    res.json({ days });
  } catch (err) {
    console.error('history error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.delete('/api/records/:id', async (req, res) => {
  try {
    const { userId } = req.body;
    await db.deleteCheckin(req.params.id, userId);
    res.json({ success: true });
  } catch (err) {
    console.error('delete record error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/clear-today', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: '缺少 userId' });
    await db.clearTodayRecords(userId);
    res.json({ success: true });
  } catch (err) {
    console.error('clear today error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

async function start() {
  await db.initDb();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
