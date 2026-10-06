import axios from "axios";
import { API_URL } from "../config/env";

// Récupère le token depuis le localStorage (ou autre)
const getToken = () => sessionStorage.getItem("token") || localStorage.getItem("token");

// Crée une instance axios avec la config de base
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Ajoute le token à chaque requête si présent
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Liste des fonctions pour interagir avec l'API
export const fetchHomeEmp = () => api.get("/homeEmp");
export const fetchCentres = () => api.get("/centre");
export const fetchProgrammes = () => api.get("/supportProgramme");
export const fetchProgrammeDetail = (id) => api.get(`/supportProgramme/${id}/detail`);
export const fetchCentreDetail = (id) => api.get(`/centre/${id}/detail`);

export default api;