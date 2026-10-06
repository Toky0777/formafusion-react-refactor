import React, { useState } from "react";
import { dataMappings } from "../../utils/reservation";
import { ChevronDownIcon, ChevronUpIcon, Funnel, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function TitleReservation({
  month,
  year,
  setSelectedMonth,
  setSelectedYear,
}) {
  const [showFilters, setShowFilters] = useState(false);

  // Détermine si des filtres sont actifs
  const hasActiveFilters = month || year;

  const removeMonthFilter = () => {
    setSelectedMonth("");
  };

  const removeYearFilter = () => {
    setSelectedYear("");
  };

  return (
    <div className="mb-6">
      {/* En-tête avec titre et bouton filtres */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Réservations</h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Funnel />
            <span>Filtres</span>
            {showFilters ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Filtres actifs */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {month && (
            <span className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 border border-gray-300 rounded-full">
              {dataMappings[month]}{" "}
              <button
                onClick={removeMonthFilter}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
          {year && (
            <span className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 border border-gray-300 rounded-full">
              {year}{" "}
              <button
                onClick={removeYearFilter}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Panel des filtres */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded"
          >
            <div className="grid grid-cols-1 gap-4 p-6 my-4 rounded-lg md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Mois
                </label>
                <select
                  value={month}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-4 py-2 text-sm transition border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Toutes</option>
                  {Object.entries(dataMappings).map(([num, name]) => (
                    <option key={num} value={num}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Année
                </label>
                <select
                  value={year}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-4 py-2 text-sm transition border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Toutes</option>
                  {Array.from({ length: 3 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
