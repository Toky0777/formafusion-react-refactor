import { useState, useEffect } from 'react';
import ApiService from '../services/apiEvent';

export const useApiData = () => {
    const [categories, setCategories] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [cities, setCities] = useState([]);
    const [levels, setLevels] = useState([]);
    const [periods, setPeriods] = useState([]);
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
                levelsResponse,
                periodsResponse
            ] = await Promise.all([
                ApiService.getAllCategories(),
                ApiService.getAllCustomers(),
                ApiService.getAllCities(),
                ApiService.getAllLevels(),
                ApiService.getAllPeriods()
            ]);

            setCategories(categoriesResponse.data || []);
            setCustomers(customersResponse.data || []);
            setCities(citiesResponse.data || []);
            setLevels(levelsResponse.data || []);
            setPeriods(periodsResponse.data || []);
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
        customers,
        cities,
        levels,
        periods,
        loading,
        error,
        refetch: fetchAllData
    };
};