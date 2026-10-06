import { useState, useEffect } from 'react';
import { FaBuilding } from "react-icons/fa6";
import { useParams } from 'react-router-dom';
import axios from '../../../config/axios';
import LoadingSpinner from '../../../components/ui/loading-spinner';
import { AlertTriangle, ArrowRight, BookOpen, Calendar, CalendarDays, CheckCircle, Clock, Download, Package, ShoppingCart, Target } from 'lucide-react';
import { API_URL, IMAGE_URL } from "../../../config/env";



const ProjetDetailEmp = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [projet, setProjets] = useState([]);
  const [idEtp, setIdEtp] = useState([]);
  const [idModule, setIdModule] = useState(null);
  const [program, setProgram] = useState([]);
  const [support, setSupportProjet] = useState([]);


  const fetchProjectDetails = async (id) => {
    setLoading(true);
    try {
      // 1. Récupération du projet
      const response = await axios.get(`${API_URL}/employes/projets/${id}`);

      const data = await response.data;  
      setProjets(data);


      const idEtp = data.projet.idEtp;
      setIdEtp(idEtp);
      const idModule = data.projet.idModule;
      setIdModule(idModule);


      const program = await axios.get(`/employes/projets/${idModule}/programmes`)
      
      const programData = await program.data;
      setProgram(programData);

      
    } catch (error) {
      console.error("Détails de l'erreur :", error);
      setLoading(false);
      setError("Impossible de charger le projet. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSupportProjet = async () => {
        const [ supportRes ] = await Promise.all([  axios.get(
            `${API_URL}/projetsEmp/support`
        ),]);
   
        setSupportProjet(supportRes.data || []);
  }


  const filteredObjectifs = projet?.objectifs?.filter(o => o.idModule === idModule);
  const filteredMateriels = projet?.materiels?.filter(m => m.idModule === idModule);


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

  const setting = JSON.parse(sessionStorage.getItem("setting"));

  useEffect(() => {
    fetchProjectDetails(id);
    fetchSupportProjet();
  }, [id]);

  
  if (loading) {
    return (
      <> 
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <LoadingSpinner/>
           </div>
      </>
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
                                      {/* Logo entreprise */}
                                      <div className="flex-shrink-0">
                                          <figure className="w-24 h-24">
                                              {projet.projet.etp_logo ? (
                                                  <img
                                                      src={`${IMAGE_URL}/img/modules/${projet.projet.module_image}`}
                                                      className="object-cover w-full h-full rounded-xl shadow-md"
                                                      alt="Modules"
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

                                          {/* Notation */}
                                          <div className="flex items-center gap-3">
                                              <div className="flex items-center gap-1">
                                                  {[...Array(5)].map((_, i) => (
                                                      <svg key={i} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                      </svg>
                                                  ))}
                                              </div>
                                              <span className="text-lg font-semibold text-gray-700">0,0</span>
                                              <span className="text-gray-500">(0 avis)</span>
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
                                                  className={`inline-flex px-4 py-2 text-sm font-semibold text-white rounded-full ${getStatusColor(projet.projet.project_status)}`}
                                                  title="Le projet de formation est en cours de préparation, avec des détails tels que le programme, les supports de formation, et la logistique en cours de finalisation."
                                                >
                                                    {projet.projet.project_status || 'Statut inconnu'}
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
                          {/* objectif */}
                        <div className="w-full max-w-8xl mx-auto p-4">
                          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
                            
                            {/* En-tête avec gradient */}
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5">
                              <div className="flex items-center gap-4 text-white">
                                <div className="p-2 bg-white/20 rounded-full">
                                  <Target className="w-6 h-6" />
                                </div>
                                <div>
                                  <h3 className="text-2xl font-bold">Objectifs de la Formation</h3>
                                  <p className="text-emerald-100 text-sm mt-1">
                                    Compétences et connaissances à acquérir
                                  </p>
                                </div>
                                <div className="ml-auto flex items-center gap-2">
                                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
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
                                      className="group flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl border border-gray-200 hover:border-emerald-200 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                                    >
                                      {/* Numéro/Icône */}
                                      <div className="flex-shrink-0 relative">
                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                          {index + 1}
                                        </div>
                                        {/* Ligne de connexion (sauf pour le dernier élément) */}
                                        {index < filteredObjectifs.length - 1 && (
                                          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-emerald-300 to-transparent"></div>
                                        )}
                                      </div>

                                      {/* Contenu de l'objectif */}
                                      <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3">
                                          <p className="text-gray-800 font-medium leading-relaxed">
                                            {objectif.objectif}
                                          </p>
                                          <ArrowRight className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                        </div>
                                        
                                        {/* Indicateur de progression (optionnel) */}
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                            <div 
                                              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-1.5 rounded-full transition-all duration-1000"
                                              style={{ width: `${Math.random() * 40 + 60}%` }}
                                            ></div>
                                          </div>
                                          <span className="text-xs text-gray-500 font-medium">En cours</span>
                                        </div>
                                      </div>

                                      {/* Badge de statut */}
                                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-12">
                                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Target className="w-10 h-10 text-gray-400" />
                                  </div>
                                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Aucun objectif défini</h3>
                                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                    Les objectifs de cette formation n'ont pas encore été définis. Contactez l'administrateur pour plus d'informations.
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Footer avec informations supplémentaires */}
                            <div className="bg-gradient-to-r from-gray-50 to-emerald-50 px-6 py-4 border-t border-gray-100">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* materiel */}
                        <div className="w-full max-w-8xl mx-auto p-4">
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
                              
                              {/* En-tête avec gradient */}
                              <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-5">
                                <div className="flex items-center gap-4 text-white">
                                  <div className="p-2 bg-white/20 rounded-full">
                                    <Package className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <h3 className="text-2xl font-bold">Matériels Nécessaires</h3>
                                    <p className="text-violet-100 text-sm mt-1">
                                      Équipements et ressources requis pour la formation
                                    </p>
                                  </div>
                                  <div className="ml-auto flex items-center gap-2">
                                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                                      {filteredMateriels?.length || 0} éléments
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Contenu */}
                              <div className="p-6">
                                {/* Introduction */}
                                <div className="mb-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-200">
                                  <p className="text-gray-700 leading-relaxed">
                                    <span className="font-semibold text-violet-700">Pour cette formation,</span> les apprenants doivent disposer des matériels et ressources suivants pour optimiser leur expérience d'apprentissage :
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
                                                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
                                                  {/* {getTypeIcon(materiel.type)} */}
                                                </div>
                                              </div>

                                              {/* Contenu */}
                                              <div className="flex-1">
                                                <p className="text-gray-800 font-medium leading-relaxed">
                                                  {materiel.prestation_name}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                  <span className="text-xs px-2 py-1 rounded-full">
                                                  
                                                  </span>
                                                </div>
                                              </div>

                                              {/* Indicateur de statut */}
                                              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
                                  <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                      <Package className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Aucun matériel spécifié</h3>
                                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                      Les exigences matérielles pour cette formation n'ont pas encore été définies.
                                    </p>
                                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
                                      <ShoppingCart className="w-4 h-4" />
                                      Définir les matériels
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Footer avec informations supplémentaires */}
                              <div className="bg-gradient-to-r from-gray-50 to-violet-50 px-6 py-4 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                  </div>
                                  <span className="text-xs text-gray-500">Liste mise à jour</span>
                                </div>
                              </div>
                            </div>
                        </div>
                        {/* agenda */}
                        <div className="w-full max-w-8xl mx-auto p-4">
                          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300" >
                               {/* En-tête avec gradient */}
                              <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-5">
                                <div className="flex items-center gap-4 text-white">
                                  <div className="p-2 bg-white/20 rounded-full">
                                      <CalendarDays className="w-6 h-6 text-blue-600" />
                                  </div>
                                  <div>
                                    <h3 className="text-2xl font-bold">Agenda</h3>
                                    <p className="text-violet-100 text-sm mt-1">
                                      Équipements et ressources requis pour la formation
                                    </p>
                                  </div>
                                  <div className="ml-auto flex items-center gap-2">
                                  </div>
                                </div>
                              </div>
                              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                                  <div className="flex items-center gap-6">
                                  <div className="flex items-center gap-3">
                                      <div className="p-2 bg-blue-100 rounded-lg">
                                      <Calendar className="w-6 h-6 text-blue-600" />
                                      </div>
                                      <div>
                                      <p className="text-2xl font-bold text-blue-600">
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
                                      <p className="text-2xl font-bold text-green-600">
                                          {projet?.totalSession?.sumHourSession ?? '0h'}
                                      </p>
                                      <p className="text-sm text-gray-600">Durée totale</p>
                                      </div>
                                  </div>
                                  </div>
                              </div>
                              <div className="px-6 py-6">
                                   {projet?.seances?.length > 0 ? (
                                      <div className="space-y-6">
                                        {projet?.seances?.map((seance, index) => (
                                          <div
                                            key={index}
                                            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-purple-300 group"
                                          >
                                            <div className="flex items-center justify-between gap-8">
                                              {/* Session Info */}
                                              <div className="flex items-center gap-8 flex-1">
                                                {/* Numéro de séance */}
                                                <div className="flex-shrink-0">
                                                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                                                    <span className="text-white font-bold text-lg">
                                                      {String(index + 1).padStart(2, '0')}
                                                    </span>
                                                  </div>
                                                </div>
                                                
                                                {/* Informations de la séance */}
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1">
                                                  {/* Date */}
                                                  <div className="space-y-2">
                                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date</p>
                                                    <p className="font-semibold text-gray-800 capitalize text-base">
                                                      {formaterDateComplete(seance.dateSeance)}
                                                    </p>
                                                  </div>
                                                  
                                                  {/* Horaires */}
                                                  <div className="space-y-2">
                                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Horaires</p>
                                                    <div className="flex items-center gap-2">
                                                      <Clock className="w-4 h-4 text-purple-500" />
                                                      <span className="font-medium text-gray-700">
                                                        {seance.heureDebut} - {seance.heureFin}
                                                      </span>
                                                    </div>
                                                  </div>
                                                  
                                                  {/* Durée */}
                                                  <div className="space-y-2">
                                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Durée</p>
                                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-700 border border-green-200">
                                                      {seance.intervalle_raw}
                                                    </span>
                                                  </div>
                                                  
                                                  {/* Type */}
                                                  <div className="space-y-2">
                                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</p>
                                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold border ${
                                                      seance.session_catch_up === 'Rattrapage' 
                                                        ? 'bg-orange-100 text-orange-700 border-orange-200' 
                                                        : 'bg-blue-100 text-blue-700 border-blue-200'
                                                    }`}>
                                                      {seance.session_catch_up}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Actions */}
                                              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                {/* Vos boutons d'action ici */}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="text-center py-16">
                                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                          <Calendar className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune session planifiée</h3>
                                        <p className="text-gray-500 text-sm">Les sessions apparaîtront ici une fois planifiées</p>
                                      </div>
                                    )}
                              </div>
                          </div>
                        </div>
                         <div className="w-full max-w-7xl mx-auto space-y-6">
                              {/* Section Programme pédagogique */}
                              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden group hover:shadow-xl transition-all duration-500">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-6 relative overflow-hidden">
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
                                  <div className="flex items-center gap-4 text-white relative z-10">
                                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                                      <BookOpen className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="text-2xl font-bold mb-1">Programme pédagogique</h3>
                                      <p className="text-blue-100 text-sm">
                                        Contenu détaillé et structuré de la formation
                                      </p>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                      <span className="text-sm font-semibold">Détails</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Contenu expandable */}
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {program.programmes.map((p, i) => (
                                        <div 
                                          key={i} 
                                          className="group relative bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-6 shadow-sm border border-blue-100 hover:shadow-lg hover:border-blue-300 transition-all duration-300"
                                        >
                                          {/* Badge numéro */}
                                          <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                            <span className="text-white text-sm font-bold">{i + 1}</span>
                                          </div>

                                          {/* Barre décorative */}
                                          <div className="absolute left-0 top-8 bottom-8 w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                          {/* Contenu */}
                                          <div className="ml-3">
                                            {/* Titre */}
                                            <div className="flex items-center gap-3 mb-4">
                                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                              <h4 className="text-base font-bold text-blue-900 group-hover:text-blue-600 transition-colors">
                                                {p.program_title}
                                              </h4>
                                            </div>

                                            {/* Description avec meilleur formatage */}
                                            <div className="prose prose-sm max-w-none">
                                              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                                {p.program_description
                                                  .replace(/<\/?p>/gi, "")
                                                  .replace(/<span[^>]*>/gi, "")
                                                  .replace(/<\/span>/gi, "")
                                                  .replace(/\s*\n\s*/g, "\n")
                                                  .replace(/-/g, "\n• ")
                                                  .trim()
                                                }
                                              </p>
                                            </div>
                                          </div>

                                          {/* Icône décorative */}
                                          <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <svg className="w-12 h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                            </svg>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              </div>

                              {/* Section Ressources téléchargeables */}
                              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden group hover:shadow-xl transition-all duration-500">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-6 py-6 relative overflow-hidden">
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
                                  <div className="flex items-center gap-4 text-white relative z-10">
                                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                                      <Download className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="text-2xl font-bold mb-1">Ressources téléchargeables</h3>
                                      <p className="text-green-100 text-sm">
                                        Supports de cours, exercices et documents complémentaires
                                      </p>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                      <span className="text-sm font-semibold">Accès libre</span>
                                    </div>
                                  </div>
                                </div>

                                 {/* Contenu avec liste de ressources */}
                                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                                  <div className="space-y-8">
                                    {support?.projets && support.projets.length > 0 ? (
                                      support.projets.map((projet, indexProjet) => (
                                        <div key={indexProjet}>
                                          <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-green-200">
                                            {projet.module_name}
                                          </h3>

                                          {projet.module_ressources && projet.module_ressources.length > 0 ? (
                                            <div className="flex flex-wrap gap-4">
                                              {projet.module_ressources.map((m, i) => (
                                                <div
                                                  key={i}
                                                  className="flex-[0_0_calc(50%-0.5rem)] bg-white rounded-xl p-5 shadow-sm border border-green-100 hover:shadow-lg hover:border-green-300 transition-all duration-200"
                                                >
                                                  <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 flex-1">
                                                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                                        <BookOpen className="w-6 h-6 text-green-600" />
                                                      </div>
                                                      <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-gray-800 truncate">
                                                          {m.module_ressource_name}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                          {m.module_ressource_extension} • {m.taille} MB
                                                        </p>
                                                      </div>
                                                    </div>
                                                    <button className="bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-lg transition-all duration-200 hover:scale-110 flex-shrink-0 ml-3 shadow-md hover:shadow-lg">
                                                      <Download className="w-5 h-5" />
                                                    </button>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            <p className="text-gray-500 text-sm py-4">Aucune ressource disponible</p>
                                          )}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-center py-8">
                                        <p className="text-gray-500">Aucun projet trouvé</p>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Note informative */}
                                  <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-green-200 shadow-sm">
                                    <div className="flex items-start gap-4">
                                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-800 font-semibold mb-1">Accès illimité</p>
                                        <p className="text-sm text-gray-600">Téléchargez et consultez ces ressources à tout moment, même après la formation.</p>
                                      </div>
                                    </div>
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

export default ProjetDetailEmp;