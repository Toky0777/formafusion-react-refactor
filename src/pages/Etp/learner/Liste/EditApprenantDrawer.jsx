import { useState, useEffect } from 'react';
import axios from '../../../../config/axios';
import Drawer from '../../../../components/drawer/learners/Drawer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faSpinner,
  faSave,
  faTimes,
  faCamera,
  faIdCard,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faHome,
  faBuilding,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { useAuth } from '../../../../contexts/AuthContext';

toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: 'toast-top-right',
  timeOut: 5000,
  extendedTimeOut: 2000,
};

const EditApprenantDrawer = ({ isOpen, onClose, apprenant, etpId, onUpdated }) => {
  const { t } = useTranslation();
  const { customerName } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    firstname: '',
    matricule: '',
    email: '',
    phone: '',
    zipCode: '',
    idVille: '',
    lot: '',
    quartier: '',
    fonction: '',
    photo: '',
    etpName: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [backendErrors, setBackendErrors] = useState({});

  const cities = [
    { id: 1, nom: 'Antananarivo' },
    { id: 2, nom: 'Antsiranana' },
    { id: 3, nom: 'Fianarantsoa' },
    { id: 4, nom: 'Mahajanga' },
    { id: 5, nom: 'Toamasina' },
    { id: 6, nom: 'Toliara' },
    { id: 7, nom: 'Antsirabe' },
    { id: 8, nom: 'Moramanga' },
  ];

  useEffect(() => {
    if (apprenant && isOpen) {
      setFormData((prev) => {
        const newData = {
          name: apprenant.nom || '',
          firstname: apprenant.prenom || '',
          matricule: apprenant.matricule || '',
          email: apprenant.mail || apprenant.email || '',
          phone: apprenant.telephone || '',
          zipCode: apprenant.codePostal || '',
          idVille: apprenant.idVille || apprenant.ville || '',
          lot: apprenant.lot || '',
          quartier: apprenant.quartier || '',
          fonction: apprenant.fonction || '',
          photo: apprenant.img || apprenant.photoUrl || "https://placehold.co/112x112/e5e7eb/6b7280?text=Photo",
          etpName: apprenant.etpName || customerName || '',
        };

        if (JSON.stringify(prev) === JSON.stringify(newData)) {
          return prev;
        }
        return newData;
      });

      setImageError(false);
      setValidationErrors({});
      setBackendErrors({});
      setPhotoFile(null);
    }
  }, [apprenant?.id, isOpen, customerName, apprenant?.etpName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear validation errors when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear backend errors when user starts typing
    if (backendErrors[name]) {
      setBackendErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toastr.error('La photo ne doit pas dépasser 2MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toastr.error('Veuillez sélectionner une image valide');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          photo: reader.result,
        }));
        setPhotoFile(file);
        setImageError(false);
      };
      reader.onerror = () => {
        toastr.error('Erreur lors de la lecture du fichier');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format d\'email invalide';
    }

    if (formData.phone && !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(formData.phone)) {
      errors.phone = 'Format de téléphone invalide';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const uploadPhoto = async (employeeId) => {
    if (!photoFile) return null;

    try {
      const photoFormData = new FormData();
      photoFormData.append('photo', photoFile);

      const response = await axios.post(`/etp/employes/${employeeId}/update-photo`, photoFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data.photoUrl;
    } catch (error) {
      console.error("Erreur lors de l'upload de la photo:", error);

      if (error.response?.data?.error) {
        toastr.error(error.response.data.error);
      } else {
        toastr.error("Erreur lors de l'upload de la photo");
      }

      return null;
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    if (!apprenant?.id) {
      toastr.error('ID apprenant manquant');
      return;
    }

    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(validationErrors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
      return;
    }

    if (!etpId) {
      toastr.error('ID entreprise manquant');
      return;
    }

    setIsSaving(true);
    setBackendErrors({});

    try {
      const payload = {
        idEntreprise: etpId,
        emp_name: formData.name.trim(),
        emp_firstname: formData.firstname.trim(),
        emp_matricule: formData.matricule.trim(),
        emp_email: formData.email.trim(),
        emp_phone: formData.phone.trim(),
        emp_lot: formData.lot.trim() || '',
        emp_qrt: formData.quartier.trim() || '',
        emp_cp: formData.zipCode.trim(),
        idVille: formData.idVille || '',
        emp_fonction: formData.fonction.trim() || '',
      };

      const res = await axios.patch(`/etp/employes/${apprenant.id}`, payload);

      let newPhotoUrl = null;
      if (photoFile) {
        newPhotoUrl = await uploadPhoto(apprenant.id);
      }

      if (res.data?.success || res.data?.message) {
        toastr.success(res.data.success || res.data.message);

        if (onUpdated) {
          onUpdated({
            ...apprenant,
            ...payload,
            nom: formData.name.trim(),
            prenom: formData.firstname.trim(),
            photoUrl: newPhotoUrl || formData.photo,
            img: newPhotoUrl || formData.photo,
            etpName: formData.etpName,
          });
        }

        onClose();
      }
    } catch (err) {
      console.error('Erreur de sauvegarde:', err.response?.data || err.message);
      
      // Gestion des erreurs de validation backend
      if (err.response?.status === 422 && err.response.data?.errors) {
        // Formatage des erreurs de validation Laravel
        const backendValidationErrors = {};
        Object.keys(err.response.data.errors).forEach(key => {
          backendValidationErrors[key] = err.response.data.errors[key][0];
        });
        setBackendErrors(backendValidationErrors);
        toastr.error('Veuillez corriger les erreurs dans le formulaire');
      } 
      else if (err.response?.status === 403) {
        toastr.error('Accès interdit: vous n\'avez pas les droits pour modifier cet employé');
      }
      else if (err.response?.status === 404) {
        toastr.error('Employé non trouvé');
      }
      else if (err.response?.data?.message) {
        toastr.error(err.response.data.message);
      }
      else {
        toastr.error('Erreur lors de la sauvegarde. Veuillez réessayer.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const getInitials = () => {
    return `${formData.firstname?.charAt(0) || ''}${formData.name?.charAt(0) || ''}`.toUpperCase();
  };

  // Fonction pour obtenir le message d'erreur d'un champ
  const getFieldError = (fieldName) => {
    return validationErrors[fieldName] || backendErrors[fieldName];
  };

  // Fonction pour vérifier si un champ a une erreur
  const hasError = (fieldName) => {
    return !!getFieldError(fieldName);
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={'Modifier Employé'}>
      <div className="flex flex-col gap-6 p-1">
        {/* Afficher le nom de l'entreprise */}
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg mb-4">
          <FontAwesomeIcon icon={faBuilding} className="text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Entreprise: {formData.etpName || customerName || 'Non spécifiée'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 shadow-lg border-4 border-white overflow-hidden">
              {formData.photo && !imageError ? (
                <img
                  alt="photo"
                  className="w-full h-full object-cover"
                  src={formData.photo}
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="text-4xl text-purple-400" />
                  <span className="absolute text-sm font-bold text-purple-600">
                    {getInitials()}
                  </span>
                </div>
              )}
            </div>

            <input
              id="photo-upload"
              className="hidden"
              accept="image/*"
              type="file"
              onChange={handlePhotoChange}
            />
            <label
              htmlFor="photo-upload"
              className="flex items-center gap-2 bg-gray-100 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-sm font-medium"
            >
              <FontAwesomeIcon icon={faCamera} size="sm" />
              Changer la photo
            </label>
          </div>

          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nom *
              </label>
              <input
                id="name"
                name="name"
                className={`input input-bordered h-12 w-full border ${hasError('name') ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                minLength={2}
                placeholder="Entrez le nom"
              />
              {hasError('name') && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />
                  {getFieldError('name')}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="firstname" className="text-sm font-medium text-gray-700">
                Prénom
              </label>
              <input
                id="firstname"
                name="firstname"
                className={`input input-bordered h-12 w-full border ${hasError('firstname') ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                type="text"
                value={formData.firstname}
                onChange={handleInputChange}
                placeholder="Entrez le prénom"
              />
              {hasError('firstname') && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />
                  {getFieldError('firstname')}
                </p>
              )}
            </div>

            {/* <div className="flex flex-col gap-1">
              <label htmlFor="fonction" className="text-sm font-medium text-gray-700">
                Fonction
              </label>
              <input
                id="fonction"
                name="fonction"
                className={`input input-bordered h-12 w-full border ${hasError('fonction') ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                type="text"
                value={formData.fonction}
                onChange={handleInputChange}
                placeholder="Entrez la fonction"
              />
              {hasError('fonction') && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />
                  {getFieldError('fonction')}
                </p>
              )}
            </div> */}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="matricule" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FontAwesomeIcon icon={faIdCard} className="text-purple-500" />
              Matricule
            </label>
            <input
              id="matricule"
              name="matricule"
              className={`input input-bordered h-12 w-full border ${hasError('matricule') ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
              type="text"
              value={formData.matricule}
              onChange={handleInputChange}
              placeholder="Entrez le matricule"
            />
            {hasError('matricule') && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />
                {getFieldError('matricule')}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-purple-500" />
                Email
              </label>
              <input
                id="email"
                name="email"
                className={`input input-bordered h-12 w-full border ${hasError('email') ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="exemple@entreprise.mg"
              />
              {hasError('email') && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />
                  {getFieldError('email')}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="text-purple-500" />
                Téléphone
              </label>
              <input
                id="phone"
                name="phone"
                className={`input input-bordered h-12 w-full border ${hasError('phone') ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+261 34 12 345 67"
              />
              {hasError('phone') && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />
                  {getFieldError('phone')}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="idVille" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-purple-500" />
                Ville
              </label>
              <select
                name="idVille"
                id="idVille"
                className={`border ${hasError('idVille') ? 'border-red-500' : 'border-gray-300'} rounded-lg h-12 px-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                value={formData.idVille}
                onChange={handleInputChange}
              >
                <option value="">-- Sélectionner une ville (facultatif) --</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.nom}
                  </option>
                ))}
              </select>
              {hasError('idVille') && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />
                  {getFieldError('idVille')}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
                Code postal
              </label>
              <input
                id="zipCode"
                name="zipCode"
                className={`input input-bordered h-12 w-full border ${hasError('zipCode') ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                type="text"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="101"
              />
              {hasError('zipCode') && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />
                  {getFieldError('zipCode')}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="lot" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faHome} className="text-purple-500" />
                Adresse (Lot)
              </label>
              <input
                id="lot"
                name="lot"
                className={`input input-bordered h-12 w-full border ${hasError('lot') ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                type="text"
                value={formData.lot}
                onChange={handleInputChange}
                placeholder="Lot II A 123"
              />
              {hasError('lot') && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />
                  {getFieldError('lot')}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="quartier" className="text-sm font-medium text-gray-700">
                Quartier
              </label>
              <input
                id="quartier"
                name="quartier"
                className={`input input-bordered h-12 w-full border ${hasError('quartier') ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                type="text"
                value={formData.quartier}
                onChange={handleInputChange}
                placeholder="Entrer le quartier"
              />
              {hasError('quartier') && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />
                  {getFieldError('quartier')}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            onClick={handleCancel}
            disabled={isSaving}
          >
            <FontAwesomeIcon icon={faTimes} />
            Fermer
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              <FontAwesomeIcon icon={faSave} />
            )}
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </Drawer>
  );
};

export default EditApprenantDrawer;