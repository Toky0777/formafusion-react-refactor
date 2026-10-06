import { useEffect, useState } from 'react';
import axios from '../../../config/axios';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Users } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import AddLearnerFormateurModal from '../../../components/Modals/learner/add-modal-formateur';
import EditApprenantForm from '../../../components/Modals/learner/EditApprenantForm';
import LoadingSpinner from '../../../components/ui/loading-spinner';
import Pagination from '../../../components/skills/Pagination';
import T from '../../../components/translate/AutoTranslator';
import LearnerCard from '../../../components/card/learner-card-cfp';

/**
 * Composant principal qui gère la liste des apprenants, les filtres, 
 * les modales et la pagination.
 */
function LearnerListFormateur() {
  const [apprenants, setApprenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpenAjout, setIsModalOpenAjout] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [selectedApprenant, setSelectedApprenant] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const [activeFilters, setActiveFilters] = useState({
    entreprise: "",
    module: "",
    ville: "",
  });

  const { t } = useTranslation();

  const fetchApprenants = async () => {
    try {
      const { data } = await axios.get('/form/apprenants/index');
      setApprenants(data.apprenants || []);
      setLoading(false);
      setError("");
    } catch (err) {
      setLoading(false);
      if (err.response) {
        if (err.response.status === 404) {
          setApprenants([]);
          setError("Aucun apprenant trouvé.");
        } else {
          setError("Vous n'avez pas l'autorisation nécessaire pour visiter cette adresse !");
        }
      } else {
        setError("Erreur réseau ou serveur injoignable.");
      }
    }
  };

  useEffect(() => {
    fetchApprenants();
  }, []);

  const handleOpenModalAjout = () => {
    setIsModalOpenAjout(true);
  };

  const closeModalAjout = () => {
    setIsModalOpenAjout(false);
    fetchApprenants();
  };

  const handleOpenModalEdit = (apprenant) => {
    setSelectedApprenant(apprenant);
    setIsModalOpenEdit(true);
  };

  const closeModalEdit = () => {
    setIsModalOpenEdit(false);
    setSelectedApprenant(null);
    fetchApprenants();
  };

  const handleDeleteApprenant = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet apprenant ?")) {
      return;
    }

    try {
      const response = await axios.delete(`/form/apprenants/${id}`);

      if (response.status === 200) {
        setApprenants(prev => prev.filter(apprenant => apprenant.idEmploye !== id));
        alert(response.data.message || "Apprenant supprimé avec succès");
      } else {
        alert(response.data.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      if (error.response) {
        alert(error.response.data.message || "Erreur lors de la suppression");
      } else {
        alert("Erreur réseau lors de la suppression");
      }
    }
  };

  // Simuler les fonctions de contexte pour utiliser le même composant LearnerCard
  const mockFunctions = {
    editLearner: async (id) => {
      const apprenant = apprenants.find(a => a.idEmploye === id);
      if (apprenant) {
        return {
          villes: [],
          etps: [],
          apprenant: apprenant
        };
      }
      throw new Error("Apprenant non trouvé");
    },
    updateLearner: async (data) => {
      // Cette fonction serait normalement implémentée avec un appel API
      console.log("Mise à jour apprenant:", data);
      return { status: 200, message: "Apprenant mis à jour" };
    },
    updatePhotoLearner: async (data) => {
      // Cette fonction serait normalement implémentée avec un appel API
      console.log("Mise à jour photo:", data);
      return { status: 200, message: "Photo mise à jour" };
    },
    deleteLearner: handleDeleteApprenant
  };

  // Filtrage des apprenants
  const filteredApprenants = apprenants.filter((apprenant) => {
    const matchesSearch = searchTerm
      ? [apprenant.emp_name, apprenant.emp_firstname]
        .filter(Boolean)
        .some((field) =>
          field.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true;

    const matchesEntreprise = activeFilters?.entreprise
      ? apprenant.etp_name?.toLowerCase() ===
      activeFilters.entreprise.toLowerCase()
      : true;

    // Note: Adaptez ces filtres selon vos données disponibles
    const matchesVille = activeFilters?.ville
      ? apprenant.ville?.toLowerCase() === activeFilters.ville.toLowerCase()
      : true;

    const matchesModule = activeFilters?.module
      ? apprenant.module_name?.toLowerCase() === activeFilters.module.toLowerCase()
      : true;

    return matchesSearch && matchesEntreprise && matchesModule && matchesVille;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApprenants = filteredApprenants.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="max-w-md p-8 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="mb-4 text-4xl text-gray-400">⚠️</div>
          <h3 className="mb-2 text-lg font-semibold text-gray-800">
            <T>Une erreur est survenue</T>
          </h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            <T>Tous les apprenants</T>
          </h1>
          <p className="mt-1 text-gray-500">
            {filteredApprenants.length} <T>apprenant(s) trouvé(s)</T>
          </p>
        </div>

        <div className="flex flex-col w-full gap-4 md:w-auto md:flex-row md:items-center">
          <div className="relative">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder={t('Rechercher un apprenant...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent md:w-64"
            />
          </div>
          <button
            onClick={handleOpenModalAjout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 font-medium text-white transition-colors bg-gray-900 rounded-lg hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" />
            <span><T>Nouvel apprenant</T></span>
          </button>
        </div>
      </div>

      {/* Filtres avancés - Similaires à LeanerCfpFilter */}
      <div className="mb-5">
        {/* <LeanerCfpFilter
          onFilterChange={(newFilters) => setActiveFilters(newFilters)}
          moduleQuery={[]} // Vous devrez adapter ceci selon vos données
          villes={[]} // Vous devrez adapter ceci selon vos données
        /> */}
      </div>

      {/* Liste des apprenants */}
      {currentApprenants.length === 0 ? (
        <div className="flex justify-center items-center h-[30vh] gap-5">
          <Users size={30} />
          <h1 className="">
            <T>Aucun résultat trouvé</T>
          </h1>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {currentApprenants?.map((apprenant, index) => (
              <div key={index}>
                <LearnerCard
                  learner={apprenant}
                  editLearner={mockFunctions.editLearner}
                  updateLearner={mockFunctions.updateLearner}
                  updatePhotoLearner={mockFunctions.updatePhotoLearner}
                  deleteLearner={mockFunctions.deleteLearner}
                  isFormateur={true}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {currentApprenants.length !== 0 && (
        <div className="flex justify-end mt-5">
          <Pagination
            totalItems={filteredApprenants.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Modales */}
      <AnimatePresence>
        {isModalOpenAjout && (
          <AddLearnerFormateurModal
            type="addApprenant"
            closeModal={closeModalAjout}
            isOpen={isModalOpenAjout}
            fetchApprenants={fetchApprenants}
          />
        )}

        {isModalOpenEdit && selectedApprenant && (
          <EditApprenantForm
            type="editApprenantForm"
            closeModal={closeModalEdit}
            isOpen={isModalOpenEdit}
            idEmploye={selectedApprenant.idEmploye}
            apprenant={selectedApprenant}
            fetchApprenants={fetchApprenants}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default LearnerListFormateur;