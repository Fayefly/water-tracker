const express = require('express');
const path = require('path');
const db = require('./db');

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

app.post('/api/checkin', async (req, res) => {
  try {
    const { userId, userName, amount, tip, timestamp } = req.body;
    if (!userId || !amount) {
      return res.status(400).json({ error: '参数不完整' });
    }
    const record = await db.addCheckin(userId, userName || userId, amount, tip || '', timestamp);
    res.json({ record: { id: record.id, userId: record.user_id, userName: record.user_name, amount: record.amount, timestamp: record.timestamp, tip: record.tip } });
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
