import React, { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// import { useTranslation } from "react-i18next";

export function Langue() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  // const { i18n, t } = useTranslation();
/* 
  // Fonction pour changer la langue
  const changeLanguage = (lng) => {
    // i18n.changeLanguage(lng);
    // Sauvegarder la langue dans le localStorage
    localStorage.setItem('language', lng);
    setOpen(false);
  };

  // Fonction pour obtenir le code de langue affiché
  const getCurrentLanguageCode = () => {
    // return i18n.language === 'fr' ? 'Fr' : 'En';
  };

  // Fonction pour obtenir le nom complet de la langue
  const getLanguageName = (code) => {
    // return code === 'fr' ? t('French') : t('English');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Charger la langue depuis le localStorage au montage du composant
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && savedLanguage !== i18n.language) {
      // i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 text-gray-600 transition-colors rounded-lg hover:bg-purple-50 hover:text-purple-600"
        aria-label="Changer la langue"
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm font-medium">{getCurrentLanguageCode()}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-50 w-40 mt-2 overflow-hidden bg-white border border-gray-100 shadow-xl rounded-xl"
          >
            <button
              onClick={() => changeLanguage('fr')}
              className={`flex items-center w-full px-4 py-2.5 text-sm text-left transition-colors hover:bg-purple-50 hover:text-purple-600 ${
                i18n.language === 'fr' ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-600'
              }`}
            >
              {getLanguageName('fr')}
              {i18n.language === 'fr' && (
                <span className="ml-auto text-xs">✓</span>
              )}
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={`flex items-center w-full px-4 py-2.5 text-sm text-left transition-colors hover:bg-purple-50 hover:text-purple-600 ${
                i18n.language === 'en' ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-600'
              }`}
            >
              {getLanguageName('en')}
              {i18n.language === 'en' && (
                <span className="ml-auto text-xs">✓</span>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ); */
}