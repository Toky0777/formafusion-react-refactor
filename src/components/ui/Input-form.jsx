import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import T from "../translate/AutoTranslator";
import { useLanguage } from "../../contexts/translation/LanguageContext";
import axios from "../../config/axios";

export default function InputForm({
  onChange,
  value,
  error,
  placeholder,
  type = "text",
  name,
  label,
  disabled,
  ...rest
}) {
  const [translatedPlaceholder, setTranslatedPlaceholder] =
    useState(placeholder);
  const { lang } = useLanguage();

  useEffect(() => {
    const translatePlaceholder = async () => {
      if (!placeholder || lang === "FR") {
        setTranslatedPlaceholder(placeholder);
        return;
      }

      try {
        const res = await axios.post("/translate", {
          text: placeholder,
          target_lang: lang,
        });
        const translated = res.data?.translations?.[0]?.text || placeholder;
        setTranslatedPlaceholder(translated);
      } catch (error) {
        console.error("Erreur traduction placeholder:", error);
        setTranslatedPlaceholder(placeholder);
      }
    };

    translatePlaceholder();
  }, [placeholder, lang]);

  return (
    <div>
      {label && (
        <div className="mb-2">
          <label className="text-sm font-semibold text-gray-600">
            <T>{label}</T>
          </label>
        </div>
      )}
      <input
        name={name}
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={translatedPlaceholder}
        type={type}
        className="w-full focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors focus:ring-2 border border-gray-300 bg-white p-2 rounded-lg focus:outline-none placeholder:text-sm disabled:cursor-not-allowed disabled:bg-gray-200"
        {...rest}
      />
      {error && (
        <p className="text-sm text-red-600 flex items-center mt-1">
          <AlertCircle className="h-4 w-4 mr-1" />
          <T>{error}</T>
        </p>
      )}
    </div>
  );
}
