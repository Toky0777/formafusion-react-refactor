import React, { useState, useEffect } from 'react';
import SearchSection from '../components/search/SearchSectionCenter';
import ThemeFilters from '../components/filters/ThemeFilters';
import { useCenterData } from '../hooks/useCenterData';
import { useFilters } from '../hooks/useFilters';
import { useApiData } from '../hooks/useApiCenter';
import MainContent from '../components/content/center/MainContent';

const CenterMarketplace = () => {
    const {
        centers,
        loading: coursesLoading,
        error: coursesError,
        pagination,
        fetchCenters
    } = useCenterData();

    const [isThemeLoading, setIsThemeLoading] = useState(true);
    const [isCourseLoading, setIsCourseLoading] = useState(true);

    const {
        categories,
        cities,
        loading: apiDataLoading,
        error: apiDataError
    } = useApiData();

    useEffect(() => {
        if (centers && centers.length > 0) {
            setIsCourseLoading(false);
        }
    }, [centers]);

    useEffect(() => {
        if (categories && categories.length > 0) {
            setIsThemeLoading(false);
        }
    }, [categories]);

    const {
        searchTerm,
        setSearchTerm,
        selectedThemes,
        setSelectedThemes,
        selectedCities,
        setSelectedCities,
        selectedMonth,
        setSelectedMonth,
        selectedFormat,
        setSelectedFormat,
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
    } = useFilters(fetchCenters);

    const [currentPage, setCurrentPage] = useState(1);

    // Reset page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [currentFilters]);

    // Handle page changes
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchCenters(page, currentFilters);
    };

    // Show loading state
    // if (formationsLoading || apiDataLoading) {
    //     return (
    //         <div className="flex items-center justify-center min-h-screen bg-gray-50">
    //             <div className="text-center">
    //                 <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
    //                 <p className="text-gray-600">Chargement des formations...</p>
    //             </div>
    //         </div>
    //     );
    // }

    // Show error state
    if (coursesError || apiDataError) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="mb-4 text-red-600">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">Erreur de chargement</h3>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* <Header /> */}
            {/* <PromotionalBanner /> */}
            <SearchSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <ThemeFilters
                availableThemes={categories}
                selectedThemes={selectedThemes}
                setSelectedThemes={setSelectedThemes}
                showAllThemes={showAllThemes}
                setShowAllThemes={setShowAllThemes}
                themeSearchTerm={themeSearchTerm}
                setThemeSearchTerm={setThemeSearchTerm}
                isSearchingTheme={isSearchingTheme}
                setIsSearchingTheme={setIsSearchingTheme}
                isThemeLoading={isThemeLoading}
            />
            <MainContent
                centers={centers}
                availableCities={cities}
                pagination={pagination}
                currentPage={currentPage}
                setCurrentPage={handlePageChange}
                searchTerm={searchTerm}
                selectedThemes={selectedThemes}
                setSelectedThemes={setSelectedThemes}
                selectedCities={selectedCities}
                setSelectedCities={setSelectedCities}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedFormat={selectedFormat}
                setSelectedFormat={setSelectedFormat}
                resetFilters={resetFilters}
                themeSearchTerm={themeSearchTerm}
                setThemeSearchTerm={setThemeSearchTerm}
                isSearchingTheme={isSearchingTheme}
                setIsSearchingTheme={setIsSearchingTheme}
                centerSearchTerm={centerSearchTerm}
                setCenterSearchTerm={setCenterSearchTerm}
                isSearchingCenter={isSearchingCenter}
                setIsSearchingCenter={setIsSearchingCenter}
                isLoading={isCourseLoading}
            />
        </div>
    );
};

export default CenterMarketplace;