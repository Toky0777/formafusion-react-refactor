import { Search, ChevronDown } from 'lucide-react';

const CenterFilters = ({
    availableCenters,
    selectedCenters,
    setSelectedCenters,
    showAllCenters,
    setShowAllCenters,
    centerSearchTerm,
    setCenterSearchTerm,
    isSearchingCenter,
    setIsSearchingCenter,
    loading = false,
}) => {
    const getFilteredCenters = () => {
        let centers = availableCenters || [];

        if (centerSearchTerm) {
            centers = centers.filter(center =>
                (center.name || center.center || center).toLowerCase().includes(centerSearchTerm.toLowerCase())
            );
        }

        return centers.map(center => ({
            center: center.name || center.center || center,
            count: center.count || center.formations_count || 0,
        }));
    };

    const getDisplayedCenters = () => {
        const allCenters = getFilteredCenters();
        if (centerSearchTerm || showAllCenters) {
            return allCenters;
        }
        return allCenters.slice(0, 5);
    };

    const handleCenterToggle = (center) => {
        if (selectedCenters.includes(center)) {
            setSelectedCenters(selectedCenters.filter(c => c !== center));
        } else {
            setSelectedCenters([...selectedCenters, center]);
        }
    };

    return (
        <div className="py-4 border-b border-gray-200 bg-gray-50">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="mb-3 text-center">
                    {!isSearchingCenter ? (
                        <div className="flex items-center justify-center gap-2">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Centres de formation
                            </h2>
                            <button
                                onClick={() => setIsSearchingCenter(true)}
                                className="p-1 text-gray-600 transition-colors hover:text-blue-600"
                                title="Rechercher un centre"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="max-w-xs mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher un centre..."
                                    className="w-full px-3 py-1 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                                    value={centerSearchTerm}
                                    onChange={(e) => setCenterSearchTerm(e.target.value)}
                                    onBlur={() => {
                                        if (!centerSearchTerm) setIsSearchingCenter(false);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                            setCenterSearchTerm('');
                                            setIsSearchingCenter(false);
                                        }
                                    }}
                                    autoFocus
                                />
                                {centerSearchTerm && (
                                    <button
                                        onClick={() => {
                                            setCenterSearchTerm('');
                                            setIsSearchingCenter(false);
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

                {/* ✅ Chargement */}
                {loading ? (
                    <div className="flex flex-wrap justify-center gap-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-6 bg-gray-200 rounded w-36 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Centres */}
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                            {getDisplayedCenters().map(({ center, count }) => (
                                <button
                                    key={center}
                                    onClick={() => handleCenterToggle(center)}
                                    className={`
                                        text-sm transition-all duration-200 hover:underline
                                        ${selectedCenters.includes(center)
                                            ? 'text-purple-600 font-semibold underline'
                                            : 'text-gray-600 hover:text-purple-600'
                                        }
                                    `}
                                >
                                    {center} ({count})
                                </button>
                            ))}
                        </div>

                        {/* Bouton Voir plus/moins */}
                        {!centerSearchTerm && getFilteredCenters().length > 5 && (
                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => setShowAllCenters(!showAllCenters)}
                                    className="inline-flex items-center px-4 py-1 text-sm text-gray-600 transition-colors bg-white border border-gray-300 rounded-full hover:text-purple-600 hover:bg-gray-100"
                                >
                                    {showAllCenters ? (
                                        <>
                                            <span>Voir moins</span>
                                            <ChevronDown className="w-3 h-3 ml-1 transform rotate-180" />
                                        </>
                                    ) : (
                                        <>
                                            <span>Voir plus ({getFilteredCenters().length - 5})</span>
                                            <ChevronDown className="w-3 h-3 ml-1" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Filtres actifs centres */}
                {!loading && selectedCenters.length > 0 && (
                    <div className="mt-3 text-center">
                        <div className="flex flex-wrap justify-center gap-2">
                            {selectedCenters.map(center => (
                                <div key={center} className="inline-flex items-center px-3 py-1 text-sm text-purple-800 bg-purple-100 border border-purple-300 rounded-full">
                                    <span className="mr-2">{center}</span>
                                    <button
                                        onClick={() => setSelectedCenters(selectedCenters.filter(c => c !== center))}
                                        className="ml-1 text-purple-600 hover:text-purple-800"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => setSelectedCenters([])}
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

export default CenterFilters;
