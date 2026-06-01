import React, { useState, useEffect, useCallback } from "react";
import {
  getFriends,
  addFriend,
  removeFriend,
  searchUser,
  getTodayRecords,
  RegisteredUser,
  CheckInRecord,
} from "../utils/api";
import { useLanguage } from "../contexts/LanguageContext";
import { getTranslations } from "../utils/i18n";

interface FriendsPanelProps {
  currentUserId: string;
}

const FriendsPanel: React.FC<FriendsPanelProps> = ({ currentUserId }) => {
  const { language } = useLanguage();
  const t = getTranslations(language);
  const [expanded, setExpanded] = useState(false);
  const [friends, setFriends] = useState<RegisteredUser[]>([]);
  const [friendRecords, setFriendRecords] = useState<CheckInRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<RegisteredUser | null>(null);
  const [searchError, setSearchError] = useState("");
  const [loading, setLoading] = useState(false);

  const refreshFriends = useCallback(async () => {
    try {
      const list = await getFriends(currentUserId);
      setFriends(list);
      const records = await getTodayRecords(currentUserId);
      const friendOnly = records.filter((r) => r.userId !== currentUserId);
      setFriendRecords(friendOnly);
    } catch (err) {
      console.error("Failed to load friends:", err);
    }
  }, [currentUserId]);

  useEffect(() => {
    refreshFriends();
  }, [refreshFriends]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearchError("");
    setSearchResult(null);
    try {
      const user = await searchUser(searchQuery.trim());
      if (user.uid === currentUserId) {
        setSearchError(language === "zh" ? "这是你自己" : "That's you!");
      } else {
        setSearchResult(user);
      }
    } catch (err: any) {
      setSearchError(err.message || "未找到");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (friendId: string) => {
    try {
      await addFriend(currentUserId, friendId);
      setSearchResult(null);
      setSearchQuery("");
      await refreshFriends();
    } catch (err: any) {
      setSearchError(err.message);
    }
  };

  const handleRemove = async (friendId: string) => {
    try {
      await removeFriend(currentUserId, friendId);
      await refreshFriends();
    } catch (err: any) {
      console.error("Remove friend failed:", err);
    }
  };

  const getFriendTotal = (uid: string) =>
    friendRecords.filter((r) => r.userId === uid).reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="bg-white rounded-3xl shadow-sm p-5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2"
      >
        <i className="fa-solid fa-user-group text-gray-400"></i>
        <h2 className="text-base font-semibold text-gray-700">{t.friends}</h2>
        <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          {friends.length}
        </span>
        <i
          className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        ></i>
      </button>

      {/* Always show friends' drinking status */}
      {friends.length > 0 && !expanded && (
        <div className="mt-3 space-y-1.5">
          {friends.map((friend) => {
            const total = getFriendTotal(friend.uid);
            return (
              <div key={friend.uid} className="flex items-center gap-2 px-1">
                <span className="text-sm text-gray-600">{friend.userName}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-300 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((total / 2000) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400 w-14 text-right">{total}ml</span>
              </div>
            );
          })}
        </div>
      )}

      {expanded && (
        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={t.searchPlaceholder}
              className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !searchQuery.trim()}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {t.search}
            </button>
          </div>

          {searchError && (
            <p className="text-sm text-red-400 text-center">{searchError}</p>
          )}

          {searchResult && (
            <div className="flex items-center gap-3 px-3 py-2.5 bg-blue-50 rounded-xl">
              <i className="fa-solid fa-user text-blue-400"></i>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  {searchResult.userName}
                </p>
                <p className="text-xs text-gray-400">{searchResult.uid}</p>
              </div>
              <button
                onClick={() => handleAdd(searchResult.uid)}
                className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {t.add}
              </button>
            </div>
          )}

          {friends.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-2">
              {t.noFriends}
            </p>
          ) : (
            <div className="space-y-2">
              {friends.map((friend) => {
                const total = getFriendTotal(friend.uid);
                return (
                  <div
                    key={friend.uid}
                    className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl"
                  >
                    <i className="fa-solid fa-user text-gray-400"></i>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">
                        {friend.userName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t.todayDrank} {total}ml
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(friend.uid)}
                      className="text-xs text-gray-300 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendsPanel;
