import { useState, useCallback } from 'react';
import axios from '../../../../../config/axios';

export const useApiProfile = () => {
    const [loading, setLoading] = useState(false);

    const getUser = useCallback(() => {
        try {
            const userString = localStorage.getItem('user');
            return userString ? JSON.parse(userString) : null;
        } catch (error) {
            return null;
        }
    }, []);

    const apiCall = useCallback(async (endpoint, options = {}) => {
        setLoading(true);

        try {
            // Utiliser axios au lieu de fetch
            const response = await axios({
                url: endpoint,
                method: options.method || 'GET',
                data: options.body ? JSON.parse(options.body) : options.data,
                headers: options.headers,
                ...options
            });

            return response.data;
        } catch (error) {
            const message = error.response?.data?.message ||
                error.message ||
                'Une erreur est survenue';
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, []);

    const uploadFiles = useCallback(async (endpoint, formData) => {
        setLoading(true);

        try {
            const response = await axios.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            const message = error.response?.data?.message ||
                error.message ||
                'Erreur lors de l\'upload';
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        apiCall,
        uploadFiles,
        loading,
        getUser,
    };
};