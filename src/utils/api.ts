export interface CheckInRecord {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: number;
  tip: string;
}

export interface DaySummary {
  date: string;
  total: number;
  records: CheckInRecord[];
}

export interface RegisteredUser {
  uid: string;
  userName: string;
  registeredAt: number;
}

const API_BASE = "/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(API_BASE + url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "请求失败");
  return data;
}

export async function register(userName: string): Promise<RegisteredUser> {
  const data = await request<{ user: RegisteredUser }>("/register", {
    method: "POST",
    body: JSON.stringify({ userName }),
  });
  return data.user;
}

export async function searchUser(query: string): Promise<RegisteredUser> {
  const data = await request<{ user: RegisteredUser }>("/friends/search", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
  return data.user;
}

export async function getFriends(uid: string): Promise<RegisteredUser[]> {
  const data = await request<{ friends: RegisteredUser[] }>(`/friends/${uid}`);
  return data.friends;
}

export async function addFriend(
  currentUserId: string,
  friendId: string
): Promise<void> {
  await request("/friends/add", {
    method: "POST",
    body: JSON.stringify({ currentUserId, friendId }),
  });
}

export async function removeFriend(
  currentUserId: string,
  friendId: string
): Promise<void> {
  await request("/friends/remove", {
    method: "POST",
    body: JSON.stringify({ currentUserId, friendId }),
  });
}

export async function checkin(
  userId: string,
  userName: string,
  amount: number,
  tip: string
): Promise<{ record: CheckInRecord; joke: string | null }> {
  const data = await request<{ record: CheckInRecord; joke: string | null }>("/checkin", {
    method: "POST",
    body: JSON.stringify({ userId, userName, amount, tip }),
  });
  return data;
}

export async function getNewJoke(): Promise<string | null> {
  const data = await request<{ joke: string | null }>("/joke/new", {
    method: "POST",
  });
  return data.joke;
}

export async function rateJoke(
  userId: string,
  joke: string,
  rating: "like" | "dislike"
): Promise<void> {
  await request("/joke/rate", {
    method: "POST",
    body: JSON.stringify({ userId, joke, rating }),
  });
}

export async function getTodayTotal(uid: string): Promise<number> {
  const data = await request<{ total: number }>(`/today-total/${uid}`);
  return data.total;
}

export async function getTodayRecords(uid: string): Promise<CheckInRecord[]> {
  const data = await request<{ records: CheckInRecord[] }>(`/records/${uid}`);
  return data.records;
}

export async function getLast7Days(uid: string): Promise<DaySummary[]> {
  const data = await request<{ days: DaySummary[] }>(`/history/${uid}`);
  return data.days;
}

export async function checkinWithDate(
  userId: string,
  userName: string,
  amount: number,
  tip: string,
  targetDate: Date
): Promise<CheckInRecord> {
  const dayStart = new Date(targetDate);
  dayStart.setHours(0, 0, 0, 0);
  const timestamp = dayStart.getTime() + 12 * 3600000;
  const data = await request<{ record: CheckInRecord }>("/checkin", {
    method: "POST",
    body: JSON.stringify({ userId, userName, amount, tip, timestamp }),
  });
  return data.record;
}

export async function deleteRecord(
  recordId: string,
  userId: string
): Promise<void> {
  await request(`/records/${recordId}`, {
    method: "DELETE",
    body: JSON.stringify({ userId }),
  });
}

export function getYesterdayDate(): Date {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday;
}

export async function clearTodayRecords(userId: string): Promise<void> {
  await request("/clear-today", {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

const CURRENT_USER_KEY = "water_current_user";

export function getCurrentUser(): RegisteredUser | null {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    if (parsed && parsed.uid && parsed.userName) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: RegisteredUser): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

