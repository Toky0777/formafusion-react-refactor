// filterContext.jsx
import { createContext, useContext, useState } from "react";

// Création du contexte
export const FilterAttendanceContext = createContext();

// Fournisseur de contexte
export const FilterAttendanceProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false); // modal fermé par défaut

  // Fonction utilitaire pour toggler l'ouverture
  const toggleModal = () => setIsOpen((prev) => !prev);

  return (
    <FilterAttendanceContext.Provider value={{ isOpen, setIsOpen, toggleModal }}>
      {children}
    </FilterAttendanceContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useFilter = () => useContext(FilterAttendanceContext);
