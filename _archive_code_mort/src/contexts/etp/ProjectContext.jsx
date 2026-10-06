import { createContext, useContext, useState } from "react";

const ProjetContext = createContext();

export function useProjets() {
  return useContext(ProjetContext);
}

export function ProjetProvider({ children }) {
  const [projets, setProjets] = useState({ preparation: [], future: [], progress: [], finished: [], fenced: [] });

  return (
    <ProjetContext.Provider value={{ projets, setProjets }}>
      {children}
    </ProjetContext.Provider>
  );
}
