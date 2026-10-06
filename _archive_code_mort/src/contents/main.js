import api from "../services/api";

export async function drawerCa(month, type) {
	try {
		const response = await api.get(`ca/${month}/${type}`);
		// Retourner les données de la réponse
		return response.data;
	} catch (error) {
		// Retourner null ou un objet vide en cas d'erreur
		return null;
	}
}

export async function drawerLearner(month, type) {
	try {
		const response = await api.get(`/learner/${month}/${type}`);
		return response.data;
	} catch (error) {
		return null;
	}
}


export const fetchDashboardEntreprise = async () => {
	try {
		const result = await api.get("home-etp");
		return result.data

	} catch (error) {
		console.log(error);

	}
}