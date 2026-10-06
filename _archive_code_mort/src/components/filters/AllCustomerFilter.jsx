import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function AllCustomerFilter({
  villes,
  types,
  villeFilter,
  typeFilter,
  setVilleFilter,
  setTypeFilter,
}) {
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    const filters = [];
    if (villeFilter !== "all")
      filters.push({ type: "ville", value: villeFilter });
    if (typeFilter !== "all") filters.push({ type: "type", value: typeFilter });
    setActiveFilters(filters);
  }, [villeFilter, typeFilter]);

  const removeFilter = (filterType) => {
    if (filterType === "ville") {
      setVilleFilter("all");
    }
    if (filterType === "type") {
      setTypeFilter("all");
    }
  };

  const clearAllFilters = () => {
    setVilleFilter("all");
    setTypeFilter("all");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-10"
      >
        <div className="bg-gray-50 p-6">
          {/* Filtres actifs */}
          {activeFilters.length > 0 && (
            <div className="flex justify-between mb-5">
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <span
                    key={`${filter.type}-${filter.value}`}
                    className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded-full text-xs "
                  >
                    <span className="font-medium">{filter.value}</span>
                    <button
                      onClick={() => removeFilter(filter.type)}
                      className="text-gray-400 hover:text-gray-600 ml-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-purple-600 hover:text-purple-800"
                >
                  Effacer tout
                </button>
              </div>
            </div>
          )}

          {/* Contrôles de filtrage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* filtre ville */}
            <div>
              <label className="block text-sm font-medium mb-2">Ville</label>
              <select
                value={villeFilter}
                onChange={(e) => setVilleFilter(e.target.value)}
                className="w-full px-4 py-2 text-sm  border focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              >
                <option value="all">Toutes les villes</option>
                {villes
                  .filter((v) => v !== "all")
                  .map((ville) => (
                    <option key={ville} value={ville}>
                      {ville}
                    </option>
                  ))}
              </select>
            </div>

            {/* filtre type */}
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 text-sm  border focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              >
                <option value="all">Tous les types</option>
                {types
                  .filter((t) => t !== "all")
                  .map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
