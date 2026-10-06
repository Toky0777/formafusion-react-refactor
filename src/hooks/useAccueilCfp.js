import { useState, useEffect } from 'react';
import useApi from './Api';

/**
 * Hook personnalisé pour gérer les données d'accueil CFP
 * Utilise le système d'API existant du projet
 * @returns {Object} { data, loading, error, refetch }
 */
export const useAccueilCfp = () => {
  const { loading, error, data, callApi } = useApi();
  const [accueilData, setAccueilData] = useState(null);

  const fetchAccueilData = async () => {
    try {
      const response = await callApi('/accueilCfp');
      setAccueilData(response);
    } catch (err) {
      console.error("Erreur lors du chargement des données d'accueil CFP:", err);
      // L'erreur est déjà gérée par le hook useApi
    }
  };

  useEffect(() => {
    fetchAccueilData();
  }, []);

  const refetch = () => {
    fetchAccueilData();
  };

  return {
    data: accueilData,
    loading,
    error,
    refetch
  };
};

export default useAccueilCfp;
