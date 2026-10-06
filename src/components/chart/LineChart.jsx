import { useState, useCallback, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import DrawerProjects from "../drawer/dashboard/DrawerProjects";
import { useDashboardCfp } from "../../contexts/cfp/DashboardCfpProvider";
import { HandCoins } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  revenue: "#10b981",
  goal: "#8b5cf6",
};

const DATASET_CONFIG = [
  {
    label: "Chiffre d'affaire prévisionnel",
    dataKey: "forecast_data",
    color: CHART_COLORS.forecast,
    clickable: true,
    align: "end",
  },
  {
    label: "Chiffre d'affaire",
    dataKey: "finished_data",
    color: CHART_COLORS.revenue,
    clickable: true,
    align: "end",
  },
  {
    label: "Objectifs à atteindre cette année",
    dataKey: "current_goal",
    color: CHART_COLORS.goal,
    clickable: false,
    align: "start",
  },
];

const LineChart = ({ year, lineData, fetchProjectByMonth, isLoading }) => {
  const [drawerState, setDrawerState] = useState({
    isOpen: false,
    clickedData: null,
  });

  const { formatNumber } = useDashboardCfp();

  const datasets = useMemo(() => {
    if (!lineData) return [];

    return DATASET_CONFIG.map((config) => {
      let data = lineData[config.dataKey];

      if (data && typeof data === "object" && !Array.isArray(data)) {
        data = Object.values(data);
      }

      return {
        label: config.label,
        data: data || [],
        fill: false,
        borderColor: config.color,
        borderWidth: 2.5,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: config.color,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
        datalabels: {
          color: CHART_COLORS.label,
          anchor: "end",
          align: config.align,
          font: {
            size: 10,
            weight: "600",
          },
          borderRadius: 4,
          padding: 4,
        },
      };
    });
  }, [lineData]);

  const chartData = useMemo(() => {
    if (!lineData) return { labels: [], datasets: [] };
    const currentMonthIndex = new Date().getMonth();
    const filteredLabels = MONTHS_SHORT;
    const filteredDatasets = datasets.map((dataset) => {
      if (dataset.label === "Chiffre d'affaire prévisionnel") {
        return {
          ...dataset,
          data: [
            ...Array(currentMonthIndex).fill(null),
            ...dataset.data.slice(currentMonthIndex),
          ],
        };
      }
      return dataset;
    });
    return {
      labels: filteredLabels,
      datasets: filteredDatasets,
    };
  }, [datasets, lineData]);

  const handleChartClick = useCallback(
    async (event, elements) => {
      if (elements.length === 0) return;

      const element = elements[0];
      const monthIndex = element.index + 1;
      const datasetIndex = element.datasetIndex;
      const config = DATASET_CONFIG[datasetIndex];

      if (!config.clickable) return;
      setDrawerState({
        isOpen: true,
        clickedData: {
          month: MONTHS[monthIndex - 1],
          monthIndex: monthIndex,
          dataset: config.label,
        },
      });

      try {
        console.log(datasetIndex);

        const projects = await fetchProjectByMonth(
          monthIndex,
          year,
          datasetIndex
        );
        const value = lineData[config.dataKey]?.[monthIndex - 1] || 0;
        setDrawerState({
          isOpen: true,
          clickedData: {
            projects: projects,
            month: MONTHS[monthIndex - 1],
            monthIndex: monthIndex,
            value,
            dataset: config.label,
          },
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setDrawerState((prev) => ({
          ...prev,
        }));
      }
    },
    [lineData]
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
        mode: "point",
        intersect: true,
      },
      scales: {
        y: {
          ticks: {
            callback: (value) => formatNumber(value),
            font: {
              size: 12,
            },
            color: "#64748b",
            padding: 15,
          },
          beginAtZero: true,
          grid: {
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
              size: 12,
              weight: "500",
            },
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
          formatter: (value) => (value ? formatNumber(value) : ""),
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
              const value = formatNumber(context.parsed.y);
              return `${label}: ${value}`;
            },
          },
        },
      },
      onClick: handleChartClick,
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
    [formatNumber, handleChartClick]
  );

  if (!lineData) {
    return (
      <div
        className="grid col-span-1 p-6 bg-white lg:col-span-2 rounded-2xl shadow-sm border border-gray-100/50"
        style={{ height: "500px" }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-gray-500 font-medium">
              Chargement des données...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid col-span-1 p-6 mb-10 bg-white lg:col-span-2 rounded-2xl shadow-sm border border-gray-100/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20 transition-transform hover:scale-105 duration-200">
              <HandCoins className="text-white w-5 h-5" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Chiffre d'affaires et objectifs
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Statistique {year}</p>
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-hidden h-[300px] sm:h-[400px] lg:h-[500px]">
          <div className="w-full h-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <DrawerProjects
        isOpen={drawerState.isOpen}
        onClose={handleDrawerClose}
        fetchProjects={fetchProjectByMonth}
        isLoading={isLoading}
        clickedData={drawerState.clickedData}
        currentYear={year}
      />
    </>
  );
};

export default LineChart;
