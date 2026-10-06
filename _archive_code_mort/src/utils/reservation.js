export function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
}

export const endpointModule = "https://formafusionmg.ams3.digitaloceanspaces.com/formafusionmg/img/modules";

export const endpointEntreprise =
    "https://formafusionmg.ams3.digitaloceanspaces.com/formafusionmg/img/entreprises";

export const dataMappings = {
    "01": "Janvier",
    "02": "Février",
    "03": "Mars",
    "04": "Avril",
    "05": "Mai",
    "06": "Juin",
    "07": "Juillet",
    "08": "Août",
    "09": "Septembre",
    10: "Octobre",
    11: "Novembre",
    12: "Décembre",
};

export const getMonthLabel = (mois) => {
    const [year, month] = mois.split("-");
    return `${dataMappings[month]} ${year}`;
};


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
            return state
    }
}

export const linkImageProfile = "https://formafusionmg.ams3.digitaloceanspaces.com/formafusionmg/img/referents"
export const linkImageLauncher = "https://formafusionmg.ams3.digitaloceanspaces.com/formafusionmg"


export function formatNumber(num) {
    const intPart = Math.floor(num);

    const formatted = intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    return formatted;

}


export const getColorAppLauncher = (name) => {
    switch (name) {
        case "PÉDAGOGIE":
            return 'bg-blue-500 text-white'
        case "ADMINISTRATION":
            return 'bg-green-500 text-white'
        case "LOGISTIQUE":
            return 'bg-[#ae89b9] text-white'
        case "ANALYTICS & ÉVALUATION":
            return 'bg-yellow-500 text-white'

        default:
            break;
    }
}


