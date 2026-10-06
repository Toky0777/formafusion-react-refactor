import { useState } from "react";
import { X, Filter } from "lucide-react";

export function FilterResults({
  filters,
  onFilterChange,
  onReset,
  levels,
  campaigns,
}) {
  const [showFilters, setShowFilters] = useState(false);

  const handleInputChange = (filterName, value) => {
    onFilterChange(filterName, value);
  };

  const handleReset = () => {
    onReset();
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");
  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== ""
  ).length;

  // Mock data pour la démonstration
  const mockFilters = {
    name: "",
    etp: "",
    qcm: "",
    date: "",
    pointsMin: "",
    pointsMax: "",
    level: "",
    campaign: "",
  };

  const mockLevels = ["Débutant", "Intermédiaire", "Avancé", "Expert"];
  const mockCampaigns = ["Formation 2024", "Certification Web", "Bootcamp Dev"];

  const finalFilters = filters || mockFilters;
  const finalLevels = levels || mockLevels;
  const finalCampaigns = campaigns || mockCampaigns;

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-3xl  overflow-hidden">
      {/* Header avec style parent */}
      <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Filtres
            </h2>
            {hasActiveFilters && (
              <span className="px-4 py-2 text-sm font-semibold text-blue-800 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full shadow-md">
                {activeFiltersCount} filtre{activeFiltersCount > 1 ? "s" : ""}{" "}
                actif{activeFiltersCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="group inline-flex items-center px-6 py-3 font-medium text-red-600 transition-all duration-300 border-2 border-red-300 rounded-2xl hover:border-red-500 hover:bg-red-100 hover:scale-105 transform shadow-lg"
              >
                <X className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Tout effacer
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="group inline-flex items-center px-6 py-3 font-medium text-gray-700 transition-all duration-300 border-2 border-gray-300 rounded-2xl hover:border-gray-500 hover:bg-gray-100 hover:scale-105 transform shadow-lg"
            >
              <Filter
                className={`w-5 h-5 mr-2 transition-transform duration-300 ${
                  showFilters ? "rotate-180" : ""
                } group-hover:scale-110`}
              />
              {showFilters ? "Masquer" : "Afficher"}
            </button>
          </div>
        </div>
      </div>

      {/* Contenu des filtres */}
      <div className="p-8">
        {showFilters && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {/* Filtre Nom */}
            <div className="group relative">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Nom/Prénom
              </label>
              <input
                type="text"
                value={finalFilters.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full h-12 px-4 transition-all duration-300 border-2 border-gray-200 rounded-2xl shadow-md focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:shadow-xl hover:shadow-lg bg-white/50 backdrop-blur-sm group-hover:border-gray-300"
                placeholder="Rechercher un apprenant"
              />
            </div>

            {/* Filtre Entreprise */}
            <div className="group relative">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Entreprise
              </label>
              <input
                type="text"
                value={finalFilters.etp}
                onChange={(e) => handleInputChange("etp", e.target.value)}
                className="w-full h-12 px-4 transition-all duration-300 border-2 border-gray-200 rounded-2xl shadow-md focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 focus:shadow-xl hover:shadow-lg bg-white/50 backdrop-blur-sm group-hover:border-gray-300"
                placeholder="Entreprise"
              />
            </div>

            {/* Filtre QCM */}
            <div className="group relative">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                QCM
              </label>
              <input
                type="text"
                value={finalFilters.qcm}
                onChange={(e) => handleInputChange("qcm", e.target.value)}
                className="w-full h-12 px-4 transition-all duration-300 border-2 border-gray-200 rounded-2xl shadow-md focus:border-purple-400 focus:ring-4 focus:ring-purple-100 focus:shadow-xl hover:shadow-lg bg-white/50 backdrop-blur-sm group-hover:border-gray-300"
                placeholder="Nom du QCM"
              />
            </div>

            {/* Filtre Date */}
            <div className="group relative">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={finalFilters.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="w-full h-12 px-4 transition-all duration-300 border-2 border-gray-200 rounded-2xl shadow-md focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:shadow-xl hover:shadow-lg bg-white/50 backdrop-blur-sm group-hover:border-gray-300"
              />
            </div>

            {/* Filtres Points */}
            <div className="group space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Points Min/Max
              </label>
              <div className="flex space-x-3">
                <input
                  type="number"
                  value={finalFilters.pointsMin}
                  onChange={(e) =>
                    handleInputChange("pointsMin", e.target.value)
                  }
                  className="w-1/2 h-12 px-3 transition-all duration-300 border-2 border-gray-200 rounded-2xl shadow-md focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:shadow-xl hover:shadow-lg bg-white/50 backdrop-blur-sm group-hover:border-gray-300"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={finalFilters.pointsMax}
                  onChange={(e) =>
                    handleInputChange("pointsMax", e.target.value)
                  }
                  className="w-1/2 h-12 px-3 transition-all duration-300 border-2 border-gray-200 rounded-2xl shadow-md focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:shadow-xl hover:shadow-lg bg-white/50 backdrop-blur-sm group-hover:border-gray-300"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Filtre Niveau */}
            <div className="group">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Niveau
              </label>
              <select
                value={finalFilters.level}
                onChange={(e) => handleInputChange("level", e.target.value)}
                className="w-full h-12 px-4 transition-all duration-300 border-2 border-gray-200 rounded-2xl shadow-md focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:shadow-xl hover:shadow-lg bg-white/50 backdrop-blur-sm group-hover:border-gray-300 cursor-pointer"
              >
                <option value="">Tous les niveaux</option>
                {finalLevels.map((level, index) => (
                  <option key={index} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre Campagne */}
            <div className="group">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Campagne
              </label>
              <select
                value={finalFilters.campaign}
                onChange={(e) => handleInputChange("campaign", e.target.value)}
                className="w-full h-12 px-4 transition-all duration-300 border-2 border-gray-200 rounded-2xl shadow-md focus:border-teal-400 focus:ring-4 focus:ring-teal-100 focus:shadow-xl hover:shadow-lg bg-white/50 backdrop-blur-sm group-hover:border-gray-300 cursor-pointer"
              >
                <option value="">Toutes les campagnes</option>
                {finalCampaigns.map((campaign, index) => (
                  <option key={index} value={campaign}>
                    {campaign}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Indicateurs de filtres actifs */}
        {hasActiveFilters && (
          <div className="p-6 mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-2xl shadow-lg">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-bold text-blue-800">
                Filtres actifs :
              </span>
              {finalFilters.name && (
                <span className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-800 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
                  Nom: {finalFilters.name}
                  <button
                    onClick={() => handleInputChange("name", "")}
                    className="w-5 h-5 flex items-center justify-center bg-blue-200 rounded-full hover:bg-red-200 transition-colors duration-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {finalFilters.etp && (
                <span className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-emerald-800 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
                  Entreprise: {finalFilters.etp}
                  <button
                    onClick={() => handleInputChange("etp", "")}
                    className="w-5 h-5 flex items-center justify-center bg-emerald-200 rounded-full hover:bg-red-200 transition-colors duration-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {finalFilters.qcm && (
                <span className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-800 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
                  QCM: {finalFilters.qcm}
                  <button
                    onClick={() => handleInputChange("qcm", "")}
                    className="w-5 h-5 flex items-center justify-center bg-purple-200 rounded-full hover:bg-red-200 transition-colors duration-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {finalFilters.date && (
                <span className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-orange-800 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
                  Date: {finalFilters.date}
                  <button
                    onClick={() => handleInputChange("date", "")}
                    className="w-5 h-5 flex items-center justify-center bg-orange-200 rounded-full hover:bg-red-200 transition-colors duration-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(finalFilters.pointsMin || finalFilters.pointsMax) && (
                <span className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-800 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
                  Points: {finalFilters.pointsMin || "0"} -{" "}
                  {finalFilters.pointsMax || "∞"}
                  <button
                    onClick={() => {
                      handleInputChange("pointsMin", "");
                      handleInputChange("pointsMax", "");
                    }}
                    className="w-5 h-5 flex items-center justify-center bg-indigo-200 rounded-full hover:bg-red-200 transition-colors duration-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {finalFilters.level && (
                <span className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-pink-800 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
                  Niveau: {finalFilters.level}
                  <button
                    onClick={() => handleInputChange("level", "")}
                    className="w-5 h-5 flex items-center justify-center bg-pink-200 rounded-full hover:bg-red-200 transition-colors duration-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {finalFilters.campaign && (
                <span className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-teal-800 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
                  Campagne: {finalFilters.campaign}
                  <button
                    onClick={() => handleInputChange("campaign", "")}
                    className="w-5 h-5 flex items-center justify-center bg-teal-200 rounded-full hover:bg-red-200 transition-colors duration-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
