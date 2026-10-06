import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StatusBadge } from "../../../components/badge/StatusBadge";
import { AnimatePresence, motion } from "framer-motion";
import { useSearch } from "../../../contexts/cfp/SearchFolderContext";
import { formatMontant } from "../../../utils/formatMontant";
import {
  faBuilding,
  faLaptopCode,
  faProjectDiagram,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  BoltIcon,
  ChevronLeftIcon,
  DocumentIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import "react-toastify/dist/ReactToastify.css";
import AjoutDocumentModalEtp from "../../../components/Modals/folder/NouveauDocumentModalEtp";
import DocumentListEtp from "./DocumentListEtp";
import Button from "../../../components/button/Button";
import axios from "../../../config/axios";

// InfoBox component
const InfoBox = ({ label, value, icon }) => (
    <div className="p-4 transition-shadow duration-200 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow">
        <div className="flex items-center gap-2">
            {icon && <div className="text-gray-500">{icon}</div>}
            <div>
                <div className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                    {label}
                </div>
                <div className="mt-1 text-lg text-gray-500">
                    {value || "—"}
                </div>
            </div>
        </div>
    </div>
);

// Payment Status Indicator
const PaymentStatus = ({ status }) => {
    const statusConfig = {
        5: { icon: CheckCircleIcon, color: "text-green-600", label: "Payé" },
        4: {
            icon: ExclamationCircleIcon,
            color: "text-yellow-500",
            label: "Partiel",
        },
        6: { icon: XCircleIcon, color: "text-red-600", label: "Non payé" },
    };

    const {
        icon: Icon,
        color,
        label,
    } = statusConfig[status] || {
        icon: null,
        color: "text-gray-400",
        label: "Inconnu",
    };

    return (
        <div className="flex items-center gap-1">
            {Icon && <Icon className={`w-4 h-4 ${color}`} />}
            <span className="text-xs font-medium">{label}</span>
        </div>
    );
};

const FolderDetailEtp = () => {
    console.log("Component FolderDetailEtp is rendered");
    const currency = "XOF";
    const {
        selectedYear,
        activeMonth,
        searchTerm: globalSearchTerm,
        setSearchTerm: setGlobalSearchTerm,
        searchResults,
    } = useSearch();
    const [showFilters, setShowFilters] = useState(false);
    const [projectFilters, setProjectFilters] = useState({
        search: "",
        status: "",
        ville: "",
        entreprise: "",
        paymentStatus: "",
    });

    const hasActiveFilters = useMemo(() => {
        return Object.values(projectFilters).some((value) => value !== "");
    }, [projectFilters]);

    const activeFilterLabel = useMemo(() => {
        const activeFilters = Object.entries(projectFilters).filter(
            ([key, value]) => value !== ""
        );

        if (activeFilters.length === 0) return "";

        const labels = activeFilters.map(([key, value]) => {
            switch (key) {
                case "search":
                    return `Recherche: "${value}"`;
                case "status":
                    return `Statut: ${value}`;
                case "ville":
                    return `Ville: ${value}`;
                case "entreprise":
                    return `Entreprise: ${value}`;
                case "paymentStatus":
                    const paymentStatusMap = {
                        5: "Payé",
                        4: "Partiel",
                        6: "Non payé",
                    };
                    return `Paiement: ${paymentStatusMap[value] || "Inconnu"}`;
                default:
                    return "";
            }
        });
        return labels.join(", ");
    }, [projectFilters]);

    const token = localStorage.getItem("token");
    const [open, setOpen] = useState(false);
    const { idDossier } = useParams();
    const navigate = useNavigate();
    const [dossier, setDossier] = useState({
        idDossier: null,
        nomDossier: "",
        entreprises: [],
        status: "",
        montantTotal: 0,
        period: "",
        project_types: [],
        villes: [],
        module_names: [],
        projet_count: 0,
        apprenants: 0,
        nombreDocument: 0,
        statusDossier: "",
        statusLabels: {
            en_preparation: "En préparation",
            en_cours: "En cours",
            planifie: "Planifié",
            termine: "Terminé",
            annule: "Annulé",
            reporte: "Reporté",
            cloture: "Clôturé",
        },
    });

    const [projets, setProjets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const refreshProjets = useCallback(async () => {
        console.log("refreshProjets called for ID:", idDossier);
        const storedToken = localStorage.getItem("token");
        setLoading(true);
        setError(null);
        try {
            if (!storedToken) {
                console.warn("No token found. Redirecting to login.");
                toast.error("Veuillez vous connecter.");
                navigate("/login");
                return;
            }

            console.log("Fetching data for dossier ID:", idDossier);
            const response = await axios.get(`/etp/dossier/getDossierDetail/${idDossier}`, {
                headers: { Authorization: `Bearer ${storedToken}` },
            });
            console.log("API response received:", response.data);

            const data = response.data;
            if (!data || typeof data !== "object") {
                console.error("Invalid API response format.");
                throw new Error("Réponse API invalide : données vides ou non valides");
            }
            const formatDateDMY = (dateString) => {
                if (!dateString) return "—";
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return "—";
                return date.toLocaleDateString("fr-FR");
            };

            setDossier({
                idDossier: idDossier,
                nomDossier: data.nomDossier || "Nom inconnu",
                entreprises: data.cpfs?.map((cfp) => cfp.cfp_name) || [],
                status: data.status || "En préparation",
                montantTotal: data.montantTotal
                    ? formatMontant(data.montantTotal, currency)
                    : formatMontant(0, currency),
                period: `${formatDateDMY(data.dateMinProjet?.[0]?.dateDebut)} -> ${formatDateDMY(data.dateMaxProjet?.[0]?.dateFin)}`,
                project_types: data.project_types?.map((pt) => pt.project_type) || [],
                villes: data.villes?.map((v) => v.ville) || [],
                module_names: data.module_names?.map((m) => m.module_name) || [],
                projet_count: data.projet_count || 0,
                apprenants: data.apprenants || 0,
                nombreDocument: data.nombreDocument || 0,
                statusDossier: data.status || "en_preparation",
                payment_status: data.paymentStatus ?? 6,
            });

            const projetsData = data.projets || [];
            const newProjets = projetsData.map((projet) => ({
                id: projet.idProjet,
                module_name: projet.module_name || "Module inconnu",
                reference: projet.project_reference || "Référence inconnue",
                entreprise: projet.etp_name || "Entreprise inconnue",
                ville: projet.ville || "Ville inconnue",
                status: projet.project_status || "Inconnu",
                date: `${projet.dateDebut
                    ? new Date(projet.dateDebut).toLocaleDateString("fr-FR")
                    : "—"
                    } - ${projet.dateFin
                        ? new Date(projet.dateFin).toLocaleDateString("fr-FR")
                        : "—"
                    }`,
                participants: projet.participants || 0,
                total_ht: projet.total_ht ? Number(projet.total_ht) : 0,
                payment_status: projet.payment_status ?? 6,
            }));

            setProjets(newProjets);
        } catch (err) {
            console.error("Error during data fetch:", err);
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                "Erreur lors du chargement des données.";
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            console.log("Setting loading to false.");
            setLoading(false);
        }
    }, [idDossier, navigate, currency]);

    useEffect(() => {
        console.log("useEffect for globalSearchTerm triggered.");
        setProjectFilters((prev) => ({
            ...prev,
            search: globalSearchTerm,
        }));
    }, [globalSearchTerm]);

    useEffect(() => {
        console.log("Main useEffect triggered. ID:", idDossier, "Refresh Key:", refreshKey);
        if (idDossier) {
            refreshProjets();
        }
    }, [idDossier, refreshProjets, selectedYear, activeMonth, refreshKey]);

    const filteredProjects = useMemo(() => {
        console.log("Recomputing filteredProjects.");
        let projectsToFilter = projets;
        if (globalSearchTerm && searchResults?.projets) {
            projectsToFilter = searchResults.projets.filter(
                (projet) => projet.idDossier === dossier.idDossier
            );
        }

        return projectsToFilter.filter((projet) => {
            const matchesSearch =
                projectFilters.search === "" ||
                Object.values(projet).some((value) =>
                    String(value).toLowerCase().includes(projectFilters.search.toLowerCase())
                );
            const matchesStatus =
                projectFilters.status === "" ||
                (projet.status && projet.status.toLowerCase() === projectFilters.status.toLowerCase());
            const matchesVille =
                projectFilters.ville === "" ||
                (projet.ville && projet.ville.toLowerCase() === projectFilters.ville.toLowerCase());
            const matchesEntreprise =
                projectFilters.entreprise === "" ||
                (projet.entreprise && projet.entreprise.toLowerCase() === projectFilters.entreprise.toLowerCase());
            const matchesPaymentStatus =
                projectFilters.paymentStatus === "" ||
                (projet.payment_status && projet.payment_status.toString() === projectFilters.paymentStatus);

            return (
                matchesSearch &&
                matchesStatus &&
                matchesVille &&
                matchesEntreprise &&
                matchesPaymentStatus
            );
        });
    }, [
        projets,
        projectFilters,
        globalSearchTerm,
        searchResults,
        dossier.idDossier,
    ]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProjets = filteredProjects.slice(
        indexOfFirstItem,
        indexOfLastItem
    );
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const goToPreviousPage = () =>
        currentPage > 1 && setCurrentPage(currentPage - 1);
    const goToNextPage = () =>
        currentPage < totalPages && setCurrentPage(currentPage + 1);

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const getDossier = () => navigate("/etp/dossier");

    const handleDocumentModalClose = () => {
        console.log("Document modal closed. Refreshing projects.");
        setOpen(false);
        setRefreshKey((prev) => prev + 1);
    };

    const handleDocumentChange = () => {
        console.log("Document change detected. Refreshing projects.");
        setRefreshKey((prev) => prev + 1);
    };

    const resetFilters = () => {
        console.log("Resetting filters.");
        setProjectFilters({
            search: "",
            status: "",
            ville: "",
            entreprise: "",
            paymentStatus: "",
        });
        setGlobalSearchTerm("");
    };

    const handleOpenModal = () => {
        console.log("Opening modal, dossier.idDossier:", dossier.idDossier);
        console.log("Current open state:", open);
        setOpen(true);
    };

    if (loading) {
        console.log("Rendering loading state.");
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-10 h-10 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        console.log("Rendering error state:", error);
        return (
            <div className="max-w-4xl p-4 mx-auto">
                <div className="p-3 border-l-4 border-red-500 bg-red-50">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <XCircleIcon className="w-4 h-4 text-red-500" />
                        </div>
                        <div className="ml-2">
                            <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                            <div className="mt-1 text-xs text-red-700">{error}</div>
                            <div className="mt-2">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium leading-4 text-red-700 bg-red-100 border border-transparent rounded hover:bg-red-200 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500"
                                >
                                    Réessayer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-grow px-4 py-6 bg-gray-50">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            {/* Header Section */}
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={ChevronLeftIcon}
                        onClick={getDossier}
                        aria-label="Retour aux dossiers"
                        className="flex items-center gap-1 px-2 py-1 text-gray-500 transition duration-150 ease-in-out border border-transparent rounded-md cursor-pointer group hover:text-blue-800 hover:bg-blue-50 hover:border-blue-100"
                    >
                        <span className="text-sm font-medium">
                            Retour aux dossiers
                        </span>
                    </Button>
                    <h1 className="text-xl font-semibold text-gray-500">                    
                        {dossier.nomDossier}          
                    </h1>
                </div>
            </div>

            {/* Dossier Summary Card */}
            <div className="mb-6 overflow-hidden bg-white border border-gray-200 rounded-lg shadow">
                <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                        <div className="flex flex-wrap gap-1">
                            {dossier.entreprises.map((etp, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                    title="Centre de formation"
                                >
                                    <FontAwesomeIcon
                                        icon={faBuilding}
                                        className="mr-1 text-gray-500"
                                        title="Entreprise"
                                    />
                                    {etp}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="px-4 py-3 bg-gray-50">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <InfoBox
                            label="Montant total"
                            value={dossier.montantTotal}
                            icon={<FontAwesomeIcon icon={faLaptopCode} className="w-4 h-4" />}
                        />
                        <InfoBox
                            label="Période"
                            value={dossier.period}
                            icon={<DocumentIcon className="w-4 h-4" />}
                        />
                        <InfoBox
                            label="Type de projet"
                            value={dossier.project_types.join(", ") || "—"}
                            icon={<BoltIcon className="w-4 h-4" />}
                        />
                    </div>
                </div>
            </div>

            {/* Projects Section */}
            <div className="mb-6 overflow-hidden bg-white border border-gray-200 rounded-lg shadow">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                        <h3 className="flex items-center gap-1 font-medium text-gray-500 text-md">
                            <FontAwesomeIcon
                                icon={faProjectDiagram}
                                className="text-gray-500"
                            />
                            {filteredProjects.length} Projets associé(s) 
                        </h3>

                        {projets.length > 0 && (
                            <div className="flex items-center space-x-1">
                                <span className="text-xs text-gray-600">Afficher</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={handleItemsPerPageChange}
                                    className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-4 border-b border-gray-200 bg-gray-50"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium text-gray-700">Filtres de projets</h4>
                                <button onClick={resetFilters} className="text-xs text-blue-600 hover:underline">
                                    Réinitialiser les filtres
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <label htmlFor="filterStatus" className="block text-xs font-medium text-gray-700">Statut</label>
                                    <select
                                        id="filterStatus"
                                        value={projectFilters.status}
                                        onChange={(e) => setProjectFilters({ ...projectFilters, status: e.target.value })}
                                        className="block w-full mt-1 text-xs border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Tous</option>
                                        <option value="en préparation">En préparation</option>
                                        <option value="en cours">En cours</option>
                                        <option value="planifié">Planifié</option>
                                        <option value="terminé">Terminé</option>
                                        <option value="annulé">Annulé</option>
                                        <option value="reporté">Reporté</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="filterPaymentStatus" className="block text-xs font-medium text-gray-700">Statut de paiement</label>
                                    <select
                                        id="filterPaymentStatus"
                                        value={projectFilters.paymentStatus}
                                        onChange={(e) => setProjectFilters({ ...projectFilters, paymentStatus: e.target.value })}
                                        className="block w-full mt-1 text-xs border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Tous</option>
                                        <option value="5">Payé</option>
                                        <option value="4">Partiel</option>
                                        <option value="6">Non payé</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="filterVille" className="block text-xs font-medium text-gray-700">Ville</label>
                                    <select
                                        id="filterVille"
                                        value={projectFilters.ville}
                                        onChange={(e) => setProjectFilters({ ...projectFilters, ville: e.target.value })}
                                        className="block w-full mt-1 text-xs border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Toutes les villes</option>
                                        {[...new Set(projets.map(p => p.ville))].map(ville => (
                                            <option key={ville} value={ville}>{ville}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="filterEntreprise" className="block text-xs font-medium text-gray-700">Entreprise</label>
                                    <select
                                        id="filterEntreprise"
                                        value={projectFilters.entreprise}
                                        onChange={(e) => setProjectFilters({ ...projectFilters, entreprise: e.target.value })}
                                        className="block w-full mt-1 text-xs border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Toutes les entreprises</option>
                                        {[...new Set(projets.map(p => p.entreprise))].map(etp => (
                                            <option key={etp} value={etp}>{etp}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-500 text-center"
                                >
                                    Réf.
                                </th>
                                <th
                                    scope="col"
                                    className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-500 text-center"
                                >
                                    Module
                                </th>
                                <th
                                    scope="col"
                                    className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-500 text-center"
                                >
                                    Ville
                                </th>
                                <th
                                    scope="col"
                                    className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-500 text-center"
                                >
                                    ETP
                                </th>
                                <th
                                    scope="col"
                                    className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-500 text-center"
                                >
                                    Période
                                </th>
                                <th
                                    scope="col"
                                    className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-500 text-center"
                                >
                                    Nb Apprenants
                                </th>
                                <th
                                    scope="col"
                                    className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-500 text-center"
                                >
                                    Montant Total
                                </th>
                                <th
                                    scope="col"
                                    className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-500 text-center"
                                >
                                    Statut
                                </th>
                                <th
                                    scope="col"
                                    className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-500"
                                >
                                    Paiement
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentProjets.length > 0 ? (
                                currentProjets.map((projet) => (
                                    <tr key={projet.id} className="hover:bg-gray-50">
                                        <td className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium text-gray-500">
                                            {projet.reference}
                                        </td>
                                        <td className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium text-gray-500"
                                            title={projet.module_name}>
                                            {projet.module_name}
                                        </td>
                                        <td className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium text-gray-500">
                                            {projet.ville}
                                        </td>
                                        <td className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium text-gray-500">
                                            {projet.entreprise}
                                        </td>

                                        <td className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium text-gray-500">
                                            {projet.date}
                                        </td>
                                        <td className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium text-gray-500 text-center">
                                            {projet.participants}
                                        </td>
                                        <td className="pw-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium text-gray-500 text-right">
                                            {formatMontant(projet.total_ht, currency)}
                                        </td>
                                        <td className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium text-center text-gray-500">
                                            <StatusBadge status={projet.status} />
                                        </td>
                                        <td className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium text-gray-500">
                                            <PaymentStatus status={projet.payment_status} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="py-8 text-center text-gray-500">
                                        Aucun projet trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {filteredProjects.length > itemsPerPage && (
                    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700">
                                Page {currentPage} sur {totalPages}
                            </span>
                        </div>
                        <div className="flex justify-end flex-1">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4 mr-2" />
                                Précédent
                            </button>
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Suivant
                                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4 overflow-hidden bg-white border border-gray-200 rounded-lg shadow">
                <DocumentListEtp
                    idDossier={idDossier}
                    refreshKey={refreshKey}
                    onDocumentChange={handleDocumentChange}
                />
            </div>
            {/* Modals */}
            <AjoutDocumentModalEtp
                open={open}
                setOpen={setOpen}
                idDossier={dossier.idDossier}
                onDocumentChange={handleDocumentModalClose}
            />

        </div>
    );
};

export default FolderDetailEtp;