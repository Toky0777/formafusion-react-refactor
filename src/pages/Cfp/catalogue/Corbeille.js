import { useEffect, useState } from "react";
import axios from "../../../config/axios";
import icons from "../../../components/icons/icone";
import { useSearch } from "../../../contexts/SearchCatalogContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import StarRating from "../../../components/ui/StarRating";
import { useStateContext } from "../../../contexts/ContextcatalogProvider";
import iconeAddCatalogue from "../../../components/icones ajout catalogue/iconeAddCatalogue";

export default function Corbeille() {
    const [loading, setLoading] = useState(true);
    const [modules, setModules] = useState([]);
    const { searchTerm } = useSearch();
    const location = useLocation();
    const [imageError, setImageError] = useState({});
    const { ModuleComptes, updateModuleCounts, counts } = useStateContext();

    const statusMap = {
        "/cfp/catalogue": 1,
        "/cfp/catalogue/preparation": 0,
        "/cfp/catalogue/corbeille": 2,
    };

    // Couleurs des niveaux
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

    // Charger les modules
    const fetchModules = async () => {
        setLoading(true);
        try {
            const status = statusMap[location.pathname] ?? 2;
            const response = await axios.get(`/cfp/modules/status/${status}`);

            if (response.data && response.data.success) {
                const allDomains = response.data.data || [];
                const filteredDomains = allDomains.filter(
                    domaine => domaine.modules && domaine.modules.length > 0
                );
                setModules(filteredDomains);
            } else {
                toast.error("Erreur lors du chargement des données");
            }
        } catch (error) {
            console.error("Erreur lors du chargement des modules :", error);
            toast.error("Erreur de chargement des modules");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModules();
    }, [location.pathname]);

    // Suppression définitive
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`/cfp/modules/${id}/destroy`);

            if (response.data.status === 200) {
                // Mettre à jour l'état local pour supprimer le module visuellement
                setModules(prev =>
                    prev.map(domaine => ({
                        ...domaine,
                        modules: domaine.modules.filter(mod => mod.idModule !== id)
                    })).filter(domaine => domaine.modules.length > 0)
                );
                toast.success("Suppression réussie");

                updateModuleCounts({
                    trash: Math.max(counts.trash - 1, 0),
                    online: counts.online,
                    offline: counts.offline,
                });

                ModuleComptes();
            } else {
                toast.error(response.data.message || "Échec de la suppression");
            }
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            toast.error("Erreur lors de la suppression");
        }
    };

    // Restaurer
    const handleRestore = async (idModule, targetStatus = 1) => {
        try {
            await axios.patch(`/cfp/modules/${idModule}/restore`, { status: targetStatus });

            // Supprimer le module restauré de l'état local (corbeille)
            setModules(prev =>
                prev.map(domaine => ({
                    ...domaine,
                    modules: domaine.modules.filter(mod => mod.idModule !== idModule)
                })).filter(domaine => domaine.modules.length > 0)
            );

            // Mettre à jour les compteurs selon le statut restauré
            const newCounts = { ...counts, trash: Math.max(counts.trash - 1, 0) };
            if (targetStatus === 1) newCounts.online += 1;
            else if (targetStatus === 0) newCounts.offline += 1;

            updateModuleCounts(newCounts);

            toast.success("Module restauré avec succès !");
            await ModuleComptes();
        } catch (error) {
            console.error("Erreur lors de la restauration :", error);
            toast.error("Erreur lors de la restauration");
        }
    };



    const handleImageError = (moduleId) => {
        setImageError(prev => ({
            ...prev,
            [moduleId]: true
        }));
    };

    // Filtrage avec recherche
    const filteredModules = modules
        .map(domaine => ({
            ...domaine,
            modules: domaine.modules.filter(module => {
                const term = searchTerm.toLowerCase();
                return (
                    (module.moduleName?.toLowerCase().includes(term)) ||
                    (module.module_subtitle?.toLowerCase().includes(term)) ||
                    (module.description?.toLowerCase().includes(term))
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
                ) : modules && modules.length > 0 ? (
                    filteredModules
                        .filter((domaine) =>
                            domaine.nomDomaine?.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((domaine) => (
                            <div key={domaine.idDomaine} className="mb-8">
                                {/* En-tête du domaine */}
                                <div className="flex justify-between items-center w-full p-3 bg-gray-300 rounded-lg mt-5">
                                    <h1 className="text-sm md:text-base font-semibold text-slate-950 truncate">
                                        {domaine.nomDomaine || 'Domaine inconnu'}
                                    </h1>
                                    <div className="px-3 py-1 text-xs text-gray-800">
                                        {domaine.modules?.length || 0} module{domaine.modules?.length !== 1 ? 's' : ''}
                                    </div>
                                </div>

                                {/* Grille responsive des modules */}
                                {domaine.modules && domaine.modules.length > 0 ? (
                                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                                        {domaine.modules.map((module) => {
                                            const image = module.module_image;
                                            const isValidImage = image && /\.(jpg|jpeg|png|webp)$/i.test(image);
                                            const qualityScore = module.sumQuality || 0;
                                            const qualityPercentage = Math.round((qualityScore / 6) * 100);
                                            const clampedQualityPercentage = Math.min(qualityPercentage, 100);
                                            const averageRating = module.testSumQuality?.average || 0;
                                            const ratingCount = module.testSumQuality?.totalEmployees || 0;
                                            const IconComponent = module.module_image ? iconeAddCatalogue[module.module_image] : null;
                                            return (
                                                <li
                                                    key={module.idModule}
                                                    className="bg-white shadow-lg rounded-xl p-4 border border-gray-200 transition-all duration-300 hover:shadow-xl"
                                                >
                                                    <div key={module.idModule} className="flex items-center justify-between gap-2">
                                                        {/* Icone et titre */}
                                                        <div className="flex items-center gap-2">
                                                            {IconComponent && (
                                                                <IconComponent className="w-4 h-4 text-blue-400" />
                                                            )}
                                                            <h2 className="text-sm font-semibold text-gray-900 line-clamp-2 m-0">
                                                                {module.moduleName}
                                                            </h2>
                                                        </div>

                                                        {/* Niveau à droite */}
                                                        <span className="font-bold text-xs px-4 py-2 rounded-lg" style={{ backgroundColor: levelColors[module.module_level_name] || '#f1f5f9', color: textColors[module.module_level_name] || '#334155' }} >
                                                            {module.module_level_name || 'Aucun niveau'}
                                                        </span>

                                                    </div>

                                                    {/* Titre du module */}
                                                    <div className="mb-2 mt-4">
                                                        <h2 className="text-sm font-semibold text-gray-900 line-clamp-2">
                                                            {module.moduleName}
                                                        </h2>
                                                    </div>

                                                    {/* Évaluations */}
                                                    <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs sm:text-sm">
                                                        <StarRating rating={averageRating} />
                                                        <p className="text-gray-500">
                                                            {averageRating.toFixed(1)} ({ratingCount} avis)
                                                        </p>
                                                    </div>

                                                    {/* Informations du module */}
                                                    <div className="space-y-2 mb-4">
                                                        <div className="flex justify-between items-center text-xs text-slate-600">
                                                            <div className="flex items-center gap-1">
                                                                <icons.clock className="w-3 h-3" />
                                                                <span>{module.dureeJ} jours ({module.dureeH}h)</span>
                                                            </div>
                                                            <span className="font-medium">
                                                                {parseInt(module.prix)} Ar
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-1 text-xs text-slate-600">
                                                            <icons.users className="w-3 h-3" />
                                                            <span>{module.totalFormed} formé{module.totalFormed !== 1 ? 's' : ''}</span>
                                                        </div>
                                                        {/* Nombre de supprot*/}
                                                        <div className="flex justify-between">
                                                            <p className="text-slate-500 inline-flex items-center gap-1 text-xs sm:text-sm">
                                                                <icons.bookOpen /> {module.ressourceCount} Support de cours
                                                            </p>
                                                        </div>

                                                        {/* Barre de qualité */}
                                                        <div className="relative w-full bg-gray-200 rounded-lg h-4 overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-lg transition-all duration-300 ${clampedQualityPercentage < 30 ? 'bg-red-600' :
                                                                    clampedQualityPercentage < 70 ? 'bg-yellow-500' :
                                                                        'bg-green-500'
                                                                    }`}
                                                                style={{ width: `${clampedQualityPercentage}%` }}
                                                            ></div>
                                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xs font-semibold">
                                                                {clampedQualityPercentage}%
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 translate-y-2">
                                                        <Link
                                                            to={`/cfp/catalogue/${module.idModule}/edit`}
                                                            className="p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                                            title="Voir les détails"
                                                            state={{ fromStatus: 'trash' }}
                                                        >
                                                            <icons.eye className="w-4 h-4" />
                                                        </Link>

                                                        <button
                                                            className="p-2 rounded-md text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                                                            title="Restaurer le module"
                                                            onClick={() => handleRestore(module.idModule)}
                                                        >
                                                            <icons.restore className="w-4 h-4" />
                                                        </button>

                                                        <button
                                                            className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                                                            title="Supprimer définitivement"
                                                            onClick={() => handleDelete(module.idModule)}
                                                        >
                                                            <icons.trash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p className="text-center text-gray-500 mt-4 py-8">
                                        Aucun module disponible dans ce domaine.
                                    </p>
                                )}
                            </div>
                        ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            {searchTerm ?
                                `Aucun résultat pour "${searchTerm}"` :
                                'Aucun module dans la corbeille.'
                            }
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}