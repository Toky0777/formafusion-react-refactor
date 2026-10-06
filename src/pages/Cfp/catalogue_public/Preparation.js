import { useEffect, useState, useCallback } from "react";
import { Link, useOutletContext } from "react-router-dom";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { ToastContainer, toast } from "react-toastify";
import StarRating from "../../../components/ui/StarRating";
import axios from "../../../config/axios";
import icons from "../../../components/icons/icone";
import { IMAGE_URL } from "../../../config/env";

export default function CatalogueInPreparationOnline() {
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
      const response = await axios.get(`/cfp/modules/module_public_by_status/0`, {
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

  const fetchDomain = async (idDomaine) => {
    try {
      const response = await axios.get(`/cfp/modules/module_public_by_status/0`, {
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

  const makeIsPrivate = async (idModule, idDomaine) => {
    try {
      const response = await axios.patch(`/cfp/modules/make_is_private/${idModule}`, {});
      if (response.status === 200) {
        toast.success("Module mis en privé avec succès");
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

                  return (
                    <li key={module.idModule}>
                      <div className="w-full h-40 bg-gray-300 rounded-lg flex items-center justify-center mb-5 overflow-hidden">
                        {module.module_image && !imageError[module.idModule] ? (
                          <img
                            src={`${IMAGE_URL}/img/modules/${module.module_image}`}
                            alt={module.moduleName}
                            className="w-full h-full object-cover rounded-lg"
                            onError={() => setImageError(prev => ({ ...prev, [module.idModule]: true }))}
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">Illustration</span>
                        )}
                      </div>

                      <span
                        className="inline-block font-bold text-xs px-4 py-2 rounded-lg mb-3"
                        style={{
                          backgroundColor: levelColors[module.module_level_name] || "#f1f5f9",
                          color: textColors[module.module_level_name] || "#334155",
                        }}
                      >
                        {module.module_level_name || "Aucun niveau"}
                      </span>

                      <h2 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                        {module.moduleName}
                      </h2>

                      <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs sm:text-sm">
                        <StarRating rating={averageRating} />
                        <p className="text-gray-500">{averageRating.toFixed(1)} ({ratingCount} avis)</p>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center text-xs text-slate-600">
                          <div className="flex items-center gap-1">
                            <icons.clock className="w-3 h-3" />
                            <span>{module.dureeJ} jours ({module.dureeH}h)</span>
                          </div>
                          <span className="font-medium">{parseInt(module.prix)} Ar</span>
                        </div>

                        <div className="flex justify-between">
                          <p className="text-slate-500 inline-flex items-center gap-1 text-xs sm:text-sm">
                            <icons.users /> {module.totalFormed} formé(s)
                          </p>
                        </div>

                        <div className="flex justify-between">
                          <p className="text-slate-500 inline-flex items-center gap-1 text-xs sm:text-sm">
                            <icons.bookOpen /> {module.ressourceCount} Support de cours
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-300 translate-y-2">
                        <Link
                          to={`/cfp/catalogue/${module.idModule}/edit`}
                          className="p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                          title="Voir les détails"
                          state={{ fromStatus: "online" }}
                        >
                          <icons.eye className="w-4 h-4" />
                        </Link>

                        <button
                          className="p-2 rounded-md text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                          title="Mettre en privé"
                          onClick={() => makeIsPrivate(module.idModule, module.idDomaine)}
                        >
                          <icons.private className="w-4 h-4" />
                        </button>

                        <button
                          className="p-2 rounded-md text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                          title="Mettre en préparation"
                          onClick={() => updateStatus(module.idModule, "online", module.idDomaine)}
                        >
                          <icons.isActive className="w-4 h-4" />
                        </button>

                        <button
                          className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                          title="Mettre en corbeille"
                          onClick={() => updateStatus(module.idModule, "trash", module.idDomaine)}
                        >
                          <icons.trash className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Aucun module trouvé</h2>
            <p className="text-gray-500">Aucun resultat</p>
          </div>
        )}
      </div>
    </>
  );
}
