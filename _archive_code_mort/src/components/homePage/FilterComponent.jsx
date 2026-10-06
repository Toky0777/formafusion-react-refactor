import React from "react";
import { ChevronDownIcon, ChevronUpIcon, Funnel } from "lucide-react";
import { useOthersContext } from "@/context/OthersContext";

export default function FilterComponent({
  villes,
  types,
  villeFilter,
  typeFilter,
  onFilterChange,
}) {
  const { setIsAdvancedFiltersOpen, isAdvancedFiltersOpen } =
    useOthersContext();

  // Compter les filtres actifs pour afficher un badge
  const activeFiltersCount =
    (villeFilter !== "all" ? 1 : 0) + (typeFilter !== "all" ? 1 : 0);

  return (
    <div className="">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors relative ${
            isAdvancedFiltersOpen
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <Funnel />
          <span>Filtres</span>
          {activeFiltersCount > 0 && (
            <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1">
              {activeFiltersCount}
            </span>
          )}
          {isAdvancedFiltersOpen ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
