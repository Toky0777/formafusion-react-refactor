import React, { useState, useEffect } from 'react';
import SearchSection from '../components/search/SearchSection';
import ThemeFilters from '../components/filters/ThemeFilters';
import CenterFilters from '../components/filters/CenterFilters';
import { useCourseData } from '../hooks/useCourseData';
import { useFilters } from '../hooks/useFilters';
import { useApiData } from '../hooks/useApiCourse';
import MainContentCourse from '../components/content/course/MainContent';

const Course = () => {
    const {
        courses,
        error: coursesError,
        pagination,
        fetchCourses
    } = useCourseData();

    const [isCenterLoading, setIsCenterLoading] = useState(true);
    const [isThemeLoading, setIsThemeLoading] = useState(true);
    const [isCourseLoading, setIsCourseLoading] = useState(true);

    const {
        categories,
        customers,
        cities,
        levels,
        error: apiDataError
    } = useApiData();

    useEffect(() => {
        if (customers && customers.length > 0) {
            setIsCenterLoading(false);
        }
    }, [customers]);

    useEffect(() => {
        if (courses && courses.length > 0) {
            setIsCourseLoading(false);
        }
    }, [courses]);

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
        selectedCenters,
        setSelectedCenters,
        selectedCities,
        setSelectedCities,
        selectedLevels,
        setSelectedLevels,
        selectedMonth,
        setSelectedMonth,
        selectedFormat,
        setSelectedFormat,
        selectedDateFilter,
        setSelectedDateFilter,
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
    } = useFilters(fetchCourses);

    const [currentPage, setCurrentPage] = useState(1);

    // Reset page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [currentFilters]);

    // Handle page changes
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchCourses(page, currentFilters);
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
            <CenterFilters
                availableCenters={customers}
                selectedCenters={selectedCenters}
                setSelectedCenters={setSelectedCenters}
                showAllCenters={showAllCenters}
                setShowAllCenters={setShowAllCenters}
                centerSearchTerm={centerSearchTerm}
                setCenterSearchTerm={setCenterSearchTerm}
                isSearchingCenter={isSearchingCenter}
                setIsSearchingCenter={setIsSearchingCenter}
                loading={isCenterLoading}
            />
            <MainContentCourse
                courses={courses}
                availableCities={cities}
                availableLevels={levels}
                pagination={pagination}
                currentPage={currentPage}
                setCurrentPage={handlePageChange}
                searchTerm={searchTerm}
                selectedThemes={selectedThemes}
                setSelectedThemes={setSelectedThemes}
                selectedCenters={selectedCenters}
                setSelectedCenters={setSelectedCenters}
                selectedCities={selectedCities}
                setSelectedCities={setSelectedCities}
                selectedLevels={selectedLevels}
                setSelectedLevels={setSelectedLevels}
                selectedDateFilter={selectedDateFilter}
                setSelectedDateFilter={setSelectedDateFilter}
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

export default Course;