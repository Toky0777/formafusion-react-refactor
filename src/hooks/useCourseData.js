import { useState, useEffect } from 'react';
import ApiService from '../services/apiEvent';

export const useCourseData = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });

    const fetchCourses = async (page = 1, filters = {}) => {
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

                response = await ApiService.filterCourses(apiFilters, page, pagination.per_page);
            } else {
                response = await ApiService.getAllCourses(page, pagination.per_page);
            }

            // Transform API response to match component expectations
            const transformedCourses = response.data.map(formation => ({
                id: formation.id,
                title: formation.name,
                theme: formation.category,
                module_image: formation.module_image,
                center: formation.center,
                duration: formation.duration,
                price: formation.price ? `${parseInt(formation.price).toLocaleString()} Ar` : 'Prix sur demande',
                priceNum: formation.price ? parseInt(formation.price) : 0,
                location: formation.city,
                participants: formation.participants || Math.floor(Math.random() * 15) + 5,
                level: formation.level,
                description: formation.description || `Aucune description`,
                rating: formation.rating?.average,
                reviewCount: formation.rating?.totalEmployees || 0
            }));

            setCourses(transformedCourses);
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
        fetchCourses();
    }, []);

    return {
        courses,
        loading,
        error,
        pagination,
        fetchCourses,
        refetch: () => fetchCourses(pagination.current_page)
    };
};