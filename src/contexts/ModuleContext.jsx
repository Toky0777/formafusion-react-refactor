import { createContext, useContext, useState } from "react";

const ModuleContext = createContext();

export function ModuleProvider({ children }) {
    const [idModule, setIdModule] = useState(() => {
        return localStorage.getItem("idModule") || null;
    });


    return (
        <ModuleContext.Provider value={{ idModule, setIdModule }}>
            {children}
        </ModuleContext.Provider>
    );
}

export function useModuleContext() {
    return useContext(ModuleContext);
}
