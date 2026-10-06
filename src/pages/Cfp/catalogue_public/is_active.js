import { useEffect, useState, useCallback } from "react";
import { Link, useOutletContext } from "react-router-dom";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { ToastContainer, toast } from "react-toastify";
import StarRating from "../../../components/ui/StarRating";
import axios from "../../../config/axios";
import icons from "../../../components/icons/icone";
import { getThemeIcon } from "../../../utils/themeUtils";
import { getThemeColors } from "../../../utils/styleUtils";

export default function CatalogueOnlineActive() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState({});
  const { search, refreshModuleCount } = useOutletContext();

  const levelColors = {
    Intermédiaire: "#ECFCCB",
    MasterClass: "#FFE4E6",
    Fondamentaux: "#CCFBF1",
    Avancée: "#DBEAFE",
  };
  const textColors = {
    Intermédiaire: "#3F6253",
    MasterClass: "#9F1276",
    Fondamentaux: "#2388B6",
    Avancée: "#4F40BC",
  };

  // Fetch tous les modules
  const fetchModules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/cfp/modules/module_public_by_status/1`, {
        params: { search },
      });

      if (response.data?.success) {
        const allDomains = response.data.data || [];
        setModules(allDomains.filter((d) => d.modules && d.modules.length > 0));
      } else {
        setModules([]);
      }
    } catch (err) {
      setError("Erreur lors du chargement des modules");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const delay = setTimeout(() => fetchModules(), 400);
    return () => clearTimeout(delay);
  }, [search, fetchModules]);

  // Recharger un seul domaine par idDomaine
  const fetchDomain = async (idDomaine) => {
    try {
      const response = await axios.get(`/cfp/modules/module_public_by_status/1`, {
        params: { search },
      });

      if (response.data?.success) {
        const updatedDomain = response.data.data.find(d => d.idDomaine === idDomaine);
        if (updatedDomain) {
          setModules(prev =>
            prev.map(d => (d.idDomaine === idDomaine ? updatedDomain : d))
              .filter(d => d.modules && d.modules.length > 0)
          );
        } else {
          // Si le domaine n'a plus de module, on le supprime
          setModules(prev => prev.filter(d => d.idDomaine !== idDomaine));
        }
      }
    } catch (err) {
      console.error("Erreur lors du rafraîchissement du domaine:", err);
    }
  };

  const updateStatus = async (idModule, action, idDomaine) => {
    try {
      const response = await axios.patch(`/cfp/modules/${idModule}/${action}`, {});
      if (response.status === 200) {
        toast.success("Mise à jour avec succès");
        fetchDomain(idDomaine);
        if (refreshModuleCount) refreshModuleCount();
      } else {
        toast.error("Erreur lors de la mise à jour");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.status === 401 ? "Session expirée" : "Erreur lors de la mise à jour");
    }
  };

  const handleHideModule = async (idModule) => {
    try {
      await axios.patch(`/cfp/modules/make_is_restore/${idModule}`); // back-end: is_public = 0

      // Supprimer le module de l'état local (ne plus l'afficher)
      setModules(prev =>
        prev.map(domaine => ({
          ...domaine,
          modules: domaine.modules.filter(mod => mod.idModule !== idModule)
        })).filter(domaine => domaine.modules.length > 0)
      );

      if (refreshModuleCount) refreshModuleCount(); // rafraîchir compteur si nécessaire
      toast.success("Module masqué avec succès");
    } catch (error) {
      console.error("Erreur lors du masquage :", error);
      toast.error("Erreur lors du masquage");
    }
  };


  const filteredModules = modules
    .map(domaine => ({
      ...domaine,
      modules: domaine.modules.filter(module => {
        const term = search?.toLowerCase() || "";
        return (
          module.moduleName?.toLowerCase().includes(term) ||
          module.module_subtitle?.toLowerCase().includes(term) ||
          module.description?.toLowerCase().includes(term)
        );
      }),
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
          filteredModules.map(domaine => (
            <div key={domaine.idDomaine} className="mb-8">
              <div className="flex justify-between items-center w-full p-3 bg-gray-300 rounded-lg mt-5">
                <h1 className="text-sm md:text-base font-semibold text-slate-950 truncate">
                  {domaine.nomDomaine}
                </h1>
                <div className="px-3 py-1 text-xs text-gray-800">
                  {domaine.modules.length} module{domaine.modules.length !== 1 ? "s" : ""}
                </div>
              </div>

              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                {domaine.modules.map(module => {
                  const qualityScore = module.sumQuality || 0;
                  const averageRating = module.testSumQuality?.average || 0;
                  const ratingCount = module.testSumQuality?.totalEmployees || 0;
                  console.log(module?.module_image)
                  const themeIcon = module?.module_image
                    ? getThemeIcon(module.module_image)
                    : null;

                  const IconComponent = themeIcon?.icon;

                  const themeColors = getThemeColors();
                  return (
                    <li key={module.idModule} className="border border-gray-400 rounded-xl p-2">

                      <div key={module.idModule} className="flex items-center justify-between gap-2">
                        {/* Icone et titre */}
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

                      </div>

                      <div className="flex items-center gap-2 mb-2 p-2 text-gray-500 text-xs sm:text-sm">
                        <StarRating rating={averageRating} />
                        <p className="text-gray-500">{averageRating.toFixed(1)} ({ratingCount} avis)</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs text-slate-600 px-2">
                          <div className="flex items-center gap-1">
                            <icons.clock className="w-3 h-3" />
                            <span>{module.dureeJ} jours ({module.dureeH}h)</span>
                          </div>
                          <span className="font-medium"> {parseInt(module.prix).toLocaleString('fr-FR')} Ar</span>
                        </div>

                        <div className="flex justify-between p-2">
                          <p className="text-slate-500 inline-flex items-center gap-1 text-xs sm:text-sm">
                            <icons.users /> {module.totalFormed} formé(s)
                          </p>
                        </div>

                        <div className="flex justify-between p-2">
                          <p className="text-slate-500 inline-flex items-center gap-1 text-xs sm:text-sm">
                            <icons.bookOpen /> {module.ressourceCount} Support de cours
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 border-t border-gray-100 translate-y-2 p-2">

                        <button
                          className=" px-4 py-2 bg-green-100 text-green-700 rounded-lg text-[10px]  border border-green-200"
                          title="Mettre en public"
                          onClick={() => handleHideModule(module.idModule)}
                        >
                          Ne plus afficher dans le marketplace
                        </button>
                        <Link
                          to={`/cfp/catalogue/${module.idModule}/edit`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg text-[10px] font-medium transition-all duration-200"
                          title="Voir les détails"
                          state={{ fromStatus: "online" }}
                        >
                          <icons.eye className="w-4 h-4" />
                          Détails
                        </Link>

                        {/* <button
                          className="p-2 rounded-md text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                          title="Mettre en privé"
                          onClick={() => makeIsPrivate(module.idModule, module.idDomaine)}
                        >
                          <icons.private className="w-4 h-4" />
                        </button>

                        <button
                          className="p-2 rounded-md text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                          title="Mettre en préparation"
                          onClick={() => updateStatus(module.idModule, "offline", module.idDomaine)}
                        >
                          <icons.inPreparation className="w-4 h-4" />
                        </button> */}

                        {/* <button
                          className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                          title="Restaurer dans le catalogue interne"
                          onClick={() => handleRestore(module.idModule, module.idDomaine)}
                        >
                          <icons.restore className="w-4 h-4" />
                        </button> */}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <h2 className="text-gray-500 mb-2">Aucun module en ligne </h2>
            {/* <p className="text-gray-500">Aucun resultat</p> */}
          </div>
        )}
      </div>
    </>
  );
}
