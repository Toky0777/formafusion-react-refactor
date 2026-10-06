
import { createContext, useContext, useState } from "react";

const SearchCatalogContext = createContext();
export const SearchCatalogProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <SearchCatalogContext.Provider value={{ searchTerm, setSearchTerm }}>
            {children}
        </SearchCatalogContext.Provider>
    );
};

export const useSearch = () => useContext(SearchCatalogContext);


