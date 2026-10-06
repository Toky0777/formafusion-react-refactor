import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import T from "../translate/AutoTranslator";
import { Info, WalletCards } from "lucide-react";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const DoughnutChart = ({ dataDoughnut, year }) => {
  const pieLabel = Object.keys(dataDoughnut?.pie_data);
  const piePercentage = Object.values(dataDoughnut?.pie_data);

  const chartColors = ["#007bce", "#f4cd1e", "#0b0f1a"];

  const data = {
    labels: pieLabel,
    datasets: [
      {
        data: piePercentage,
        backgroundColor: chartColors,
        borderWidth: 1,
        hoverOffset: 3,
        datalabels: {
          color: "#fff",
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Chiffres d'affaires: ${context.parsed.toFixed(2)} %`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full bg-white p-5 rounded-xl shadow-sm">
      <div className="relative h-64 mb-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-blue-500 to-blue-600 shadow-lg shadow-blue-500/20 transition-transform hover:scale-105 duration-200">
            <WalletCards className="text-white w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Modalité de payment
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Statistiques {year}</p>
          </div>
        </div>
        {pieLabel.length !== 0 ? (
          <Doughnut data={data} options={options} />
        ) : (
          <div className="flex flex-col justify-center items-center h-full text-gray-400">
            <Info className="w-8 h-8 mb-2" strokeWidth={1.8} />
            <p className="text-sm font-medium">Aucune donnée</p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {data.labels.map((label, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: chartColors[index] }}
              ></span>
              <span className="text-sm font-medium text-gray-700">
                {" "}
                <T>{label}</T>{" "}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {data.datasets[0].data[index]}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoughnutChart;
