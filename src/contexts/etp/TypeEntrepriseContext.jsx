import { createContext, useContext, useState } from 'react';

const EntrepriseContext = createContext();

export const EntrepriseProvider = ({ children }) => {
    const [isGroupeEntreprise, setIsGroupeEntreprise] = useState(false);

    return (
        <EntrepriseContext.Provider value={{ isGroupeEntreprise, setIsGroupeEntreprise }}>
            {children}
        </EntrepriseContext.Provider>
    );
};

export const useEntreprise = () => useContext(EntrepriseContext);