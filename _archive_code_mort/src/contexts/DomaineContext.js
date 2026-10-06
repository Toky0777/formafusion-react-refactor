import { createContext, useContext, useState } from "react";
import domaines from "../components/domaineCatalogue/domaines";

const DomaineContext = createContext();

export function DomaineProvider({ children }) {
  const [domaine, setDomaines] = useState(domaines);

  const updateIcon = (idDomaine, newIcon) => {
    setDomaines(prev =>
      prev.map(d =>
        d.idDomaine === idDomaine ? { ...d, icone: newIcon } : d
      )
    );
  };

  return (
    <DomaineContext.Provider value={{ domaine, updateIcon }}>
      {children}
    </DomaineContext.Provider>
  );
}

export const useDomaines = () => useContext(DomaineContext);
