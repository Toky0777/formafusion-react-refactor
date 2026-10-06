import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { BarChart, ArrowLeft, X } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  RadialLinearScale,
  RadarController,
  Filler,
} from "chart.js";
import { useAuth } from "../../../contexts/AuthContext";
import axios from "../../../config/axios";
import { TablePaginator } from "../../../components/tabs/TablePaginator";
import { formatDate } from "../../../utils/TestdateUtils";
import { Spinner } from "../../../components/ui/spinner";
import { ActionButtonFormTest } from "../../../components/button/ActionButtonFormTest";

// Enregistrer tous les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  BarController,
  LineController,
  RadarController, // ← AJOUT MANQUANT
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // ← AJOUT RECOMMANDÉ
);

// Composant SpiderChart séparé et optimisé
// Remplacez votre composant SpiderChart existant par celui-ci
const SpiderChart = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data || !canvasRef.current) return;

    // Vérifier que les données nécessaires existent
    if (!data.chartData?.labels || !data.chartData?.datasets) {
      console.warn("Données du graphique incomplètes:", data);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    // Configuration du canvas pour un rendu haute résolution
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) - 80;

    // Utiliser les vraies données de votre API
    const categories = data.chartData.labels || [];
    const datasets = data.chartData.datasets || [];
    const maxPoints = data.pointsMaxQcm?.[0]?.points_maximum
      ? parseInt(data.pointsMaxQcm[0].points_maximum)
      : 100;

    // Extraire les valeurs du premier dataset et les normaliser
    const rawValues = datasets.length > 0 ? datasets[0].data || [] : [];
    const values = rawValues.map((val) => Math.min(val / maxPoints, 1)); // Normaliser entre 0 et 1

    // Points maximum par catégorie (vous pouvez adapter selon vos données)
    const categoryMaxPoints = categories.map(() => maxPoints);

    // Couleurs
    const gridColor = "#E2E8F0";
    const textColor = "#64748B";
    const fillColor = "rgba(139, 92, 246, 0.3)"; // Violet semi-transparent comme l'aperçu
    const strokeColor = "#8B5CF6"; // Violet

    // Effacer le canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Dessiner la grille de fond
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    // Cercles concentriques (0.2, 0.4, 0.6, 0.8, 1.0)
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Lignes radiales
    const angleStep = (2 * Math.PI) / categories.length;
    for (let i = 0; i < categories.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      );
      ctx.stroke();
    }

    // Dessiner les labels et valeurs
    ctx.fillStyle = textColor;
    ctx.font = "12px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < categories.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const labelRadius = radius + 50;
      const valueRadius = radius + 25;

      const labelX = centerX + Math.cos(angle) * labelRadius;
      const labelY = centerY + Math.sin(angle) * labelRadius;
      const valueX = centerX + Math.cos(angle) * valueRadius;
      const valueY = centerY + Math.sin(angle) * valueRadius;

      // Dessiner le label de la catégorie (avec retour à la ligne si nécessaire)
      const words = categories[i].split(" ");
      if (words.length > 2) {
        ctx.fillText(words.slice(0, 2).join(" "), labelX, labelY - 6);
        ctx.fillText(words.slice(2).join(" "), labelX, labelY + 6);
      } else {
        ctx.fillText(categories[i], labelX, labelY);
      }

      // Dessiner la valeur maximum pour cette catégorie
      ctx.fillStyle = "#374151";
      ctx.font = "bold 14px system-ui, -apple-system, sans-serif";
      ctx.fillText(categoryMaxPoints[i].toString(), valueX, valueY);
      ctx.fillStyle = textColor;
      ctx.font = "12px system-ui, -apple-system, sans-serif";
    }

    // Dessiner les valeurs de la grille (0.2, 0.4, 0.6, 0.8, 1.0)
    ctx.fillStyle = "#9CA3AF";
    ctx.font = "10px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    for (let i = 1; i <= 5; i++) {
      const value = (i * 0.2).toFixed(1);
      const gridRadius = (radius * i) / 5;
      ctx.fillText(value, centerX + 5, centerY - gridRadius);
    }

    // Dessiner la forme des données seulement si nous avons des valeurs
    if (values.length > 0) {
      ctx.beginPath();
      for (let i = 0; i < values.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const dataRadius = radius * values[i];
        const x = centerX + Math.cos(angle) * dataRadius;
        const y = centerY + Math.sin(angle) * dataRadius;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();

      // Remplir la forme
      ctx.fillStyle = fillColor;
      ctx.fill();

      // Contour de la forme
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Points sur les sommets
      ctx.fillStyle = strokeColor;
      for (let i = 0; i < values.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const dataRadius = radius * values[i];
        const x = centerX + Math.cos(angle) * dataRadius;
        const y = centerY + Math.sin(angle) * dataRadius;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }, [data]);

  // Affichage conditionnel pour le debug
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  if (!data.chartData?.labels || !data.chartData?.datasets) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p>Données incomplètes</p>
          <p className="mt-2 text-sm">
            Labels: {data.chartData?.labels ? "✓" : "✗"}
          </p>
          <p className="text-sm">
            Datasets: {data.chartData?.datasets ? "✓" : "✗"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: "100%", height: "400px" }}
      />
    </div>
  );
};

