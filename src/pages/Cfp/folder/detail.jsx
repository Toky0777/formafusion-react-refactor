import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { StatusBadge } from "../../../components/badge/StatusBadge";
import { FaTimes } from "react-icons/fa";
import { Filter } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearch } from "../../../contexts/cfp/SearchFolderContext";
import { useTranslation } from "react-i18next";
import { formatMontant } from "../../../utils/formatMontant";
import ConfirmModal from "./ConfirmModal";
import ConfirmDeleteProjectModal from "./ConfirmDeleteProjectModal";
import {
  TrashIcon,
  ArrowRightCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import "react-toastify/dist/ReactToastify.css";
import ModifierDossierModal from "../../../components/Modals/folder/ModifierDossierModal";
import DossierManagement from "../../../components/Modals/folder/DossierManagement";
import DeplacerProjetModal from "../../../components/Modals/folder/DeplacerProjetModal";
import DocumentList from "./DocumentList";
import Button from "../../../components/button/Button";
import axios from "../../../config/axios";
import AjoutDocumentModalCfp from "../../../components/Modals/folder/NouveauDocumentModalCfp";
import { ArrowLeft, FileText, Pencil, Trash2, Eye, Settings } from "lucide-react";

// KPI Card Component
const KpiCard = ({ label, value }) => (
  <div className="bg-white rounded-lg p-6 relative overflow-hidden shadow-sm border border-gray-100">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
      {label}
    </div>
    <div className="text-2xl font-semibold text-gray-500">
      {value || "—"}
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
    <div className="flex items-center gap-2 text-sm">
      {Icon && <Icon className={`w-4 h-4 ${color}`} />}
      <span className={color}>{label}</span>
    </div>
  );
};

