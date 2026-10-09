import React, { useState, useEffect, useRef, useCallback } from "react";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import {
  FaFolder,
  FaPen,
  FaHandshake,
  FaDownload,
  FaPlus,
  FaArrowRight,
  FaCalendarDay,
  FaBuilding,
  FaChalkboard,
  FaBullseye,
  FaBoxOpen,
  FaTrashCan,
  FaCopy,
  FaCircleXmark,
  FaMinus,
} from "react-icons/fa6";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationModal from "../../../components/Modals/project/confirmation-modal";
import axios from "../../../config/axios";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Eye,
  FileText,
  Folder,
  Info,
  Plus,
  Search,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { FaBan, FaBolt, FaCheckCircle } from "react-icons/fa";
import AjoutDocumentModalEtp from "../../../components/Modals/folder/NouveauDocumentModalEtp";
import { LearnerList } from "../../../components/project/detail/learner-list";
import { FinancialAspect } from "../../../components/project/detail/financial-aspect";
import { Agenda } from "../../../components/project/detail/agenda";
import { EntrepriseSection } from "../../../components/project/detail/entreprise";
import { TrainerSection } from "../../../components/project/detail/trainer";
import { MaterialSection } from "../../../components/project/detail/material";
import { PlaceSection } from "../../../components/project/detail/place";
import { Toaster } from "react-hot-toast";
import MediaUploadForm from "../../Formateur/projet/MediaUploadForm";
import { API_URL, IMAGE_URL } from "../../../config/env";

