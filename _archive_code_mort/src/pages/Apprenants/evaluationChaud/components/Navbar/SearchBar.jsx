import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../Context/SearchContext';
import { Search, X } from 'lucide-react';

const SearchBar = () => {
  const [localQuery, setLocalQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { 
    searchQuery, 
    searchResults, 
    isSearching, 
    updateSearchQuery 
  } = useSearch();
  
  const navigate = useNavigate();

  // Synchroniser avec le contexte de recherche
  useEffect(() => {
    if (searchQuery && searchQuery !== localQuery) {
      setLocalQuery(searchQuery);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      // Mettre à jour le contexte de recherche
      updateSearchQuery(localQuery.trim());
      // Naviguer vers la page de résultats
      navigate('/search');
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    
    // Déclencher la recherche en temps réel pour les suggestions
    if (value.trim()) {
      updateSearchQuery(value.trim());
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(e);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocalQuery(suggestion.title || suggestion.name || suggestion);
    updateSearchQuery(suggestion.title || suggestion.name || suggestion);
    navigate('/search');
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    if (localQuery.trim() && searchResults.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Délai pour permettre le clic sur les suggestions
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const clearSearch = () => {
    setLocalQuery('');
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Rechercher tests, campagnes..."
            className="w-full px-4 py-2 pl-10 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:w-64 md:w-72 lg:w-64"
          />
          
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
            ) : (
              <Search className="w-4 h-4 text-gray-400" />
            )}
          </div>
          
          {/* Clear Button */}
          {localQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 transition-colors rounded-r-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown des suggestions */}
      {showSuggestions && Array.isArray(searchResults) && searchResults.length > 0 && (
        <div className="absolute left-0 right-0 z-50 w-full mt-1 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg max-h-60">
          {searchResults.slice(0, 5).map((result, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(result)}
              className="px-4 py-3 transition-colors border-b cursor-pointer hover:bg-gray-50 last:border-b-0"
            >
              <div className="text-sm font-medium text-gray-900 truncate">
                {result.title || result.name || result.label || 'Résultat'}
              </div>
              {result.description && (
                <div className="mt-1 text-xs text-gray-500 truncate">
                  {result.description}
                </div>
              )}
            </div>
          ))}
          {searchResults.length > 5 && (
            <div className="px-4 py-2 text-xs text-center text-gray-500 bg-gray-50">
              +{searchResults.length - 5} autres résultats...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;