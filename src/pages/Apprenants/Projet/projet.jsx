// Project.jsx
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import "aos/dist/aos.css";
import axios from "../../../config/axios";
 
// Components
import NavBarProject from "../../../components/navbar/navBar-projectEmp";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import Notification from "../../../components/notification/Notification";
import ProjectList from "../../../components/project/project-emp-list";
import ApprenantDrawer from "../../../components/drawer/project/learnerEtp-drawer";
import { EntrepriseDrawer } from "../../../components/drawer/project/entrepriseEtp-drawer";
import { TrainerDrawer } from "../../../components/drawer/project/trainerEtp-drawer";
// import { FolderDrawer } from "../../../components/drawer/project/folder-drawer";
import { SessionDrawer } from "../../../components/drawer/project/sessionEtp-drawer";


// Custom hooks
import { useProjectData } from "../../../hooks/useProjectEmpData";
import { useProjectActions } from "../../../hooks/useProjectActions";
import { FolderDrawer } from "../../../components/drawer/project/folder-drawer";
import { AuthCalendarProvider } from "../../../contexts/AuthCalendarProvider";

const Project = ({ status}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedidProjet, setSelectedidProjet] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showNotification, setShowNotification] = useState(false);
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");


  const [selectedPeriodes, setSelectedPeriodes] = useState([]);
  const [selectedVilles, setSelectedVilles] = useState([]);
  const [selectedFormateur, setSelectedFormateur] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [selectedFinancements, setSelectedFinancements] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer states
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [drawerData, setDrawerData] = useState({});

  const [docDetail, setDocDetail] = useState([]);

  // Enterprise specific states
  const [etpDetail, setEtpDetail] = useState([]);
  const [formDetail, setFormDetail] = useState([]);
  const [heureDetail, setHeureDetail] = useState([]);
  const [tousEtp, setTousEtp] = useState([]);
  const [searchForm, setSearchForm] = useState("");
  const [showAddPage, setShowAddPage] = useState(false);
  const [etp, setEtp] = useState([]);
  const [activeTab, setActiveTab] = useState("preparation");
  const {
    projets,
    loading,
    projetCounts,
    groupesTries,
    filteredProjets,
    searchTerm,
    notes,
    fetchProjets,
    showAllProjects,
    setShowAllProjects,
  } = useProjectData(status);

  const {

  } = useProjectActions({
    selectedidProjet,
    setSelectedidProjet,
    fetchProjets,
    setNotification,
    setShowNotification,
    dateDebut,
    dateFin,
  });

  const toggleMenu = (projetId) => {
    setShowMenu(showMenu === projetId ? null : projetId);
  };

  const openDrawer = (drawerName, data = {}) => {
    setActiveDrawer(drawerName);
    setDrawerData(data);
  };

  const closeDrawer = () => {
    setActiveDrawer(null);
    setDrawerData({});
    setShowAddPage(false);
  };

  const handleShowApprenants = async (idProjet, idEtp) => {
    try {
      const response = await axios.get(
        `/employes/projets/${idProjet}/apprenant-drawer`
      );
      openDrawer("apprenants", {
        apprenants: response.data,
        idProjet,
        idEtp,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
  };

  const handleShowFormateurs = async (idFormateur, idProjet) => {
    try {
      const response = await axios.get(`/employes/projets/${idFormateur}/mini-cv`);

      openDrawer("formateur", {
        formateurDetail: response.data || {},
        idProjet,
        idFormateur,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
      alert(`Erreur lors du chargement des données : ${error.message}`);
    }
  };

  const handleShowEntreprise = async (idEtp, idProjet) => {
    try {
      // Fetch enterprise details
      const response = await axios.get(`/employes/etp-drawer/${idEtp}`);
      setEtpDetail(response.data || []);

      openDrawer("entreprise", {
        idEtp,
        idProjet,
        etpDetail: response.data || [],
      });
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
  };

  const handleShowHeures = async (idProjet) => {
        try {
            const response = await axios.get(`/employes/projets/${idProjet}/session-drawer`);
            setHeureDetail(response.data || []);

            console.log("seance", response.data || []);
            
            openDrawer("heures", {
              heureDetail: response.data || [],
              idProjet,
            });
        } catch (error) {
            console.error('Erreur lors du chargement de donne :', error);
            alert(`Erreur lors du chargement de donne : ${error.message}`);
        }
  }

  const handleShowDocument = async (idProjet) => {
    try {
      const response = await axios.get(`/employes/projets/${idProjet}/document-drawer`);
      const documents = response.data?.documents || [];
      const nomDossier = response.data?.nomDossier || {};

      console.log("Documents récupérés :", documents);
      console.log("Nom du dossier :", nomDossier);

      setDocDetail(documents);

      openDrawer("documents", {
        doc: documents,
        nomDossier,
        idProjet,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des documents :", error);
    }
  };

   // Dans votre composant Project, modifiez la fonction handleFilter :
  const handleFilter = async () => {
    try {
      const params = {
        idVille: selectedVilles.join(','),
        idType: selectedTypes.join(','),
        idModule: selectedModules.join(','),
        idFinancement: selectedFinancements.join(','),
        idMois: selectedPeriodes.join(','),
        idFormateur: selectedFormateur.join(','),
        idStatut: selectedStatus.join(','),
        search: searchQuery,
      };

      const hasActiveFilters = Object.values(params).some(param => param !== '');
      
      if (hasActiveFilters) {
        const response = await axios.get('/etp/projets/filter/item', { params });
        
        console.log("Réponse complète de l'API:", response);
        console.log("Données des projets filtrés:", response.data.projets);

        // Appliquez le filtrage par statut aux résultats filtrés
        let filteredData = response.data.projets || [];
        
        // Si un statut global est défini (comme "En cours"), filtrez les résultats
        if (status && status !== "all") {
          filteredData = filteredData.filter(projet => {
            // Adaptez cette condition selon la structure de vos données
            return projet.project_status === status || 
                  projet.status === status ||
                  projet.statut === status;
          });
        }

        setFilteredProjects(filteredData);
        setIsFiltered(true);
      } else {
        setFilteredProjects([]);
        setIsFiltered(false);
      }
    } catch (error) {
      console.error('Erreur lors du filtrage:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  
  
  useEffect(() => {
    const hasActiveFilters = 
      selectedVilles.length > 0 ||
      selectedTypes.length > 0 ||
      selectedModules.length > 0 ||
      selectedFinancements.length > 0 ||
      selectedPeriodes.length > 0 ||
      selectedFormateur.length > 0 ||
      selectedStatus.length > 0 || 
      searchQuery.length > 0

    if (hasActiveFilters) {
      const timer = setTimeout(() => {
        handleFilter();
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setFilteredProjects([]);
      setIsFiltered(false);
    }
  }, [
    selectedVilles, 
    selectedTypes, 
    selectedModules, 
    selectedFinancements, 
    selectedStatus,
    selectedPeriodes,
    selectedFormateur,
    searchQuery
  ]);

  const handleResetFilters = () => {
    setSelectedVilles([]);
    setSelectedTypes([]);
    setSelectedPeriodes([]);
    setSelectedModules([]);
    setSelectedFinancements([]);
    setSelectedFormateur([]);
    setSelectedStatus([]);
    setFilteredProjects([]);
    setIsFiltered(false);
  };

  const projectsToDisplay = isFiltered ? filteredProjects : projects;
  
  return (
    <>
      <Notification
        notification={notification}
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />

      <NavBarProject
        fetchProjets={fetchProjets}
        selectedVilles={selectedVilles}    
        setSelectedVilles={setSelectedVilles}
        setSelectedPeriodes={setSelectedPeriodes}
        setSelectedFormateur={setSelectedFormateur}
        selectedTypes={selectedTypes}
        selectedPeriodes={selectedPeriodes}
        setSelectedTypes={setSelectedTypes}
        selectedModules={selectedModules}
        selectedFormateur={selectedFormateur}
        setSelectedModules={setSelectedModules}
        selectedFinancements={selectedFinancements}
        setSelectedFinancements={setSelectedFinancements}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onFilter={handleFilter}
        onResetFilters={handleResetFilters} 
        isFiltered={isFiltered}
        searchQuery={searchQuery} 
        onSearch={handleSearch}
      />

      {loading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <LoadingSpinner />
        </div>
      ) : (
        <ProjectList
          groupesTries={isFiltered ? [] : groupesTries} 
          filteredProjets={isFiltered ? filteredProjects : []}
          searchTerm={searchTerm}
          notes={notes}
          onMenuToggle={toggleMenu}
          showMenu={showMenu}
          onActionClick={{
            handleShowApprenants,
            handleShowLieu: (idProjet) => openDrawer("lieu", { idProjet }),
            handleShowHeures,
            handleShowDocument,
            handleShowEntreprise,
            handleShowFormateurs,
          }}
          isFiltered={isFiltered}
          currentStatus={status}
        />
      )}

      <AnimatePresence>
        {activeDrawer === "apprenants" && (
          <ApprenantDrawer data={drawerData} onClose={closeDrawer} />
        )}

        {activeDrawer === "entreprise" && (
          <EntrepriseDrawer
            data={drawerData}
            onClose={closeDrawer}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}

        {activeDrawer === "formateur" && (
          <TrainerDrawer data={drawerData} onClose={closeDrawer} />
        )}

        {activeDrawer === "documents" && (
          <FolderDrawer data={drawerData} onClose={closeDrawer} />
        )}
        <AuthCalendarProvider>
            {activeDrawer === "heures" && (
              <SessionDrawer data={drawerData} onClose={closeDrawer} />
            )}
        </AuthCalendarProvider>
      </AnimatePresence>
    </>
  );
};

export default Project;
