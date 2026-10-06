import { createContext, useState, useContext } from 'react';

// Création du contexte
export const ProjectLearnerContext = createContext(null);

// Création du Provider (le composant qui fournira la valeur du contexte)
export const ProjectLearnerProvider = ({ children }) => {

    const [projetsapprfiltre, setProjetsApprfiltre] = useState({});

    return (
        <ProjectLearnerContext.Provider value={{ projetsapprfiltre, setProjetsApprfiltre }}>
            {children}
        </ProjectLearnerContext.Provider>
    );
};

// Création d'un hook personnalisé pour consommer facilement le contexte
export const useProjectLearnerContext = () => {
    return useContext(ProjectLearnerContext);
};