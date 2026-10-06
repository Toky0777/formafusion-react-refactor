import { useEffect, useState } from 'react';
import {
  Star, Calendar, Clock, MapPin, Users, ChevronDown, ChevronUp,
  Download, FileText, File, ChevronLeft, ChevronRight, Upload,
  Image as ImageIcon, Building, Eye, Utensils,
  Target, CheckCircle, Package, Wrench, Book, AlertCircle, ExternalLink, Heart, Share2, Bookmark,
  Maximize, Minimize, Play, Pause
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from '../../../../config/axios';
import { EvaluationDrawer } from '../components/Body/Projects/EvaluationDrawer';
import { IMAGE_URL } from "../../../../config/env";
const ProjectDetail = ({ project }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [openSections, setOpenSections] = useState({
    agenda: true,
    resources: false,
    gallery: false,
    location: true,
    trainingCenter: false,
    catering: false,
    program: true,
    objectives: false,
    materials: false
  });
  const [currentGalleryImage, setCurrentGalleryImage] = useState(0);
  const [currentLocationImage, setCurrentLocationImage] = useState(0);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGalleryFullscreen, setIsGalleryFullscreen] = useState(false);
  const [galleryAutoPlay, setGalleryAutoPlay] = useState(false);
  const { idProjet } = useParams();
  const [drawer, setDrawer] = useState({
    evaluationOpen: false,
    apprenantOpen: false,
    customerOpen: false,
    trainerOpen: false,
    selectedProject: null,
    customerId: null,
    trainerId: null,
  });
  // Données mockées pour les images de salle
  const roomImages = [
    `${IMAGE_URL}/img/salles/Salle 1.avif`,
    `${IMAGE_URL}/img/salles/Salle 2.avif`,
    `${IMAGE_URL}/img/salles/Salle 3.avif`
  ];

  const DataRequest = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`projetsEmp/${idProjet}/detailEmp`);
      setProjectData(data);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError("Impossible de charger les données du projet. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    DataRequest();
  }, [idProjet]);

  // Effet pour le défilement automatique de la galerie
  useEffect(() => {
    let interval;
    if (galleryAutoPlay && projectData?.imagesMomentums?.length > 1) {
      interval = setInterval(() => {
        setCurrentGalleryImage(prev => (prev + 1) % projectData.imagesMomentums.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [galleryAutoPlay, projectData?.imagesMomentums]);

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
    setCurrentLocationImage((prev) => (prev + 1) % roomImages.length);
  };

  const prevLocationImage = () => {
    setCurrentLocationImage((prev) => (prev - 1 + roomImages.length) % roomImages.length);
  };


  const getFileIcon = (extension) => {
    if (extension?.toLowerCase().includes('pdf')) return FileText;
    if (extension?.toLowerCase().match(/(doc|docx)$/)) return FileText;
    if (extension?.toLowerCase().match(/(xls|xlsx)$/)) return FileText;
    if (extension?.toLowerCase().match(/(ppt|pptx)$/)) return FileText;
    return File;
  };
  const onEvaluate = () => {
    console.log("Opening evaluation for:", projectData.projet);
    if (!projectData?.projet || !projectData.projet.idProjet) {
      console.error("Project invalide: projectData.projet est null ou manque de idProjet");
      return;
    }

    setDrawer(prev => ({
      ...prev,
      evaluationOpen: true,
      selectedProject: projectData.projet
    }));
  };
  const onCloseEval = () => {
    handleCloseDrawer('evaluation');
  };
  const handleCloseDrawer = (drawerName) => {
    setDrawer(prev => ({
      ...prev,
      [`${drawerName}Open`]: false,
      ...(drawerName === 'evaluation' && { selectedProject: null }),
      ...(drawerName === 'apprenant' && { selectedProject: null }),
      ...(drawerName === 'customer' && { customerId: null }),
      ...(drawerName === 'trainer' && { trainerId: null }),
    }));
  };
  const getStatusBadgeClasses = (type, value) => {
    const baseClasses = "px-3 py-1.5 rounded-xl text-xs font-medium w-max transition-all duration-200 hover:scale-105";

    if (type === 'projectType') {
      return value === 'Intra' ?
        `${baseClasses} bg-blue-100 text-blue-700 border border-blue-200` :
        `${baseClasses} bg-purple-100 text-purple-700 border border-purple-200`;
    }

    if (type === 'modality') {
      switch (value) {
        case 'Présentielle':
          return `${baseClasses} bg-cyan-100 text-cyan-700 border border-cyan-200`;
        case 'En ligne':
          return `${baseClasses} bg-orange-100 text-orange-700 border border-orange-200`;
        case 'Blended':
          return `${baseClasses} bg-teal-100 text-teal-700 border border-teal-200`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
      }
    }

    if (type === 'status') {
      switch (value) {
        case 'En cours':
          return `${baseClasses} bg-blue-500 text-white border border-blue-600`;
        case 'Terminé':
          return `${baseClasses} bg-green-500 text-white border border-green-600`;
        case 'En préparation':
          return `${baseClasses} bg-yellow-500 text-white border border-yellow-600`;
        default:
          return `${baseClasses} bg-gray-500 text-white border border-gray-600`;
      }
    }

    return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
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

  const RatingStars = ({ rating, maxRating = 5 }) => {
    const displayRating = rating * maxRating;
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

  const safeProject = {
    ...project
  };

  const AccordionSection = ({ title, icon: IconComponent, children, section, defaultOpen = false }) => {
    const isOpen = openSections[section] !== undefined ? openSections[section] : defaultOpen;

    return (
      <div className="card bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div
          className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          onClick={() => toggleSection(section)}
        >
          <div className="flex items-center gap-3">
            <IconComponent className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          </div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400 transition-transform duration-200" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-200" />
          )}
        </div>

        {isOpen && (
          <div className="px-6 pb-6 border-t border-gray-100 pt-4 animate-in slide-in-from-top-2 duration-200">
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
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-4 rounded-xl border border-blue-100">
          <Calendar className="w-4 h-4" />
          <span>
            Vous avez <span className="font-semibold text-blue-600">{sessions.length}</span> session(s)
            d'une durée totale de <span className="font-semibold text-blue-600">{totalHours}</span>
          </span>
        </div>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Aucune session planifiée</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-medium text-gray-700">Date</th>
                  <th className="text-left py-4 px-4 font-medium text-gray-700">Début</th>
                  <th className="text-left py-4 px-4 font-medium text-gray-700">Fin</th>
                  <th className="text-right py-4 px-4 font-medium text-gray-700">Durée</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-b-0">
                    <td className="py-4 px-4 capitalize font-medium text-gray-800">
                      {formatDate(session.dateSeance)}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      <div className='flex items-center gap-1'>
                        <Clock className="w-3 h-3" />
                        {formatTime(session.heureDebut)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      <div className='flex items-center gap-1'>
                        <Clock className="w-3 h-3" />
                        {formatTime(session.heureFin)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-blue-600 font-bold flex justify-end items-center gap-1">
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
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Aucune ressource disponible</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-medium text-gray-700">Nom</th>
                  <th className="text-left py-4 px-4 font-medium text-gray-700">Type</th>
                  <th className="text-left py-4 px-4 font-medium text-gray-700">Taille</th>
                  <th className="text-center py-4 px-4 font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((resource, index) => {
                  const IconComponent = getFileIcon(resource.module_ressource_extension);
                  return (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-b-0">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-5 h-5 text-gray-400" />
                          <span className="font-medium text-gray-800">{resource.module_ressource_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 uppercase text-xs font-mono bg-gray-50 rounded-md px-2 py-1">
                        {resource.module_ressource_extension}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {resource.taille} Mo
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 
                                         rounded-full transition-all duration-200 group">
                          <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
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
    const gallery = projectData?.imagesMomentums || [];

    if (gallery.length === 0) {
      return (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors group cursor-pointer bg-gray-50">
            <div className="flex flex-col items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mb-3 group-hover:text-purple-500 transition-colors" />
              <p className="text-gray-500">
                Aucune photo disponible
              </p>
              <button className="mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Importer des photos
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center rounded-lg">
            <input type="file" multiple accept="image/*" className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg cursor-pointer hover:bg-purple-200 transition-colors duration-200 flex items-center gap-2 text-sm font-medium">
              <Upload className="w-4 h-4" />
              Importer
            </label>
          </div>

          {gallery.length > 1 && (
            <button
              onClick={() => setGalleryAutoPlay(!galleryAutoPlay)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"
            >
              {galleryAutoPlay ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Lecture auto
                </>
              )}
            </button>
          )}
        </div>

        <div className="relative w-full h-80 bg-gray-100 rounded-xl overflow-hidden group">
          <img
            src={gallery[currentGalleryImage]}
            alt={`Photo ${currentGalleryImage + 1}`}
            className="w-full h-full object-cover transition-transform duration-500"
          />

          {gallery.length > 1 && (
            <>
              <button
                onClick={prevGalleryImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white 
                         text-gray-700 p-2 rounded-full shadow-lg transition-all duration-200 
                         opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextGalleryImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white 
                         text-gray-700 p-2 rounded-full shadow-lg transition-all duration-200 
                         opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 px-3 py-1 rounded-full">
                {gallery.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentGalleryImage(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentGalleryImage ? 'bg-white' : 'bg-white/50'
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setIsGalleryFullscreen(true)}
                className="absolute top-4 right-4 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </>
          )}

          <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            {currentGalleryImage + 1} / {gallery.length}
          </div>
        </div>

        {/* Miniatures */}
        {gallery.length > 1 && (
          <div className="grid grid-cols-4 gap-2 mt-4">
            {gallery.slice(0, 4).map((img, index) => (
              <div
                key={index}
                className={`h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${index === currentGalleryImage ? 'border-purple-500' : 'border-transparent'
                  }`}
                onClick={() => setCurrentGalleryImage(index)}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {gallery.length > 4 && (
              <div className="h-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium">
                +{gallery.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const LocationSection = () => {
    const projet = projectData?.projet;

    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-700">
            <p className="font-medium text-blue-800 mb-1">Lieu de formation</p>
            <p>
              La formation aura lieu à{' '}
              <span className="font-semibold text-blue-600">
                {projet?.salle_name || 'Salle non définie'}
              </span>
            </p>
            <p className="text-gray-600 mt-1">
              {projet?.salle_quartier && `${projet.salle_quartier}, `}
              {projet?.ville} {projet?.salle_code_postal}
            </p>
            <button className="mt-2 text-blue-600 text-xs font-medium flex items-center gap-1 hover:text-blue-800 transition-colors">
              <ExternalLink className="w-3 h-3" />
              Voir sur la carte
            </button>
          </div>
        </div>

        <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden group">
          <img
            src={roomImages[currentLocationImage]}
            alt={`Salle ${currentLocationImage + 1}`}
            className="w-full h-full object-cover"
          />

          <button
            onClick={prevLocationImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white 
                     text-gray-700 p-2 rounded-full shadow-lg transition-all duration-200 
                     opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextLocationImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white 
                     text-gray-700 p-2 rounded-full shadow-lg transition-all duration-200 
                     opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 bg-black/30 px-2 py-1 rounded-full">
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
    const projet = projectData?.projet;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200">
            {projet?.customer_logo ? (
              <img
                src={`${IMAGE_URL}/img/customer/${projet.customer_logo}`}
                alt={projet.customer_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building className="w-8 h-8 text-gray-500" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-800 uppercase">
              {projet?.customer_name || 'Centre non défini'}
            </h4>
            <p className="text-sm text-gray-600 mt-1">{projet?.cfp_name}</p>
            <div className="flex gap-2 mt-2">
              <button className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Voir le centre
              </button>
              <button className="text-xs text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1">
                <Share2 className="w-3 h-3" />
                Partager
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CateringSection = () => {
    const restaurations = projectData?.restaurations || [];

    return (
      <div className="space-y-4">
        {restaurations.length > 0 ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Restauration incluse</span>
            </div>
            <p className="text-sm text-green-700">
              {restaurations.length} service(s) de restauration prévu(s)
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {restaurations.map((restauration, index) => (
                <div key={index} className="bg-white p-2 rounded-lg border border-green-100 text-xs">
                  <div className="font-medium text-gray-700">{restauration.type_restauration}</div>
                  <div className="text-gray-500">{restauration.date_restauration}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
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
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
            <Target className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Aucun objectif défini</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {objectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 leading-relaxed">{objective.objectif}</span>
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
          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-orange-500" />
            Matériels fournis
          </h4>
          {materials.length === 0 ? (
            <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-xl">
              <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Aucun matériel fourni</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {materials.map((material, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors">
                  <Package className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{material.prestation_name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Prérequis */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-500" />
            Prérequis
          </h4>
          {prerequis.length === 0 ? (
            <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-xl">
              <Wrench className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Aucun prérequis</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {prerequis.map((prereq, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                  <Wrench className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{prereq.prerequis_name}</span>
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
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white border border-red-200 rounded-xl shadow-sm max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold mb-2">Erreur de chargement</p>
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <button
            onClick={DataRequest}
            className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition font-medium"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!projectData || !projectData.projet) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Aucune donnée de projet disponible.</p>
        </div>
      </div>
    );
  }

  const projet = projectData.projet;
  const moduleImageUrl = projet?.module_image
    ? `${IMAGE_URL}/img/modules/${projet.module_image}`
    : "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=200";

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image du module */}
            <div className="w-full md:w-32 h-32 flex-shrink-0">
              <img
                src={moduleImageUrl}
                className="object-cover w-full h-full rounded-xl shadow-md"
                alt="Module de formation"
              />
            </div>

            {/* Informations principales */}
            <div className="flex-1">
              <div className="flex flex-col gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                    {projet.project_title || projet.module_name || 'Titre non disponible'}
                  </h1>
                  <span className="text-sm text-gray-500 font-medium">
                    Réf : {projet.project_reference}
                  </span>
                </div>

                {/* Notation */}
                <div className="flex items-center gap-3">
                  <RatingStars rating={projectData.noteGeneral || 0} />
                  <span className="text-lg font-bold text-gray-800">
                    {((projectData.noteGeneral || 0) * 5).toFixed(1)}
                  </span>
                  <span className="text-gray-500 text-sm">
                    ({projectData.countNotationProjet || 0} avis)
                  </span>
                </div>

                {/* Dates et informations */}
                <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                    <Calendar className="w-4 h-4" />
                    <span>Début : {projectData.deb || 'Non défini'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span>Fin : {projectData.fin || 'Non défini'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                    <Users className="w-4 h-4" />
                    <span>Places : {projectData.place_reserved || 0}/{projectData.nbPlace || 'Illimité'}</span>
                  </div>
                </div>

                {/* Badges de statut */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className={getStatusBadgeClasses('projectType', projet.project_type)}>
                    {projet.project_type}
                  </span>
                  <span className={getStatusBadgeClasses('modality', projet.modalite)}>
                    {projet.modalite}
                  </span>
                  <span className={getStatusBadgeClasses('status', projet.project_status)}>
                    {projet.project_status}
                  </span>
                  <span className="px-3 py-1.5 text-xs border border-gray-200 rounded-xl bg-gray-100 text-gray-700 font-medium">
                    Domaine : {projet.domaine_name}
                  </span>
                </div>

                {/* Description */}
                {projet.project_description && (
                  <p className="text-gray-700 leading-relaxed text-sm line-clamp-3">
                    {projet.project_description}
                  </p>
                )}
              </div>
            </div>

            {/* Bouton d'évaluation */}
            <div className="flex flex-col gap-3">
              <button
                className="px-6 py-3 bg-gradient-to-r from-blue-700 via-purple-500 to-purple-400 text-white rounded-lg
                        hover:from-purple-800 hover:via-purple-600 hover:to-purple-500 transition-all duration-200
                        shadow-md hover:shadow-lg font-bold flex items-center gap-2 whitespace-nowrap"
                onClick={() => onEvaluate(safeProject)}
              >
                <Star className="w-4 h-4 animate-bounce text-yellow-300" />
                Évaluez avant tout le monde !
              </button>
              <div className="flex gap-2 justify-center">
                <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all">
                  <Bookmark className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-xl overflow-hidden">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-medium text-sm transition-all duration-200 border-b-2 ${activeTab === 'overview'
                ? 'border-purple-500 text-purple-600 bg-purple-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Vue d'ensemble du projet
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-4 font-medium text-sm transition-all duration-200 border-b-2 ${activeTab === 'details'
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
                <div className="lg:col-span-2 space-y-6">
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
                <div className="lg:col-span-1 space-y-6">
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
                <div className="lg:col-span-1 space-y-6">
                  <AccordionSection title="Matériels et prérequis" icon={Package} section="materials">
                    <MaterialsSection />
                  </AccordionSection>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Gallery Fullscreen */}
      {isGalleryFullscreen && projectData?.imagesMomentums?.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-6xl max-h-screen flex items-center justify-center">
            <button
              onClick={() => setIsGalleryFullscreen(false)}
              className="absolute top-4 right-4 z-10 text-white p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            >
              <Minimize className="w-6 h-6" />
            </button>

            <img
              src={projectData.imagesMomentums[currentGalleryImage]}
              alt={`Photo ${currentGalleryImage + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {projectData.imagesMomentums.length > 1 && (
              <>
                <button
                  onClick={prevGalleryImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextGalleryImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {projectData.imagesMomentums.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentGalleryImage(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentGalleryImage ? 'bg-white' : 'bg-white/50'
                        }`}
                    />
                  ))}
                </div>

                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentGalleryImage + 1} / {projectData.imagesMomentums.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {drawer.evaluationOpen && drawer.selectedProject && (<EvaluationDrawer project={drawer.selectedProject} onClose={() => handleCloseDrawer('evaluation')} />)}
    </div>
  );
};

export default ProjectDetail;