import { IMAGE_URL } from "../config/env";

export const endpoint = IMAGE_URL;

export const getStatusLabel = (status) => {
  switch (status) {
    case "in_progress":
      return "En cours";
    case "future":
      return "Planifié";
    case "finished":
      return "Terminé";
    case "fenced":
      return "Clôturé";
    default:
      return status;
  }
};

export const getStatusColorClass = (status) => {
  switch (status) {
    case "finished":
    case "Terminé":
      return "bg-[#95CF92]";
    case "fenced":
    case "Clôturé":
      return "bg-[#6F1926]";
    case "in_progress":
    case "En cours":
      return "bg-[#6F1926]";
    case "future":
    case "Planifié":
      return "bg-[#CBABD1]";
    default:
      return "bg-gray-800";
  }
};

export const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export const linkImageProfile =
  `${IMAGE_URL}/img/referents`;
export const linkImageLauncher = IMAGE_URL;
export const linkImageFormateurs =
  `${IMAGE_URL}/img/formateurs`;

export const formatDate = (date) => {
  return date.replace(/\./g, "/");
};

export function formatMonetaire(valeur) {
  let entier = Math.floor(valeur);

  return entier.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// FMFP
export const getStatusFmfpColor = (status) => {
  switch (status.toLowerCase()) {
    case "en soumission":
      return "bg-gray-200 text-gray-800";
    case "analyse":
      return "bg-blue-100 text-blue-700";
    case "refusé":
      return "bg-red-100 text-red-700";
    case "validé":
      return "bg-green-100 text-green-700";
    case "exécuté":
      return "bg-yellow-100 text-yellow-700";
    case "cloturé":
      return "bg-red-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export const dateFormat = (date) => {
  if (!date) return "";

  const [year, month, day] = date.split("-");

  const monthIndex = parseInt(month, 10) - 1;

  if (monthIndex < 0 || monthIndex > 11) return date;

  return `${parseInt(day, 10)} ${MONTHS[monthIndex]} ${year}`;
};

// end fmfp

// presence
export const formatMonthYear = (dateStr) => {
  const [year, month] = dateStr.split("-");
  const monthIndex = parseInt(month, 10) - 1;
  const monthName = MONTHS[monthIndex] || "";

  return `${monthName} ${year}`;
};
