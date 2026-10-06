import React, { useEffect, useState } from "react";
import { useTranslation } from "../../contexts/translation/TranslationContext";

export default function TranslatedText({ children, className = "" }) {
  const [translatedText, setTranslatedText] = useState(children);
  const { translate, lang } = useTranslation();

  useEffect(() => {
    const updateTranslation = async () => {
      if (children) {
        const result = await translate(children);
        setTranslatedText(result);
      }
    };
    updateTranslation();
  }, [children, lang, translate]);

  return <span className={className}>{translatedText}</span>;
}
