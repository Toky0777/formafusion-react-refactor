import axios from "../../../config/axios";

class AIService {
    /**
     * Prédire la rentabilité d'un projet
     * @param {Object} projectData - Données du projet
     */
    async predictRentability(projectData) {
        try {
            const response = await axios.post('/ai/rentability/predict', projectData);
            return response.data;
        } catch (error) {
            console.error('Erreur prédiction rentabilité:', error);
            throw error;
        }
    }

    /**
     * Entraîner le modèle avec les données historiques
     */
    async trainModel() {
        try {
            const response = await axios.post('/ai/rentability/train');
            return response.data;
        } catch (error) {
            console.error('Erreur entraînement modèle:', error);
            throw error;
        }
    }

    /**
     * Vérifier la santé de l'API ML
     */
    async checkHealth() {
        try {
            const response = await axios.get('/ai/rentability/health');
            return response.data;
        } catch (error) {
            console.error('Erreur vérification santé:', error);
            throw error;
        }
    }

    /**
     * Récupérer les statistiques de rentabilité
     */
    async getStatistics() {
        try {
            const response = await axios.get('/ai/rentability/statistics');
            return response.data;
        } catch (error) {
            console.error('Erreur récupération statistiques:', error);
            throw error;
        }
    }

    /**
     * Récupérer les données historiques (debug)
     */
    async getHistoricalData(limit = 100) {
        try {
            const response = await axios.get('/ai/rentability/getHistoricalData', {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur récupération données historiques:', error);
            throw error;
        }
    }
}

export default new AIService();