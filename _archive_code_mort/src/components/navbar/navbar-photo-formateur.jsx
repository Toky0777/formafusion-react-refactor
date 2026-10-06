import { useEffect, useState } from "react";
import { Search, Calendar, Camera } from "lucide-react";
import { motion } from "framer-motion";
import axios from "../../config/axios";
import { API_URL } from "../../config/env";

export function NavBarPhotoFormateur({
  searchTerm,
  setSearchTerm,
  date,
  setDate,
}) {
  const [dataDate, setDataDate] = useState(null);
console.log(date)
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const url = `${API_URL}/form/gallery/folder/${date}`;
        const res = await axios.get(url, {});
        const result = res.data;

        setDataDate(result);
        console.log(result);
        if (result?.folders?.length > 0) {
          setDate(result.folders[0].year);
        }
      } catch (e) {
        console.log("Erreur API:", e);
      }
    };

    fetchFolders();
  }, [setDate]);

  // ✅ gestion du tri
  const items = dataDate?.folders?.sort((a, b) => b.year - a.year);

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
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Photos
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Galerie des formations
                </p>
              </div>
            </div>

            {/* Breadcrumb ou navigation secondaire */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <span className="text-gray-300">•</span>
              <span className="text-gray-700 font-medium">Mes photos</span>
            </div>
          </div>

          {/* Section droite - Actions */}
          <div className="flex items-center gap-4">
            {/* Barre de recherche */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher dans vos photos..."
                className="w-80 pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 hover:bg-white hover:shadow-sm"
              />
            </div>

            {/* Sélecteur d'année */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <select
                value={date || ""}
                onChange={(e) => setDate(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 hover:bg-white hover:shadow-sm cursor-pointer min-w-[120px]"
              >
                <option value="" disabled>
                  Année
                </option>
                {items?.map((item, index) => (
                  <option key={index} value={item.year} className="py-2">
                    {item.year}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
