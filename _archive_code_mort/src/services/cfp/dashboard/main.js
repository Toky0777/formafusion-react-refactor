import axios from "../../../config/axios";

export async function drawerCa(month, type) {
  try {
    const response = await axios.get(`ca/${month}/${type}`);
    // Retourner les données de la réponse
    return response.data;
  } catch (error) {
    // Retourner null ou un objet vide en cas d'erreur
    return null;
  }
}

export async function drawerLearner(month, type) {
  try {
    const response = await axios.get(`/learner/${month}/${type}`);

    return response.data;
  } catch (error) {
    return null;
  }
}

export const fetchDashboardEntreprise = async () => {
  try {
    const result = await axios.get("home-etp");
    return result.data;
  } catch (error) {
    console.log(error);
  }
};
