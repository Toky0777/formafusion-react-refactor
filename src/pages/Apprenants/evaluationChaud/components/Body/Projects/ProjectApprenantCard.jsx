import { useState, useRef, useEffect } from 'react';
import {
  EllipsisVerticalIcon,
  EyeIcon,
  ChartBarIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { formatDate } from '../../../utils/dateUtils';
import { Link, useNavigate } from 'react-router-dom';
import { IMAGE_URL } from "../../../../../../config/env";

export function ProjectApprenantCard({
  project,
  onEvaluate,
  onShowParticipants,
  onShowClient,
  onShowSessions,
  onViewTrainerCV
}) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const overlayRef = useRef(null);

  // Valeurs par défaut pour éviter les erreurs
  const safeProject = {
    ...project,
    apprs: Array.isArray(project.apprs) ? project.apprs : [],
    formateurs: Array.isArray(project.formateurs) ? project.formateurs : [],
    etp_name: Array.isArray(project.etp_name) ? project.etp_name : [],
    cfp_name: project.cfp_name || '',
    module_name: project.module_name || project.title || 'Sans titre',
    project_type: project.project_type || project.type || 'Inconnu',
    modalite: project.modalite || project.modality || 'Inconnu',
    project_status: project.project_status || project.status || 'Inconnu',
    totalSessionHour: project.totalSessionHour || '00:00:00',
    seanceCount: project.seanceCount || 0,
    salle_name: project.salle_name || '',
    sub_name: project.sub_name || '',
    salle_quartier: project.salle_quartier || '',
    ville: project.ville || project.location || '',
    salle_code_postal: project.salle_code_postal || '',
    dateDebut: project.dateDebut || '',
    dateFin: project.dateFin || '',
    etp_logo: Array.isArray(project.etp_name) && project.etp_name.length > 0
      ? project.etp_name[0].etp_logo
      : project.etp_logo || null,
  };

  const handleImageError = (id, type) => {
    setImageErrors(prev => ({ ...prev, [`${type}-${id}`]: true }));
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Terminé':
        return 'bg-emerald-500 text-white border-emerald-500';
      case 'En cours':
        return 'bg-blue-500 text-white border-blue-500';
      case 'En préparation':
        return 'bg-yellow-400 text-gray-900 border-yellow-400';
      case 'Annulé':
        return 'bg-red-500 text-white border-red-500';
      default:
        return 'bg-gray-500 text-white border-gray-500';
    }
  };

  const getTypeStyles = (type) => {
    return type === 'Intra'
      ? 'text-indigo-700 bg-indigo-50 border-indigo-200'
      : 'text-purple-700 bg-purple-50 border-purple-200';
  };

  const getModalityStyles = (modality) => {
    switch (modality) {
      case 'Présentielle':
        return 'text-cyan-700 bg-cyan-50 border-cyan-200';
      case 'Distanciel':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'Hybride':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  // Fonction pour générer des initiales à partir du nom
  const getInitials = (name, firstName) => {
    const firstLetter = name?.[0]?.toUpperCase() || '';
    const secondLetter = firstName?.[0]?.toUpperCase() || '';
    return `${firstLetter}${secondLetter}`;
  };

  // Fonction pour formater la durée
  const formatDuration = (timeString) => {
    if (!timeString) return '0h';
    const [hours] = timeString.split(':');
    return `${hours}h`;
  };
  
  const onViewDetails = (id) => {
    navigate(`/particulier/evaluations/projetsEmp/${id}/detailEmp`);
  }

  // Gérer le clic en dehors de la carte
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsHovered(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className="group relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden h-[450px] flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Overlay avec boutons d'action au survol - Placé en premier pour ne pas bloquer les autres éléments */}
      {/* <div 
        ref={overlayRef}
        className={clsx(
          "absolute inset-0 bg-gradient-to-b from-indigo-900/80 via-indigo-800/70 to-indigo-900/80 z-10 flex flex-col items-center justify-center gap-4 p-6 transition-all duration-300 rounded-2xl",
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <h3 className="text-xl font-bold text-white text-center mb-2">
          Évaluer cette formation
        </h3>
        <p className="text-indigo-100 text-center mb-6 text-sm">
          Partagez votre expérience pour nous aider à améliorer nos formations
        </p>
        
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Empêche la propagation du clic
              console.log("Evaluate button clicked for project:", safeProject);
              onEvaluate(safeProject);
            }}
            className="flex items-center justify-center gap-2 bg-white text-indigo-700 font-semibold py-3 px-4 rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <StarIcon className="w-5 h-5" />
            Évaluer maintenant
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation(); // Empêche la propagation du clic
              onViewDetails(safeProject.idProjet);
            }}
            className="flex items-center justify-center gap-2 border-2 border-white text-white font-semibold py-3 px-4 rounded-xl hover:bg-white/10 transition-all duration-200"
          >
            <EyeIcon className="w-5 h-5" />
            Voir les détails
          </button>
        </div>
      </div> */}

      <div className="p-6 flex-1 flex flex-col relative z-0">
        {/* Header avec menu contextuel */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <Link
              to={`/particulier/evaluations/projetsEmp/${safeProject.idProjet}/detailEmp`}
              className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2 mb-2 group-hover:underline block"
              title={safeProject.module_name}
            >
              {safeProject.module_name}
            </Link>
            {safeProject.cfp_name && (
              <p className="text-sm text-gray-500 mb-2">
                Par {safeProject.cfp_name}
              </p>
            )}
          </div>

          <div className="relative ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Options du projet"
            >
              <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-gray-200 py-2 w-56 z-20 animate-in fade-in-80">
                <div className="px-4 py-2 text-sm font-medium text-gray-500 border-b border-gray-100">
                  Actions rapides
                </div>
                <Link
                  to={`/particulier/evaluations/projetsEmp/${safeProject.idProjet}/detailEmp`}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <EyeIcon className="w-4 h-4" />
                  Voir les détails
                </Link>
                <button
                  onClick={() => {
                    console.log("Evaluate button clicked for project:", safeProject);
                    onEvaluate(safeProject);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                >
                  <ChartBarIcon className="w-4 h-4" />
                  Évaluer le projet
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Badges d'état */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={clsx(
              'px-3 py-1 text-xs rounded-full border font-medium transition-colors',
              getTypeStyles(safeProject.project_type)
            )}>
              {safeProject.project_type}
            </span>
            <span className={clsx(
              'px-3 py-1 text-xs rounded-full border font-medium transition-colors',
              getModalityStyles(safeProject.modalite)
            )}>
              {safeProject.modalite}
            </span>
          </div>
          <span className={clsx(
            'px-3 py-1 text-xs rounded-full border font-medium transition-colors',
            getStatusStyles(safeProject.project_status)
          )}>
            {safeProject.project_status}
          </span>
        </div>

        {/* Participants et Client */}
        <div className="flex items-center justify-between mb-4">
          {/* Participants */}
          <button
            className="flex -space-x-2 hover:scale-105 transition-transform group/participants"
            onClick={() => onShowParticipants(safeProject)}
            title={`${safeProject.apprs.length} participants - Cliquer pour voir`}
            aria-label={`Voir les ${safeProject.apprs.length} participants`}
          >
            {safeProject.apprs.length > 0 ? (
              safeProject.apprs.slice(0, 5).map((participant, index) => (
                <div key={participant.idEmploye || index} className="relative">
                  {imageErrors[`participant-${participant.idEmploye}`] || !participant.emp_photo ? (
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {getInitials(participant.emp_name, participant.emp_firstname)}
                    </div>
                  ) : (
                    <img
                      src={participant.emp_photo}
                      alt={participant.emp_name || 'Participant'}
                      className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                      onError={() => handleImageError(participant.idEmploye, 'participant')}
                    />
                  )}
                  {index === 0 && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>
              ))
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-gray-600 text-xs">
                0
              </div>
            )}
            {safeProject.apprs.length > 5 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold group-hover/participants:bg-indigo-200 transition-colors">
                +{safeProject.apprs.length - 5}
              </div>
            )}
          </button>

          {/* Logo Client */}
          <button 
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onShowClient(
              safeProject.etp_name.length > 0 ? safeProject.etp_name[0].idEtp : safeProject.idEtp,
              safeProject.idProjet
            )}
            title={safeProject.etp_name.length > 0 ? safeProject.etp_name[0].etp_name : 'Client'}
            aria-label="Voir les détails du client"
          >
            {safeProject.etp_logo ? (
              <img
                src={safeProject.etp_logo}
                alt={safeProject.etp_name.length > 0 ? safeProject.etp_name[0].etp_name : 'Client'}
                className="h-10 w-20 object-contain grayscale hover:grayscale-0 transition-all duration-300 rounded-lg ring-2 ring-white shadow-sm"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : safeProject.etp_name.length > 0 ? (
              <div
                className="h-10 w-36 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg ring-2 ring-white flex items-center justify-center text-xs font-bold text-gray-700 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 shadow-sm"
              >
                <span className="truncate px-2">
                  {safeProject.etp_name.length > 0 ? safeProject.etp_name[0].etp_name : 'Client'}
                </span>
              </div>
            ) : (
              <div
                className="h-10 w-36 bg-gray-100 rounded-lg ring-2 ring-white flex items-center justify-center text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors shadow-sm"
              >
                <UserGroupIcon className="w-4 h-4 mr-1" />
                Client
              </div>
            )}
          </button>
        </div>

        {/* Formateurs et Statistiques */}
        <div className="flex items-center justify-between mb-4">
          {/* Formateurs */}
          <div className="flex -space-x-2" title="Formateurs">
            {safeProject.formateurs.length > 0 ? (
              safeProject.formateurs.slice(0, 3).map((trainer, index) => (
                <div key={trainer.idFormateur || index} className="relative">
                  {imageErrors[`trainer-${trainer.idFormateur}`] ? (
                    <button
                      onClick={() => onViewTrainerCV(trainer.idFormateur)}
                      className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white text-xs font-bold shadow-sm hover:scale-110 transition-transform"
                      title={`Voir le CV de ${trainer.form_name || 'Formateur'}`}
                    >
                      {getInitials(trainer.form_name, trainer.form_firstname)}
                    </button>
                  ) : (
                    <button
                      onClick={() => onViewTrainerCV(trainer.idFormateur)}
                      title={`Voir le CV de ${trainer.form_name || 'Formateur'}`}
                    >
                      <img
                        src={`${IMAGE_URL}/img/formateurs/${trainer.form_photo}`}
                        alt={trainer.form_name || 'Formateur'}
                        className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm hover:scale-110 transition-transform"
                        onError={() => handleImageError(trainer.idFormateur, 'trainer')}
                      />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                ?
              </div>
            )}
            {safeProject.formateurs.length > 3 && (
              <button
                onClick={() => {
                  // Option: show all trainers or first trainer's CV
                  if (safeProject.formateurs.length > 0) {
                    onViewTrainerCV(safeProject.formateurs[0].idFormateur);
                  }
                }}
                className="w-8 h-8 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold hover:bg-purple-200 transition-colors"
                title="Voir les formateurs"
              >
                +{safeProject.formateurs.length - 3}
              </button>
            )}
          </div>

          {/* Statistiques */}
          <div className="flex items-center gap-4">
            <span
              className="flex items-center gap-1 text-lg font-medium text-gray-600 group/stat"
              title="Durée totale"
            >
              <ClockIcon className="w-4 h-4" />
              <span className="font-bold">{formatDuration(safeProject.totalSessionHour)}</span>
              <span className="text-sm text-gray-400 font-normal">total</span>
            </span>
            <button
              className="flex items-center gap-1 text-lg font-medium text-gray-600 hover:text-indigo-600 transition-colors group/stat"
              onClick={() => onShowSessions(safeProject.idProjet)}
              title="Nombre de sessions"
              aria-label="Voir les sessions"
            >
              <UserGroupIcon className="w-4 h-4 group-hover/stat:scale-110 transition-transform" />
              <span className="font-bold">{safeProject.seanceCount}</span>
              <span className="text-sm text-gray-400 font-normal">sessions</span>
            </button>
          </div>
        </div>

        {/* Localisation */}
        <div className="mb-4 hover:bg-gray-50 p-3 rounded-xl transition-colors duration-200 border border-gray-100 hover:border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <MapPinIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium">Lieu de formation</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${safeProject.salle_name}${safeProject.sub_name ? `, ${safeProject.sub_name}` : ''}${safeProject.salle_quartier ? `, ${safeProject.salle_quartier}` : ''}, ${safeProject.ville}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:underline line-clamp-1 flex items-center gap-1 group/location"
                onClick={(e) => e.stopPropagation()}
              >
                {`${safeProject.salle_name}${safeProject.sub_name ? `, ${safeProject.sub_name}` : ''}${safeProject.salle_quartier ? `, ${safeProject.salle_quartier}` : ''}, ${safeProject.ville}`}
                <ArrowTopRightOnSquareIcon className="w-3 h-3 opacity-0 group-hover/location:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <h5 className="text-gray-400 text-xs mb-1 uppercase tracking-wide">Début</h5>
              <p className="text-gray-900 font-semibold flex items-center justify-center gap-1 text-sm">
                <CalendarDaysIcon className="w-4 h-4 text-indigo-500" />
                {formatDate(safeProject.dateDebut)}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <h5 className="text-gray-400 text-xs mb-1 uppercase tracking-wide">Fin</h5>
              <p className="text-gray-900 font-semibold flex items-center justify-center gap-1 text-sm">
                <CalendarDaysIcon className="w-4 h-4 text-indigo-500" />
                {formatDate(safeProject.dateFin)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}