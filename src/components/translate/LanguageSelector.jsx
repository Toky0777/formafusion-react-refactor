import { useState } from "react";
import { useLanguage } from "../../contexts/translation/LanguageContext";

const languages = [
  { code: "EN", label: "English", countryCode: "GB" },
  { code: "FR", label: "Français", countryCode: "FR" },
  { code: "DE", label: "Deutsch", countryCode: "DE" },
  { code: "ES", label: "Español", countryCode: "ES" },
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, changeLanguage } = useLanguage();

  const current = languages.find((l) => l.code === lang) || languages[0];

  const handleLanguageChange = (code) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex justify-center items-center w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        {current.label}
        <span className="ml-2">▾</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {languages.map((langItem) => (
            <div
              key={langItem.code}
              onClick={() => handleLanguageChange(langItem.code)}
              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {langItem.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
