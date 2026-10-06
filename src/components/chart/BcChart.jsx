import { useState, useCallback, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Package } from "lucide-react";
import DrawerBonCommande from "../drawer/dashboard/DrawerBonCommande";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

const MONTHS = [
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

const MONTHS_SHORT = [
  "Jan",
  "Fev",
  "Mars",
  "Avr",
  "Mai",
  "Jui",
  "Juil",
  "Aout",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const CHART_COLORS = {
  forecast: "#3b82f6",
  revenue: "#e5e4e4ff",
};

const DATASET_CONFIG = [
  {
    type: "line",
    label: "Total bon de commande",
    dataKey: "bon_commandes",
    color: CHART_COLORS.forecast,
    clickable: true,
    yAxisID: "y",
  },
  {
    type: "bar",
    label: "Nombre bon de commande",
    dataKey: "nombre_commandes_month",
    color: CHART_COLORS.revenue,
    clickable: false,
    yAxisID: "y1",
  },
];

const BcChart = ({ year = 2024, lineData, fetchBonCommande, isLoading }) => {
  const formatNumber = (value) => {
    if (!value) return "0";
    return new Intl.NumberFormat("fr-FR").format(value);
  };

  const [drawerState, setDrawerState] = useState({
    isOpen: false,
    clickedData: null,
  });

  const datasets = useMemo(() => {
    if (!lineData) return [];

    return DATASET_CONFIG.map((config) => {
      let data = lineData[config.dataKey];

      if (data && typeof data === "object" && !Array.isArray(data)) {
        data = Object.values(data);
      }

      const baseConfig = {
        type: config.type,
        label: config.label,
        data: data || [],
        yAxisID: config.yAxisID,
        datalabels: {
          color: "#1f2937",
          anchor: "center",
          align: "bottom",
          offset: 4,
          font: {
            size: 12,
            weight: "400",
          },
          formatter: (value) => (value ? formatNumber(value) : ""),
        },
      };

      if (config.type === "line") {
        return {
          ...baseConfig,
          fill: false,
          borderColor: config.color,
          backgroundColor: config.color,
          borderWidth: 2.5,
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: config.color,
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 3,
        };
      } else {
        return {
          ...baseConfig,
          backgroundColor: config.color,
          borderColor: config.color,
          borderWidth: 0,
          borderRadius: 6,
          barThickness: 30,
          maxBarThickness: 40,
        };
      }
    });
  }, [lineData]);

  const chartData = useMemo(() => {
    if (!lineData) return { labels: [], datasets: [] };

    return {
      labels: MONTHS_SHORT,
      datasets: datasets,
    };
  }, [datasets, lineData]);

  const handleClick = useCallback(
    async (event, elements) => {
      if (elements.length === 0) return;

      const element = elements[0];
      const monthIndex = element.index + 1;
      const datasetIndex = element.datasetIndex;
      const config = DATASET_CONFIG[datasetIndex];

      if (!config.clickable) return;

      setDrawerState({
        isOpen: true,
        clickedData: null,
      });

      try {
        const details_bc = await fetchBonCommande(monthIndex, year);

        setDrawerState({
          isOpen: true,
          clickedData: {
            month: MONTHS[monthIndex - 1],
            bc: details_bc,
            year: year,
          },
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    },
    [fetchBonCommande, year]
  );

  const handleDrawerClose = useCallback(() => {
    setDrawerState({
      isOpen: false,
      clickedData: null,
    });
  }, []);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: {
        y: {
          type: "linear",
          display: true,
          position: "left",
          title: {
            display: true,
            text: "Montant (Ar)",
            font: {
              size: 12,
              weight: "600",
            },
            color: "#64748b",
          },
          ticks: {
            callback: (value) => formatNumber(value),
            font: {
              size: 11,
            },
            color: "#64748b",
            padding: 8,
          },
          beginAtZero: true,
          grid: {
            color: "rgba(148, 163, 184, 0.1)",
            drawBorder: false,
          },
          border: {
            display: false,
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          title: {
            display: true,
            text: "Nombre",
            font: {
              size: 12,
              weight: "600",
            },
            color: "#64748b",
          },
          ticks: {
            callback: (value) => Math.round(value),
            font: {
              size: 12,
            },
            color: "#64748b",
            padding: 8,
            stepSize: 1,
          },
          beginAtZero: true,
          grid: {
            display: false,
            drawBorder: false,
          },
          border: {
            display: false,
          },
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            font: {
              size: 11,
              weight: "500",
            },
            color: "#64748b",
            padding: 8,
          },
          border: {
            display: false,
          },
        },
      },
      plugins: {
        datalabels: {
          display: true,
        },
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            padding: 16,
            font: {
              size: 12,
              weight: "500",
            },
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          backgroundColor: "rgba(17, 24, 39, 0.96)",
          padding: 12,
          cornerRadius: 8,
          titleFont: {
            size: 13,
            weight: "600",
          },
          bodyFont: {
            size: 12,
          },
          borderColor: "rgba(148, 163, 184, 0.2)",
          borderWidth: 1,
          displayColors: true,
          boxWidth: 10,
          boxHeight: 10,
          boxPadding: 6,
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || "";
              const value = context.parsed.y;
              return `${label}: ${formatNumber(value)}`;
            },
          },
        },
      },
      onClick: handleClick,
      onHover: (event, elements) => {
        const target = event.native?.target;
        if (target) {
          const isClickable =
            elements.length > 0 &&
            DATASET_CONFIG[elements[0].datasetIndex]?.clickable;
          target.style.cursor = isClickable ? "pointer" : "default";
        }
      },
    }),
    [handleClick, formatNumber]
  );

  return (
    <>
      <div className="grid col-span-1 p-6 mb-10 bg-white lg:col-span-2 rounded-2xl shadow-sm border border-gray-100/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-purple-500 to-purple-600 shadow-lg shadow-purple-500/20 transition-transform hover:scale-105 duration-200">
              <Package className="text-white w-5 h-5" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Bon de commande
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Statistique {year}</p>
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-hidden h-[200px] sm:h-[300px] lg:h-[400px]">
          <div className="w-full h-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <DrawerBonCommande
          isOpen={drawerState.isOpen}
          data={drawerState.clickedData}
          onClose={handleDrawerClose}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default BcChart;
