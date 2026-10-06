import { useState, useEffect } from 'react';
import ApiService from '../services/apiEvent';

export const useApiData = () => {
    const [categories, setCategories] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [cities, setCities] = useState([]);
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [
                categoriesResponse,
                customersResponse,
                citiesResponse,
                levelsResponse
            ] = await Promise.all([
                ApiService.getAllCategoriesByCenter(),
                ApiService.getAllCustomersCourse(),
                ApiService.getAllCitiesCenter(),
                ApiService.getAllLevelsCourse()
            ]);

            setCategories(categoriesResponse.data || []);
            setCustomers(customersResponse.data || []);
            setCities(citiesResponse.data || []);
            setLevels(levelsResponse.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    return {
        categories,
        cities,
        loading,
        error,
        refetch: fetchAllData
    };
};