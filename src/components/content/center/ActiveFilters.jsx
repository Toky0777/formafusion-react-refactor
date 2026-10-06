import { getThemeIcon } from '../../../utils/themeUtils';

const ActiveFiltersCenter = ({
    selectedThemes,
    selectedCities,
    searchTerm,
    centerSearchTerm,
    themeSearchTerm,
    setSelectedThemes,
    setSelectedCities,
    setThemeSearchTerm,
    setIsSearchingTheme,
    setCenterSearchTerm,
    setIsSearchingCenter,
    resetFilters
}) => {
    const hasActiveFilters = (
        selectedThemes.length > 0 ||
        selectedCities.length > 0 ||
        searchTerm ||
        themeSearchTerm
    );

    if (!hasActiveFilters) return null;

    return (
        <div className="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-blue-900">Filtres actifs</h3>
                <button
                    onClick={resetFilters}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                >
                    Tout effacer
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {/* Filtre recherche générale */}
                {/* {searchTerm && (
                    <div className="inline-flex items-center px-3 py-1 text-sm bg-white border border-blue-300 rounded-full">
                        <span className="mr-2 text-gray-600">Recherche:</span>
                        <span className="font-medium text-gray-900">"{searchTerm}"</span>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                )} */}

                {/* Filtres thématiques */}
                {selectedThemes.map(theme => {
                    const themeIcon = getThemeIcon(theme);
                    const IconComponent = themeIcon.icon;

                    return (
                        <div key={`theme-${theme}`} className="inline-flex items-center px-3 py-1 text-sm bg-white border border-teal-300 rounded-full">
                            <IconComponent className="w-3 h-3 mr-1 text-teal-600" />
                            <span className="mr-2 text-gray-600">Thématique:</span>
                            <span className="font-medium text-gray-900">{theme}</span>
                            <button
                                onClick={() => setSelectedThemes(selectedThemes.filter(t => t !== theme))}
                                className="ml-2 text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                    );
                })}

                {/* Filtres villes */}
                {selectedCities.map(city => (
                    <div key={`city-${city}`} className="inline-flex items-center px-3 py-1 text-sm bg-white border border-purple-300 rounded-full">
                        <span className="mr-2 text-gray-600">Ville:</span>
                        <span className="font-medium text-gray-900">{city}</span>
                        <button
                            onClick={() => setSelectedCities(selectedCities.filter(c => c !== city))}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                ))}

                {/* Recherche thématique */}
                {themeSearchTerm && (
                    <div className="inline-flex items-center px-3 py-1 text-sm bg-white border border-teal-300 rounded-full">
                        <span className="mr-2 text-gray-600">Recherche thématique:</span>
                        <span className="font-medium text-gray-900">"{themeSearchTerm}"</span>
                        <button
                            onClick={() => {
                                setThemeSearchTerm('');
                                setIsSearchingTheme(false);
                            }}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Recherche centre */}
                {centerSearchTerm && (
                    <div className="inline-flex items-center px-3 py-1 text-sm bg-white border border-indigo-300 rounded-full">
                        <span className="mr-2 text-gray-600">Recherche centre:</span>
                        <span className="font-medium text-gray-900">"{centerSearchTerm}"</span>
                        <button
                            onClick={() => {
                                setCenterSearchTerm('');
                                setIsSearchingCenter(false);
                            }}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActiveFiltersCenter;