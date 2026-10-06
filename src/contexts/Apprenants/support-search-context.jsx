import { createContext, useContext, useState } from "react";

// Création du contexte
const SearchContext = createContext();

// Fournisseur du contexte
export function SupportSearchProvider({ children }) {
  const [search, setSearch] = useState("");

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useSearchSupport() {
  return useContext(SearchContext);
}
