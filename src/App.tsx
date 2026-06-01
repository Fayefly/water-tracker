import React, { useState, useCallback, useEffect } from "react";
import CheckInButton from "./components/CheckInButton";
import TipCard from "./components/TipCard";
import ProgressRing from "./components/ProgressRing";
import HistoryList from "./components/HistoryList";
import YesterdayEditor from "./components/YesterdayEditor";
import FriendsPanel from "./components/FriendsPanel";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { getRandomTip } from "./utils/waterTips";
import { useLanguage } from "./contexts/LanguageContext";
import { getTranslations } from "./utils/i18n";
import {
  register,
  checkin,
  getTodayTotal,
  getLast7Days,
  clearTodayRecords,
  getCurrentUser,
  setCurrentUser,
  RegisteredUser,
  DaySummary,
  CheckInRecord,
} from "./utils/api";
import { registerPushNotification } from "./utils/pushNotification";

const DAILY_GOAL = 2000;

const WATER_LEVEL_IMAGES = {
  empty: "https://oneday-react-native.oss-cn-zhangjiakou.aliyuncs.com/oneday/source/3af651ca-0fa4-469d-a458-7670db830cf7.jpg",
  oneSixth: "https://oneday-react-native.oss-cn-zhangjiakou.aliyuncs.com/oneday/source/347beafe-ffb7-4339-b429-b2079d524da1.jpg",
  oneThird: "https://oneday-react-native.oss-cn-zhangjiakou.aliyuncs.com/oneday/source/8483b423-d2ff-4a6c-bb96-e4b47667d956.jpg",
  oneHalf: "https://oneday-react-native.oss-cn-zhangjiakou.aliyuncs.com/oneday/source/55c269a1-1e98-45ca-a21b-509855a4841c.jpg",
  twoThirds: "https://oneday-react-native.oss-cn-zhangjiakou.aliyuncs.com/oneday/source/f8392636-76b8-4e3c-a537-fe09631b2b64.jpg",
  fiveSixths: "https://oneday-react-native.oss-cn-zhangjiakou.aliyuncs.com/oneday/source/bf65f14a-32de-45fa-a724-13cde6daf5e5.jpg",
  full: "https://oneday-react-native.oss-cn-zhangjiakou.aliyuncs.com/oneday/source/ce9c2b6c-b4f0-4169-92ae-1bc58c7e94a9.jpg",
  overflow: "https://oneday-react-native.oss-cn-zhangjiakou.aliyuncs.com/oneday/source/4b35e4b6-5ab1-48e9-9058-fb7cedb3a88d.jpg",
};

function getWaterLevelImage(current: number, goal: number): string {
  if (current <= 0) return WATER_LEVEL_IMAGES.empty;
  if (current >= goal) return WATER_LEVEL_IMAGES.overflow;
  const ratio = current / goal;
  if (ratio >= 5 / 6) return WATER_LEVEL_IMAGES.full;
  if (ratio >= 2 / 3) return WATER_LEVEL_IMAGES.fiveSixths;
  if (ratio >= 1 / 2) return WATER_LEVEL_IMAGES.twoThirds;
  if (ratio >= 1 / 3) return WATER_LEVEL_IMAGES.oneThird;
  if (ratio >= 1 / 6) return WATER_LEVEL_IMAGES.oneSixth;
  return WATER_LEVEL_IMAGES.oneSixth;
}

