import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearch } from "../../../contexts/cfp/SearchFolderContext";
import NabvarFolder from "../../../components/navbar/navbar-folder";
import {
  faFolder,
  faFilter,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NouveauDossierModal from "../../../components/Modals/folder/NouveauDossierModal";
import { formatMontant } from "../../../utils/formatMontant";
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react";

import {
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";
import axios from "../../../config/axios";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";

const FolderListEtp = () => {
  const [activeMonths, setActiveMonths] = useState([]);
  const currency = "XOF";
  const {
    selectedYear,
    setSelectedYear,
    searchTerm,
    setSearchTerm,
  } = useSearch();
  const [dossiers, setDossiers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState([]);
  const [type, setType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const navigate = useNavigate();

  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Nouveaux états pour les filtres avancés
  const [villeFilter, setVilleFilter] = useState([]);
  const [entrepriseFilter, setEntrepriseFilter] = useState([]);

  // État pour suivre les filtres actifs
  const [activeFilters, setActiveFilters] = useState([]);

  // Options pour les années et mois
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: "Janvier" },
    { value: 2, label: "Février" },
    { value: 3, label: "Mars" },
    { value: 4, label: "Avril" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Juin" },
    { value: 7, label: "Juillet" },
    { value: 8, label: "Août" },
    { value: 9, label: "Septembre" },
    { value: 10, label: "Octobre" },
    { value: 11, label: "Novembre" },
    { value: 12, label: "Décembre" },
  ];

  const statusLabels = {
    "En préparation": "En préparation",
    "En cours": "En cours",
    Planifié: "Planifié",
    Terminé: "Terminé",
    Annulé: "Annulé",
    Reporté: "Reporté",
    Cloturé: "Cloturé",
  };

  const statusPaie = {
    5: "Payé",
    4: "Partiel",
    6: "Non payé",
  };

  useEffect(() => {
    updateActiveFilters();
  }, [
    selectedYear,
    activeMonths,
    status,
    type,
    villeFilter,
    entrepriseFilter,
    searchTerm,
  ]);

  const updateActiveFilters = () => {
    const filters = [];

    if (selectedYear)
      filters.push({
        type: "year",
        value: selectedYear,
        label: `Année: ${selectedYear}`,
      });
    if (Array.isArray(activeMonths) && activeMonths.length > 0) {
      filters.push({
        type: "month",
        value: activeMonths,
        label: `Mois: ${activeMonths.map((m) => m.label).join(", ")}`,
      });
    }

    if (status.length > 0)
      filters.push({
        type: "status",
        value: status,
        label: `Statut: ${status.map((s) => s.label).join(", ")}`,
      });
    if (type.length > 0)
      filters.push({
        type: "type",
        value: type,
        label: `Type: ${type.map((t) => t.label).join(", ")}`,
      });
    if (villeFilter.length > 0)
      filters.push({
        type: "ville",
        value: villeFilter,
        label: `Ville: ${villeFilter.map((v) => v.label).join(", ")}`,
      });
    if (entrepriseFilter.length > 0)
      filters.push({
        type: "entreprise",
        value: entrepriseFilter,
        label: `Entreprise: ${entrepriseFilter.map((e) => e.label).join(", ")}`,
      });
    if (searchTerm)
      filters.push({
        type: "search",
        value: searchTerm,
        label: `Recherche: "${searchTerm}"`,
      });

    setActiveFilters(filters);
  };

  const removeFilter = (filterType) => {
    switch (filterType) {
      case "year":
        setSelectedYear(null);
        break;
      case "month":
        setActiveMonths([]);
        break;
      case "status":
        setStatus([]);
        break;
      case "type":
        setType([]);
        break;
      case "ville":
        setVilleFilter([]);
        break;
      case "entreprise":
        setEntrepriseFilter([]);
        break;
      case "search":
        setSearchTerm("");
        break;
      default:
        break;
    }
  };

  const resetAllFilters = () => {
    setSelectedYear(null);
    setActiveMonths([]);
    setStatus([]);
    setType([]);
    setVilleFilter([]);
    setEntrepriseFilter([]);
    setSearchTerm("");
  };

  const fetchDossiers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token non disponible");

      const response = await axios.get("/etp/dossier/show", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          year: selectedYear,
          months:
            activeMonths.length > 0
              ? activeMonths.map((m) => m.value).join(",")
              : null,
          search: searchTerm,
        },
      });

      const data = response.data?.dossiers;
      setDossiers(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Impossible de charger les dossiers.";
      setError(msg);
      toast.error(msg);
      if (err.response?.status === 401) {
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDossiers();
  }, [selectedYear, activeMonths, searchTerm]);

  const handleCreateDossier = async () => {
    await fetchDossiers();
  };

  const getUniqueOptions = (key) => {
    const allValues = dossiers.flatMap((d) => {
      if (Array.isArray(d[key])) {
        return d[key];
      }
      return [];
    });
    return [...new Set(allValues.filter(Boolean))].map((value) => ({
      value,
      label: value,
    }));
  };

  const statusOptions = Object.values(statusLabels).map((label) => ({
    value: label,
    label,
  }));
  const typeOptions = [
    { value: "Inter", label: "Inter" },
    { value: "Intra", label: "Intra" },
  ];

  const filtered = dossiers.filter((d) => {
    const name = (d.nomDossier || "").toLowerCase();
    const dossierStatus = statusLabels[d.status] || "En préparation";
    const dossierType = Array.isArray(d.project_types)
      ? d.project_types[0]?.project_type || d.project_types[0] || ""
      : "";
    const dossierMonth = new Date(d.dateMinProjet).getMonth() + 1; // +1 car les mois vont de 0-11 en JS
    const villes = Array.isArray(d.villes) ? d.villes : [];
    const entreprises = Array.isArray(d.entreprises) ? d.entreprises : [];

    // Filtres de base
    const baseFilters =
      (status.length === 0 || status.some((s) => s.value === dossierStatus)) &&
      (type.length === 0 || type.some((t) => t.value === dossierType)) &&
      name.includes(searchTerm.toLowerCase()) &&
      (activeMonths.length === 0 ||
        activeMonths.some((m) => m.value === dossierMonth)) &&
      (selectedYear === null ||
        new Date(d.dateMinProjet).getFullYear() === selectedYear);

    // Filtres avancés
    const advancedFilters =
      (villeFilter.length === 0 ||
        villes.some((ville) => villeFilter.some((v) => v.value === ville))) &&
      (entrepriseFilter.length === 0 ||
        entreprises.some((entreprise) =>
          entrepriseFilter.some((e) => e.value === entreprise)
        ));

    return baseFilters && advancedFilters;
  });

  // Calculs pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const formatPeriode = (dateMin, dateMax) => {
    if (!dateMin || !dateMax) return "—";
    return `${new Date(dateMin).toLocaleDateString("fr-FR")} - ${new Date(
      dateMax
    ).toLocaleDateString("fr-FR")}`;
  };
  // Fonctions de pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPreviousPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Styles pour react-select
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "32px",
      height: "32px",
      paddingLeft: "0.5rem",
      paddingRight: "0.5rem",
      fontSize: "0.75rem",
      borderRadius: "0.375rem",
      borderWidth: "1px",
      borderColor: state.isFocused ? "#7e22ce" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(126,34,206,0.3)" : "none",
      transition: "all 0.2s ease-in-out",
      cursor: "pointer",
      "&:hover": {
        borderColor: "#7e22ce",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 0.25rem",
      height: "32px",
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "0.75rem",
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: "0.75rem",
    }),
    multiValue: (provided) => ({
      ...provided,
      borderRadius: "4px",
      padding: "1px 4px",
      fontSize: "0.75rem",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      fontWeight: 500,
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#6b7280",
      ":hover": {
        backgroundColor: "#7e22ce",
        color: "#ffffff",
      },
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: "0.75rem",
      borderRadius: "0.375rem",
      marginTop: "4px",
      zIndex: 10,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "#7e22ce"
        : "#ffffff",
      color: state.isFocused
        ? "#ffffff"
        : "#1f2937",
      padding: "6px 12px",
      cursor: "pointer",
      ":active": {
        backgroundColor: "#6b21a8",
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={5000} />
      <main className="flex-grow px-4 py-8 mx-auto max-w-8xl">
        {/* Header avec navbar et bouton filtre */}
        <div className="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row ">
          <NabvarFolder />

          {/* Bouton filtres avancés (desktop) */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border shadow-sm transition-all duration-200 cursor-pointer ${isAdvancedFiltersOpen
                ? "bg-purple-100 text-purple-700 border-purple-300"
                : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              title="Filtrer les dossiers"
            >
              <FontAwesomeIcon icon={faFilter} className="w-4 h-4" />
              <span className="font-medium">Filtrer</span>
              {isAdvancedFiltersOpen ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Filtres actifs */}
        {activeFilters.length > 0 && (
          <div className="p-3 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Filtres actifs:
              </span>
              {activeFilters.map((filter, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full"
                >
                  <span>{filter.label}</span>
                  <button
                    onClick={() => removeFilter(filter.type)}
                    className="p-0.5 rounded-full hover:bg-purple-200"
                  >
                    <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={resetAllFilters}
                className="ml-2 text-sm font-medium text-purple-600 hover:text-purple-800"
              >
                Tout effacer
              </button>
            </div>
          </div>
        )}

        {/* Filtres avancés (desktop) */}
        <AnimatePresence>
          {isAdvancedFiltersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Filtre année */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Année
                  </label>
                  <select
                    value={selectedYear || ""}
                    onChange={(e) =>
                      setSelectedYear(
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Toutes les années</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtre mois */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Mois
                  </label>
                  <Select
                    isMulti
                    options={months}
                    value={activeMonths}
                    onChange={setActiveMonths}
                    placeholder="Tous les mois"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={selectStyles}
                  />
                </div>

                {/* Filtre statut */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Statut
                  </label>
                  <Select
                    isMulti
                    options={statusOptions}
                    value={status}
                    onChange={setStatus}
                    placeholder="Tous les statuts"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={selectStyles}
                  />
                </div>

                {/* Filtre type */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <Select
                    isMulti
                    options={typeOptions}
                    value={type}
                    onChange={setType}
                    placeholder="Tous les types"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={selectStyles}
                  />
                </div>

                {/* Filtre ville */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Ville
                  </label>
                  <Select
                    isMulti
                    options={getUniqueOptions("villes")}
                    value={villeFilter}
                    onChange={setVilleFilter}
                    placeholder="Toutes les villes"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={selectStyles}
                  />
                </div>

                {/* Filtre entreprise */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Entreprise
                  </label>
                  <Select
                    isMulti
                    options={getUniqueOptions("entreprises")}
                    value={entrepriseFilter}
                    onChange={setEntrepriseFilter}
                    placeholder="Toutes les entreprises"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={selectStyles}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contrôles de pagination en haut */}
        {!loading && !error && dossiers.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-4 mb-4 sm:flex-row">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Afficher
              </span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="p-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700">
                dossiers par page
              </span>
            </div>
            <div className="text-sm text-gray-700">
              {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filtered.length)} sur {filtered.length}{" "}
              dossiers
            </div>
          </div>
        )}

        {/* Etats de chargement */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <svg
                className="w-8 h-8 text-purple-600 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span className="text-gray-700">
                Chargement des dossiers...
              </span>
            </div>
          </div>
        )}

        {/* Messages d'erreur et vide */}
        {error && (
          <div className="p-4 text-center border border-red-200 rounded-lg bg-red-50">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        {!loading && !error && dossiers.length === 0 && (
          <div className="p-8 text-center bg-gray-100 rounded-lg">
            <p className="text-gray-500">
              Aucun dossier trouvé. Essayez de modifier vos critères de
              recherche.
            </p>
          </div>
        )}
        {/* Tableau responsive */}
        {!loading && !error && dossiers.length > 0 && (
          <>
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="text-center w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-700"
                    >
                      Dossier
                    </th>
                    <th
                      scope="col"
                      className="text-center w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-700"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="text-center w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-700"
                    >
                      Modules
                    </th>
                    <th
                      scope="col"
                      className="text-center w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-700"
                    >
                      Ville
                    </th>
                    <th
                      scope="col"
                      className="text-center w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-700"
                    >
                      Période
                    </th>
                    <th
                      scope="col"
                      className="text-center w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-500"
                    >
                      Statut
                    </th>
                    <th
                      scope="col"
                      className="text-center w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-500"
                    >
                      Montant
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {!loading && filtered.length === 0 && dossiers.length > 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Aucun résultat correspondant à votre recherche.
                      </td>
                    </tr>
                  )}

                  {currentItems.map((dossier) => (
                    <tr
                      key={dossier.idDossier}
                      onClick={() => navigate(`/etp/dossier/detail/${dossier.idDossier}`)}
                      className="transition-colors cursor-pointer hover:bg-gray-50"
                    >
                      <td className="w-40 max-w-[10rem] truncate overflow-hidden whitespace-nowrap px-2 py-2 text-sm text-gray-700">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-yellow-400 bg-white rounded-full">
                            <FontAwesomeIcon icon={faFolder} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-500">
                              {dossier.nomDossier || "—"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {Array.isArray(dossier.entreprises)
                                ? dossier.entreprises.join(", ")
                                : "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-[200px] truncate whitespace-nowrap overflow-hidden px-2 py-2 text-sm text-gray-500 text-center">
                        {Array.isArray(dossier.project_types)
                          ? dossier.project_types
                            .map((pt) => pt?.project_type || pt)
                            .join(", ")
                          : "—"}
                      </td>
                      <td
                        className="max-w-[200px] truncate whitespace-nowrap overflow-hidden px-2 py-2 text-sm text-center text-gray-500"
                        title={
                          Array.isArray(dossier.module_names)
                            ? dossier.module_names.join(", ")
                            : "—"
                        }
                      >
                        {Array.isArray(dossier.module_names)
                          ? dossier.module_names.join(", ")
                          : "—"}
                      </td>
                      <td
                        className="w-40 max-w-[10rem] truncate overflow-hidden whitespace-nowrap px-2 py-2 text-sm text-gray-500 text-center"
                        title={
                          Array.isArray(dossier.villes)
                            ? dossier.villes.join(", ")
                            : "—"
                        }
                      >
                        {Array.isArray(dossier.villes)
                          ? dossier.villes.join(", ")
                          : "—"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-gray-500 text-center">
                        {formatPeriode(
                          dossier.dateMinProjet,
                          dossier.dateMaxProjet
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span
                          className={`mx-auto px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            dossier.status === "Terminé" || dossier.status === "Cloturé"
                              ? "bg-green-100 text-green-800"
                              : dossier.status === "Annulé"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-purple-800"
                          }`}
                        >
                          {statusLabels[dossier.status] || "En préparation"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-right">
                        {formatMontant(dossier.montantTotal, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2 py-3 mt-4 sm:px-0">
              <div className="flex justify-between flex-1 sm:hidden">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  Précédent
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  Suivant
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage de{" "}
                    <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
                    à{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filtered.length)}
                    </span>{" "}
                    sur <span className="font-medium">{filtered.length}</span>{" "}
                    résultats
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                      <span className="sr-only">Précédent</span>
                      <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
                    </button>
                    {/* Pagination numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => paginate(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                            ? "z-10 bg-purple-600 border-purple-600 text-white"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                      <span className="sr-only">Suivant</span>
                      <ChevronRightIcon
                        className="w-5 h-5"
                        aria-hidden="true"
                      />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {isModalOpen && (
        <NouveauDossierModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateDossier}
        />
      )}
    </div>
  );
};

export default FolderListEtp;