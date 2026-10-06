import { useState, useEffect, useRef } from 'react';
import { 
  FaUser,  FaPlus, 
  FaXmark,  FaChalkboard, 
  FaBullseye, FaBoxOpen, FaMinus 
} from "react-icons/fa6";
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import axios from '../../../config/axios';
import LoadingSpinner from '../../../components/ui/loading-spinner';
import { AlertCircle, Award, Banknote, Calendar, CheckCircle, ChevronDown, Clock, CreditCard, DollarSign, Edit3, EyeIcon, GraduationCap, MapPin, Minus, Percent, Plus, Receipt, Search, Star, TrendingUp, UserPlus, Users, Wallet, X, XCircle } from 'lucide-react';
import { API_URL, IMAGE_URL } from "../../../config/env";


const ProjetDetailEtp = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [projet, setProjets] = useState([]);
  const [idEtp, setIdEtp] = useState([]);
  const [activeTab, setActiveTab] = useState('vue-ensemble');
  const [apprProjet, setApprProjet] = useState({ apprenants: [], entreprise: [] });
  const [apprAjoute, setApprAjoute] = useState([]);
  const [showAprenant,  setShowAprenant] = useState(false);
  const [showPageApprenant,  setShowPageApprenant] = useState(false);
  const [showPageDetailFormateur,  setShowPageDetailFormateur] = useState(false);
  const [showPageFinancier,  setShowPageFinancier] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [salle, setSalle] = useState([]);
  const [cvForm, setCvForm] = useState([]);
  const [formateurIntern, setformateurIntern] = useState({ forms: [] });
  const [idModule, setIdModule] = useState(null);
  const [tousFrais, setTousFrais] = useState({ frais: [] });
  const [FraisAjoute, setFraisAjoute] = useState([]);
  const [program, setTousProgrm] = useState([]);
  const [fraisValues, setFraisValues] = useState({});
  const [frais, setFrais] = useState(null);
  const apprRef = useRef(null);
  const [selectedFinancement, setSelectedFinancement] = useState(2);
  const [selectedTVA, setSelectedTVA] = useState(20);

   const calculerDuree = (heureDebut, heureFin) => {
    const [h1, m1] = heureDebut.split(':').map(Number);
    const [h2, m2] = heureFin.split(':').map(Number);
    const totalMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    return `${Math.floor(totalMinutes / 60)}h${(totalMinutes % 60).toString().padStart(2, '0')}`;
  };


  const getTotalDuration = (seances) => {
    if (!Array.isArray(seances) || seances.length === 0) return "0h";

    let totalMinutes = 0;

    seances.forEach((s) => {
      if (s.start && s.end) {
        const start = new Date(s.start);
        const end = new Date(s.end);
        totalMinutes += (end - start) / (1000 * 60); // durée en minutes
      }
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60); // arrondir pour éviter les floats

    return minutes === 0 ? `${hours}h` : `${hours}h${minutes}m`;
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


  const fetchProjectDetails = async (id, showLoading = true) => {

    if (showLoading) setLoading(true);

    try {
      // 1. Récupération du projet
      const response = await axios.get(`${API_URL}/etp/projets/${id}`);

      const data = await response.data;

      console.log("Données du projet:", data);
  
      setProjets(data);


      const idEtp = data?.projet?.idEtp ?? null;
      setIdEtp(idEtp);
      console.log("idEtp:", idEtp);

      const idModule = data?.projet?.idModule ?? null;
      setIdModule(idModule);
      console.log("idModule:", idModule);


      
      // recuperation apprenant projet

      const apprProjet = await axios.get(`${API_URL}/etp/projet/apprenants`);
  
      const appr = await apprProjet.data;
      console.log("appr projet:", appr);
  
      
  
      setApprProjet(appr);


      const ProgramRes = await axios.get(`${API_URL}/etp/projets/${idModule}/programmes`);
  
      console.log("program:", ProgramRes.data);

      setTousProgrm(ProgramRes.data);


      // apprenant ajoute dans cette projet 

     const apprAjoute = await axios.get(`${API_URL}/etp/projet/apprenants/${id}`);
  
      const apprAjouteData = await apprAjoute.data;
      console.log("appr ajoute dans cette projet:", apprAjouteData);
  
      setApprAjoute(apprAjouteData);

      // salle ajoute 

      const salle = await axios.get(`${API_URL}/etp/projets/${id}/salles`);
  
      const salleData = await salle.data;
      console.log("salle ajoute dans cette projet:", salleData);
      setSalle(salleData);


      
      try {
          if (!id) return;

          const response = await axios.get(
            `${API_URL}/etp/projets/${id}/formateurs`
          );

          // Si tout va bien, récupère les données
          const formateurInternData = response.data.forms || [];
          console.log("Formateurs dans ce projet :", formateurInternData);
          setformateurIntern(formateurInternData);

        } catch (error) {
          // Si la requête retourne 404 (aucun formateur), on met un tableau vide
          if (error.response?.status === 404) {
            console.warn("Aucun formateur trouvé pour ce projet.");
            setformateurIntern([]);
          } else {
            console.error("Erreur lors du chargement des formateurs :", error);
            setformateurIntern([]);
          }
        }

      
    } catch (error) {
      console.error("Détails de l'erreur :", error);
      setLoading(false);
      setError("Impossible de charger le projet. Veuillez réessayer.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const fetchFraisProjet = async () => {
       try {
          const [  fraisRes ] = await Promise.all([
                axios.get(`${API_URL}/etp/projets/frais/all`),
          ]);
    
          setTousFrais(fraisRes.data || []);
  
          
        } catch (error) {
          console.error("Erreur lors du chargement des salles :", error);
        }
  }
  
  const setting = JSON.parse(sessionStorage.getItem("setting"));

  const filteredMateriels = projet?.project_has?.materiels.filter(m => m.idModule === idModule);

  const filteredObjectifs = projet?.project_has?.objectifs.filter(o => o.idModule === idModule);

  const loadFormateurCv = async (idFormateur) => {

    const formCv = await axios.get(`${API_URL}/etp/projets/formateur/${idFormateur}/mini-cv`);

    const formCvRes = await formCv.data;  
    setCvForm(formCvRes);

  }

  const manageAppr = async (method, id, idEmploye) => {
  
  
    if (method === "delete") {
      try {

        const response = await axios.delete(`${API_URL}/etp/projet/apprenants/${id}/${idEmploye}`);
  
        await fetchProjectDetails(id, false);

        setLoading(false);


        console.log("apprenant supprimé avec succès");
      } catch (error) {
        console.error("Erreur suppression apprenant:", error);
      }
    }

    if (method === "post") {
      try {
        const response = await axios.post(
          `${API_URL}/etp/projet/apprenants/${id}/${idEmploye}`
        );
  
        await fetchProjectDetails(id, false);

        setLoading(false);

     
       
        console.log("apprenant ajouté avec succès");
      } catch (error) {
        console.error("Erreur de l'ajout de  apprenant:", error);
      }
    }
  };

 const DeleteSeance = async (method, idSeance) => {
          if (method === "delete") {
              try {
                  const response = await axios.delete(
                      `${API_URL}/cfp/seances/${idSeance}`
                  );
  
                  if (response.status != 200) {
                      throw new Error("Erreur lors de supression ");
                  }
  
                  await fetchProjectDetails(id);
  
                  console.log("seance suprimer avec succès");
              } catch (error) {
                  console.error("Erreur de la supression:", error);
              }
          }
 };

 const manageFrais = async (method, id, idFrais, idEtp) => {


    if (method === "post") {
        try {
            const response = await axios.post(
                `${API_URL}/cfp/projets/${id}/${idFrais}/${idEtp}/fraisprojet/assign`
            );

            if (response.status != 200) {
                throw new Error("Erreur lors de l'ajout ");
            }

            await fetchProjectDetails(id, false);

            console.log("frais ajouté avec succès");
        } catch (error) {
            console.error("Erreur de l'ajout de frais:", error);
        }
    }
 };

const updatetaxe = async (method, id) => {

    if (method === "post") {
        try {
            const response = await axios.post(
                `${API_URL}/cfp/projets/${id}/update-taxe`
            );

            if (response.status != 200) {
                throw new Error("Erreur lors de l'ajout de taxe ");
            }

            await fetchProjectDetails(id, false);

            console.log("taxe ajoute avec succès");
        } catch (error) {
            console.error("Erreur de l'ajout de taxe :", error);
        }
    }
}

const updateFrais = async (idFraisProjet, field, value, id) => {
    try {
        setLoading(true);
        const current = fraisValues[idFraisProjet] || {};
        const data = {
            idFraisProjet,
            montant: field === "montant" ? value : current.montant,
            description: field === "description" ? value : current.description || "",
        };

        await axios.post(
            `/cfp/projets/update-frais`,
            data,
        );

        console.log("frais mise a jour effectue");

    } catch (error) {
        console.error("Erreur lors de la mise à jour du frais :", error);
    } finally {
        setLoading(false);
    }
};

const fraisRemove = async (method, id, idFraisProjet) => {

    if (method === "delete") {
        try {
            const response = await  axios.delete(
                `${API_URL}/cfp/projets/${id}/${idEtp}/removeEtpFraisProjet`,
            );

            if (response.status != 200) {
                throw new Error("Erreur lors de l'ajout ");
            }

            await fetchProjectDetails(id, false);

            console.log("frais suprimer avec succès");
        } catch (error) {
            console.error("Erreur de supression de frais:", error);
        }
    }
};

const handleFieldChange = (idFraisProjet, field, value) => {
    setFraisValues((prev) => ({
        ...prev,
        [idFraisProjet]: {
            ...prev[idFraisProjet],
            [field]: value,
        },
    }));

    clearTimeout(window[`timeout_${idFraisProjet}_${field}`]);
    window[`timeout_${idFraisProjet}_${field}`] = setTimeout(() => {
        updateFrais(idFraisProjet, field, value);
    }, 800);
};

const totalMontant = FraisAjoute.fraisdetails?.reduce((acc, frais) => {
    const montant = parseFloat(frais.montant) || 0;
    return acc + montant;
}, 0);


const manageApprenant = async (apprenant, id) => {
    try {

        const response = await axios.post(`${API_URL}/cfp/projet/apprenants/${id}/${apprenant.id}`);

        const result = response.data;

        if (response.status != 200) {
            // Erreur HTTP (ex: 409 ou 500)
            console.error("Erreur HTTP :", result.error || result);
            alert("Erreur : " + (result.error || "Une erreur est survenue."));
            return;
        }

        if (result.error) {
            // Erreur logique côté serveur (même si HTTP = 200)
            console.warn("Erreur logique :", result.error);
            alert("Erreur : " + result.error);
        } else if (result.success) {
            // Succès logique
            console.log("Ajout réussi :", result.success);
            alert("Apprenant ajouté !");
        } else {

            console.warn("Réponse inattendue :", result);
            alert("Une réponse inattendue a été reçue.");
        }

    } catch (error) {
        console.error("Erreur réseau :", error);
        alert("Erreur réseau : impossible de contacter le serveur.");
    }
};

  const getStatusColor = (status) => {
        const colors = {
            "En préparation": "bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 animate-pulse",
            "En cours": "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-pulse",
            "Terminé": "bg-gradient-to-r from-green-400 via-green-500 to-green-600 animate-pulse",
            "Planifié": "bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 animate-pulse",
            "Cloturé": "bg-gradient-to-r from-red-800 via-red-700 to-red-900 animate-pulse",
        };
        return colors[status] || "bg-gray-500 animate-pulse";
  };

     const getFinancementIcon = (type) => {
      switch (type?.toLowerCase()) {
        case 'entreprise':
          return <CreditCard className="w-5 h-5 text-blue-600" />;
        case 'cpf':
          return <Banknote className="w-5 h-5 text-green-600" />;
        case 'pole emploi':
          return <Receipt className="w-5 h-5 text-orange-600" />;
        default:
          return <DollarSign className="w-5 h-5 text-purple-600" />;
      }
     };
  
    const getFinancementColor = (type) => {
      switch (type?.toLowerCase()) {
        case 'entreprise':
          return 'from-blue-50 to-blue-100 border-blue-200';
        case 'cpf':
          return 'from-green-50 to-green-100 border-green-200';
        case 'pole emploi':
          return 'from-orange-50 to-orange-100 border-orange-200';
        default:
          return 'from-purple-50 to-purple-100 border-purple-200';
      }
    };

    const getPresenceColor = (presence) => {
    switch (presence) {
      case 'present': return 'bg-green-500';
      case 'partial': return 'bg-yellow-500';
      case 'absent': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPresenceIcon = (presence) => {
    switch (presence) {
      case 'present': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'partial': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'absent': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };
  
  useEffect(() => {
    fetchProjectDetails(id);
    fetchFraisProjet();
  }, [id]);
  
   useEffect(() => {
          const handleClickOutside = (event) => {
              if (apprRef.current && !apprRef.current.contains(event.target)) {
              setShowAprenant(false);
              }
          };
  
          document.addEventListener('mousedown', handleClickOutside);
  
          return () => {
              document.removeEventListener('mousedown', handleClickOutside);
          };
    }, []);
  
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <LoadingSpinner></LoadingSpinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-10">
        {error}
        <button 
          onClick={() => window.location.reload()} 
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Vérification supplémentaire avant le rendu
  if (!projet || !projet.projet) {
    return (
      <div className="text-center py-10">
         <p className="text-red-500">Aucune donnée de projet disponible</p>
      </div>
    );
  }

  return (
    <>
    <div className="w-full min-h-screen mt-15 mb-20">
        <div className="w-full h-full">
                  {/* En-tête du projet */}
                   <div className="bg-white overflow-hidden">
                          <div className="flex p-6 mb-8">
                              {/* Section principale - 70% */}
                              <div className="w-[70%] pr-6">
                                  <div className="flex gap-4">
                                      {/* Informations du projet */}
                                      <div className="pl-6 flex flex-col justify-start flex-1 space-y-4">
                                          {/* Titre et références */}
                                          <div className="space-y-2">
                                              <h2 className="text-xl font-bold text-gray-900">
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

                                         <div className="flex items-center gap-3">
                                          <div className="flex items-center gap-1">
                                          </div>
                                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-full border border-amber-200/50 shadow-sm">
                                              <span className="font-bold text-sm bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                                                {parseFloat(projet.project_has.noteGeneral).toFixed(1)}
                                              </span>
                                              <span className="text-amber-400 text-xs">★</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                  <path
                                                    fillRule="evenodd"
                                                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                    clipRule="evenodd"
                                                  />
                                                </svg>
                                                <span className="font-medium">{projet.project_has.countNotationProjet}</span>
                                            </div>
                                        </div>

                                          {/* Dates */}
                                          <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
                                              <div className="flex items-center gap-2">
                                                  <span className="font-medium text-gray-700">Début :</span>
                                                  <span className="px-3 py-1 bg-white rounded-md shadow-sm text-gray-800 capitalize">
                                                      {projet.projet.dateDebut ?
                                                          new Date(projet.projet.dateDebut).toLocaleDateString("fr-FR", {
                                                              day: "numeric",
                                                              month: "long",
                                                              year: "numeric",
                                                          }) :
                                                          'Non définie'}
                                                  </span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                  <span className="font-medium text-gray-700">Fin :</span>
                                                  <span className="px-3 py-1 bg-white rounded-md shadow-sm text-gray-800 capitalize">
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
                                              <span className="px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-sm font-medium">
                                                  {projet.projet.project_type || 'Type non spécifié'}
                                              </span>
                                              <span className="px-4 py-2 bg-cyan-50 border border-cyan-200 text-cyan-700 rounded-full text-sm font-medium">
                                                  {projet.projet.modalite || 'Modalité non spécifiée'}
                                              </span>
                                               <span 
                                                className={`px-3 py-2 text-sm h-max text-white w-max rounded-xl ${getStatusColor(projet.projet.project_status)}`} 
                                                title="Le projet de formation est en cours de préparation, avec des détails tels que le programme, les supports de formation, et la logistique en cours de finalisation."
                                               >
                                                {projet.projet.project_status}
                                              </span>
                                          </div>

                                          {/* Description */}
                                          <div className="mt-4">
                                              <p className="text-gray-700 leading-relaxed line-clamp-3">
                                                  {projet.projet.project_description || 'Aucune description disponible'}
                                              </p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                  </div>

                    {/* Onglets */}
                  <div role="tablist" className="w-full p-6 tabs tabs-bordered lg:tabs-lg">
                              {/* Onglet 1 - Vue d'ensemble */}
                               <div className="flex gap-2 mb-4">
                                  <button
                                      onClick={() => setActiveTab('vue-ensemble')}
                                      className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === 'vue-ensemble' ? 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 ' : 'text-gray-600 hover:bg-gray-100'}`}
                                  >
                                      Vue d'ensemble
                                  </button>
                                  <button
                                      onClick={() => setActiveTab('detail-formation')}
                                      className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === 'detail-formation' ? 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 ' : 'text-gray-600 hover:bg-gray-100'}`}
                                  >
                                      Détail de la formation
                                  </button>
                              </div>

                               <div role="tabpanel" className="tab-content">
                                    {activeTab === 'vue-ensemble' && (
                                              <div className="flex w-full">
                                                  <div className="w-[60%]">
                                                        {/* apprenant */}
                                                        <div className="w-full max-w-6xl mx-auto p-4">
                                                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                                              <h2 className="bg-gradient-to-r from-blue-50 to-indigo-50 px-2 py-1">
                                                                  <span className="collapsed w-full inline-flex !rounded-xl items-center justify-between">
                                                                  <button 
                                                                    type="button" 
                                                                    className="w-full p-4 text-left group hover:underline underline-offset-4 flex gap-1 items-center text-sm"
                                                                  >
                                                                        <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                                                                            <Users className="w-5 h-5 text-blue-600" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="flex items-center gap-2">
                                                                            <h2 className="text-xl font-semibold text-gray-800">
                                                                                {projet.project_has.getAppr.length || 0 } Apprenants
                                                                            </h2>
                                                                            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                                                                                Actifs
                                                                            </span>
                                                                            </div>
                                                                            <p className="text-sm text-gray-600">Gérez vos participants à la formation</p>
                                                                        </div>
                                                                  </button>
                                                                  <div className="flex justify-end flex-1 pr-4 mt-2">
                                                                    <div className="relative z-2 inline-block" ref={apprRef}>
                                                                        <button tabIndex="1" onClick={() => setShowAprenant(prev => !prev)} role="button" className="flex items-center gap-2 px-4 py-2 border-2 border-gray-700 text-gray-700 rounded-xl hover:bg-blue-700 hover:text-white transition-colors duration-200 shadow-sm hover:shadow-md" >
                                                                            <Edit3 className="w-4 h-4" />
                                                                          <span className="text-sm font-medium">Éditer</span>
                                                                          <ChevronDown className="w-4 h-4" />
                                                                        </button>
                                                                        {showAprenant && (
                                                                          <ul tabIndex="1" className="absolute top-full right-0 mt-2 bg-white rounded-md z-10 w-max p-4 shadow">
                                                                              <li>
                                                                                  <button  onClick={() => setShowPageApprenant(true)} className="cursor-pointer flex items-center gap-1 text-[13px] mt-1">
                                                                                    <FaUser></FaUser>
                                                                                    Ajouter des apprenants
                                                                                  </button>
                                                                                      {/* Modal Ajouter Apprenants */}
                                                                                      {showPageApprenant && (
                                                                                        <div className="fixed inset-0 z-50">
                                                                                          <div
                                                                                            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                                                                                            onClick={() => setShowPageApprenant(false)}
                                                                                          />
                                                                                          <div className="absolute right-0 top-0 h-full w-full max-w-6xl bg-white shadow-2xl">
                                                                                            {/* Header */}
                                                                                            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50">
                                                                                              <h2 className="text-xl font-semibold text-gray-800">
                                                                                                Ajouter des apprenants
                                                                                              </h2>
                                                                                              <button
                                                                                                onClick={() => setShowPageApprenant(false)}
                                                                                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                                                                                              >
                                                                                                <X className="w-5 h-5" />
                                                                                              </button>
                                                                                            </div>
                                                                
                                                                                            {/* Content */}
                                                                                            <div className="flex h-[calc(100vh-80px)]">
                                                                                              {/* Left Panel - All Employees */}
                                                                                              <div className="w-1/2 border-r border-gray-200">
                                                                                                <div className="p-4 bg-gray-50 border-b">
                                                                                                  <div className="flex items-center gap-2 mb-4">
                                                                                                    <div className="w-1 h-6 bg-red-400 rounded"></div>
                                                                                                    <h3 className="text-lg font-medium text-gray-700">
                                                                                                      Tous les employés
                                                                                                    </h3>
                                                                                                  </div>
                                                                
                                                                                                  <div className="space-y-3">
                                                                                                    <div className="relative">
                                                                                                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                                                                      <input
                                                                                                        type="text"
                                                                                                        placeholder="Chercher un apprenant"
                                                                                                        
                                                                                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                                                                      />
                                                                                                    </div>
                                                                
                                                                                                    <select
                                                                                                      
                                                                                                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                                                                    >
                                                                                                      <option value="">
                                                                                                        Sélectionner une entreprise
                                                                                                      </option>
                                                                                                      {apprProjet?.getEtps?.map((etp, index) => (
                                                                                                        <option key={index} value={etp.id}>
                                                                                                          {etp.etp_name}
                                                                                                        </option>
                                                                                                      ))}
                                                                                                    </select>
                                                                                                  </div>
                                                                                                </div>
                                                                
                                                                                                <div className="p-4 h-full max-h-[550px] overflow-y-auto overflow-x-auto space-y-3">
                                                                                                  {loading ? (
                                                                                                    <div className="flex justify-center items-center py-8">
                                                                                                        <div className="text-center py-8 text-gray-500">Chargement en cours...</div>
                                                                                                    </div>
                                                                                                  ) : (
                                                                                                    apprProjet?.apprenants && apprProjet?.apprenants.length > 0 ? (
                                                                                                      apprProjet?.apprenants.map((apprenant, index) => (
                                                                                                    <div
                                                                                                      key={index}
                                                                                                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors duration-200"
                                                                                                    >
                                                                                                      <div className="flex items-center gap-3">
                                                                                                        <div className="w-12 h-12 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                                                                                                              <div className="w-12 h-12 rounded-full overflow-hidden">
                                                                                                              {apprenant.emp_photo ? (
                                                                                                                <img
                                                                                                                  src={`${IMAGE_URL}/img/employes/${apprenant.emp_photo}`}
                                                                                                                  alt={apprenant.emp_name}
                                                                                                                  className="w-full h-full object-cover"
                                                                                                                />
                                                                                                              ) : (
                                                                                                                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold text-lg uppercase">
                                                                                                                  {apprenant.emp_initial_name}
                                                                                                                </div>
                                                                                                              )}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                          <p className="font-semibold text-gray-800 uppercase">
                                                                                                            {apprenant.emp_name}
                                                                                                          </p>
                                                                                                          <p className="text-sm text-gray-600 capitalize">
                                                                                                            {apprenant.emp_firstname}
                                                                                                          </p>
                                                                                                        </div>
                                                                                                      </div>
                                                                
                                                                                                      <button
                                                                                                        onClick={() =>
                                                                                                          manageAppr(
                                                                                                            "post",
                                                                                                            id,
                                                                                                            apprenant.idEmploye
                                                                                                          )
                                                                                                        }
                                                                                                        className="p-2 bg-green-100 hover:bg-green-200 rounded-full transition-colors duration-200"
                                                                                                      >
                                                                                                        <Plus className="w-4 h-4 text-green-600" />
                                                                                                      </button>
                                                                                                    </div>
                                                                                                    ))
                                                                                                  ) : (
                                                                                                    <div className="text-center text-gray-500 px-4 py-4">Aucun apprenant trouvé.</div>
                                                                                                  )

                                                                                              )}

                                                                
                                                                                                </div>
                                                                                              </div>
                                                                
                                                                                              {/* Right Panel - Selected Employees */}
                                                                                              <div className="w-1/2">
                                                                                                <div className="p-4 bg-gray-50 border-b">
                                                                                                  <div className="flex items-center gap-2">
                                                                                                    <div className="w-1 h-6 bg-green-400 rounded"></div>
                                                                                                    <h3 className="text-lg font-medium text-gray-700">
                                                                                                      {apprAjoute?.apprenants.length || 0} employés
                                                                                                      sélectionnés
                                                                                                    </h3>
                                                                                                  </div>
                                                                                                </div>
                                                                
                                                                                                <div className="p-4 h-full overflow-y-auto space-y-3">
                                                                                                {apprAjoute?.apprenants && apprAjoute.apprenants.length > 0 ? (
                                                                                                    apprAjoute.apprenants.map((apprenant, index) => (
                                                                                                      <div
                                                                                                        key={index}
                                                                                                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                                                                                                      >
                                                                                                        <div className="flex items-center gap-3">
                                                                                                          <div className="w-12 h-12 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                                                                                                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                                                                                                  {apprenant.emp_photo ? (
                                                                                                                    <img
                                                                                                                      src={`${IMAGE_URL}/img/employes/${apprenant.emp_photo}`}
                                                                                                                      alt={apprenant.emp_name}
                                                                                                                      className="w-full h-full object-cover"
                                                                                                                    />
                                                                                                                  ) : (
                                                                                                                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold text-lg uppercase">
                                                                                                                      {apprenant.emp_initial_name}
                                                                                                                    </div>
                                                                                                                  )}
                                                                                                                </div>
                                                                                                          </div>
                                                                                                          <div>
                                                                                                            <p className="font-semibold text-gray-800 uppercase">
                                                                                                              {apprenant.emp_name}
                                                                                                            </p>
                                                                                                            <p className="text-sm text-gray-600 capitalize">
                                                                                                              {apprenant.emp_firstname}
                                                                                                            </p>
                                                                                                          </div>
                                                                                                        </div>
                                                                
                                                                                                        <button
                                                                                                          onClick={() =>
                                                                                                            manageAppr(
                                                                                                              "delete",
                                                                                                              id,
                                                                                                              apprenant.idEmploye
                                                                                                            )
                                                                                                          }
                                                                                                          className="p-2 bg-red-100 hover:bg-red-200 rounded-full transition-colors duration-200"
                                                                                                        >
                                                                                                          <Minus className="w-4 h-4 text-red-600" />
                                                                                                        </button>
                                                                                                      </div>
                                                                                                    ))
                                                                                                  ) : (
                                                                                                    <div className="text-center py-12 text-gray-500">
                                                                                                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                                                                                      <p>Aucun apprenant sélectionné</p>
                                                                                                    </div>
                                                                                                  )}
                                                                                                </div>
                                                                                              </div>
                                                                                            </div>
                                                                
                                                                                            {/* Footer */}
                                                                                            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                                                                                              <button
                                                                                                onClick={() => setShowPageApprenant(false)}
                                                                                                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                                                                              >
                                                                                                Annuler
                                                                                              </button>
                                                                                              <button
                                                                                                onClick={() => setShowPageApprenant(false)}
                                                                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                                                                                              >
                                                                                                Fermer
                                                                                              </button>
                                                                                            </div>
                                                                                          </div>
                                                                                        </div>
                                                                                      )}
                                                                              
                                                                              </li>
                                                                          </ul>
                                                                          )}
                                                                          
                                                                    </div>
                                                                  </div>
                                                                </span>
                                                              </h2>

                                                              <div className='p-4'>
                                                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{projet.projet.etp_name}</h3>
                                                                      {/* Stats Cards */}
                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                                                                        <div className="flex items-center gap-3">
                                                                            <CheckCircle className="w-8 h-8 text-gray-600" />
                                                                            <div>
                                                                            <p className="text-2xl font-bold text-gray-700">{apprAjoute.percentPresent}</p>
                                                                            <p className="text-sm text-gray-600">Présents</p>
                                                                            </div>
                                                                        </div>
                                                                        </div>
                                                                        
                                                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                                                                        <div className="flex items-center gap-3">
                                                                            <AlertCircle className="w-8 h-8 text-gray-600" />
                                                                            <div>
                                                                            <p className="text-2xl font-bold text-gray-700">{apprAjoute.percentPartiel}</p>
                                                                            <p className="text-sm text-gray-600">Partiellement</p>
                                                                            </div>
                                                                        </div>
                                                                        </div>
                                                                        
                                                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                                                                        <div className="flex items-center gap-3">
                                                                            <XCircle className="w-8 h-8 text-gray-600" />
                                                                            <div>
                                                                            <p className="text-2xl font-bold text-gray-700">{apprAjoute.percentAbsent}</p>
                                                                            <p className="text-sm text-gray-600">Absents</p>
                                                                            </div>
                                                                        </div>
                                                                        </div>
                                                                    </div>

                                                                      {/* Participants List */}
                                                                    <div className="space-y-3">
                                                                        {apprAjoute?.apprenants && apprAjoute.apprenants?.length > 0 ? (
                                                                          apprAjoute?.apprenants.map((apprenant, index) => (
                                                                            <div
                                                                            key={index}
                                                                            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:border-purple-200 group"
                                                                            >
                                                                            <div className="flex items-center justify-between">
                                                                                {/* Participant Info */}
                                                                                <div className="flex items-center gap-4">
                                                                                <div className="relative">
                                                                                    <div className="w-14 h-14 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                                                                                    {apprenant.emp_photo ? (
                                                                                        <img
                                                                                        src={`${IMAGE_URL}/img/employes/${apprenant.emp_photo}`}
                                                                                        alt="photo"
                                                                                        className="object-cover w-full h-full"
                                                                                        />
                                                                                    ) : (
                                                                                        <div className="flex items-center justify-center w-full h-full text-white text-lg font-bold">
                                                                                        {apprenant.emp_initial_name}
                                                                                        </div>
                                                                                    )}
                                                                                    </div>
                                                                                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${getPresenceColor(apprenant.presence)}`}></div>
                                                                                </div>
                                                                                
                                                                                <div>
                                                                                    <h4 className="font-semibold text-gray-800 capitalize">
                                                                                    {apprenant.emp_name} {apprenant.emp_firstname}
                                                                                    </h4>
                                                                                    <div className="flex items-center gap-4 mt-1">
                                                                                    <div className="flex items-center gap-1">
                                                                                        {getPresenceIcon(apprenant.presence)}
                                                                                        <span className="text-sm text-gray-600">Présence</span>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-1">
                                                                                        {[...Array(5)].map((_, i) => (
                                                                                        <Star key={i} className="w-3 h-3 text-gray-300 fill-current" />
                                                                                        ))}
                                                                                        <span className="text-sm text-gray-500 ml-1">Évaluation</span>
                                                                                    </div>
                                                                                    <div className="text-sm text-gray-500">
                                                                                        Skills: -- | --
                                                                                    </div>
                                                                                    </div>
                                                                                </div>
                                                                                </div>
                
                                                                                {/* Actions */}
                                                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                                  <button
                                                                                      onClick={() => manageAppr("delete", id, apprenant.idEmploye)}
                                                                                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                                                  >
                                                                                      <Minus className="w-4 h-4" />
                                                                                  </button>
                                                                                </div>
                                                                            </div>
                                                                            </div>
                                                                        ))
                                                                        ) : (
                                                                        <div className="text-center py-12">
                                                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                                            <Users className="w-8 h-8 text-gray-400" />
                                                                            </div>
                                                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun apprenant trouvé</h3>
                                                                            <p className="text-gray-500 mb-6">Commencez par ajouter vos premiers apprenants</p>
                                                                            <button 
                                                                                onClick={() => setShowPageApprenant(true)}
                                                                                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors duration-200"
                                                                            >
                                                                              <UserPlus className="w-4 h-4" />
                                                                                Ajouter des apprenants
                                                                            </button>
                                                                        </div>
                                                                        )}
                                                                    </div>
                                                              </div>

                                                            </div>
                                                        </div>
                                                        {/* agenda */}
                                                        <div className="w-full max-w-6xl mx-auto p-4">
                                                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                                              <h2 className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                                                                    <div className="flex items-center justify-between">
                                                                        <button
                                                                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
                                                                        >
                                                                        <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                                                                            <Calendar className="w-5 h-5 text-blue-600" />
                                                                        </div>
                                                                        <div>
                                                                            <h2 className="text-xl font-semibold text-gray-800">Agenda</h2>
                                                                            <p className="text-sm text-gray-600">Gérez vos sessions de formation</p>
                                                                        </div>
                                                                        <div className="ml-2 transition-transform duration-200 group-hover:scale-110">
                    
                                                                        </div>
                                                                        </button>
                                                                    </div>
                                                              </h2>
                                                              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                                                                  <div className="flex items-center gap-6">
                                                                  <div className="flex items-center gap-3">
                                                                      <div className="p-2 bg-blue-100 rounded-lg">
                                                                      <Calendar className="w-4 h-4 text-blue-600" />
                                                                      </div>
                                                                      <div>
                                                                      <p className="text-2xl font-bold text-blue-600">
                                                                          {projet.project_has.seances.length ?? 0}
                                                                      </p>
                                                                      <p className="text-sm text-gray-600">Sessions planifiées</p>
                                                                      </div>
                                                                  </div>
                                                                  
                                                                  <div className="flex items-center gap-3">
                                                                      <div className="p-2 bg-green-100 rounded-lg">
                                                                      <Clock className="w-4 h-4 text-green-600" />
                                                                      </div>
                                                                      <div>
                                                                      <p className="text-2xl font-bold text-green-600">
                                                                          {getTotalDuration(projet?.projects_has?.seances)}
                                                                      </p>
                                                                      <p className="text-sm text-gray-600">Durée totale</p>
                                                                      </div>
                                                                  </div>
                                                                  </div>
                                                              </div>
                                                                <div className="px-6 py-6">
                                                                    {projet.project_has.seances.length > 0 ? (
                                                                    <div className="space-y-4">
                                                                        {projet.project_has.seances.map((seance, index) => (
                                                                        <div
                                                                            key={seance.id}
                                                                            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:border-blue-200 group"
                                                                        >
                                                                            <div className="flex items-center justify-between">
                                                                            {/* Session Info */}
                                                                            <div className="flex items-center gap-6">
                                                                                <div className="flex-shrink-0">
                                                                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                                                                    <span className="text-blue-600 font-bold">
                                                                                    {String(index + 1).padStart(2, '0')}
                                                                                    </span>
                                                                                </div>
                                                                                </div>
                                                                                
                                                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                                                                                <div>
                                                                                    <p className="text-sm text-gray-500 mb-1">Date</p>
                                                                                    <p className="font-semibold text-gray-800 capitalize">
                                                                                    {formaterDateComplete(seance.dateSeance)}
                                                                                    </p>
                                                                                </div>
                                                                                
                                                                                <div>
                                                                                    <p className="text-sm text-gray-500 mb-1">Horaires</p>
                                                                                    <div className="flex items-center gap-2">
                                                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                                                    <span className="font-medium text-gray-700">
                                                                                        {seance.heureDebut} - {seance.heureFin}
                                                                                    </span>
                                                                                    </div>
                                                                                </div>
                                                                                
                                                                                <div>
                                                                                    <p className="text-sm text-gray-500 mb-1">Durée</p>
                                                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                                                    {seance.intervalle_raw}
                                                                                    </span>
                                                                                </div>
                                                                                
                                                                                <div>
                                                                                    <p className="text-sm text-gray-500 mb-1">Type</p>
                                                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                                                    seance.session_catch_up === 'Rattrapage' 
                                                                                        ? 'bg-orange-100 text-orange-800' 
                                                                                        : 'bg-blue-100 text-blue-800'
                                                                                    }`}>
                                                                                    {seance.session_catch_up}
                                                                                    </span>
                                                                                </div>
                                                                                </div>
                                                                            </div>
            
                                                                            {/* Actions */}
                                                                            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                                <button
                                                                                
                                                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                                                >
                                                                                
                                                                                </button>
                                                                            </div>
                                                                            </div>
                                                                        </div>
                                                                        ))}
                                                                    </div>
                                                                    ) : (
                                                                    <div className="text-center py-12">
                                                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                                        <Calendar className="w-8 h-8 text-gray-400" />
                                                                        </div>
                                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune session planifiée</h3>
                                                                        
                                                                    </div>
                                                                    )}
                                                                </div>
                                                            
                                                            </div>
                                                        </div>
                                                        {/* aspect financier */}
                                                        <div className="w-full max-w-6xl mx-auto p-4">
                                                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                                              <h2 className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                                                                <span className="collapsed w-full inline-flex !rounded-xl items-center justify-between">
                                                                    <button
                                                                      className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition-colors duration-200 group"
                                                                      >
                                                                      <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                                                                          <Wallet className="w-5 h-5 text-blue-600" />
                                                                      </div>
                                                                      <div>
                                                                          <div className="flex items-center gap-2">
                                                                          <h2 className="text-xl font-semibold text-gray-800">
                                                                                Espace financiers
                                                                          </h2>
                                                                          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                                                                              Actifs
                                                                          </span>
                                                                          </div>
                                                                          <p className="text-sm text-gray-600">Gérez vos financement de formation</p>
                                                                      </div>
                                                                      <div className="ml-2 transition-transform duration-200 group-hover:scale-110">
                                                                          
                                                                      </div>
                                                                  </button>      
                                                                  
                                                                  <div className="flex justify-end pr-4">
                                                                    <button onClick={() => setShowPageFinancier(true)} className="flex items-center gap-2 px-4 py-2 border-2 border-gray-700 text-gray-700 rounded-xl hover:bg-blue-700 hover:text-white transition-colors duration-200 shadow-sm hover:shadow-md">
                                                                          <Edit3 className="w-4 h-4" />
                                                                          <span className="text-sm font-medium">Éditer</span>
                                                                    </button>
                                                                      <AnimatePresence>
                                                                          {showPageFinancier && (
                                                                            <>
                                                                              {/* Overlay */}
                                                                              <motion.div
                                                                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                                                                                initial={{ opacity: 0 }}
                                                                                animate={{ opacity: 1 }}
                                                                                exit={{ opacity: 0 }}
                                                                                onClick={() => setShowPageFinancier(false)}
                                                                              />

                                                                              {/* Panneau principal */}
                                                                              <motion.div
                                                                                initial={{ opacity: 0, x: 300 }}
                                                                                animate={{ opacity: 1, x: 0 }}
                                                                                exit={{ opacity: 0, x: 300 }}
                                                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                                                                className="fixed right-0 top-0 h-full bg-white w-full max-w-[1010px] z-50 shadow-2xl flex flex-col"
                                                                              >
                                                                                {/* Header */}
                                                                                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
                                                                                  <div className="flex items-center gap-3">
                                                                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                                                                                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                      </svg>
                                                                                    </div>
                                                                                    <h2 className="text-lg font-semibold text-gray-800">Gestion des frais du projet</h2>
                                                                                  </div>
                                                                                  <button
                                                                                    onClick={() => setShowPageFinancier(false)}
                                                                                    className="w-10 h-10 rounded-lg hover:bg-white/80 duration-200 flex items-center justify-center group"
                                                                                  >
                                                                                    <FaXmark className="text-gray-600 group-hover:text-gray-800" />
                                                                                  </button>
                                                                                </div>

                                                                                {/* Contenu scrollable */}
                                                                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                                                                  {/* Section Type de financement */}
                                                                                  <div className="space-y-4">
                                                                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Type de financement</h3>
                                                                                    <div className="grid grid-cols-3 gap-4">
                                                                                      {[
                                                                                        { id: 1, label: 'Fonds Propres' },
                                                                                        { id: 2, label: 'FMFP' },
                                                                                        { id: 3, label: 'Autres' }
                                                                                      ].map((option) => (
                                                                                        <label
                                                                                          key={option.id}
                                                                                          className={`relative flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                                                                            selectedFinancement === option.id
                                                                                              ? 'border-purple-500 bg-purple-50 shadow-md'
                                                                                              : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm'
                                                                                          }`}
                                                                                        >
                                                                                          <span className={`text-sm font-medium ${
                                                                                            selectedFinancement === option.id ? 'text-purple-700' : 'text-gray-700'
                                                                                          }`}>
                                                                                            {option.label}
                                                                                          </span>
                                                                                          <input
                                                                                            type="radio"
                                                                                            name="financement"
                                                                                            value={option.id}
                                                                                            checked={selectedFinancement === option.id}
                                                                                            onChange={() => setSelectedFinancement(option.id)}
                                                                                            className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                                                                                          />
                                                                                        </label>
                                                                                      ))}
                                                                                    </div>
                                                                                  </div>

                                                                                  {/* Section principale avec 2 colonnes */}
                                                                                  <div className="grid grid-cols-2 gap-6">
                                                                                    {/* Colonne gauche - Liste des frais disponibles */}
                                                                                    <div className="space-y-4">
                                                                                      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
                                                                                        <div className="w-1 h-8 bg-gradient-to-b from-red-400 to-orange-400 rounded-full"></div>
                                                                                        <label className="text-sm font-semibold text-gray-700">Liste de tous les frais disponibles</label>
                                                                                      </div>

                                                                                      <div className="bg-gray-50 rounded-xl p-3 space-y-2 max-h-[500px] overflow-y-auto">
                                                                                        {tousFrais.frais.map((f, index) => (
                                                                                          <div
                                                                                            key={index}
                                                                                            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200 group"
                                                                                          >
                                                                                            <div className="flex-1">
                                                                                              <p className="font-medium text-gray-800">{f.Frais}</p>
                                                                                              <p className="text-sm text-gray-500 mt-0.5">{f.exemple}</p>
                                                                                            </div>
                                                                                            <button className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                                                                                              <FaPlus className="text-green-600 text-sm" />
                                                                                            </button>
                                                                                          </div>
                                                                                        ))}
                                                                                      </div>
                                                                                    </div>

                                                                                    {/* Colonne droite - Frais sélectionnés */}
                                                                                    <div className="space-y-4">
                                                                                      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                                                                        <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-emerald-400 rounded-full"></div>
                                                                                        <label className="text-sm font-semibold text-gray-700">Frais sélectionnés</label>
                                                                                      </div>

                                                                                      {/* Options TVA */}
                                                                                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                                                                                        {[
                                                                                          { id: 20, label: 'TVA 20%' },
                                                                                          { id: 0, label: 'TVA 0%' }
                                                                                        ].map((tva) => (
                                                                                          <label
                                                                                            key={tva.id}
                                                                                            className="flex items-center gap-2 cursor-pointer group"
                                                                                          >
                                                                                            <input
                                                                                              type="radio"
                                                                                              name="tva"
                                                                                              value={tva.id}
                                                                                              checked={selectedTVA === tva.id}
                                                                                              onChange={() => setSelectedTVA(tva.id)}
                                                                                              className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                                                                                            />
                                                                                            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
                                                                                              {tva.label}
                                                                                            </span>
                                                                                          </label>
                                                                                        ))}
                                                                                      </div>

                                                                                      {/* Totaux */}
                                                                                      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                                                                                        <div className="flex items-center justify-between">
                                                                                          <span className="text-sm text-gray-600">Total HT</span>
                                                                                            <span className="text-lg font-bold text-gray-800">
                                                                                              {(totalMontant ?? 0).toFixed(2)} {setting?.currency_unit ?? ""}
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                                                                                        <div className="flex items-center justify-between">
                                                                                          <span className="text-sm text-gray-600">Total TTC</span>
                                                                                            <span className="text-lg font-bold text-purple-600">
                                                                                              {((totalMontant ?? 0) * (1 + (selectedTVA ?? 0) / 100)).toFixed(2)} {setting?.currency_unit ?? ""}
                                                                                            </span>

                                                                                        </div>
                                                                                      </div>

                                                                                      {/* Liste des frais ajoutés */}
                                                                                      <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                                                                        {FraisAjoute?.fraisdetails?.length > 0 ? (
                                                                                          FraisAjoute?.fraisdetails.map((frais, index) => (
                                                                                            <div
                                                                                              key={index}
                                                                                              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-md transition-all duration-200"
                                                                                            >
                                                                                              <div className="flex items-start justify-between mb-3">
                                                                                                <h4 className="font-semibold text-gray-800">{frais.frais}</h4>
                                                                                                <button className="w-9 h-9 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-all duration-200 hover:scale-110">
                                                                                                  <FaMinus className="text-red-600 text-xs" />
                                                                                                </button>
                                                                                              </div>
                                                                                              
                                                                                              <div className="space-y-3">
                                                                                                <div>
                                                                                                  <label className="text-xs text-gray-500 mb-1 block">Coût</label>
                                                                                                  <div className="flex items-center gap-2">
                                                                                                    <input
                                                                                                      type="number"
                                                                                                      defaultValue={frais.montant}
                                                                                                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                                                                                                    />
                                                                                                    <span className="text-sm font-medium text-gray-600">{setting.currency_unit}</span>
                                                                                                  </div>
                                                                                                </div>
                                                                                                
                                                                                                <div>
                                                                                                  <label className="text-xs text-gray-500 mb-1 block">Description</label>
                                                                                                  <input
                                                                                                    type="text"
                                                                                                    defaultValue={frais.description}
                                                                                                    maxLength={200}
                                                                                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                                                                                                  />
                                                                                                </div>
                                                                                              </div>
                                                                                            </div>
                                                                                          ))
                                                                                        ) : (
                                                                                          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                                                                                            Aucun frais ajouté
                                                                                          </div>
                                                                                        )}
                                                                                      </div>
                                                                                    </div>
                                                                                  </div>
                                                                                </div>

                                                                                {/* Footer */}
                                                                                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
                                                                                  <button
                                                                                    onClick={() => setShowPageFinancier(false)}
                                                                                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                                                                  >
                                                                                    Annuler
                                                                                  </button>
                                                                                  <button
                                                                                    onClick={() => setShowPageFinancier(false)}
                                                                                    className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                                                                                  >
                                                                                    Enregistrer et fermer
                                                                                  </button>
                                                                                </div>
                                                                              </motion.div>
                                                                            </>
                                                                          )}
                                                                        </AnimatePresence>
                                                                  </div>
                                                                </span>
                                                              </h2>
                                                              <div className="p-6 space-y-6">
                                                                  {/* Financing Type Card */}
                                                                  <div className="bg-gradient-to-r from-gray-50 to-gray-100  border rounded-xl p-5">
                                                                  <div className="flex items-center gap-3 mb-3">
                                                                      {getFinancementIcon(projet.projet.paiement)}
                                                                      <div>
                                                                      <h3 className="font-semibold text-gray-800">Mode de financement</h3>
                                                                      <p className="text-sm text-gray-600">Type de prise en charge</p>
                                                                      </div>
                                                                  </div>
                                                                  <div className="flex items-center justify-between">
                                                                      <span className="text-gray-700">Financé par :</span>
                                                                      <span className="px-4 py-2 bg-white rounded-lg font-semibold text-gray-800 shadow-sm">
                                                                      {projet.projet.paiement}
                                                                      </span>
                                                                  </div>
                                                                  </div>

                                                                  {/* Summary Stats */}
                                                                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-purple-200 rounded-xl p-5">
                                                                  <div className="flex items-center gap-3 mb-4">
                                                                      <TrendingUp className="w-5 h-5 text-purple-600" />
                                                                      <h3 className="font-semibold text-gray-800">Récapitulatif financier</h3>
                                                                  </div>
                                                                  
                                                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                      <div className="text-center">
                                                                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                                          <Receipt className="w-6 h-6 text-blue-600" />
                                                                      </div>
                                                                      <p className="text-sm text-gray-600">Coût total HT du projet</p>
                                                                      <p className="font-bold text-blue-600">
                                                                          {parseInt(projet.projet.total_ht).toLocaleString("fr-FR")} {setting?.currency_unit}
                                                                      </p>
                                                                      </div>
                                                                      
                                                                      <div className="text-center">
                                                                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                                          <Percent className="w-6 h-6 text-orange-600" />
                                                                      </div>
                                                                      <p className="text-sm text-gray-600">TVA</p>
                                                                      <p className="font-bold text-orange-600">
                                                                      </p>
                                                                      </div>
                                                                      
                                                                      <div className="text-center">
                                                                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                                          <DollarSign className="w-6 h-6 text-emerald-600" />
                                                                      </div>
                                                                      <p className="text-sm text-gray-600">Total TTC</p>
                                                                      <p className="font-bold text-emerald-600">
                                                                          {parseInt(projet.projet.total_ttc).toLocaleString("fr-FR")} {setting?.currency_unit}
                                                                      </p>
                                                                      </div>
                                                                  </div>
                                                                  </div>

                                                              </div>
                                                            </div>
                                                        </div>
                                                  </div>

                                                  <div className="w-[40%]">
                                                          {/* Lieu et salle */}
                                                          <div className="aw-full max-w-6xl mx-auto p-4">
                                                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                                                <h2 className="bg-gradient-to-r from-blue-50 to-indigo-50 px-1 py-2">
                                                                    <span className="collapsed w-full inline-flex !rounded-xl items-center justify-between">
                                                                        <button
                                                                          className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition-colors duration-200 group"
                                                                          >
                                                                          <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                                                                              <MapPin className="w-5 h-5 text-blue-600" />
                                                                          </div>
                                                                          <div>
                                                                              <div className="flex items-center gap-2">
                                                                              <h2 className="text-xl font-semibold text-gray-800">
                                                                                  Lieu et salle
                                                                              </h2>
                                                                              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                                                                                  Actifs
                                                                              </span>
                                                                              </div>
                                                                              <p className="text-sm text-gray-600">Gérez vos lieu et salle de formation</p>
                                                                          </div>
                                                                          <div className="ml-2 transition-transform duration-200 group-hover:scale-110">
                                                                              
                                                                          </div>
                                                                          </button>              
                                                                    </span>
                                                                </h2>
                                                                <div className="accordion-body p-4">
                                                                  <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                                                    <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-md">
                                                                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                      </svg>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                      <p className="text-sm font-medium text-gray-500 mb-1">Lieu de formation</p>
                                                                      <p className="text-lg font-semibold text-gray-800">{salle?.salle?.salle_name}</p>
                                                                    </div>
                                                                  </div>
                                                                </div>

                                                                </div>
                                                          </div>
                                                            {/* centre de formation */}
                                                            <div className="w-full max-w-6xl mx-auto p-4">
                                                              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                                                                    <span className="collapsed w-full inline-flex !rounded-xl items-center justify-between">
                                                                        <button
                                                                        className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition-colors duration-200 group"
                                                                        >
                                                                        <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                                                                            <GraduationCap className="w-5 h-5 text-blue-600" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="flex items-center gap-2">
                                                                            <h2 className="text-xl font-semibold text-gray-800">
                                                                                Centres(s) de formation
                                                                            </h2>
                                                                            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                                                                                Actifs
                                                                            </span>
                                                                            </div>
                                                                            <p className="text-sm text-gray-600">Gérez vos lieu Centres(s) de formation</p>
                                                                        </div>
                                                                        <div className="ml-2 transition-transform duration-200 group-hover:scale-110">
                                                                            
                                                                        </div>
                                                                        </button>        
                                                                    </span>
                                                                </div>
                                                                <div className="p-6">
                                                                    <div className="space-y-4">
                                                                        <div
                                                                            key=""
                                                                            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:border-indigo-200 group"
                                                                        >
                                                                            <div className="flex items-center justify-between">
                                                                            {/* Trainer Info */}
                                                                            <div className="flex items-center gap-4">
                                                                                <div>
                                                                                  <h4 className="font-bold text-gray-800 uppercase text-lg">
                                                                                      {projet?.project_has?.cfp?.cfp_name}
                                                                                  </h4>                                             
                                                                                  <div className="flex items-center gap-2 mt-1">
                                                                                      <Award className="w-4 h-4 text-gray-400" />
                                                                                      <span className="text-sm text-gray-500">Centre de formation</span>
                                                                                  </div>
                                                                                </div>
                                                                            </div>
                
                                                                            {/* Actions */}
                                                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                                <button
                                                                                className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 group/btn"
                                                                                >
                                                                                <EyeIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                                                                                </button>
                                                                            </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                              </div>
                                                          </div>
                                                          {/* formateur */}
                                                          <div className="w-full max-w-6xl mx-auto p-4">
                                                              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                                                                    <div className="flex items-center justify-between">
                                                                      <button
                                                                        className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors duration-200 group"
                                                                        >
                                                                        <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                                                                            <GraduationCap className="w-5 h-5 text-blue-600" />
                                                                        </div>
                                                                        <div>
                                                                            <h2 className="text-xl font-semibold text-gray-800">Formateurs</h2>
                                                                            <p className="text-sm text-gray-600">Faites connaissance avec les formateurs</p>
                                                                        </div>
                                                                        <div className="ml-2 transition-transform duration-200 group-hover:scale-110">
                                                                        </div>
                                                                      </button>
                                                                    </div>
                                                                </div>

                                                                <div className="p-6">
                                                                    {formateurIntern?.forms && formateurIntern?.forms.length > 0 ? (
                                                                    <div className="space-y-4">
                                                                        {formateurIntern?.forms?.map((f, index) => (
                                                                        <div
                                                                            key={index}
                                                                            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:border-indigo-200 group"
                                                                        >
                                                                            <div className="flex items-center justify-between">
                                                                            {/* Trainer Info */}
                                                                            <div className="flex items-center gap-4">
                                                                                <div className="relative">
                                                                                <div className="w-16 h-16 overflow-hidden rounded-full bg-gradient-to-br from-indigo-400 to-purple-500">
                                                                                    {f.form_photo ? (
                                                                                    <img
                                                                                        src={`${IMAGE_URL}/img/formateurs/${f.form_photo}`}
                                                                                        alt={f.form_name}
                                                                                        className="object-cover w-full h-full"
                                                                                    />
                                                                                    ) : (
                                                                                    <div className="flex items-center justify-center w-full h-full text-white text-lg font-bold">
                                                                                        {/* {getInitials(f.form_firstname, f.form_name)} */}
                                                                                    </div>
                                                                                    )}
                                                                                </div>
                                                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                                                                                </div>
                                                                                
                                                                                <div>
                                                                                <h4 className="font-bold text-gray-800 uppercase text-lg">
                                                                                    {f.form_name}
                                                                                </h4>
                                                                                <p className="text-indigo-600 font-medium capitalize">
                                                                                    {f.form_firstname}
                                                                                </p>
                                                                                <div className="flex items-center gap-2 mt-1">
                                                                                    <Award className="w-4 h-4 text-gray-400" />
                                                                                    <span className="text-sm text-gray-500">Consultant Formateur</span>
                                                                                </div>
                                                                                </div>
                                                                            </div>
                
                                                                            {/* Actions */}
                                                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                                <button
                                                                                onClick={() => {
                                                                                    setShowPageDetailFormateur(true);
                                                                                    loadFormateurCv(f.idFormateur);
                                                                                }}
                                                                                className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 group/btn"
                                                                                >
                                                                                <EyeIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                                                                                </button>
                                                                            </div>
                                                                            </div>
                                                                        </div>
                                                                        ))}
                                                                    </div>
                                                                    ) : (
                                                                    <div className="text-center py-12">
                                                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                                        <GraduationCap className="w-8 h-8 text-gray-400" />
                                                                        </div>
                                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun formateur assigné</h3>
                                                                    </div>
                                                                    )}
                                                                </div>
                                                        
                                                              </div>
                                                              <AnimatePresence>
                                                                    {showPageDetailFormateur && (
                                                                    <>
                                                                    {/* Overlay noir semi-transparent */}
                                                                    <motion.div
                                                                    className="fixed inset-0 bg-gray-800/60 z-50"
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    exit={{ opacity: 0 }}
                                                                    />

                                                                    {/* Panneau latéral de détail */}
                                                                    <motion.div
                                                                    initial={{ opacity: 0, x: 300 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    exit={{ opacity: 0, x: 300 }}
                                                                    transition={{ duration: 1 }}
                                                                    className="fixed right-0 top-0 h-full bg-white w-[1010px] z-50 shadow-lg overflow-y-auto"
                                                                    >
                                                                    <div className="w-full px-4 py-2 flex items-center justify-between bg-gray-100">
                                                                    <p className="text-lg font-medium text-gray-500">À propos du formateur</p>
                                                                    <button
                                                                      onClick={() => setShowPageDetailFormateur(false)}
                                                                      className="w-10 h-10 rounded-md hover:bg-gray-200 flex items-center justify-center"
                                                                    >
                                                                      <FaXmark />
                                                                    </button>
                                                                    </div>

                                                                    {cvForm && (
                                                                    <div className="p-4 space-y-6">
                                                                      {/* Header */}
                                                                      <div className="flex items-center gap-4">
                                                                        <div className="w-32 h-32 rounded-full overflow-hidden p-2">
                                                                        {cvForm?.form?.photo && (
                                                                          <img
                                                                            src={`${IMAGE_URL}/img/formateurs/${cvForm.form.photo}`}
                                                                            alt="profil"
                                                                            className="object-cover w-full h-full rounded-full"
                                                                          />
                                                                        )}
                                                                        </div>
                                                                        <div className="flex flex-col gap-2">
                                                                          <h3 className="text-2xl font-bold text-gray-700">
                                                                            {cvForm?.form?.name} {cvForm?.form?.firstname}
                                                                          </h3>
                                                                          <p className="text-base text-gray-500">Consultant Formateur</p>
                                                                        </div>
                                                                      </div>

                                                                      {/* Infos principales */}
                                                                      <div className="border border-dashed border-gray-200 rounded-md p-4 space-y-2">
                                                                        <div className="flex justify-between">
                                                                          <span className="text-gray-600 font-semibold">Email :</span>
                                                                          <span className="text-gray-400">{cvForm?.form?.email}</span>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                          <span className="text-gray-600 font-semibold">Téléphone :</span>
                                                                          <span className="text-gray-400">{cvForm?.form?.phone}</span>
                                                                        </div>
                                                                      </div>

                                                                      {/* Expériences */}
                                                                      <div className="border border-dashed border-gray-200 rounded-md p-4">
                                                                        <h5 className="text-lg font-semibold text-gray-600 mb-1">Expériences</h5>
                                                                        {cvForm?.form_has?.experiences?.length > 0 ? (
                                                                          <ul className="text-gray-700 text-base space-y-2">
                                                                            {cvForm?.form_has?.experiences.map((exp) => (
                                                                              <li key={exp.id}>
                                                                                <p><strong>Fonction :</strong> {exp.Fonction}</p>
                                                                                <p><strong>Lieu :</strong> {exp.Lieu_de_stage}</p>
                                                                                <p>
                                                                                  <strong>Période :</strong>{' '}
                                                                                  {new Date(exp.Date_debut).toLocaleDateString()} -{' '}
                                                                                  {exp.Date_fin
                                                                                    ? new Date(exp.Date_fin).toLocaleDateString()
                                                                                    : 'Aujourd’hui'}
                                                                                </p>
                                                                              </li>
                                                                            ))}
                                                                          </ul>
                                                                        ) : (
                                                                          <ul className="text-gray-400 text-base">
                                                                            <li>Aucune expérience</li>
                                                                          </ul>
                                                                        )}

                                                                      </div>

                                                                      {/* Formations */}
                                                                      <div className="border border-dashed border-gray-200 rounded-md p-4">
                                                                        <h5 className="text-lg font-semibold text-gray-600 mb-1">Formations</h5>
                                                                        {cvForm?.form_has?.diplomes?.length > 0 ? (
                                                                        <ul className="text-gray-400 text-base">
                                                                          {cvForm.form_has.experiences.map((d) => (
                                                                            <li key={d.id}>
                                                                            <strong>{d.Diplome}</strong> en {d.Domaine} <br />
                                                                              École : {d.Ecole} <br />
                                                                              De : {new Date(d.Date_debut).toLocaleDateString()} à {new Date(d.Date_fin).toLocaleDateString()}
                                                                            </li>
                                                                          ))}
                                                                        </ul>
                                                                        ):(
                                                                          <ul className="text-gray-400 text-base">
                                                                            <li>Aucune diplome</li>
                                                                          </ul>
                                                                        )}
                                                                      </div>

                                                                      {/* Compétences */}
                                                                      <div className="border border-dashed border-gray-200 rounded-md p-4">
                                                                        <h5 className="text-lg font-semibold text-gray-600 mb-1">Compétences</h5>
                                                                        {cvForm?.form_has?.diplomes?.length > 0 ? (
                                                                        <ul className="text-gray-400 text-base">
                                                                          {cvForm.form_has.experiences.map((c) => (
                                                                              <li key={c.id}>{c.Competence}</li>
                                                                          ))}
                                                                        </ul>
                                                                        ):(
                                                                          <ul className="text-gray-400 text-base">
                                                                            <li>Aucune compétence</li>
                                                                          </ul>
                                                                        )}
                                                                      </div>

                                                                      {/* Langues */}
                                                                      <div className="border border-dashed border-gray-200 rounded-md p-4">
                                                                        <h5 className="text-lg font-semibold text-gray-600 mb-2">Langues</h5>
                                                                          {cvForm?.form_has?.langues?.length > 0 ? (
                                                                        <ul className="space-y-2">
                                                                                {cvForm.form_has.langues.map((lang, idx) => (
                                                                                  <li key={idx} className="flex justify-between text-gray-400">
                                                                                    <span>{lang.Langue}</span>
                                                                                    <span className="flex gap-1">
                                                                                      {[1, 2, 3, 4, 5].map((s) => (
                                                                                        <img
                                                                                          key={s}
                                                                                          alt={`${lang.Langue} ${s}`}
                                                                                          src={`/stars/star-${s <= lang.note ? "on" : "off"}.png`}
                                                                                          className="w-5 h-5"
                                                                                        />
                                                                                      ))}
                                                                                    </span>
                                                                                  </li>
                                                                                ))}
                                                                              </ul>
                                                                            ):(
                                                                              <ul className="text-gray-400 text-base">
                                                                                  <li>Aucune langues</li>
                                                                              </ul>
                                                                            )}

                                                                      </div>
                                                                    </div>
                                                                    )}
                                                                  
                                                                    </motion.div>
                                                                    </>
                                                                    )}
                                                                </AnimatePresence>
                                                          </div>
                                                  </div>
                                              </div>                                   
                                    )}

                                    {activeTab === 'detail-formation' && (
                                        <div className="flex gap-6">
                                            {/* Colonne gauche - Programme de formation */}
                                            <div className="w-full lg:w-2/3">
                                              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                                {/* Header de section */}
                                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-6">
                                                  <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg flex items-center justify-center shadow-md">
                                                      <FaChalkboard className="text-gray-600 text-lg" />
                                                    </div>
                                                    <div>
                                                      <h2 className="text-xl font-bold text-gray-900">Programme de formation</h2>
                                                      <p className="text-sm text-gray-700 mt-1">Contenu détaillé du cours</p>
                                                    </div>
                                                    <div className="ml-auto bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                                      
                                                    </div>
                                                  </div>
                                                </div>

                                                <div className="space-y-6 p-4">
                                                     {program?.programmes && program.programmes.length > 0 ? (
                                                        program.programmes.map((p, i) => (
                                                          <div 
                                                            key={i} 
                                                            className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                                                          >
                                                            {/* Barre décorative */}
                                                            <div className="absolute left-1 top-6 bottom-6 w-1 bg-gradient-to-r from-gray-50 to-gray-100 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                            
                                                            {/* Numéro du programme */}
                                                            <div className="absolute -top-0 -left-0 w-8 h-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full flex items-center justify-center shadow-md">
                                                              <span className="text-gray-600 text-sm font-bold">{i + 1}</span>
                                                            </div>

                                                            {/* Contenu */}
                                                            <div className="ml-2">
                                                              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-600 transition-colors duration-200">
                                                                {p.program_title}
                                                              </h3>
                                                              
                                                              <div className="prose prose-sm max-w-none">
                                                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                                                  {p.program_description
                                                                    .replace(/<\/?p>/gi, "")
                                                                    .replace(/<span[^>]*>/gi, "")
                                                                    .replace(/<\/span>/gi, "")
                                                                    .replace(/\s*\n\s*/g, "\n")
                                                                    .replace(/-/g, "\n-")
                                                                    .trim()
                                                                  }
                                                                </p>
                                                              </div>
                                                            </div>

                                                            {/* Badge optionnel */}
                                                            {i === 0 && (
                                                              <div className="absolute top-4 right-4">
                                                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                                                                  Premier module
                                                                </span>
                                                              </div>
                                                            )}
                                                          </div>
                                                        ))
                                                      ) : (
                                                        <div className="flex flex-col items-center justify-center py-16 px-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                                          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                          </div>
                                                          <h3 className="text-xl font-bold text-gray-700 mb-2">Aucun programme disponible</h3>
                                                          <p className="text-gray-500 text-center max-w-md">
                                                            Il n'y a actuellement aucun programme associé à ce cours. Les programmes seront ajoutés prochainement.
                                                          </p>
                                                        </div>
                                                      )}
                                                  </div>
                                              </div>
                                            </div>

                                            {/* Colonne droite */}
                                            <div className="w-full lg:w-1/3 space-y-6">
                                              
                                              {/* Objectifs de la formation */}
                                              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                                {/* Header */}
                                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-4">
                                                  <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg flex items-center justify-center shadow-sm">
                                                      <FaBullseye className="text-gray-600 text-sm" />
                                                    </div>
                                                    <div>
                                                      <h3 className="text-lg font-semibold text-gray-900">Objectifs</h3>
                                                      <p className="text-xs text-gray-700">Compétences visées</p>
                                                    </div>
                                                    <div className="ml-auto bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                                      {Array.isArray(filteredObjectifs) ? filteredObjectifs.length : 0}
                                                    </div>
                                                  </div>
                                                </div>

                                                {/* Contenu des objectifs */}
                                                <div className="p-4">
                                                  {Array.isArray(filteredObjectifs) && filteredObjectifs.length > 0 ? (
                                                    <ul className="space-y-3">
                                                      {filteredObjectifs.map((objectif, i) => (
                                                        <li key={i} className="flex items-start gap-3">
                                                          <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                                                          <span className="text-sm text-gray-700 leading-relaxed">
                                                            {objectif.objectif}
                                                          </span>
                                                        </li>
                                                      ))}
                                                    </ul>
                                                  ) : (
                                                    /* État vide */
                                                    <div className="py-8 text-center">
                                                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                        <FaBullseye className="text-gray-400 text-lg" />
                                                      </div>
                                                      <p className="text-sm text-gray-500">Aucun objectif défini</p>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>

                                              {/* Matériels utiles */}
                                              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                                {/* Header */}
                                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-4">
                                                  <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg flex items-center justify-center shadow-sm">
                                                      <FaBoxOpen className="text-gray-600 text-sm" />
                                                    </div>
                                                    <div>
                                                      <h3 className="text-lg font-semibold text-gray-900">Matériels</h3>
                                                      <p className="text-xs text-gray-700">Équipements requis</p>
                                                    </div>
                                                    <div className="ml-auto bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                                      {Array.isArray(filteredMateriels) ? filteredMateriels.length : 0}
                                                    </div>
                                                  </div>
                                                </div>

                                                {/* Contenu des matériels */}
                                                <div className="p-4">
                                                  {Array.isArray(filteredMateriels) && filteredMateriels.length > 0 ? (
                                                    <ul className="space-y-3">
                                                      {filteredMateriels.map((materiel, index) => (
                                                        <li key={index} className="flex items-center gap-3 p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-100">
                                                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <FaBoxOpen className="text-gray-600 text-xs" />
                                                          </div>
                                                          <span className="text-sm text-gray-700 font-medium">
                                                            {materiel.prestation_name}
                                                          </span>
                                                        </li>
                                                      ))}
                                                    </ul>
                                                  ) : (
                                                    /* État vide */
                                                    <div className="py-8 text-center">
                                                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                        <FaBoxOpen className="text-gray-400 text-lg" />
                                                      </div>
                                                      <p className="text-sm text-gray-500">Aucun matériel requis</p>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>

                                              {/* Card d'information supplémentaire */}
                                              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                                                <div className="flex items-center gap-3 mb-3">
                                                  <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                  </div>
                                                  <h4 className="font-semibold text-gray-900">Information</h4>
                                                </div>
                                                <p className="text-sm text-gray-800 leading-relaxed">
                                                  Cette formation est conçue pour répondre aux besoins spécifiques de votre organisation. 
                                                  N'hésitez pas à nous contacter pour toute adaptation du contenu.
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

export default ProjetDetailEtp;