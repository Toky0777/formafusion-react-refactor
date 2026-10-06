import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { AttendanceContext } from "../../contexts/cfp/AttendanceProvider";
import { ChevronDownIcon, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import axios from "../../config/axios";

export const NavBarAttendanceTrainer = React.memo(function NavBarAccueil() {
  const {
    selected,
    setSelected,
    isAdvancedFiltersOpen,
    setIsAdvancedFiltersOpen,
  } = useContext(AttendanceContext);
  const [_, transition] = useTransition();
  const [data, setData] = useState();
  const [showMessage, setShowMessage] = useState(false);
  const betaRef = useRef(null);

  const messageRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/formateur/attendance/project/count`);
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        messageRef.current &&
        !messageRef.current.contains(event.target) &&
        !betaRef.current.contains(event.target)
      ) {
        setShowMessage(false);
      }
    }
    if (showMessage) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMessage]);

  const changeTab = (tab) => {
    transition(() => {
      setSelected(tab);
    });
  };

  return (
    <motion.div
      className="relative bg-white shadow-sm border-b border-gray-100"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Gradient de fond subtil */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-white to-purple-50/30 pointer-events-none" />

      <div className="relative px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between w-full mx-auto">
          {/* Section gauche - Logo et titre */}
          <div className="flex items-center gap-6">
            {/* Logo/Icon principal */}
            <div className="flex items-center gap-3" ref={betaRef}>
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>

              <div className="flex flex-col">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Présence
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Gestion des presences
                </p>
              </div>
            </div>
          </div>

          {/* Section centrale - Onglets avec animations */}
          <div className="flex items-center gap-3">
            {/* En cours */}
            <motion.button
              onClick={() => changeTab("En cours")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex items-center justify-between px-4 py-2.5 rounded-xl shadow-sm transition-all duration-300 font-medium text-sm min-w-[140px]
                ${
                  selected === "En cours"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:shadow-md"
                }`}
            >
              <span>En cours</span>
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`text-xs font-bold h-5 min-w-[20px] px-2 rounded-full flex items-center justify-center shadow-sm ml-2
                  ${
                    selected === "En cours"
                      ? "bg-white/90 text-blue-600"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  }`}
              >
                {data?.projet_counts?.en_cours ?? 0}
              </motion.span>
            </motion.button>

            {/* Terminé */}
            <motion.button
              onClick={() => changeTab("Terminé")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex items-center justify-between px-4 py-2.5 rounded-xl shadow-sm transition-all duration-300 font-medium text-sm min-w-[140px]
                ${
                  selected === "Terminé"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:shadow-md"
                }`}
            >
              <span>Terminé</span>
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`text-xs font-bold h-5 min-w-[20px] px-2 rounded-full flex items-center justify-center shadow-sm ml-2
                  ${
                    selected === "Terminé"
                      ? "bg-white/90 text-green-600"
                      : "bg-gradient-to-r from-green-500 to-green-600 text-white"
                  }`}
              >
                {data?.projet_counts?.termines ?? 0}
              </motion.span>
            </motion.button>

            {/* Clôturé */}
            <motion.button
              onClick={() => changeTab("Cloturé")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex items-center justify-between px-4 py-2.5 rounded-xl shadow-sm transition-all duration-300 font-medium text-sm min-w-[140px]
                ${
                  selected === "Cloturé"
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-200"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:shadow-md"
                }`}
            >
              <span>Clôturé</span>
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`text-xs font-bold h-5 min-w-[20px] px-2 rounded-full flex items-center justify-center shadow-sm ml-2
                  ${
                    selected === "Cloturé"
                      ? "bg-white/90 text-red-600"
                      : "bg-gradient-to-r from-red-600 to-red-700 text-white"
                  }`}
              >
                {data?.projet_counts?.clotures ?? 0}
              </motion.span>
            </motion.button>
          </div>

          {/* Section droite - Actions */}
          <div className="flex items-center gap-3">
            {/* Bouton filtre modernisé */}
            <motion.button
              onClick={() => setIsAdvancedFiltersOpen((prev) => !prev)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium shadow-sm
                ${
                  isAdvancedFiltersOpen
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-purple-200"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md"
                }`}
            >
              <i className="text-sm fa-solid fa-filter"></i>
              <span className="text-sm">Filtres</span>
              <motion.div
                animate={{ rotate: isAdvancedFiltersOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDownIcon className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
