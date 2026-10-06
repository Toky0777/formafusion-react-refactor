export const reducerNavbar = (state, action) => {
  switch (action.type) {
    case "SHOW_APPLAUNCHER":
      return {
        ...state,
        appLauncher: true,
      };
    case "HIDE_APPLAUNCHER":
      return {
        ...state,
        appLauncher: false,
      };
    case "SHOW_MENU":
      return {
        ...state,
        menu: true,
      };
    case "SHOW_DRAWER":
      return {
        ...state,
        new: true,
      };
    case "HIDE_DRAWER":
      return {
        ...state,
        new: false,
      };
    case "HIDE_MENU":
      return {
        ...state,
        menu: false,
      };
    case "TOGGLE_MOBILE_MENU":
      return { ...state, mobileMenu: !state.mobileMenu };
    case "HIDE_MOBILE_MENU":
      return { ...state, mobileMenu: false };
    default:
      return state;
  }
};

export const getColorStatus = (status) => {
  switch (status) {
    case "Terminé":
      return "bg-green-500 text-white";
    case "Supprimé":
      return "bg-rose-500 text-white";

    default:
      break;
  }
};

export function displayProjectsByStatus(customer) {
  let result = [];

  for (const [key, value] of Object.entries(customer)) {
    if (key in projectCategoriesConfig && Array.isArray(value)) {
      result.push({
        category: projectCategoriesConfig[key],
        count: value.length,
        projects: value,
      });
    }
  }

  return result;
}

export const projectCategoriesConfig = {
  projects_fenced: {
    label: "Clôturés",
    color: "#9E9E9E", // Gris
    bgColor: "#F5F5F5", // Gris clair
  },
  projects_finished: {
    label: "Terminés",
    color: "#4CAF50", // Vert
    bgColor: "#E8F5E9", // Vert très clair
  },
  projects_future: {
    label: "Futurs",
    color: "#2196F3", // Bleu
    bgColor: "#E3F2FD", // Bleu très clair
  },
  projects_in_preparation: {
    label: "En préparation",
    color: "#FF9800", // Orange
    bgColor: "#FFF3E0", // Orange très clair
  },
  projects_in_progress: {
    label: "En cours",
    color: "#FF5722", // Orange foncé
    bgColor: "#FBE9E7", // Rouge très clair
  },
};

export function formatDateFr(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function numberToHour(timestamp) {
  // On s'assure que c'est un entier
  timestamp = parseInt(timestamp, 10);

  const heures = Math.floor(timestamp / 3600);
  const minutes = Math.floor((timestamp % 3600) / 60);
  const secondes = timestamp % 60;

  // Format avec 2 chiffres
  const hh = String(heures).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(secondes).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
}
