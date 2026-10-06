import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";

const FilterContext = createContext();

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};

export const FilterProvider = ({ children, userType }) => {
  const [filters, setFilters] = useState({
    companies: [],
    periodes: [],
    courses: [],
    lieux: [],
    modalites: [],
    infoStatus: "all",
    activeStatus: "all",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const timeoutRef = useRef(null);

  const applyFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const toggleFiltersVisibility = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  // Fonction de debounce améliorée - définie avec useCallback
  const debounce = useCallback((func, delay) => {
    return (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Mémoïser la fonction updateSearchTerm
  const updateSearchTerm = useCallback(
    debounce((term) => {
      setSearchTerm(term);
      setIsSearching(false);
    }, 350),
    [debounce]
  );

  // Mémoïser handleSearchChange
  const handleSearchChange = useCallback((term) => {
    if (term !== searchTerm) {
      setIsSearching(true);
      updateSearchTerm(term);
    }
  }, [searchTerm, updateSearchTerm]);

  const resetFilters = useCallback(() => {
    setFilters({
      companies: [],
      periodes: [],
      courses: [],
      lieux: [],
      modalites: [],
      infoStatus: "all",
      activeStatus: "all",
    });
    setSearchTerm("");
    setShowFilters(false);
    setIsSearching(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const setFiltersVisibility = useCallback((isVisible) => {
    setShowFilters(isVisible);
  }, []);

  const value = useMemo(
    () => ({
      filters,
      searchTerm,
      showFilters,
      isSearching,
      availableCompanies,
      userType,
      setAvailableCompanies,
      setSearchTerm: handleSearchChange,
      applyFilters,
      resetFilters,
      updateSearchTerm: handleSearchChange,
      toggleFiltersVisibility,
      setFiltersVisibility,
    }),
    [
      filters,
      searchTerm,
      showFilters,
      isSearching,
      availableCompanies,
      userType,
      handleSearchChange,
      applyFilters,
      resetFilters,
      toggleFiltersVisibility,
      setFiltersVisibility
    ]
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export default FilterProvider;