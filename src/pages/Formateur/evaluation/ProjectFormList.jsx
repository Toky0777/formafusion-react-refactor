import { useState, useEffect, useMemo } from "react";

import axios from "axios";
import {
  Filter,
  RotateCcw,
  Calendar,
  Building2,
  Check,
  Play,
  LoaderCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { API_URL, IMAGE_URL } from "../../../config/env";

// Composant pour la barre de progression
function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          return 98;
        }
        return prev + 1;
      });
    }, 8);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-1 bg-gray-200 rounded-full">
      <div
        className="h-1 bg-purple-600 rounded-full transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// Composant Modal de confirmation
function ConfirmationModal({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  type,
  projectId,
}) {
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [nbPlace, setNbPlace] = useState("");

  if (!isOpen) return null;

  const renderContent = () => {
    switch (type) {
      case "Reporter":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">A reporter le</h3>
            <div className="flex items-center gap-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Début
                </label>
                <input
                  type="date"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Fin
                </label>
                <input
                  type="date"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        );
      case "RendrePublic":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-gray-600">{description}</p>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Nombre de places
              </label>
              <input
                type="number"
                value={nbPlace}
                onChange={(e) => setNbPlace(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Entrez le nombre de places"
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        );
    }
  };

  const handleConfirm = () => {
    if (type === "Reporter") {
      onConfirm({ dateDebut, dateFin });
    } else if (type === "RendrePublic") {
      onConfirm({ nbPlace });
    } else {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg">
        {renderContent()}
        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Non, annuler
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            Oui, je confirme
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook personnalisé pour la gestion des projets
function useProjectManagement() {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const formatNumber = (
    number,
    decimals = 2,
    decPoint = ",",
    thousandsSep = " "
  ) => {
    if (!number) return "0";
    const n = parseFloat(number).toFixed(decimals);
    const parts = n.replace(".", decPoint).split(decPoint);
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
    const decimalPart = parts.length > 1 ? decPoint + parts[1] : "";
    return integerPart + decimalPart;
  };

  const showToast = (message, type = "success") => {
    if (type === "success") {
      console.log(`✅ ${message}`);
    } else {
      console.error(`❌ ${message}`);
    }
  };

  const getProjects = async (callback) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/projetsForm/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.data) {
        callback(response.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des projets:", error);
      showToast("Erreur lors du chargement des projets", "error");
    } finally {
      setLoading(false);
    }
  };

  const getCsrfToken = () => {
    return (
      document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content") ||
      document.querySelector('input[name="_token"]')?.value ||
      ""
    );
  };

  const manageProject = async (method, url, data = {}) => {
    const csrfToken = getCsrfToken();

    try {
      const requestData = {
        ...data,
        _token: csrfToken,
      };

      let config = {
        method: method.toLowerCase(),
        url: url.startsWith("http")
          ? url
          : `${API_URL}/${url.replace(/^\/+/, "")}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
      };

      if (["post", "put", "patch"].includes(method.toLowerCase())) {
        config.data = requestData;
      }

      const response = await axios(config);

      if (response.data?.success) {
        showToast(response.data.success, "success");
        return { success: true, data: response.data };
      } else if (response.data?.error) {
        showToast(response.data.error, "error");
        return { success: false, error: response.data.error };
      } else {
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error("Erreur lors de la gestion du projet:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erreur lors de la gestion du projet";
      showToast(errorMessage, "error");
      return { success: false, error: errorMessage };
    }
  };

  const reportProject = async (projectId, { dateDebut, dateFin }) => {
    return await manageProject("patch", `etp/projets/${projectId}/report`, {
      dateDebut,
      dateFin,
    });
  };

  const confirmProject = async (projectId) => {
    return await manageProject("patch", `etp/projets/${projectId}/confirm`);
  };

  const deleteProject = async (projectId) => {
    return await manageProject("delete", `etp/projets/${projectId}/destroy`);
  };

  const duplicateProject = async (projectId) => {
    return await manageProject("post", `etp/projets/${projectId}/duplicate`);
  };

  const cancelProject = async (projectId) => {
    return await manageProject("patch", `etp/projets/${projectId}/cancel`);
  };

  const closeProject = async (projectId) => {
    return await manageProject("patch", `etp/projets/${projectId}/close`);
  };

  const updateProjectPrivacy = async (projectId, data = {}) => {
    return await manageProject(
      "patch",
      `etp/projets/${projectId}/updatePrivacy`,
      data
    );
  };

  const initializeDateRangePicker = (elementId) => {
    const initPicker = () => {
      const element = document.getElementById(elementId);

      if (element && window.$ && window.$.fn.daterangepicker) {
        try {
          if (window.$(element).data("daterangepicker")) {
            window.$(element).data("daterangepicker").remove();
          }

          window.$(element).daterangepicker({
            opens: "center",
            showCustomRangeLabel: true,
            autoUpdateInput: false,
            locale: {
              format: "DD/MM/YYYY",
              separator: " - ",
              applyLabel: "Valider",
              cancelLabel: "Annuler",
              fromLabel: "De",
              toLabel: "À",
              customRangeLabel: "Personnalisé",
              weekLabel: "S",
              daysOfWeek: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
              monthNames: [
                "Janvier",
                "Février",
                "Mars",
                "Avril",
                "Mai",
                "Juin",
                "Juillet",
                "Août",
                "Septembre",
                "Octobre",
                "Novembre",
                "Décembre",
              ],
              firstDay: 1,
            },
            ranges: {
              "Aujourd'hui": [],
              Hier: [],
              "7 derniers jours": [],
              "30 derniers jours": [],
              "Ce mois": [],
              "Mois dernier": [],
              "Cette année": [],
            },
          });

          window.$(element).on("apply.daterangepicker", function (ev, picker) {
            const startDate = picker.startDate.format("DD/MM/YYYY");
            const endDate = picker.endDate.format("DD/MM/YYYY");
            this.value = startDate + " - " + endDate;

            const event = new Event("change", { bubbles: true });
            this.dispatchEvent(event);
          });

          window.$(element).on("cancel.daterangepicker", function (ev, picker) {
            this.value = "";

            const event = new Event("change", { bubbles: true });
            this.dispatchEvent(event);
          });

          console.log(
            `DateRangePicker initialisé pour l'élément: ${elementId}`
          );
          return true;
        } catch (error) {
          console.error(
            "Erreur lors de l'initialisation du DateRangePicker:",
            error
          );
          return false;
        }
      } else {
        setTimeout(initPicker, 100);
        return false;
      }
    };

    return initPicker();
  };

  return {
    loading,
    formatNumber,
    getProjects,
    reportProject,
    confirmProject,
    deleteProject,
    duplicateProject,
    cancelProject,
    closeProject,
    updateProjectPrivacy,
    initializeDateRangePicker,
  };
}

