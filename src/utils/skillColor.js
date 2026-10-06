export const getColorAppLauncher = (name) => {
  switch (name) {
    case "PÉDAGOGIE":
      return "bg-blue-500 text-white";
    case "ADMINISTRATION":
      return "bg-green-500 text-white";
    case "LOGISTIQUE":
      return "bg-[#ae89b9] text-white";
    case "ANALYTICS & ÉVALUATION":
      return "bg-yellow-500 text-white";

    default:
      break;
  }
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("fr-FR");
};

export const getStatusColor = (status) => {
  switch (status) {
    case "Terminé":
      return "bg-green-100 text-green-800";
    case "En cours":
      return "bg-blue-100 text-blue-800";
    case "À venir":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const skillLevels = [
  {
    label: "Débutant",
    range: {
      1: "bg-yellow-300",
      2: "bg-yellow-400 ",
      3: "bg-yellow-500",
    },
  },
  {
    label: "Intermédiaire",
    range: {
      4: "bg-green-300",
      5: "bg-green-500 text-white",
      6: "bg-green-600 text-white",
    },
  },
  {
    label: "Expert",
    range: {
      7: "bg-blue-400 text-white",
      8: "bg-blue-600 text-white",
      9: "bg-blue-700 text-white",
      10: "bg-blue-900 text-white",
    },
  },
];

export const getSkillColor = (level) => {
  switch (level) {
    case 1:
      return "bg-yellow-300 text-white ";
    case 2:
      return "bg-yellow-400 text-white";
    case 3:
      return "bg-yellow-500 text-white";
    case 4:
      return "bg-green-300 text-white ";
    case 5:
      return "bg-green-500 text-white";
    case 6:
      return "bg-green-600 text-white";
    case 7:
      return "bg-blue-400 text-white";
    case 8:
      return "bg-blue-600 text-white";
    case 9:
      return "bg-blue-700 text-white";
    case 10:
      return "bg-blue-900 text-white";
    default:
      break;
  }
  return "bg-gray-200 text-black";
};
