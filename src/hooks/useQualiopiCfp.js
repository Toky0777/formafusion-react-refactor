import { useState, useEffect } from 'react';
import axios from '../config/axios';

/**
 * Hook personnalisé pour gérer les données d'accueil CFP
 * Utilise l'instance axios configurée du projet
 * @returns {Object} { data, loading, error, refetch }
 */
export const useQualiopiCfp = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAccueilData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get('/qualiopiCfp');
            setData(response.data);
        } catch (err) {
            console.error("Erreur lors du chargement des données d'accueil CFP:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccueilData();
    }, []);

    const refetch = () => {
        fetchAccueilData();
    };

    return {
        data,
        loading,
        error,
        refetch
    };
};