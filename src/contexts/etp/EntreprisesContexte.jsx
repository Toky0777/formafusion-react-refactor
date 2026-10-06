// /src/contexte/EntreprisesContexte.js

import { createContext, useContext, useState } from 'react';

const EntreprisesContext = createContext();

export const EntreprisesProvider = ({ children }) => {
    const [entreprises, setEntreprises] = useState([]); // Définissez l'état ici

    return (
        <EntreprisesContext.Provider value={{ entreprises, setEntreprises }}>
            {children}
        </EntreprisesContext.Provider>
    );
};

export const useEntreprises = () => useContext(EntreprisesContext);