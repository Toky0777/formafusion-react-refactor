import axios from 'axios';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useStateContext } from './ContextProvider';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    category: 'all',
    sortBy: 'relevance',
    dateRange: 'all'
  });
  const { token, api_base_url } = useStateContext();

  // Fonction de recherche principale
  const performSearch = useCallback(async (query, filters = searchFilters) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      // Correction: utiliser axios correctement
      const response = await axios.get(`${api_base_url}search`, {
        params: {
          search: query.trim(), 
          filter: filters
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Réponse de recherche:', response.data);
      
      // Traiter les résultats de la réponse axios
      setSearchResults(response.data|| []);
      
      // Ajouter à l'historique si ce n'est pas déjà présent
      setSearchHistory(prev => {
        const newHistory = prev.filter(item => item.query !== query);
        return [{ query, timestamp: new Date() }, ...newHistory].slice(0, 10);
      });

    } catch (error) {
      console.error('Erreur de recherche:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchFilters, token, api_base_url]);

  // Recherche avec debounce
  const debouncedSearch = useCallback(
    debounce((query, filters) => {
      performSearch(query, filters);
    }, 300),
    [performSearch]
  );

  // Mise à jour de la requête de recherche
  const updateSearchQuery = useCallback((query) => {
    setSearchQuery(query);
    if (query.trim()) {
      debouncedSearch(query, searchFilters);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch, searchFilters]);

  // Mise à jour des filtres
  const updateSearchFilters = useCallback((newFilters) => {
    setSearchFilters(prev => ({ ...prev, ...newFilters }));
    if (searchQuery.trim()) {
      performSearch(searchQuery, { ...searchFilters, ...newFilters });
    }
  }, [searchQuery, searchFilters, performSearch]);

  // Effacer la recherche
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  // Effacer l'historique
  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  const value = {
    // État
    searchQuery,
    searchResults,
    isSearching,
    searchHistory,
    searchFilters,
    
    // Actions
    updateSearchQuery,
    updateSearchFilters,
    performSearch,
    clearSearch,
    clearSearchHistory,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

// Utilitaire debounce
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}