const ProjectActions = ({ projectId, idDossier, projectName, onDelete, onMove }) => {
  return (
    <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <Link
        to={`/cfp/projet/detail/${projectId}`}
        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors duration-150"
        aria-label="Voir le projet"
        title="Voir les détails du projet"
      >
        <Eye className="w-4 h-4" />
      </Link>

      <button
        onClick={() => onMove(projectId)}
        className="w-8 h-8 flex items-center justify-center  text-gray-600 hover:text-green-600 transition-colors duration-150"
        aria-label="Déplacer le projet"
        title="Déplacer ce projet dans un autre dossier"
      >
        <ArrowRightCircleIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(idDossier, projectId, projectName)}
        className="w-8 h-8 flex items-center justify-center text-gray-600  hover:text-red-600 transition-colors duration-150"
        aria-label="Supprimer le projet"
        title="Supprimer le projet associé de ce dossier"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

const FolderDetail = () => {
  const statusLabels = {
    "En préparation": "En préparation",
    "En cours": "En cours",
    Planifié: "Planifié",
    Terminé: "Terminé",
    Annulé: "Annulé",
    Reporté: "Reporté",
    Cloturé: "Cloturé",
  };

  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [refreshDocuments, setRefreshDocuments] = useState(0);
  const currency = "MGA";
  const {
    searchTerm: globalSearchTerm,
    setSearchTerm: setGlobalSearchTerm,
    searchResults,
  } = useSearch();
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation();
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
  });

  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpenDeplaceProjet, setModalOpenDeplaceProjet] = useState(false);
  const [projetADeplacerId, setProjetADeplacerId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const refreshProjets = useCallback(async (silent = false) => {
    const storedToken = localStorage.getItem("token");

    if (!silent) {
      setLoading(true);
    }

    try {
      if (!storedToken) {
        toast.error("Veuillez vous connecter.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `/cfp/dossier/getDossierDetail/${idDossier}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      const data = response.data;

      if (!data || typeof data !== "object") {
        throw new Error("Réponse API invalide : données vides ou non valides");
      }

      const entreprises = data.nomsEntreprises
        ? data.nomsEntreprises.filter((etp) => etp !== null && etp !== "")
        : [];

      const dossierStatus =
        data.status || data.payment_status || "En préparation";
      const normalizedStatus = statusLabels[dossierStatus] || "En préparation";

      function formatDateOrDash(date) {
        if (!date || isNaN(new Date(date))) return "—";
        return new Date(date).toLocaleDateString("fr-FR");
      }

      setDossier({
        idDossier: idDossier,
        nomDossier: data.nomDossier || "Nom inconnu",
        entreprises: entreprises,
        status: normalizedStatus,
        montantTotal: data.montantTotal
          ? formatMontant(data.montantTotal, currency)
          : formatMontant(0, currency),
        period: `${formatDateOrDash(data.dateMinProjet)} → ${formatDateOrDash(
          data.dateMaxProjet
        )}`,
        project_types: data.project_types?.map((pt) => pt.project_type) || [],
        villes: data.villes?.map((v) => v.ville) || [],
        module_names: data.module_names?.map((m) => m.module_name) || [],
        projet_count: data.projet_count || 0,
        apprenants: data.apprenants || 0,
        nombreDocument: data.nombreDocument || 0,
        statusDossier: normalizedStatus,
        payment_status: data.payment_status ?? 6,
      });

      const projetsData = data.projets || [];
      const newProjets = projetsData.map((projet) => ({
        id: projet.idProjet,
        module_name: projet.module_name || "Module inconnu",
        reference: projet.reference || "Référence inconnue",
        entreprise: projet.etp_name || "Entreprise inconnue",
        ville: projet.ville || "Ville inconnue",
        status: projet.project_status || "Inconnu",
        date: `${projet.dateDebut
          ? new Date(projet.dateDebut).toLocaleDateString("fr-FR")
          : "—"
          } → ${projet.dateFin
            ? new Date(projet.dateFin).toLocaleDateString("fr-FR")
            : "—"
          }`,
        participants: projet.participants || 0,
        total_ht: projet.total_ht ? Number(projet.total_ht) : 0,
        payment_status: projet.payment_status ?? 6,
      }));

      setProjets(newProjets);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors du chargement des données.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [idDossier, navigate, currency]);

  useEffect(() => {
    setProjectFilters((prev) => ({
      ...prev,
      search: globalSearchTerm,
    }));
  }, [globalSearchTerm]);

  useEffect(() => {
    if (idDossier) {
      refreshProjets();
    }
  }, [idDossier, refreshKey]);

  const filteredProjects = useMemo(() => {
    if (globalSearchTerm && searchResults?.projets) {
      const globalFiltered = searchResults.projets.filter(
        (projet) => projet.idDossier === dossier.idDossier
      );
      return globalFiltered.filter((projet) => {
        const matchesStatus =
          projectFilters.status === "" ||
          (projet.status &&
            projet.status.toLowerCase() ===
            projectFilters.status.toLowerCase());

        const matchesVille =
          projectFilters.ville === "" ||
          (projet.ville &&
            projet.ville.toLowerCase() === projectFilters.ville.toLowerCase());

        const matchesEntreprise =
          projectFilters.entreprise === "" ||
          (projet.entreprise &&
            projet.entreprise.toLowerCase() ===
            projectFilters.entreprise.toLowerCase());

        const matchesPaymentStatus =
          projectFilters.paymentStatus === "" ||
          (projet.payment_status &&
            projet.payment_status.toString() === projectFilters.paymentStatus);

        return (
          matchesStatus &&
          matchesVille &&
          matchesEntreprise &&
          matchesPaymentStatus
        );
      });
    }

    return projets.filter((projet) => {
      const matchesSearch =
        projectFilters.search === "" ||
        Object.values(projet).some((value) =>
          String(value)
            .toLowerCase()
            .includes(projectFilters.search.toLowerCase())
        );

      const matchesStatus =
        projectFilters.status === "" ||
        (projet.status &&
          projet.status.toLowerCase() === projectFilters.status.toLowerCase());

      const matchesVille =
        projectFilters.ville === "" ||
        (projet.ville &&
          projet.ville.toLowerCase() === projectFilters.ville.toLowerCase());

      const matchesEntreprise =
        projectFilters.entreprise === "" ||
        (projet.entreprise &&
          projet.entreprise.toLowerCase() ===
          projectFilters.entreprise.toLowerCase());

      const matchesPaymentStatus =
        projectFilters.paymentStatus === "" ||
        (projet.payment_status &&
          projet.payment_status.toString() === projectFilters.paymentStatus);

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

  const handleDeleteProject = useCallback((idDossier, idProjet, projectName) => {
    setProjectToDelete({
      idDossier,
      idProjet,
      name: projectName
    });
    setShowDeleteProjectModal(true);
  }, []);

  const getDossier = () => navigate("/cfp/dossier");

  const handleDeleteDossier = async (idDossier) => {
    if (!token) {
      toast.error("Utilisateur non authentifié. Veuillez vous connecter.");
      navigate("/login");
      return;
    }

    if (!idDossier) {
      toast.error("Identifiant du dossier manquant.");
      return;
    }

    if (dossier.projet_count > 0) {
      toast.error(
        <div>
          <div className="font-semibold">Impossible de supprimer le dossier</div>
          <div>Ce dossier contient {dossier.projet_count} projet(s) associé(s).</div>
          <div className="text-sm mt-1">
            Veuillez d'abord supprimer ou déplacer les projets avant de supprimer le dossier.
          </div>
        </div>,
        { autoClose: 5000 }
      );
      setShowModal(false);
      return;
    }

    setIsDeleting(true);

    try {
      await axios.delete(`/cfp/dossier/delete/${idDossier}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Dossier supprimé avec succès !");

      await new Promise(resolve => setTimeout(resolve, 500));

      setShowModal(false);

      window.dispatchEvent(new CustomEvent('dossierDeleted', {
        detail: {
          deletedDossierId: idDossier,
          dossierName: dossier.nomDossier
        }
      }));

      setTimeout(() => {
        navigate("/cfp/dossier");
      }, 800);

    } catch (err) {
      console.error("Erreur détaillée:", err);

      let errorMessage = "Erreur lors de la suppression";
      if (err.response?.status === 404) {
        errorMessage = "Dossier non trouvé";
      } else if (err.response?.status === 403) {
        errorMessage = "Vous n'avez pas les droits pour supprimer ce dossier";
      } else if (err.response?.status === 409) {
        errorMessage = "Impossible de supprimer le dossier : il contient encore des projets";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
      setShowModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateDossier = async (newName) => {
    if (!token) {
      toast.error("Utilisateur non authentifié. Veuillez vous connecter.");
      navigate("/login");
      throw new Error("No token found");
    }

    try {
      await axios.post(
        `/cfp/dossier/update/${idDossier}`,
        { nomDossier: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDossier((prev) => ({ ...prev, nomDossier: newName }));
      toast.success("Dossier mis à jour avec succès !");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Erreur inconnue";
      toast.error(`Erreur lors de la mise à jour: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  };

  const confirmDeleteProject = useCallback(async () => {
    if (!projectToDelete) return;

    setIsDeletingProject(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Veuillez vous connecter.");
        navigate("/login");
        return;
      }

      await axios.post(
        `/cfp/dossier/document/supprimer/${projectToDelete.idDossier}/${projectToDelete.idProjet}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Projet supprimé du dossier avec succès !");

      // Rafraîchissement silencieux sans loading
      await refreshProjets(true);

    } catch (error) {
      console.error("Erreur lors de la suppression du projet :", error);
      toast.error(
        `Erreur lors de la suppression du projet : ${error.response?.data?.message || error.message}`
      );
    } finally {
      setIsDeletingProject(false);
      setShowDeleteProjectModal(false);
      setProjectToDelete(null);
    }
  }, [projectToDelete, navigate, refreshProjets]);

  // Fonction d'annulation de suppression
  const cancelDeleteProject = useCallback(() => {
    setShowDeleteProjectModal(false);
    setProjectToDelete(null);
    setIsDeletingProject(false);
  }, []);

  const handleMoveProject = useCallback((idProjet) => {
    setProjetADeplacerId(idProjet);
    setModalOpenDeplaceProjet(true);
  }, []);

  const handleDocumentAdded = useCallback((newDocument) => {
    setDocuments((prev) => [newDocument, ...prev]);
    setRefreshDocuments((prev) => prev + 1);
  }, []);

  const refreshDocumentsList = useCallback(() => {
    setRefreshDocuments((prev) => prev + 1);
  }, []);

  const resetFilters = () => {
    setProjectFilters({
      search: "",
      status: "",
      ville: "",
      entreprise: "",
      paymentStatus: "",
    });
    setGlobalSearchTerm("");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );

  if (error)
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

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="container mx-auto px-6 pt-0 max-w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center gap-4 text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={getDossier}
              aria-label="Retour aux dossiers"
              className="flex items-center gap-1 px-2 py-1 text-gray-600 transition-colors duration-150 ease-in-out rounded-md hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Retour aux dossiers</span>
            </Button>
            <h2 className="text-lg text-gray-500 font-normal truncate">
              <strong>{dossier.nomDossier}</strong>
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors duration-150"
              onClick={() => setOpen(true)}
              title="Nouveau document"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 transition-colors duration-150"
              onClick={() => setShowDossierModal(true)}
              title="Gérer les projets"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 transition-colors duration-150"
              onClick={() => setIsModalOpen(true)}
              title="Renommer le dossier"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              className={`w-9 h-9 flex items-center justify-center transition-colors duration-150 ${dossier.projet_count > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-500"
                }`}
              onClick={() => {
                if (dossier.projet_count > 0) {
                  toast.error(
                    `Impossible de supprimer : ce dossier contient ${dossier.projet_count} projet(s)`
                  );
                  return;
                }
                setSelectedId(idDossier);
                setShowModal(true);
              }}
              disabled={dossier.projet_count > 0}
              title={
                dossier.projet_count > 0
                  ? [
                    `Vous ne pouvez pas encore supprimer ce dossier tant qu'il reste`,
                    `(${dossier.projet_count} projet(s) associé(s)).`,
                    `Veuillez d'abord supprimer ou déplacer les projets avant de supprimer le dossier.`
                  ].join('\n')
                  : "Supprimer le dossier"
              }
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Entreprise participante(s)
          </div>
          <div className="flex flex-wrap gap-2">
            {dossier.entreprises && dossier.entreprises.length > 0 ? (
              dossier.entreprises.map((entreprise, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500"
                >
                  {entreprise}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm italic">
                Aucune entreprise associée
              </span>
            )}
          </div>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
          <KpiCard label="Montant Total" value={dossier.montantTotal} />
          <KpiCard label="Période" value={dossier.period} />
          <KpiCard label="Type de Projets" value={dossier.project_types.join(", ") || "—"} />
          <KpiCard label="Nombre de Projets" value={dossier.projet_count?.toString() || "0"} />
        </div>
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-0">
              <h2 className="text-lg font-semibold text-gray-500">Projets associé(s)</h2>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <button
                className="w-9 h-9 flex items-center justify-center bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-150"
                onClick={() => setShowFilters(!showFilters)}
                title="Afficher les filtres"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>

          </div>
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="bg-white-50  p-4 mb-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Statut
                    </label>
                    <select
                      value={projectFilters.status}
                      onChange={(e) =>
                        setProjectFilters({
                          ...projectFilters,
                          status: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Tous les statuts</option>
                      {[...new Set(projets.map((p) => p.status))].map(
                        (status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Ville
                    </label>
                    <select
                      value={projectFilters.ville}
                      onChange={(e) =>
                        setProjectFilters({
                          ...projectFilters,
                          ville: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Toutes les villes</option>
                      {[...new Set(projets.map((p) => p.ville))].map((ville) => (
                        <option key={ville} value={ville}>
                          {ville}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Entreprise
                    </label>
                    <select
                      value={projectFilters.entreprise}
                      onChange={(e) =>
                        setProjectFilters({
                          ...projectFilters,
                          entreprise: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Toutes les entreprises</option>
                      {[...new Set(projets.map((p) => p.entreprise))].map(
                        (entreprise) => (
                          <option key={entreprise} value={entreprise}>
                            {entreprise}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Statut Paiement
                    </label>
                    <select
                      value={projectFilters.paymentStatus}
                      onChange={(e) =>
                        setProjectFilters({
                          ...projectFilters,
                          paymentStatus: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Tous les statuts</option>
                      <option value="5">Payé</option>
                      <option value="4">Partiel</option>
                      <option value="6">Non payé</option>
                    </select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="flex justify-end">
                    <button
                      onClick={resetFilters}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-150"
                    >
                      <FaTimes className="w-3 h-3" />
                      <span>Effacer les filtres</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Référence
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Entreprise
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ville
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-2/12">
                    Période
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/12">
                    Participants
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Montant HT
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Statut Paiement
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentProjets.length > 0 ? (
                  currentProjets.map((projet) => (
                    <tr
                      key={projet.id}
                      className="group hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-2 text-xs text-gray-900 max-w-xs truncate whitespace-nowrap overflow-hidden" title={projet.module_name}>
                        {projet.module_name}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-900 max-w-xs truncate whitespace-nowrap overflow-hidden" title={projet.reference}>
                        {projet.reference}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-900 max-w-xs truncate whitespace-nowrap overflow-hidden" title={projet.entreprise}>
                        {projet.entreprise}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-900 max-w-xs truncate whitespace-nowrap overflow-hidden" title={projet.ville}>
                        {projet.ville}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-900 max-w-xs truncate whitespace-nowrap overflow-hidden" title={projet.status}>
                        <StatusBadge status={projet.status} />
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-900 truncate whitespace-nowrap overflow-hidden w-2/12" title={projet.date}>
                        {projet.date}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-900 text-center truncate whitespace-nowrap overflow-hidden w-1/12" title={projet.participants}>
                        {projet.participants || 0}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-900 text-right max-w-xs truncate whitespace-nowrap overflow-hidden" title={projet.total_ht}>
                        {formatMontant(projet.total_ht, currency)}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-900 max-w-xs truncate whitespace-nowrap overflow-hidden" title={projet.payment_status}>
                        <PaymentStatus status={projet.payment_status} />
                      </td>
                      <td className="px-4 py-2 text-xs">
                        <ProjectActions
                          projectId={projet.id}
                          idDossier={dossier.idDossier}
                          projectName={projet.module_name}
                          onDelete={handleDeleteProject}
                          onMove={handleMoveProject}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="px-4 py-6 text-center text-sm text-gray-500">
                      Aucun projet trouvé pour ce dossier.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
          {filteredProjects.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-6 text-sm text-gray-600">
              <span>Page {currentPage} sur {totalPages}</span>
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <DocumentList
            idDossier={idDossier}
            refreshKey={refreshDocuments}
            onDocumentChange={refreshDocumentsList}
            onDocumentAdded={handleDocumentAdded}
            dossierName={dossier.nomDossier}
            externalDocuments={documents}
            setExternalDocuments={setDocuments}
          />
        </div>
      </div>
      <DeplacerProjetModal
        isOpen={modalOpenDeplaceProjet}
        idProjet={projetADeplacerId}
        onClose={() => {
          setModalOpenDeplaceProjet(false);
          setProjetADeplacerId(null);
        }}
        onConfirm={async (idProjet, idDossier) => {
          try {
            const token = localStorage.getItem("token");
            if (!token) {
              toast.error("Veuillez vous connecter.");
              navigate("/login");
              return;
            }

            await axios.post(
              "/cfp/dossier/move-projet",
              { idProjet, idDossier },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            await refreshProjets(true);
          } catch (err) {
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Erreur lors du déplacement du projet.";
            toast.error(errorMessage);
          } finally {
            setModalOpenDeplaceProjet(false);
            setProjetADeplacerId(null);
          }
        }}
      />

      <ConfirmDeleteProjectModal
        show={showDeleteProjectModal}
        projectName={projectToDelete?.name || "ce projet"}
        onCancel={cancelDeleteProject}
        onConfirm={confirmDeleteProject}
        isLoading={isDeletingProject}
      />

      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => handleDeleteDossier(selectedId)}
        title="Supprimer le dossier"
        message={`Êtes-vous sûr de vouloir supprimer le dossier "${dossier.nomDossier}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
        isLoading={isDeleting}
      />

      {isModalOpen && (
        <ModifierDossierModal
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdateDossier}
          nomInitial={dossier.nomDossier}
        />
      )}

      {open && dossier.idDossier && (
        <AjoutDocumentModalCfp
          isOpen={open}
          onClose={() => setOpen(false)}
          dossierName={dossier.nomDossier}
          idDossier={dossier.idDossier}
          onDocumentAdded={handleDocumentAdded}
        />
      )}

      <DossierManagement
        dossierName={dossier.nomDossier}
        dossierId={dossier.idDossier}
        isOpen={showDossierModal}
        onClose={() => setShowDossierModal(false)}
      />

      <DossierManagement
        dossierName={dossier.nomDossier}
        dossierId={dossier.idDossier}
        isOpen={showDossierModal}
        onClose={() => setShowDossierModal(false)}
        onProjectChange={() => refreshProjets(true)}
      />
    </div>
  );
};

export default FolderDetail;