import { createContext, useContext, useState, useEffect } from "react";
import axios from "../config/axios";

const StateContext = createContext({
    token: null,
    counts: { online: 0, offline: 0, trash: 0, isLoading: true },
});

export const ContextProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);

    const [onlineModules, setOnlineModules] = useState([]);

    const [counts, setCounts] = useState(() => {
        return JSON.parse(localStorage.getItem("moduleCounts")) || {
            online: 0,
            offline: 0,
            trash: 0,
            isLoading: true,
        };
    });

    const updateModuleCounts = (newCounts) => {
        if (!newCounts || Object.keys(newCounts).length === 0) return; // <-- AJOUTÉ
        const updated = { ...counts, ...newCounts, isLoading: false };
        setCounts(updated);
        localStorage.setItem("moduleCounts", JSON.stringify(updated));
    };


    const ModuleComptes = async () => {
        if (!token) return;
        try {
            const res = await axios.get("/cfp/modules", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data && (res.data.counts.online !== undefined || res.data.counts.offline !== undefined || res.data.counts.trash !== undefined)) {
                updateModuleCounts({
                    online: res.data.counts.online ?? counts.online,
                    offline: res.data.counts.offline ?? counts.offline,
                    trash: res.data.counts.trash ?? counts.trash,
                });
            }

        } catch (error) {
            console.error("Erreur lors de la récupération des counts:", error);
        }
    };

    const handleSetToken = (newToken) => {
        setToken(newToken);
        if (newToken) localStorage.setItem("token", newToken);
        else localStorage.removeItem("token");
    };

    const addModuleToOnline = async (idModule) => {
        try {
            const res = await axios.get(`/cfp/modules/${idModule}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data?.success) {
                const moduleData = res.data.data;

                setOnlineModules(prev => {
                    const domaineIndex = prev.findIndex(d => d.idDomaine === moduleData.idDomaine);
                    if (domaineIndex > -1) {
                        // Ajouter dans le domaine existant
                        prev[domaineIndex].modules.push(moduleData);
                        return [...prev];
                    } else {
                        // Créer un nouveau domaine si inexistant
                        return [...prev, { ...moduleData, modules: [moduleData] }];
                    }
                });
            }
        } catch (err) {
            console.error("Erreur lors de l'ajout du module en ligne:", err);
        }
    };
    useEffect(() => {
        if (token) {
            ModuleComptes();
        }
    }, [token]);

    return (
        <StateContext.Provider
            value={{
                token,
                setToken: handleSetToken,
                counts,
                updateModuleCounts,
                ModuleComptes,
                onlineModules,          // ⚡ exposer l’état en ligne
                addModuleToOnline,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
