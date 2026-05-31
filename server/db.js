const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway.app')
    ? { rejectUnauthorized: false }
    : false
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      uid TEXT PRIMARY KEY,
      user_name TEXT NOT NULL,
      registered_at BIGINT NOT NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS friend_relations (
      id SERIAL PRIMARY KEY,
      user_a_id TEXT NOT NULL REFERENCES users(uid),
      user_b_id TEXT NOT NULL REFERENCES users(uid),
      created_at BIGINT NOT NULL,
      UNIQUE(user_a_id, user_b_id)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS checkin_records (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(uid),
      user_name TEXT NOT NULL,
      amount INTEGER NOT NULL,
      timestamp BIGINT NOT NULL,
      tip TEXT DEFAULT ''
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_checkin_user_ts ON checkin_records(user_id, timestamp)`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(uid),
      endpoint TEXT NOT NULL UNIQUE,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      created_at BIGINT NOT NULL
    )
  `);
}

function generateShortId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function findUserByName(userName) {
  const { rows } = await pool.query('SELECT * FROM users WHERE user_name = $1', [userName]);
  return rows[0] || null;
}

async function findUserById(uid) {
  const { rows } = await pool.query('SELECT * FROM users WHERE uid = $1', [uid]);
  return rows[0] || null;
}

async function createUser(userName) {
  let uid = generateShortId();
  while (await findUserById(uid)) {
    uid = generateShortId();
  }
  const registeredAt = Date.now();
  await pool.query(
    'INSERT INTO users (uid, user_name, registered_at) VALUES ($1, $2, $3)',
    [uid, userName, registeredAt]
  );
  return { uid, user_name: userName, registered_at: registeredAt };
}

async function searchUser(query) {
  const upper = query.toUpperCase();
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE UPPER(uid) = $1 OR user_name = $2',
    [upper, query]
  );
  return rows[0] || null;
}

async function getFriendIds(uid) {
  const { rows } = await pool.query(
    'SELECT user_a_id, user_b_id FROM friend_relations WHERE user_a_id = $1 OR user_b_id = $1',
    [uid]
  );
  const ids = new Set();
  for (const r of rows) {
    if (r.user_a_id === uid) ids.add(r.user_b_id);
    else ids.add(r.user_a_id);
  }
  return [...ids];
}

async function getFriends(uid) {
  const friendIds = await getFriendIds(uid);
  if (friendIds.length === 0) return [];
  const placeholders = friendIds.map((_, i) => `$${i + 1}`).join(',');
  const { rows } = await pool.query(`SELECT * FROM users WHERE uid IN (${placeholders})`, friendIds);
  return rows;
}

async function areFriends(uidA, uidB) {
  const { rows } = await pool.query(
    `SELECT 1 FROM friend_relations
     WHERE (user_a_id = $1 AND user_b_id = $2) OR (user_a_id = $2 AND user_b_id = $1)`,
    [uidA, uidB]
  );
  return rows.length > 0;
}

async function addFriend(currentUserId, friendId) {
  await pool.query(
    'INSERT INTO friend_relations (user_a_id, user_b_id, created_at) VALUES ($1, $2, $3)',
    [currentUserId, friendId, Date.now()]
  );
}

async function removeFriend(currentUserId, friendId) {
  await pool.query(
    `DELETE FROM friend_relations
     WHERE (user_a_id = $1 AND user_b_id = $2) OR (user_a_id = $2 AND user_b_id = $1)`,
    [currentUserId, friendId]
  );
}

async function addCheckin(userId, userName, amount, tip, customTimestamp) {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
  const timestamp = customTimestamp || Date.now();
  await pool.query(
    'INSERT INTO checkin_records (id, user_id, user_name, amount, timestamp, tip) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, userId, userName, amount, timestamp, tip]
  );
  return { id, user_id: userId, user_name: userName, amount, timestamp, tip };
}

async function getRecordsSince(userIds, sinceTimestamp) {
  if (userIds.length === 0) return [];
  const placeholders = userIds.map((_, i) => `$${i + 1}`).join(',');
  const { rows } = await pool.query(
    `SELECT * FROM checkin_records
     WHERE user_id IN (${placeholders}) AND timestamp >= $${userIds.length + 1}
     ORDER BY timestamp DESC`,
    [...userIds, sinceTimestamp]
  );
  return rows;
}

async function getTodayTotal(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { rows } = await pool.query(
    'SELECT COALESCE(SUM(amount), 0) as total FROM checkin_records WHERE user_id = $1 AND timestamp >= $2',
    [userId, today.getTime()]
  );
  return parseInt(rows[0].total);
}

async function getUserRecordsInRange(userId, startTs, endTs) {
  const { rows } = await pool.query(
    `SELECT * FROM checkin_records
     WHERE user_id = $1 AND timestamp >= $2 AND timestamp <= $3
     ORDER BY timestamp DESC`,
    [userId, startTs, endTs]
  );
  return rows;
}

async function deleteCheckin(recordId, userId) {
  await pool.query('DELETE FROM checkin_records WHERE id = $1 AND user_id = $2', [recordId, userId]);
}

async function clearTodayRecords(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await pool.query(
    'DELETE FROM checkin_records WHERE user_id = $1 AND timestamp >= $2',
    [userId, today.getTime()]
  );
}

async function savePushSubscription(userId, endpoint, p256dh, auth) {
  await pool.query(
    `INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, created_at)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (endpoint) DO UPDATE SET user_id = $1, p256dh = $3, auth = $4`,
    [userId, endpoint, p256dh, auth, Date.now()]
  );
}

async function getPushSubscriptions(userIds) {
  if (userIds.length === 0) return [];
  const placeholders = userIds.map((_, i) => `$${i + 1}`).join(',');
  const { rows } = await pool.query(
    `SELECT * FROM push_subscriptions WHERE user_id IN (${placeholders})`,
    userIds
  );
  return rows;
}

async function removePushSubscription(endpoint) {
  await pool.query('DELETE FROM push_subscriptions WHERE endpoint = $1', [endpoint]);
}

module.exports = {
  pool,
  initDb,
  findUserByName,
  findUserById,
  createUser,
  searchUser,
  getFriendIds,
  getFriends,
  areFriends,
  addFriend,
  removeFriend,
  addCheckin,
  getRecordsSince,
  getTodayTotal,
  getUserRecordsInRange,
  deleteCheckin,
  clearTodayRecords,
  savePushSubscription,
  getPushSubscriptions,
  removePushSubscription,
};
