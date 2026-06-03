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

app.get('/api/push/debug/:uid', async (req, res) => {
  try {
    const subs = await db.getPushSubscriptions([req.params.uid]);
    res.json({ count: subs.length, subscriptions: subs.map(s => ({ user_id: s.user_id, endpoint: s.endpoint.slice(0, 50) + '...' })) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/push/test/:uid', async (req, res) => {
  try {
    const subs = await db.getPushSubscriptions([req.params.uid]);
    if (subs.length === 0) return res.json({ error: 'No subscriptions found', count: 0 });
    const payload = JSON.stringify({ title: '💧 测试通知', body: '如果你看到这条，说明推送正常工作！' });
    const results = [];
    for (const sub of subs) {
      try {
        await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload);
        results.push({ endpoint: sub.endpoint.slice(0, 50), status: 'sent' });
      } catch (err) {
        results.push({ endpoint: sub.endpoint.slice(0, 50), status: 'failed', error: err.message });
      }
    }
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/push/subscribe', async (req, res) => {
  try {
    const { userId, subscription } = req.body;
    if (!userId || !subscription || !subscription.endpoint) {
      return res.status(400).json({ error: '参数不完整' });
    }
    const keys = subscription.keys || {};
    await db.savePushSubscription(userId, subscription.endpoint, keys.p256dh || '', keys.auth || '');
    res.json({ success: true });
  } catch (err) {
    console.error('push subscribe error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/checkin', async (req, res) => {
  try {
    const { userId, userName, amount, tip, timestamp } = req.body;
    if (!userId || !amount) {
      return res.status(400).json({ error: '参数不完整' });
    }
    const record = await db.addCheckin(userId, userName || userId, amount, tip || '', timestamp);
    const joke = await getJokeForUser(userId);
    res.json({ record: { id: record.id, userId: record.user_id, userName: record.user_name, amount: record.amount, timestamp: record.timestamp, tip: record.tip }, joke });

    // Push notification to friends (non-blocking)
    if (process.env.VAPID_PUBLIC_KEY) {
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
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      const records = await db.getUserRecordsInRange(uid, dayStart.getTime(), dayEnd.getTime());
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
