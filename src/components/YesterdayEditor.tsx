import React, { useState } from "react";
import { CheckInRecord, checkinWithDate, deleteRecord, getYesterdayDate, getCurrentUser } from "../utils/api";
import { getRandomTip } from "../utils/waterTips";
import { useLanguage } from "../contexts/LanguageContext";
import { getTranslations } from "../utils/i18n";

interface YesterdayEditorProps {
  records: CheckInRecord[];
  onChanged: () => void;
}

const YesterdayEditor: React.FC<YesterdayEditorProps> = ({ records, onChanged }) => {
  const { language } = useLanguage();
  const t = getTranslations(language);
  const [expanded, setExpanded] = useState(false);
  const yesterdayTotal = records.reduce((sum, r) => sum + r.amount, 0);

  const waterAmounts = [
    { label: t.smallCup, amount: 350, icon: "fa-glass-water" },
    { label: t.mediumCup, amount: 750, icon: "fa-bottle-water" },
    { label: t.largeCup, amount: 1500, icon: "fa-bottle-droplet" },
  ];

  const handleAdd = async (amount: number) => {
    const user = getCurrentUser();
    if (!user) return;
    const tip = getRandomTip(language);
    try {
      await checkinWithDate(user.uid, user.userName, amount, tip, getYesterdayDate());
      onChanged();
    } catch (err) {
      console.error("Add yesterday record failed:", err);
    }
  };

  const handleDelete = async (recordId: string) => {
    const user = getCurrentUser();
    if (!user) return;
    try {
      await deleteRecord(recordId, user.uid);
      onChanged();
    } catch (err) {
      console.error("Delete record failed:", err);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm p-5">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-2">
        <i className="fa-solid fa-pen-to-square text-gray-400"></i>
        <h2 className="text-base font-semibold text-gray-700">{t.yesterdayMakeup}</h2>
        <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{yesterdayTotal}ml</span>
        <i className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}></i>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          <div className="flex gap-3 justify-center">
            {waterAmounts.map((item) => (
              <button
                key={item.amount}
                onClick={() => handleAdd(item.amount)}
                className="flex flex-col items-center gap-1.5 w-20 py-3 rounded-xl border border-gray-200 bg-gray-50 hover:border-blue-200 hover:bg-white hover:shadow-sm transition-all active:scale-95"
              >
                <i className={`fa-solid ${item.icon} text-lg text-blue-400`}></i>
                <span className="text-xs text-gray-600">{item.label}</span>
                <span className="text-[10px] text-gray-400">{item.amount}ml</span>
              </button>
            ))}
          </div>

          {records.length > 0 && (
            <div className="space-y-1.5">
              {records.map((record) => (
                <div key={record.id} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-700 flex-1">{record.amount}ml</span>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-xs text-gray-300 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default YesterdayEditor;
