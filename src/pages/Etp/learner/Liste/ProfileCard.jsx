import { useState, useEffect } from 'react';
import axios from '../../../../config/axios';
import toastr from 'toastr';
import {
  Loader,
  Edit,
  Trash2,
  Building,
  Mail,
  Phone,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  MapPin,
} from 'lucide-react';
import { useModal } from '../../../../contexts/etp/ModalContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import EditApprenantDrawer from './EditApprenantDrawer';
import EmployeeDetailsPanel from './EmployeeDetailsPanel';

function ProfileCard({
  id,
  matricule,
  nom,
  prenom,
  mail,
  telephone,
  fonction,
  img,
  etpName,
  empService: initialEmpService,
  onUpdate,
  onDelete,
  ville,
  codePostal,
  lot,
  quartier,
  idEtp,
  infoComplete: initialInfoComplete,
  isNew = false
}) {
  const { openModal } = useModal();
  const { t } = useTranslation();
  const [empService, setEmpService] = useState(initialEmpService === 1);
  const [isHovered, setIsHovered] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [displayedCourses, setDisplayedCourses] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [coursesData, setCoursesData] = useState(null);

  const infoComplete = initialInfoComplete !== undefined 
    ? initialInfoComplete 
    : Boolean(nom && prenom && matricule && etpName && mail && telephone);

  // Générer les initiales pour l'avatar
  const getInitials = () => {
    if (!nom && !prenom) return '?';
    return `${prenom ? prenom.charAt(0).toUpperCase() : ''}${nom ? nom.charAt(0).toUpperCase() : ''}`;
  };

  // Générer une couleur basée sur le nom pour l'avatar
  const generateColorFromName = () => {
    const name = `${prenom}${nom}`;
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  const avatarColor = generateColorFromName();

  useEffect(() => {
    toastr.options = {
      closeButton: true,
      progressBar: true,
      positionClass: "toast-top-center",
      timeOut: 5000,
      extendedTimeOut: 2000,
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
      closeMethod: "fadeOut",
      tapToDismiss: false,
      preventDuplicates: true
    };
  }, []);

  // Toggle actif/inactif
  const handleServiceChange = async (event) => {
    const isChecked = event.target.checked;
    setEmpService(isChecked);
    try {
      const response = await axios.patch(`/etp/employes/${id}/service`, {
        user_service: isChecked ? 1 : 0,
      });
      toastr.success(response.data.message);
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      setEmpService(!isChecked);
      toastr.error('Mise à jour échouée.');
    }
  };

  // Suppression employé
  const handleDelete = async (employeeId) => {
    try {
      if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) return;

      const response = await axios.delete(`/etp/employes/${employeeId}`);
      toastr.success(response.data.message || 'Employé supprimé avec succès');
      
      if (onDelete) onDelete();

    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      const status = err.response?.status;
      const message = err.response?.data?.message || '';

      if (status === 400) {
        if (message.includes('projets')) {
          toastr.error('Suppression impossible : l\'employé a des projets assignés.');
        } else {
          toastr.error(message || 'Suppression impossible !');
        }
      } else if (status === 404) {
        toastr.error(message || 'Employé introuvable !');
      } else if (status === 500) {
        toastr.error('Erreur serveur. Veuillez réessayer plus tard.');
      } else {
        toastr.error("Une erreur s'est produite lors de la suppression.");
      }
    }
  };

  const profileProps = {
    id,
    nom,
    prenom,
    matricule,
    mail,
    telephone,
    etpName,
    fonction,
    ville,
    codePostal,
    lot,
    quartier,
    img
  };

  const handleEdit = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleOpenDetailsDrawer = () => {
    setIsDetailsDrawerOpen(true);
  };

  const handleCloseDetailsDrawer = () => {
    setIsDetailsDrawerOpen(false);
  };

  // Charger cours avec dropdown
  const toggleCoursesDropdown = async () => {
    if (!displayedCourses && !coursesData) {
      setLoadingCourses(true);
      try {
        const response = await axios.get(`/etp/etp-drawers/apprenant/${id}`);
        setCoursesData({
          preparation: response.data.projects_in_preparation || [],
          future: response.data.projects_future || [],
          progress: response.data.projects_in_progress || [],
          finished: response.data.projects_finished || [],
          fenced: response.data.projects_fenced || [],
        });
        setDisplayedCourses(true);
      } catch (err) {
        console.error('Erreur chargement cours:', err);
        toastr.error('Erreur lors du chargement des cours');
      } finally {
        setLoadingCourses(false);
      }
    }
    setShowCourses(!showCourses);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleOpenDetailsDrawer();
    }
  };

  // Compter le nombre total de cours
  const totalCourses = coursesData ? 
    Object.values(coursesData).reduce((total, category) => total + category.length, 0) : 0;

  return (
    <>
      <motion.div
        className="relative w-full bg-white rounded-xl shadow-lg border border-gray-100 p-4 flex flex-col gap-3 transition-all duration-300 h-full hover:shadow-xl"
        initial={isNew ? { opacity: 0, scale: 0.9 } : false}
        animate={isNew ? { opacity: 1, scale: 1 } : false}
        transition={isNew ? { duration: 0.3 } : false}
        whileHover={{ y: -3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badge d'état des informations */}
        <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${infoComplete ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
          title={infoComplete ? 'Informations complètes' : 'Informations incomplètes'}>
          {infoComplete ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
        </div>

        {/* Badge "Nouveau" pour les employés récemment ajoutés */}
        {isNew && (
          <motion.div
            className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            Nouveau
          </motion.div>
        )}

        {/* Boutons d'action qui apparaissent au survol */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute -top-2 -right-2 flex gap-1 z-10"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={handleEdit}
                className="w-7 h-7 flex items-center justify-center bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors"
                title={'Editer'}
              >
                <Edit size={12} />
              </button>
              <button
                onClick={() => handleDelete(id)}
                className="w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                title={'Supprimer'}
              >
                <Trash2 size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* En-tête compacte avec photo et informations principales */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div 
              className="w-14 h-14 rounded-full border-2 border-white shadow-md overflow-hidden flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: avatarColor }}
              onClick={handleOpenDetailsDrawer}
            >
              {img ? (
                <img src={img} alt="photo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-sm">{getInitials()}</span>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div
              onClick={handleOpenDetailsDrawer}
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex="0"
              className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg p-1 -m-1"
              title='Cliquer pour voir le profil complet'
            >
              <h3 className="text-md font-semibold text-gray-800 truncate">
                {prenom} {nom}
              </h3>
              {matricule && (
                <p className="text-xs text-gray-500 mt-1 bg-gray-100 px-2 py-0.5 rounded-md inline-block">
                  #{matricule}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Informations de contact compactes - Version verticale améliorée */}
        <div className="space-y-2 text-xs border-l-2 border-blue-100 pl-3 ml-1">
          <div className="flex items-center gap-2 text-gray-700" title={etpName}>
            <Building size={14} className="text-blue-500 flex-shrink-0" />
            <span className="truncate">{etpName || '—'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-700" title={mail}>
            <Mail size={14} className="text-blue-500 flex-shrink-0" />
            <span className="truncate">{mail || '—'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-700" title={telephone}>
            <Phone size={14} className="text-blue-500 flex-shrink-0" />
            <span className="truncate">{telephone || '—'}</span>
          </div>
        </div>

        {/* Toggle actif/inactif compact */}
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
          <span className="text-xs font-medium text-gray-700">Statut:</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={empService}
              onChange={handleServiceChange}
            />
            <div className={`w-16 h-6 flex items-center rounded-full transition-all duration-300 px-0.5 ${empService ? 'bg-green-100' : 'bg-gray-200'}`}>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full transition-all duration-300 ${empService ? 'bg-green-500 text-white translate-x-8' : 'bg-gray-500 text-white'}`}>
                {empService ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </label>
        </div>

        {/* Adresse compacte */}
        {(ville || codePostal || lot || quartier) && (
          <div className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
            <MapPin size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">
              {[lot && `Lot ${lot}`, quartier, ville, codePostal]
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>
        )}

        {/* Section des cours en dropdown */}
        <div className="mt-2 border-t border-gray-100 pt-2">
          <button
            onClick={toggleCoursesDropdown}
            className="w-full flex items-center justify-between p-2 text-xs font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <GraduationCap size={14} className="text-purple-600" />
              <span>Formations ({totalCourses > 0 ? totalCourses : '...'})</span>
            </div>
            {loadingCourses ? (
              <Loader size={14} className="animate-spin text-gray-500" />
            ) : (
              showCourses ? <ChevronUp size={14} /> : <ChevronDown size={14} />
            )}
          </button>

          <AnimatePresence>
            {showCourses && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                  {loadingCourses ? (
                    <div className="flex justify-center py-4">
                      <Loader size={16} className="animate-spin text-gray-500" />
                    </div>
                  ) : coursesData && totalCourses > 0 ? (
                    <>
                      {Object.entries(coursesData).map(([category, projects]) => (
                        projects.length > 0 && (
                          <div key={category} className="text-xs">
                            <h5 className="font-medium text-gray-700 mb-1 capitalize">
                              {category.replace(/_/g, ' ')} ({projects.length})
                            </h5>
                            <div className="space-y-1">
                              {projects.map((project, index) => (
                                <motion.div
                                  key={`${project.id_projet}-${index}`}
                                  className="px-2 py-1.5 bg-gray-50 text-gray-700 rounded text-xs border border-gray-200"
                                  whileHover={{ scale: 1.01 }}
                                  transition={{ duration: 0.1 }}
                                >
                                  <div className="font-medium">{project.module_name}</div>
                                  {project.date_debut && (
                                    <div className="text-gray-500 text-[11px] mt-0.5">
                                      Début: {new Date(project.date_debut).toLocaleDateString()}
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )
                      ))}
                    </>
                  ) : (
                    <p className="text-xs text-center text-gray-500 py-3">
                      Aucun cours assigné
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Drawer d'édition */}

<EditApprenantDrawer
  isOpen={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  apprenant={{
    id: id,
    nom: nom,
    prenom: prenom,
    matricule: matricule,
    mail: mail,
    telephone: telephone,
    codePostal: codePostal,
    ville: ville,
    img: img,
    fonction: fonction,
    lot: lot,
    quartier: quartier,
    idEtp: idEtp,
    etpName: etpName // Ajouter cette ligne
  }}
  etpId={idEtp}
  onUpdated={onUpdate}
/>
      <EmployeeDetailsPanel
        isOpen={isDetailsDrawerOpen}
        onClose={handleCloseDetailsDrawer}
        employee={profileProps}
      />
    </>
  );
}

export default ProfileCard;