import { useState, useEffect } from 'react';
import customerService from '../../services/cfp/customer/customerService';

export const useCustomerData = () => {
    const [particulars, setParticulars] = useState([]);
    const [cities, setCities] = useState([]);
    const [typeCustomers, setTypeCustomers] = useState([]);
    const [etps, setEtps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [
                citiesResponse,
                etpsResponse,
                typeCustomersResponse,
                particularsResponse
            ] = await Promise.all([
                customerService.getAllCitiesEtp(),
                customerService.getAllEtp(),
                customerService.getAllTypeCustomers(),
                customerService.getAllParticular()
            ]);

            setCities(citiesResponse?.villes || []);
            setEtps(etpsResponse?.etps || []);
            setParticulars(particularsResponse?.particuliers || []);
            setTypeCustomers(typeCustomersResponse?.typeCustomers || []);
        } catch (err) {
            setError(err.message || "Erreur lors du chargement des données.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    return {
        etps,
        cities,
        typeCustomers,
        particulars,
        loading,
        error,
        refetch: fetchAllData
    };
};
