import { useContext } from "react";
import { createContext, useState } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem("selectedLang");
    if (savedLang) return savedLang;

    const browserLang = navigator.language.split("-")[0].toUpperCase();
    return ["EN", "FR", "DE", "ES"].includes(browserLang) ? browserLang : "EN";
  });

  const changeLanguage = (code) => {
    setLang(code);
    localStorage.setItem("selectedLang", code);
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("Erreur");
  }

  return context;
};
