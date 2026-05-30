import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Language } from "../utils/i18n";

const languageOptions: { value: Language; label: string }[] = [
  { value: "zh", label: "中文" },
  { value: "en", label: "EN" },
  { value: "my", label: "မြန်မာ" },
];

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentOption = languageOptions.find((opt) => opt.value === language);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm text-gray-600"
      >
        <i className="fa-solid fa-globe text-blue-400"></i>
        <span>{currentOption?.label}</span>
        <i className={`fa-solid fa-chevron-down text-xs text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}></i>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 min-w-[120px]">
          {languageOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setLanguage(opt.value); setOpen(false); }}
              className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-blue-50 transition-colors ${
                language === opt.value ? "text-blue-500 bg-blue-50 font-medium" : "text-gray-600"
              }`}
            >
              <span>{opt.label}</span>
              {language === opt.value && <i className="fa-solid fa-check text-xs ml-auto"></i>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
