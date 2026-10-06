import { createContext, useContext, useEffect, useState } from "react";
import axios from "../../config/axios";
import { useLanguage } from "./LanguageContext";

const TranslationContext = createContext();
const LOCAL_CACHE_KEY = "translationCache";

export const TranslationProvider = ({ children }) => {
  const { lang } = useLanguage();
  const [translations, setTranslations] = useState({});
  const [version, setVersion] = useState(0); // 🔹 force le rerender global

  // Charger le cache
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_CACHE_KEY);
    if (saved) setTranslations(JSON.parse(saved));
  }, []);

  // Sauvegarder le cache
  useEffect(() => {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(translations));
  }, [translations]);

  // 🔹 Fonction de traduction
  const translate = async (text) => {
    if (!text || lang === "FR") return text;

    const key = `${lang}:${text}`;
    if (translations[key]) return translations[key];

    try {
      const res = await axios.post("/translate", {
        text,
        target_lang: lang,
      });
      const translated = res.data?.translations?.[0]?.text || text;
      setTranslations((prev) => ({ ...prev, [key]: translated }));
      return translated;
    } catch {
      return text;
    }
  };

  // 🔹 Quand la langue change, on force tous les T à se mettre à jour
  useEffect(() => {
    setVersion((v) => v + 1); // nouvelle version = nouvelle langue
  }, [lang]);

  return (
    <TranslationContext.Provider
      value={{ translate, translations, lang, version }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
