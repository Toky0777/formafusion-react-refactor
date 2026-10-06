import { useEffect, useState } from 'react';
import { Star, Calendar, Clock, MapPin, Users, ChevronDown, ChevronUp, Download, FileText, File, ChevronLeft, ChevronRight, Upload, Image as ImageIcon, Building, Utensils, Target, CheckCircle, Package, Wrench, Book } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import { NavbarEvaluation } from '../../../components/navbar/navbar-evaluation';
import { API_URL, IMAGE_URL } from "../../../config/env";


const ProjectFormDetails = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [openSections, setOpenSections] = useState({
    agenda: true,
    resources: false,
    gallery: false,
    location: true,
    trainingCenter: false,
    trainers: false,
    catering: false,
    program: true,
    objectives: false,
    materials: false
  });
  const [currentGalleryImage, setCurrentGalleryImage] = useState(0);
  const [currentLocationImage, setCurrentLocationImage] = useState(0);
  const [projectData, setProjectData] = useState({});
  const [projet, setProjet] = useState({})
  const [cfp, setCfp] = useState({})
  const [restaurations, setRestaurations] = useState([])
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true);
  const { idProjet } = useParams();
  const token = localStorage.getItem("token");
  const [formation, setFormation] = useState({})

  // Données mockées pour les images de salle (à remplacer par vos vraies données si disponibles)
  const [roomImages, setRoomImages] = useState([]);

  const DataRequest = async () => {
    setLoading(true);
    console.log(idProjet);
    //const route = hasRole('Référent') ? `${API_URL}etp/projets/${idProjet}/detail` : `${API_URL}projetsForm/${idProjet}/detailForm`
    try {
      // Décommentez cette partie pour utiliser l'API réelle

      const { data } = await axios.get(`${API_URL}/projetsForm/${idProjet}/detailForm`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProjectData(data);
      setProjet(data.projet)
      setCfp(data.cfp)
      setRestaurations(data.restaurations)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    DataRequest();
  }, [idProjet]);

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const nextGalleryImage = () => {
    if (projectData?.imagesMomentums?.length > 0) {
      setCurrentGalleryImage((prev) => (prev + 1) % projectData.imagesMomentums.length);
    }
  };

  const prevGalleryImage = () => {
    if (projectData?.imagesMomentums?.length > 0) {
      setCurrentGalleryImage((prev) => (prev - 1 + projectData.imagesMomentums.length) % projectData.imagesMomentums.length);
    }
  };

  const nextLocationImage = () => {
    setCurrentLocationImage((prev) => (prev + 1) % projectData.imagesMomentums.length);
  };

  const prevLocationImage = () => {
    setCurrentLocationImage((prev) => (prev - 1 + projectData.imagesMomentums.length) % projectData.imagesMomentums.length);
  };

  const getFileIcon = (extension) => {
    if (extension?.toLowerCase().includes('pdf')) return FileText;
    return File;
  };

  const getStatusBadgeClasses = (type, value) => {
    const baseClasses = "px-3 py-1 rounded-xl text-sm font-medium w-max transition-all duration-200 hover:scale-105";

    if (type === 'projectType') {
      return value === 'Intra' ?
        `${baseClasses} bg-blue-100 text-blue-700` :
        `${baseClasses} bg-purple-100 text-purple-700`;
    }

    if (type === 'modality') {
      switch (value) {
        case 'Présentielle':
          return `${baseClasses} bg-cyan-100 text-cyan-700`;
        case 'En ligne':
          return `${baseClasses} bg-orange-100 text-orange-700`;
        case 'Blended':
          return `${baseClasses} bg-teal-100 text-teal-700`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-700`;
      }
    }

    if (type === 'status') {
      switch (value) {
        case 'En cours':
          return `${baseClasses} bg-blue-500 text-white`;
        case 'Terminé':
          return `${baseClasses} bg-green-500 text-white`;
        case 'En préparation':
          return `${baseClasses} bg-yellow-500 text-white`;
        default:
          return `${baseClasses} bg-gray-500 text-white`;
      }
    }

    return `${baseClasses} bg-gray-100 text-gray-700`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString?.substring(0, 5) || '';
  };

  const calculateDuration = (start, end) => {
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    const diff = endTime - startTime;
    return Math.round(diff / (1000 * 60 * 60 * 100)) / 100;
  };

  const RatingStars = ({ rating, maxRating = 5 }) => {
    const displayRating = rating * maxRating; // Convertir la note de 0-1 à 0-5
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < displayRating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
              } transition-colors duration-200`}
          />
        ))}
      </div>
    );
  };

  const AccordionSection = ({ title, icon: IconComponent, children, section, defaultOpen = false }) => {
    const isOpen = openSections[section] !== undefined ? openSections[section] : defaultOpen;

    return (
      <div className="overflow-hidden bg-white border border-gray-100 shadow-xl card rounded-xl">
        <div
          className="flex items-center justify-between p-6 transition-colors duration-200 cursor-pointer hover:bg-gray-50"
          onClick={() => toggleSection(section)}
        >
          <div className="flex items-center gap-3">
            <IconComponent className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          </div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400 transition-transform duration-200" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-200" />
          )}
        </div>

        {isOpen && (
          <div className="px-6 pt-4 pb-6 duration-200 border-t border-gray-100 animate-in slide-in-from-top-2">
            {children}
          </div>
        )}
      </div>
    );
  };

  const AgendaSection = () => {
    const sessions = projectData?.seances || [];
    const totalHours = projectData?.totalSession?.sumHourSession || '0:00:00';

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 text-sm text-gray-600 rounded-lg bg-blue-50">
          <Calendar className="w-4 h-4" />
          <span>
            Vous avez <span className="font-semibold text-blue-600">{sessions.length}</span> session(s)
            d'une durée totale de <span className="font-semibold text-blue-600">{totalHours}</span>
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Aucune session planifiée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Date</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Début</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Fin</th>
                  <th className="px-4 py-3 font-medium text-right text-gray-700">Durée</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, index) => (
                  <tr key={index} className="transition-colors border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800 capitalize">
                      {formatDate(session.dateSeance)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className='flex items-center gap-1 justify-content-center'>
                        <Clock className="w-3 h-3" />
                        {formatTime(session.heureDebut)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className='flex items-center gap-1 justify-content-center'>
                        <Clock className="w-3 h-3" />
                        {formatTime(session.heureFin)}
                      </div>
                    </td>
                    <td className="flex items-center justify-end gap-1 px-4 py-3 font-bold text-blue-600">
                      {session.intervalle_raw}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const ResourcesSection = () => {
    const resources = projectData?.module_ressources || [];

    return (
      <div className="space-y-4">
        {resources.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Aucune ressource disponible</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Nom</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Type</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Taille</th>
                  <th className="px-4 py-3 font-medium text-center text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((resource, index) => {
                  const IconComponent = getFileIcon(resource.module_ressource_extension);
                  return (
                    <tr key={index} className="transition-colors border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-5 h-5 text-gray-400" />
                          <span className="font-medium text-gray-800">{resource.module_ressource_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600 uppercase">
                        {resource.module_ressource_extension}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {resource.taille} Mo
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="p-2 text-gray-400 transition-all duration-200 rounded-full hover:text-purple-600 hover:bg-purple-50 group">
                          <Download className="w-4 h-4 transition-transform group-hover:scale-110" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const GallerySection = () => {
    if (gallery.length === 0) {
      return (
        <div className="space-y-4">
          <div className="p-8 text-center transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-400 group">
            <div className="flex flex-col items-center justify-center">
              <Upload className="w-12 h-12 mb-4 text-gray-400 group-hover:text-purple-500" />
              <h3 className="mb-2 text-lg font-medium text-gray-700">
                Cliquer ou glisser pour télécharger
              </h3>
              <p className="text-gray-500">
                SVG, PNG, JPG, GIF ou WEBP <strong>(MAX. 5 Mo)</strong>
              </p>
            </div>
          </div>
          <button className="w-full py-3 font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
            Importer des photos
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center rounded-lg">
            <input type="file" multiple accept="image/*" className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="flex items-center gap-2 px-4 py-2 text-sm text-purple-700 transition-colors duration-200 bg-purple-100 rounded-lg cursor-pointer hover:bg-purple-200">
              <Upload className="w-4 h-4" />
              Importer
            </label>
          </div>
        </div>

        <div className="relative w-full overflow-hidden bg-gray-100 h-72 rounded-xl group">
          <img
            src={gallery[currentGalleryImage]}
            alt={`Photo ${currentGalleryImage + 1}`}
            className="object-cover w-full h-full"
          />

          {gallery.length > 1 && (
            <>
              <button
                onClick={prevGalleryImage}
                className="absolute p-2 text-gray-700 transition-all duration-200 -translate-y-1/2 rounded-full shadow-lg opacity-0 left-4 top-1/2 bg-white/80 hover:bg-white group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextGalleryImage}
                className="absolute p-2 text-gray-700 transition-all duration-200 -translate-y-1/2 rounded-full shadow-lg opacity-0 right-4 top-1/2 bg-white/80 hover:bg-white group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute flex gap-2 -translate-x-1/2 bottom-4 left-1/2">
                {gallery.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentGalleryImage(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentGalleryImage ? 'bg-white' : 'bg-white/50'
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const LocationSection = () => {
    const projet = projectData?.projet;

    return (
      <div className="space-y-4">
        <div className="flex items-start gap-2 p-4 rounded-lg bg-blue-50">
          <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p>
              La formation aura lieu à{' '}
              <span className="font-semibold text-blue-600">
                {projet?.salle_name || 'Salle non définie'}
              </span>
            </p>
            <p className="mt-1 text-gray-600">
              {projet?.salle_quartier && `${projet.salle_quartier}, `}
              {projet?.ville} {projet?.salle_code_postal}
            </p>
          </div>
        </div>

        <div className="relative w-full h-64 overflow-hidden bg-gray-100 rounded-xl group">
          <img
            src=
            {`${IMAGE_URL}/img/salles/Salle ${currentLocationImage + 1}.avif` ||
              `${IMAGE_URL}/img/salles/Salle ${currentLocationImage + 1}.jpeg` ||
              `${IMAGE_URL}/img/salles/Salle ${currentLocationImage + 1}.webp`
            }
            alt={`Salle ${currentLocationImage + 1}`}
            className="object-cover w-full h-full"
          />

          <button
            onClick={prevLocationImage}
            className="absolute p-2 text-gray-700 transition-all duration-200 -translate-y-1/2 rounded-full shadow-lg opacity-0 left-4 top-1/2 bg-white/80 hover:bg-white group-hover:opacity-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextLocationImage}
            className="absolute p-2 text-gray-700 transition-all duration-200 -translate-y-1/2 rounded-full shadow-lg opacity-0 right-4 top-1/2 bg-white/80 hover:bg-white group-hover:opacity-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="absolute flex gap-1 -translate-x-1/2 bottom-4 left-1/2">
            {roomImages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentLocationImage ? 'bg-white' : 'bg-white/50'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const TrainingCenterSection = () => {

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-center w-16 h-16 overflow-hidden bg-gray-200 rounded-xl">
            {projet?.customer_logo ? (
              <img
                src={`${IMAGE_URL}/img/customer/${cfp?.cfp_logo}`}
                alt={cfp.cfp_name}
                className="object-cover w-full h-full"
              />
            ) : (
              <Building className="w-8 h-8 text-gray-500" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-800 uppercase">
              {cfp?.cfp_name || 'Centre non défini'}
            </h4>
            <p>{cfp?.email}</p>
          </div>
        </div>
      </div>
    );
  };

  const CateringSection = () => {

    return (
      <div className="space-y-4">
        {restaurations.length > 0 ? (
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Restauration incluse</span>
            </div>
            <p className="text-sm text-green-700">
              {restaurations.length} service(s) de restauration prévu(s)
            </p>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <Utensils className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Aucune restauration prévue</p>
          </div>
        )}
      </div>
    );
  };

  const ObjectivesSection = () => {
    const objectives = projectData?.objectifs || [];

    return (
      <div className="space-y-4">
        {objectives.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Aucun objectif défini</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {objectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-3 p-3 border border-green-200 rounded-lg bg-green-50">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed text-gray-700">{objective.objectif}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const MaterialsSection = () => {
    const materials = projectData?.materiels || [];
    const prerequis = projectData?.prerequis || [];

    return (
      <div className="space-y-6">
        {/* Matériels */}
        <div>
          <h4 className="mb-3 font-medium text-gray-800">Matériels fournis</h4>
          {materials.length === 0 ? (
            <div className="py-4 text-center text-gray-500">
              <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Aucun matériel fourni</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {materials.map((material, index) => (
                <li key={index} className="flex items-start gap-3 p-3 border border-orange-200 rounded-lg bg-orange-50">
                  <Package className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{material.prestation_name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Prérequis */}
        <div>
          <h4 className="mb-3 font-medium text-gray-800">Prérequis</h4>
          {prerequis.length === 0 ? (
            <div className="py-4 text-center text-gray-500">
              <Wrench className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Aucun prérequis</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {prerequis.map((prereq, index) => (
                <li key={index} className="flex items-start gap-3 p-3 border border-blue-200 rounded-lg bg-blue-50">
                  <Wrench className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{prereq.prerequis_name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-purple-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Aucune donnée disponible</p>
        </div>
      </div>
    );
  }
  const moduleImageUrl = projet?.module_image
    ? `${IMAGE_URL}/img/modules/${projet?.module_image}`
    : "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=200";

  return <>
    <NavbarEvaluation />
    {loading && <p className="mt-4 text-gray-600">Chargement ...</p>}
    <div className="w-full min-h-screen bg-gray-50">
      <div className="p-6 mx-auto bg-white max-w-7xl">
        {/* Header */}
        <div className='flex justify-end'>
          <Link
            to="/projetsForm"
            className="inline-flex items-center px-4 py-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            Retour à l'accueil
          </Link>
        </div>
        <div className="grid w-full grid-cols-1 gap-6 mb-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-3">
            <div className="flex items-start gap-6">
              {/* Image du module */}
              <div className="flex-shrink-0 w-24 h-24">
                <img
                  src={moduleImageUrl}
                  className="object-cover w-full h-full shadow-md rounded-xl"
                  alt="Module de formation"
                />
              </div>

              {/* Informations principales */}
              <div className="flex flex-col justify-center flex-1 gap-4">
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl font-bold leading-tight text-slate-800">
                    {projet?.project_title || projet?.module_name}
                  </h1>
                  <span className="text-lg font-medium text-slate-600">
                    Réf : {projet?.project_reference}
                  </span>
                </div>

                {/* Notation */}
                <div className="flex items-center gap-3">
                  <RatingStars rating={projectData.noteGeneral || 0} />
                  <span className="text-lg font-medium">
                    {((projectData.noteGeneral || 0) * 5).toFixed(1)}
                  </span>
                  <span className="text-gray-500">
                    ({projectData.countNotationProjet || 0} avis)
                  </span>
                </div>

                {/* Dates et informations */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Début : {projectData.deb}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Fin : {projectData.fin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Places : {projectData.place_reserved || 0}/{projectData.nbPlace || 'Illimité'}</span>
                  </div>
                </div>

                {/* Badges de statut */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className={getStatusBadgeClasses('projectType', projet.project_type)}>
                    {projet.project_type}
                  </span>
                  <span className={getStatusBadgeClasses('modality', projet.modalite)}>
                    {projet.modalite}
                  </span>
                  <span className={getStatusBadgeClasses('status', projet.project_status)}>
                    {projet.project_status}
                  </span>
                  <div className="px-3 py-1 text-sm bg-white border border-slate-200 rounded-xl">
                    Domaine : {projet.domaine_name}
                  </div>
                </div>

                {/* Description */}
                {projet.project_description && (
                  <p className="leading-relaxed text-gray-700 line-clamp-3">
                    {projet.project_description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full">
          {/* Tab Navigation */}
          <div className="flex mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-medium text-sm transition-all duration-200 border-b-2 ${activeTab === 'overview'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Vue d'ensemble du projet
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 font-medium text-sm transition-all duration-200 border-b-2 ${activeTab === 'details'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Détail de la formation
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Colonne principale */}
                <div className="space-y-6 lg:col-span-2">
                  <AccordionSection title="Agenda" icon={Calendar} section="agenda" defaultOpen>
                    <AgendaSection />
                  </AccordionSection>

                  <AccordionSection title="Support de cours" icon={Book} section="resources">
                    <ResourcesSection />
                  </AccordionSection>

                  <AccordionSection title="Momentum (Galerie Photo)" icon={ImageIcon} section="gallery">
                    <GallerySection />
                  </AccordionSection>
                </div>

                {/* Colonne secondaire */}
                <div className="space-y-6 lg:col-span-1">
                  <AccordionSection title="Lieu et salle" icon={MapPin} section="location" defaultOpen>
                    <LocationSection />
                  </AccordionSection>

                  <AccordionSection title="Centre de formation" icon={Building} section="trainingCenter">
                    <TrainingCenterSection />
                  </AccordionSection>

                  <AccordionSection title="Restauration" icon={Utensils} section="catering">
                    <CateringSection />
                  </AccordionSection>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Programme principal */}
                <div className="lg:col-span-2">
                  <AccordionSection title="Objectifs de la formation" icon={Target} section="objectives" defaultOpen>
                    <ObjectivesSection />
                  </AccordionSection>
                </div>

                {/* Informations complémentaires */}
                <div className="space-y-6 lg:col-span-1">
                  <AccordionSection title="Matériels et prérequis" icon={Package} section="materials">
                    <MaterialsSection />
                  </AccordionSection>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </>
};

export default ProjectFormDetails;