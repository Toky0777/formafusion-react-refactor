import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearch } from "../../../contexts/cfp/SearchFolderContext";
import NabvarFolder from "../../../components/navbar/navbar-folder";
import {
  faFilter,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NouveauDossierModal from "../../../components/Modals/folder/NouveauDossierModal";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import axios from "../../../config/axios";
import { useAuth } from "../../../contexts/AuthContext";

// Import des composants enfants
import FolderTable from "./FolderTable";
import AdvancedFilters from "./AdvancedFilters";

// Fonctions de tri
const sortByMontant = (a, b, direction) => {
  const montantA = a.montantTotal || 0;
  const montantB = b.montantTotal || 0;

  if (direction === "ascending") {
    return montantA - montantB;
  } else {
    return montantB - montantA;
  }
};

const sortByPeriode = (a, b, direction) => {
  const dateA = new Date(a.dateMinProjet || 0);
  const dateB = new Date(b.dateMinProjet || 0);

  if (direction === "ascending") {
    return dateA - dateB;
  } else {
    return dateB - dateA;
  }
};

const sortByNomDossier = (a, b, direction) => {
  const nomA = (a.nomDossier || "").toLowerCase();
  const nomB = (b.nomDossier || "").toLowerCase();

  if (direction === "ascending") {
    return nomA.localeCompare(nomB);
  } else {
    return nomB.localeCompare(nomA);
  }
};

// Composant principal refactorisé
const FolderList = () => {
  const [activeMonths, setActiveMonths] = useState([]);
  const { currencyUnit } = useAuth();
  const currency_unit = currencyUnit || "MGA";
  const { selectedYear, setSelectedYear, searchTerm, setSearchTerm } =
    useSearch();

  const [backgroundOperations, setBackgroundOperations] = useState({
    deleting: false,
    refreshing: false,
    updating: false,
  });

  const [dossiers, setDossiers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState([]);
  const [type, setType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const navigate = useNavigate();

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // États pour les filtres avancés
  const [villeFilter, setVilleFilter] = useState([]);
  const [entrepriseFilter, setEntrepriseFilter] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);

  // État pour le tri
  const [sortConfig, setSortConfig] = useState({
    key: "nomDossier",
    direction: "ascending",
  });

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

  useEffect(() => {
    const handleDossierDeleted = (event) => {
      const { deletedDossierId } = event.detail;

      setDossiers((prevDossiers) =>
        prevDossiers.filter((dossier) => dossier.idDossier !== deletedDossierId)
      );

      toast.success("Dossier supprimé avec succès !");
    };

    window.addEventListener("dossierDeleted", handleDossierDeleted);

    return () => {
      window.removeEventListener("dossierDeleted", handleDossierDeleted);
    };
  }, []);

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

  const fetchDossiers = async (options = {}) => {
    const { silent = false, background = false } = options;

    if (!silent && !background) {
      setLoading(true);
    }

    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token non disponible");

      const response = await axios.get("/cfp/dossier/showAllDossier", {
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
      console.log(response.data.dossiers);

      setDossiers(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Impossible de charger les dossiers.";
      setError(msg);
      if (!silent) {
        toast.error(msg);
      }
      if (err.response?.status === 401) {
        navigate("/login", { replace: true });
      }
    } finally {
      if (!silent && !background) {
        setLoading(false);
      }
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
    const dossierStatus = d.status || "En préparation";
    const dossierType = Array.isArray(d.project_types)
      ? d.project_types[0]?.project_type || d.project_types[0] || ""
      : "";
    const dossierMonth = d.dateMinProjet
      ? new Date(d.dateMinProjet).getMonth() + 1
      : 0;
    const villes = Array.isArray(d.villes) ? d.villes : [];
    const entreprises = Array.isArray(d.entreprises) ? d.entreprises : [];

    const baseFilters =
      (status.length === 0 || status.some((s) => s.value === dossierStatus)) &&
      (type.length === 0 || type.some((t) => t.value === dossierType)) &&
      name.includes(searchTerm.toLowerCase()) &&
      (activeMonths.length === 0 ||
        activeMonths.some((m) => m.value === dossierMonth)) &&
      (selectedYear === null ||
        (d.dateMinProjet &&
          new Date(d.dateMinProjet).getFullYear() === selectedYear));

    const advancedFilters =
      (villeFilter.length === 0 ||
        villes.some((ville) => villeFilter.some((v) => v.value === ville))) &&
      (entrepriseFilter.length === 0 ||
        entreprises.some((entreprise) =>
          entrepriseFilter.some((e) => e.value === entreprise)
        ));

    return baseFilters && advancedFilters;
  });

  // Fonction de tri
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Tri des données avec useMemo
  const sortedAndFiltered = useMemo(() => {
    if (!dossiers) return [];

    let sortableItems = [...filtered];

    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === "montant") {
          return sortByMontant(a, b, sortConfig.direction);
        } else if (sortConfig.key === "periode") {
          return sortByPeriode(a, b, sortConfig.direction);
        } else if (sortConfig.key === "nomDossier") {
          return sortByNomDossier(a, b, sortConfig.direction);
        }
        return 0;
      });
    }

    return sortableItems;
  }, [dossiers, filtered, sortConfig]);

  // Calculs pour la pagination avec données triées
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAndFiltered.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedAndFiltered.length / itemsPerPage);

  const formatPeriode = (dateMin, dateMax) => {
    if (!dateMin || !dateMax) return "—";
    const startDate = new Date(dateMin).toLocaleDateString("fr-FR");
    const endDate = new Date(dateMax).toLocaleDateString("fr-FR");
    return `${startDate} → ${endDate}`;
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
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={5000} />
      <main className="flex-grow px-4 py-8 mx-auto max-w-8xl">
        {/* Header avec shortcuts info */}
        <div className="flex items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-500 whitespace-nowrap">
              Gestion des dossiers
            </h1>
          </div>
          <NabvarFolder />
        </div>

        {/* Filtres et tableau avec le style international */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* En-tête des filtres */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() =>
                    setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)
                  }
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${isAdvancedFiltersOpen
                      ? "bg-purple-100 text-purple-600 border-purple-300"
                      : "bg-white border-gray-300 hover:bg-gray-50 text-gray-500"
                    }`}
                >
                  <FontAwesomeIcon icon={faFilter} className="w-4 h-4" />
                  <span className="font-medium">Filtres</span>
                  {isAdvancedFiltersOpen ? (
                    <ChevronUpIcon className="w-4 h-4" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4" />
                  )}
                </button>

                {activeFilters.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {activeFilters.length} filtre(s) actif(s)
                    </span>
                    <button
                      onClick={resetAllFilters}
                      className="text-sm font-medium text-purple-600 hover:text-purple-800"
                    >
                      Tout effacer
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value={10}>10 lignes</option>
                  <option value={25}>25 lignes</option>
                  <option value={50}>50 lignes</option>
                  <option value={100}>100 lignes</option>
                </select>
              </div>
            </div>

            {/* Filtres actifs */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {activeFilters.map((filter, index) => (
                  <div
                    key={index}
                    className="flex items-center px-3 py-1 space-x-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full"
                  >
                    <span>{filter.label}</span>
                    <button
                      onClick={() => removeFilter(filter.type)}
                      className="p-0.5 rounded-full hover:bg-purple-200 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filtres avancés */}
          <AdvancedFilters
            isOpen={isAdvancedFiltersOpen}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            activeMonths={activeMonths}
            setActiveMonths={setActiveMonths}
            status={status}
            setStatus={setStatus}
            type={type}
            setType={setType}
            villeFilter={villeFilter}
            setVilleFilter={setVilleFilter}
            entrepriseFilter={entrepriseFilter}
            setEntrepriseFilter={setEntrepriseFilter}
            years={years}
            months={months}
            statusOptions={statusOptions}
            typeOptions={typeOptions}
            getUniqueOptions={getUniqueOptions}
          />

          <FolderTable
            loading={loading}
            error={error}
            sortedAndFiltered={sortedAndFiltered}
            currentItems={currentItems}
            sortConfig={sortConfig}
            handleSort={handleSort}
            navigate={navigate}
            currency_unit={currency_unit}
            formatPeriode={formatPeriode}
            currentPage={currentPage}
            totalPages={totalPages}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            goToPreviousPage={goToPreviousPage}
            goToNextPage={goToNextPage}
            paginate={paginate}
          />
        </div>
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

export default FolderList;