// Hook pour la gestion des drawers
function useDrawerManager() {
  // État unifié pour tous les drawers
  const [drawer, setDrawer] = useState({
    isOpen: false,
    type: null, // 'participants', 'client', 'trainer', 'sessions', 'location', 'evaluation'
    data: null,
  });

  // Fonction générique pour ouvrir le drawer
  const openDrawer = (type, data) => {
    setDrawer({
      isOpen: true,
      type: type,
      data: data,
    });
  };

  // Fonctions pour ouvrir les drawers spécifiques
  const openParticipantsDrawer = (project) => {
    openDrawer("participants", project);
  };

  const openClientDrawer = (clientId, projectId) => {
    openDrawer("client", { clientId, projectId });
  };

  const openTrainerDrawer = (trainerId) => {
    openDrawer("trainer", trainerId);
  };

  const openSessionsDrawer = (projectId) => {
    openDrawer("sessions", { projectId });
  };

  const openLocationDrawer = (project) => {
    openDrawer("location", project);
  };

  const openEvaluationDrawer = (project) => {
    openDrawer("evaluation", project);
  };

  // Fonction pour fermer le drawer
  const closeDrawer = () => {
    console.log("Closing drawer"); // Debug
    setDrawer({
      isOpen: false,
      type: null,
      data: null,
    });
  };

  return {
    // État du drawer unifié
    drawer,

    // Fonctions pour ouvrir les drawers
    openParticipantsDrawer,
    openClientDrawer,
    openTrainerDrawer,
    openSessionsDrawer,
    openLocationDrawer,
    openEvaluationDrawer,

    // Fonction pour fermer le drawer
    closeDrawer,
  };
}

