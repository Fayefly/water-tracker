import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { getTranslations } from "../utils/i18n";

interface TipCardProps {
  tip: string;
  visible: boolean;
}

const TipCard: React.FC<TipCardProps> = ({ tip, visible }) => {
  const { language } = useLanguage();
  const t = getTranslations(language);

  if (!visible) return null;

  return (
    <div className="bg-white rounded-3xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-3">
        <i className="fa-solid fa-lightbulb text-amber-500"></i>
        <h2 className="text-base font-semibold text-amber-600">{t.healthTip}</h2>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{tip}</p>
    </div>
  );
};

export default TipCard;