export default function ResultQcmFormateur() {
  const { t } = useTranslation();
  const { id } = useParams();

  // États principaux
  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apprenants, setApprenants] = useState([]);
  const [filteredApprenants, setFilteredApprenants] = useState([]);

  // États pour la modal du graphique
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);
  const { user } = useAuth();

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

  // Fonction pour récupérer les données principales
  const fetchData = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`/qcm/${id}/list-apprenants/results`);
      const rawData = response.data?.apprenants || [];
      setApprenants(rawData);

      const dataWithActions = rawData.map((data, index) => ({
        ...data,
        actions: (
          <ActionButtonFormTest
            id={data.idqcm}
            idApprenant={data.id}
            idSession={data.session}
            key={`action-${data.id}-${index}`}
          />
        ),
        date: formatDate(data.date),
      }));

      setDatas(dataWithActions);
    } catch (error) {
      console.error(t("Error retrieving data"), error);
      // Vous pouvez ajouter une notification d'erreur ici
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // Fonction de filtrage optimisée
  const applyFilters = useCallback(() => {
    if (apprenants.length === 0) return;

    let filtered = [...apprenants];

    // Filtrage par nom/prénom
    if (filters.name?.trim()) {
      const searchTerm = filters.name.toLowerCase().trim();
      filtered = filtered.filter(
        (apprenant) =>
          apprenant.name?.toLowerCase().includes(searchTerm) ||
          apprenant.firstname?.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrage par entreprise
    if (filters.etp?.trim()) {
      const searchTerm = filters.etp.toLowerCase().trim();
      filtered = filtered.filter((apprenant) =>
        apprenant.etp?.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrage par QCM
    if (filters.qcm?.trim()) {
      const searchTerm = filters.qcm.toLowerCase().trim();
      filtered = filtered.filter((apprenant) =>
        apprenant.intituleqcm?.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrage par date
    if (filters.date) {
      filtered = filtered.filter((apprenant) => {
        try {
          const apprenantDate = new Date(apprenant.date)
            .toISOString()
            .split("T")[0];
          return apprenantDate === filters.date;
        } catch {
          return false;
        }
      });
    }

    // Filtrage par points minimum
    if (filters.pointsMin !== "") {
      const minPoints = parseFloat(filters.pointsMin);
      if (!isNaN(minPoints)) {
        filtered = filtered.filter(
          (apprenant) => parseFloat(apprenant.points || 0) >= minPoints
        );
      }
    }

    // Filtrage par points maximum
    if (filters.pointsMax !== "") {
      const maxPoints = parseFloat(filters.pointsMax);
      if (!isNaN(maxPoints)) {
        filtered = filtered.filter(
          (apprenant) => parseFloat(apprenant.points || 0) <= maxPoints
        );
      }
    }

    // Filtrage par niveau
    if (filters.level) {
      filtered = filtered.filter(
        (apprenant) => apprenant.niveau === filters.level
      );
    }

    // Filtrage par campagne
    if (filters.campaign) {
      filtered = filtered.filter(
        (apprenant) => apprenant.campaignName === filters.campaign
      );
    }

    // Mise à jour des données avec actions
    const filteredWithActions = filtered.map((data, index) => ({
      ...data,
      actions: (
        <ActionButtonFormTest
          id={data.idqcm}
          idApprenant={data.id}
          idSession={data.session}
          key={`filtered-${data.id}-${index}`}
        />
      ),
    }));

    setFilteredApprenants(filtered);
    setDatas(filteredWithActions);
  }, [filters, apprenants]);

  // Gestion des changements de filtres
  const handleFilterChange = useCallback((filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  }, []);

  // Réinitialisation des filtres
  const resetFilters = useCallback(() => {
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
  }, []);

  // Fonction pour charger les données du graphique
  const loadChartData = useCallback(async () => {
    if (!id) {
      setChartError(t("Missing identifiers"));
      return;
    }

    setChartLoading(true);
    setChartError(null);

    const currentQcmId = id;
    const currentCfpId = user.id; // À ajuster selon votre logique

    try {
      const response = await axios.get(
        `/qcm/spider-chart-data-global/${currentQcmId}/${currentCfpId}`,
        {
          timeout: 15000,
        }
      );

      console.log("Données reçues du serveur:", response.data);

      if (response.data) {
        setChartData(response.data);
      } else {
        setChartError(t("No data received from server"));
      }
    } catch (error) {
      console.error(t("Error loading chart data"), error);

      let errorMessage = t("Error loading data");

      if (error.response) {
        errorMessage = `${t("Server error")} (${error.response.status}): ${
          error.response.data?.message || t("Unknown error")
        }`;
      } else if (error.request) {
        errorMessage = t("Connection error - Check your internet connection");
      } else if (error.code === "ECONNABORTED") {
        errorMessage = t("Timeout - Server is taking too long to respond");
      } else {
        errorMessage = `${t("Error")}: ${error.message}`;
      }

      setChartError(errorMessage);
    } finally {
      setChartLoading(false);
    }
  }, [id, user.id, t]);

  // Fonctions pour la modal
  const openChartModal = useCallback(async () => {
    setIsChartModalOpen(true);
    setChartError(null);
    await loadChartData();
  }, [loadChartData]);

  const closeChartModal = useCallback(() => {
    setIsChartModalOpen(false);

    // Nettoyage différé pour éviter les conflits
    setTimeout(() => {
      setChartData(null);
      setChartError(null);
      setChartLoading(false);
    }, 150);
  }, []);

  // Effects
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Gestion de la touche Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isChartModalOpen) {
        closeChartModal();
      }
    };

    if (isChartModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isChartModalOpen, closeChartModal]);

  const columns = [
    t("Rank"),
    t("Name"),
    t("First Name"),
    t("Company"),
    t("Date"),
    t("Points"),
    t("Level"),
    t("Action"),
  ];

  const dataNames = [
    "rang",
    "name",
    "firstname",
    "etp",
    "date",
    "points",
    "niveau",
    "actions",
  ];

  return (
    <>
      <div className=" mt-2 pt-2 p-2 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="overflow-hidden bg-white shadow-lg rounded-2xl">
            {/* En-tête */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-md  text-gray-800 md:text-xl">
                  Résultats globaux
                </h1>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={openChartModal}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full transition duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <BarChart className="w-5 h-5 mr-2" />
                    <span className="font-medium">Diagramme</span>
                  </button>

                  <Link
                    to="/formateur/testing"
                    className="inline-flex items-center px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition duration-200 shadow-sm"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    <span className="font-medium">Retour</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Interface de filtres */}
              <div className="p-4 mb-6 rounded-lg bg-gray-50">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  {t("Filters")} ({filteredApprenants.length}{" "}
                  {filteredApprenants.length !== 1 ? t("results") : t("result")}
                  )
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      {t("Name/First Name")}
                    </label>
                    <input
                      type="text"
                      value={filters.name}
                      onChange={(e) =>
                        handleFilterChange("name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t("Search by name...")}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      {t("Company")}
                    </label>
                    <input
                      type="text"
                      value={filters.etp}
                      onChange={(e) =>
                        handleFilterChange("etp", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t("Search by company...")}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      {t("QCM")}
                    </label>
                    <input
                      type="text"
                      value={filters.qcm}
                      onChange={(e) =>
                        handleFilterChange("qcm", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t("Search by QCM...")}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      {t("Date")}
                    </label>
                    <input
                      type="date"
                      value={filters.date}
                      onChange={(e) =>
                        handleFilterChange("date", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      {t("Minimum Points")}
                    </label>
                    <input
                      type="number"
                      value={filters.pointsMin}
                      onChange={(e) =>
                        handleFilterChange("pointsMin", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t("Min")}
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      {t("Maximum Points")}
                    </label>
                    <input
                      type="number"
                      value={filters.pointsMax}
                      onChange={(e) =>
                        handleFilterChange("pointsMax", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t("Max")}
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      {t("Level")}
                    </label>
                    <select
                      value={filters.level}
                      onChange={(e) =>
                        handleFilterChange("level", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">{t("All levels")}</option>
                      <option value="Débutant">{t("Beginner")}</option>
                      <option value="Intermédiaire">{t("Intermediate")}</option>
                      <option value="Avancé">{t("Advanced")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      {t("Campaign")}
                    </label>
                    <select
                      value={filters.campaign}
                      onChange={(e) =>
                        handleFilterChange("campaign", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">{t("All campaigns")}</option>
                      {/* Vous pouvez ajouter dynamiquement les options de campagne ici */}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 text-gray-700 transition duration-200 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    {t("Reset filters")}
                  </button>
                  <div className="text-sm text-gray-600">
                    {filteredApprenants.length} / {apprenants.length}{" "}
                    {t("results displayed")}
                  </div>
                </div>
              </div>

              {/* Contenu principal */}
              {isLoading ? (
                <Spinner />
              ) : datas.length > 0 ? (
                <TablePaginator
                  datas={datas}
                  columns={columns}
                  dataNames={dataNames}
                />
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-lg">{t("No results found")}</p>
                  {Object.values(filters).some((filter) => filter !== "") && (
                    <p className="mt-2">
                      {t("Try modifying your search criteria")}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal du graphique */}
      {isChartModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeChartModal();
            }
          }}
        >
          <div className="relative w-full max-w-6xl mx-4 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden">
            {/* En-tête de la modal */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">
                {t("Results Chart")}
              </h2>
              <button
                onClick={closeChartModal}
                className="p-1 text-gray-400 transition-colors rounded hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label={t("Close modal")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenu de la modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {chartLoading && (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
                    <p className="font-medium text-gray-600">
                      {t("Loading data...")}
                    </p>
                  </div>
                </div>
              )}

              {chartError && (
                <div className="p-4 text-red-700 bg-red-100 border border-red-300 rounded-md">
                  <h3 className="mb-2 font-semibold">{t("Error")}</h3>
                  <p>{chartError}</p>
                  <button
                    onClick={loadChartData}
                    className="px-4 py-2 mt-3 text-white transition-colors bg-red-600 rounded hover:bg-red-700"
                  >
                    {t("Retry")}
                  </button>
                </div>
              )}

              {chartData && !chartLoading && !chartError && (
                <div className="space-y-6">
                  {/* Graphique */}
                  <div className="p-6 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100">
                    <SpiderChart data={chartData} />
                  </div>

                  {/* Statistiques globales */}
                  <div className="pt-6 border-t">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">
                      {t("Global Statistics")}
                    </h3>

                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                      <div className="p-4 bg-white border rounded-lg shadow-sm">
                        <p className="mb-1 text-sm text-gray-600">
                          {t("Total users")}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {chartData.chartData?.overall_stats?.total_users || 0}
                        </p>
                      </div>

                      <div className="p-4 bg-white border rounded-lg shadow-sm">
                        <p className="mb-1 text-sm text-gray-600">
                          {t("Total sessions")}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {chartData.chartData?.overall_stats?.total_sessions ||
                            0}
                        </p>
                      </div>

                      <div className="p-4 bg-white border rounded-lg shadow-sm">
                        <p className="mb-1 text-sm text-gray-600">
                          {t("Average score")}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {chartData.chartData?.overall_stats
                            ?.average_total_score || 0}
                          %
                        </p>
                      </div>

                      <div className="p-4 bg-white border rounded-lg shadow-sm">
                        <p className="mb-1 text-sm text-gray-600">
                          {t("Maximum points")}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {chartData.pointsMaxQcm?.[0]?.points_maximum || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
