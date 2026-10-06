import { useState } from "react";
import { X, Filter } from "lucide-react";

export function FilterResults({ filters, onFilterChange, onReset, levels, campaigns }) {
    const [showFilters, setShowFilters] = useState(true);

    const handleInputChange = (filterName, value) => {
        onFilterChange(filterName, value);
    };

    const handleReset = () => {
        onReset();
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');
    const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

    return (
        <div className="p-6 mb-8 bg-white shadow-lg rounded-xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-gray-800">Filtres</h2>
                    {hasActiveFilters && (
                        <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                            {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 transition-colors rounded-md bg-red-50 hover:bg-red-100"
                        >
                            <X className="w-4 h-4" />
                            Tout effacer
                        </button>
                    )}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        <Filter className="w-4 h-4" />
                        {showFilters ? 'Masquer' : 'Afficher'}
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {/* Filtre Nom */}
                    <div className="relative">
                        <label className="block mb-1 text-xs font-medium text-gray-700">
                            Nom/Prénom
                        </label>
                        <input 
                            type="text" 
                            value={filters.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full h-10 px-3 transition duration-300 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 md:h-12" 
                            placeholder="Rechercher un apprenant" 
                        />
                    </div>

                    {/* Filtre Entreprise */}
                    <div className="relative">
                        <label className="block mb-1 text-xs font-medium text-gray-700">
                            Entreprise
                        </label>
                        <input 
                            type="text" 
                            value={filters.etp}
                            onChange={(e) => handleInputChange('etp', e.target.value)}
                            className="w-full h-10 px-3 transition duration-300 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 md:h-12" 
                            placeholder="Entreprise" 
                        />
                    </div>

                    {/* Filtre QCM */}
                    <div className="relative">
                        <label className="block mb-1 text-xs font-medium text-gray-700">
                            QCM
                        </label>
                        <input 
                            type="text" 
                            value={filters.qcm}
                            onChange={(e) => handleInputChange('qcm', e.target.value)}
                            className="w-full h-10 px-3 transition duration-300 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 md:h-12" 
                            placeholder="Nom du QCM" 
                        />
                    </div>

                    {/* Filtre Date */}
                    <div className="relative">
                        <label className="block mb-1 text-xs font-medium text-gray-700">
                            Date
                        </label>
                        <input 
                            type="date" 
                            value={filters.date}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                            className="w-full h-10 px-3 transition duration-300 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 md:h-12"
                        />
                    </div>

                    {/* Filtres Points */}
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-700">
                            Points
                        </label>
                        <div className="flex space-x-2">
                            <input 
                                type="number" 
                                value={filters.pointsMin}
                                onChange={(e) => handleInputChange('pointsMin', e.target.value)}
                                className="w-1/2 h-10 px-2 transition duration-300 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 md:h-12" 
                                placeholder="Min"
                            />
                            <input 
                                type="number" 
                                value={filters.pointsMax}
                                onChange={(e) => handleInputChange('pointsMax', e.target.value)}
                                className="w-1/2 h-10 px-2 transition duration-300 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 md:h-12" 
                                placeholder="Max"
                            />
                        </div>
                    </div>

                    {/* Filtre Niveau */}
                    <div>
                        <label className="block mb-1 text-xs font-medium text-gray-700">
                            Niveau
                        </label>
                        <select 
                            value={filters.level}
                            onChange={(e) => handleInputChange('level', e.target.value)}
                            className="w-full h-10 px-3 transition duration-300 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 md:h-12"
                        >
                            <option value="">Tous les niveaux</option>
                            {levels.map((level, index) => (
                                <option key={index} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Filtre Campagne */}
                    <div>
                        <label className="block mb-1 text-xs font-medium text-gray-700">
                            Campagne
                        </label>
                        <select 
                            value={filters.campaign}
                            onChange={(e) => handleInputChange('campaign', e.target.value)}
                            className="w-full h-10 px-3 transition duration-300 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 md:h-12"
                        >
                            <option value="">Toutes les campagnes</option>
                            {campaigns.map((campaign, index) => (
                                <option key={index} value={campaign}>
                                    {campaign}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Indicateurs de filtres actifs */}
            {hasActiveFilters && (
                <div className="p-3 mt-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-blue-800">Filtres actifs :</span>
                        {filters.name && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-800 bg-white rounded-md">
                                Nom: {filters.name}
                                <button onClick={() => handleInputChange('name', '')}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {filters.etp && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-800 bg-white rounded-md">
                                Entreprise: {filters.etp}
                                <button onClick={() => handleInputChange('etp', '')}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {filters.qcm && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-800 bg-white rounded-md">
                                QCM: {filters.qcm}
                                <button onClick={() => handleInputChange('qcm', '')}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {filters.date && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-800 bg-white rounded-md">
                                Date: {filters.date}
                                <button onClick={() => handleInputChange('date', '')}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {(filters.pointsMin || filters.pointsMax) && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-800 bg-white rounded-md">
                                Points: {filters.pointsMin || '0'} - {filters.pointsMax || '∞'}
                                <button onClick={() => {
                                    handleInputChange('pointsMin', '');
                                    handleInputChange('pointsMax', '');
                                }}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {filters.level && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-800 bg-white rounded-md">
                                Niveau: {filters.level}
                                <button onClick={() => handleInputChange('level', '')}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {filters.campaign && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-800 bg-white rounded-md">
                                Campagne: {filters.campaign}
                                <button onClick={() => handleInputChange('campaign', '')}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}