import { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { useSearch } from "../../../contexts/SearchCatalogContext";
import { ToastContainer } from 'react-toastify';
import { toast } from "react-toastify";
import StarRating from "../../../components/ui/StarRating";
import axios from "../../../config/axios";
import icons from "../../../components/icons/icone";
import { useStateContext } from "../../../contexts/ContextcatalogProvider";
import { Users, Clock, BookOpen, Trash } from 'lucide-react';
import { getThemeIcon } from "../../../utils/themeUtils";
import { getThemeColors } from "../../../utils/styleUtils";

export default function Catalogue() {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { searchTerm } = useSearch();
    const location = useLocation();
    const { ModuleComptes, updateModuleCounts, counts } = useStateContext();
    const [hasFetched, setHasFetched] = useState(false);

    const statusMap = {
        "/cfp/catalogue": 1,
        "/cfp/catalogue/preparation": 0,
        "/cfp/catalogue/corbeille": 2,
    };

    // Couleurs des niveaux...
    const levelColors = {
        'Intermédiaire': '#ECFCCB',
        'MasterClass': '#FFE4E6',
        'Fondamentaux': '#CCFBF1',
        'Avancée': '#DBEAFE',
    };

    const textColors = {
        'Intermédiaire': '#3F6253',
        'MasterClass': '#9F1276',
        'Fondamentaux': '#2388B6',
        'Avancée': '#4F40BC'
    };

    const fetchModules = useCallback(async () => {
        // Éviter les appels multiples
        if (hasFetched && location.pathname === window.location.pathname) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const status = statusMap[location.pathname] ?? 1;
            const response = await axios.get(`/cfp/modules/status/${status}`);
            console.log("tous les modules :", response.data.data);

            if (response.data && response.data.success) {
                const allDomains = response.data.data || [];
                const filteredDomains = allDomains.filter(
                    domaine => domaine.modules && domaine.modules.length > 0
                );
                setModules(filteredDomains);
                setHasFetched(true); // Marquer comme déjà fetché
            } else {
                console.error("Erreur dans la réponse du serveur");
            }
        } catch (error) {
            console.error("Erreur lors du chargement des modules :", error);
            // Gestion des erreurs...
        } finally {
            setLoading(false);
        }
    }, [location.pathname, hasFetched]);

    //changement de status
    const updateStatus = async (id, action) => {
        try {
            const response = await axios.patch(`/cfp/modules/${id}/${action}`, {});

            if (response.status === 200) {
                setModules(prev =>
                    prev.map(domaine => ({
                        ...domaine,
                        modules: domaine.modules.filter(mod => mod.idModule !== id)
                    })).filter(domaine => domaine.modules.length > 0)
                );

                toast.success("Mise à jour avec succès");

                // ✅ Mise à jour immédiate du compteur local
                if (action === "online") {
                    updateModuleCounts({
                        online: counts.online + 1,
                        offline: Math.max(counts.offline - 1, 0),
                    });
                } else if (action === "offline") {
                    updateModuleCounts({
                        offline: counts.offline + 1,
                        online: Math.max(counts.online - 1, 0),
                    });
                } else if (action === "trash") {
                    // Par exemple : un module passe en corbeille
                    updateModuleCounts({
                        trash: counts.trash + 1,
                        online: Math.max(counts.online - 1, 0),
                        offline: Math.max(counts.offline - 1, 0),
                    });
                }

                ModuleComptes();
            } else {
                toast.error("Erreur lors de la mise à jour");
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut:", error);

            if (error.response?.status === 401) {
                toast.error("Session expirée lors de la mise à jour");
            } else {
                toast.error("Erreur lors de la mise à jour du module");
            }
        }
    };

    const makeIsPublic = async (id) => {
        try {
            const response = await axios.patch(`/cfp/modules/make_is_public/${id}`, {});

            if (response.status === 200) {
                setModules(prev =>
                    prev.map(domaine => ({
                        ...domaine,
                        modules: domaine.modules.map(mod =>
                            mod.idModule === id ? { ...mod, is_public: 1 } : mod
                        ),
                    }))
                );


                toast.success("Module rendu public avec succès !");
            } else {
                console.log("Erreur lors de la mise à jour du module.");
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut:", error);
        }
    };


    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            fetchModules();
        }

        return () => {
            isMounted = false;
        };
    }, [location.pathname, fetchModules]);

    // Filtrage avec recherche
    const filteredModules = modules
        .map(domaine => ({
            ...domaine,
            modules: domaine.modules.filter(module => {
                const term = searchTerm.toLowerCase();
                return (
                    (module.moduleName?.toLowerCase() ?? '').includes(term) ||
                    (module.module_subtitle?.toLowerCase() ?? '').includes(term) ||
                    (module.description?.toLowerCase() ?? '').includes(term)
                );
            })
        }))
        .filter(domaine => domaine.modules.length > 0);
    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="p-4">
                {loading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <div className="text-center py-12">
                        <h2 className="text-lg font-medium text-gray-900 mb-2">Erreur</h2>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <button
                            onClick={fetchModules}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Réessayer
                        </button>
                    </div>
                ) : filteredModules.length > 0 ? (
                    filteredModules.map((domaine) => (
                        <div key={domaine.idDomaine} className="mb-8">
                            {/* En-tête du domaine */}
                            <div className="flex justify-between items-center w-full p-3 bg-gray-200  rounded-lg mt-5">
                                <h1 className="text-sm md:text-base  text-slate-950 truncate">
                                    {domaine.nomDomaine}
                                </h1>
                                <div className="px-3 py-1 text-xs text-gray-800">
                                    {domaine.modules.length} module{domaine.modules.length !== 1 ? 's' : ''}
                                </div>
                            </div>

                            {/* Grille des modules */}
                            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                                {domaine.modules.map((module, i) => {
                                    const averageRating = module.testSumQuality?.average || 0;
                                    const ratingCount = module.testSumQuality?.totalEmployees || 0;
                                    
                                    const themeIcon = module?.module_image
                                        ? getThemeIcon(module.module_image)
                                        : null;
                                    
                                      const IconComponent = themeIcon?.icon;
                                    
                                      const themeColors = getThemeColors();

                                    return (
                                        <li key={i} className="border border-gray-400 rounded-xl p-2">


                                            <div className="flex items-center justify-between p-2">
                                                <div key={module.idModule}>
                                                    {/* Icone et titre */}
                                                    <div className="flex items-center gap-2">
                                                        <h2 className="text-[12px] font-semibold text-gray-900 line-clamp-2 m-0">
                                                            {module.moduleName}
                                                        </h2>
                                                    </div>

                                                    <div className="mb-2 mt-2">
                                                        <span
                                                            className="text-xs px-2 py-1 rounded-lg"
                                                            style={{
                                                                backgroundColor:
                                                                    levelColors[module.module_level_name] || "#f1f5f9",
                                                                color:
                                                                    textColors[module.module_level_name] || "#334155"
                                                            }}
                                                        >
                                                            {module.module_level_name || "Aucun niveau"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {IconComponent && (
                                                    <div className="border border-blue-400 p-2 rounded-full">
                                                        <IconComponent className="w-6 h-6 text-blue-400" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Évaluations */}
                                            <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs sm:text-sm">
                                                <StarRating rating={averageRating} />
                                                <p className="text-gray-500">
                                                    {averageRating.toFixed(1)} ({ratingCount} avis)
                                                </p>
                                            </div>

                                            {/* Informations */}
                                            <div className="space-y-2 mb-4">
                                                <div className="flex justify-between items-center text-xs text-slate-600">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{module.dureeJ} jours ({module.dureeH}h)</span>
                                                    </div>
                                                    <span className="font-medium">
                                                        {parseInt(module.prix).toLocaleString('fr-FR')} Ar
                                                    </span>

                                                </div>

                                                <div className="flex justify-between">
                                                    <p className="text-slate-500 inline-flex items-center gap-1 text-xs sm:text-sm">
                                                        <Users className="w-4 h-4" /> {module.totalFormed} formé(s)
                                                    </p>
                                                </div>

                                                {/* Nombre de supprot*/}
                                                <div className="flex justify-between">
                                                    <p className="text-slate-500 inline-flex items-center gap-1 text-xs sm:text-sm">
                                                        <BookOpen className="w-4 h-4" /> {module.ressourceCount} Support de cours
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center justify-between gap-1 pt-4 border-t border-gray-200">
                                                {/* Bouton "Mettre en public" */}
                                                {Number(module.is_public) === 1 ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-2 bg-green-100 text-green-800 rounded-lg font-medium text-[12px]">
                                                        {/* <Globe className="w-4 h-4" /> */}
                                                        Cours en marketplace
                                                    </span>
                                                ) : (
                                                    <button
                                                        className="flex items-center gap-1 px-2 py-2 bg-slate-100 text-gray-500 rounded-lg font-medium text-[12px] transition-all duration-200 border border-gray-200"
                                                        title="Mettre en public"
                                                        onClick={() => makeIsPublic(module.idModule)}
                                                    >
                                                        {/* <Globe className="w-4 h-4" /> */}
                                                        Mettre en  marketplace
                                                    </button>
                                                )}


                                                {/* Icônes à droite */}
                                                <div className="flex items-center ">
                                                    <Link
                                                        to={`/cfp/catalogue/${module.idModule}/edit`}
                                                        className="p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                                        title="Voir les détails"
                                                        state={{ fromStatus: 'online' }}
                                                    >
                                                        <icons.eye className="w-4 h-4" />
                                                    </Link>

                                                    <button
                                                        className="p-2 rounded-md text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                                                        title="Mettre en préparation"
                                                        onClick={() => updateStatus(module.idModule, 'offline')}
                                                    >
                                                        <icons.settings className="w-4 h-4" />
                                                    </button>

                                                    <button
                                                        className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                                                        title="Mettre en corbeille"
                                                        onClick={() => updateStatus(module.idModule, 'trash')}
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))

                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            {searchTerm ? `Aucun résultat pour "${searchTerm}"` : 'Aucun module disponible pour ce statut.'}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}