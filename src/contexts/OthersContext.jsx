import { createContext, useContext, useState } from "react";

const OthersContext = createContext();

export const useOthersContext = () => useContext(OthersContext);

export const OthersContextProvider = ({ children }) => {
  const [etps, setEtps] = useState([]);
  const [cfps, setCfps] = useState([]);
  const [filteredEtps, setFilteredEtps] = useState([]);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

  return (
    <OthersContext.Provider
      value={{
        etps,
        setEtps,
        cfps,
        setCfps,
        filteredEtps,
        setFilteredEtps,
        isAdvancedFiltersOpen,
        setIsAdvancedFiltersOpen,
      }}
    >
      {children}
    </OthersContext.Provider>
  );
};
