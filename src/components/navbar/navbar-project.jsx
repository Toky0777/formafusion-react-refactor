import { useState, useEffect } from "react";
import { FaFilter, FaChevronUp, FaChevronDown, FaXmark } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCreation from "../drawer/project/project-creation";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/ui/loading-spinner";
import { FaPlus, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { API_URL } from "../../config/env";

const NavBarProject = ({
  fetchProjets,
  selectedEntreprises,
  setSelectedEntreprises,
  selectedVilles,
  setSelectedVilles,
  selectedTypes,
  setSelectedTypes,
  selectedPeriodes,
  selectedModules,
  selectedFormateur,
  setSelectedModules,
  selectedFinancements,
  setSelectedFinancements,
  setSelectedFormateur,
  setSelectedPeriodes,
  onResetFilters,
  searchQuery,
  onSearch,
}) => {
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPage, setShowPage] = useState(false);
  const [projetFilter, setProjetFilter] = useState({
    etps: [],
    financements: [],
    formateurs: [],
    modules: [],
    months: [],
    projets: [],
    status: [],
    types: [],
    villes: [],
  });

  const [showEntreprises, setShowEntreprises] = useState(false);
  const [showTypes, setShowTypes] = useState(false);
  const [showModules, setShowModules] = useState(false);
  const [showVilles, setShowVilles] = useState(false);
  const [showFinancements, setShowFinancements] = useState(false);
  const [showPeriodes, setShowPeriodes] = useState(false);
  const [showFormateur, setShowFormateur] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEntreprises && !event.target.closest(".group")) {
        setShowEntreprises(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEntreprises]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTypes && !event.target.closest(".group")) {
        setShowTypes(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTypes]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showModules && !event.target.closest(".group")) {
        setShowModules(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModules]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showVilles && !event.target.closest(".group")) {
        setShowVilles(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showVilles]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFinancements && !event.target.closest(".group")) {
        setShowFinancements(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFinancements]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPeriodes && !event.target.closest(".group")) {
        setShowPeriodes(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPeriodes]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFormateur && !event.target.closest(".group")) {
        setShowFormateur(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFormateur]);

  const filterItem = async () => {
    try {
      const response = await fetch(
        `${API_URL}/cfp/projets/filter/getDropdownItem`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Réponse non-JSON: ${text.substring(0, 100)}...`);
      }

      const data = await response.json();
      setProjetFilter(data);
    } catch (error) {
      console.error("Détails de l'erreur:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    filterItem();
  }, []);

  return (
    <>
      <nav className="w-full bg-white shadow-sm">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 gap-4">
            {/* Logo et titre */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-600">Projets</h1>

              {/* Bouton menu mobile pour filtres */}
              <button
                onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700"
              >
                <FaFilter className="w-4 h-4" />
                <span>Filtres</span>
              </button>
            </div>

            <div className="w-full lg:flex-1 lg:max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un projet..."
                  value={searchQuery || ""}
                  onChange={(e) => onSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearch("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg
                      className="h-4 w-4 text-gray-400 hover:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Actions à droite */}
            <div className="flex items-center justify-between lg:justify-end gap-3">
              {/* Bouton filtres avancés - Desktop uniquement */}
              <button
                onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
                className={`
                                    hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                    ${
                                      isAdvancedFiltersOpen
                                        ? "bg-purple-100 text-purple-700 ring-2 ring-purple-200"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }
                                `}
              >
                <FaFilter className="w-4 h-4" />
                <span>Filtres</span>
                {isAdvancedFiltersOpen ? (
                  <FaChevronUp className="w-4 h-4" />
                ) : (
                  <FaChevronDown className="w-4 h-4" />
                )}
              </button>

              {/* Bouton nouveau projet */}
              <Link
                to="/cfp/nouveau_projet"
                className="flex items-center gap-2 px-4 lg:px-6 py-2 bg-gradient-to-r from-gray-400 to-gray-400 hover:from-gray-500 hover:to-gray-500 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                <FaPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Nouveau projet</span>
                <span className="sm:hidden">Nouveau</span>
              </Link>
            </div>
          </div>

          {/* Filtres avancés (collapsible) */}
          {isAdvancedFiltersOpen && (
            <div className="border-t border-gray-200 bg-gradient-to-br from-slate-50 to-white px-4 sm:px-6 py-6 sm:py-8">
              <div className="max-w-7xl mx-auto">
                {/* Header avec animation */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                      Filtres avancés
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsAdvancedFiltersOpen(false)}
                    className="group p-2 hover:bg-red-50 rounded-xl transition-all duration-300 border border-transparent hover:border-red-100"
                  >
                    <FaXmark className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
                  </button>
                </div>

                {/* Grid de filtres avec design moderne */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {/* Filtre Entreprise */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Entreprise
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowEntreprises(!showEntreprises)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm bg-white shadow-sm hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 cursor-pointer flex items-center justify-between"
                      >
                        <span className="text-gray-700">
                          {selectedEntreprises.length === 0
                            ? "Toutes les entreprises"
                            : `${selectedEntreprises.length} entreprise(s) sélectionnée(s)`}
                        </span>
                        <svg
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            showEntreprises ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Dropdown personnalisé */}
                      {showEntreprises && (
                        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                          {/* Option "Toutes les entreprises" */}
                          <div
                            onClick={() => {
                              setSelectedEntreprises([]);
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-100"
                          >
                            <div className="flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded hover:border-purple-500 transition-colors flex-shrink-0">
                              {selectedEntreprises.length === 0 && (
                                <svg
                                  className="w-3 h-3 text-purple-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm text-gray-700 font-medium">
                              Toutes les entreprises
                            </span>
                          </div>

                          {/* Liste des entreprises */}
                          {projetFilter.etps.map((e, i) => {
                            const entrepriseId = e.idEtp ?? i;
                            const entrepriseName = e.etp_name;
                            const isSelected =
                              selectedEntreprises.includes(entrepriseId);

                            return (
                              <div
                                key={entrepriseId}
                                onClick={() => {
                                  setSelectedEntreprises((prev) => {
                                    if (prev.includes(entrepriseId)) {
                                      return prev.filter(
                                        (id) => id !== entrepriseId
                                      );
                                    } else {
                                      return [...prev, entrepriseId];
                                    }
                                  });
                                }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 cursor-pointer transition-colors group/item"
                              >
                                {/* Checkbox personnalisé */}
                                <div
                                  className={`flex items-center justify-center w-5 h-5 border-2 rounded transition-all flex-shrink-0 ${
                                    isSelected
                                      ? "bg-purple-600 border-purple-600"
                                      : "border-gray-300 group-hover/item:border-purple-500"
                                  }`}
                                >
                                  {isSelected && (
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 
                                                                8a1 1 0 01-1.414 0l-4-4a1 1 
                                                                0 011.414-1.414L8 12.586l7.293-7.293a1 1 
                                                                0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </div>

                                {/* Nom entreprise */}
                                <span className="text-sm text-gray-700 flex-1">
                                  {entrepriseName && (
                                    <span>{entrepriseName}</span>
                                  )}
                                </span>

                                {/* Petit point violet si sélectionné */}
                                {isSelected && (
                                  <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Filtre Type de projet */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Type de projet
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowTypes(!showTypes)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm bg-white shadow-sm hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer flex items-center justify-between"
                      >
                        <span className="text-gray-700">
                          {selectedTypes.length === 0
                            ? "Tous les types"
                            : `${selectedTypes.length} type(s) sélectionné(s)`}
                        </span>
                        <svg
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            showTypes ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Dropdown personnalisé */}
                      {showTypes && (
                        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                          {/* Option "Tous les types" */}
                          <div
                            onClick={() => setSelectedTypes([])}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100"
                          >
                            <div className="flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded hover:border-blue-500 transition-colors flex-shrink-0">
                              {selectedTypes.length === 0 && (
                                <svg
                                  className="w-3 h-3 text-blue-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 
                                                    12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm text-gray-700 font-medium">
                              Tous les types
                            </span>
                          </div>

                          {/* Liste des types */}
                          {projetFilter.types.map((t, i) => {
                            const idTypes = t.project_type;
                            return (
                              <div
                                key={idTypes}
                                onClick={() => {
                                  setSelectedTypes((prev) => {
                                    if (prev.includes(idTypes)) {
                                      return prev.filter(
                                        (id) => id !== idTypes
                                      );
                                    } else {
                                      return [...prev, idTypes];
                                    }
                                  });
                                }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors group/item"
                              >
                                {/* Checkbox personnalisé */}
                                <div
                                  className={`flex items-center justify-center w-5 h-5 border-2 rounded transition-all flex-shrink-0 ${
                                    selectedTypes.includes(idTypes)
                                      ? "bg-blue-600 border-blue-600"
                                      : "border-gray-300 group-hover/item:border-blue-500"
                                  }`}
                                >
                                  {selectedTypes.includes(idTypes) && (
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 
                                                            8a1 1 0 01-1.414 0l-4-4a1 1 
                                                            0 011.414-1.414L8 12.586l7.293-7.293a1 1 
                                                            0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </div>

                                {/* Nom type projet */}
                                <span className="text-sm text-gray-700 flex-1">
                                  {t.project_type}
                                </span>

                                {/* Petit point bleu si sélectionné */}
                                {selectedTypes.includes(idTypes) && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Filtre Cours */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      Cours
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowModules(!showModules)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm bg-white shadow-sm hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 cursor-pointer flex items-center justify-between"
                      >
                        <span className="text-gray-700">
                          {selectedModules.length === 0
                            ? "Tous les cours"
                            : `${selectedModules.length} cours sélectionné(s)`}
                        </span>
                        <svg
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            showModules ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Dropdown personnalisé */}
                      {showModules && (
                        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                          {/* Option "Tous les cours" */}
                          <div
                            onClick={() => setSelectedModules([])}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 cursor-pointer transition-colors border-b border-gray-100"
                          >
                            <div className="flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded hover:border-emerald-500 transition-colors flex-shrink-0">
                              {selectedModules.length === 0 && (
                                <svg
                                  className="w-3 h-3 text-emerald-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 
                                                    12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm text-gray-700 font-medium">
                              Tous les cours
                            </span>
                          </div>

                          {/* Liste des cours */}
                          {projetFilter.modules.map((m, i) => {
                            const moduleId = m.idModule ?? i;
                            return (
                              <div
                                key={moduleId}
                                onClick={() => {
                                  setSelectedModules((prev) => {
                                    if (prev.includes(moduleId)) {
                                      return prev.filter(
                                        (id) => id !== moduleId
                                      );
                                    } else {
                                      return [...prev, moduleId];
                                    }
                                  });
                                }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 cursor-pointer transition-colors group/item"
                              >
                                {/* Checkbox personnalisé */}
                                <div
                                  className={`flex items-center justify-center w-5 h-5 border-2 rounded transition-all flex-shrink-0 ${
                                    selectedModules.includes(moduleId)
                                      ? "bg-emerald-600 border-emerald-600"
                                      : "border-gray-300 group-hover/item:border-emerald-500"
                                  }`}
                                >
                                  {selectedModules.includes(moduleId) && (
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 
                                                            8a1 1 0 01-1.414 0l-4-4a1 1 
                                                            0 011.414-1.414L8 12.586l7.293-7.293a1 1 
                                                            0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </div>

                                {/* Nom du module */}
                                <span className="text-sm text-gray-700 flex-1">
                                  {m.module_name}
                                </span>

                                {/* Petit point vert si sélectionné */}
                                {selectedModules.includes(moduleId) && (
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Filtre Ville */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Ville
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowVilles(!showVilles)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm bg-white shadow-sm hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 cursor-pointer flex items-center justify-between"
                      >
                        <span className="text-gray-700">
                          {selectedVilles.length === 0
                            ? "Toutes les villes"
                            : `${selectedVilles.length} ville(s) sélectionnée(s)`}
                        </span>
                        <svg
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            showVilles ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {showVilles && (
                        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                          {/* Option "Toutes les villes" */}
                          <div
                            onClick={() => setSelectedVilles([])}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-gray-100"
                          >
                            <div className="flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded hover:border-orange-500 transition-colors flex-shrink-0">
                              {selectedVilles.length === 0 && (
                                <svg
                                  className="w-3 h-3 text-orange-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 
                                                    12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm text-gray-700 font-medium">
                              Toutes les villes
                            </span>
                          </div>

                          {/* Liste des villes */}
                          {projetFilter.villes.map((v, i) => {
                            const villeId = v.idVille ?? i;
                            const isSelected = selectedVilles.includes(villeId);

                            return (
                              <div
                                key={villeId}
                                onClick={() => {
                                  setSelectedVilles((prev) => {
                                    if (prev.includes(villeId)) {
                                      return prev.filter(
                                        (id) => id !== villeId
                                      );
                                    } else {
                                      return [...prev, villeId];
                                    }
                                  });
                                }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors group/item"
                              >
                                {/* Checkbox personnalisé */}
                                <div
                                  className={`flex items-center justify-center w-5 h-5 border-2 rounded transition-all flex-shrink-0 ${
                                    isSelected
                                      ? "bg-orange-600 border-orange-600"
                                      : "border-gray-300 group-hover/item:border-orange-500"
                                  }`}
                                >
                                  {isSelected && (
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 
                                                                8a1 1 0 01-1.414 0l-4-4a1 1 
                                                                0 011.414-1.414L8 12.586l7.293-7.293a1 1 
                                                                0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </div>

                                {/* Nom de la ville */}
                                <span className="text-sm text-gray-700 flex-1">
                                  {v.ville}
                                </span>

                                {/* Petit point orange si sélectionnée */}
                                {isSelected && (
                                  <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Filtre Financement */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                      Financement
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowFinancements(!showFinancements)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm bg-white shadow-sm hover:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-200 cursor-pointer flex items-center justify-between"
                      >
                        <span className="text-gray-700">
                          {selectedFinancements.length === 0
                            ? "Tous les financements"
                            : `${selectedFinancements.length} financement(s) sélectionné(s)`}
                        </span>
                        <svg
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            showFinancements ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {showFinancements && (
                        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                          {/* Option "Tous les financements" */}
                          <div
                            onClick={() => setSelectedFinancements([])}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-rose-50 cursor-pointer transition-colors border-b border-gray-100"
                          >
                            <div className="flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded hover:border-rose-500 transition-colors flex-shrink-0">
                              {selectedFinancements.length === 0 && (
                                <svg
                                  className="w-3 h-3 text-rose-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 
                                                    12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm text-gray-700 font-medium">
                              Tous les financements
                            </span>
                          </div>
                          {/* Liste des financements */}
                          {projetFilter.financements.map((f, i) => {
                            const financementId = f.idPaiement ?? i;
                            return (
                              <div
                                key={financementId}
                                onClick={() => {
                                  setSelectedFinancements((prev) => {
                                    if (prev.includes(financementId)) {
                                      return prev.filter(
                                        (id) => id !== financementId
                                      );
                                    } else {
                                      return [...prev, financementId];
                                    }
                                  });
                                }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-rose-50 cursor-pointer transition-colors group/item"
                              >
                                {/* Checkbox personnalisé */}
                                <div
                                  className={`flex items-center justify-center w-5 h-5 border-2 rounded transition-all flex-shrink-0 ${
                                    selectedFinancements.includes(financementId)
                                      ? "bg-rose-600 border-rose-600"
                                      : "border-gray-300 group-hover/item:border-rose-500"
                                  }`}
                                >
                                  {selectedFinancements.includes(
                                    financementId
                                  ) && (
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 
                                                            8a1 1 0 01-1.414 0l-4-4a1 1 
                                                            0 011.414-1.414L8 12.586l7.293-7.293a1 1 
                                                            0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </div>
                                {/* Nom financement */}
                                <span className="text-sm text-gray-700 flex-1">
                                  {f.paiement}
                                </span>
                                {/* Petit point rose si sélectionné */}
                                {selectedFinancements.includes(
                                  financementId
                                ) && (
                                  <div className="w-2 h-2 bg-rose-500 rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Filtre Période */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      Période
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowPeriodes(!showPeriodes)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm bg-white shadow-sm hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 cursor-pointer flex items-center justify-between"
                      >
                        <span className="text-gray-700">
                          {selectedPeriodes?.length === 0
                            ? "Toutes les périodes"
                            : `${selectedPeriodes?.length} période(s) sélectionnée(s)`}
                        </span>
                        <svg
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            showPeriodes ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {showPeriodes && (
                        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                          {/* Option "Toutes les périodes" */}
                          <div
                            onClick={() => setSelectedPeriodes([])}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 cursor-pointer transition-colors border-b border-gray-100"
                          >
                            <div className="flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded hover:border-indigo-500 transition-colors flex-shrink-0">
                              {selectedPeriodes?.length === 0 && (
                                <svg
                                  className="w-3 h-3 text-indigo-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm text-gray-700 font-medium">
                              Toutes les périodes
                            </span>
                          </div>

                          {/* Liste des périodes */}
                          {projetFilter.months.map((m, i) => {
                            const periodeId = m.id ?? i;
                            return (
                              <div
                                key={periodeId}
                                onClick={() => {
                                  setSelectedPeriodes((prev) => {
                                    if (prev.includes(periodeId)) {
                                      return prev.filter(
                                        (id) => id !== periodeId
                                      );
                                    } else {
                                      return [...prev, periodeId];
                                    }
                                  });
                                }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 cursor-pointer transition-colors group/item"
                              >
                                {/* Checkbox personnalisé */}
                                <div
                                  className={`flex items-center justify-center w-5 h-5 border-2 rounded transition-all flex-shrink-0 ${
                                    selectedPeriodes?.includes(periodeId)
                                      ? "bg-indigo-600 border-indigo-600"
                                      : "border-gray-300 group-hover/item:border-indigo-500"
                                  }`}
                                >
                                  {selectedPeriodes?.includes(periodeId) && (
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </div>
                                {/* Nom de la période */}
                                <span className="text-sm text-gray-700 flex-1">
                                  {m.headDate}
                                </span>
                                {/* Petit point indigo si sélectionné */}
                                {selectedPeriodes?.includes(periodeId) && (
                                  <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Filtre Formateur */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      Formateur
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowFormateur(!showFormateur)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm bg-white shadow-sm hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 cursor-pointer flex items-center justify-between"
                      >
                        <span className="text-gray-700">
                          {selectedFormateur?.length === 0
                            ? "Tous les formateurs"
                            : `${selectedFormateur?.length} formateur(s) sélectionné(s)`}
                        </span>
                        <svg
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            showFormateur ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {showFormateur && (
                        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                          {/* Option "Tous les formateurs" */}
                          <div
                            onClick={() => setSelectedFormateur([])}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 cursor-pointer transition-colors border-b border-gray-100"
                          >
                            <div className="flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded hover:border-indigo-500 transition-colors flex-shrink-0">
                              {selectedFormateur?.length === 0 && (
                                <svg
                                  className="w-3 h-3 text-indigo-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm text-gray-700 font-medium">
                              Tous les formateurs
                            </span>
                          </div>

                          {/* Liste des formateurs */}
                          {projetFilter.formateurs.map((f, i) => {
                            const formateurId = f.idFormateur;
                            const formateurName = f.form_firstname;
                            return (
                              <div
                                key={formateurId}
                                onClick={() => {
                                  setSelectedFormateur((prev) => {
                                    if (prev.includes(formateurId)) {
                                      return prev.filter(
                                        (id) => id !== formateurId
                                      );
                                    } else {
                                      return [...prev, formateurId];
                                    }
                                  });
                                }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 cursor-pointer transition-colors group/item"
                              >
                                {/* Checkbox personnalisé */}
                                <div
                                  className={`flex items-center justify-center w-5 h-5 border-2 rounded transition-all flex-shrink-0 ${
                                    selectedFormateur?.includes(formateurId)
                                      ? "bg-indigo-600 border-indigo-600"
                                      : "border-gray-300 group-hover/item:border-indigo-500"
                                  }`}
                                >
                                  {selectedFormateur?.includes(formateurId) && (
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </div>
                                {/* Nom du formateur */}
                                <span className="text-sm text-gray-700 flex-1">
                                  {formateurName}
                                </span>
                                {/* Petit point indigo si sélectionné */}
                                {selectedFormateur?.includes(formateurId) && (
                                  <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-6 sm:mt-8 pt-6 border-t border-gray-200 gap-4">
                  <button
                    onClick={onResetFilters}
                    className="group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <svg
                      className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <AnimatePresence>
          {showPage && (
            <>
              <motion.div
                className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPage(false)}
              />
              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ duration: 0.3 }}
                className="fixed right-0 top-0 h-full w-full sm:w-[500px] md:w-[600px] z-50"
              >
                <ProjectCreation
                  setShowPage={setShowPage}
                  fetchProjets={fetchProjets}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
      <div className="md:hidden px-4 py-3 bg-white border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LoadingSpinner></LoadingSpinner>
        </div>
      )}
    </>
  );
};

export default NavBarProject;
