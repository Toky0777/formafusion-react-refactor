import { useMemo, useCallback } from "react";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Info, Star } from "lucide-react";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const MONTHS = [
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

const CHART_CONFIG = {
  backgroundColor: "rgba(153, 102, 255, 0.2)",
  borderColor: "rgb(153, 102, 255)",
  hoverBackgroundColor: "rgba(153, 102, 255, 0.4)",
  hoverBorderColor: "rgb(153, 102, 255)",
  borderWidth: 2,
  maxRating: 5,
};

const EvaluationChart = ({ dataEval, year }) => {
  const chartData = useMemo(() => {
    if (!dataEval?.evaluations_by_months) {
      return {
        labels: [],
        datasets: [],
      };
    }

    return {
      labels: MONTHS,
      datasets: [
        {
          label: "Appréciation moyenne",
          data: dataEval.evaluations_by_months,
          backgroundColor: CHART_CONFIG.backgroundColor,
          borderColor: CHART_CONFIG.borderColor,
          hoverBackgroundColor: CHART_CONFIG.hoverBackgroundColor,
          hoverBorderColor: CHART_CONFIG.hoverBorderColor,
          borderWidth: CHART_CONFIG.borderWidth,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };
  }, [dataEval]);

  const tooltipLabelCallback = useCallback(
    (context) => {
      const evaluationHover = dataEval?.evaluations_labels;
      if (!evaluationHover || !evaluationHover[context.parsed.x]) {
        return `Appréciation: ${context.parsed.y.toFixed(1)} / ${
          CHART_CONFIG.maxRating
        }`;
      }

      const { countProjects, countEvaluations } =
        evaluationHover[context.parsed.x];
      const rating = context.parsed.y.toFixed(1);

      return `Appréciation: ${rating} / ${
        CHART_CONFIG.maxRating
      } (${countProjects} projet${countProjects > 1 ? "s" : ""} évalué${
        countProjects > 1 ? "s" : ""
      } par ${countEvaluations} étudiant${countEvaluations > 1 ? "s" : ""})`;
    },
    [dataEval?.evaluations_labels]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: CHART_CONFIG.maxRating,
          ticks: {
            stepSize: 0.5,
            font: {
              size: 11,
            },
            callback: (value) => value.toFixed(1),
          },
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
          title: {
            display: true,
            text: "Note moyenne / 5",
            font: {
              size: 12,
              weight: "bold",
            },
            padding: { bottom: 10 },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 11,
            },
          },
        },
      },
      plugins: {
        datalabels: {
          display: false,
        },
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: 12,
          titleFont: {
            size: 13,
            weight: "bold",
          },
          bodyFont: {
            size: 12,
          },
          cornerRadius: 6,
          displayColors: true,
          callbacks: {
            label: tooltipLabelCallback,
          },
        },
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
      animation: {
        duration: 750,
        easing: "easeInOutQuart",
      },
    }),
    [tooltipLabelCallback]
  );

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm  border border-gray-100/50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-500 via-yellow-500 to-yellow-600 shadow-lg shadow-blue-500/20 transition-transform hover:scale-105 duration-200">
            <Star className="text-white w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Moyenne d'appréciation des formations
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Statistiques {year}</p>
          </div>
        </div>
        {dataEval?.evaluations_by_months?.length !== 0 ? (
          <div className="relative h-80">
            <Bar data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-full text-gray-400">
            <Info className="w-8 h-8 mb-2" strokeWidth={1.8} />
            <p className="text-sm font-medium">Aucune donnée</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationChart;
