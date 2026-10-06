import React, { useContext, useEffect, useRef, useState } from "react";
import { Users, Search } from "lucide-react";
import { motion } from "framer-motion";
import { AttendanceContext } from "../../contexts/cfp/AttendanceProvider";

export const NavBarAttendanceEmp = React.memo(function NavBarAccueil() {
  const { search, setSearch } = useContext(AttendanceContext);
  const [showMessage, setShowMessage] = useState(false);
  const betaRef = useRef(null);
  const messageRef = useRef(null);

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
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>

              <div className="flex flex-col">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Présence
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Gestion des présences
                </p>
              </div>
            </div>

            {/* Breadcrumb ou navigation secondaire */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <span className="text-gray-300">•</span>
              <span className="text-gray-700 font-medium">Mes formations</span>
            </div>
          </div>

          {/* Section droite - Actions */}
          <div className="flex items-center gap-3">
            {/* Barre de recherche (cachée sur mobile) */}
            <div className="hidden lg:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une formation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