const LoginScreen: React.FC<{ onLogin: (user: RegisteredUser) => void }> = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { language } = useLanguage();
  const t = getTranslations(language);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const user = await register(name.trim());
      setCurrentUser(user);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || "注册失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f3ef] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <i className="fa-solid fa-droplet text-blue-500 text-3xl mb-3"></i>
          <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
          <p className="text-sm text-gray-400 mt-1">{t.subtitle}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={language === "zh" ? "输入你的名字" : "Enter your name"}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 text-center text-lg"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full mt-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? "..." : language === "zh" ? "开始喝水" : "Start Drinking"}
          </button>
        </form>
        <div className="mt-4 flex justify-center">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { language } = useLanguage();
  const t = getTranslations(language);
  const [user, setUser] = useState<RegisteredUser | null>(getCurrentUser());
  const [currentTip, setCurrentTip] = useState("");
  const [showTip, setShowTip] = useState(false);
  const [myTotal, setMyTotal] = useState(0);
  const [history, setHistory] = useState<DaySummary[]>([]);
  const [yesterdayRecords, setYesterdayRecords] = useState<CheckInRecord[]>([]);

  const refreshData = useCallback(async () => {
    if (!user) return;
    try {
      const [total, days] = await Promise.all([
        getTodayTotal(user.uid),
        getLast7Days(user.uid),
      ]);
      setMyTotal(total);
      setHistory(days);
      if (days.length >= 2) {
        setYesterdayRecords(days[1].records);
      }
    } catch (err) {
      console.error("Failed to refresh data:", err);
    }
  }, [user]);

  useEffect(() => {
    refreshData();
    if (user) {
      registerPushNotification(user.uid);
    }
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [refreshData, user]);

  const handleCheckIn = async (amount: number) => {
    if (!user) return;
    const tip = getRandomTip(language);
    try {
      await checkin(user.uid, user.userName, amount, tip);
      setCurrentTip(tip);
      setShowTip(true);
      await refreshData();
    } catch (err) {
      console.error("Checkin failed:", err);
    }
  };

  const handleClearToday = async () => {
    if (!user) return;
    try {
      await clearTodayRecords(user.uid);
      await refreshData();
    } catch (err) {
      console.error("Clear today failed:", err);
    }
  };

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <header className="mb-6">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-droplet text-blue-500 text-xl"></i>
            <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-sm text-gray-500">{user.userName}</span>
              <button
                onClick={() => { navigator.clipboard.writeText(user.uid); }}
                className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded hover:bg-blue-100 hover:text-blue-500 transition-colors"
                title={t.friendId + ": " + user.uid}
              >
                ID: {user.uid}
              </button>
              <LanguageSwitcher />
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-1 ml-7">{t.subtitle}</p>
        </header>

        <div className="bg-white rounded-3xl shadow-sm p-6 mb-4">
          <div className="flex items-center justify-center gap-8 mb-6">
            <ProgressRing current={myTotal} goal={DAILY_GOAL} userName="" />
            <div className="flex flex-col items-center">
              <button
                onClick={handleClearToday}
                className="mb-2 px-3 py-1 text-xs text-gray-400 border border-gray-200 rounded-lg hover:text-red-400 hover:border-red-200 transition-colors"
              >
                {t.clearToday}
              </button>
              <img
                src={getWaterLevelImage(myTotal, DAILY_GOAL)}
                alt="water"
                className="w-28 h-28 object-contain transition-all duration-500"
                style={{ mixBlendMode: "multiply" }}
              />
              <p className="mt-2 text-sm font-medium text-gray-700">{t.myDrinking}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {myTotal >= DAILY_GOAL ? (
                  <span className="text-green-600 font-medium">{t.achieved}</span>
                ) : (
                  <span><span className="font-semibold text-blue-500">{DAILY_GOAL - myTotal}ml</span> {t.needMore}</span>
                )}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <p className="text-center text-sm text-gray-500 mb-4">{t.selectAmount}</p>
            <CheckInButton onCheckIn={handleCheckIn} />
          </div>
        </div>

        <div className="mb-4">
          <TipCard tip={currentTip} visible={showTip} />
        </div>

        <div className="mb-4">
          <YesterdayEditor records={yesterdayRecords} onChanged={refreshData} />
        </div>

        <div className="mb-4">
          <FriendsPanel currentUserId={user.uid} />
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <i className="fa-solid fa-calendar-days text-gray-400"></i>
            <h2 className="text-base font-semibold text-gray-700">{t.last7Days}</h2>
          </div>
          <HistoryList days={history} goal={DAILY_GOAL} />
        </div>

        <footer className="text-center mt-8 pb-4">
          <p className="text-xs text-gray-300">{t.footer}</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