const ProjectDetail = () => {
  const { id } = useParams();
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [idEtp, setIdEtp] = useState(null);
  const [EtpName, setEtpName] = useState([]);
  const [idSubContractor, setIdSubContractor] = useState(null);
  const [idDossier, setIdDossier] = useState(null);
  const [tousModules, setTousModules] = useState([]);
  const [tousModalites, setTousModalites] = useState([]);
  const [bc, setBonCommand] = useState([]);
  const [tousDossier, setTousDossier] = useState({ dossiers: [] });
  const [tousProgram, setTousProgram] = useState([]);
  const [etp, setEtp] = useState([]);
  const [formateur, setFormateur] = useState([]);
  const [projet, setProjet] = useState({ projet: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("vue-ensemble");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [showPageAgenda, setShowPageAgenda] = useState(false);
  const [showPageDocument, setShowPageDocument] = useState(false);
  const [showPageDossier, setShowPageDossier] = useState(false);
  const [showPageInformation, setShowPageInformation] = useState(false);
  const [showPageSousTraitant, setShowPageSousTraitant] = useState(false);
  const [showConfirmSuprimer, setShowConfirmSuprimer] = useState(false);
  const [showConfirmDupliquer, setShowConfirmDupliquer] = useState(false);
  const [showConfirmReporter, setShowConfirmReporter] = useState(false);
  const [showConfirmCloturer, setShowConfirmCloturer] = useState(false);
  const [showConfirmRestoration, setShowConfirmRestoration] = useState(false);
  const [showConfirmAnnuler, setShowConfirmAnnuler] = useState(false);
  const [showConfirmValider, setShowConfirmValider] = useState(false);
  const [showConfirmDeleteSeance, setShowConfirmDeleteSeance] = useState(false);
  const [showModificationTypeSession, setShowModificationTypeSession] =
    useState(false);
  const [selectedSessionType, setSelectedSessionType] = useState("false");
  const [currentSeanceId, setCurrentSeanceId] = useState(null);
  const [seanceToDelete, setSeanceToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSalle, setSearchSalle] = useState("");
  const [searchDossier, setSearchDossier] = useState("");
  const currentYear = new Date().getFullYear();
  const [AfficheAgenda, setAfficheAgenda] = useState(true);

  const [AfficheLieu, setAfficheLieu] = useState(true);
  const [notification, setNotification] = React.useState({
    message: "",
    type: "",
  });
  const [showNotification, setShowNotification] = React.useState(false);
  const [apprs, setApprs] = useState([]);
  const [subContract, setSubContract] = useState([]);
  const [tousSub, setTousSub] = useState([]);
  const [document, setDocument] = useState([]);
  const [idModule, setIdModule] = useState(null);
  const [idModalite, setIModalite] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [session, setSessionProjet] = useState([]);
  const [reference, setReference] = useState("");
  const [idBC, setidBc] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectMaterials, setProjectMaterials] = useState([]);
  const [search, setSearch] = useState("");
  const [isUndetermined, setIsUndetermined] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState(null);
  const [showReportInput, setShowReportInput] = useState(false);
  const [reportDate, setReportDate] = useState("");
  const [reportStartTime, setReportStartTime] = useState("");
  const [reportEndTime, setReportEndTime] = useState("");
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [purchaseOrder, setPurchaseOrder] = useState([]);
  const [projectType, setProjectType] = useState(null);
  const [roomName, setRoomName] = useState([]);
  const [neighborhood, setNeighborhood] = useState([]);
  const [city, setCity] = useState([]);
  const [folders, setFolders] = useState([]);
  const [learnersAdded, setLearnersAdded] = useState([]);
  const [totalHt, setTotalHt] = useState(0);
  const [totalTtc, setTotalTtc] = useState(0);
  const [payment, setPayment] = useState(null);
  const [taxe, setTaxe] = useState(0);

  const allSeances = session?.seances?.reduce((acc, seance) => {
    acc.push(seance);

    if (seance.is_reported === 1 && seance.report_date) {
      acc.push({
        ...seance,
        id: `${seance.idSeance}-report`,
        start: seance.report_date,
        end: seance.heure_fin_reportee,
        start_time: seance.heure_debut_reportee,
        end_time: seance.heure_fin_reportee,
        is_reported: 0,
        original_seance_id: seance.id,
      });
    }

    return acc;
  }, []);

  const note = parseFloat(projet?.evaluations?.noteGeneral) || 0;
  const avis = projet?.evaluations?.countNotationProjet || 0;

  const toggleAfficheAgenda = () => {
    setAfficheAgenda((prev) => !prev);
  };

  const toggleAfficheLieu = () => {
    setAfficheLieu((prev) => !prev);
  };

  const getStatusColor = (status) => {
    const colors = {
      "En préparation":
        "bg-amber-100 text-amber-800",
      "En cours":
        "bg-blue-100 text-blue-800",
      Terminé:
        "bg-emerald-100 text-emerald-800",
      Planifié:
        "bg-violet-100 text-violet-800",
      Cloturé:
        "bg-slate-200 text-slate-700",
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  const fetchProjectDetails = async (id, showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const { data } = await axios.get(`/cfp/projets/${id}/detail`);

      if (!data || data.error || !data.projet) {
        throw new Error(data?.error || "Structure de données invalide");
      }

      setProjet(data);
      setProjectType(data?.projet?.idTypeProjet);
      console.log(data);

      // S'assurer que idEtp a une valeur même si null
      const projectIdEtp = data?.projet?.idEtp ?? null;
      setIdEtp(projectIdEtp);

      setEtpName(data?.projet?.etp_name || "");
      setIdModule(data?.projet?.idModule ?? null);
      setFormateur(data?.trainers);
      setEtp(data?.entreprises);
      setRoomName(data?.projet?.salle_name);
      setNeighborhood(data?.projet?.salle_quartier);
      setCity(data?.projet?.ville);
      setLearnersAdded(data?.learners);
      setSelectedPaiement(data?.projet?.idPaiement);
      setTotalHt(data?.projet.total_ht);
      setTotalTtc(data?.projet.total_ttc);
      setPayment(data?.projet.paiement);
      setTaxe(data?.projet.taxe);
      setProjectMaterials(data?.materials);

      if (data.dossier) {
        setIdDossier(data.dossier.idDossier);
      } else {
        setIdDossier(null);
      }

      setIdSubContractor(data?.projet?.idSubContractor ?? null);
      setError(null);
    } catch (error) {
      console.error(" Erreur dans fetchProjectDetails :", error);
      setError(error.message || "Erreur inconnue");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const fetchDossierProjet = async (id) => {
    try {
      const [tousDossierRes, documentRes] = await Promise.all([
        axios.get(`/cfp/projet/folder-first/year/${currentYear}`),
        axios.get(`/cfp/dossier/document/projets/${id}`),
      ]);

      setTousDossier(tousDossierRes.data || []);
      setDocument(documentRes.data || []);
    } catch (error) {
      console.error(
        "❌ Erreur lors de la récupération des dossiers et documents :",
        error
      );
    }
  };

  const fetchProgramProjet = async (idModule) => {
    try {
      const [programRes] = await Promise.all([
        axios.get(`/cfp/projets/${idModule}/getProgrammeProject`),
      ]);
      setTousProgram(programRes.data || []);
    } catch (err) {
      console.error("Erreur lors du chargement des programes :", error);
    }
  };

  const fetchBonCommand = async (EtpName) => {
    if (!idEtp) {
      console.warn("Aucun EtpName fourni — la requête n’est pas exécutée.");
      return;
    }

    try {
      const res = await axios.get(
        `/cfp/bon-commande/getBonCommandByEtp/${EtpName}`
      );

      // Vérifie si la structure contient la clé 'bc'
      const data = res.data?.bc ?? [];
      setBonCommand(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des bons de commande :",
        error
      );
    }
  };

  const fetchModuleProjet = async () => {
    try {
      const [tousModulesRes, tousModalitesRes] = await Promise.all([
        axios.get(`${API_URL}/cfp/modules/getAllModule`),
        axios.get(`${API_URL}/cfp/projets/getModalite/all`),
      ]);

      setTousModules(tousModulesRes.data || []);
      setTousModalites(tousModalitesRes.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des salles :", error);
    }
  };

  const fetchSubProjet = async (id) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/cfp/subcontractors/${id}/getAssign`
      );

      setTousSub({
        cfp: data.cfp ? [data.cfp] : [],
      });

      if (!subContract || subContract.length === 0) {
        const res = await axios.get(
          `${API_URL}/cfp/subcontractors`
        );
        setSubContract(res.data || []);
      }
    } catch (error) {
      console.error(
        "❌ Erreur lors de fetchSubProjet :",
        error.response?.data || error.message
      );
    }
  };

  const fetchSeanceProjet = async (id) => {
    const [seanceRes] = await Promise.all([
      axios.get(`${API_URL}/cfp/seances/all/${id}`),
    ]);

    setSessionProjet(seanceRes.data || []);
  };

  const manageSubContract = async (method, id, idSubContractor) => {
    if (method === "post") {
      try {
        const response = await axios.post(
          `${API_URL}/cfp/subcontractors/assign/${id}/${idSubContractor}`
        );

        fetchSubProjet(id);
      } catch (error) {
        console.error("Erreur de l'ajout de  apprenant:", error);
      }
    }

    if (method === "delete") {
      try {
        const response = await axios.delete(
          `${API_URL}/cfp/subcontractors/assign/${idSubContractor}`
        );

        if (response.status != 200) {
          throw new Error("Erreur lors de l'ajout ");
        }

        await fetchSubProjet(id);
      } catch (error) {
        console.error("Erreur de l'ajout de  apprenant:", error);
      }
    }
  };

  const manageDossier = async (method, id, idDossier) => {
    if (method === "post") {
      try {
        const response = await axios.post(
          `${API_URL}/cfp/projet/folder-first/document/${idDossier}/${id}`
        );

        if (response.status != 200) {
          throw new Error("Erreur lors de l'ajout ");
        }

        await fetchProjectDetails(id, false);
      } catch (error) {
        console.error("Erreur de l'ajout de dossier:", error);
      }
    }
  };

  const DeleteSeance = async (method, idSeance) => {
    if (method === "delete") {
      setShowConfirmDeleteSeance(false);
      try {
        const response = await axios.delete(
          `${API_URL}/cfp/seances/${idSeance}/delete`
        );
        if (response.status != 200) {
          throw new Error("Erreur lors de supression ");
        }
        fetchSeanceProjet(id);
      } catch (error) {
        console.error("Erreur de la supression:", error);
      }
    }
  };

  const handleDeleteSeance = async () => {
    setShowConfirmDeleteSeance(false);
    try {
      await DeleteSeance("delete", seanceToDelete);
      setSeanceToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleConfirmTypeChange = async () => {
    if (!currentSeanceId) return;

    setShowModificationTypeSession(false);

    try {
      const payload = {};

      if (selectedSessionType === "report") {
        // SESSION REPLANIFIÉE
        payload.is_report = true;
        payload.is_undetermined = !!isUndetermined;

        if (!isUndetermined && reportDate) {
          // CORRECTION : Nettoyer la date avant envoi
          let cleanDate = reportDate;
          if (cleanDate.includes("T")) {
            cleanDate = cleanDate.split("T")[0];
          }

          payload.report_date = cleanDate;

          // S'assurer que les heures sont au bon format
          if (reportStartTime && reportStartTime.trim() !== "") {
            payload.heure_debut_reportee = reportStartTime.includes(":")
              ? reportStartTime
              : reportStartTime + ":00";
          }
          if (reportEndTime && reportEndTime.trim() !== "") {
            payload.heure_fin_reportee = reportEndTime.includes(":")
              ? reportEndTime
              : reportEndTime + ":00";
          }
        }

        payload.session_catch_up = "false";
      } else if (selectedSessionType === "true") {
        // SESSION DE RATTRAPAGE
        payload.session_catch_up = "true";
        payload.is_report = false;
        // Réinitialiser les champs de report explicitement
        payload.report_date = null;
        payload.heure_debut_reportee = null;
        payload.heure_fin_reportee = null;
        payload.is_undetermined = false;
      } else {
        // SESSION NORMALE
        payload.session_catch_up = "false";
        payload.is_report = false;
        // Réinitialiser les champs de report explicitement
        payload.report_date = null;
        payload.heure_debut_reportee = null;
        payload.heure_fin_reportee = null;
        payload.is_undetermined = false;
      }

      const response = await axios.post(
        `/cfp/seances/updateTypeSeance/${currentSeanceId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === 200) {
        toast.success(
          response.data.message || "Séance mise à jour avec succès !"
        );
        await fetchSeanceProjet(id);

        // Réinitialiser les états
        setSelectedSessionType("false");
        setShowReportInput(false);
        setReportDate("");
        setReportStartTime("");
        setReportEndTime("");
        setIsUndetermined(false);
        setCurrentSeanceId(null);
      } else {
        toast.warning(response.data.message || "Aucune modification effectuée");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);

      // Message d'erreur plus détaillé
      if (error.response) {
        const errorMessage = error.response.data.message || "Erreur serveur";
        toast.error(`Erreur: ${errorMessage}`);
        console.error("Détails erreur:", error.response.data);
      } else {
        toast.error("Erreur réseau ou serveur indisponible");
      }
    }
  };

  const updateProjet = async (id) => {
    try {
      let infos = {},
        module = {},
        dates = {};
      let allGood = true;

      // 🔹 Update infos si nécessaire
      if (reference || title || description) {
        const resInfos = await axios.patch(
          `${API_URL}/cfp/projets/${id}/updateProjet`,
          {
            project_reference: reference,
            idBC: idBC,
            project_title: title,
            project_description: description,
            project_type: "Intra",
          }
        );
        infos = resInfos.data;
        if (resInfos.status !== 200) allGood = false;
      }

      if (!idModule) return;

      const res = await axios.patch(
        `${API_URL}/cfp/projets/${id}/update-module`,
        {
          idModule: Number(idModule),
        }
      );

      if (res.status === 200) {
        const updatedModule = res.data;

        setProjet((prev) => ({
          ...prev,
          projet: {
            ...prev.projet,
            module_id: updatedModule.id,
            module_name: updatedModule.name,
          },
        }));
      } else {
        console.error("Erreur lors de la mise à jour du module");
      }

      if (!idModalite) return;

      const response = await axios.patch(
        `${API_URL}/cfp/projets/${id}/update/modalite`,
        {
          idModalite: Number(idModalite),
        }
      );

      if (response.status === 200) {
        const updatedModalite = response.data;

        setProjet((prev) => ({
          ...prev,
          projet: {
            ...prev.projet,
            modalite_id: updatedModalite.idModalite,
            modalite_name: updatedModalite.name,
          },
        }));
      } else {
        console.error("Erreur lors de la mise à jour du module");
      }

      // 🔹 Update dates si les deux dates sont présentes
      if (dateDebut && dateFin) {
        // Format des dates en YYYY-MM-DD
        const formattedDateDebut = new Date(dateDebut)
          .toISOString()
          .slice(0, 10);
        const formattedDateFin = new Date(dateFin).toISOString().slice(0, 10);

        const resDate = await axios.patch(
          `${API_URL}/cfp/projets/${id}/update-date`,
          {
            dateDebut: formattedDateDebut,
            dateFin: formattedDateFin,
          }
        );

        dates = resDate.data;
        if (resDate.status !== 200) allGood = false;
      }

      // 🔹 Résultat final
      if (allGood) {
        setNotification({
          message: "Projet mis à jour avec succès",
          type: "success",
        });
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        await fetchProjectDetails(id, false);
      } else {
        console.warn("⚠️ Certaines modifications n’ont pas été appliquées.");
        alert("⚠️ Certaines modifications n’ont pas été appliquées.");
      }
    } catch (err) {
      console.error("❌ Erreur réseau :", err);

      // Affiche le détail de l'erreur si dispo
      if (err.response) {
        console.error("📥 Réponse du serveur :", err.response.data);
        alert(
          `Erreur ${err.response.status} : ${err.response.data.message || "Voir console pour plus de détails."
          }`
        );
      } else {
        alert("❌ Erreur réseau.");
      }
    }
  };

  const downloadPDF = async (id) => {
    try {
      const response = await axios.post(
        `${API_URL}/cfp/projets/detailProjetCfpPdf/${id}`
      );

      if (response.status != 200) {
        const errorText = await response.text();
        console.error("Erreur backend:", errorText);
        throw new Error(`Erreur serveur ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `projet_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur téléchargement PDF:", error);
    }
  };

  const updatePurchaseOrder = async (orderId, id) => {
    try {
      const response = await axios.put(
        `${API_URL}/cfp/projets/${id}/update-order`,
        { orderId }
      );
      const data = response.data.order;
      setProjet((prev) => ({
        ...prev,
        projet: {
          ...prev.projet,
          numero_bc: data.numero,
          idBc: data.idBc,
        },
      }));
      fetchPurchaseOrder(id);
    } catch (error) {
      console.error("Erreur de l'ajout de taxe :", error);
    }
  };
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleAssignOrder = async (orderId) => {
    try {
      await updatePurchaseOrder(orderId, id);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Filtrage des bons de commande
  const filteredOrders =
    projet?.purchase_orders?.filter(
      (order) =>
        order.numero_bc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.montant_bc.toString().includes(searchTerm)
    ) || [];

  const fetchPurchaseOrder = async (id) => {
    const response = await axios.get(
      `${API_URL}/cfp/projets/purchase-order/${id}`
    );
    setPurchaseOrder(response.data);
  };

  const filteredDossier = tousDossier?.dossiers?.filter((e) =>
    e.nomDossier?.toLowerCase().includes(searchDossier.toLowerCase())
  );

  useEffect(() => {
    if (projet?.projet?.project_reference) {
      setReference(projet.projet.project_reference);
    }
    if (projet?.projet?.project_reference) {
      setTitle(projet.projet.project_title);
    }
    if (projet?.projet?.project_reference) {
      setDescription(projet.projet.project_description);
    }
  }, [projet]);

  const filteredMateriels = projet?.materiels
    ? projet.materiels.filter((m) => m.idModule === idModule)
    : [];

  const filteredObjectifs = projet?.objectifs
    ? projet.objectifs.filter((o) => o.idModule === idModule)
    : [];

  const annulerProjet = async (id) => {
    setShowConfirmAnnuler(false);
    try {
      const response = await axios.patch(
        `${API_URL}/cfp/projets/${id}/cancel`
      );
      // Recharger les projets après le report
      fetchProjectDetails(id, false);
      setNotification({
        message: "Projet annuler avec succès",
        type: "success",
      });
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error("Erreur lors du annuler:", error);
      alert(`Erreur lors du annuler: ${error.message}`);
    }
  };

  const reporterProjet = async (id) => {
    if (!dateDebut || !dateFin) {
      alert("Veuillez renseigner les dates de début et de fin.");
      return;
    }
    setShowConfirmReporter(false);
    try {
      const response = await axios.patch(
        `${API_URL}/cfp/projets/${id}/repport`,
        {
          status: "Reporté",
          dateDebut: dateDebut,
          dateFin: dateFin,
        }
      );
      const data = response.data;
      fetchProjectDetails(id, false);
      setNotification({
        message: "Projet reporté avec succès",
        type: "success",
      });
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error("Erreur lors du report:", error);
      alert(`Erreur lors du report: ${error.message}`);
    }
  };

  const validerProjet = async (id) => {
    setShowConfirmValider(false);
    try {
      const response = await axios.patch(
        `${API_URL}/cfp/projets/${id}/confirm`
      );
      fetchProjectDetails(id, false);
      setNotification({
        message: "Projet valider avec succès",
        type: "success",
      });
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error("Erreur lors du valider:", error);
      alert(`Erreur lors du valider: ${error.message}`);
    }
  };

  const suprimerProjet = async (id) => {
    setShowConfirmSuprimer(false);
    try {
      const response = await axios.delete(
        `${API_URL}/cfp/projets/${id}/destroy`
      );
      fetchProjectDetails(id, false);
      setNotification({
        message: "Projet annulé avec succès",
        type: "success",
      });
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error("Erreur lors du annuler:", error);
      alert(`Erreur lors du annuler: ${error.message}`);
    }
  };

  const clotureProjet = async (id) => {
    setShowConfirmCloturer(false);
    try {
      const response = await axios.patch(
        `${API_URL}/cfp/projets/${id}/close`
      );
      fetchProjectDetails(id, false);
      setNotification({
        message: "Projet cloturé avec succès",
        type: "success",
      });
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error("Erreur lors du annuler:", error);
      alert(`Erreur lors du annuler: ${error.message}`);
    }
  };

  const dupliquerProjet = async (id) => {
    setShowConfirmDupliquer(false);
    try {
      const response = await axios.post(
        `${API_URL}/cfp/projets/${id}/duplicate`
      );
      fetchProjectDetails(id, false);
      setNotification({
        message: "Projet dupliqué avec succès",
        type: "success",
      });
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error("Erreur lors du annuler:", error);
      alert(`Erreur lors du annuler: ${error.message}`);
    }
  };

  const handleDownload = useCallback(
    async (documentId, filename, extension) => {
      try {
        const response = await axios.get(
          `/cfp/dossier/document/download/${documentId}`,
          {
            responseType: "blob",
          }
        );

        const fullFilename = extension ? `${filename}.${extension}` : filename;
        saveAs(new Blob([response.data]), fullFilename);
        toast.success("Téléchargement démarré");
      } catch (err) {
        toast.error("Impossible de télécharger le fichier.");
        console.error("Download error:", err);
      }
    },
    []
  );

  const getNotificationConfig = (type) => {
    const configs = {
      success: {
        bg: "bg-gradient-to-r from-green-50 to-emerald-50",
        border: "border-green-200",
        text: "text-green-800",
        icon: CheckCircle,
        iconColor: "text-green-600",
        progressBar: "bg-green-500",
      },
      error: {
        bg: "bg-gradient-to-r from-red-50 to-rose-50",
        border: "border-red-200",
        text: "text-red-800",
        icon: XCircle,
        iconColor: "text-red-600",
        progressBar: "bg-red-500",
      },
      warning: {
        bg: "bg-gradient-to-r from-yellow-50 to-amber-50",
        border: "border-yellow-200",
        text: "text-yellow-800",
        icon: AlertTriangle,
        iconColor: "text-yellow-600",
        progressBar: "bg-yellow-500",
      },
      info: {
        bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
        border: "border-blue-200",
        text: "text-blue-800",
        icon: Info,
        iconColor: "text-blue-600",
        progressBar: "bg-blue-500",
      },
    };
    return configs[type] || configs.info;
  };

  const config = getNotificationConfig(notification.type);
  const IconComponent = config.icon;

  useEffect(() => {
    fetchModuleProjet();
  }, []);

  useEffect(() => {
    fetchBonCommand(EtpName);
  }, [id, idEtp]);

  useEffect(() => {
    if (id) {
      fetchProjectDetails(id);
      fetchDossierProjet(id);
      fetchSubProjet(id);
      fetchSeanceProjet(id);
    }
  }, [id]);

  useEffect(() => {
    if (idModule) {
      fetchProgramProjet(idModule);
    }
  }, [idModule]);

  const handlePreview = async (idDocument) => {
    try {
      const response = await axios.get(
        `/bon-commandes/doc/${idDocument}/preview`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de la prévisualisation:", error);
    }
  };

  if (loading) {
    return (
      <>
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <LoadingSpinner></LoadingSpinner>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-600">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 ml-4 text-white bg-blue-500 rounded"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!projet || !projet.projet) {
    return (
      <div className="py-10 text-center">
        <p className="text-red-500">Aucune donnée de projet disponible</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      {showNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[500] animate-in slide-in-from-top-4 duration-300">
          <div
            className={`
                relative max-w-md w-full mx-auto
                ${config.bg} ${config.border} border-2
                rounded-xl shadow-lg backdrop-blur-sm
                overflow-hidden
              `}
          >
            {/* Barre de progression */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
              <div
                className={`h-full ${config.progressBar} animate-progress`}
                style={{
                  animation: "progress 4s linear forwards",
                }}
              />
            </div>

            {/* Contenu */}
            <div className="flex items-start p-4 space-x-3">
              {/* Icône */}
              <div className={`flex-shrink-0 ${config.iconColor}`}>
                <IconComponent className="w-6 h-6" />
              </div>

              {/* Message */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${config.text} leading-5`}>
                  {notification.message}
                </p>
              </div>

              {/* Bouton fermer */}
              <button
                onClick={() => setShowNotification(false)}
                className={`flex-shrink-0 ${config.text} hover:opacity-70 transition-opacity`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Animation de pulsation pour les notifications importantes */}
            {(notification.type === "error" ||
              notification.type === "warning") && (
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className={`absolute inset-0 ${config.border} border-2 rounded-xl animate-ping opacity-20`}
                  />
                </div>
              )}
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-progress {
          animation: progress 4s linear forwards;
        }

        @keyframes slide-in-from-top {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .animate-in {
          animation: slide-in-from-top 0.3s ease-out;
        }
      `}</style>
      <div className="min-h-screen w-full scroll-smooth bg-slate-50 pb-20 pt-4 sm:pt-6">
        <div className="mx-auto w-full max-w-[1600px] space-y-5 px-3 sm:px-6">
          <input type="hidden" id="idProjet" value={id} />
          <input type="hidden" value={id} id="main_project_get_id" />

          <Link
            to="/cfp/projet/en_cours"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-700"
          >
            <span aria-hidden="true">←</span>
            Retour aux projets
          </Link>

          {/* Barre d'actions */}
          <div className="sticky top-2 z-20 flex w-full flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur sm:gap-3 sm:p-4">
            <button
              onClick={() => setShowPageDossier(true)}
              className="group flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FaFolder className="w-4 h-4 group-hover:text-purple-600" />
              Dossier
            </button>

            <button
              onClick={() => setShowPageInformation(true)}
              className="group flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FaPen className="w-4 h-4 group-hover:text-purple-600" />
              Editer les informations
            </button>

            <button
              onClick={() => setShowPageSousTraitant(true)}
              className="group flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FaHandshake className="w-4 h-4 group-hover:text-purple-600" />
              Sous-traitant
            </button>

            <button
              onClick={() => downloadPDF(id)}
              className="group flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FaDownload className="w-4 h-4" />
              Télécharger PDF
            </button>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu((prev) => !prev)}
                type="button"
                className="group flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FaBolt className="w-4 h-4 text-purple-600 transition-colors duration-200 group-hover:text-purple-700" />
                <span>Action à faire</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${showMenu ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Menu déroulant */}
              {showMenu && (
                <div className="absolute left-0 z-50 w-56 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-xl top-full">
                  <div className="py-1">
                    {projet?.projet?.project_status === "En préparation" ? (
                      <button
                        onClick={() => {
                          setShowConfirmValider(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-green-600 hover:bg-green-50 transition-colors flex items-center gap-3"
                      >
                        <FaCheckCircle className="w-4 h-4" />
                        <span>Valider projet</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setShowConfirmAnnuler(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                      >
                        <FaBan className="w-4 h-4" />
                        <span>Annuler</span>
                      </button>
                    )}
                    <button
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                      onClick={() => {
                        setShowConfirmSuprimer(true);
                        setShowMenu(false);
                      }}
                    >
                      <FaTrashCan className="w-4 h-4" />
                      <span>Supprimer</span>
                    </button>

                    <button
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                      onClick={() => {
                        setShowConfirmDupliquer(true);
                        setShowMenu(false);
                      }}
                    >
                      <FaCopy className="w-4 h-4" />
                      <span>Dupliquer</span>
                    </button>

                    <div className="my-1 border-t border-gray-200"></div>

                    <div className="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Statut
                    </div>

                    <button
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                      onClick={() => {
                        setShowConfirmReporter(true);
                        setShowMenu(false);
                      }}
                    >
                      <FaCalendarDay className="w-4 h-4 text-blue-600" />
                      <span>Reporter</span>
                    </button>

                    <button
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                      onClick={() => {
                        setShowConfirmCloturer(true);
                        setShowMenu(false);
                      }}
                    >
                      <FaCircleXmark className="w-4 h-4 text-orange-600" />
                      <span>Clôturer</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {showPageDossier && (
              <>
                {/* Overlay flou semi-transparent */}
                <motion.div
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowPageDossier(false)}
                />

                {/* Panneau de formulaire */}
                <motion.div
                  className="fixed top-0 right-0 z-50 flex flex-col w-full h-full max-w-4xl overflow-hidden bg-white shadow-2xl"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full max-w-4xl overflow-y-auto bg-white shadow-2xl rounded-l-xl">
                      {/* Header */}
                      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                        <div className="flex items-center gap-3">
                          <Folder className="w-6 h-6 text-indigo-600" />
                          <h2 className="text-xl font-semibold text-gray-800">
                            Choisir un dossier
                          </h2>
                        </div>
                        <button
                          onClick={() => setShowPageDossier(false)}
                          className="p-2 transition-colors duration-200 rounded-lg hover:bg-gray-200"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      {/* Bouton Nouveau Dossier */}
                      <div className="flex justify-start p-4">
                        <button
                          onClick={() => setShowInput(true)}
                          className="flex items-center gap-2 px-3 py-2 text-purple-700 transition border border-purple-300 rounded-lg hover:bg-purple-100 hover:text-purple-900"
                        >
                          <FaFolder className="w-4 h-4" />
                          Nouveau dossier
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 px-4">
                        {/* Table Tous les dossiers */}
                        <div className="overflow-y-auto h-[37rem] border rounded-lg shadow-sm p-2">
                          <div className="relative">
                            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                            <input
                              type="text"
                              placeholder="Chercher un dossier"
                              onChange={(e) => setSearchDossier(e.target.value)}
                              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
                          <table className="w-full mt-1 text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="p-2 text-left">
                                  Nom du dossier
                                </th>
                                <th className="p-2 text-right">Document</th>
                                <th className="p-2 text-right">Projet</th>
                                <th className="p-2"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {showInput && (
                                <tr className="transition hover:bg-gray-50">
                                  <td className="flex items-center gap-2 p-2">
                                    <FaFolder className="text-yellow-500" />
                                    <input
                                      type="text"
                                      className="w-full p-1 border rounded"
                                      placeholder="Nom du nouveau dossier"
                                      value={newFolderName}
                                      onChange={(e) =>
                                        setNewFolderName(e.target.value)
                                      }
                                      autoFocus
                                    />
                                  </td>
                                  <td></td>
                                  <td></td>
                                  <td className="p-2 text-center">
                                    <button
                                      className="p-2 text-green-600 transition bg-green-100 rounded-full hover:bg-green-200"
                                      onClick={async () => {
                                        if (!newFolderName.trim()) return;
                                        try {
                                          const response = await axios.post(
                                            "/cfp/projet/folder-first",
                                            {
                                              dossier: newFolderName,
                                            }
                                          );

                                          setFolders((prev) => [
                                            ...prev,
                                            {
                                              idDossier:
                                                response.data.idDossier,
                                              nom: newFolderName,
                                            },
                                          ]);

                                          fetchDossierProjet();
                                          setNewFolderName("");
                                          setShowInput(false);
                                        } catch (error) {
                                          console.error(
                                            "Erreur création dossier:",
                                            error.response?.data || error
                                          );
                                        }
                                      }}
                                    >
                                      <FaPlus />
                                    </button>
                                  </td>
                                </tr>
                              )}

                              {Array.isArray(filteredDossier) &&
                                filteredDossier
                                  .filter((d) => d && d.nomDossier)
                                  .map((d, i) => (
                                    <tr
                                      key={i}
                                      className="transition hover:bg-gray-50"
                                    >
                                      <td className="flex items-center gap-2 p-2">
                                        <FaFolder className="text-yellow-500" />
                                        {d.nomDossier}
                                      </td>
                                      <td className="p-2 text-center">
                                        {d.nombreDocument}
                                      </td>
                                      <td className="p-2 text-center">
                                        {d.projet_count}
                                      </td>
                                      <td className="p-2 text-center">
                                        <button
                                          onClick={() =>
                                            manageDossier(
                                              "post",
                                              id,
                                              d.idDossier
                                            )
                                          }
                                          className="p-2 text-green-600 transition bg-green-100 rounded-full hover:bg-green-200"
                                        >
                                          <FaPlus />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Table Dossier du projet */}
                        <div className="overflow-y-auto h-[37rem] border rounded-lg shadow-sm">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="p-2 text-left">
                                  Nom du dossier
                                </th>
                                <th className="p-2 text-right">Document</th>
                                <th className="p-2 text-right">Projet</th>
                                <th className="p-2"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {projet?.nomDossier ? (
                                <tr className="transition hover:bg-gray-50">
                                  <td className="flex items-center gap-2 p-2">
                                    <FaFolder className="text-yellow-500" />
                                    {projet.nomDossier}
                                  </td>
                                  <td className="p-2 text-center"></td>
                                  <td className="p-2 text-center"></td>
                                  <td className="p-2 text-center"></td>
                                </tr>
                              ) : (
                                <tr>
                                  <td
                                    colSpan="4"
                                    className="p-4 italic text-center text-gray-400"
                                  >
                                    Aucun dossier
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showPageInformation && (
              <>
                {/* Overlay flou semi-transparent */}
                <motion.div
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowPageInformation(false)}
                />

                {/* Panneau de formulaire */}
                <motion.div
                  className="fixed top-0 right-0 z-50 flex flex-col w-full h-full max-w-4xl overflow-hidden bg-white shadow-2xl"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full max-w-4xl overflow-y-auto bg-white shadow-2xl">
                      <div className="flex flex-col w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                          <div className="flex items-center gap-3">
                            <Info className="w-6 h-6 text-indigo-600" />
                            <h2 className="text-xl font-semibold text-gray-800">
                              Modifier les informations générales
                            </h2>
                          </div>
                          <button
                            onClick={() => setShowPageInformation(false)}
                            className="p-2 transition-colors duration-200 rounded-lg hover:bg-gray-200"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="w-full overflow-x-auto p-4 h-[100vh] pb-3">
                          <div className="flex flex-col gap-4 h-full w-full min-w-[400px] overflow-x-scroll overflow-y-auto">
                            <div className="flex flex-col w-full gap-1">
                              <span className="inline-flex items-center w-full gap-2">
                                <label
                                  htmlFor="project_reference_edit"
                                  className="text-slate-700"
                                >
                                  Référence du projet (Numéro BC)
                                </label>
                                <p className="text-sm italic text-slate-500"></p>
                              </span>

                              {bc.length > 0 ? (
                                <div className="relative inline-flex w-full">
                                  <select
                                    id="project_reference_edit"
                                    value={reference}
                                    onChange={(e) => {
                                      const selectedBc = bc.find(
                                        (item) =>
                                          item.numero_bc === e.target.value
                                      );
                                      setReference(e.target.value);
                                      setidBc(
                                        selectedBc ? selectedBc.idBC : ""
                                      );
                                    }}
                                    className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                                  >
                                    <option value="">
                                      Sélectionnez un numéro BC
                                    </option>
                                    {bc.map((item, i) => (
                                      <option key={i} value={item.numero_bc}>
                                        {item.numero_bc}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              ) : (
                                <div className="relative inline-flex w-full">
                                  <input
                                    id="project_reference_edit"
                                    value={reference}
                                    onChange={(e) => {
                                      setReference(e.target.value);
                                    }}
                                    className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                                  />
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col w-full gap-1">
                              <span className="inline-flex items-center w-full gap-2">
                                <label
                                  htmlFor="project_title_edit"
                                  className="text-slate-700"
                                >
                                  Titre du projet
                                </label>
                                <p className="text-sm italic text-slate-500"></p>
                              </span>
                              <div className="relative inline-flex w-full">
                                <input
                                  type="text"
                                  id="project_title_edit"
                                  value={title}
                                  onChange={(e) => setTitle(e.target.value)}
                                  name="project_title_edit"
                                  placeholder=""
                                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                              </div>
                            </div>

                            <div className="flex flex-col w-full gap-1">
                              <span className="inline-flex items-center w-full gap-2">
                                <label
                                  htmlFor="project_description_edit"
                                  className="text-slate-700"
                                >
                                  Description
                                </label>
                                <p className="text-sm italic text-slate-500"></p>
                              </span>
                              <textarea
                                value={description}
                                name="project_description_edit"
                                cols="30"
                                rows="6"
                                id="project_description_edit"
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                                style={{ height: "35px" }}
                              ></textarea>
                            </div>

                            <div className="flex grid flex-col w-full grid-cols-2 gap-4">
                              <div className="grid col-span-2 grid-cols-subgrid">
                                <label className="w-full">
                                  <div className="label">
                                    <span className="label-text">
                                      Choisir la formation
                                    </span>
                                  </div>
                                  <select
                                    className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    value={idModule}
                                    onChange={(e) =>
                                      setIdModule(e.target.value)
                                    }
                                  >
                                    <option value="">
                                      Selectionner une formation
                                    </option>
                                    {tousModules?.modules
                                      ?.slice()
                                      .sort((a, b) =>
                                        a.name.localeCompare(b.name)
                                      )
                                      .map((m, i) => (
                                        <option key={i} value={m.id}>
                                          {m.name}
                                        </option>
                                      ))}
                                  </select>
                                </label>
                              </div>

                              <div className="grid grid-cols-2 col-span-2 gap-2">
                                <div className="grid col-span-1">
                                  <label className="w-full">
                                    <div className="label">
                                      <span className="label-text">Début</span>
                                    </div>
                                    <input
                                      className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                                      onChange={(e) =>
                                        setDateDebut(e.target.value)
                                      }
                                      value={projet.projet.dateDebut}
                                      type="date"
                                    />
                                  </label>
                                </div>
                                <div className="grid col-span-1">
                                  <label className="w-full">
                                    <div className="label">
                                      <span className="label-text">
                                        Echéance
                                      </span>
                                    </div>
                                    <input
                                      className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                                      onChange={(e) =>
                                        setDateFin(e.target.value)
                                      }
                                      value={projet.projet.dateFin}
                                      type="date"
                                    />
                                  </label>
                                </div>
                              </div>

                              <div className="grid col-span-2 grid-cols-subgrid">
                                <label className="w-full">
                                  <div className="label">
                                    <span className="label-text">Modalité</span>
                                  </div>
                                  <select
                                    onChange={(e) =>
                                      setIModalite(e.target.value)
                                    }
                                    value={idModalite}
                                    className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                                  >
                                    <option value="">
                                      Selectionner une modalité
                                    </option>

                                    {tousModalites?.modalites?.map((m, i) => (
                                      <option key={i} value={m.idModalite}>
                                        {m.modalite}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                              </div>
                            </div>

                            <div className="inline-flex items-end justify-end w-full gap-4 pt-3 mb-14">
                              {/* Bouton Annuler */}
                              <button
                                type="button"
                                onClick={() => setShowPageInformation(false)}
                                className="px-6 py-3 font-medium text-gray-700 transition-all duration-200 bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                              >
                                Annuler
                              </button>

                              {/* Bouton Sauvegarder */}
                              <button
                                type="button"
                                onClick={() => updateProjet(id)}
                                className="relative px-6 py-3 overflow-hidden font-semibold text-white transition-all duration-200 transform border border-purple-500 rounded-lg shadow-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-xl hover:scale-105 hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
                              >
                                <span className="relative z-10">
                                  Sauvegarder les modifications
                                </span>

                                {/* Effet de brillance au survol */}
                                <div className="absolute inset-0 transition-transform duration-700 ease-out -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent hover:translate-x-full"></div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showPageSousTraitant && (
              <>
                {/* Overlay flou semi-transparent */}
                <motion.div
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowPageSousTraitant(false)}
                />

                {/* Panneau de formulaire */}
                <motion.div
                  className="fixed top-0 right-0 z-50 flex flex-col w-full h-full max-w-4xl overflow-hidden bg-white shadow-2xl"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-indigo-600" />
                      <h2 className="text-xl font-semibold text-gray-800">
                        Ajouter un sous-traitant
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowPageSousTraitant(false)}
                      className="p-2 transition rounded-lg hover:bg-gray-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 overflow-hidden">
                    {/* Liste des sous-traitants disponibles */}
                    <div className="w-1/2 p-4 overflow-y-auto border-r border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-6 bg-red-400 rounded"></div>
                        <span className="text-lg font-medium text-gray-500">
                          Tous les sous-traitants
                        </span>
                      </div>

                      <input
                        id="main_search_form_projet"
                        placeholder="Chercher un sous-traitant"
                        className="w-full p-2 mb-4 text-gray-600 border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300"
                      />

                      <div className="space-y-3">
                        {subContract?.subcontractors?.length > 0 ? (
                          subContract.subcontractors.map((s, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 transition bg-white rounded-lg shadow hover:shadow-md"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={`${IMAGE_URL}/img/entreprises/${s?.sub_logo}`}
                                  className="object-cover w-20 h-16 rounded-xl"
                                  alt={s.sub_name}
                                />
                                <div>
                                  <div className="font-semibold uppercase">
                                    {s.sub_name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {s.sub_email}
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() =>
                                  manageSubContract(
                                    "post",
                                    id,
                                    s.idSubContractor
                                  )
                                }
                                className="flex items-center justify-center w-10 h-10 transition bg-green-100 rounded-full hover:bg-green-200"
                              >
                                <FaPlus className="text-green-600" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="italic text-center text-gray-400">
                            Aucun sous-traitant
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Liste des sous-traitants assignés */}
                    <div className="w-1/2 p-4 overflow-y-auto">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-6 bg-green-400 rounded"></div>
                        <span className="text-lg font-medium text-gray-500">
                          Sous-traitants sélectionnés
                        </span>
                      </div>

                      <div className="space-y-3">
                        {tousSub?.cfp && tousSub.cfp.length > 0 ? (
                          tousSub.cfp.map((s, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 transition bg-white rounded-lg shadow hover:shadow-md"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={`${IMAGE_URL}/img/entreprises/${s?.cfp_logo}`}
                                  className="object-cover w-20 h-16 rounded-xl"
                                  alt={s.cfp_name}
                                />
                                <div>
                                  <div className="font-semibold uppercase">
                                    {s.cfp_name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {s.cfp_email}
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() =>
                                  manageSubContract(
                                    "delete",
                                    id,
                                    s.idSubContractor
                                  )
                                }
                                className="flex items-center justify-center w-10 h-10 transition bg-red-100 rounded-full hover:bg-red-200"
                              >
                                <FaMinus className="text-red-600" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="italic text-center text-gray-400">
                            Aucun sous-traitant
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
                    <button
                      onClick={() => setShowPageSousTraitant(false)}
                      className="border border-gray-300 btn hover:bg-gray-100"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => setShowPageSousTraitant(false)}
                      className="text-white bg-purple-500 btn hover:bg-purple-600"
                    >
                      Fermer
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {showAddOrder && (
              <>
                {/* Overlay avec backdrop blur */}
                <motion.div
                  className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowAddOrder(false)}
                />

                {/* Panneau latéral */}
                <motion.div
                  className="fixed top-0 right-0 z-50 flex flex-col w-full h-full max-w-md bg-white shadow-2xl"
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                  }}
                >
                  {/* Header amélioré */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
                    <div className="flex-1">
                      <h1 className="text-xl font-bold text-gray-900">
                        Assigner un bon de commande
                      </h1>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className={`w-2 h-2 rounded-full ${purchaseOrder ? "bg-green-500" : "bg-gray-300"
                            }`}
                        />
                        <p className="text-sm text-gray-600">
                          {purchaseOrder
                            ? `BC #${purchaseOrder.numero} assigné`
                            : "Aucun BC sélectionné"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddOrder(false)}
                      className="p-2 transition-all duration-200 rounded-lg hover:bg-gray-100 active:scale-95"
                      aria-label="Fermer"
                    >
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>

                  {/* Contenu principal avec défilement */}
                  <div className="flex flex-col flex-1 overflow-hidden">
                    {/* Barre de recherche */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                      <div className="relative">
                        <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                        <input
                          type="text"
                          placeholder="Rechercher un BC par numéro..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full py-3 pl-10 pr-4 transition-all duration-200 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Liste des BC avec statut */}
                    <div className="flex-1 overflow-hidden">
                      <div className="flex flex-col h-full">
                        {/* En-tête de liste */}
                        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
                          <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">
                            Bons de commande disponibles
                          </h3>
                          <span className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                            {filteredOrders.length} résultat
                            {filteredOrders.length !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {/* Liste scrollable */}
                        <div className="flex-1 overflow-y-auto">
                          <div className="p-4 space-y-3">
                            {filteredOrders.map((order) => {
                              const isAssigned =
                                purchaseOrder?.idBc === order.idBC;
                              return (
                                <motion.div
                                  key={order.idBC}
                                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${isAssigned
                                    ? "border-blue-500 bg-blue-50 shadow-sm"
                                    : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                                    }`}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  onClick={() => handleAssignOrder(order.idBC)}
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    {/* Contenu principal */}
                                    <div className="flex items-start flex-1 min-w-0 gap-3">
                                      {/* Indicateur visuel */}
                                      <div
                                        className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${isAssigned
                                          ? "bg-blue-500"
                                          : "bg-gray-300"
                                          }`}
                                      />

                                      {/* Informations BC */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-semibold text-gray-900 truncate">
                                            BC #{order.numero_bc}
                                          </span>
                                          {isAssigned && (
                                            <span className="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                                              Assigné
                                            </span>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                          <span>
                                            {new Date(
                                              order.date_bc
                                            ).toLocaleDateString("fr-FR", {
                                              day: "numeric",
                                              month: "short",
                                              year: "numeric",
                                            })}
                                          </span>

                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handlePreview(
                                                order.id_document_bc
                                              );
                                            }}
                                            className="flex items-center gap-1 px-2 py-1 text-xs transition-colors duration-200 rounded-lg hover:text-blue-600 hover:bg-blue-50"
                                            title="Prévisualiser le document"
                                          >
                                            <Eye className="w-3.5 h-3.5" />
                                            Voir
                                          </button>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Montant et statut */}
                                    <div className="flex-shrink-0 text-right">
                                      <div className="text-lg font-bold text-gray-900">
                                        {parseFloat(
                                          order.montant_bc
                                        ).toLocaleString("fr-FR")}{" "}
                                        Ar
                                      </div>
                                      <div
                                        className={`text-xs font-medium ${isAssigned
                                          ? "text-blue-600"
                                          : "text-gray-400"
                                          }`}
                                      >
                                        {isAssigned
                                          ? "✓ Assigné"
                                          : "Cliquer pour assigner"}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}

                            {/* État vide */}
                            {filteredOrders.length === 0 && (
                              <motion.div
                                className="py-12 text-center"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="font-medium text-gray-500">
                                  {searchTerm
                                    ? "Aucun bon de commande trouvé"
                                    : "Aucun bon de commande disponible"}
                                </p>
                                {searchTerm && (
                                  <p className="mt-1 text-sm text-gray-400">
                                    Vérifiez l'orthographe ou essayez d'autres
                                    termes
                                  </p>
                                )}
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pied de page avec actions */}
                    <div className="border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm">
                      <div className="p-4 space-y-4">
                        {/* BC actuel assigné */}
                        {purchaseOrder && (
                          <motion.div
                            className="p-4 border border-green-200 bg-green-50 rounded-xl"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="mb-1 text-xs font-medium tracking-wide text-green-600 uppercase">
                                  BC actuellement assigné
                                </div>
                                <div className="font-semibold text-green-900">
                                  BC #{purchaseOrder.numero}
                                </div>
                              </div>
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                          </motion.div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setSelectedOrder(null);
                              setShowAddOrder(false);
                            }}
                            className="flex-1 px-6 py-3 font-medium text-gray-700 transition-all duration-200 border border-gray-300 rounded-xl hover:bg-gray-50 active:scale-95"
                          >
                            Fermer
                          </button>

                          {/* {purchaseOrder && (
                            <button
                              onClick={() => handleAssignOrder(null)}
                              className="flex-1 px-6 py-3 font-medium text-red-700 transition-all duration-200 border border-red-300 rounded-xl hover:bg-red-50 active:scale-95"
                            >
                              Retirer
                            </button>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <ConfirmationModal
            title="Annuler!"
            message="Voulez-vous vraiment annuler ce projet ?"
            onConfirm={() => {
              setShowConfirmRestoration(false);
            }}
            onCancel={() => setShowConfirmRestoration(false)}
            show={showConfirmRestoration}
          />

          {/* En-tête du projet */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-6 p-4 sm:p-6 xl:flex-row">
              {/* Section principale - 70% */}
              <div className="w-full xl:w-[70%] xl:pr-6">
                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* Logo entreprise */}
                  <div className="flex-shrink-0">
                    <figure className="w-24 h-24">
                      {projet?.projet?.etp_name ? (
                        <div className="flex items-center justify-center w-full h-full border border-gray-200 shadow-md rounded-xl bg-gradient-to-r from-gray-50 to-gray-100">
                          <span className="px-3 text-lg font-semibold text-center text-gray-700 truncate">
                            {projet.projet.etp_name}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                          <FaBuilding className="text-3xl text-purple-500" />
                        </div>
                      )}
                    </figure>
                  </div>

                  {/* Informations du projet */}
                  <div className="flex flex-col justify-start flex-1 space-y-4">
                    {/* Titre et références */}
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        {projet?.projet?.module_name || "Module non spécifié"}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Réf : BC :</span>
                          {projet?.projet?.numero_bc ? (
                            <Link
                              to={`/cfp/bon-commande/view/${projet?.projet?.idBc ?? ""
                                }`}
                              className="px-2 py-1 bg-gray-100 rounded-md"
                            >
                              {projet?.projet?.numero_bc || "Non spécifiée"}
                            </Link>
                          ) : (
                            <button
                              className="flex items-center gap-1 px-2 text-gray-700 transition-all duration-300 bg-transparent border-2 border-gray-600 rounded-lg shadow-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md"
                              onClick={() => setShowAddOrder(true)}
                            >
                              <Plus className="w-4 h-4" />
                              Ajouter
                            </button>
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Dossier :</span>
                          <span className="px-2 py-1 bg-gray-100 rounded-md">
                            {projet?.dossier?.nomDossier || "Non spécifié"}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Notation */}
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-full border border-amber-200/50 shadow-sm">
                        <span className="text-sm font-bold text-transparent bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text">
                          {note.toFixed(1).replace(".", ",")}
                        </span>
                        <span className="text-xs text-amber-400">★</span>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium">{avis}</span>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:gap-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-gray-700">
                          Début :
                        </span>
                        <span className="px-3 py-1 text-gray-800 capitalize bg-white rounded-md shadow-sm">
                          {projet?.projet?.dateDebut
                            ? new Date(
                              projet.projet.dateDebut
                            ).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                            : "Non définie"}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-gray-700">Fin :</span>
                        <span className="px-3 py-1 text-gray-800 capitalize bg-white rounded-md shadow-sm">
                          {projet?.projet?.dateFin
                            ? new Date(
                              projet.projet.dateFin
                            ).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                            : "Non définie"}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-4 py-2 text-sm font-medium text-blue-700 rounded-full bg-blue-50">
                        {projet?.projet?.project_type || "Type non spécifié"}
                      </span>
                      <span className="px-4 py-2 text-sm font-medium rounded-full bg-cyan-50 text-cyan-700">
                        {projet?.projet?.modalite || "Modalité non spécifiée"}
                      </span>
                      <span className="px-4 py-2 text-sm text-gray-600 rounded-full bg-gray-50">
                        Non renseigné
                      </span>
                      <span
                        className={`px-4 py-2  rounded-full text-sm ${getStatusColor(
                          projet?.projet?.project_status
                        )}`}
                        title="Le projet de formation est en cours de préparation, avec des détails tels que le programme, les supports de formation, et la logistique en cours de finalisation."
                      >
                        {projet?.projet?.project_status || "Statut inconnu"}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="mt-4">
                      <p className="leading-relaxed text-gray-700 line-clamp-3">
                        {projet?.projet?.project_description ||
                          "Aucune description disponible"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section actions - 30% */}
              <div className="w-full xl:w-[30%] xl:border-l xl:border-gray-200 xl:pl-6">
                <div className="space-y-4">
                  {/* Modals (inchangées) */}
                  <ConfirmationModal
                    title="confirmer!"
                    message="Voulez-vous vraiment valider ce projet ?"
                    onConfirm={() => validerProjet(id)}
                    onCancel={() => setShowConfirmValider(false)}
                    show={showConfirmValider}
                  />

                  <ConfirmationModal
                    title="Confirmer !"
                    message="Voulez-vous vraiment supprimer cette séance ?"
                    show={showConfirmDeleteSeance}
                    onCancel={() => setShowConfirmDeleteSeance(false)}
                    onConfirm={handleDeleteSeance}
                  />

                  <ConfirmationModal
                    title="Annuler!"
                    message="Voulez-vous vraiment annuler ce projet ?"
                    onConfirm={() => annulerProjet(id)}
                    onCancel={() => setShowConfirmAnnuler(false)}
                    show={showConfirmAnnuler}
                  />

                  <ConfirmationModal
                    title="Confirmer la suppression"
                    message="Voulez-vous vraiment supprimer ce projet ? Cette action est irréversible."
                    onConfirm={() => suprimerProjet(id)}
                    onCancel={() => setShowConfirmSuprimer(false)}
                    show={showConfirmSuprimer}
                  />

                  <ConfirmationModal
                    title="Confirmer la duplication"
                    message="Voulez-vous vraiment dupliquer ce projet ? Cette action est irréversible."
                    onConfirm={() => dupliquerProjet(id)}
                    onCancel={() => setShowConfirmDupliquer(false)}
                    show={showConfirmDupliquer}
                  />

                  <ConfirmationModal
                    title="Reporter!"
                    message="Voulez-vous vraiment reporter ce projet ?"
                    show={showConfirmReporter}
                    onConfirm={() => reporterProjet(id)}
                    onCancel={() => setShowConfirmReporter(false)}
                  >
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="dateDebutProjetDetail_763"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Date de début
                          </label>
                          <input
                            type="date"
                            id="dateDebutProjetDetail_763"
                            name="dateDebut"
                            value={dateDebut}
                            onChange={(e) => setDateDebut(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="dateFinProjetDetail_763"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Date de fin
                          </label>
                          <input
                            type="date"
                            id="dateFinProjetDetail_763"
                            name="dateFin"
                            value={dateFin}
                            onChange={(e) => setDateFin(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  </ConfirmationModal>

                  <ConfirmationModal
                    title="Confirmer la cloture"
                    message="Voulez-vous vraiment clôturer ce projet ? Cette action est irréversible."
                    onConfirm={() => clotureProjet(id)}
                    onCancel={() => setShowConfirmCloturer(false)}
                    show={showConfirmCloturer}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Onglets */}
          <div className="w-full">
            {/* Onglet 1 - Vue d'ensemble */}
            <div
              role="tablist"
              aria-label="Sections du projet"
              className="sticky top-[4.5rem] z-10 mb-4 flex w-fit max-w-full gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm"
            >
              <button
                role="tab"
                aria-selected={activeTab === "vue-ensemble"}
                onClick={() => setActiveTab("vue-ensemble")}
                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${activeTab === "vue-ensemble"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
                  }`}
              >
                Vue d'ensemble
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "detail-formation"}
                onClick={() => setActiveTab("detail-formation")}
                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${activeTab === "detail-formation"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
                  }`}
              >
                Détail de la formation
              </button>
            </div>

            <div role="tabpanel" className="tab-content min-w-0">
              {activeTab === "vue-ensemble" && (
                <div className="flex w-full flex-col gap-4 xl:flex-row">
                  {/* Colonne gauche */}
                  <div className="w-full xl:w-[60%]">
                    {/* Apprenants */}
                    <div className="w-full max-w-6xl p-4 mx-auto">
                      {/* Header Card */}
                      <LearnerList
                        id={id}
                        projectType={projectType}
                        learnersAdded={learnersAdded}
                        setLearnersAdded={setLearnersAdded}
                        entreprise={etp}
                      />
                    </div>
                    {/* Documents */}
                    <div className="w-full max-w-6xl p-4 mx-auto">
                      <div className="overflow-hidden bg-white border border-gray-100 shadow-lg rounded-2xl">
                        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                          <span className="collapsed w-full inline-flex !rounded-xl items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h2 className="text-xl font-semibold text-gray-800">
                                  Documents
                                </h2>
                                <span className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                                  Actifs
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                Gérez vos documents de formation
                              </p>
                            </div>
                            <div className="flex justify-end w-full gap-4 pr-4 mt-2">
                              <button
                                onClick={() => setShowPageDocument(true)}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all duration-300 bg-transparent border-2 border-gray-600 shadow-sm rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md"
                              >
                                <FaPlus></FaPlus>
                                Ajouter
                              </button>
                              <AnimatePresence>
                                {showPageDocument && (
                                  <>
                                    {/* Overlay noir semi-transparent */}
                                    <motion.div
                                      className="fixed inset-0 bg-gray-800/60"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                    />

                                    {/* Panneau de formulaire */}
                                    <motion.div
                                      initial={{ opacity: 0, x: 300 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: 300 }}
                                      transition={{ duration: 0 }}
                                      className=""
                                    >
                                      <AjoutDocumentModalEtp
                                        isOpen={setShowPageDocument}
                                        onClose={() =>
                                          setShowPageDocument(false)
                                        }
                                        dossierName={
                                          projet?.dossier?.nomDossier
                                        }
                                        idDossier={projet?.dossier?.idDossier}
                                        fetchDossierProjet={() =>
                                          fetchDossierProjet(id)
                                        }
                                      />
                                    </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                              <a className="cursor-pointer" href="/cfp/dossier">
                                <input
                                  type="hidden"
                                  name="dossierSearch"
                                  value="17"
                                />
                                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md">
                                  <FaArrowRight></FaArrowRight>
                                  Aller dans le dossier
                                </button>
                              </a>
                            </div>
                          </span>
                        </div>
                        <div className="">
                          <div className="p-4 overflow-x-auto">
                            <div className="cfp_doc">
                              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                                Nom de dossier :{" "}
                                {projet?.dossier?.nomDossier || "Non spécifié"}
                              </h2>

                              {/* HEADER */}
                              <div className="grid-cols-8 px-4 py-2 text-sm font-bold bg-gray-100 border-b md:grid text-slate-600">
                                <div className="col-span-2">Titre</div>
                                <div>Section</div>
                                <div>Type</div>
                                <div>Date</div>
                                <div className="text-right">Taille</div>
                                <div className="text-right"></div>
                                <div className="text-right"></div>
                              </div>

                              {/* DATA ROWS */}
                              <div className="space-y-2">
                                {document?.documents?.length > 0 ? (
                                  document.documents.map((d, i) => (
                                    <div
                                      key={i}
                                      className="grid items-center grid-cols-8 px-6 py-4 transition-all duration-200 bg-white border border-gray-200 shadow-sm group rounded-xl hover:shadow-md hover:border-purple-200 hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-transparent"
                                    >
                                      {/* Nom du dossier */}
                                      <div className="col-span-2 text-left">
                                        <span className="font-semibold text-gray-800 transition-colors group-hover:text-purple-700">
                                          {d.titre}
                                        </span>
                                      </div>

                                      {/* Titre */}
                                      <div className="text-left">
                                        <span className="text-gray-700 group-hover:text-gray-800">
                                          {d.section_document}
                                        </span>
                                      </div>

                                      {/* Type de document */}
                                      <div className="text-left">
                                        <span className="inline-flex px-3 py-1 text-xs font-medium text-gray-700 transition-colors bg-gray-100 rounded-full group-hover:bg-purple-100 group-hover:text-purple-700">
                                          {d.type_document}
                                        </span>
                                      </div>

                                      {/* Date de mise à jour */}
                                      <div className="text-sm text-left text-gray-600">
                                        {new Date(
                                          d.updated_at
                                        ).toLocaleDateString("fr-FR")}
                                      </div>

                                      {/* Taille */}
                                      <div className="text-right">
                                        <span className="font-medium text-gray-600">
                                          {d.taille} Mo
                                        </span>
                                      </div>

                                      {/* Actions */}
                                      <div className="flex justify-end gap-2">
                                        <button
                                          onClick={() =>
                                            handleDownload(
                                              d.idDocument,
                                              d.filename,
                                              d.extension
                                            )
                                          }
                                          className="p-2 text-gray-400 transition-all duration-200 transform rounded-lg hover:text-white hover:bg-purple-600 hover:shadow-md hover:scale-110"
                                        >
                                          <FaDownload className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="flex items-center justify-center px-6 py-12 bg-white border-2 border-gray-300 border-dashed rounded-xl">
                                    <div className="text-center">
                                      <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                                        <svg
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          className="w-full h-full"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                          />
                                        </svg>
                                      </div>
                                      <p className="mb-2 font-medium text-gray-500">
                                        Aucun document disponible
                                      </p>
                                      <p className="text-sm text-gray-400">
                                        Les documents ajoutés apparaîtront ici
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Agenda */}
                    <Agenda
                      toggleAfficheAgenda={toggleAfficheAgenda}
                      AfficheAgenda={AfficheAgenda}
                      setShowPageAgenda={setShowPageAgenda}
                      session={session}
                      allSeances={allSeances}
                      setCurrentSeanceId={setCurrentSeanceId}
                      setSelectedSessionType={setSelectedSessionType}
                      setShowReportInput={setShowReportInput}
                      setReportDate={setReportDate}
                      setReportStartTime={setReportStartTime}
                      setIsUndetermined={setIsUndetermined}
                      setReportEndTime={setReportEndTime}
                      setShowModificationTypeSession={
                        setShowModificationTypeSession
                      }
                      setSeanceToDelete={setSeanceToDelete}
                      setShowConfirmDeleteSeance={setShowConfirmDeleteSeance}
                      showPageAgenda={showPageAgenda}
                      id={id}
                      selectedSessionType={selectedSessionType}
                      showReportInput={showReportInput}
                      reportDate={reportDate}
                      isUndetermined={isUndetermined}
                      reportStartTime={reportStartTime}
                      reportEndTime={reportEndTime}
                      handleConfirmTypeChange={handleConfirmTypeChange}
                      fetchSeanceProjet={fetchSeanceProjet}
                      showModificationTypeSession={showModificationTypeSession}
                    />

                    {/* Aspects Financiers */}
                    <FinancialAspect
                      id={id}
                      setSelectedPaiement={setSelectedPaiement}
                      idSubContractor={idSubContractor}
                      selectedPaiement={selectedPaiement}
                      taxe={taxe}
                      setTaxe={setTaxe}
                      totalHt={totalHt}
                      setTotalHt={setTotalHt}
                      totalTtc={totalTtc}
                      setTotalTtc={setTotalTtc}
                      payment={payment}
                      setPayment={setPayment}
                    />

                    {/* importation des medias */}
                    <MediaUploadForm projet={projet} isCfp="true" />
                  </div>

                  {/* Colonne droite */}
                  <div className="w-full xl:w-[40%]">
                    {/* Lieu et salle */}
                    <PlaceSection
                      id={id}
                      roomName={roomName}
                      neighborhood={neighborhood}
                      city={city}
                      AfficheLieu={AfficheLieu}
                      toggleAfficheLieu={toggleAfficheLieu}
                      setSearchSalle={setSearchSalle}
                      setRoomName={setRoomName}
                      setNeighborhood={setNeighborhood}
                      setCity={setCity}
                    />

                    {/* materiel */}
                    <MaterialSection
                      projectMaterials={projectMaterials}
                      id={id}
                      setProjectMaterials={setProjectMaterials}
                    />

                    {/* Entreprise(s) */}
                    {projectType != 4 && (
                      <EntrepriseSection
                        etp={etp}
                        projectId={id}
                        projectType={projectType}
                        setEtp={setEtp}
                      />
                    )}

                    {/* Formateurs */}
                    <TrainerSection formateur={formateur} id={id} />
                  </div>
                </div>
              )}

              {activeTab === "detail-formation" && (
                <div className="flex gap-6">
                  {/* Colonne gauche - Programme de formation */}
                  <div className="w-full lg:w-2/3">
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
                      {/* Header de section */}
                      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg shadow-md bg-gradient-to-r from-gray-50 to-gray-100">
                            <FaChalkboard className="text-lg text-gray-600" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">
                              Programme de formation
                            </h2>
                            <p className="mt-1 text-sm text-gray-700">
                              Contenu détaillé du cours
                            </p>
                          </div>
                          <div className="px-3 py-1 ml-auto text-sm font-medium text-gray-800 bg-gray-200 rounded-full">
                            {tousProgram?.programmes?.length || 0} modules
                          </div>
                        </div>
                      </div>

                      {/* Contenu du programme */}
                      <div className="p-6">
                        {tousProgram?.programmes?.length > 0 ? (
                          <div className="space-y-6">
                            {tousProgram.programmes.map((p, i) => (
                              <div
                                key={i}
                                className="p-6 transition-all duration-300 border border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md"
                              >
                                {/* Numéro et titre du module */}
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full shadow-sm bg-gradient-to-r from-gray-50 to-gray-300">
                                    <span className="text-sm font-bold text-gray-600">
                                      {i + 1}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="mb-2 text-lg font-semibold text-gray-800">
                                      {p.program_title}
                                    </h3>
                                    {/* Description avec HTML */}
                                    <div
                                      className="leading-relaxed prose-sm prose text-gray-600 max-w-none"
                                      dangerouslySetInnerHTML={{
                                        __html: p.program_description,
                                      }}
                                    />
                                  </div>
                                </div>

                                {/* Ligne de progression */}
                                {i < tousProgram.programmes.length - 1 && (
                                  <div className="flex justify-center mt-6">
                                    <div className="w-px h-8 bg-gradient-to-b from-blue-300 to-transparent"></div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          /* État vide */
                          <div className="py-16 text-center">
                            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full shadow-inner bg-gradient-to-br from-gray-100 to-gray-200">
                              <FaChalkboard className="text-2xl text-gray-400" />
                            </div>
                            <h3 className="mb-2 text-lg font-medium text-gray-600">
                              Aucun programme disponible
                            </h3>
                            <p className="max-w-sm mx-auto text-gray-500">
                              Le programme de ce cours n'a pas encore été
                              défini.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Colonne droite */}
                  <div className="w-full space-y-6 lg:w-1/3">
                    {/* Objectifs de la formation */}
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
                      {/* Header */}
                      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg shadow-sm bg-gradient-to-r from-gray-50 to-gray-100 to-emerald-600">
                            <FaBullseye className="text-sm text-gray-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Objectifs
                            </h3>
                            <p className="text-xs text-gray-700">
                              Compétences visées
                            </p>
                          </div>
                          <div className="px-2 py-1 ml-auto text-xs font-medium text-gray-800 bg-gray-200 rounded-full">
                            {Array.isArray(filteredObjectifs)
                              ? filteredObjectifs.length
                              : 0}
                          </div>
                        </div>
                      </div>

                      {/* Contenu des objectifs */}
                      <div className="p-4">
                        {Array.isArray(filteredObjectifs) &&
                          filteredObjectifs.length > 0 ? (
                          <ul className="space-y-3">
                            {filteredObjectifs.map((objectif, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-2 h-2 mt-2 bg-gray-800 rounded-full"></div>
                                <span className="text-sm leading-relaxed text-gray-700">
                                  {objectif.objectif}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          /* État vide */
                          <div className="py-8 text-center">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full">
                              <FaBullseye className="text-lg text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500">
                              Aucun objectif défini
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Matériels utiles */}
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
                      {/* Header */}
                      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
                            <FaBoxOpen className="text-sm text-gray-800" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Matériels
                            </h3>
                            <p className="text-xs text-gray-700">
                              Équipements requis
                            </p>
                          </div>
                          <div className="px-2 py-1 ml-auto text-xs font-medium text-gray-800 bg-gray-200 rounded-full">
                            {Array.isArray(filteredMateriels)
                              ? filteredMateriels.length
                              : 0}
                          </div>
                        </div>
                      </div>

                      {/* Contenu des matériels */}
                      <div className="p-4">
                        {Array.isArray(filteredMateriels) &&
                          filteredMateriels.length > 0 ? (
                          <ul className="space-y-3">
                            {filteredMateriels.map((materiel, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-3 p-2 border border-gray-100 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 to-white"
                              >
                                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                                  <FaBoxOpen className="text-xs text-gray-700" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                  {materiel.prestation_name}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          /* État vide */
                          <div className="py-8 text-center">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full">
                              <FaBoxOpen className="text-lg text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500">
                              Aucun matériel requis
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card d'information supplémentaire */}
                    <div className="p-4 border border-purple-200 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 rounded-lg">
                          <svg
                            className="w-4 h-4 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-gray-900">
                          Information
                        </h4>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-800">
                        Cette formation est conçue pour répondre aux besoins
                        spécifiques de votre organisation. N'hésitez pas à nous
                        contacter pour toute adaptation du contenu.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetail;
