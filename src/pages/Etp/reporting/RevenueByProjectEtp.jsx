import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../../../config/axios"; // Assurez-vous que le chemin est correct
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import {
  Users,
  UserCheck,
  Euro,
  Scale,
  AlertCircle,
  BarChart2,
  LineChart,
} from "lucide-react";

// Register necessary Chart.js components
ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

// Simple utility to format amounts
const formatMontant = (value, currency) => {
  if (value === null || typeof value === "undefined" || value === "null") {
    return `0 ${currency}`;
  }
  return `${Number(value).toLocaleString()} ${currency}`;
};

// Optimized Metric Card component
const MetricCard = ({
  title,
  value,
  unit = "",
  icon: IconComponent,
  color = "indigo",
}) => {
  const colorClasses = {
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      iconBg: "bg-indigo-100",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    pink: {
      bg: "bg-pink-50",
      text: "text-pink-600",
      iconBg: "bg-pink-100",
    },
  };

  const { bg, text, iconBg } = colorClasses[color];

  return (
    <motion.div
      whileHover={{
        y: -2,
        transition: { type: "spring", stiffness: 400, damping: 10 },
      }}
      className={`${bg} rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 mb-0.5">{title}</p>
          <motion.p
            className={`text-lg font-bold ${text} overflow-hidden whitespace-nowrap overflow-ellipsis`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {value}{" "}
            {unit && (
              <span className="text-xs font-normal text-gray-400">{unit}</span>
            )}
          </motion.p>
        </div>
        {IconComponent && (
          <motion.div
            className={`${iconBg} p-1.5 rounded-md self-center`}
            whileHover={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.6 }}
          >
            <IconComponent className="w-4 h-4 text-current" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const ReportingRevenue = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState("current");
  const [chartType, setChartType] = useState("bar");
  const [currency, setCurrency] = useState("XOF");
  const chartRef = useRef(null);

  // Function to fetch data from the API
  const fetchDataFromApi = async () => {
    try {
      setLoading(true);
      setError(null);

      // Appel API réel avec axios
      const response = await axios.get("/etp/reporting/chiffre");

      if (response.status !== 200) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      setData(response.data);

      // Récupérer la devise depuis localStorage si disponible
      try {
        const storedSetting = localStorage.getItem("setting");
        if (storedSetting) {
          const settingData = JSON.parse(storedSetting);
          if (settingData.currency_code) {
            setCurrency(settingData.currency_code);
          }
        }
      } catch (e) {
        console.warn("Impossible de récupérer les paramètres:", e);
      }
    } catch (e) {
      console.error("Erreur API:", e);
      setError(
        e.response?.data?.message ||
        e.message ||
        "Erreur lors du chargement des données. Veuillez vérifier la connexion API."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataFromApi();
  }, []);

  const getCurrentYear = useCallback(() => new Date().getFullYear(), []);
  const getPreviousYear = useCallback(
    () => getCurrentYear() - 1,
    [getCurrentYear]
  );

  const displayData =
    selectedYear === "current"
      ? {
        total_trained: data?.total_trained,
        unique_trained: data?.unique_trained,
        total_YTD: data?.total_YTD,
        cost_by_employee: data?.cost_by_employee,
        monthly_finished: data?.finished_data,
        monthly_forecast: data?.forecast_data,
        monthly_students: data?.histogram_data,
        year_title: `${getCurrentYear()}`,
      }
      : {
        total_trained: data?.last_total_trained,
        unique_trained: data?.last_unique_trained,
        total_YTD: data?.last_year_YTD,
        cost_by_employee: data?.last_cost_by_employee,
        monthly_finished: data?.last_year_prices,
        monthly_forecast: Array(12).fill(null),
        monthly_students: Array(12).fill(null),
        year_title: `${getPreviousYear()}`,
      };

  const chartData = {
    labels: data?.months || [],
    datasets: [
      {
        label: "Données finales",
        data: displayData.monthly_finished || [],
        backgroundColor: "rgba(79, 70, 229, 0.7)",
        borderColor: "rgba(79, 70, 229, 1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        yAxisID: "y",
      },
      {
        label: "Prévisions",
        data: displayData.monthly_forecast || [],
        backgroundColor: "rgba(236, 72, 153, 0.5)",
        borderColor: "rgba(236, 72, 153, 1)",
        borderDash: [5, 5],
        borderWidth: 2,
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Apprenants",
        data: displayData.monthly_students || [],
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        type: "line",
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.datasetIndex < 2) {
              label += formatMontant(context.raw, currency);
            } else {
              label += context.raw + " apprenants";
            }
            return label;
          },
        },
      },
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 10,
          font: { size: 10 },
          usePointStyle: true,
        },
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: `Montant (${currency})`,
          font: { size: 10 },
        },
        grid: { drawOnChartArea: true },
        ticks: { font: { size: 10 } },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: { display: true, text: "Apprenants", font: { size: 10 } },
        grid: { drawOnChartArea: false },
        ticks: { font: { size: 10 } },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-10 h-10 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="max-w-md p-6 text-center bg-white rounded-lg shadow-md">
          <AlertCircle className="w-10 h-10 mx-auto mb-2 text-red-500" />
          <h3 className="mb-2 text-lg font-semibold text-red-700">Erreur</h3>
          <p className="mb-4 text-red-600">
            {error || "Aucune donnée disponible"}
          </p>
          <button
            onClick={fetchDataFromApi}
            className="px-4 py-2 font-medium text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen p-4 bg-gray-100"
    >
      <motion.div
        layout
        className="max-w-full mx-auto overflow-hidden bg-white rounded-lg shadow-lg"
      >
        <div className="bg-[#A462A4] px-4 py-3 text-white flex justify-between items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[150px]">
            <h1 className="text-xl font-bold">Tableau de Bord</h1>
            <p className="text-xs opacity-90">Analyse des performances</p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              onClick={() => setSelectedYear("current")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedYear === "current"
                  ? "bg-white text-indigo-600 shadow"
                  : "bg-white/20 hover:bg-white/30"
                }`}
            >
              {getCurrentYear()}
            </button>
            <button
              onClick={() => setSelectedYear("previous")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedYear === "previous"
                  ? "bg-white text-indigo-600 shadow"
                  : "bg-white/20 hover:bg-white/30"
                }`}
            >
              {getPreviousYear()}
            </button>
          </div>
        </div>
        <div className="p-4">
          <h2 className="mt-2 mb-4 text-lg font-semibold text-gray-800">
            Indicateurs Clés -{" "}
            <span className="text-indigo-600">{displayData.year_title}</span>
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-4 lg:grid-cols-4">
            {[
              {
                title: "Total formés",
                value: displayData.total_trained,
                unit: "appr.",
                icon: Users,
                color: "purple",
              },
              {
                title: "Formés uniques",
                value: displayData.unique_trained,
                unit: "appr.",
                icon: UserCheck,
                color: "indigo",
              },
              {
                title: "Coût total",
                value: formatMontant(displayData.total_YTD, currency),
                icon: Euro,
                color: "blue",
              },
              {
                title: "Coût/employé",
                value: formatMontant(displayData.cost_by_employee, currency),
                icon: Scale,
                color: "pink",
              },
            ].map((metric, i) => (
              <MetricCard key={i} {...metric} />
            ))}
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-800">
            Visualisation des Performances
          </h2>
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-2">
              <button
                onClick={() => setChartType("bar")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ${chartType === "bar"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <BarChart2 className="w-4 h-4" /> Barres
              </button>
              <button
                onClick={() => setChartType("line")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ${chartType === "line"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <LineChart className="w-4 h-4" /> Lignes
              </button>
            </div>
          </div>
          <div className="p-3 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm h-72">
            <AnimatePresence mode="wait">
              {chartType === "bar" ? (
                <motion.div
                  key="bar-chart"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <Bar
                    ref={chartRef}
                    data={chartData}
                    options={chartOptions}
                    redraw={true}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="line-chart"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <Line
                    ref={chartRef}
                    data={chartData}
                    options={chartOptions}
                    redraw={true}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-800">
            Détails Mensuels -{" "}
            <span className="text-indigo-600">{displayData.year_title}</span>
          </h2>
          <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    {["Mois", "Finales", "Prévisions", "Apprenants"].map(
                      (header, i) => (
                        <th
                          key={header}
                          className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${i === 0 ? "text-left" : "text-right"
                            } text-gray-500`}
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="text-sm bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {data.months.map((month, index) => (
                      <motion.tr
                        key={`${month}-${selectedYear}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-3 py-2 text-sm font-medium text-left text-gray-900 whitespace-nowrap">
                          {month}
                        </td>
                        <td className="px-3 py-2 text-sm text-right text-gray-700 whitespace-nowrap">
                          {formatMontant(
                            displayData.monthly_finished?.[index],
                            currency || 0
                          )}
                        </td>
                        <td className="px-3 py-2 text-sm text-right text-gray-700 whitespace-nowrap">
                          {formatMontant(
                            displayData.monthly_forecast?.[index],
                            currency || "XOF"
                          )}
                        </td>
                        <td className="px-3 py-2 text-sm text-right text-gray-700 whitespace-nowrap">
                          {displayData.monthly_students[index] || 0}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
          {data.notifications?.length > 0 && (
            <div className="mt-4">
              <h2 className="mb-2 text-base font-semibold text-gray-800">
                Notifications
              </h2>
              <div className="space-y-2">
                {data.notifications.map((notification, index) => (
                  <div
                    key={index}
                    className="flex items-start p-3 border-l-4 border-yellow-400 rounded-lg bg-yellow-50"
                  >
                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      {notification.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReportingRevenue;