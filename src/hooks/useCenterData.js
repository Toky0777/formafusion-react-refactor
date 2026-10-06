import { useState, useEffect } from 'react';
import centerService from '../services/centerService';

export const useCenterData = () => {
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });

    const fetchCenters = async (page = 1, filters = {}) => {
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

                response = await centerService.filterCenters(apiFilters, page, pagination.per_page);
            } else {
                response = await centerService.getAllCenters(page, pagination.per_page);
            }

            // Transform API response to match component expectations
            const transformedCenters = response.data.map(center => ({
                id: center.id,
                name: center.name,
                themes: center.category,
                location: center.city,
                description: center.description || `Aucune description`,
                rating: center.rating?.average,
                reviewCount: center.rating?.total || 0,
                phone: center.phone || 'Aucun contact',
                image: center.logo,
                email: center.email
            }));

            setCenters(transformedCenters);
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
        fetchCenters();
    }, []);

    return {
        centers,
        loading,
        error,
        pagination,
        fetchCenters,
        refetch: () => fetchCenters(pagination.current_page)
    };
};