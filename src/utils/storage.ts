export interface CheckInRecord {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: number;
  tip: string;
}

export interface RegisteredUser {
  uid: string;
  userName: string;
  registeredAt: number;
}

export interface FriendRelation {
  userAId: string;
  userBId: string;
  createdAt: number;
}

const RECORDS_KEY = "water_checkin_records";
const CURRENT_USER_KEY = "water_current_user";
const REGISTERED_USERS_KEY = "water_registered_users";
const FRIEND_RELATIONS_KEY = "water_friend_relations";

function generateShortId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let index = 0; index < 6; index++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getRegisteredUsers(): RegisteredUser[] {
  const data = localStorage.getItem(REGISTERED_USERS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users: RegisteredUser[]): void {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

export function registerOrGetUser(userName: string): RegisteredUser {
  const users = getRegisteredUsers();
  const existing = users.find((u) => u.userName === userName);
  if (existing) return existing;

  const newUser: RegisteredUser = {
    uid: generateShortId(),
    userName,
    registeredAt: Date.now(),
  };
  users.push(newUser);
  saveRegisteredUsers(users);
  return newUser;
}

export function getCurrentUserInfo(): RegisteredUser | null {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  if (!data) return null;
  try {
    const parsed = JSON.parse(data);
    if (parsed && parsed.uid && parsed.userName) {
      return parsed;
    }
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  } catch {
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
}

export function setCurrentUserInfo(user: RegisteredUser): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

function getFriendRelations(): FriendRelation[] {
  const data = localStorage.getItem(FRIEND_RELATIONS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveFriendRelations(relations: FriendRelation[]): void {
  localStorage.setItem(FRIEND_RELATIONS_KEY, JSON.stringify(relations));
}

export function getFriendIds(userId: string): string[] {
  const relations = getFriendRelations();
  const friendIds: string[] = [];
  for (const relation of relations) {
    if (relation.userAId === userId) {
      friendIds.push(relation.userBId);
    } else if (relation.userBId === userId) {
      friendIds.push(relation.userAId);
    }
  }
  return [...new Set(friendIds)];
}

export function getFriends(userId: string): RegisteredUser[] {
  const friendIds = getFriendIds(userId);
  const allUsers = getRegisteredUsers();
  return allUsers.filter((user) => friendIds.includes(user.uid));
}

export function addFriendById(currentUserId: string, friendId: string, friendName: string): boolean {
  const relations = getFriendRelations();
  const alreadyFriends = relations.some(
    (r) =>
      (r.userAId === currentUserId && r.userBId === friendId) ||
      (r.userAId === friendId && r.userBId === currentUserId)
  );
  if (alreadyFriends) return false;

  const allUsers = getRegisteredUsers();
  const friendExists = allUsers.some((u) => u.uid === friendId);
  if (!friendExists) {
    const newFriendUser: RegisteredUser = {
      uid: friendId,
      userName: friendName,
      registeredAt: Date.now(),
    };
    allUsers.push(newFriendUser);
    saveRegisteredUsers(allUsers);
  }

  relations.push({
    userAId: currentUserId,
    userBId: friendId,
    createdAt: Date.now(),
  });
  saveFriendRelations(relations);
  return true;
}

export function removeFriend(currentUserId: string, friendId: string): void {
  const relations = getFriendRelations().filter(
    (r) =>
      !(
        (r.userAId === currentUserId && r.userBId === friendId) ||
        (r.userAId === friendId && r.userBId === currentUserId)
      )
  );
  saveFriendRelations(relations);
}

export function isFriendExists(currentUserId: string, friendId: string): boolean {
  const relations = getFriendRelations();
  return relations.some(
    (r) =>
      (r.userAId === currentUserId && r.userBId === friendId) ||
      (r.userAId === friendId && r.userBId === currentUserId)
  );
}

export function getRecords(): CheckInRecord[] {
  const data = localStorage.getItem(RECORDS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function addRecord(record: CheckInRecord): void {
  const records = getRecords();
  records.unshift(record);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function getTodayRecords(userIds?: string[]): CheckInRecord[] {
  const records = getRecords();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.getTime();

  return records.filter((record) => {
    const isToday = record.timestamp >= todayStart;
    if (userIds && userIds.length > 0) {
      return isToday && userIds.includes(record.userId);
    }
    return isToday;
  });
}

export function getTodayTotal(userId: string): number {
  const todayRecords = getTodayRecords([userId]);
  return todayRecords.reduce((sum, record) => sum + record.amount, 0);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
