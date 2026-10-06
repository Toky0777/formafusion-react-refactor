import { useState, useEffect } from 'react';
import Drawer from '../../../../components/drawer/learners/Drawer';
import { useTranslation } from 'react-i18next';
import toastr from 'toastr';
import axios from '../../../../config/axios';
import { useAuth } from '../../../../contexts/AuthContext';

const AddApprenantDrawer = ({ isOpen, onClose, onEmployeeAdded, etpId }) => {
  const { t } = useTranslation();
  const { customerName, customerId } = useAuth();
  const [formData, setFormData] = useState({
    emp_matricule: '',
    emp_name: '',
    emp_firstname: '',
    emp_phone: '',
    emp_email: '',
    idVille: '',
    emp_cp: '',
    emp_lot: '',
    emp_qrt: '',
    emp_fonction: '',
    idEntreprise: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGroupEnterprise, setIsGroupEnterprise] = useState(false);
  const [enterprises, setEnterprises] = useState([]);
  const [loadingEnterprises, setLoadingEnterprises] = useState(false);
  const [importMode, setImportMode] = useState('single'); // 'single' or 'bulk'
  const [excelFile, setExcelFile] = useState(null);
  const [importResults, setImportResults] = useState(null);
  const [importing, setImporting] = useState(false);


  // Configuration des toastr
  toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-top-right",
    timeOut: 5000,
    extendedTimeOut: 2000,
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
    showDuration: 300,
    hideDuration: 1000
  };

  useEffect(() => {
    const fetchEnterpriseData = async () => {
      if (isOpen) {
        try {
          setLoadingEnterprises(true);
          const response = await axios.get('etp/employes/add/getEtpType');

          if (response.data.status === 200) {
            setIsGroupEnterprise(response.data.isGroup || false);

            let availableEnterprises = [];

            if (response.data.isGroup) {
              if (response.data.childEnterprises) {
                availableEnterprises = [
                  ...response.data.childEnterprises.map(etp => ({
                    ...etp,
                    idCustomer: parseInt(etp.idCustomer)
                  }))
                ];
              }

              // availableEnterprises.unshift({
              //   idCustomer: parseInt(customerId),
              //   customerName: `${customerName} (Groupe)`
              // });
            } else {
              availableEnterprises = [{
                idCustomer: parseInt(customerId),
                customerName: customerName
              }];
            }

            setEnterprises(availableEnterprises);

            if (availableEnterprises.length > 0) {
              setFormData(prev => ({
                ...prev,
                idEntreprise: availableEnterprises[0].idCustomer.toString()
              }));
            }
          }
        } catch (error) {
          console.error('Erreur lors du chargement des entreprises:', error);
          toastr.error('Impossible de charger les informations des entreprises');
        } finally {
          setLoadingEnterprises(false);
        }
      }
    };

    if (isOpen) {
      fetchEnterpriseData();
      // Réinitialiser le mode à l'ouverture
      setImportMode('single');
      setExcelFile(null);
      setImportResults(null);
    }
  }, [isOpen, customerId, customerName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validExtensions = ['.xlsx', '.xls', '.csv'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

      if (!validExtensions.includes(fileExtension)) {
        toastr.error('Veuillez sélectionner un fichier Excel (.xlsx, .xls) ou CSV');
        e.target.value = '';
        return;
      }

      setExcelFile(file);
    }
  };
  const handleExcelImport = async () => {
    if (!excelFile) {
      toastr.error('📁 Sélection requise', 'Veuillez choisir un fichier Excel à importer');
      return;
    }

    setImporting(true);
    setImportResults(null);

    try {
      const selectedEnterpriseId = isGroupEnterprise
        ? (formData.idEntreprise ? parseInt(formData.idEntreprise) : parseInt(customerId))
        : parseInt(customerId);

      const formDataToSend = new FormData();
      formDataToSend.append('excel_file', excelFile);
      formDataToSend.append('idEntreprise', selectedEnterpriseId.toString());

      const response = await axios.post('/etp/employes/import-excel', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000 // 5 minutes timeout pour les gros fichiers
      });

      if (response.data.status === 200) {
        setImportResults(response.data);

        // Message de succès détaillé
        const successData = response.data.data;
        const successMessage = `✅ Importation terminée avec succès
• 📊 ${successData.total_rows} ligne(s) traitées
• ✅ ${successData.successful_imports} employé(s) importé(s)
• ⚠️ ${successData.failed_imports} échec(s)`;

        toastr.success(successMessage, 'Importation réussie');

        if (onEmployeeAdded && successData.successful_imports > 0) {
          onEmployeeAdded();
        }
      } else {
        const errorMessage = response.data.message || 'Une erreur est survenue lors de l\'importation';
        toastr.error(`❌ ${errorMessage}`, 'Erreur d\'importation');
        setImportResults(response.data);
      }
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);

      let errorMessage = "Une erreur inattendue s'est produite lors de l'importation";

      if (error.code === 'ECONNABORTED') {
        errorMessage = '⏰ Délai d\'attente dépassé. Le fichier est peut-être trop volumineux.';
      } else if (error.response?.status === 413) {
        errorMessage = '📦 Fichier trop volumineux. Veuillez utiliser un fichier de moins de 10MB.';
      } else if (error.response?.status === 403) {
        errorMessage = '🔒 Accès refusé. Vous n\'avez pas les autorisations nécessaires.';
      } else if (error.response?.status === 422) {
        errorMessage = '📝 Données invalides. Veuillez vérifier le format du fichier.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toastr.error(`❌ ${errorMessage}`, 'Erreur d\'importation');
      setImportResults(error.response?.data || { message: errorMessage });
    } finally {
      setImporting(false);
    }
  };
  // Fonction utilitaire pour traduire les erreurs
  const useErrorTranslator = () => {
    const translateError = (errorMessage) => {
      const errorMappings = {
        // Validation errors
        'The matricule has already been taken.': 'Le matricule est déjà utilisé.',
        'The email has already been taken.': 'L\'email est déjà utilisé.',
        'The email must be a valid email address.': 'L\'email doit être une adresse email valide.',
        'The nom field is required.': 'Le nom est obligatoire.',
        'The nom must be at least 2 characters.': 'Le nom doit contenir au moins 2 caractères.',
        'The telephone must be a valid phone number.': 'Le téléphone doit être un numéro valide.',

        // File errors
        'The excel_file field is required.': 'Le fichier Excel est requis.',
        'The excel_file must be a file of type: xlsx, xls, csv.': 'Le fichier doit être de type XLSX, XLS ou CSV.',
        'The excel_file must not be greater than 10240 kilobytes.': 'Le fichier ne doit pas dépasser 10MB.',

        // Enterprise errors
        'Enterprise not authorized.': 'Entreprise non autorisée.',
        'Enterprise not found.': 'Entreprise non trouvée.',

        // Default
        'Unknown error': 'Erreur inconnue'
      };

      // Extract parameters from error messages
      const matches = errorMessage.match(/must be at least (\d+) characters/);
      if (matches) {
        return `Doit contenir au moins ${matches[1]} caractères.`;
      }

      return errorMappings[errorMessage] || errorMessage;
    };

    const translateErrors = (errors) => {
      if (Array.isArray(errors)) {
        return errors.map(error => translateError(error));
      }
      if (typeof errors === 'string') {
        return [translateError(errors)];
      }
      return ['Erreur inconnue'];
    };

    return { translateError, translateErrors };
  };

  // Utilisation dans votre composant
  const { translateErrors } = useErrorTranslator();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.emp_name || formData.emp_name.trim().length < 2) {
        toastr.error('Le nom doit contenir au moins 2 caractères');
        setIsSubmitting(false);
        return;
      }

      const selectedEnterpriseId = isGroupEnterprise
        ? (formData.idEntreprise ? parseInt(formData.idEntreprise) : parseInt(customerId))
        : parseInt(customerId);

      const payload = {
        emp_matricule: formData.emp_matricule.trim(),
        emp_name: formData.emp_name.trim(),
        emp_firstname: formData.emp_firstname.trim(),
        emp_phone: formData.emp_phone.trim(),
        emp_email: formData.emp_email.trim(),
        idEntreprise: selectedEnterpriseId,
        idVille: formData.idVille ? parseInt(formData.idVille) : null,
        emp_cp: formData.emp_cp.trim(),
        emp_lot: formData.emp_lot.trim(),
        emp_qrt: formData.emp_qrt.trim(),
        emp_fonction: formData.emp_fonction.trim()
      };

      const response = await axios.post('/etp/employes', payload);

      if (response.data.status === 200) {
        toastr.success(response.data.message || 'Employé ajouté avec succès');
        if (onEmployeeAdded) onEmployeeAdded(response.data.employe);
        handleClose();
      } else {
        if (response.data.message && typeof response.data.message === 'object') {
          const errorMessages = Object.values(response.data.message).flat();
          errorMessages.forEach(msg => toastr.error(msg));
        } else {
          toastr.error(response.data.message || 'Erreur lors de l\'ajout');
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);

      if (error.response?.status === 422 && error.response?.data?.message) {
        const errorMessages = Object.values(error.response.data.message).flat();
        errorMessages.forEach(msg => toastr.error(msg));
      } else {
        const errorMsg = error.response?.data?.message ||
          error.response?.data?.error ||
          "Une erreur s'est produite lors de l'ajout";
        toastr.error(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      emp_matricule: '',
      emp_name: '',
      emp_firstname: '',
      emp_phone: '',
      emp_email: '',
      idVille: '',
      emp_cp: '',
      emp_lot: '',
      emp_qrt: '',
      emp_fonction: '',
      idEntreprise: ''
    });
    setIsGroupEnterprise(false);
    setEnterprises([]);
    setImportMode('single');
    setExcelFile(null);
    setImportResults(null);
    onClose();
  };

  const cities = [
    { id: 1, nom: 'Antananarivo' },
    { id: 2, nom: 'Antsiranana' },
    { id: 3, nom: 'Fianarantsoa' },
    { id: 4, nom: 'Mahajanga' },
    { id: 5, nom: 'Toamasina' },
    { id: 6, nom: 'Toliara' }
  ];


  const downloadTemplate = () => {
    // Template plus complet avec instructions
    const templateData = [
      ['# IMPORTANT: Ne modifiez pas les noms des colonnes'],
      ['# Les colonnes marquées (*) sont obligatoires'],
      ['# Format attendu pour chaque colonne:'],
      ['# matricule - Texte (optionnel)'],
      ['# nom(*) - Texte (min. 2 caractères)'],
      ['# prenom - Texte (optionnel)'],
      ['# telephone - Format: +261 34 12 345 67'],
      ['# email - Format email valide'],
      ['# ville - Une des villes disponibles'],
      ['# code_postal - Texte'],
      ['# lot - Texte'],
      ['# quartier - Texte'],
      ['# fonction - Texte'],
      [''],
      ['matricule', 'nom', 'prenom', 'telephone', 'email', 'ville', 'code_postal', 'lot', 'quartier', 'fonction'],
      ['EMP001', 'Dupont', 'Jean', '+261341234567', 'jean@email.com', 'Antananarivo', '101', 'Lot A1', 'Analakely', 'Manager'],
      ['EMP002', 'Martin', 'Marie', '+261321234568', 'marie@email.com', 'Toamasina', '501', 'Lot B2', 'Tanambao', 'Développeur']
    ];


    let csvContent = templateData.map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'modele_import_employes.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toastr.info('📥 Modèle téléchargé', 'Le modèle d\'importation a été téléchargé avec succès');
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} title={`Ajouter un Employé - ${customerName || 'Entreprise'}`}>
      <div className="flex-1 overflow-y-auto">
        {/* Sélecteur de mode */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mode d'ajout
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg border ${importMode === 'single'
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              onClick={() => setImportMode('single')}
            >
              Ajout manuel
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg border ${importMode === 'bulk'
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              onClick={() => setImportMode('bulk')}
            >
              Import Excel
            </button>
          </div>
        </div>

        {importMode === 'single' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Afficher le select seulement pour les groupes d'entreprises */}
            {isGroupEnterprise && enterprises.length > 0 && (
              <div>
                <label htmlFor="idEntreprise" className="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionner l'entreprise <span className="text-red-500">*</span>
                </label>
                <select
                  name="idEntreprise"
                  id="idEntreprise"
                  className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  value={formData.idEntreprise}
                  onChange={handleInputChange}
                  required={true}
                  disabled={loadingEnterprises}
                >
                  {enterprises.map((enterprise) => (
                    <option key={enterprise.idCustomer} value={enterprise.idCustomer.toString()}>
                      {enterprise.customerName}
                    </option>
                  ))}
                </select>
                {loadingEnterprises && (
                  <p className="text-sm text-gray-500 mt-1">Chargement des entreprises...</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="emp_matricule" className="block text-sm font-medium text-gray-700 mb-2">
                Matricule
              </label>
              <input
                id="emp_matricule"
                className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                type="text"
                name="emp_matricule"
                value={formData.emp_matricule}
                onChange={handleInputChange}
                placeholder="Entrez le matricule (optionnel)"
              />
            </div>

            <div>
              <label htmlFor="emp_name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                id="emp_name"
                className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                required
                type="text"
                name="emp_name"
                value={formData.emp_name}
                onChange={handleInputChange}
                placeholder="Entrez le nom"
                minLength={2}
              />
            </div>

            <div>
              <label htmlFor="emp_firstname" className="block text-sm font-medium text-gray-700 mb-2">
                Prénom(s)
              </label>
              <input
                id="emp_firstname"
                className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                type="text"
                name="emp_firstname"
                value={formData.emp_firstname}
                onChange={handleInputChange}
                placeholder="Entrez le prénom"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="emp_phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  id="emp_phone"
                  className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  type="tel"
                  name="emp_phone"
                  value={formData.emp_phone}
                  onChange={handleInputChange}
                  placeholder="+261 34 12 345 67"
                />
              </div>
              <div>
                <label htmlFor="emp_email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="emp_email"
                  className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  type="email"
                  name="emp_email"
                  value={formData.emp_email}
                  onChange={handleInputChange}
                  placeholder="exemple@entreprise.mg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="idVille" className="block text-sm font-medium text-gray-700 mb-2">
                  Ville
                </label>
                <select
                  name="idVille"
                  id="idVille"
                  className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  value={formData.idVille}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionner une ville</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="emp_cp" className="block text-sm font-medium text-gray-700 mb-2">
                  Code Postal
                </label>
                <input
                  id="emp_cp"
                  className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  type="text"
                  name="emp_cp"
                  value={formData.emp_cp}
                  onChange={handleInputChange}
                  placeholder="101"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="emp_lot" className="block text-sm font-medium text-gray-700 mb-2">
                  Lot
                </label>
                <input
                  id="emp_lot"
                  className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  type="text"
                  name="emp_lot"
                  value={formData.emp_lot}
                  onChange={handleInputChange}
                  placeholder="Lot II A 123"
                />
              </div>
              <div>
                <label htmlFor="emp_qrt" className="block text-sm font-medium text-gray-700 mb-2">
                  Quartier
                </label>
                <input
                  id="emp_qrt"
                  className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  type="text"
                  name="emp_qrt"
                  value={formData.emp_qrt}
                  onChange={handleInputChange}
                  placeholder="Entrez le quartier"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Sélecteur d'entreprise pour l'import */}
            {isGroupEnterprise && enterprises.length > 0 && (
              <div>
                <label htmlFor="importEnterprise" className="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionner l'entreprise pour l'import <span className="text-red-500">*</span>
                </label>
                <select
                  name="importEnterprise"
                  id="importEnterprise"
                  className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  value={formData.idEntreprise}
                  onChange={handleInputChange}
                  required={true}
                  disabled={loadingEnterprises}
                >
                  {enterprises.map((enterprise) => (
                    <option key={enterprise.idCustomer} value={enterprise.idCustomer.toString()}>
                      {enterprise.customerName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fichier Excel <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="excelFile"
                />
                <label
                  htmlFor="excelFile"
                  className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block mb-3"
                >
                  {excelFile ? 'Changer de fichier' : 'Sélectionner un fichier'}
                </label>
                {excelFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    Fichier sélectionné: <strong>{excelFile.name}</strong>
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Formats supportés: .xlsx, .xls, .csv
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Instructions</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Téléchargez d'abord le modèle Excel</li>
                <li>• Remplissez les colonnes obligatoires (nom)</li>
                <li>• Les colonnes optionnelles peuvent être laissées vides</li>
                <li>• Enregistrez le fichier et importez-le</li>
              </ul>
              <button
                type="button"
                onClick={downloadTemplate}
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Télécharger le modèle Excel
              </button>
            </div>
            {importResults && (
              <div className={`p-4 rounded-lg border ${importResults.status === 200
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  {importResults.status === 200 ? (
                    <>
                      <span className="text-green-600">✅</span>
                      Importation terminée avec succès
                    </>
                  ) : (
                    <>
                      <span className="text-red-600">❌</span>
                      Échec de l'importation
                    </>
                  )}
                </h4>

                <p className="text-sm mb-3">{importResults.message}</p>

                {importResults.data && (
                  <div className="mt-3 text-sm space-y-2">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <div className="text-lg font-semibold text-gray-900">
                          {importResults.data.total_rows || 0}
                        </div>
                        <div className="text-xs text-gray-600">Lignes traitées</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <div className="text-lg font-semibold text-green-600">
                          {importResults.data.successful_imports || 0}
                        </div>
                        <div className="text-xs text-gray-600">Réussis</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <div className="text-lg font-semibold text-red-600">
                          {importResults.data.failed_imports || 0}
                        </div>
                        <div className="text-xs text-gray-600">Échecs</div>
                      </div>
                    </div>

                    {importResults.data.errors && importResults.data.errors.length > 0 && (
                      <div className="mt-4">
                        <div className="font-medium mb-2 flex items-center gap-2">
                          <span className="text-yellow-600">⚠️</span>
                          Détails des erreurs
                        </div>
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          {importResults.data.errors.slice(0, 10).map((error, index) => (
                            <div key={index} className="text-xs bg-yellow-50 p-3 rounded border border-yellow-200">
                              <div className="font-medium">Ligne {error.row}:</div>
                              <div className="text-yellow-700 mt-1">
                                {translateErrors(error.errors || error.error).join(', ')}
                              </div>
                            </div>
                          ))}
                          {importResults.data.errors.length > 10 && (
                            <div className="text-xs text-gray-500 text-center mt-2">
                              + {importResults.data.errors.length - 10} erreur(s) supplémentaire(s)...
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {importResults.status === 200 && importResults.data.successful_imports > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 text-blue-800">
                          <span>💡</span>
                          <span className="text-sm">
                            {importResults.data.successful_imports} employé(s) ont été ajouté(s) avec succès à votre base de données.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={handleClose}
                disabled={importing}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleExcelImport}
                disabled={importing || !excelFile}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {importing && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Importation en cours...
                        </h3>
                        <p className="text-sm text-gray-600">
                          Traitement de votre fichier Excel. Veuillez patienter.
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Cette opération peut prendre quelques minutes pour les gros fichiers.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {importing ? 'Importation en cours...' : 'Importer'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default AddApprenantDrawer;