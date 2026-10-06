import { useState } from "react";
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
import DrawerLearner from "../drawer/dashboard/DrawerLearner";
import { Info, Star } from "lucide-react";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const BarChart = ({ dataBarChart, fetchLeanerByMonth, year }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lernearDrawer, setLearnerDrawer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const formattedData =
    typeof dataBarChart?.learners === "object" &&
    !Array.isArray(dataBarChart.learners)
      ? Object.values(dataBarChart.learners)
      : dataBarChart?.learners || [];

  const datasets = [
    {
      label: "Personnes formées",
      data: formattedData,
      backgroundColor: "rgba(59, 130, 246, 0.08)",
      borderColor: "rgb(59, 130, 246)",
      borderWidth: 2,
      borderRadius: 6,
      hoverBackgroundColor: "rgba(59, 130, 246, 0.15)",
      hoverBorderColor: "rgb(37, 99, 235)",
      hoverBorderWidth: 2.5,
    },
  ];

  const data = {
    labels: MONTHS,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.96)",
        titleColor: "#fff",
        bodyColor: "#e5e7eb",
        borderColor: "rgba(59, 130, 246, 0.4)",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
        titleFont: {
          size: 13,
          weight: "600",
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(148, 163, 184, 0.08)",
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8",
          font: {
            size: 11,
          },
          padding: 6,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#64748b",
          font: {
            size: 11,
            weight: "500",
          },
          padding: 6,
        },
      },
    },
    onClick: async (event, elements) => {
      if (elements.length > 0) {
        const element = elements[0];
        const moisIndex = MONTHS[element.index];

        setIsDrawerOpen(true);
        setIsLoading(true);

        const learnerData = await fetchLeanerByMonth(moisIndex, year);
        if (learnerData) {
          setIsLoading(false);
          setLearnerDrawer(learnerData);
        } else {
          console.log("Erreur lors de la récupération des données");
        }
      }
    },
    onHover: (event, elements) => {
      event.native.target.style.cursor = elements[0] ? "pointer" : "default";
    },
  };

  return (
    <>
      <div className="w-full bg-white rounded-2xl shadow-sm  border border-gray-100/50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-500 via-yellow-500 to-yellow-600 shadow-lg shadow-blue-500/20 transition-transform hover:scale-105 duration-200">
              <Star className="text-white w-5 h-5" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                Personnes formées
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Statistiques {year}
              </p>
            </div>
          </div>
          {dataBarChart?.learners?.length !== 0 ? (
            <div className="relative h-80">
              <Bar data={data} options={options} />
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-gray-400">
              <Info className="w-8 h-8 mb-2" strokeWidth={1.8} />
              <p className="text-sm font-medium">Aucune donnée</p>
            </div>
          )}
        </div>
      </div>

      <DrawerLearner
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        learners={lernearDrawer}
        isLoading={isLoading}
      />
    </>
  );
};

export default BarChart;
