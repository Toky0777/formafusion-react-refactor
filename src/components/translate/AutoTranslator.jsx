import { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/translation/LanguageContext";
import axios from "../../config/axios";

let cache = {};

// Buffer global pour regrouper les traductions
let translationQueue = [];
let queueTimer = null;

export default function T({ children, className = "", asText = false }) {
  const [translatedText, setTranslatedText] = useState(children);
  const { lang } = useLanguage();

  useEffect(() => {
    if (!children || lang === "FR") {
      setTranslatedText(children);
      return;
    }

    const cacheKey = `${lang}:${children}`;

    if (cache[cacheKey]) {
      setTranslatedText(cache[cacheKey]);
      return;
    }

    translationQueue.push({ text: children, setTranslatedText, cacheKey });

    if (!queueTimer) {
      queueTimer = setTimeout(async () => {
        const items = [...translationQueue];
        translationQueue = [];
        queueTimer = null;

        const textsToTranslate = items.map((i) => i.text);

        try {
          const response = await axios.post("/translate", {
            text: textsToTranslate,
            target_lang: lang,
          });

          const translations = response.data?.translations || [];

          items.forEach((item, index) => {
            const translated = translations[index]?.text || item.text;
            item.setTranslatedText(translated);
            cache[item.cacheKey] = translated;
          });
        } catch (error) {
          console.error("Erreur de traduction:", error);
          items.forEach((item) => item.setTranslatedText(item.text));
        }
      }, 200);
    }
  }, [children, lang]);

  return asText ? (
    translatedText
  ) : (
    <span className={className}>{translatedText}</span>
  );
}
