import api from './api';

export const eventService = {
    async getAllCategoryEvent() {
        try {
            const response = await api.get('/marketplace/getAllCategoryInEvent');

            return {
                data: response.data,
            };
        } catch (error) {
            return {
                data: null,
                message: error.response?.data?.message || 'Erreur lors de la récupération des thématiques.',
            };
        }
    },

    async getAllCustomerEvent() {
        try {
            const response = await api.get('/marketplace/getAllCustomerInEvent');

            return {
                data: response.data,
            };
        } catch (error) {
            return {
                data: null,
                message: error.response?.data?.message || 'Erreur lors de la récupération des centres.',
            };
        }
    },

    async getAllCitiesEvent() {
        try {
            const response = await api.get('/marketplace/getAllCitiesEvent');

            return {
                data: response.data
            };
        } catch (error) {
            return {
                data: null,
                message: error.response?.data?.message || 'Erreur lors de la récupération des villes.',
            };
        }
    },

    async getAllLevelsEvent() {
        try {
            const response = await api.get('/marketplace/getAllLevelsEvent');

            return {
                data: response.data
            };
        } catch (error) {
            return {
                data: null,
                message: error.response?.data?.message || 'Erreur lors de la récupération des niveaux.',
            };
        }
    },

    async getAllPeriodsEvent() {
        try {
            const response = await api.get('/marketplace/getAllPeriodsEvent');

            return {
                data: response.data
            };
        } catch (error) {
            return {
                data: null,
                message: error.response?.data?.message || 'Erreur lors de la récupération des periodes.',
            };
        }
    }

};
