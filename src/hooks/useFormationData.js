import { useState, useEffect } from 'react';
import ApiService from '../services/apiEvent';

export const useFormationData = () => {
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });

    const fetchFormations = async (page = 1, filters = {}) => {
        try {
            setLoading(true);
            setError(null);

            let response;
            const hasFilters = Object.values(filters).some(value =>
                value !== null && value !== undefined && value !== '' &&
                (Array.isArray(value) ? value.length > 0 : true)
            );

            if (hasFilters) {
                // Convert array filters to comma-separated strings for API
                const apiFilters = {};
                Object.entries(filters).forEach(([key, value]) => {
                    if (Array.isArray(value) && value.length > 0) {
                        apiFilters[key] = value.join(',');
                    } else if (value !== null && value !== undefined && value !== '') {
                        apiFilters[key] = value;
                    }
                });

                response = await ApiService.filterEvents(apiFilters, page, pagination.per_page);
            } else {
                response = await ApiService.getAllProjects(page, pagination.per_page);
            }

            // Transform API response to match component expectations
            const transformedFormations = response.data.map(formation => ({
                id: formation.id,
                title: formation.name,
                theme: formation.category,
                module_image: formation.module_image,
                center: formation.center,
                date: formation.date ? new Date(formation.date).toLocaleDateString('fr-FR') : '',
                dateObj: formation.date ? new Date(formation.date) : new Date(),
                month: formation.date ? new Date(formation.date).toLocaleDateString('fr-FR', { month: 'long' }) : '',
                monthShort: formation.date ? new Date(formation.date).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase() : '',
                dayShort: formation.date ? new Date(formation.date).toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase() : '',
                day: formation.date ? new Date(formation.date).getDate().toString().padStart(2, '0') : '',
                year: new Date(formation.date).getFullYear().toString(),
                duration: formation.duration,
                format: formation.modality || 'Présentiel',
                price: formation.price ? `${parseInt(formation.price).toLocaleString()} Ar` : 'Prix sur demande',
                priceNum: formation.price ? parseInt(formation.price) : 0,
                location: formation.city || 'Antananarivo',
                participants: formation.participants || Math.floor(Math.random() * 15) + 5,
                level: formation.level || 'Débutant',
                description: formation.description || `Aucune description`,
                rating: formation.rating?.average,
                reviewCount: formation.rating?.totalEmployees || 0
            }));

            setFormations(transformedFormations);
            setPagination({
                current_page: response.current_page || 1,
                last_page: response.last_page || 1,
                per_page: response.per_page || 10,
                total: response.total || 0
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFormations();
    }, []);

    return {
        formations,
        loading,
        error,
        pagination,
        fetchFormations,
        refetch: () => fetchFormations(pagination.current_page)
    };
};