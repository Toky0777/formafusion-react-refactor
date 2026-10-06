import { motion, AnimatePresence } from 'framer-motion';

// Composant skeleton simple pour simuler un item en chargement
const SkeletonItem = () => (
    <div className="h-6 my-1 bg-gray-300 rounded-md animate-pulse" />
);

const SideBar = ({
    availableLevels,
    availableCities,
    selectedLevels,
    setSelectedLevels,
    selectedCities,
    setSelectedCities
}) => {
    const isLoading = !availableLevels || availableLevels.length === 0 || !availableCities || availableCities.length === 0;


    const displayLevels = (availableLevels || []).map(level => ({
        level: level.name || level.level || level,
        count: level.count || level.formations_count || 0
    }));

    const displayCities = (availableCities || []).map(city => ({
        city: city.name || city.city || city,
        count: city.count || city.formations_count || 0,
    }));

    const handleLevelToggle = (level) => {
        if (selectedLevels.includes(level)) {
            setSelectedLevels(selectedLevels.filter(l => l !== level));
        } else {
            setSelectedLevels([...selectedLevels, level]);
        }
    };

    const handleCityToggle = (city) => {
        if (selectedCities.includes(city)) {
            setSelectedCities(selectedCities.filter(c => c !== city));
        } else {
            setSelectedCities([...selectedCities, city]);
        }
    };

    return (
        <div className="flex-shrink-0 w-56">
            <div className="sticky z-30 p-4 space-y-6 bg-white border rounded-lg shadow-sm top-24">

                {/* Filtre Niveau */}
                <div>
                    <h3 className="mb-4 text-sm font-semibold text-gray-900">Niveau</h3>
                    {isLoading ? (
                        <>
                            <SkeletonItem />
                            <SkeletonItem />
                            <SkeletonItem />
                            <SkeletonItem />
                            <SkeletonItem />
                            <SkeletonItem />
                        </>
                    ) : (
                        <div className="space-y-2">
                            {displayLevels.map(({ level, count }) => (
                                <motion.button
                                    key={level}
                                    onClick={() => handleLevelToggle(level)}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                    ${selectedLevels.includes(level)
                                            ? 'bg-blue-100 text-blue-800 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50'}
                  `}
                                    whileTap={{ scale: 0.95 }}
                                    animate={{ scale: selectedLevels.includes(level) ? 1.05 : 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{level}</span>
                                        <span className="text-xs text-gray-400">({count})</span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    )}

                    <AnimatePresence>
                        {!isLoading && selectedLevels.length > 0 && (
                            <motion.div
                                key="selectedLevels"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="pt-3 mt-3 border-t"
                            >
                                <div className="space-y-2">
                                    {selectedLevels.map(level => (
                                        <motion.div
                                            key={level}
                                            className="flex items-center justify-between text-xs"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <span className="font-medium text-blue-600">{level}</span>
                                            <button
                                                onClick={() => setSelectedLevels(selectedLevels.filter(l => l !== level))}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                ✕
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                                <motion.button
                                    onClick={() => setSelectedLevels([])}
                                    whileHover={{ scale: 1.05, color: '#1D4ED8' }}
                                    className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                                >
                                    Tout effacer
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Filtre Villes */}
                <div>
                    <h3 className="mb-4 text-sm font-semibold text-gray-900">Villes</h3>
                    {isLoading ? (
                        <>
                            <SkeletonItem />
                            <SkeletonItem />
                            <SkeletonItem />
                            <SkeletonItem />
                            <SkeletonItem />
                            <SkeletonItem />
                        </>
                    ) : (
                        <div className="space-y-2">
                            {displayCities.map(({ city, count }) => (
                                <motion.button
                                    key={city}
                                    onClick={() => handleCityToggle(city)}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                    ${selectedCities.includes(city)
                                            ? 'bg-purple-100 text-purple-800 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50'}
                  `}
                                    whileTap={{ scale: 0.95 }}
                                    animate={{ scale: selectedCities.includes(city) ? 1.05 : 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{city}</span>
                                        <span className="text-xs text-gray-400">({count})</span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    )}

                    <AnimatePresence>
                        {!isLoading && selectedCities.length > 0 && (
                            <motion.div
                                key="selectedCities"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="pt-3 mt-3 border-t"
                            >
                                <div className="space-y-2">
                                    {selectedCities.map(city => (
                                        <motion.div
                                            key={city}
                                            className="flex items-center justify-between text-xs"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <span className="font-medium text-purple-600">{city}</span>
                                            <button
                                                onClick={() => setSelectedCities(selectedCities.filter(c => c !== city))}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                ✕
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                                <motion.button
                                    onClick={() => setSelectedCities([])}
                                    whileHover={{ scale: 1.05, color: '#7C3AED' }} // purple-700
                                    className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                                >
                                    Tout effacer
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
