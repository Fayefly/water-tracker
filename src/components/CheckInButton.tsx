import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { getTranslations } from "../utils/i18n";

interface CheckInButtonProps {
  onCheckIn: (amount: number) => void;
}

const CheckInButton: React.FC<CheckInButtonProps> = ({ onCheckIn }) => {
  const { language } = useLanguage();
  const t = getTranslations(language);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const fixedAmounts = [
    { label: t.smallCup, amount: 350, icon: "fa-glass-water" },
    { label: t.mediumCup, amount: 750, icon: "fa-bottle-water" },
  ];

  const handleCheckIn = (amount: number) => {
    if (isAnimating) return;
    setSelectedAmount(amount);
    setIsAnimating(true);
    onCheckIn(amount);
    setTimeout(() => {
      setIsAnimating(false);
      setSelectedAmount(null);
    }, 600);
  };

  const handleCustomSubmit = () => {
    const value = parseInt(customValue, 10);
    if (value > 0) {
      handleCheckIn(value * 100);
      setShowCustomModal(false);
      setCustomValue("");
    }
  };

  return (
    <>
      <div className="flex justify-center gap-4">
        {fixedAmounts.map((item) => (
          <button
            key={item.amount}
            onClick={() => handleCheckIn(item.amount)}
            className={`flex flex-col items-center gap-2 w-24 py-4 rounded-2xl border transition-all duration-300 hover:shadow-md active:scale-95 ${
              selectedAmount === item.amount && isAnimating
                ? "border-blue-400 bg-blue-50 shadow-lg scale-105"
                : "border-gray-200 bg-gray-50 hover:border-blue-200 hover:bg-white"
            }`}
          >
            <i
              className={`fa-solid ${item.icon} text-2xl ${
                selectedAmount === item.amount && isAnimating
                  ? "text-blue-500 animate-bounce"
                  : "text-blue-400"
              }`}
            ></i>
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
            <span className="text-xs text-gray-400">{item.amount}ml</span>
          </button>
        ))}
        <button
          onClick={() => setShowCustomModal(true)}
          className="flex flex-col items-center gap-2 w-24 py-4 rounded-2xl border transition-all duration-300 hover:shadow-md active:scale-95 border-gray-200 bg-gray-50 hover:border-blue-200 hover:bg-white"
        >
          <i className="fa-solid fa-pen text-2xl text-blue-400"></i>
          <span className="text-sm font-medium text-gray-700">{t.custom}</span>
          <span className="text-xs text-gray-400">100ml</span>
        </button>
      </div>

      {showCustomModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowCustomModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-72 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.customTitle}</h3>
            <div className="flex items-center justify-center gap-3 mb-4">
              <input
                type="text"
                inputMode="numeric"
                value={customValue}
                maxLength={3}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setCustomValue(val);
                }}
                placeholder={t.enterNumber}
                className="w-28 px-3 py-2.5 border border-gray-200 rounded-xl text-center text-base focus:outline-none focus:border-blue-400 transition-colors"
                autoFocus
              />
              <span className="text-gray-500 text-sm shrink-0">{t.multiplier}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowCustomModal(false); setCustomValue(""); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleCustomSubmit}
                disabled={!customValue || parseInt(customValue, 10) <= 0}
                className="flex-1 py-2.5 rounded-xl bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckInButton;
