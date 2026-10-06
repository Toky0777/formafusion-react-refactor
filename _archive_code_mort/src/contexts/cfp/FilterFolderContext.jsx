import React, { createContext, useState } from 'react';

export const FilterFolderContext = createContext();

export const FilterFolderProvider = ({ children }) => {
  // Initialise selectedYear à null pour que "Toutes les années" soit la valeur par défaut.
  // activeMonth est déjà null par défaut, ce qui correspond à "Tous les mois".
  const [selectedYear, setSelectedYear] = useState(null);
  const [activeMonth, setActiveMonth] = useState(null);

  return (
    <FilterFolderContext.Provider value={{
      selectedYear,
      setSelectedYear,
      activeMonth,
      setActiveMonth
    }}>
      {children}
    </FilterFolderContext.Provider>
  );
};
