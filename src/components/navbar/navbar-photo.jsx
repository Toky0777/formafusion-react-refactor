import { useContext, useEffect, useState } from "react";
import { Search, Calendar, Camera, ChevronDown } from "lucide-react"; // Ajout de ChevronDown
import { PhotoContext } from "../../contexts/Apprenants/PhotoProvider";
import { motion } from "framer-motion";
import axios from "../../config/axios";

export function NavBarPhoto() {
  const { searchTerm, setSearchTerm, date, setDate } = useContext(PhotoContext);
  const role = Number(localStorage.getItem("rle_d"));
  const [dataDate, setDataDate] = useState(null);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  const ROLE_API_URLS = {
    3: "/cfp/gallery",
    8: "/cfp/gallery",
    6: "/etp/folders",
    4: "/employes/folders",
  };

  const url = ROLE_API_URLS[role] ?? null;

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        if (!url) return;

        const res = await axios.get(url);
        const result = role === 3 || role === 8 ? res.data.data : res.data;

        setDataDate(result);

        if ((role === 3 || role === 8) && Array.isArray(result) && result.length > 0) {
          setDate(result[0].year);
        } else if (result?.folders?.length > 0) {
          setDate(result.folders[0].year);
        }
      } catch (e) {
        console.log("Erreur API:", e);
      }
    };

    fetchFolders();
  }, [url]);

  // Récupération et tri des années
  const getAvailableYears = () => {
    if (role === 3 || role === 8) {
      if (!dataDate || !Array.isArray(dataDate)) return [];
      // Supprimer les doublons et trier par ordre décroissant
      return [...new Set(dataDate.map(item => item.year))]
        .sort((a, b) => b - a);
    } else {
      if (!dataDate?.folders) return [];
      return [...new Set(dataDate.folders.map(folder => folder.year))]
        .sort((a, b) => b - a);
    }
  };

  const availableYears = getAvailableYears();

  // Gestionnaire de changement d'année
  const handleYearChange = (year) => {
    setDate(year);
    setIsYearDropdownOpen(false);
  };

  return (
    <>
      <motion.div
        className="relative bg-white border-b border-gray-100 shadow-sm"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-blue-50/30 via-white to-purple-50/30" />

        <div className="relative px-4 py-4 lg:px-6">
          <div className="flex flex-col items-start justify-between w-full gap-4 mx-auto lg:flex-row lg:items-center">
            {/* Section gauche - Logo et titre */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                    Photos
                  </h1>
                  <p className="hidden text-xs text-gray-500 sm:block">
                    Galerie des formations
                  </p>
                </div>
              </div>
            </div>

            {/* Section droite - Filtres et recherche */}
            <div className="flex flex-col items-stretch w-full gap-3 sm:flex-row sm:items-center lg:w-auto">
              {/* Liste déroulante des années */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                  className="flex items-center justify-between w-full sm:w-48 px-4 py-2.5 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-700">
                      {date ? `Année ${date}` : "Sélectionner une année"}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isYearDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown menu */}
                {isYearDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsYearDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-20 w-full py-2 mt-2 overflow-y-auto bg-white border border-gray-200 shadow-lg sm:w-48 rounded-xl max-h-60"
                    >
                      {availableYears.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-center text-gray-500">
                          Aucune année disponible
                        </div>
                      ) : (
                        availableYears.map((year) => (
                          <button
                            key={year}
                            type="button"
                            onClick={() => handleYearChange(year)}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between ${date === year ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                          >
                            <span className="font-medium">Année {year}</span>
                            {date === year && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full" />
                            )}
                          </button>
                        ))
                      )}
                    </motion.div>
                  </>
                )}
              </div>

              {/* Barre de recherche */}
              <div className="relative flex-1 sm:flex-initial">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher une formation..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}