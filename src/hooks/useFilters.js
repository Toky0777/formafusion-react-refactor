import { useState, useEffect, useMemo, useRef } from 'react';

export const useFilters = (fetchFormations) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedThemes, setSelectedThemes] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedFormat, setSelectedFormat] = useState('');
    const [selectedCenters, setSelectedCenters] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);
    const [selectedDateFilter, setSelectedDateFilter] = useState('');
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [showAllCenters, setShowAllCenters] = useState(false);
    const [centerSearchTerm, setCenterSearchTerm] = useState('');
    const [isSearchingCenter, setIsSearchingCenter] = useState(false);
    const [showAllThemes, setShowAllThemes] = useState(false);
    const [themeSearchTerm, setThemeSearchTerm] = useState('');
    const [isSearchingTheme, setIsSearchingTheme] = useState(false);

    // Create filters object for API
    const currentFilters = useMemo(() => {
        const filters = {};

        if (searchTerm) filters.search = searchTerm;
        if (selectedThemes.length > 0) filters.categories = selectedThemes;
        if (selectedCenters.length > 0) filters.customers = selectedCenters;
        if (selectedCities.length > 0) filters.cities = selectedCities;
        if (selectedLevels.length > 0) filters.levels = selectedLevels;
        if (selectedMonth) filters.month = selectedMonth;
        if (selectedFormat) filters.format = selectedFormat;
        if (selectedDateFilter) filters.period = selectedDateFilter;
        if (themeSearchTerm) filters.theme_search = themeSearchTerm;
        if (centerSearchTerm) filters.center_search = centerSearchTerm;

        return filters;
    }, [
        searchTerm, selectedThemes, selectedCenters, selectedCities,
        selectedLevels, selectedMonth, selectedFormat, selectedDateFilter,
        themeSearchTerm, centerSearchTerm
    ]);

    // Trigger API call when filters change
    // useEffect(() => {
    //     const timeoutId = setTimeout(() => {
    //         if (fetchFormations) {
    //             fetchFormations(1, currentFilters);
    //         }
    //     }, 30000); 

    //     return () => clearTimeout(timeoutId);
    // }, [currentFilters, fetchFormations]);

    const prevFiltersRef = useRef();

    useEffect(() => {
        if (JSON.stringify(prevFiltersRef.current) === JSON.stringify(currentFilters)) {
            return; // Ne rien faire si les filtres sont identiques
        }

        const timeoutId = setTimeout(() => {
            fetchFormations?.(1, currentFilters);
            prevFiltersRef.current = currentFilters;
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [currentFilters, fetchFormations]);


    const resetFilters = () => {
        setSearchTerm('');
        setSelectedThemes([]);
        setSelectedMonth('');
        setSelectedFormat('');
        setSelectedDateFilter('');
        setSelectedCenters([]);
        setSelectedCities([]);
        setSelectedLevels([]);
        setShowAllCenters(false);
        setCenterSearchTerm('');
        setIsSearchingCenter(false);
        setShowAllThemes(false);
        setThemeSearchTerm('');
        setIsSearchingTheme(false);
    };

    return {
        searchTerm,
        setSearchTerm,
        selectedThemes,
        setSelectedThemes,
        selectedMonth,
        setSelectedMonth,
        selectedFormat,
        setSelectedFormat,
        selectedCenters,
        setSelectedCenters,
        selectedCities,
        setSelectedCities,
        selectedDateFilter,
        setSelectedDateFilter,
        selectedLevels,
        setSelectedLevels,
        showAllCenters,
        setShowAllCenters,
        centerSearchTerm,
        setCenterSearchTerm,
        isSearchingCenter,
        setIsSearchingCenter,
        showAllThemes,
        setShowAllThemes,
        themeSearchTerm,
        setThemeSearchTerm,
        isSearchingTheme,
        setIsSearchingTheme,
        resetFilters,
        currentFilters
    };
};