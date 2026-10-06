// hooks/useSafeFilter.js
import { useFilter } from '../../contexts/etp/FilterContext'; // Corriger le chemin

export const useSafeFilter = () => {
  try {
    const context = useFilter();
    if (!context) {
      throw new Error('FilterContext not available');
    }
    return context;
  } catch (error) {
    console.warn('FilterContext not available, using default values');
    // Retourner des valeurs par défaut
    return {
      filters: {
        companies: [],
        periodes: [],
        courses: [],
        lieux: [],
        modalites: [],
        infoStatus: 'all',
        activeStatus: 'all',
      },
      searchTerm: '',
      showFilters: false,
      setSearchTerm: () => {},
      applyFilters: () => {},
      resetFilters: () => {},
      updateSearchTerm: () => {},
      toggleFiltersVisibility: () => {},
      setFiltersVisibility: () => {}
    };
  }
};