import { useState, useEffect, useCallback } from 'react';
import {
  FaBuilding,
  FaUsers,
  FaChevronUp,
  FaChevronDown,
  FaAward,
  FaStar,
  FaPlus,
  FaXmark,
} from "react-icons/fa6";
import { Link, useParams } from 'react-router-dom';
import axios from '../../../config/axios';
import LoadingSpinner from '../../../components/ui/loading-spinner';
import { AlertTriangle, ArrowRight, Award, BarChart3, BookOpen, Calendar, CalendarDays, CheckCircle, Clock, Download, FileText, Laptop, Monitor, Package, Plus, Search, ShoppingCart, Target, UserCheck, Users, Wrench, X } from 'lucide-react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import MediaUploadForm from './MediaUploadForm';
import { API_URL, IMAGE_URL } from "../../../config/env";


const ProjetDetailForm = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [projet, setProjets] = useState([]);
  const [idEtp, setIdEtp] = useState([]);
  const [idModule, setIdModule] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showLearnerManager, setShowLearnerManager] = useState(false);
  const [availableLearners, setAvailableLearners] = useState([]);
  const [assignedLearners, setAssignedLearners] = useState([]);
  const [learnerCompanies, setLearnerCompanies] = useState([]);
  const [selectedLearnerCompany, setSelectedLearnerCompany] = useState("");
  const [learnerSearch, setLearnerSearch] = useState("");
  const [learnerManagerLoading, setLearnerManagerLoading] = useState(false);
  const [learnerActionError, setLearnerActionError] = useState("");
  const [showTrainerManager, setShowTrainerManager] = useState(false);
  const [availableTrainers, setAvailableTrainers] = useState([]);
  const [assignedTrainers, setAssignedTrainers] = useState([]);
  const [trainerSearch, setTrainerSearch] = useState("");
  const [trainerManagerLoading, setTrainerManagerLoading] = useState(false);
  const [trainerActionError, setTrainerActionError] = useState("");


  console.log("IdProjet", projet.projet?.idProjet);


  const note = parseFloat(projet?.noteGeneral) || 0;
  const avis = projet?.countNotationProjet || 0;

  const fetchProjectDetails = async (id, showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      // 1. Récupération du projet
      const response = await axios.get(`${API_URL}/projetsForm/${id}/detailForm`);

      const data = await response.data;
      setProjets(data);
      setAssignedLearners(data.apprs || []);


      const idEtp = data.projet.idEtp;
      setIdEtp(idEtp);

      const idModule = data.projet.idModule;
      setIdModule(idModule);

      console.log(idModule);
    } catch (error) {
      console.error("Détails de l'erreur :", error);
      setError("Impossible de charger le projet. Veuillez réessayer.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const fetchAssignedLearners = useCallback(async (projectId = id) => {
    const { data } = await axios.get(
      `/cfp/projet/apprenants/added/${projectId}`
    );
    const learners = data.apprs || [];
    setAssignedLearners(learners);
    return learners;
  }, [id]);

  const fetchLearnerManagerData = useCallback(async () => {
    setLearnerManagerLoading(true);
    setLearnerActionError("");
    try {
      const [companiesResponse, learnersResponse] = await Promise.all([
        axios.get(`/cfp/projet/etpInter/getEtpAdded/${id}`),
        axios.get(`/cfp/projet/apprenants/added/${id}`),
      ]);
      const companies = companiesResponse.data.etps || [];
      setLearnerCompanies(companies);
      setAssignedLearners(learnersResponse.data.apprs || []);
      setSelectedLearnerCompany((current) =>
        companies.some((company) => String(company.idEtp) === current)
          ? current
          : String(companies[0]?.idEtp || "")
      );
    } catch (error) {
      console.error("Erreur lors du chargement des apprenants :", error);
      setLearnerActionError(
        "Impossible de charger les apprenants disponibles pour ce projet."
      );
    } finally {
      setLearnerManagerLoading(false);
    }
  }, [id]);

  const fetchAvailableLearners = useCallback(async (companyId) => {
    if (!companyId) {
      setAvailableLearners([]);
      return;
    }

    setLearnerManagerLoading(true);
    setLearnerActionError("");
    try {
      const { data } = await axios.get(
        `/cfp/projet/apprenants/${companyId}`
      );
      setAvailableLearners(data.apprs || []);
    } catch (error) {
      console.error("Erreur lors du chargement des apprenants disponibles :", error);
      setLearnerActionError(
        "Impossible de charger les apprenants de cette entreprise."
      );
    } finally {
      setLearnerManagerLoading(false);
    }
  }, []);

  const fetchAssignedTrainers = useCallback(async (projectId = id) => {
    const { data } = await axios.get(`/cfp/projets/${projectId}/getFormAdded`);
    const trainers = data.forms || [];
    setAssignedTrainers(trainers);
    return trainers;
  }, [id]);

  const fetchTrainerManagerData = useCallback(async () => {
    setTrainerManagerLoading(true);
    setTrainerActionError("");
    try {
      const [availableResponse, assignedResponse] = await Promise.all([
        axios.get("/cfp/projets/formateur/all"),
        axios.get(`/cfp/projets/${id}/getFormAdded`),
      ]);
      setAvailableTrainers(availableResponse.data.forms || []);
      setAssignedTrainers(assignedResponse.data.forms || []);
    } catch (error) {
      console.error("Erreur lors du chargement des formateurs :", error);
      setTrainerActionError(
        "Impossible de charger les formateurs disponibles pour ce projet."
      );
    } finally {
      setTrainerManagerLoading(false);
    }
  }, [id]);

  const manageLearner = async (method, employeeId) => {
    setLearnerManagerLoading(true);
    setLearnerActionError("");
    try {
      await axios({
        method,
        url: `/cfp/projet/apprenants/${id}/${employeeId}`,
      });
      await fetchProjectDetails(id, false);
      await fetchAssignedLearners();
      if (selectedLearnerCompany) {
        await fetchAvailableLearners(selectedLearnerCompany);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des apprenants :", error);
      setLearnerActionError(
        "La mise à jour des apprenants a échoué. Veuillez réessayer."
      );
    } finally {
      setLearnerManagerLoading(false);
    }
  };

  const manageTrainer = async (method, trainerId) => {
    setTrainerManagerLoading(true);
    setTrainerActionError("");
    try {
      await axios({
        method,
        url: `/cfp/projets/${id}/${trainerId}/form/assign`,
      });
      await fetchAssignedTrainers();
    } catch (error) {
      console.error("Erreur lors de la mise à jour des formateurs :", error);
      setTrainerActionError(
        "La mise à jour des formateurs a échoué. Veuillez réessayer."
      );
    } finally {
      setTrainerManagerLoading(false);
    }
  };

  const filteredMateriels = projet?.materiels?.filter(m => m.idModule === idModule);

  console.log(filteredMateriels);

  const filteredObjectifs = projet?.objectifs?.filter(o => o.idModule === idModule);

  console.log(filteredObjectifs);


  const setting = JSON.parse(sessionStorage.getItem("setting"));

  const getStatusColor = (status) => {
    const colors = {
      "En préparation": "bg-amber-100 text-amber-800",
      "En cours": "bg-blue-100 text-blue-800",
      "Terminé": "bg-emerald-100 text-emerald-800",
      "Planifié": "bg-violet-100 text-violet-800",
      "Cloturé": "bg-slate-200 text-slate-700",
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  const getInitials = (firstname, lastname) => {
    return `${firstname?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase();
  };

  const getPresenceColor = (presence) => {
    if (presence >= 90) return 'text-green-600 bg-green-100';
    if (presence >= 75) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getNotationColor = (notation) => {
    if (notation >= 16) return 'text-green-600';
    if (notation >= 12) return 'text-orange-600';
    return 'text-red-600';
  };


  const getTypeIcon = (type) => {
    switch (type) {
      case 'hardware':
        return <Laptop className="w-4 h-4" />;
      case 'software':
        return <Monitor className="w-4 h-4" />;
      case 'infrastructure':
        return <Wrench className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getPrioriteColor = (priorite) => {
    switch (priorite) {
      case 'essentiel':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'recommande':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'optionnel':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPrioriteLabel = (priorite) => {
    switch (priorite) {
      case 'essentiel':
        return 'Essentiel';
      case 'recommande':
        return 'Recommandé';
      case 'optionnel':
        return 'Optionnel';
      default:
        return 'Standard';
    }
  };

  const formaterDateComplete = (dateStr) => {
    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

    const date = new Date(dateStr);
    const jourSemaine = jours[date.getDay()];
    const jour = date.getDate().toString().padStart(2, '0');
    const moisNom = mois[date.getMonth()];
    const annee = date.getFullYear();

    return `${jourSemaine} ${jour} ${moisNom} ${annee}`;
  };

  useEffect(() => {
    fetchProjectDetails(id);
    fetchAssignedLearners(id).catch((error) => {
      console.error("Erreur lors du chargement des apprenants assignés :", error);
    });
    fetchAssignedTrainers(id).catch((error) => {
      console.error("Erreur lors du chargement des formateurs assignés :", error);
    });
  }, [id, fetchAssignedLearners, fetchAssignedTrainers]);

  useEffect(() => {
    if (showLearnerManager) {
      fetchLearnerManagerData();
    }
  }, [showLearnerManager, fetchLearnerManagerData]);

  useEffect(() => {
    if (showLearnerManager && selectedLearnerCompany) {
      fetchAvailableLearners(selectedLearnerCompany);
    }
  }, [selectedLearnerCompany, showLearnerManager, fetchAvailableLearners]);

  useEffect(() => {
    if (showTrainerManager) {
      fetchTrainerManagerData();
    }
  }, [showTrainerManager, fetchTrainerManagerData]);

  const filteredAvailableLearners = availableLearners.filter((learner) => {
    const search = learnerSearch.toLowerCase();
    const name = learner.emp_name || learner.name || "";
    const firstName = learner.emp_firstname || learner.firstName || "";
    const isAssigned = assignedLearners.some(
      (assigned) =>
        String(assigned.idEmploye ?? assigned.id) ===
        String(learner.idEmploye ?? learner.id)
    );
    return (
      !isAssigned &&
      `${name} ${firstName}`.toLowerCase().includes(search)
    );
  });

  const filteredAvailableTrainers = availableTrainers.filter((trainer) => {
    const search = trainerSearch.toLowerCase();
    const name = trainer.form_name || "";
    const firstName = trainer.form_firstname || trainer.form_first_name || "";
    const isAssigned = assignedTrainers.some(
      (assigned) =>
        String(assigned.idFormateur) === String(trainer.idFormateur)
    );
    return (
      !isAssigned &&
      `${name} ${firstName}`.toLowerCase().includes(search)
    );
  });


  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <LoadingSpinner />
      </div>
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
      <div className="min-h-screen w-full scroll-smooth bg-slate-50 pb-20 pt-4 sm:pt-6">
        <div className="mx-auto w-full max-w-[1600px] space-y-5 px-3 pb-5 sm:px-6">
          <Link
            to="/formateur/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-700"
          >
            <span aria-hidden="true">←</span>
            Retour aux projets
          </Link>
          {/* En-tête du projet */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-5 p-4 sm:p-6">
              {/* Section principale - 70% */}
              <div className="w-full">
                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* Logo entreprise */}
                  <div className="flex-shrink-0">
                    <figure className="w-24 h-24">
                      {projet.projet.etp_logo ? (
                        <img
                          src={`${IMAGE_URL}/img/entreprises/${projet.projet.etp_logo}`}
                          className="object-cover w-full h-full shadow-md rounded-xl"
                          alt="Entreprise"
                          onError={(e) => {
                            e.target.src = '/path/to/default-image.png';
                          }}
                        />
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
                        {projet.projet.module_name || 'Module non spécifié'}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Réf :</span>
                          <span className="px-2 py-1 bg-gray-100 rounded-md">
                            {projet.projet.project_reference || 'Non spécifiée'}
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Dossier :</span>
                          <span className="px-2 py-1 bg-gray-100 rounded-md">
                            {projet?.project_has?.nomDossier || 'Non spécifié'}
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
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
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
                        <span className="font-medium text-gray-700">Début :</span>
                        <span className="px-3 py-1 text-gray-800 capitalize bg-white rounded-md shadow-sm">
                          {projet.projet.dateDebut ?
                            new Date(projet.projet.dateDebut).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }) :
                            'Non définie'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-gray-700">Fin :</span>
                        <span className="px-3 py-1 text-gray-800 capitalize bg-white rounded-md shadow-sm">
                          {projet.projet.dateFin ?
                            new Date(projet.projet.dateFin).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }) :
                            "Non définie"}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-4 py-2 text-sm font-medium text-blue-700 border border-blue-200 rounded-full bg-blue-50">
                        {projet.projet.project_type || 'Type non spécifié'}
                      </span>
                      <span className="px-4 py-2 text-sm font-medium border rounded-full bg-cyan-50 border-cyan-200 text-cyan-700">
                        {projet.projet.modalite || 'Modalité non spécifiée'}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(projet.projet.project_status)}`}
                        title="Le projet de formation est en cours de préparation, avec des détails tels que le programme, les supports de formation, et la logistique en cours de finalisation."
                      >
                        {projet.projet.project_status || 'Statut inconnu'}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="mt-4">
                      <p className="leading-relaxed text-gray-700 line-clamp-3">
                        {projet.projet.project_description || 'Aucune description disponible'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <nav
            aria-label="Navigation dans le projet"
            className="sticky top-2 z-20 flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-sm backdrop-blur"
          >
            {[
              ["participants", "Participants"],
              ["formateurs", "Formateurs"],
              ["objectifs", "Objectifs"],
              ["materiels", "Matériels"],
              ["agenda", "Agenda"],
              ["programme", "Programme"],
              ["ressources", "Ressources"],
            ].map(([target, label]) => (
              <a
                key={target}
                href={`#${target}`}
                className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="w-full">
            <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-4 p-1 sm:p-4">
              {/* apprenant */}
              <div id="participants" className="w-full scroll-mt-24 p-4 mx-auto max-w-8xl">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                  {/* En-tête avec gradient */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
                      <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex min-w-0 flex-1 items-center gap-4 rounded-xl p-2 text-left text-slate-700 transition hover:bg-white"
                      >
                        <FaUsers className="text-2xl" />
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="text-xl font-semibold">Participants</span>
                          <span className="px-3 py-1 text-sm font-medium rounded-full bg-white/20">
                            {assignedLearners.length}
                          </span>
                        </div>
                        <div className="ml-auto">
                          {isExpanded ? (
                            <FaChevronUp className="w-5 h-5" />
                          ) : (
                            <FaChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </button>

                      <div className="flex items-center gap-3 ml-4">
                        <button
                          type="button"
                          onClick={() => setShowLearnerManager(true)}
                          className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                        >
                          <FaPlus className="h-3.5 w-3.5" />
                          Ajouter un apprenant
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 rounded-lg bg-white/10 hover:bg-white/20">
                          <FileText className="w-4 h-4" />
                          Émargement
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Contenu extensible */}
                  <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>

                    {/* Titre de la formation */}
                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                      <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-800">
                        <Award className="w-5 h-5 text-indigo-600" />
                        {projet?.projet?.etp_name}
                      </h3>
                    </div>

                    {/* Tableau des participants */}
                    <div className="p-6">
                      {assignedLearners.length > 0 ? (
                        <div className="space-y-1">

                          {/* En-tête du tableau */}
                          <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold text-gray-700 rounded-lg bg-gray-50">
                            <div className="flex items-center col-span-4 gap-2">
                              <Users className="w-4 h-4" />
                              Participant
                            </div>
                            <div className="flex items-center col-span-2 gap-2">
                              <UserCheck className="w-4 h-4" />
                              Présence
                            </div>
                            <div className="flex items-center col-span-2 gap-2">
                              <BarChart3 className="w-4 h-4" />
                              Note
                            </div>
                            <div className="flex items-center col-span-3 gap-2">
                              <FaAward className="w-4 h-4" />
                              Compétences
                            </div>
                            <div className="col-span-1 text-center">Action</div>
                          </div>

                          {/* Liste des participants */}
                          <div className="space-y-2">
                            {assignedLearners.map((participant, index) => (
                              <div
                                key={index}
                                className="grid items-center grid-cols-12 gap-4 px-4 py-4 transition-all duration-200 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-indigo-200 group"
                              >

                                {/* Participant Info */}
                                <div className="flex items-center col-span-4 gap-4">
                                  <div className="relative">
                                    {participant.emp_photo && participant.emp_photo.trim() !== "" ? (
                                      <div className="w-12 h-12 overflow-hidden border-2 border-gray-200 rounded-full">
                                        <img
                                          src={`${IMAGE_URL}/img/employes/${participant.emp_photo}`}
                                          alt={`${participant.emp_name} ${participant.emp_firstname}`}
                                          className="object-cover w-full h-full"
                                        />
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-center w-12 h-12 font-bold text-gray-600 border-gray-200 rounded-full shadow-sm border-1 bg-gradient-to-r from-gray-50 to-gray-100">
                                        {getInitials(participant.emp_firstname, participant.emp_name)}
                                      </div>
                                    )}
                                    <div className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1"></div>
                                  </div>

                                  <div className="space-y-1">
                                    <div className="text-sm font-semibold tracking-wide text-gray-800 uppercase">
                                      {participant.emp_name}
                                    </div>
                                    <div className="text-sm font-medium text-gray-400 capitalize">
                                      {participant.emp_firstname}
                                    </div>
                                  </div>
                                </div>

                                {/* Présence */}
                                <div className="col-span-2">
                                  <div className="flex items-center gap-2">
                                    <div className="px-2 py-1 text-xs font-semibold text-gray-200 rounded-full">
                                      {participant.presence}%
                                    </div>
                                    {participant.presence >= 80 ? (
                                      <FaCheckCircle className="w-4 h-4 text-gray-500" />
                                    ) : (
                                      <FaTimesCircle className="w-4 h-4 text-gray-500" />
                                    )}
                                  </div>
                                </div>

                                {/* Notation */}
                                <div className="col-span-2">
                                  <div className="flex items-center gap-2">
                                    <span className={`font-bold text-lg ${getNotationColor(participant.notation)}`}>

                                    </span>
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <FaStar
                                          key={i}
                                          className={`w-3 h-3 ${i < Math.floor(participant.notation / 4)
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                            }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Compétences */}
                                <div className="col-span-3">
                                  <div className="flex flex-wrap gap-1">
                                    {participant.skills?.slice(0, 2).map((skill, skillIndex) => (
                                      <span
                                        key={skillIndex}
                                        className="px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                    {participant.skills?.length > 2 && (
                                      <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                                        +{participant.skills.length - 2}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 flex justify-center">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      manageLearner(
                                        "delete",
                                        participant.idEmploye ?? participant.id
                                      )
                                    }
                                    disabled={learnerManagerLoading}
                                    aria-label={`Retirer ${participant.emp_name} du projet`}
                                    className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <FaXmark />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="py-12 text-center">
                          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
                            <FaUsers className="w-10 h-10 text-gray-400" />
                          </div>
                          <h3 className="mb-3 text-xl font-semibold text-gray-900">Aucun participant</h3>
                          <p className="mb-6 text-gray-500">Cette formation n'a pas encore de participants inscrits</p>
                          <button
                            type="button"
                            onClick={() => setShowLearnerManager(true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
                          >
                            <FaPlus />
                            Ajouter un apprenant
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Footer avec statistiques */}
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-gray-600">

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="formateurs" className="w-full scroll-mt-24 p-4 mx-auto max-w-8xl">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-white p-3 shadow-sm">
                        <FaUsers className="text-xl text-indigo-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-slate-800">
                          Formateurs
                        </h2>
                        <p className="text-sm text-slate-600">
                          {assignedTrainers.length} formateur(s) assigné(s) au projet
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowTrainerManager(true)}
                      className="inline-flex items-center gap-2 rounded-xl border-2 border-indigo-600 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-600 hover:text-white"
                    >
                      <FaPlus className="h-3.5 w-3.5" />
                      Ajouter un formateur
                    </button>
                  </div>
                  <div className="p-6">
                    {assignedTrainers.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {assignedTrainers.map((trainer) => (
                          <div
                            key={trainer.idFormateur}
                            className="flex items-center gap-3 rounded-xl border border-slate-200 p-4"
                          >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 font-semibold text-indigo-700">
                              {trainer.form_photo ? (
                                <img
                                  src={`${IMAGE_URL}/img/formateurs/${trainer.form_photo}`}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                getInitials(
                                  trainer.form_firstname || trainer.form_first_name,
                                  trainer.form_name
                                )
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-semibold text-slate-800">
                                {trainer.form_name}
                              </p>
                              <p className="truncate text-sm text-slate-500">
                                {trainer.form_firstname || trainer.form_first_name || trainer.form_email}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => manageTrainer("delete", trainer.idFormateur)}
                              disabled={trainerManagerLoading}
                              aria-label={`Retirer ${trainer.form_name} du projet`}
                              className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                            >
                              <FaXmark />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="mb-4 text-slate-500">
                          Aucun formateur supplémentaire n’est assigné.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowTrainerManager(true)}
                          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
                        >
                          <FaPlus />
                          Assigner un formateur
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* objectif */}
              <div id="objectifs" className="w-full scroll-mt-24 p-4 mx-auto max-w-8xl">
                <div className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-xl rounded-2xl hover:shadow-2xl">

                  {/* En-tête avec gradient */}
                  <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="p-2 rounded-full bg-white/20">
                        <Target className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Objectifs de la Formation</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Compétences et connaissances à acquérir
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-white/20">
                          {filteredObjectifs?.length || 0} objectifs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    {Array.isArray(filteredObjectifs) && filteredObjectifs.length > 0 ? (
                      <div className="space-y-4">
                        {filteredObjectifs.map((objectif, index) => (
                          <div
                            key={index}
                            className="group flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                          >
                            {/* Numéro/Icône */}
                            <div className="relative flex-shrink-0">
                              <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-gray-600 rounded-full shadow-lg bg-gradient-to-r from-gray-50 to-gray-100">
                                {index + 1}
                              </div>
                              {/* Ligne de connexion (sauf pour le dernier élément) */}
                              {index < filteredObjectifs.length - 1 && (
                                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gradient-to-r from-gray-50 to-gray-100 to-transparent"></div>
                              )}
                            </div>

                            {/* Contenu de l'objectif */}
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-3">
                                <p className="font-medium leading-relaxed text-gray-800">
                                  {objectif.objectif}
                                </p>
                                <ArrowRight className="w-4 h-4 transition-opacity duration-200 opacity-0 text-emerald-500 group-hover:opacity-100" />
                              </div>

                              {/* Indicateur de progression (optionnel) */}
                              <div className="flex items-center gap-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-gradient-to-r from-gray-50 to-gray-100 h-1.5 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.random() * 40 + 60}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium text-gray-500">En cours</span>
                              </div>
                            </div>

                            {/* Badge de statut */}
                            <div className="flex-shrink-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                              <CheckCircle className="w-5 h-5 text-emerald-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-emerald-100">
                          <Target className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-gray-900">Aucun objectif défini</h3>
                        <p className="max-w-md mx-auto mb-6 text-gray-500">
                          Les objectifs de cette formation n'ont pas encore été définis. Contactez l'administrateur pour plus d'informations.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer avec informations supplémentaires */}
                  <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">

                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* materiel */}
              <div id="materiels" className="w-full scroll-mt-24 p-4 mx-auto max-w-8xl">
                <div className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-xl rounded-2xl hover:shadow-2xl">

                  {/* En-tête avec gradient */}
                  <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center gap-4 text-white">
                      <div className="p-2 rounded-full bg-white/20">
                        <Package className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-600">Matériels Nécessaires</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Équipements et ressources requis pour la formation
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-white/20">
                          {filteredMateriels?.length || 0} éléments
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    {/* Introduction */}
                    <div className="p-4 mb-6 border bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-violet-200">
                      <p className="leading-relaxed text-gray-700">
                        <span className="font-semibold text-gray-700">Pour cette formation,</span> les apprenants doivent disposer des matériels et ressources suivants pour optimiser leur expérience d'apprentissage :
                      </p>
                    </div>

                    {Array.isArray(filteredMateriels) && filteredMateriels.length > 0 ? (
                      <div className="space-y-4">
                        <div key="" className="space-y-3">
                          {filteredMateriels.map((materiel, index) => (
                            <div
                              key={index}
                              className="group flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-violet-200 hover:shadow-md transition-all duration-200 hover:scale-[1.01]"
                            >
                              {/* Icône de type */}
                              <div className="flex-shrink-0">
                                <div className="flex items-center justify-center w-10 h-10 text-white rounded-full shadow-lg bg-gradient-to-r from-gray-50 to-gray-100">
                                  {/* {getTypeIcon(materiel.type)} */}
                                </div>
                              </div>

                              {/* Contenu */}
                              <div className="flex-1">
                                <p className="font-medium leading-relaxed text-gray-800">
                                  {materiel.prestation_name}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                  <span className="px-2 py-1 text-xs rounded-full">

                                  </span>
                                </div>
                              </div>

                              {/* Indicateur de statut */}
                              <div className="flex-shrink-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                                {materiel.priorite === 'essentiel' ? (
                                  <AlertTriangle className="w-5 h-5 text-red-500" />
                                ) : (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-violet-100">
                          <Package className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-gray-900">Aucun matériel spécifié</h3>
                        <p className="max-w-md mx-auto mb-6 text-gray-500">
                          Les exigences matérielles pour cette formation n'ont pas encore été définies.
                        </p>
                        <button className="inline-flex items-center gap-2 px-6 py-3 text-white transition-all duration-200 transform bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl hover:from-violet-700 hover:to-purple-700 hover:scale-105">
                          <ShoppingCart className="w-4 h-4" />
                          Définir les matériels
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Footer avec informations supplémentaires */}
                  <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-violet-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                      </div>
                      <span className="text-xs text-gray-500">Liste mise à jour</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* agenda */}
              <div id="agenda" className="w-full scroll-mt-24 p-4 mx-auto max-w-8xl">
                <div className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-xl rounded-2xl hover:shadow-2xl" >
                  {/* En-tête avec gradient */}
                  <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center gap-4 text-white">
                      <div className="p-2 rounded-full bg-white/20">
                        <CalendarDays className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-600">Agenda</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Équipements et ressources requis pour la formation
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-600">
                            {projet?.seances?.length ?? 0}
                          </p>
                          <p className="text-sm text-gray-600">Sessions planifiées</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Clock className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-600">
                            {projet?.totalSession?.sumHourSession ?? '0h'}
                          </p>
                          <p className="text-sm text-gray-600">Durée totale</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-6">
                    {projet?.seances?.length > 0 ? (
                      <div className="space-y-4">
                        {projet?.seances?.map((seance, index) => (
                          <div
                            key={index}
                            className="p-5 transition-all duration-200 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-200 group"
                          >
                            <div className="flex items-center justify-between">
                              {/* Session Info */}
                              <div className="flex items-center gap-6">
                                <div className="flex-shrink-0">
                                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                                    <span className="font-bold text-blue-600">
                                      {String(index + 1).padStart(2, '0')}
                                    </span>
                                  </div>
                                </div>

                                <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-4">
                                  <div>
                                    <p className="mb-1 text-sm text-gray-500">Date</p>
                                    <p className="font-semibold text-gray-800 capitalize">
                                      {formaterDateComplete(seance.dateSeance)}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="mb-1 text-sm text-gray-500">Horaires</p>
                                    <div className="flex items-center gap-2">
                                      <Clock className="w-4 h-4 text-gray-400" />
                                      <span className="font-medium text-gray-700">
                                        {seance.heureDebut} - {seance.heureFin}
                                      </span>
                                    </div>
                                  </div>

                                  <div>
                                    <p className="mb-1 text-sm text-gray-500">Durée</p>
                                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                                      {seance.intervalle_raw}
                                    </span>
                                  </div>

                                  <div>
                                    <p className="mb-1 text-sm text-gray-500">Type</p>
                                    <span
                                      className={`inline-flex items-center px-5 w-full text-center py-1 rounded-full text-sm font-medium cursor-pointer ${seance.session_catch_up ===
                                        "Rattrapage" ||
                                        seance.session_catch_up ===
                                        "1" ||
                                        seance.session_catch_up === 1
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-blue-100 text-blue-800"
                                        }`}
                                    >
                                      <p>
                                        {seance.session_catch_up ===
                                          "0" ||
                                          seance.session_catch_up === 0 ||
                                          seance.session_catch_up ===
                                          "false"
                                          ? "Normal"
                                          : "Rattrapage"}
                                      </p>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex-shrink-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100">

                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                          <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="mb-2 text-lg font-medium text-gray-900">Aucune session planifiée</h3>

                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div id="programme" className="w-full max-w-6xl mx-auto scroll-mt-24 space-y-6">
                {/* Section Programme pédagogique */}
                <div className="overflow-hidden transition-all duration-500 bg-white border border-gray-200 shadow-lg rounded-2xl group hover:shadow-xl">
                  {/* Header */}
                  <div className="relative px-6 py-6 overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="absolute inset-0 transition-transform duration-1000 transform translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:-translate-x-full"></div>
                    <div className="relative z-10 flex items-center gap-4 text-white">
                      <div className="p-3 shadow-lg bg-white/20 backdrop-blur-sm rounded-xl">
                        <BookOpen className="text-gray-600 w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-2xl font-bold text-gray-600">Programme pédagogique</h3>
                        <p className="text-sm text-gray-600">
                          Contenu détaillé et structuré de la formation
                        </p>
                      </div>
                      <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                        <span className="text-sm font-semibold">Détails</span>
                      </div>
                    </div>
                  </div>

                  {/* Contenu expandable */}
                  <div className="p-6 bg-white">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="p-4 bg-white border border-blue-100 shadow-sm rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-600">Modules théoriques</span>
                        </div>
                        <p className="text-xs text-gray-600">Concepts fondamentaux</p>
                      </div>
                      <div className="p-4 bg-white border border-indigo-100 shadow-sm rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-600">Exercices pratiques</span>
                        </div>
                        <p className="text-xs text-gray-600">Mise en application</p>
                      </div>
                      <div className="p-4 bg-white border border-purple-100 shadow-sm rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-600">Évaluations</span>
                        </div>
                        <p className="text-xs text-gray-600">Tests de compétences</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Ressources téléchargeables */}
                <div id="ressources" className="scroll-mt-24 overflow-hidden transition-all duration-500 bg-white border border-gray-200 shadow-lg rounded-2xl group hover:shadow-xl">
                  {/* Header */}
                  <div className="relative px-6 py-6 overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="absolute inset-0 transition-transform duration-1000 transform translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:-translate-x-full"></div>
                    <div className="relative z-10 flex items-center gap-4 text-white">
                      <div className="p-3 shadow-lg bg-white/20 backdrop-blur-sm rounded-xl">
                        <Download className="text-gray-600 w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-2xl font-bold text-gray-600">Ressources téléchargeables</h3>
                        <p className="text-sm text-gray-600">
                          Supports de cours, exercices et documents complémentaires
                        </p>
                      </div>
                      <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                        <span className="text-sm font-semibold">Accès libre</span>
                      </div>
                    </div>
                  </div>

                  {/* Contenu avec liste de ressources */}
                  <div className="p-6 bg-white">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* Support de cours */}
                      <div className="p-4 transition-shadow bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                              <BookOpen className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">Support de cours</h4>
                              <p className="text-xs text-gray-500">PDF - 2.4 MB</p>
                            </div>
                          </div>
                          <button className="p-2 text-gray-600 transition-colors rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Exercices pratiques */}
                      <div className="p-4 transition-shadow bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                              <CalendarDays className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">Exercices pratiques</h4>
                              <p className="text-xs text-gray-500">DOCX - 1.8 MB</p>
                            </div>
                          </div>
                          <button className="p-2 text-gray-600 transition-colors rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Note informative */}
                    <div className="p-4 mt-4 border border-gray-200 bg-white/70 backdrop-blur-sm rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="mb-1 text-sm font-medium text-gray-700">Accès illimité</p>
                          <p className="text-xs text-gray-600">Téléchargez et consultez ces ressources à tout moment, même après la formation.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="">
                  <MediaUploadForm projet={projet} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showLearnerManager && (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            aria-label="Fermer la gestion des apprenants"
            onClick={() => setShowLearnerManager(false)}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="learner-manager-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-5xl flex-col bg-white shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
              <div>
                <h2 id="learner-manager-title" className="text-xl font-semibold text-slate-800">
                  Gérer les apprenants
                </h2>
                <p className="text-sm text-slate-600">
                  Ajouter ou retirer des participants du projet
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLearnerManager(false)}
                aria-label="Fermer"
                className="rounded-lg p-2 text-slate-600 transition hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </header>
            {learnerActionError && (
              <p role="alert" className="mx-6 mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {learnerActionError}
              </p>
            )}
            <div className="grid min-h-0 flex-1 md:grid-cols-2">
              <div className="flex min-h-0 flex-col border-b border-slate-200 md:border-b-0 md:border-r">
                <div className="space-y-3 border-b border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-700">Apprenants disponibles</h3>
                  <label className="block text-sm text-slate-600">
                    Entreprise
                    <select
                      value={selectedLearnerCompany}
                      onChange={(event) => setSelectedLearnerCompany(event.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    >
                      <option value="">Sélectionner une entreprise</option>
                      {learnerCompanies.map((company) => (
                        <option key={company.idEtp} value={company.idEtp}>
                          {company.etp_name || company.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={learnerSearch}
                      onChange={(event) => setLearnerSearch(event.target.value)}
                      placeholder="Rechercher un apprenant"
                      className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>
                </div>
                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
                  {learnerManagerLoading ? (
                    <p className="py-8 text-center text-sm text-slate-500">Chargement...</p>
                  ) : filteredAvailableLearners.length > 0 ? (
                    filteredAvailableLearners.map((learner) => {
                      const employeeId = learner.idEmploye ?? learner.id;
                      const firstName = learner.emp_firstname || learner.firstName;
                      const name = learner.emp_name || learner.name;
                      return (
                        <div key={employeeId} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                            {learner.emp_photo || learner.photo ? (
                              <img
                                src={`${IMAGE_URL}/img/employes/${learner.emp_photo || learner.photo}`}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              getInitials(firstName, name)
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-slate-800">{name}</p>
                            <p className="truncate text-sm text-slate-500">{firstName}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => manageLearner("post", employeeId)}
                            disabled={learnerManagerLoading}
                            aria-label={`Ajouter ${name}`}
                            className="rounded-lg bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <p className="py-8 text-center text-sm text-slate-500">
                      {selectedLearnerCompany
                        ? "Aucun apprenant disponible."
                        : "Sélectionnez une entreprise pour afficher ses apprenants."}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex min-h-0 flex-col">
                <div className="border-b border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-700">
                    {assignedLearners.length} apprenant(s) assigné(s)
                  </h3>
                </div>
                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
                  {assignedLearners.length > 0 ? (
                    assignedLearners.map((learner) => {
                      const employeeId = learner.idEmploye ?? learner.id;
                      const firstName = learner.emp_firstname || learner.firstName;
                      const name = learner.emp_name || learner.name;
                      return (
                        <div key={employeeId} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                            {learner.emp_photo || learner.photo ? (
                              <img
                                src={`${IMAGE_URL}/img/employes/${learner.emp_photo || learner.photo}`}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              getInitials(firstName, name)
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-slate-800">{name}</p>
                            <p className="truncate text-sm text-slate-500">{firstName}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => manageLearner("delete", employeeId)}
                            disabled={learnerManagerLoading}
                            aria-label={`Retirer ${name}`}
                            className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            <FaXmark />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <p className="py-8 text-center text-sm text-slate-500">
                      Aucun apprenant assigné à ce projet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
      {showTrainerManager && (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            aria-label="Fermer la gestion des formateurs"
            onClick={() => setShowTrainerManager(false)}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="trainer-manager-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-5xl flex-col bg-white shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
              <div>
                <h2 id="trainer-manager-title" className="text-xl font-semibold text-slate-800">
                  Gérer les formateurs
                </h2>
                <p className="text-sm text-slate-600">
                  Assigner un formateur disponible au projet
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTrainerManager(false)}
                aria-label="Fermer"
                className="rounded-lg p-2 text-slate-600 transition hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </header>
            {trainerActionError && (
              <p role="alert" className="mx-6 mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {trainerActionError}
              </p>
            )}
            <div className="grid min-h-0 flex-1 md:grid-cols-2">
              <div className="flex min-h-0 flex-col border-b border-slate-200 md:border-b-0 md:border-r">
                <div className="space-y-3 border-b border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-700">Formateurs disponibles</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={trainerSearch}
                      onChange={(event) => setTrainerSearch(event.target.value)}
                      placeholder="Rechercher un formateur"
                      className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>
                </div>
                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
                  {trainerManagerLoading ? (
                    <p className="py-8 text-center text-sm text-slate-500">Chargement...</p>
                  ) : filteredAvailableTrainers.length > 0 ? (
                    filteredAvailableTrainers.map((trainer) => {
                      const firstName = trainer.form_firstname || trainer.form_first_name;
                      return (
                        <div key={trainer.idFormateur} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                            {trainer.form_photo ? (
                              <img
                                src={`${IMAGE_URL}/img/formateurs/${trainer.form_photo}`}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              getInitials(firstName, trainer.form_name)
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-slate-800">{trainer.form_name}</p>
                            <p className="truncate text-sm text-slate-500">{firstName || trainer.form_email}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => manageTrainer("post", trainer.idFormateur)}
                            disabled={trainerManagerLoading}
                            aria-label={`Assigner ${trainer.form_name}`}
                            className="rounded-lg bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <p className="py-8 text-center text-sm text-slate-500">
                      Aucun formateur disponible à ajouter.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex min-h-0 flex-col">
                <div className="border-b border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-700">
                    {assignedTrainers.length} formateur(s) assigné(s)
                  </h3>
                </div>
                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
                  {assignedTrainers.length > 0 ? (
                    assignedTrainers.map((trainer) => {
                      const firstName = trainer.form_firstname || trainer.form_first_name;
                      return (
                        <div key={trainer.idFormateur} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                            {trainer.form_photo ? (
                              <img
                                src={`${IMAGE_URL}/img/formateurs/${trainer.form_photo}`}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              getInitials(firstName, trainer.form_name)
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-slate-800">{trainer.form_name}</p>
                            <p className="truncate text-sm text-slate-500">{firstName || trainer.form_email}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => manageTrainer("delete", trainer.idFormateur)}
                            disabled={trainerManagerLoading}
                            aria-label={`Retirer ${trainer.form_name}`}
                            className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            <FaXmark />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <p className="py-8 text-center text-sm text-slate-500">
                      Aucun formateur assigné à ce projet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default ProjetDetailForm;