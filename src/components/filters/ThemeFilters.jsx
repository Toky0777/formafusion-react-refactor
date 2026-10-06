import { Search, ChevronDown } from 'lucide-react';
import { getThemeIcon } from '../../utils/themeUtils';

const ThemeFilters = ({
    availableThemes,
    selectedThemes,
    setSelectedThemes,
    showAllThemes,
    setShowAllThemes,
    themeSearchTerm,
    setThemeSearchTerm,
    isSearchingTheme,
    setIsSearchingTheme,
    isThemeLoading
}) => {
    const getFilteredThemes = () => {
        let themes = availableThemes || [];

        if (themeSearchTerm) {
            themes = themes.filter(theme =>
                (theme.name || theme.theme || theme).toLowerCase().includes(themeSearchTerm.toLowerCase())
            );
        }

        return themes.map(theme => ({
            theme: theme.name || theme.theme || theme,
            count: theme.count || theme.formations_count || 0
        }));
    };

    const getDisplayedThemes = () => {
        const allThemes = getFilteredThemes();
        if (themeSearchTerm || showAllThemes) {
            return allThemes;
        }
        return allThemes.slice(0, 5);
    };

    const handleThemeToggle = (theme) => {
        if (selectedThemes.includes(theme)) {
            setSelectedThemes(selectedThemes.filter(t => t !== theme));
        } else {
            setSelectedThemes([...selectedThemes, theme]);
        }
    };

    return (
        <div className="py-4 bg-white border-b border-gray-200">
            <div className="px-4 mx-auto sm:px-6 lg:px-8">
                <div className="mb-3 text-center">
                    {!isSearchingTheme ? (
                        <div className="flex items-center justify-center gap-2">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Thématiques disponibles
                            </h2>
                            <button
                                onClick={() => setIsSearchingTheme(true)}
                                className="p-1 text-gray-600 transition-colors hover:text-blue-600"
                                title="Rechercher une thématique"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="max-w-xs mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher une thématique..."
                                    className="w-full px-3 py-1 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                                    value={themeSearchTerm}
                                    onChange={(e) => setThemeSearchTerm(e.target.value)}
                                    onBlur={() => {
                                        if (!themeSearchTerm) {
                                            setIsSearchingTheme(false);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                            setThemeSearchTerm('');
                                            setIsSearchingTheme(false);
                                        }
                                    }}
                                    autoFocus
                                />
                                {themeSearchTerm && (
                                    <button
                                        onClick={() => {
                                            setThemeSearchTerm('');
                                            setIsSearchingTheme(false);
                                        }}
                                        className="absolute text-gray-400 transform -translate-y-1/2 right-2 top-1/2 hover:text-gray-600"
                                    >
                                        <span className="text-xs">✕</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Thématiques */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 min-h-[40px]">
                    {isThemeLoading ? (
                        // Skeleton loading
                        Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="w-32 h-5 bg-gray-200 rounded-full animate-pulse"
                            ></div>
                        ))
                    ) : (
                        getDisplayedThemes().map(({ theme, count }) => {
                            const themeIcon = getThemeIcon(theme);
                            const IconComponent = themeIcon.icon;

                            return (
                                <button
                                    key={theme}
                                    onClick={() => handleThemeToggle(theme)}
                                    className={`text-sm transition-all duration-200 hover:underline flex items-center gap-1
            ${selectedThemes.includes(theme)
                                            ? 'text-blue-600 font-semibold underline'
                                            : 'text-gray-600 hover:text-blue-600'
                                        }
          `}
                                >
                                    <IconComponent className="w-3 h-3" />
                                    {theme} ({count})
                                </button>
                            );
                        })
                    )}
                </div>


                {/* Bouton Voir plus/moins */}
                {!themeSearchTerm && getFilteredThemes().length > 5 && (
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => setShowAllThemes(!showAllThemes)}
                            className="inline-flex items-center px-4 py-1 text-sm text-gray-600 transition-colors bg-gray-100 rounded-full hover:text-blue-600 hover:bg-gray-200"
                        >
                            {showAllThemes ? (
                                <>
                                    <span>Voir moins</span>
                                    <ChevronDown className="w-3 h-3 ml-1 transform rotate-180" />
                                </>
                            ) : (
                                <>
                                    <span>Voir plus ({getFilteredThemes().length - 5})</span>
                                    <ChevronDown className="w-3 h-3 ml-1" />
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Filtres actifs */}
                {selectedThemes.length > 0 && (
                    <div className="mt-3 text-center">
                        <div className="flex flex-wrap justify-center gap-2">
                            {selectedThemes.map(theme => {
                                const themeIcon = getThemeIcon(theme);
                                const IconComponent = themeIcon.icon;

                                return (
                                    <div key={theme} className="inline-flex items-center px-3 py-1 text-sm text-blue-800 bg-blue-100 border border-blue-300 rounded-full">
                                        <IconComponent className="w-3 h-3 mr-1" />
                                        <span className="mr-2">{theme}</span>
                                        <button
                                            onClick={() => setSelectedThemes(selectedThemes.filter(t => t !== theme))}
                                            className="ml-1 text-blue-600 hover:text-blue-800"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                );
                            })}
                            <button
                                onClick={() => setSelectedThemes([])}
                                className="inline-flex items-center px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
                            >
                                Tout effacer
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThemeFilters;