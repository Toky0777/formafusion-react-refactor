import React, { createContext, useState, useContext } from 'react';

// Création du contexte
export const ProjectContext = createContext(null);

// Création du Provider (le composant qui fournira la valeur du contexte)
export const ProjectProvider = ({ children }) => {
 
  const [projetsapprfiltre, setProjetsApprfiltre] = useState({});

  return (
    <ProjectContext.Provider value={{ projetsapprfiltre, setProjetsApprfiltre }}>
      {children}
    </ProjectContext.Provider>
  );
};

// Création d'un hook personnalisé pour consommer facilement le contexte
export const useProjectContext = () => {
  return useContext(ProjectContext);
};