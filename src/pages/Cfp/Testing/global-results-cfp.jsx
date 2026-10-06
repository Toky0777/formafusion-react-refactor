import { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import {
  BarChart,
  ArrowLeft,
  TrendingUp,
  Target,
  Award,
  Users,
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { FilterResults } from "./Components/FilterResults";
import { useAuth } from "../../../contexts/AuthContext";
import axios from "../../../config/axios";
import { TableResults } from "./Components/TableResults";
import { Spinner } from "../../../components/ui/spinner";

// Enregistrer tous les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineController,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function GlobalResultsCfp() {
  const [isLoading, setIsLoading] = useState(false);
  const [apprenants, setApprenants] = useState([]);
  const [filteredApprenants, setFilteredApprenants] = useState([]);
  const { user } = useAuth();

  // États pour le modal chart
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // États pour les filtres
  const [filters, setFilters] = useState({
    name: "",
    etp: "",
    qcm: "",
    date: "",
    pointsMin: "",
    pointsMax: "",
    level: "",
    campaign: "",
  });

  const dataNames = [
    "rang",
    "name",
    "firstname",
    "etp",
    "campaignName",
    "date",
    "intituleqcm",
    "points",
    "niveau",
  ];
  const columns = [
    "Rang",
    "Nom",
    "Firstname",
    "Entreprise",
    "Campagne",
    "Date",
    "QCM",
    "Points",
    "Niveau",
  ];

  /* test */

  // Fonction pour ouvrir le modal chart
  const openChartModal = () => {
    setIsChartModalOpen(true);
    loadChartData();
  };

  // Fonction pour fermer le modal chart
  const closeChartModal = () => {
    setIsChartModalOpen(false);
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }
    setChartError(null);
  };

  // Fonction pour charger les données du chart
  const loadChartData = async () => {
    setChartLoading(true);
    setChartError(null);

    if (!user?.id) {
      setChartError("Erreur: Identifiants manquants");
      setChartLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `/global-results/qcm/chart-data-global/${user.id}`
      );
      const data = response.data;

      const maxPoints =
        data.pointsMaxQcm && data.pointsMaxQcm.length > 0
          ? data.pointsMaxQcm[0].points_maximum
          : Math.max(...data.chartData.datasets[0].data);

      setChartData({
        ...data.chartData,
        maxPoints,
      });
    } catch (err) {
      setChartError(`Erreur lors du chargement des données: ${err.message}`);
    } finally {
      setChartLoading(false);
    }
  };

  // Fonction de filtrage
  const applyFilters = () => {
    let filtered = [...apprenants];

    // Filtre par nom
    if (filters.name) {
      filtered = filtered.filter(
        (apprenant) =>
          apprenant.name.toLowerCase().includes(filters.name.toLowerCase()) ||
          apprenant.firstname.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    // Filtre par entreprise
    if (filters.etp) {
      filtered = filtered.filter((apprenant) =>
        apprenant.etp.toLowerCase().includes(filters.etp.toLowerCase())
      );
    }

    // Filtre par QCM
    if (filters.qcm) {
      filtered = filtered.filter((apprenant) =>
        apprenant.intituleqcm.toLowerCase().includes(filters.qcm.toLowerCase())
      );
    }

    // Filtre par date
    if (filters.date) {
      filtered = filtered.filter((apprenant) => {
        const apprenantDate = new Date(apprenant.date)
          .toISOString()
          .split("T")[0];
        return apprenantDate === filters.date;
      });
    }

    // Filtre par points minimum
    if (filters.pointsMin) {
      filtered = filtered.filter(
        (apprenant) =>
          parseFloat(apprenant.points) >= parseFloat(filters.pointsMin)
      );
    }

    // Filtre par points maximum
    if (filters.pointsMax) {
      filtered = filtered.filter(
        (apprenant) =>
          parseFloat(apprenant.points) <= parseFloat(filters.pointsMax)
      );
    }

    // Filtre par niveau
    if (filters.level) {
      filtered = filtered.filter(
        (apprenant) => apprenant.niveau === filters.level
      );
    }

    // Filtre par campagne
    if (filters.campaign) {
      filtered = filtered.filter(
        (apprenant) => apprenant.campaignName === filters.campaign
      );
    }

    setFilteredApprenants(filtered);
  };

  // Appliquer les filtres à chaque changement
  useEffect(() => {
    applyFilters();
  }, [filters, apprenants]);

  // Fonction pour mettre à jour les filtres
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      name: "",
      etp: "",
      qcm: "",
      date: "",
      pointsMin: "",
      pointsMax: "",
      level: "",
      campaign: "",
    });
  };

  // Créer le graphique quand les données sont disponibles
  useEffect(() => {
    if (chartData && chartRef.current && isChartModalOpen) {
      // Détruire le graphique existant s'il y en a un
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      chartInstanceRef.current = new ChartJS(ctx, {
        type: "bar",
        data: {
          labels: chartData.labels,
          datasets: chartData.datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: chartData.maxPoints,
              ticks: {
                stepSize: Math.ceil(chartData.maxPoints / 5),
              },
            },
          },
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.dataset.label || "";
                  const value = context.raw || 0;
                  const percentage = (
                    (value / chartData.maxPoints) *
                    100
                  ).toFixed(1);
                  return `${label}: ${value} (${percentage}%)`;
                },
              },
            },
          },
        },
      });
    }
  }, [chartData, isChartModalOpen]);

  // Gérer la fermeture avec Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeChartModal();
      }
    };

    if (isChartModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isChartModalOpen]);

  // Nettoyer le graphique lors du démontage du composant
  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);
  const ResultRequest = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("global-results/qcm");
      setApprenants(res.data.apprenants);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    ResultRequest();
  }, []);

  // Obtenir les valeurs uniques pour les selects
  const uniqueLevels = [...new Set(apprenants.map((a) => a.niveau))].filter(
    Boolean
  );
  const uniqueCampaigns = [
    ...new Set(apprenants.map((a) => a.campaignName)),
  ].filter(Boolean);
  if (isLoading) return <Spinner />;
  return (
    <>
      <div className="min-h-[110vh] relative overflow-hidden">
        {/* Hero Section épuré */}
        <div className="container px-4 mx-auto pt-8 relative z-10">
          <div className="flex justify-end mb-6">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={openChartModal}
                className="group inline-flex items-center px-6 py-3 font-medium text-gray-700 transition-all duration-300 border-2 border-gray-300 rounded-2xl hover:border-gray-500 hover:bg-gray-100 hover:scale-105 transform shadow-lg"
              >
                <BarChart className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Voir les graphiques
              </button>

              <Link
                to="/cfp/prequal"
                className="group inline-flex items-center px-6 py-3 font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl hover:from-blue-600 hover:to-purple-600 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transform"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Retour au menu
              </Link>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="min-h-screen py-8 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative z-10 mt-8">
          <div className="container px-4 mx-auto">
            {/* Statistiques */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
              <div className="group p-6 bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 transform hover:bg-gradient-to-br hover:from-blue-50 hover:to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Apprenants
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                      {filteredApprenants.length}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                    <Users className="w-7 h-7 text-blue-700" />
                  </div>
                </div>
              </div>

              <div className="group p-6 bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 transform hover:bg-gradient-to-br hover:from-emerald-50 hover:to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Campagnes
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                      {uniqueCampaigns.length}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                    <Target className="w-7 h-7 text-emerald-700" />
                  </div>
                </div>
              </div>

              <div className="group p-6 bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 transform hover:bg-gradient-to-br hover:from-purple-50 hover:to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Niveaux
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                      {uniqueLevels.length}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                    <Award className="w-7 h-7 text-purple-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section principale */}
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
                      Résultats Actifs
                    </h2>
                    <p className="text-gray-600 font-medium">
                      Gérez vos résultats et leurs invitations
                    </p>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-8">
                <FilterResults
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={resetFilters}
                  levels={uniqueLevels}
                  campaigns={uniqueCampaigns}
                />

                <div className="mt-8">
                  <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg overflow-hidden">
                    <TableResults
                      datas={filteredApprenants}
                      columns={columns}
                      dataNames={dataNames}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Chart simplifié */}
        {isChartModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden border border-white/20">
              {/* Header du modal */}
              <div className="px-8 py-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent mb-1">
                      Analyse graphique
                    </h2>
                    <p className="text-gray-600 font-medium">
                      Visualisation des performances
                    </p>
                  </div>
                  <button
                    onClick={closeChartModal}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white bg-transparent hover:bg-red-500 rounded-full transition-all duration-300 hover:scale-110 transform"
                  >
                    <span className="text-xl font-bold">×</span>
                  </button>
                </div>
              </div>

              {/* Contenu du modal */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Zone du graphique */}
                <div className="mb-8">
                  {chartLoading && (
                    <div className="flex items-center justify-center rounded-2xl h-96 bg-gradient-to-br from-gray-50 to-blue-50">
                      <div className="text-center">
                        <div className="relative">
                          <div className="w-16 h-16 mx-auto mb-6 border-4 border-purple-200 rounded-full"></div>
                          <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <div className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          Chargement des données...
                        </div>
                      </div>
                    </div>
                  )}

                  {chartError && (
                    <div className="p-6 border border-red-200 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-12 h-12 mr-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg">
                          <span className="font-bold text-white text-xl">
                            !
                          </span>
                        </div>
                        <div className="text-red-700 font-medium text-lg">
                          {chartError}
                        </div>
                      </div>
                    </div>
                  )}

                  {chartData && !chartLoading && !chartError && (
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50">
                      <div
                        className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30"
                        style={{ height: "400px" }}
                      >
                        <canvas ref={chartRef}></canvas>
                      </div>
                    </div>
                  )}
                </div>

                {/* Statistiques */}
                {chartData && chartData.overall_stats && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <div className="group p-6 border border-blue-200/50 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-xl transition-all duration-500 hover:scale-105 transform backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3">
                        <Users className="w-6 h-6 text-blue-700 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Total utilisateurs
                      </p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-900 bg-clip-text text-transparent">
                        {chartData.overall_stats.total_users}
                      </p>
                    </div>

                    <div className="group p-6 border border-emerald-200/50 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 hover:shadow-xl transition-all duration-500 hover:scale-105 transform backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3">
                        <Target className="w-6 h-6 text-emerald-700 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <p className="text-sm font-semibold text-emerald-700 mb-2">
                        Sessions totales
                      </p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-emerald-800 to-emerald-900 bg-clip-text text-transparent">
                        {chartData.overall_stats.total_sessions}
                      </p>
                    </div>

                    <div className="group p-6 border border-purple-200/50 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-xl transition-all duration-500 hover:scale-105 transform backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3">
                        <Award className="w-6 h-6 text-purple-700 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <p className="text-sm font-semibold text-purple-700 mb-2">
                        Score moyen
                      </p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-purple-800 to-purple-900 bg-clip-text text-transparent">
                        {chartData.overall_stats.average_total_score}%
                      </p>
                    </div>

                    <div className="group p-6 border border-orange-200/50 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 hover:shadow-xl transition-all duration-500 hover:scale-105 transform backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3">
                        <TrendingUp className="w-6 h-6 text-orange-700 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <p className="text-sm font-semibold text-orange-700 mb-2">
                        Points maximum
                      </p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-orange-800 to-orange-900 bg-clip-text text-transparent">
                        {chartData.maxPoints}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer du modal */}
              <div className="px-8 py-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex justify-end">
                  <button
                    onClick={closeChartModal}
                    className="px-6 py-3 text-white font-medium transition-all duration-300 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl hover:from-gray-700 hover:to-gray-800 hover:shadow-xl hover:scale-105 transform"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
