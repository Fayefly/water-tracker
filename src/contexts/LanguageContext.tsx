import React, { createContext, useContext, useState, useCallback } from "react";
import { Language } from "../utils/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "zh",
  setLanguage: () => {},
});

export function useLanguage(): LanguageContextType {
  return useContext(LanguageContext);
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("water_app_lang");
    if (saved === "en" || saved === "my" || saved === "zh") return saved;
    return "zh";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLang(lang);
    localStorage.setItem("water_app_lang", lang);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
