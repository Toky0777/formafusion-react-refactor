// Project.jsx
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import "aos/dist/aos.css";
import axios from "../../../config/axios";

// Components
import NavBarProject from "../../../components/navbar/navbar-project";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import Notification from "../../../components/notification/Notification";
import ProjectList from "../../../components/project/project-list";
import ApprenantDrawer from "../../../components/drawer/project/learner-drawer";
import { EntrepriseDrawer } from "../../../components/drawer/project/entreprise-drawer";
import { TrainerDrawer } from "../../../components/drawer/project/trainer-drawer";
import { MaterialsDrawer } from "../../../components/drawer/project/materials-drawer";

// Custom hooks
import { useProjectData } from "../../../hooks/useProjectData";
import { useProjectActions } from "../../../hooks/useProjectActions";
import ConfirmationModal from "../../../components/Modals/project/confirmation-modal";
import { SessionDrawer } from "../../../components/drawer/project/session-drawer";
import { FolderDrawer } from "../../../components/drawer/project/folder-drawer";
import { FileDrawer } from "../../../components/drawer/project/file-drawer";
import ProjectDrawer from "../../../components/drawer/customer/ProjectDrawer";
import { projectService } from "../../../services/projectService";
import { Toaster } from "react-hot-toast";

const Project = ({ status }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedidProjet, setSelectedidProjet] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showNotification, setShowNotification] = useState(false);
  const [showConfirmSuprimer, setShowConfirmSuprimer] = useState(false);
  const [showConfirmDupliquer, setShowConfirmDupliquer] = useState(false);
  const [showConfirmArchiver, setShowConfirmArchiver] = useState(false);
  const [showConfirmAnnuler, setShowConfirmAnnuler] = useState(false);
  const [showConfirmReporter, setShowConfirmReporter] = useState(false);
  const [showConfirmCloturer, setShowConfirmCloturer] = useState(false);
  const [showConfirmProgramer, setShowConfirmProgramer] = useState(false);
  const [showConfirmRestoration, setShowConfirmRestoration] = useState(false);
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [showCorbeille, setShowCorbeille] = useState(false);

  const [selectedEntreprises, setSelectedEntreprises] = useState([]);
  const [selectedPeriodes, setSelectedPeriodes] = useState([]);
  const [selectedFormateur, setSelectedFormateur] = useState([]);
  const [selectedVilles, setSelectedVilles] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [selectedFinancements, setSelectedFinancements] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer states
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [drawerData, setDrawerData] = useState({});
  const [tousEtp, setTousEtp] = useState([]);
  const [searchForm, setSearchForm] = useState("");
  const [showAddPage, setShowAddPage] = useState(false);
  const [activeTab, setActiveTab] = useState("preparation");
  const [openDrawerProject, setOpenDarwerProject] = useState(false);
  const [dataEtp, setDataEtp] = useState(null);
  const [isLoadingEtpProject, setIsLoadingEtpProject] = useState(true);
  const {
    groupesTries,
    setLoading,
    loaderRef,
    hasMore,
    setProjets,
    searchTerm,
    notes,
    fetchProjets,
    showAllProjects,
    setShowAllProjects,
    fetchProjetsByStatus,
  } = useProjectData(
    status,
    selectedEntreprises,
    selectedFinancements,
    selectedTypes,
    selectedModules,
    selectedVilles,
    selectedPeriodes,
    selectedFormateur,
    searchQuery
  );

  const {
    askSupressionConfirmation,
    askProgramationConfirmation,
    askDuplicationConfirmation,
    askArchiverConfirmation,
    askAnnulerConfirmation,
    askReporterConfirmation,
    askCloturerConfirmation,
    askRestorationConfirmation,
    confirmRestoration,
    confirmSupression,
    confirmDuplication,
    confirmArchiver,
    confirmCloturer,
    confirmProgramation,
    confirmAnnuler,
    confirmReporter,
  } = useProjectActions({
    selectedidProjet,
    setSelectedidProjet,
    fetchProjets,
    setLoading,
    fetchProjetsByStatus,
    setNotification,
    setShowNotification,
    setShowConfirmSuprimer,
    setShowConfirmDupliquer,
    setShowConfirmArchiver,
    setShowConfirmReporter,
    setShowConfirmCloturer,
    setShowConfirmProgramer,
    setShowConfirmRestoration,
    setShowConfirmAnnuler,
    dateDebut,
    dateFin,
    setProjets,
  });

  const cancelSupression = () => {
    setShowConfirmSuprimer(false);
  };

  const cancelReporter = () => {
    setShowConfirmReporter(false);
  };

  const cancelArchiver = () => {
    setShowConfirmArchiver(false);
  };

  const cancelAnnuler = () => {
    setShowConfirmAnnuler(false);
  };

  const cancelDuplication = () => {
    setShowConfirmDupliquer(false);
  };

  const cancelCloturer = () => {
    setShowConfirmCloturer(false);
  };

  const cancelProgramation = () => {
    setShowConfirmProgramer(false);
  };

  const toggleShowAll = () => {
    setShowAllProjects(!showAllProjects);
  };

  const handleCorbeilleClick = () => {
    setShowCorbeille((prev) => !prev);
  };

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

  const handleShowFormateurs = async (idFormateur, idProjet) => {
    try {
      const response = await axios.get(
        `/cfp/projets/formateur/${idFormateur}/mini-cv`
      );
      const formateurRes = await axios.get(
        `/cfp/projets/${idProjet}/getFormAdded`
      );

      openDrawer("formateur", {
        formateur: formateurRes.data || [],
        formateurDetail: response.data || {},
        idProjet,
        idFormateur,
      });
    } catch (error) {
      alert(`Erreur lors du chargement des données : ${error.message}`);
    }
  };

  const handleShowEntreprise = async (idEtp) => {
    setOpenDarwerProject(true);
    setIsLoadingEtpProject(true);
    const data = await projectService.getInvoiceAndProjectEtp(idEtp);
    setIsLoadingEtpProject(false);
    setDataEtp(data);
  };

  const handleShowHeures = async (idProjet) => {
    try {
      const response = await axios.get(`/cfp/seances/all/${idProjet}`);

      openDrawer("heures", {
        heureDetail: response.data || [],
        idProjet,
      });
    } catch (error) {
      alert(`Erreur lors du chargement de donne : ${error.message}`);
    }
  };

  const handleShowDocument = async (idProjet) => {
    try {
      const response = await axios.get(
        `/cfp/dossier/document/projets/${idProjet}`
      );
      const documents = response.data?.documents || [];
      const nomDossier = response.data?.nomDossier || {};

      openDrawer("documents", {
        doc: documents,
        nomDossier,
        idProjet,
      });
    } catch (error) {}
  };

  const handleShowDossiers = async (idDossier) => {
    try {
      const response = await axios.get(
        `/cfp/dossier/getDossierDetail/${idDossier}`
      );

      openDrawer("dossiers", {
        detailDossier: response.data || [],
        idDossier,
      });
    } catch (error) {
      alert(
        `Erreur lors du chargement des données du dossier: ${error.message}`
      );
    }
  };

  const handleShowMaterials = async (idProjet) => {
    try {
      const response = await axios.get(`/cfp/materials-drawer/${idProjet}`);

      openDrawer("materials", {
        materiel: response.data || [],
        idProjet,
      });
    } catch (error) {
      alert(
        `Erreur lors du chargement des données du dossier: ${error.message}`
      );
    }
  };

  const manageEtp = async (method, idProjet, idEtp) => {
    if (method === "patch") {
      try {
        setNotification({
          message: "Entreprise ajoutée avec succès",
          type: "success",
        });
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } catch (error) {}
    }
  };

  const handleFilter = async () => {
    try {
      const params = {
        idEtp: selectedEntreprises.join(","),
        idVille: selectedVilles.join(","),
        idType: selectedTypes.join(","),
        idModule: selectedModules.join(","),
        idFinancement: selectedFinancements.join(","),
        idMois: selectedPeriodes.join(","),
        idFormateur: selectedFormateur.join(","),
        idStatut: selectedStatus.join(","),
        search: searchQuery,
      };

      const hasActiveFilters = Object.values(params).some(
        (param) => param !== ""
      );

      if (hasActiveFilters) {
        const response = await axios.get("/cfp/projets/filter/items", {
          params,
        });

        let filteredData = response.data.projets || [];

        if (status && status !== "all") {
          filteredData = filteredData.filter((projet) => {
            return (
              projet.project_status === status ||
              projet.status === status ||
              projet.statut === status
            );
          });
        }

        setFilteredProjects(filteredData);
        setIsFiltered(true);
      } else {
        setFilteredProjects([]);
        setIsFiltered(false);
      }
    } catch (error) {
      setNotification({
        message: "Erreur lors du filtrage des projets",
        type: "error",
      });
      setShowNotification(true);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const hasActiveFilters =
      selectedEntreprises.length > 0 ||
      selectedVilles.length > 0 ||
      selectedTypes.length > 0 ||
      selectedModules.length > 0 ||
      selectedFinancements.length > 0 ||
      selectedPeriodes.length > 0 ||
      selectedFormateur.length > 0 ||
      selectedStatus.length > 0 ||
      searchQuery.length > 0;

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
    selectedEntreprises,
    selectedVilles,
    selectedTypes,
    selectedModules,
    selectedFinancements,
    selectedStatus,
    selectedPeriodes,
    selectedFormateur,
    searchQuery,
  ]);

  const handleResetFilters = () => {
    setSelectedEntreprises([]);
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

  const filteredEtps = tousEtp?.etps?.filter(
    (e) =>
      e.etp_name?.toLowerCase().includes(searchForm.toLowerCase()) ||
      e.etp_email?.toLowerCase().includes(searchForm.toLowerCase())
  );

  if (showCorbeille) {
    return <div>Corbeille</div>;
  }

  return (
    <>
      <Toaster position="top-right" />
      <Notification
        notification={notification}
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />
      {[
        {
          key: "Supprimer",
          title: "Supprimer!",
          message: "Voulez-vous vraiment supprimer ce projet ?",
          show: showConfirmSuprimer,
          onConfirm: confirmSupression,
          onCancel: cancelSupression,
        },
        {
          key: "Dupliquer",
          title: "Dupliquer!",
          message: "Voulez-vous vraiment dupliquer ce projet ?",
          show: showConfirmDupliquer,
          onConfirm: confirmDuplication,
          onCancel: cancelDuplication,
        },
        {
          key: "Archiver",
          title: "Archiver!",
          message: "Voulez-vous vraiment archiver ce projet ?",
          show: showConfirmArchiver,
          onConfirm: confirmArchiver,
          onCancel: cancelArchiver,
        },
        {
          key: "Annuler",
          title: "Annuler!",
          message: "Voulez-vous vraiment annuler ce projet ?",
          show: showConfirmAnnuler,
          onConfirm: confirmAnnuler,
          onCancel: cancelAnnuler,
        },
        {
          key: "Programer",
          title: "Confirmer!",
          message: "Voulez-vous vraiment programmer ce projet ?",
          show: showConfirmProgramer,
          onConfirm: confirmProgramation,
          onCancel: cancelProgramation,
        },
        {
          key: "Cloturer",
          title: "Clôturer!",
          message: "Voulez-vous vraiment clôturer ce projet ?",
          show: showConfirmCloturer,
          onConfirm: confirmCloturer,
          onCancel: cancelCloturer,
        },
        {
          key: "Restorer",
          title: "Restorer!",
          message: "Voulez-vous vraiment restore ce projet ?",
          show: showConfirmRestoration,
          onConfirm: confirmRestoration,
          onCancel: cancelCloturer,
        },
      ].map(({ key, title, message, show, onConfirm, onCancel }) => (
        <ConfirmationModal
          key={key}
          title={title}
          message={message}
          show={show}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      ))}
      <ConfirmationModal
        title="Reporter!"
        message="Voulez-vous vraiment reporter ce projet ?"
        show={showConfirmReporter}
        onConfirm={confirmReporter}
        onCancel={cancelReporter}
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="flex flex-col w-full gap-1">
            <span className="inline-flex items-center w-full gap-2">
              <label
                htmlFor="dateDebutProjetDetail_763"
                className="text-slate-700"
              >
                Début
              </label>
              <p className="text-sm italic text-slate-500"></p>
            </span>
            <div className="relative inline-flex w-full">
              <input
                type="date"
                id="dateDebutProjetDetail_763"
                name="dateDebut"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="w-full outline-none dateDebutProjetDetail_763 dateDebutProjetDetail_763_lg input input-bordered"
              />
            </div>
          </div>

          <div className="flex flex-col w-full gap-1">
            <span className="inline-flex items-center w-full gap-2">
              <label
                htmlFor="dateFinProjetDetail_763"
                className="text-slate-700"
              >
                Fin
              </label>
              <p className="text-sm italic text-slate-500"></p>
            </span>
            <div className="relative inline-flex w-full">
              <input
                type="date"
                id="dateFinProjetDetail_763"
                name="dateFin"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                className="w-full outline-none dateFinProjetDetail_763 dateFinProjetDetail_763_lg input input-bordered"
              />
            </div>
          </div>
        </div>
      </ConfirmationModal>
      <ConfirmationModal
        title="Clôturer!"
        message="Voulez-vous vraiment clôturer ce projet ?"
        show={showConfirmCloturer}
        onConfirm={confirmCloturer}
        onCancel={cancelCloturer}
      />
      <NavBarProject
        fetchProjets={fetchProjets}
        selectedEntreprises={selectedEntreprises}
        setSelectedEntreprises={setSelectedEntreprises}
        selectedVilles={selectedVilles}
        selectedPeriodes={selectedPeriodes}
        setSelectedVilles={setSelectedVilles}
        setSelectedPeriodes={setSelectedPeriodes}
        setSelectedFormateur={setSelectedFormateur}
        selectedTypes={selectedTypes}
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

      <ProjectList
        groupesTries={isFiltered ? [] : groupesTries}
        filteredProjets={isFiltered ? filteredProjects : []}
        searchTerm={searchTerm}
        notes={notes}
        onMenuToggle={toggleMenu}
        showMenu={showMenu}
        onActionClick={{
          askSupressionConfirmation,
          askRestorationConfirmation,
          askProgramationConfirmation,
          askDuplicationConfirmation,
          askArchiverConfirmation,
          askAnnulerConfirmation,
          askReporterConfirmation,
          askCloturerConfirmation,
          handleShowLieu: (idProjet) => openDrawer("lieu", { idProjet }),
          handleShowHeures,
          handleShowDocument,
          handleShowEntreprise,
          handleShowFormateurs,
          handleShowDossiers,
          handleShowMaterials,
        }}
        isFiltered={isFiltered}
        currentStatus={status}
      />
      <div ref={loaderRef} className="w-full py-10 text-center text-gray-500">
        {hasMore && <LoadingSpinner />}
      </div>
      <AnimatePresence>
        {activeDrawer === "apprenants" && (
          <ApprenantDrawer data={drawerData} onClose={closeDrawer} />
        )}

        {activeDrawer === "entreprise" && (
          <EntrepriseDrawer
            data={drawerData}
            onClose={closeDrawer}
            onManageEtp={manageEtp}
            searchForm={searchForm}
            setSearchForm={setSearchForm}
            showAddPage={showAddPage}
            setShowAddPage={setShowAddPage}
            filteredEtps={filteredEtps}
            tousEtp={tousEtp}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}

        {activeDrawer === "dossiers" && (
          <FileDrawer data={drawerData} onClose={closeDrawer} />
        )}

        {activeDrawer === "formateur" && (
          <TrainerDrawer data={drawerData} onClose={closeDrawer} />
        )}

        {activeDrawer === "documents" && (
          <FolderDrawer data={drawerData} onClose={closeDrawer} />
        )}
        {activeDrawer === "heures" && (
          <SessionDrawer data={drawerData} onClose={closeDrawer} />
        )}
        {activeDrawer === "materials" && (
          <MaterialsDrawer data={drawerData} onClose={closeDrawer} />
        )}

        {openDrawerProject && (
          <ProjectDrawer
            isLoading={isLoadingEtpProject}
            isShow={openDrawerProject}
            onClose={() => setOpenDarwerProject(false)}
            data={dataEtp}
            account="cfp"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Project;
