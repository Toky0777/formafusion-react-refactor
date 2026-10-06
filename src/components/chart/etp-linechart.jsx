import { useEffect, useState } from "react";
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
import axios from "../../config/axios";
import { formatMonetaire } from "../../utils/global";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

const EtpLineChart = () => {
  const [data, setData] = useState({});

  const fetchDashboardEntreprise = async () => {
    try {
      const res = await axios.get("/entreprises/analytic/home-etp");
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDashboardEntreprise();
  }, []);

  const MONTHS = data?.months;

  const finished_data = data?.finished_data;
  const forecast_data = data?.forecast_data;
  const last_year_data = data?.last_year_prices;

  const datasets = [
    {
      label: "Dépenses finies",
      data: finished_data,
      fill: false,
      borderColor: "#32CD32",
      datalabels: {
        display: false,
      },
    },
    {
      label: "Dépenses prévisionnelles",
      data: forecast_data,
      fill: false,
      borderColor: "#1E90FF",
      datalabels: {
        display: false,
      },
    },
    {
      label: "Dépenses dernière année",
      data: last_year_data,
      fill: false,
      borderColor: "#94a3b8",
      datalabels: {
        color: "#a462a4",
        anchor: "end",
        align: "end",
      },
    },
  ];

  const ourdata = {
    labels: MONTHS,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return formatMonetaire(value);
          },
        },
        beginAtZero: true,
      },
    },
    plugins: {
      datalabels: {
        display: true,
        formatter: function (value) {
          return value;
        },
      },
      legend: {
        position: "bottom",
      },
    },

    onHover: (event, elements) => {
      event.native.target.style.cursor = elements[0] ? "pointer" : "default";
    },
  };

  return (
    <>
      <div
        className="grid col-span-1 lg:col-span-2 grid-cols-subgrid p-5 bg-white rounded-xl"
        style={{ height: "500px", width: "900px" }}
      >
        <p className="text-sm mb-3"> Chiffre d'affraire </p>
        <Line data={ourdata} options={options} />
      </div>
    </>
  );
};

export default EtpLineChart;
