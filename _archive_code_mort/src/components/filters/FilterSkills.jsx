import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Funnel,
  X,
} from "lucide-react";

const statusOptions = ["Tous", "En cours", "Terminé", "Cloturé"];

export default function FilterSkills({
  onStatusFilterChange,
  onDateFilterChange,
}) {
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);

    return date.toLocaleDateString("fr-FR");
  };

  const getCorrectedDate = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
  };

  const removeFilter = (type) => {
    if (type === "status") {
      setStatusFilter("Tous");
      onStatusFilterChange(null);
    } else if (type === "startDate") {
      setStartDateFilter("");
      onDateFilterChange({ startDate: null, endDate: endDateFilter || null });
    } else if (type === "endDate") {
      setEndDateFilter("");
      onDateFilterChange({ startDate: startDateFilter || null, endDate: null });
    }
    setActiveFilters(activeFilters.filter((f) => f.type !== type));
  };

  const clearAllDateFilters = () => {
    setStartDateFilter("");
    setEndDateFilter("");
    onDateFilterChange({ startDate: null, endDate: null });
    setActiveFilters(activeFilters.filter((f) => !f.type.includes("Date")));
  };

  useEffect(() => {
    if (statusFilter !== "Tous") {
      onStatusFilterChange(statusFilter);
      if (!activeFilters.some((f) => f.type === "status")) {
        setActiveFilters([
          ...activeFilters,
          { type: "status", value: statusFilter },
        ]);
      } else {
        setActiveFilters(
          activeFilters.map((f) =>
            f.type === "status" ? { ...f, value: statusFilter } : f
          )
        );
      }
    } else {
      onStatusFilterChange(null);
      setActiveFilters(activeFilters.filter((f) => f.type !== "status"));
    }
  }, [statusFilter]);

  useEffect(() => {
    const correctedStartDate = getCorrectedDate(startDateFilter);
    const correctedEndDate = getCorrectedDate(endDateFilter);

    if (startDateFilter || endDateFilter) {
      onDateFilterChange({
        startDate: correctedStartDate,
        endDate: correctedEndDate,
      });

      // Mettre à jour les filtres actifs
      const newActiveFilters = activeFilters.filter(
        (f) => !f.type.includes("Date")
      );

      if (startDateFilter) {
        newActiveFilters.push({
          type: "startDate",
          value: `Début: ${formatDisplayDate(startDateFilter)}`,
        });
      }

      if (endDateFilter) {
        newActiveFilters.push({
          type: "endDate",
          value: `Fin: ${formatDisplayDate(endDateFilter)}`,
        });
      }

      setActiveFilters(newActiveFilters);
    } else {
      onDateFilterChange({ startDate: null, endDate: null });
      setActiveFilters(activeFilters.filter((f) => !f.type.includes("Date")));
    }
  }, [startDateFilter, endDateFilter]);

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
          className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isAdvancedFiltersOpen
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <Funnel />
          <span>Filtres</span>
          {isAdvancedFiltersOpen ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </button>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <span
                key={`${filter.type}-${filter.value}`}
                className="flex items-center gap-2 bg-gray-100 border border-gray-300 px-3 py-1 rounded-full text-sm"
              >
                {filter.value}
                <button
                  onClick={() => removeFilter(filter.type)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAdvancedFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4 rounded-lg p-6">
              <div>
                <label className="block text-sm font-medium mb-2">Statut</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-5 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors cursor-pointer min-w-[70px] w-full"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status === "Tous" ? "Tous les statuts" : status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtre par date de début */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Date de début
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-5 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors cursor-pointer w-full"
                  />
                </div>
              </div>

              {/* Filtre par date de fin */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Date de fin
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-5 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors cursor-pointer w-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
