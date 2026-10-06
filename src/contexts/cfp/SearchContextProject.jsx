import { createContext, useState, useContext } from "react";
import { Outlet } from "react-router-dom";

const SearchContextProject = createContext();

export const SearchProviderProject = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <SearchContextProject.Provider value={{ searchTerm, setSearchTerm }}>
            <Outlet />
        </SearchContextProject.Provider>
    );
};

export const useSearchProject = () => useContext(SearchContextProject);
