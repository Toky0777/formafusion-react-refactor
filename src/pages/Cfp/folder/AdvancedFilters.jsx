import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";

const AdvancedFilters = ({
  isOpen,
  selectedYear,
  setSelectedYear,
  activeMonths,
  setActiveMonths,
  status,
  setStatus,
  villeFilter,
  setVilleFilter,
  entrepriseFilter,
  setEntrepriseFilter,
  years,
  months,
  statusOptions,
  getUniqueOptions,
}) => {
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "38px",
      height: "38px",
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "#a855f7" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(168,85,247,0.3)" : "none",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        borderColor: "#a855f7",
      },
      backgroundColor: "#fff",
      fontSize: "0.875rem",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#a855f7"
        : state.isFocused
          ? "rgba(168,85,247,0.1)"
          : "#fff",
      color: state.isSelected ? "#fff" : "#374151",
      fontSize: "0.875rem",
      cursor: "pointer",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "rgba(168,85,247,0.15)",
      color: "#6b21a8",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#6b21a8",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#6b21a8",
      ":hover": {
        backgroundColor: "#a855f7",
        color: "#fff",
      },
    }),
  };

  const FilterSection = ({ title, children }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{title}</label>
      {children}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="p-6 bg-gray-50 border-b border-gray-200"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="w-full">
              <FilterSection title="Année">
                <Select
                  options={years.map((year) => ({ value: year, label: year }))}
                  value={selectedYear ? { value: selectedYear, label: selectedYear } : null}
                  onChange={(option) => setSelectedYear(option ? option.value : null)}
                  placeholder="Toutes les années"
                  className="w-full text-sm"
                  classNamePrefix="react-select"
                  styles={selectStyles}
                />
              </FilterSection>
            </div>
            <div className="w-full">
              <FilterSection title="Mois">
                <Select
                  isMulti
                  options={months}
                  value={activeMonths}
                  onChange={setActiveMonths}
                  placeholder="Tous les mois"
                  className="w-full text-sm"
                  classNamePrefix="react-select"
                  styles={selectStyles}
                />
              </FilterSection>
            </div>
            <div className="w-full">
              <FilterSection title="Statut">
                <Select
                  isMulti
                  options={statusOptions}
                  value={status}
                  onChange={setStatus}
                  placeholder="Tous les statuts"
                  className="w-full text-sm"
                  classNamePrefix="react-select"
                  styles={selectStyles}
                />
              </FilterSection>
            </div>
            <div className="w-full">
              <FilterSection title="Ville">
                <Select
                  isMulti
                  options={getUniqueOptions("villes")}
                  value={villeFilter}
                  onChange={setVilleFilter}
                  placeholder="Toutes les villes"
                  className="w-full text-sm"
                  classNamePrefix="react-select"
                  styles={selectStyles}
                />
              </FilterSection>
            </div>
            <div className="w-full">
              <FilterSection title="Entreprise">
                <Select
                  isMulti
                  options={getUniqueOptions("entreprises")}
                  value={entrepriseFilter}
                  onChange={setEntrepriseFilter}
                  placeholder="Toutes les entreprises"
                  className="w-full text-sm"
                  classNamePrefix="react-select"
                  styles={selectStyles}
                />
              </FilterSection>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdvancedFilters;