// Composant pour les états vides
function EmptyState({ title, description }) {
  return (
    <div className="py-12 text-center">
      <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full">
        <Building2 className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}

// Composant principal modifié
const ProjectFormList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [projects, setProjects] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [accordionStates, setAccordionStates] = useState({});

  // État pour le modal de confirmation
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    description: "",
    projectId: null,
  });

  // Utilisation des hooks personnalisés
  const {
    loading,
    formatNumber,
    getProjects,
    reportProject,
    confirmProject,
    deleteProject,
    duplicateProject,
    cancelProject,
    closeProject,
    updateProjectPrivacy,
    initializeDateRangePicker,
  } = useProjectManagement();
  const drawerManager = useDrawerManager();

  // Debug pour vérifier l'état du drawer
  useEffect(() => {
    console.log("Drawer state changed:", drawerManager.drawer);
  }, [drawerManager.drawer]);

  const loadProjects = async () => {
    await getProjects((data) => {
      if (!data || !data.projets) {
        console.warn("Structure de données inattendue:", data);
        return;
      }

      // Traitement des projets avec ajout du mois
      const processedProjects = data.projets.map((project) => {
        const date = new Date(project.dateDebut);
        const getMonthNumber = date.getMonth();
        const getYears = date.getFullYear();
        const fullMonth = [
          "Janvier",
          "Février",
          "Mars",
          "Avril",
          "Mai",
          "Juin",
          "Juillet",
          "Août",
          "Septembre",
          "Octobre",
          "Novembre",
          "Décembre",
        ];
        const month = `${fullMonth[getMonthNumber]} ${getYears}`;

        return {
          ...project,
          month,
        };
      });

      setProjects(processedProjects);
    });
  };

  const handleProjectAction = (actionType, projectId) => {
    const actionConfig = {
      Valider: {
        title: "Confirmation",
        description: "Voulez-vous vraiment programmer ce projet ?",
      },
      Supprimer: {
        title: "Supprimer!",
        description: "Voulez-vous vraiment supprimer ce projet ?",
      },
      Dupliquer: {
        title: "Dupliquer",
        description: "Voulez-vous vraiment dupliquer ce projet ?",
      },
      Annuler: {
        title: "Annuler",
        description: "Voulez-vous vraiment annuler ce projet ?",
      },
      Cloturer: {
        title: "Clôturer le projet",
        description: "Voulez-vous vraiment clôturer ce projet ?",
      },
      RendrePublic: {
        title: "Mettre sur le marché",
        description: "Voulez-vous vraiment rendre ce projet publique ?",
      },
      RendrePrivee: {
        title: "Retirer du marché",
        description: "Voulez-vous vraiment rendre ce projet privé ?",
      },
      Reporter: {
        title: "Reporter le projet",
        description: "Sélectionnez les nouvelles dates pour ce projet",
      },
    };

    const config = actionConfig[actionType];
    if (config) {
      setModal({
        isOpen: true,
        type: actionType,
        title: config.title,
        description: config.description,
        projectId,
      });
    }
  };

  const handleConfirmAction = async (data = {}) => {
    const { type, projectId } = modal;
    let result = { success: false };

    try {
      switch (type) {
        case "Valider":
          result = await confirmProject(projectId);
          break;
        case "Supprimer":
          result = await deleteProject(projectId);
          break;
        case "Dupliquer":
          result = await duplicateProject(projectId);
          break;
        case "Annuler":
          result = await cancelProject(projectId);
          break;
        case "Cloturer":
          result = await closeProject(projectId);
          break;
        case "RendrePublic":
          result = await updateProjectPrivacy(projectId, {
            nbPlace: data.nbPlace,
          });
          break;
        case "RendrePrivee":
          result = await updateProjectPrivacy(projectId);
          break;
        case "Reporter":
          result = await reportProject(projectId, data);
          break;
        default:
          console.warn("Action non reconnue:", type);
          break;
      }

      if (result.success) {
        setTimeout(() => {
          loadProjects();
        }, 500);
      }
    } catch (error) {
      console.error("Erreur lors de l'action:", error);
    }

    setModal({
      isOpen: false,
      type: "",
      title: "",
      description: "",
      projectId: null,
    });
  };

  const toggleAccordion = (key) => {
    setAccordionStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Calcul des valeurs uniques pour les filtres
  const uniqueStatuses = useMemo(() => {
    return [...new Set(projects.map((p) => p.project_status))];
  }, [projects]);

  const uniqueTypes = useMemo(() => {
    return [...new Set(projects.map((p) => p.project_type))];
  }, [projects]);

  // Fonction pour grouper les projets par mois
  const getProjectsByMonth = (projectsArray) => {
    if (!projectsArray || projectsArray.length === 0) return {};

    let filteredProjects = projectsArray;

    if (searchTerm) {
      filteredProjects = filteredProjects.filter(
        (project) =>
          project.module_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.etp_name_in_situ
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.ville?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.project_description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filteredProjects = filteredProjects.filter(
        (project) => project.project_status === selectedStatus
      );
    }

    if (selectedType !== "all") {
      filteredProjects = filteredProjects.filter(
        (project) => project.project_type === selectedType
      );
    }

    const grouped = filteredProjects.reduce((acc, project) => {
      const month = project.month;
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(project);
      return acc;
    }, {});

    const sortedGrouped = {};
    Object.keys(grouped)
      .sort((a, b) => {
        const [monthA, yearA] = a.split(" ");
        const [monthB, yearB] = b.split(" ");

        const fullMonth = [
          "Janvier",
          "Février",
          "Mars",
          "Avril",
          "Mai",
          "Juin",
          "Juillet",
          "Août",
          "Septembre",
          "Octobre",
          "Novembre",
          "Décembre",
        ];
        const monthIndexA = fullMonth.indexOf(monthA);
        const monthIndexB = fullMonth.indexOf(monthB);

        if (yearA !== yearB) {
          return parseInt(yearB) - parseInt(yearA);
        }
        return monthIndexB - monthIndexA;
      })
      .forEach((key) => {
        sortedGrouped[key] = grouped[key];
      });

    return sortedGrouped;
  };

  // Statistiques globales
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const terminés = projects.filter(
      (p) => p.project_status === "Terminé"
    ).length;
    const enCours = projects.filter(
      (p) => p.project_status === "En Cours"
    ).length;
    const totalSeances = projects.reduce(
      (sum, p) => sum + (p.seanceCount || 0),
      0
    );

    return { totalProjects, terminés, enCours, totalSeances };
  }, [projects]);

  // Initialisation des daterangepickers après montage
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeDateRangePicker("daterangeProjet");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div>
                <h1 className="text-gray-900 text-md">
                  Tous les projets ({projects.length})
                </h1>
                {loading && <ProgressBar />}
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    showFilter
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </button>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedStatus("all");
                    setSelectedType("all");
                  }}
                  className="inline-flex items-center px-4 py-2 text-gray-700 transition-colors duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
            <StatsCard
              title="Total Projets"
              value={stats.totalProjects}
              icon={<Building2 className="w-5 h-5" />}
              color="blue"
            />
            <StatsCard
              title="Terminés"
              value={stats.terminés}
              icon={<Check className="w-5 h-5" />}
              color="green"
            />
            <StatsCard
              title="En Cours"
              value={stats.enCours}
              icon={<Play className="w-5 h-5" />}
              color="blue"
            />
            <StatsCard
              title="Total Séances"
              value={stats.totalSeances}
              icon={<Calendar className="w-5 h-5" />}
              color="purple"
            />
          </div>

          {/* Filter Section */}
          {showFilter && (
            <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Rechercher
                  </label>
                  <input
                    type="text"
                    placeholder="Rechercher par titre, entreprise, ville..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Statut
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="all">Tous les statuts</option>
                    {uniqueStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="all">Tous les types</option>
                    {uniqueTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <LoaderCircle className="w-6 h-6 mx-auto animate-spin text-purple-500 border-purple-500" />
              </div>
            </div>
          ) : (
            <div>
              <ProjectsContent
                projects={projects}
                getProjectsByMonth={getProjectsByMonth}
                onProjectAction={handleProjectAction}
                accordionStates={accordionStates}
                onToggleAccordion={toggleAccordion}
                drawerManager={drawerManager}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmation */}
      <ConfirmationModal
        isOpen={modal.isOpen}
        onClose={() =>
          setModal({
            isOpen: false,
            type: "",
            title: "",
            description: "",
            projectId: null,
          })
        }
        title={modal.title}
        description={modal.description}
        type={modal.type}
        projectId={modal.projectId}
        onConfirm={handleConfirmAction}
      />

      {/* Tous les drawers */}
      {/* <DrawerEtp
                isOpen={drawerManager.drawer.isOpen}
                onClose={drawerManager.closeDrawer}
                type={drawerManager.drawer.type}
                data={drawerManager.drawer.data}
            /> */}
    </>
  );
};

// Composant pour le contenu des projets
function ProjectsContent({
  projects,
  getProjectsByMonth,
  onProjectAction,
  accordionStates,
  onToggleAccordion,
  drawerManager,
}) {
  const projectsByMonth = getProjectsByMonth(projects);

  return (
    <div className="space-y-8">
      {Object.keys(projectsByMonth).length === 0 ? (
        <EmptyState
          title="Aucun projet trouvé"
          description="Essayez de modifier vos critères de recherche."
        />
      ) : (
        Object.entries(projectsByMonth).map(([month, monthProjects]) => (
          <MonthSection
            key={month}
            month={month}
            projects={monthProjects}
            isExpanded={accordionStates[month] !== false}
            onToggle={() => onToggleAccordion(month)}
            onProjectAction={onProjectAction}
            drawerManager={drawerManager}
          />
        ))
      )}
    </div>
  );
}

function MonthSection({
  month,
  projects,
  isExpanded,
  onToggle,
  onProjectAction,
  drawerManager,
}) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
      <div
        className="px-6 py-4 border-b border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <h3 className="flex items-center text-lg font-semibold text-gray-900">
            <Calendar className="w-5 h-5 mr-2 text-purple-600" />
            {month}
            <span className="px-2 py-1 ml-2 text-xs font-medium text-purple-600 bg-purple-100 rounded-full">
              {projects.length} projet{projects.length > 1 ? "s" : ""}
            </span>
          </h3>
          <button className="text-gray-400 hover:text-gray-600">
            {isExpanded ? "−" : "+"}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-3 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard
                key={`${project.idProjet}-${index}`}
                project={project}
                drawerManager={drawerManager}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Composant ProjectCard modifié pour correspondre aux nouvelles données
function ProjectCard({ project, drawerManager }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const getStatusStyles = (status) => {
    switch (status) {
      case "Terminé":
        return "bg-emerald-500 text-white border-emerald-500";
      case "En cours":
        return "bg-blue-500 text-white border-blue-500";
      case "En préparation":
        return "bg-yellow-400 text-gray-900 border-yellow-400";
      case "Annulé":
        return "bg-red-500 text-white border-red-500";
      default:
        return "bg-gray-500 text-white border-gray-500";
    }
  };

  const getTypeStyles = (type) => {
    return type === "Intra"
      ? "text-indigo-700 bg-indigo-50 border-indigo-200"
      : "text-purple-700 bg-purple-50 border-purple-200";
  };

  const getModalityStyles = (modality) => {
    switch (modality) {
      case "Présentielle":
        return "text-cyan-700 bg-cyan-50 border-cyan-200";
      case "Distanciel":
        return "text-green-700 bg-green-50 border-green-200";
      case "Hybride":
        return "text-orange-700 bg-orange-50 border-orange-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  // Fonctions pour gérer les clics avec le drawer unifié
  const handleShowParticipants = (e) => {
    e.stopPropagation();
    drawerManager.openParticipantsDrawer(project);
  };

  const handleShowClient = (clientId, e) => {
    e.stopPropagation();
    drawerManager.openClientDrawer(clientId, project.idProjet);
  };

  const handleViewTrainerCV = (trainerId, e) => {
    drawerManager.openTrainerDrawer(trainerId);
  };

  const handleShowSessions = (e) => {
    e.stopPropagation();
    drawerManager.openSessionsDrawer(project.idProjet);
  };

  const handleShowLocation = (e) => {
    e.stopPropagation();
    drawerManager.openLocationDrawer(project);
  };

  const handleViewDetails = (projectId) => {
    navigate(`projetsForm/${projectId}/detailForm`);
  };

  const handleEvaluateProject = (e) => {
    e.stopPropagation();
    drawerManager.openEvaluationDrawer(project);
  };

  // Extraction des données d'entreprise
  const etpData =
    Array.isArray(project.etp_name) && project.etp_name.length > 0
      ? project.etp_name[0]
      : null;

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden h-[420px]">
      <div className="flex flex-col h-full p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3
              className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors line-clamp-2 mb-2"
              onClick={() => handleViewDetails(project.idProjet)}
              title={project.module_name}
            >
              {project.module_name}
            </h3>
          </div>

          <div className="relative ml-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 transition-colors duration-200 rounded-xl bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 z-20 w-56 py-2 bg-white border border-gray-200 shadow-lg top-12 rounded-xl">
                  <div className="px-4 py-2 text-sm font-medium text-gray-500 border-b border-gray-100">
                    Actions
                  </div>
                  <button
                    onClick={() => {
                      handleViewDetails(project.idProjet);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <EyeIcon className="w-4 h-4" />
                    Aperçu
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className={clsx(
                "px-3 py-1 text-sm rounded-xl border font-medium",
                getTypeStyles(project.project_type)
              )}
            >
              {project.project_type}
            </span>
            <span
              className={clsx(
                "px-3 py-1 text-sm rounded-xl border font-medium",
                getModalityStyles(project.modalite)
              )}
            >
              {project.modalite}
            </span>
          </div>
          <span
            className={clsx(
              "px-3 py-1 text-sm rounded-xl border font-medium",
              getStatusStyles(project.project_status)
            )}
          >
            {project.project_status}
          </span>
        </div>

        {/* Participants and Client */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="flex -space-x-2 cursor-pointer hover:scale-105 transition-transform"
            onClick={handleShowParticipants}
            title="Voir les participants"
          >
            {project.apprs?.slice(0, 3).map((participant, index) =>
              participant.emp_photo ? (
                <img
                  key={participant.idEmploye}
                  src={`${IMAGE_URL}/img/employes/${participant.emp_photo}`}
                  alt={participant.emp_name}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                />
              ) : (
                <div
                  key={participant.idEmploye}
                  className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs"
                >
                  {participant.emp_name?.charAt(0) || "?"}
                </div>
              )
            ) || (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                ?
              </div>
            )}
          </div>

          <div className="cursor-pointer hover:scale-105 transition-transform">
            {etpData && etpData.etp_logo && (
              <img
                src={`${IMAGE_URL}/img/entreprises/${etpData.etp_logo}`}
                alt={etpData.etp_name}
                className="object-contain w-20 h-10 duration-200 grayscale hover:grayscale-0 rounded-xl ring-2 ring-white"
                onClick={(e) => {
                  handleShowClient(etpData.idEtp, e);
                }}
                title={etpData.etp_name}
              />
            )}
          </div>
        </div>

        {/* Trainers and Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex -space-x-2" title="Formateurs">
            {project.formateurs?.length > 0 ? (
              project.formateurs.map((trainer) => (
                <img
                  key={trainer.idFormateur}
                  src={`${IMAGE_URL}/img/formateurs/${trainer.form_photo}`}
                  alt={trainer.form_name}
                  className="w-8 h-8 transition-transform border-2 border-white rounded-full shadow-sm cursor-pointer hover:scale-110"
                  onClick={(e) => handleViewTrainerCV(trainer.idFormateur, e)}
                />
              ))
            ) : (
              <div className="flex items-center justify-center w-8 h-8 text-xs font-bold border-2 border-white rounded-full bg-slate-200 text-slate-600">
                ?
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span
              className="flex items-center gap-1 text-lg font-medium text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors"
              title="Heures totales"
            >
              <ClockIcon className="w-4 h-4" />
              {project.totalSessionHour || "N/A"}
              <span className="text-sm text-gray-400 font-normal">Hrs</span>
            </span>
            <span
              className="flex items-center gap-1 text-lg font-medium text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors"
              onClick={handleShowSessions}
              title="Voir les sessions"
            >
              <UserGroupIcon className="w-4 h-4" />
              {project.seanceCount}
              <span className="text-sm text-gray-400 font-normal">Ses</span>
            </span>
          </div>
        </div>

        {/* Location */}
        <div
          className="mb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
          onClick={handleShowLocation}
          title="Voir la localisation"
        >
          <div className="flex items-center gap-2">
            <MapPinIcon className="flex-shrink-0 w-4 h-4 text-gray-400" />
            <p className="text-sm text-gray-500 line-clamp-2">
              {`${project.salle_name || ""}, ${project.salle_quartier || ""}, ${
                project.ville || ""
              } (${project.salle_code_postal || ""})`}
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="pt-4 mt-auto border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <h5 className="mb-1 text-sm text-gray-400">Date de début</h5>
              <p className="flex items-center justify-center gap-1 font-semibold text-gray-900">
                <CalendarDaysIcon className="w-4 h-4" />
                {project.dateDebut}
              </p>
            </div>
            <div className="text-center">
              <h5 className="mb-1 text-sm text-gray-400">Date de fin</h5>
              <p className="flex items-center justify-center gap-1 font-semibold text-gray-900">
                <CalendarDaysIcon className="w-4 h-4" />
                {project.dateFin}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant StatsCard
function StatsCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
  };

  return (
    <div className="p-4 transition-shadow duration-200 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium tracking-wide text-gray-600 uppercase">
            {title}
          </p>
          <p className="mt-1 text-lg font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-2 rounded-lg border ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export { ProjectCard, useDrawerManager };
export default ProjectFormList;
