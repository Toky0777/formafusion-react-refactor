import { useState, useRef, useEffect } from "react";
import { FaSearch, FaTimes, FaSpinner } from "react-icons/fa";
import { useModal } from "../../contexts/cfp/ModalContext";
import { Link } from "react-router-dom";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import AddApprenantDrawer from "../../pages/Etp/learner/Liste/AddApprenantDrawer";
import { useFilter } from "../../contexts/etp/FilterContext";
import FilterSection from "../../layouts/etp/FilterSection";

function NavbarLearnerEtp({ onEmployeeAdded, idEtp }) {
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const { openModal } = useModal();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    resetFilters,
    showFilters,
    toggleFiltersVisibility,
    filters,
    applyFilters,
    isSearching,
  } = useFilter();

  const searchRef = useRef(null);

  useEffect(() => {
    setLocalSearchQuery(searchTerm || "");
  }, [searchTerm]);

  // Synchroniser les états locaux avec le contexte
  const infoStatusFilter = filters.infoStatus || "all";
  const activeStatusFilter = filters.activeStatus || "all";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setLocalSearchQuery(value);
    setSearchTerm(value); // Appel avec debounce
  };

  const clearSearchInput = () => {
    setLocalSearchQuery("");
    setSearchTerm("");
  };

  const toggleFilterVisibility = () => {
    toggleFiltersVisibility();
  };

  const handleSearchFocus = () => setIsSearchFocused(true);
  const handleSearchBlur = () => setIsSearchFocused(false);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.target.blur();
    }
  };

  const handleOpenAddDrawer = () => setIsAddDrawerOpen(true);
  const handleCloseAddDrawer = () => setIsAddDrawerOpen(false);

  const handleEmployeeAdded = () => {
    if (onEmployeeAdded) onEmployeeAdded();
    handleCloseAddDrawer();
  };

  const handleResetAll = () => {
    resetFilters();
    setLocalSearchQuery("");
  };

  return (
    <>
      <div className="flex flex-col w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center h-16 px-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Link
                to="#"
                className="text-2xl font-bold text-gray-500 hover:text-purple-600 transition-colors"
              >
                EMPLOYES
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div
                ref={searchRef}
                className={`relative flex items-center transition-all duration-300 ${
                  isSearchFocused || localSearchQuery ? "w-80" : "w-64"
                }`}
              >
                <div
                  className={`relative w-full overflow-hidden rounded-lg border-2 transition-colors ${
                    isSearchFocused
                      ? "border-purple-500 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="text"
                    placeholder="Recherche des employés..."
                    value={localSearchQuery}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    onKeyPress={handleKeyPress}
                    className="w-full p-3 pr-10 bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-gray-400"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {isSearching ? (
                      <FaSpinner className="animate-spin text-gray-400" />
                    ) : localSearchQuery ? (
                      <button
                        onClick={clearSearchInput}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <FaTimes className="text-sm" />
                      </button>
                    ) : (
                      <FaSearch className="text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenAddDrawer}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                  title="Ajouter un nouvel employé"
                >
                  <i className="fa-solid fa-user-plus text-sm" />
                  <span className="hidden md:inline font-medium">Nouveau</span>
                  <span className="md:hidden font-medium">+</span>
                </button>

                <div className="relative">
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      showFilters
                        ? "bg-purple-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                    onClick={toggleFilterVisibility}
                    title={
                      showFilters
                        ? "Masquer les filtres"
                        : "Afficher les filtres"
                    }
                  >
                    <i className="fa-solid fa-filter text-sm" />
                    <span className="hidden sm:inline font-medium">
                      Filtres
                    </span>
                    {showFilters ? (
                      <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {(localSearchQuery ||
                  showFilters ||
                  infoStatusFilter !== "all" ||
                  activeStatusFilter !== "all") && (
                  <button
                    onClick={handleResetAll}
                    className="flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                    title="Réinitialiser tous les filtres"
                  >
                    <i className="fa-solid fa-rotate-left text-sm" />
                    <span className="hidden md:inline font-medium">
                      Réinitialiser
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section filtre dans la navbar */}
        {showFilters && (
          <div className="px-4 pb-4">
            <FilterSection
              infoStatusFilter={infoStatusFilter}
              setInfoStatusFilter={(value) =>
                applyFilters({ infoStatus: value })
              }
              activeStatusFilter={activeStatusFilter}
              setActiveStatusFilter={(value) =>
                applyFilters({ activeStatus: value })
              }
            />
          </div>
        )}
      </div>

      <AddApprenantDrawer
        isOpen={isAddDrawerOpen}
        onClose={handleCloseAddDrawer}
        onEmployeeAdded={handleEmployeeAdded}
        etpId={idEtp}
      />
    </>
  );
}

export default NavbarLearnerEtp;