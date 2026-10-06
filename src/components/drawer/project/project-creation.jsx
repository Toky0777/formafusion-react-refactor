
import React, { useState, useEffect } from 'react';
import {
  FaPlus,
  FaArrowRight,
  FaBookmark,
  FaInfoCircle,
  FaFolder,
} from 'react-icons/fa';
import SuccessAlert from '../../ui/alert-success';
import axios from '../../../config/axios';
import { AlertTriangle, Check, CheckCircle, Info, Search, X, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProjectData } from '../../../hooks/useProjectData';
import { API_URL, IMAGE_URL } from "../../../config/env";

const ProjectCreation = ({ setShowPage, fetchProjets }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertCours, setShowAlertCours] = useState(false);
    const [showAlertDossier, setShowAlertDossier] = useState(false);
    const [showAlertProjet, setShowAlertProjet] = useState(false);
    const [activeTab, setActiveTab] = useState('intra');
    const [currentStep, setCurrentStep] = useState(1);
    const [projectType, setProjectType] = useState('intra');
    const [selectedEntreprise, setSelectedEntreprise] = useState(null);
    const [errors, setErrors] = useState({});
    const [entreprises, setEntreprises] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [dossiers, setDossiers] = useState([]);
    const [tousDossier, setTousDossier] = useState([]);
    const [tousModalite, setTousModalite] = useState([]);
    const [bonCommand, setBonCommand] = useState([]); 
    const [tousVille, setTousVille] = useState({ villes: [] });
    const [selectedDossier, setSelectedDossier] = useState(null);
    const [modalites, setModalites] = useState([]);
    const [modalite, setModalite] = useState([]);
    const [villes, setVilles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [projetCreate, setProjetCreate] = useState([]);
    const [cours, setCours] = useState([]);
    const [etpAjoute, setEtpAjoute] = useState([]);
    const [mdl, setModule] = useState(null);
    const [doc, setFolder] = useState(null);
    const [idProjet, setIdProjet] = useState(null);
    const [EtpName, setEtpName] = useState(null);
    const currentYear = new Date().getFullYear();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCours, setSearchCours] = useState("");
    const [searchDossier, setSearchDossier] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [folders, setFolders] = useState([]);
    const [showNotification, setShowNotification] = React.useState(false);
    const [notification, setNotification] = React.useState({
        message: "",
        type: "",
    });
    const { projets, setProjets, fetchProjetsByStatus } = useProjectData("En préparation");
    const [selectedBc, setSelectedBc] = useState("");

    const navigate = useNavigate();

    const getNotificationConfig = (type) => {
        const configs = {
          success: {
            bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: CheckCircle,
            iconColor: 'text-green-600',
            progressBar: 'bg-green-500'
          },
          error: {
            bg: 'bg-gradient-to-r from-red-50 to-rose-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: XCircle,
            iconColor: 'text-red-600',
            progressBar: 'bg-red-500'
          },
          warning: {
            bg: 'bg-gradient-to-r from-yellow-50 to-amber-50',
            border: 'border-yellow-200',
            text: 'text-yellow-800',
            icon: AlertTriangle,
            iconColor: 'text-yellow-600',
            progressBar: 'bg-yellow-500'
          },
          info: {
            bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: Info,
            iconColor: 'text-blue-600',
            progressBar: 'bg-blue-500'
          }
        };
        return configs[type] || configs.info;
    };

    const config = getNotificationConfig(notification.type);
    const IconComponent = config.icon;

    const fecthProjet = async () => {
        try {
            // --- 1. Récupération des projets ---
            const projetRes = await axios.get(`/cfp/projets/entreprises/all`);
            setProjetCreate(projetRes.data || []);
            setErrors(null);

            // --- 2. Récupération des cours ---
            const coursRes = await axios.get(`/cfp/projet/module-first`);
            setCours(coursRes.data || []);
            setErrors(null);

            // --- 3. Entreprise associée au projet ---
            const etpAjouteRes = await axios.get(`/cfp/projets/${idProjet}/etp/assign`);
            const etpData = etpAjouteRes?.data || {};

            // Sécurisation de la lecture de etp_name
            const entrepriseName = etpData?.entreprise?.etp_name || "";
            setEtpAjoute(etpData);
            setEtpName(entrepriseName);

            // Si on a une entreprise valide, on récupère les bons de commande
            if (entrepriseName) {
            await fetchBonCommand(entrepriseName);
            } else {
            console.warn("Aucune entreprise trouvée — bon de commande non chargé.");
            }

            // --- 5. Tous les dossiers ---
            const dossierRes = await axios.get(`/cfp/projet/folder-first/year/${currentYear}`);
            setTousDossier(dossierRes.data || []);

        } catch (error) {
            console.error("Détails de l'erreur :", error);
            setLoading(false);
            setErrors("Impossible de charger le projet. Veuillez réessayer.");
        }
    };

    const fetchVille = async () => {
          const [ VilleRes ] = await Promise.all([  axios.get(
              `${API_URL}/cfp/projets/getVille/all`
          ),]);   
          setTousVille(VilleRes.data || []);          
    }

     const fetchModalite = async () => {
          const [ ModaliteRes ] = await Promise.all([  axios.get(
              `${API_URL}/cfp/projets/getModalite/all`
          ),]);
   
          setTousModalite(ModaliteRes.data || []);             
    }

    const fetchBonCommand = async (EtpName) => {
        if (!EtpName) {
            console.warn("Aucun EtpName fourni — la requête n’est pas exécutée.");
            return;
        }

        try {
            const res = await axios.get(`${API_URL}/cfp/bon-commande/getBonCommandByEtp/${EtpName}`);
            
            // Vérifie si la structure contient la clé 'bc'
            const data = res.data?.bc ?? [];
            setBonCommand(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des bons de commande :", error);
        }
    };

    const handleSelectChange = async (e) => {
        const value = e.target.value;
        setSelectedBc(value);

        if (!value) return; 

        try {
        await axios.post(`/cfp/projets/${idProjet}/update-numeroBc`, {
            project_reference: value,
        });

        } catch (error) {
        console.error(error);
        alert("Erreur lors de la mise à jour ❌");
        }
    };

    const handleInputChangeBc = async (e) => {
        const value = e.target.value;
        setSelectedBc(value);

        if (!value) return; // ne rien faire si vide

        try {
            await axios.post(`/cfp/projets/${idProjet}/update-numeroBc`, {
                project_reference: value, // correspond à la colonne Laravel
            });

        } catch (error) {
            console.error(error);
            alert("Erreur lors de la mise à jour ❌");
        }
    };

   const filteredEtps = Array.isArray(projetCreate?.etps)
    ? projetCreate.etps.filter(
        (e) =>
            e.etp_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.etp_email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : [];

    const filteredCours = Array.isArray(cours?.modules)
    ? cours.modules.filter((c) =>
        c.module_name?.toLowerCase().includes(searchCours.toLowerCase())
        )
    : [];


    const filteredDossier = Array.isArray(tousDossier?.dossiers)
    ? tousDossier.dossiers.filter(
        (d) =>
            d?.nomDossier?.toLowerCase().includes(searchDossier.toLowerCase())
        )
    : [];

    const [projectData, setProjectData] = useState({
        reference: '',
        title: '',
        description: '',
        idTypeProjet: 1,
        dateDebut: '',
        dateFin: '',
    });

    const handleInputChanger = (e) => {
        setProjectData({
            ...projectData,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!projectData.title.trim()) {
            newErrors.title = "Le titre est obligatoire";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setIsLoading(true);
            try {
                const response = await axios.post(
                `${API_URL}/cfp/projets`,
                {
                    title: projectData.title,
                    reference: projectData.reference,
                    description: projectData.description,
                    idTypeProjet: projectData.idTypeProjet,
                },
                {
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    withCredentials: true, 
                }
                );

                const data = response.data;
                console.log(response.data);
                
                const idProjet = data.idProjet;

                setIdProjet(idProjet);
                
                if (response.status === 200 && data) {
                    const idprojet = data.idProjet;
                    setIdProjet(idprojet);
                    nextStep(); 
                } else {
                    const message = data?.message || 'Une erreur est survenue.';
                    console.error('Erreur serveur:', data);
                }
            } catch (error) {
                console.error('Erreur réseau:', error);
            }
            setIsLoading(false);
    };

    const manageEtp = async (method, idProjet, idEtp) => {
        if (method === "patch") {
            try {
                const response = await axios.patch(`${API_URL}/cfp/projets/${idProjet}/${idEtp}/etp/assign`);
                fecthProjet();
            } catch (error) {
                console.error("Erreur de l'ajout de 'entreprise:", error);
            }
        }
    };

    const manageCours = async (method, idProjet, idModule) => {
        if (method === "patch") {
            try {
            const response = await axios.patch(
                `${API_URL}/cfp/projets/${idProjet}/${idModule}/module/assign`
            );
            if (response.status === 200) {
                setModule(response.data.module);
            } else {
                console.error("⚠️ Erreur inattendue:", response);
            }
            } catch (error) {
            if (error.response) {
                console.error("❌ Erreur API:", error.response.data);
            } else if (error.request) {
                console.error("❌ Pas de réponse du serveur:", error.request);
            } else {
                console.error("❌ Erreur inconnue:", error.message);
            }
            }
        }
    };

    const manageDossier = async (method, idProjet, idDossier) => {
        if (method === "post") {
            try {
               const response = await axios.post(
                    `${API_URL}/cfp/projet/folder-first/document/${idDossier}/${idProjet}`);
               setFolder(response.data.folder);
            } catch (error) {
                console.error("Erreur de l'ajout de dossier:", error);
            }
        }
    };

    const updateDateProjet = async (method, idProjet) => {
    if (method === "patch") {
        try {
        const response = await axios.patch(
            `${API_URL}/cfp/projets/${idProjet}/update-date`,
            {
                dateDebut: projectData.dateDebut,
                dateFin: projectData.dateFin,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
        );
            fetchProjetsByStatus("En préparation");
            setShowPage(false);
            navigate("/cfp/projet/preparation");
        } catch (error) {
          console.error("Erreur de l'ajout de date:", error);
        }
    }
    };

    const handleModaliteChange = async (e, idProjet) => {
        const newModalite = e.target.value;
        setModalite(newModalite);
        try {
               const response = await axios.patch(
                `${API_URL}/cfp/projets/${idProjet}/update/modalite`,
                {
                    modalite: newModalite,
                },
                {
                    headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    },
                    withCredentials: true, 
                }
                );
            if (!response.status != 200) {
                throw new Error('Erreur lors de la mise à jour');
            }
            const result = await response.data;
        } catch (error) {
            console.error('Erreur :', error.message);
        }
    };

    const etpAssign = (etp) => {
        setSelectedEntreprise(etp);
    };

    useEffect(() => {
        fecthProjet();
        fetchProjetsByStatus("En préparation");
        fetchVille();
        fetchModalite();
        fetchBonCommand(EtpName);
        const idType = projectType === 'intra' ? 1 : 2;
        setProjectData((prevData) => ({
            ...prevData,
            idTypeProjet: idType,
        }));
    }, [projectType]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProjectData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        if (projectType === "inter") {
            if (!projectData.title) {
            newErrors.title = "Le titre du projet est obligatoire";
            }
        }
        if (step === 6) {
            if (!projectData.dateDebut) newErrors.dateDebut = 'La date de début est obligatoire';
            if (!projectData.modalite) newErrors.modalite = 'Veuillez sélectionner une modalité';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
          setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="flex flex-col items-center w-full h-full gap-4 mt-4">
                        <div role="alert" className="flex items-center w-full gap-1 p-2 mt-2 bg-blue-100 rounded-md alert">
                            {/* ... ton alert ... */}
                        </div>

                        <div className="flex flex-col w-full gap-1">
                            <label htmlFor="title" className="text-slate-700 text-[13px] after:content-['*'] after:ml-0.5 after:text-red-500">
                                Titre du projet
                            </label>
                            <p className="text-sm italic text-slate-500 text-[13px]">Ce champ est obligatoire !</p>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={projectData.title}
                                onChange={handleInputChanger}
                                placeholder='Entrez le titre'
                                className="w-full p-2 border-gray-200 rounded-md input input-bordered border-w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 shadow-sm hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                            />
                            {errors?.title && <div className="text-sm text-red-500">{errors?.title}</div>}
                        </div>

                        <div className="flex flex-col w-full gap-1">
                            <label htmlFor="description" className="text-slate-700 text-[13px]">Description</label>
                            <textarea
                                name="description"
                                id="description"
                                value={projectData.description}
                                onChange={handleInputChanger}
                                placeholder='Description'
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 shadow-sm hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                                rows="1"
                            />
                        </div>

                        <div className="flex justify-end w-full mt-2">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    style={{
                                        transformStyle: "preserve-3d",
                                    }}
                                    className="relative rotate-button bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl w-52 h-12 overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-purple-500 hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    <span
                                        style={{
                                            backfaceVisibility: "hidden",
                                            transform: "rotateY(0deg)",
                                        }}
                                        className="absolute inset-0 flex items-center justify-center gap-3 p-3 rotate-button-face font-semibold text-sm tracking-wide"
                                    >
                                        <span>Suivant</span>
                                        <FaArrowRight className="text-lg transition-transform group-hover:translate-x-1" />
                                    </span>
                                    <span
                                        style={{
                                            backfaceVisibility: "hidden",
                                            transform: "rotateY(180deg)",
                                        }}
                                        className="absolute inset-0 flex items-center justify-center text-sm font-semibold rotate-button-face-back tracking-wide px-2"
                                    >
                                        <span className="text-center leading-tight">Sélectionner un dossier</span>
                                    </span>
                                    
                                    {/* Effet de brillance au survol */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                </button>
                        </div>
                    </div>
                );

            case 2:
                 if (projectType === 'intra') {
                        return (
                            <div className="flex flex-col w-full gap-6">
                                <div className="flex min-w-[500px] w-full gap-6">
                                    {/* Section Liste des entreprises */}
                                    <div className="flex flex-col w-1/2">
                                        {/* Header avec indicateur visuel amélioré */}
                                        <div className="flex items-center gap-3 mb-4 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border-l-4 border-red-400">
                                            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                                            <label className="text-red-700 font-semibold text-sm">
                                                Liste de toutes les entreprises clientes
                                            </label>
                                            <div className="ml-auto bg-red-200 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                                                {projetCreate.etps?.length || 0} entreprises
                                            </div>
                                        </div>

                                        {/* Barre de recherche améliorée */}
                                        <div className="relative mb-4">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="search_client"
                                                onChange={(e) =>
                                                    setSearchTerm(e.target.value)
                                                }
                                                placeholder="Rechercher une entreprise..."
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                                            />
                                        </div>

                                        {/* Liste des entreprises avec design modernisé */}
                                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                            <div className="h-[35rem] overflow-y-auto p-2 space-y-3">
                                                 {[...filteredEtps, ...projetCreate?.etps].map(
                                                  (e, i) => (
                                                    <div key={i} className="group bg-gradient-to-r from-white to-gray-50 hover:from-red-50 hover:to-white rounded-xl p-4 border border-gray-100 hover:border-red-200 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                {/* Avatar avec effet de brillance */}
                                                                <div className="relative">
                                                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner overflow-hidden flex items-center justify-center">
                                                                        {e.etp_logo ? (
                                                                            <img 
                                                                                src={`${IMAGE_URL}/img/entreprises/${e.etp_logo}`} 
                                                                                alt={e.etp_name}
                                                                                className="w-full h-full object-cover rounded-xl"
                                                                                onError={(evt) => evt.target.style.display = 'none'}
                                                                            />
                                                                        ) : (
                                                                            <span className="text-xl font-bold text-gray-600">
                                                                                {e.etp_name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {/* Badge de statut */}
                                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                                                </div>
                                                                
                                                                {/* Informations entreprise */}
                                                                <div className="flex flex-col">
                                                                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide group-hover:text-red-700 transition-colors">
                                                                        {e.etp_name}
                                                                    </h3>
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        {e.etp_email}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Bouton d'ajout avec animation */}
                                                            <button
                                                                onClick={() => manageEtp("patch", idProjet, e.idEtp)}
                                                                className="group/btn relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 overflow-hidden"
                                                            >
                                                                <FaPlus className="relative z-10 text-sm" />
                                                                {/* Effet de brillance */}
                                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500"></div>
                                                            </button>
                                                        </div>
                                                    </div>
                                                  )
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section Client sélectionné */}
                                    <div className="flex flex-col w-1/2">
                                        {/* Header avec indicateur visuel amélioré */}
                                        <div className="flex items-center gap-3 mb-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-4 border-green-400">
                                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                            <label className="text-green-700 font-semibold text-sm">
                                                Client sélectionné pour ce projet
                                            </label>
                                            <div className="ml-auto bg-green-200 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                               {etpAjoute?.entreprise ? 1 : 0} sélectionné(s)
                                            </div>
                                        </div>

                                        {/* Zone de sélection */}
                                        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                            <div className="p-4 h-[35rem] overflow-y-auto">
                                                {etpAjoute?.entreprise ? (
                                                    <div className="space-y-3">
                                                        <div className="bg-gradient-to-r from-green-50 to-white rounded-xl p-4 border border-green-200 shadow-sm">
                                                        <div className="flex items-center gap-4">
                                                            {/* Avatar avec effet de succès */}
                                                            <div className="relative">
                                                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-inner overflow-hidden">
                                                                {etpAjoute.entreprise.etp_logo ? (
                                                                    <img 
                                                                        src={`${IMAGE_URL}/img/entreprises/${etpAjoute.entreprise.etp_logo}`} 
                                                                        alt={etpAjoute.entreprise.etp_name}
                                                                        className="w-full h-full object-cover rounded-xl"
                                                                        onError={(evt) => evt.target.style.display = 'none'}
                                                                    />
                                                                ) : (
                                                                    <span className="text-xl font-bold text-green-700">
                                                                        {etpAjoute.entreprise.etp_name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {/* Icône de validation */}
                                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                            </div>

                                                            {/* Informations entreprise sélectionnée */}
                                                            <div className="flex flex-col">
                                                            <h3 className="font-bold text-green-800 text-sm uppercase tracking-wide">
                                                                {etpAjoute.entreprise.etp_name}
                                                            </h3>
                                                            <p className="text-xs text-green-600 mt-1">
                                                                {etpAjoute.entreprise.etp_email}
                                                            </p>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    </div>
                                                    ) : (
                                                    /* État vide */
                                                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-2a1 1 0 011-1h1a1 1 0 011 1v2m-4 0h4" />
                                                        </svg>
                                                        </div>
                                                        <p className="text-sm font-medium mb-2">Aucun client sélectionné</p>
                                                        <p className="text-xs text-center">Cliquez sur le bouton + pour ajouter une entreprise</p>
                                                    </div>
                                                    )}

                                            </div>
                                        </div>

                                        {/* Boutons de navigation modernisés */}
                                        <div className="flex justify-between items-center mt-6 gap-4">
                                            <button
                                                onClick={prevStep}
                                                className="group flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5"
                                            >
                                                <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                </svg>
                                                Revenir
                                            </button>

                                            <button
                                                onClick={nextStep}
                                                disabled={isLoading}
                                                className="group relative bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl px-8 py-3 overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-purple-500 hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[200px]"
                                            >
                                                {/* Face avant */}
                                                <span className="group-hover:opacity-0 flex items-center justify-center gap-3 font-semibold text-sm tracking-wide transition-opacity duration-300">
                                                    Suivant
                                                    <FaArrowRight className="text-lg transform group-hover:translate-x-1 transition-transform" />
                                                </span>
                                                
                                                {/* Face arrière */}
                                                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-sm font-semibold tracking-wide transition-opacity duration-300">
                                                    Sélectionner un numero Bc
                                                </span>
                                                
                                                {/* Effet de brillance amélioré */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Alert de succès modernisée */}
                                {showAlert && (
                                    <div className="fixed top-4 right-4 z-50">
                                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-lg animate-slide-in-right">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span className="font-medium">Entreprise ajoutée avec succès !</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    } else {
                        return renderModuleSelection();
                    }

            case 3:
                return (
                   <div class="flex flex-col w-full gap-6 mt-4">
                        <div class="text-center">
                            <div class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl border-l-4 border-blue-400">
                                <div class="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                                <h2 class="text-lg font-semibold text-blue-800">
                                    Ajout un numero de bon de commande
                                </h2>
                            </div>
                            <p class="text-gray-600 mt-4 max-w-md mx-auto">
                                Sélectionnez un bon de commande existant pour ce projet
                            </p>
                        </div>

                        <div class="max-w-lg mx-auto w-full">
                            <div class="bg-white rounded-xl border border-gray-200 shadow-lg p-8">

                                <div class="text-center mb-6">
                                    <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="bonCommande" className="block text-sm font-medium text-gray-700">
                                        Numéro de Bon de commande
                                    </label>
                                    
                                    {bonCommand.length > 0 ? (
                                        <div className="relative">
                                        <select
                                            value={selectedBc}
                                            onChange={handleSelectChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md appearance-none text-gray-700"
                                        >
                                            <option value="">Choisissez un numéro de bon de commande...</option>
                                            {bonCommand.map((bc, index) => (
                                            <option key={index} value={bc.numero_bc}>
                                                {bc.numero_bc}
                                            </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                        </div>
                                    ) : (
                                        // Si aucun bon de commande : afficher un input
                                        <div className="space-y-3">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={selectedBc}
                                                onChange={handleInputChangeBc} 
                                                placeholder="Entrez un numéro de bon de commande ou reference"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-xs text-blue-700">
                                            Aucun bon de commande existant. Veuillez créer un nouveau numéro.
                                            </p>
                                        </div>
                                        </div>
                                    )}
                                    
                                    <p className="text-xs text-gray-500 mt-1">
                                        {bonCommand.length > 0 
                                        ? "Sélectionnez le bon de commande associé au projet"
                                        : "Créez un nouveau bon de commande pour ce projet"}
                                    </p>
                                </div>
                            </div>
                        </div>

                         {/* Boutons de navigation */}
                        <div className="flex justify-center gap-4 mt-8">
                            <button
                                onClick={prevStep}
                                className="group flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Revenir
                            </button>
                            
                            <button
                                onClick={nextStep}
                                disabled={isLoading}
                                className="group relative bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl px-8 py-3 overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-purple-500 hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[200px]"
                            >
                                {/* Face avant */}
                                <span className="group-hover:opacity-0 flex items-center justify-center gap-3 font-semibold text-sm tracking-wide transition-opacity duration-300">
                                    Suivant
                                    <FaArrowRight className="text-lg transform group-hover:translate-x-1 transition-transform" />
                                </span>
                                
                               {(projectType === 'intra' || projectType === 'inter') && (
                                    <>
                                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-sm font-semibold tracking-wide transition-opacity duration-300">
                                            {projectType === 'intra' ? 'Sélectionnez un cours' : 'Sélectionnez un lieu'}
                                        </span>

                                        {/* Effet de brillance */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                    </>
                                )}
                           
                            </button>
                        </div>
                    </div>
                )

            case 4:
                if (projectType === 'intra') {
                        return (
                            <div id="step-3" className="tab-pane !visible" role="tabpanel" aria-labelledby="step-3" style={{ display: "block" }}>
                                <div className="flex flex-col w-full gap-6">
                                    <div className="flex min-w-[500px] overflow-x-auto w-full gap-6">
                                        {/* Section Liste des cours */}
                                        <div className="flex flex-col w-1/2">
                                            {/* Header modernisé */}
                                            <div className="flex items-center gap-3 mb-4 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border-l-4 border-red-400">
                                                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                                                <label className="text-red-700 font-semibold text-base">
                                                    Liste de tous les cours
                                                </label>
                                                <div className="ml-auto bg-red-200 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                                                    {cours.modules?.length || 0} cours
                                                </div>
                                            </div>

                                            {/* Barre de recherche améliorée */}
                                            <div className="relative mb-4">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    id="main_search_cours"
                                                     onChange={(e) =>
                                                        setSearchCours(e.target.value)
                                                    }
                                                    placeholder="Rechercher un cours..."
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                                                />
                                            </div>

                                            {/* Liste des cours avec design modernisé */}
                                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                                <div className="h-[35rem] overflow-y-auto p-2">
                                                    <ul className="space-y-3">
                                                        {[...filteredCours, ...cours?.modules].map(
                                                          (m, i) => (
                                                            <li
                                                                key={i}
                                                                className="group bg-gradient-to-r from-white to-gray-50 hover:from-red-50 hover:to-white rounded-xl p-4 border border-gray-100 hover:border-red-200 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-4 flex-1">
                                                                        {/* Image du module avec effet */}
                                                                        <div className="relative">
                                                                           <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md ring-2 ring-gray-100 group-hover:ring-red-200 transition-all duration-300 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                                                {m.module_image ? (
                                                                                    <img 
                                                                                        src={`${IMAGE_URL}/img/modules/${m.module_image}`} 
                                                                                        alt={m.module_name}
                                                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                                        onError={(evt) => evt.target.style.display = 'none'}
                                                                                    />
                                                                                ) : (
                                                                                    <span className="text-lg font-bold text-gray-600">
                                                                                        {m.module_name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            {/* Badge de statut */}
                                                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white rounded-full"></div>
                                                                        </div>
                                                                        
                                                                        {/* Informations du cours */}
                                                                        <div className="flex flex-col flex-1">
                                                                            <h3 className="font-semibold text-gray-800 text-sm capitalize group-hover:text-red-700 transition-colors line-clamp-2">
                                                                                {m.module_name}
                                                                            </h3>
                                                                            <div className="flex items-center gap-2 mt-1">
                                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                                    Module
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Bouton d'ajout modernisé */}
                                                                    <button
                                                                        onClick={() => manageCours("patch", idProjet, m.idModule)}
                                                                        className="group/btn relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 overflow-hidden"
                                                                    >
                                                                        <FaPlus className="relative z-10 text-sm" />
                                                                        {/* Effet de brillance */}
                                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500"></div>
                                                                    </button>
                                                                </div>
                                                            </li>
                                                          )
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section Cours sélectionné */}
                                        <div className="flex flex-col w-1/2">
                                            {/* Header avec indicateur visuel */}
                                            <div className="flex items-center gap-3 mb-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-4 border-green-400">
                                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                                <label className="text-green-700 font-semibold text-base">
                                                    Cours sélectionnés pour ce projet
                                                </label>
                                            </div>

                                             {/* Zone de sélection */}
                                            <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                                <div className="p-4 h-[35rem] overflow-y-auto">
                                                    {mdl ? (
                                                         <div className="space-y-3">
                                                                <div className="bg-gradient-to-r from-green-50 to-white rounded-xl p-4 border border-green-200 shadow-sm">
                                                                <div className="flex items-center gap-4">
                                                                    {/* Avatar avec effet de succès */}
                                                                    <div className="relative">
                                                                     <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-inner overflow-hidden">
                                                                        {mdl?.image ? (
                                                                            <img 
                                                                                src={`${IMAGE_URL}/img/modules/${mdl.image}`} 
                                                                                alt={mdl?.name}
                                                                                className="w-full h-full object-cover rounded-xl"
                                                                                onError={(evt) => evt.target.style.display = 'none'}
                                                                            />
                                                                        ) : (
                                                                            <span className="text-xl font-bold text-green-700">
                                                                                {mdl?.name ? mdl.name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase() : 'MD'}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {/* Icône de validation */}
                                                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    </div>
                                                                    </div>

                                                                    {/* Informations entreprise sélectionnée */}
                                                                    <div className="flex flex-col">
                                                                    <h3 className="font-bold text-green-800 text-sm tracking-wide">
                                                                        {mdl?.name}
                                                                    </h3>
                                                                    <p className="text-xs text-green-600 mt-1">
                                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                                    Module
                                                                        </span>
                                                                    </p>
                                                                    </div>
                                                                </div>
                                                                </div>
                                                            </div>   
                                                    ):(
                                                            <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                                                <div className="p-4 h-[35rem] overflow-y-auto">
                                                                    {/* État vide avec design attrayant */}
                                                                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                                                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                                            </svg>
                                                                        </div>
                                                                        <h3 className="text-lg font-medium mb-2 text-gray-600">Aucun cours sélectionné</h3>
                                                                        <p className="text-sm text-center text-gray-500 max-w-xs">
                                                                            Cliquez sur le bouton <span className="inline-flex items-center mx-1 w-5 h-5 bg-green-100 text-green-600 rounded-full text-xs">+</span> pour ajouter un cours à ce projet
                                                                        </p>
                                                                        
                                                                        {/* Animation de pulsation subtile */}
                                                                        <div className="mt-8 flex space-x-1">
                                                                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                                                                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                                                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Boutons de navigation modernisés */}
                                            <div className="flex justify-between items-center mt-6 gap-4">
                                                <button
                                                    onClick={prevStep}
                                                    className="group flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5"
                                                >
                                                    <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                    Revenir
                                                </button>

                                                <button
                                                    onClick={nextStep}
                                                    disabled={isLoading}
                                                    className="group relative bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl px-8 py-3 overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-purple-500 hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[200px]"
                                                >
                                                    {/* Face avant */}
                                                    <span className="group-hover:opacity-0 flex items-center justify-center gap-3 font-semibold text-sm tracking-wide transition-opacity duration-300">
                                                        Suivant
                                                        <FaArrowRight className="text-lg transform group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                    
                                                    {/* Face arrière */}
                                                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-sm font-semibold tracking-wide transition-opacity duration-300">
                                                        Sélectionner un dossier
                                                    </span>
                                                    
                                                    {/* Effet de brillance */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Alert de succès modernisée */}
                                {showAlertCours && (
                                    <div className="fixed top-4 right-4 z-50">
                                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-lg animate-slide-in-right">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span className="font-medium">Cours ajouté avec succès !</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    } else {
                        return (
                            <div className="flex flex-col w-full gap-6 mt-4">
                                {/* Header de section modernisé */}
                                <div className="text-center">
                                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl border-l-4 border-blue-400">
                                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                                        <h2 className="text-lg font-semibold text-blue-800">
                                            Configuration du lieu de formation
                                        </h2>
                                    </div>
                                    <p className="text-gray-600 mt-4 max-w-md mx-auto">
                                        Sélectionnez le lieu où se déroulera cette formation inter-entreprise
                                    </p>
                                </div>

                                {/* Card principale */}
                                <div className="max-w-lg mx-auto w-full">
                                    <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
                                        {/* Icône centrale */}
                                        <div className="text-center mb-6">
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Champ de sélection du lieu */}
                                        <div className="space-y-2">
                                            <label htmlFor="lieu" className="block text-sm font-medium text-gray-700">
                                                Lieu de formation *
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="lieu"
                                                    id="lieu"
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md appearance-none text-gray-700"
                                                >
                                                    <option value="" className="text-gray-500">Choisissez une ville...</option>
                                                    {tousVille?.villes
                                                    ?.filter(v => v.ville) 
                                                    .map((v) => (
                                                        <option key={v.idVille} value={v.ville} className="text-gray-700">
                                                        {v.ville}
                                                        </option>
                                                    ))}

                                                </select>
                                                {/* Flèche personnalisée */}
                                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Sélectionnez la ville où aura lieu la formation
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Boutons de navigation */}
                                <div className="flex justify-center gap-4 mt-8">
                                    <button
                                        onClick={prevStep}
                                        className="group flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Revenir
                                    </button>
                                    
                                    <button
                                        onClick={nextStep}
                                        disabled={isLoading}
                                        className="group relative bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl px-8 py-3 overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-purple-500 hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[200px]"
                                    >
                                        {/* Face avant */}
                                        <span className="group-hover:opacity-0 flex items-center justify-center gap-3 font-semibold text-sm tracking-wide transition-opacity duration-300">
                                            Suivant
                                            <FaArrowRight className="text-lg transform group-hover:translate-x-1 transition-transform" />
                                        </span>
                                        
                                        {/* Face arrière */}
                                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-sm font-semibold tracking-wide transition-opacity duration-300">
                                            Sélectionner un dossier
                                        </span>
                                        
                                        {/* Effet de brillance */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                    </button>
                                </div>
                            </div>
                        );
                    }
            case 5:
               return (
                    <div className="flex flex-col w-full gap-6">
                        {/* Alert d'information modernisée */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <FaInfoCircle className="text-white text-sm" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-blue-800 font-semibold text-sm mb-1">
                                        Organisation du projet
                                    </h4>
                                    <p className="text-blue-700 text-sm">
                                        Assignez ce projet à un dossier pour une meilleure organisation et un accès facilité dans le futur.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex min-w-[500px] w-full gap-6">
                            {/* Section Liste des dossiers */}
                            <div className="w-1/2">
                                {/* Header modernisé */}
                                <div className="flex items-center gap-3 mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-100 rounded-lg border-l-4 border-yellow-400">
                                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                                    <label className="text-yellow-800 font-semibold text-base">
                                        Dossiers disponibles
                                    </label>
                                    <div className="ml-auto bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                                        {Array.isArray(tousDossier?.dossiers) ? tousDossier.dossiers.length : 0} dossiers
                                    </div>
                                </div>
                                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 p-4">
                                    {/* Champ de recherche */}
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            id="main_search_cours"
                                            onChange={(e) => setSearchDossier(e.target.value)}
                                            placeholder="Rechercher un dossier..."
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md text-sm sm:text-base"
                                        />
                                    </div>
                                    
                                    {/* Bouton Nouveau dossier */}
                                    <button
                                        onClick={() => setShowInput(true)}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold whitespace-nowrap text-sm sm:text-base"
                                    >
                                        <FaFolder className="w-4 h-4" />
                                        <span className="hidden sm:inline">Nouveau dossier</span>
                                        <span className="sm:hidden">Nouveau</span>
                                    </button>
                                </div>

                                {/* Conteneur de la liste avec design modernisé */}
                                <div className="bg-white rounded-xl mt-2 border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="h-[35rem] overflow-y-auto">
                                        {/* Header du tableau modernisé */}
                                        <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-4 grid grid-cols-12 gap-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                            <div className="col-span-5">Dossier</div>
                                            <div className="col-span-2 text-center">Documents</div>
                                            <div className="col-span-2 text-center">Projets</div>
                                            <div className="col-span-3 text-center">Action</div>
                                        </div>

                                        {/* Liste des dossiers */}
                                        <div className="p-2 space-y-2">
                                            {showInput && (
                                              <div className="group bg-gradient-to-r from-white to-gray-50 hover:from-yellow-50 hover:to-white rounded-xl p-4 border border-gray-100 hover:border-yellow-200 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                                                    <div className="grid grid-cols-12 gap-4 items-center">
                                                        {/* Nom du dossier */}
                                                        <div className="col-span-5 flex items-center gap-3">
                                                            <div className="relative">
                                                                <FaFolder className="text-yellow-400 text-xl drop-shadow-sm" />
                                                                {/* Badge indicateur */}
                                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></div>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-semibold text-gray-800 group-hover:text-yellow-700 transition-colors">
                                                                    <input
                                                                        type="text"
                                                                        className="border p-1 rounded w-full"
                                                                        placeholder="Nom du nouveau dossier"
                                                                        value={newFolderName}
                                                                        onChange={(e) => setNewFolderName(e.target.value)}
                                                                        autoFocus
                                                                    />
                                                                </span>
                                                                <span className="text-xs text-gray-500 mt-0.5">
                                                                    Dossier de projet
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Statistiques */}
                                                        <div className="col-span-2 text-center">
                                                            <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                                                <span className="text-xs font-medium text-blue-700">
                                                                     0
                                                                </span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="col-span-2 text-center">
                                                            <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                                                                <span className="text-xs font-medium text-green-700">
                                                                     0
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Bouton d'action */}
                                                        <div className="col-span-3 flex justify-center">
                                                            <button
                                                                   onClick={async () => {
                                                                        if (!newFolderName.trim()) return; 
                                                                        try {
                                                                        const response = await axios.post("/cfp/projet/folder-first", {
                                                                            dossier: newFolderName,
                                                                        });
                            
                                                                        setFolders((prev) => [
                                                                            ...prev,
                                                                            {
                                                                            idDossier: response.data.idDossier,
                                                                            nom: newFolderName,
                                                                            },
                                                                        ]);
                            
                                                                        fecthProjet();
                            
                                                                        // Reset input
                                                                        setNewFolderName("");
                                                                        setShowInput(false);
                            
                                                                        } catch (error) {
                                                                        console.error("Erreur création dossier:", error.response?.data || error);
                                                                        }
                                                                    }}
                                                                className="group/btn relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 overflow-hidden"
                                                            >
                                                                <FaPlus className="relative z-10 text-sm" />
                                                                {/* Effet de brillance */}
                                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500"></div>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {[...filteredDossier, ...tousDossier?.dossiers].map(
                                              (d, i) => (
                                                <div key={i} className="group bg-gradient-to-r from-white to-gray-50 hover:from-yellow-50 hover:to-white rounded-xl p-4 border border-gray-100 hover:border-yellow-200 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                                                    <div className="grid grid-cols-12 gap-4 items-center">
                                                        {/* Nom du dossier */}
                                                        <div className="col-span-5 flex items-center gap-3">
                                                            <div className="relative">
                                                                <FaFolder className="text-yellow-400 text-xl drop-shadow-sm" />
                                                                {/* Badge indicateur */}
                                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></div>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-semibold text-gray-800 group-hover:text-yellow-700 transition-colors">
                                                                    {d.nomDossier}
                                                                </span>
                                                                <span className="text-xs text-gray-500 mt-0.5">
                                                                    Dossier de projet
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Statistiques */}
                                                        <div className="col-span-2 text-center">
                                                            <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                                                <span className="text-xs font-medium text-blue-700">
                                                                    {d.nombreDocument || 0}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="col-span-2 text-center">
                                                            <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                                                                <span className="text-xs font-medium text-green-700">
                                                                    {d.projet_count || 0}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Bouton d'action */}
                                                        <div className="col-span-3 flex justify-center">
                                                            <button
                                                                onClick={() => manageDossier("post", idProjet, d.idDossier)}
                                                                className="group/btn relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 overflow-hidden"
                                                            >
                                                                <FaPlus className="relative z-10 text-sm" />
                                                                {/* Effet de brillance */}
                                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500"></div>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                              )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section Dossier sélectionné */}
                            <div className="w-1/2">
                                {/* Header modernisé */}
                                <div className="flex items-center gap-3 mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg border-l-4 border-green-400">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                    <label className="text-green-700 font-semibold text-base">
                                        Dossier sélectionné
                                    </label>
                                </div>

                                {/* Zone de sélection */}
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="h-[35rem] p-4">
                                        {doc ? (
                                             <div className="group bg-gradient-to-r from-white to-gray-50 hover:from-yellow-50 hover:to-white rounded-xl p-4 border border-gray-100 hover:border-yellow-200 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                                                <div className="grid grid-cols-12 gap-4 items-center">
                                                    {/* Nom du dossier */}
                                                    <div className="col-span-5 flex items-center gap-3">
                                                        <div className="relative">
                                                            <FaFolder className="text-yellow-400 text-xl drop-shadow-sm" />
                                                            {/* Badge indicateur */}
                                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></div>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-gray-800 group-hover:text-yellow-700 transition-colors">
                                                                {doc?.name}
                                                            </span>
                                                            <span className="text-xs text-gray-500 mt-0.5">
                                                                Dossier de projet
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Statistiques */}
                                                    <div className="col-span-2 text-center">
                                                        <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                                            <span className="text-xs font-medium text-blue-700">
                                                                {doc?.document_count || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="col-span-2 text-center">
                                                        <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                                                            <span className="text-xs font-medium text-green-700">
                                                                {doc?.project_count || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* État vide */
                                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                                    <FaFolder className="text-4xl" />
                                                </div>
                                                <h3 className="text-lg font-medium mb-2 text-gray-600">Aucun dossier sélectionné</h3>
                                                <p className="text-sm text-center text-gray-500 max-w-xs mb-6">
                                                    Choisissez un dossier dans la liste de gauche pour organiser votre projet
                                                </p>
                                                
                                                {/* Animation de pulsation */}
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Boutons de navigation */}
                                <div className="flex justify-between items-center mt-6 gap-4">
                                    <button
                                        onClick={prevStep}
                                        className="group flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Revenir
                                    </button>

                                    <button
                                        onClick={nextStep}
                                        disabled={isLoading}
                                        className="group relative bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl px-8 py-3 overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-purple-500 hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[200px]"
                                    >
                                        {/* Face avant */}
                                        <span className="group-hover:opacity-0 flex items-center justify-center gap-3 font-semibold text-sm tracking-wide transition-opacity duration-300">
                                            Finaliser
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                        
                                        {/* Face arrière */}
                                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-sm font-semibold tracking-wide transition-opacity duration-300">
                                            Finaliser
                                        </span>
                                        
                                        {/* Effet de brillance */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Alert de succès modernisée */}
                        {showAlertDossier && (
                            <div className="fixed top-4 right-4 z-50">
                                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-lg animate-slide-in-right">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="font-medium">Dossier assigné avec succès !</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 6:
                return (
                    <div className="flex flex-col items-center w-full gap-4 mt-4">
                        <div className="flex flex-col w-full gap-1">
                            <label htmlFor="modalite" className="text-gray-600">Modalité</label>
                            <select
                                name="modalite"
                                id="modalite"
                                value={projectData.modalite}
                                onChange={handleModaliteChange}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 shadow-sm hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">Sélectionnez une modalité</option>
                                {Array.isArray(tousModalite?.modalites) && tousModalite.modalites.map((m, i) => (
                                    <option key={i}>{m.modalite}</option>
                                ))}

                            </select>

                        </div>

                        <div className="flex flex-col items-start w-full">
                            <p className="text-lg text-left text-gray-400">
                                Entre quel date vous voulez programmer ce projet ? Vous pouvez modifier
                                la date à l'avenir en fonction de votre disponibilité.
                            </p>
                        </div>
                        <div className="flex flex-col justify-start w-full gap-3">
                            <div className="inline-flex items-center gap-2">
                                <div className="flex flex-col w-full gap-1">
                                    <span className="inline-flex items-center w-full gap-2">
                                        <label htmlFor="dateDebut" className="text-slate-700 after:content-['*'] after:ml-0.5 after:text-red-500">
                                            Début du projet
                                        </label>
                                        <p className="text-sm italic text-slate-500">Ce champ est obligatoire !</p>
                                    </span>
                                    <input
                                        type="date"
                                        id="dateDebut"
                                        name="dateDebut"
                                        value={projectData.dateDebut}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 shadow-sm hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        required
                                    />

                                </div>
                                <div className="flex flex-col w-full gap-1">
                                    <span className="inline-flex items-center w-full gap-2">
                                        <label htmlFor="dateFin" className="text-slate-700">Fin du projet</label>
                                    </span>
                                    <input
                                        type="date"
                                        id="dateFin"
                                        name="dateFin"
                                        value={projectData.dateFin}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 shadow-sm hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                         <div className="inline-flex items-center justify-end w-full gap-4 mt-3">
                            <button
                                onClick={prevStep}
                                className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                Revenir
                            </button>
                            
                            {showAlertProjet && <SuccessAlert message="✔ Projet crée avec succès !" />}
                            
                            <button
                                onClick={() => updateDateProjet("patch", idProjet)}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg flex items-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border border-purple-500 hover:border-purple-400"
                            >
                                <FaBookmark className="text-lg" />
                                <span>Terminé</span>
                                
                                {/* Effet de brillance au survol */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out rounded-lg"></div>
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const renderModuleSelection = () => {
       return (
                 <div id="step-3" className="tab-pane !visible" role="tabpanel" aria-labelledby="step-3" style={{ display: "block" }}>
                    <div className="flex flex-col w-full gap-6">
                        <div className="flex min-w-[500px] overflow-x-auto w-full gap-6">
                            {/* Section Liste des cours */}
                            <div className="flex flex-col w-1/2">
                                {/* Header modernisé */}
                                <div className="flex items-center gap-3 mb-4 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border-l-4 border-red-400">
                                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                                    <label className="text-red-700 font-semibold text-base">
                                        Liste de tous les cours
                                    </label>
                                    <div className="ml-auto bg-red-200 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                                        {cours.modules?.length || 0} cours
                                    </div>
                                </div>

                                {/* Barre de recherche améliorée */}
                                <div className="relative mb-4">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="main_search_cours"
                                        onChange={(e) =>
                                          setSearchCours(e.target.value)
                                        }
                                        placeholder="Rechercher un cours..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                                    />
                                </div>

                                {/* Liste des cours avec design modernisé */}
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="h-[35rem] overflow-y-auto p-2">
                                        <ul className="space-y-3">
                                            {[...filteredCours, ...cours?.modules].map(
                                              (m, i) => (
                                                <li
                                                    key={i}
                                                    className="group bg-gradient-to-r from-white to-gray-50 hover:from-red-50 hover:to-white rounded-xl p-4 border border-gray-100 hover:border-red-200 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4 flex-1">
                                                            {/* Image du module avec effet */}
                                                            <div className="relative">
                                                                <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md ring-2 ring-gray-100 group-hover:ring-red-200 transition-all duration-300">
                                                                    <img 
                                                                        src={`${IMAGE_URL}/img/modules/${m.module_image}`} 
                                                                        alt={m.module_name}
                                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                    />
                                                                </div>
                                                                {/* Badge de statut */}
                                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white rounded-full"></div>
                                                            </div>
                                                            
                                                            {/* Informations du cours */}
                                                            <div className="flex flex-col flex-1">
                                                                <h3 className="font-semibold text-gray-800 text-sm capitalize group-hover:text-red-700 transition-colors line-clamp-2">
                                                                    {m.module_name}
                                                                </h3>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                        Module
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Bouton d'ajout modernisé */}
                                                        <button
                                                            onClick={() => manageCours("patch", idProjet, m.idModule)}
                                                            className="group/btn relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 overflow-hidden"
                                                        >
                                                            <FaPlus className="relative z-10 text-sm" />
                                                            {/* Effet de brillance */}
                                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500"></div>
                                                        </button>
                                                    </div>
                                                </li>
                                               )
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Section Cours sélectionné */}
                            <div className="flex flex-col w-1/2">
                                {/* Header avec indicateur visuel */}
                                <div className="flex items-center gap-3 mb-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-4 border-green-400">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                    <label className="text-green-700 font-semibold text-base">
                                        Cours sélectionnés pour ce projet
                                    </label>
                                </div>

                                {/* Zone de sélection */}
                                <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="p-4 h-[35rem] overflow-y-auto">
                                        {mdl?.module ? (
                                                <div className="space-y-3">
                                                    <div className="bg-gradient-to-r from-green-50 to-white rounded-xl p-4 border border-green-200 shadow-sm">
                                                    <div className="flex items-center gap-4">
                                                        {/* Avatar avec effet de succès */}
                                                        <div className="relative">
                                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-inner">
                                                            <img 
                                                                    src={`${IMAGE_URL}/img/modules/${mdl?.module.module_image}`} 
                                                                    alt={mdl?.module.module_name}
                                                                    className="w-full h-full object-cover rounded-xl"
                                                                />
                                                        </div>
                                                        {/* Icône de validation */}
                                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                        </div>

                                                        {/* Informations entreprise sélectionnée */}
                                                        <div className="flex flex-col">
                                                        <h3 className="font-bold text-green-800 text-sm tracking-wide">
                                                            {mdl?.module.module_name}
                                                        </h3>
                                                        <p className="text-xs text-green-600 mt-1">
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                        Module
                                                            </span>
                                                        </p>
                                                        </div>
                                                    </div>
                                                    </div>
                                                </div>   
                                        ):(
                                                <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                                    <div className="p-4 h-[35rem] overflow-y-auto">
                                                        {/* État vide avec design attrayant */}
                                                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                                            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                                </svg>
                                                            </div>
                                                            <h3 className="text-lg font-medium mb-2 text-gray-600">Aucun cours sélectionné</h3>
                                                            <p className="text-sm text-center text-gray-500 max-w-xs">
                                                                Cliquez sur le bouton <span className="inline-flex items-center mx-1 w-5 h-5 bg-green-100 text-green-600 rounded-full text-xs">+</span> pour ajouter un cours à ce projet
                                                            </p>
                                                            
                                                            {/* Animation de pulsation subtile */}
                                                            <div className="mt-8 flex space-x-1">
                                                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                                                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                        )}
                                    </div>
                                </div>

                                {/* Boutons de navigation modernisés */}
                                <div className="flex justify-between items-center mt-6 gap-4">
                                    <button
                                        onClick={prevStep}
                                        className="group flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Revenir
                                    </button>

                                    <button
                                        onClick={nextStep}
                                        disabled={isLoading}
                                        className="group relative bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl px-8 py-3 overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-purple-500 hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[200px]"
                                    >
                                        {/* Face avant */}
                                        <span className="group-hover:opacity-0 flex items-center justify-center gap-3 font-semibold text-sm tracking-wide transition-opacity duration-300">
                                            Suivant
                                            <FaArrowRight className="text-lg transform group-hover:translate-x-1 transition-transform" />
                                        </span>
                                        
                                        {/* Face arrière */}
                                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-sm font-semibold tracking-wide transition-opacity duration-300">
                                            Sélectionnez un bon de commande
                                        </span>
                                        
                                        {/* Effet de brillance */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alert de succès modernisée */}
                    {showAlertCours && (
                        <div className="fixed top-4 right-4 z-50">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-lg animate-slide-in-right">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">Cours ajouté avec succès !</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
        );
    };


    return (
        <>
            {showNotification && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[500] animate-in slide-in-from-top-4 duration-300">
                    <div className={`
                    relative max-w-md w-full mx-auto
                    ${config.bg} ${config.border} border-2
                    rounded-xl shadow-lg backdrop-blur-sm
                    overflow-hidden
                    `}>
                    {/* Barre de progression */}
                    <div className="absolute top-0 left-0 h-1 w-full bg-gray-200">
                        <div 
                        className={`h-full ${config.progressBar} animate-progress`}
                        style={{
                            animation: 'progress 4s linear forwards'
                        }}
                        />
                    </div>
    
                    {/* Contenu */}
                    <div className="p-4 flex items-start space-x-3">
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
                    {(notification.type === 'error' || notification.type === 'warning') && (
                        <div className="absolute inset-0 pointer-events-none">
                        <div className={`absolute inset-0 ${config.border} border-2 rounded-xl animate-ping opacity-20`} />
                        </div>
                    )}
                    </div>
                </div>
                )}
                <style jsx>{`
            @keyframes progress {
                from { width: 100%; }
                to { width: 0%; }
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
            <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full max-w-7xl overflow-y-auto bg-white shadow-2xl" >
                        <div className="flex flex-col w-full h-full">
                                <div className="sticky top-0 z-10 flex items-center justify-between w-full px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
                                    <h2 className="text-sm font-semibold text-gray-700">Créer un nouveau projet</h2>
                                    <button 
                                        onClick={() => setShowPage(false)} 
                                        className="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-600"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="w-full h-full bg-white min-h-screen">
                                    <div className="h-full p-6">
                                        <div className="w-full max-w-6xl mx-auto">
                                        <div id="erreurProjet" className="mb-4"></div>

                                        {/* Tabs pour type de projet */}
                                        <div className="mb-4">
                                            <div role="tablist" className="flex gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-lg max-w-fit mx-auto">
                                            <button
                                                type="button"
                                                role="tab"
                                                className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                                                projectType === 'intra'
                                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                                aria-selected={projectType === 'intra'}
                                                    onClick={() => {
                                                    setProjectType('intra');
                                                    setProjectData((prev) => ({ ...prev, idTypeProjet: 1 }));
                                                    }}
                                            >
                                                Projet Intra
                                            </button>
                                            <button
                                                type="button"
                                                role="tab"
                                                className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                                                projectType === 'inter'
                                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                                aria-selected={projectType === 'inter'}
                                                onClick={() => {
                                                    setProjectType("inter");
                                                    setProjectData((prev) => {
                                                        const updated = { ...prev, idTypeProjet: 2 };
                                                        return updated;
                                                    });
                                                }}
                                            >
                                                Projet Inter
                                            </button>
                                            </div>
                                        </div>

                                        {/* Stepper moderne */}
                                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 mb-8">
                                            <div className="relative">
                                            {/* Ligne de progression */}
                                            <div className="absolute top-12 left-0 w-full h-1 bg-gray-200 rounded-full">
                                                <div 
                                                className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                                                />
                                            </div>

                                            {/* Steps */}
                                            <div className="flex justify-between items-center relative z-10">
                                                {[1, 2, 3, 4, 5, 6].map((step, index) => {
                                                const isActive = currentStep === step;
                                                const isCompleted = currentStep > step;
                                                const isClickable = currentStep > step;

                                                return (
                                                    <div key={step} className="flex flex-col items-center">
                                                    {/* Cercle de l'étape */}
                                                    <button
                                                        className={`w-24 h-24 rounded-full flex items-center justify-center font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                                                        isCompleted
                                                            ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-white shadow-lg'
                                                            : isActive
                                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg animate-pulse'
                                                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                                                        }`}
                                                        onClick={() => isClickable && setCurrentStep(step)}
                                                        disabled={!isClickable && !isActive}
                                                    >
                                                        {isCompleted ? (
                                                        <Check className="w-8 h-8" />
                                                        ) : (
                                                        <span>{step}</span>
                                                        )}
                                                    </button>

                                                    {/* Label de l'étape */}
                                                    <div className="mt-4 text-center">
                                                        <div className={`font-medium text-sm ${
                                                        isActive ? 'text-purple-600' : isCompleted ? 'text-teal-600' : 'text-gray-500'
                                                        }`}>
                                                        Step {step}
                                                        </div>
                                                        <div className={`text-xs mt-1 max-w-20 ${
                                                        isActive ? 'text-purple-500' : isCompleted ? 'text-teal-500' : 'text-gray-400'
                                                        }`}>
                                                        {getStepLabel(step, projectType)}
                                                        </div>
                                                    </div>
                                                    </div>
                                                );
                                                })}
                                            </div>
                                            </div>
                                        </div>

                                        {/* Contenu de l'étape */}
                                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl min-h-80">
                                            {renderStepContent()}
                                        </div>                                                  
                                        </div>
                                    </div>
                                    </div>
                        </div>
                    </div>
              </div>  
        </>     
    );
};

  const getStepLabel = (step, projectType) => {
    if (step === 1) return 'Nouveau';
    if (step === 2) return projectType === 'intra' ? 'Entreprise' : 'Cours';
    if (step === 3) return 'Bon de commande';
    if (step === 4) return projectType === 'intra' ? 'Cours' : 'Lieu';
    if (step === 5) return 'Dossier';
    if (step === 6) return 'Date';
    return '';
  };

export default ProjectCreation;  