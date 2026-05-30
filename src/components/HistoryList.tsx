import React from "react";
import { DaySummary } from "../utils/api";
import { useLanguage } from "../contexts/LanguageContext";
import { getTranslations } from "../utils/i18n";

interface HistoryListProps {
  days: DaySummary[];
  goal: number;
}

function formatDateStr(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(dateStr: string, todayLabel: string, yesterdayLabel: string, weekDays: string[]): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateStr === formatDateStr(today)) return todayLabel;
  if (dateStr === formatDateStr(yesterday)) return yesterdayLabel;

  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day} ${weekDays[date.getDay()]}`;
}

const HistoryList: React.FC<HistoryListProps> = ({ days, goal }) => {
  const { language } = useLanguage();
  const t = getTranslations(language);

  return (
    <div className="divide-y divide-gray-100">
      {days.map((daySummary) => {
        const percentage = Math.min((daySummary.total / goal) * 100, 100);
        const isComplete = daySummary.total >= goal;
        return (
          <div key={daySummary.date} className="flex items-center gap-3 py-3.5">
            <div className="w-20 text-sm font-medium text-gray-600 flex-shrink-0">
              {formatDate(daySummary.date, t.today, t.yesterday, t.weekDays)}
            </div>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isComplete ? "bg-blue-500" : daySummary.total > 0 ? "bg-blue-400" : "bg-gray-200"
                }`}
                style={{ width: `${Math.max(percentage, daySummary.total > 0 ? 3 : 0)}%` }}
              ></div>
            </div>
            <div className="w-16 text-right flex-shrink-0">
              <span className="text-sm font-semibold text-gray-700">{daySummary.total}</span>
              <span className="text-xs text-gray-400">ml</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryList;
