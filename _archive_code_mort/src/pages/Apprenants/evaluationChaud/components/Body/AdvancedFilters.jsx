import React, { useState } from 'react';
import { ChevronDown, Search, X, RotateCcw } from 'lucide-react';

const FilterDropdown = ({ 
  label, 
  isSelected, 
  hasSearch = false, 
  onSelect, 
  onClear 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center w-full">
        {!isSelected ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span>{label}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        ) : (
          <div className="flex items-center w-full">
            <div className="flex-1 px-4 py-2 text-sm font-medium text-violet-700 bg-violet-50 border border-violet-200 rounded-l-lg">
              {label}
            </div>
            <button
              onClick={onClear}
              className="px-3 py-2 text-violet-700 bg-violet-50 border border-violet-200 border-l-0 rounded-r-lg hover:bg-violet-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-200">
            <h5 className="text-lg font-semibold text-gray-700 mb-2">{label}</h5>
            {hasSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
          <div className="p-2 max-h-64 overflow-y-auto">
            <div className="text-sm text-gray-500 text-center py-4">
              Aucun élément disponible
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdvancedFilters = ({ isVisible, onReset }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const filters = [
    { id: 'entreprise', label: 'Entreprise', hasSearch: true },
    { id: 'type', label: 'Type de projet', hasSearch: false },
    { id: 'periode', label: 'Période de formation', hasSearch: false },
    { id: 'cours', label: 'Cours', hasSearch: true },
    { id: 'ville', label: 'Ville', hasSearch: true },
    { id: 'financement', label: 'Type de financement', hasSearch: false },
    { id: 'formateur', label: 'Formateur', hasSearch: true },
    { id: 'mois', label: 'Mois', hasSearch: true }
  ];

  const handleSelect = (filterId) => {
    setSelectedFilters(prev => [...prev, filterId]);
  };

  const handleClear = (filterId) => {
    setSelectedFilters(prev => prev.filter(id => id !== filterId));
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-700">Filtres avancés</h3>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 text-violet-600 hover:text-violet-700 font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser le filtre
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {filters.map((filter) => (
          <FilterDropdown
            key={filter.id}
            label={filter.label}
            hasSearch={filter.hasSearch}
            isSelected={selectedFilters.includes(filter.id)}
            onSelect={() => handleSelect(filter.id)}
            onClear={() => handleClear(filter.id)}
          />
        ))}
      </div>
    </div>
  );
};