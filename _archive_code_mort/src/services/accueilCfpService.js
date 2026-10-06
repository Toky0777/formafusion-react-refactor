import api from './api';

/**
 * Service pour récupérer les données d'accueil du CFP
 */
export const accueilCfpService = {
  /**
   * Vérifie si l'utilisateur est authentifié
   * @returns {boolean} True si authentifié, false sinon
   */
  isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    return !!token;
  },

  /**
   * Récupère toutes les données d'accueil du CFP
   * @returns {Promise<Object>} Les données d'accueil
   */
  async getAccueilData() {
    // Vérifier l'authentification avant de faire l'appel
    if (!this.isAuthenticated()) {
      const error = new Error('Non authentifié');
      error.status = 401;
      throw error;
    }

    try {
      const response = await api.get('/accueilCfp');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données d\'accueil:', error);
      
      // Gérer spécifiquement l'erreur 401
      if (error.response?.status === 401) {
        const authError = new Error('Session expirée. Veuillez vous reconnecter.');
        authError.status = 401;
        authError.isAuthError = true;
        throw authError;
      }
      
      throw error;
    }
  }
};

export default accueilCfpService;
