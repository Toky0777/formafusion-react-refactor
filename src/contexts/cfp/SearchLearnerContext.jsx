import { createContext, useState } from 'react';

// Crée le contexte
export const SearchLearnerContext = createContext();

// Crée le fournisseur de contexte
export const SearchLearnerProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilters, setSelectedFilters] = useState({
        companies: [],
        periodes: [],
        courses: [],
        lieux: [],
        modalites: []
    });

    const applyFilters = (filters) => {
        setSelectedFilters(filters);
    };

    const clearSearch = () => {
        setSearchTerm("");
    };

    const value = {
        searchTerm,
        setSearchTerm,
        selectedFilters,
        applyFilters,
        clearSearch
    };

    return (
        <SearchLearnerContext.Provider value={value}>
            {children}
        </SearchLearnerContext.Provider>
    );
};