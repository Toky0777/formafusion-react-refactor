import { API_URL } from "../config/env";
const API_BASE_URL = `${API_URL}/marketplace`;

class ApiService {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                return null;
            }

            return await response.json();
        } catch (error) {
            return null;
        }
    }

    // Get all projects/formations with pagination
    async getAllProjects(page = 1, perPage = 10) {
        return this.request(`/getAllProject?page=${page}&per_page=${perPage}`);
    }

    // Filter events/formations
    async filterEvents(filters = {}, page = 1, perPage = 10) {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            per_page: perPage.toString(),
            ...Object.fromEntries(
                Object.entries(filters).filter(([_, value]) =>
                    value !== null && value !== undefined && value !== ''
                )
            )
        });

        return this.request(`/filter/event?${queryParams}`);
    }

    // Get all categories/themes
    async getAllCategories() {
        return this.request('/getAllCategoryInEvent');
    }

    // Get all customers/centers
    async getAllCustomers() {
        return this.request('/getAllCustomerInEvent');
    }

    // Get all cities
    async getAllCities() {
        return this.request('/getAllCitiesEvent');
    }

    // Get all levels
    async getAllLevels() {
        return this.request('/getAllLevelsEvent');
    }

    // Get all periods
    async getAllPeriods() {
        return this.request('/getAllPeriodsEvent');
    }

    async getAllCategoriesCourse() {
        return this.request('/getAllCategoryCourse');
    }

    async getAllCustomersCourse() {
        return this.request('/getAllCustomerCourse');
    }

    async getAllLevelsCourse() {
        return this.request('/getAllLevelsCourse');
    }

    async getAllCitiesCourse() {
        return this.request('/getAllCitiesCourse');
    }

    async getAllCourses(page = 1, perPage = 10) {
        return this.request(`/getAllModule?page=${page}&per_page=${perPage}`);
    }

    async filterCourses(filters = {}, page = 1, perPage = 10) {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            per_page: perPage.toString(),
            ...Object.fromEntries(
                Object.entries(filters).filter(([_, value]) =>
                    value !== null && value !== undefined && value !== ''
                )
            )
        });

        return this.request(`/filter/course?${queryParams}`);
    }

    async getAllCategoriesByCenter() {
        return this.request('/getAllCategoryByCenter');
    }

    async getAllCitiesCenter() {
        return this.request('/getAllRegionCenter');
    }

    async getAllCenters(page = 1, perPage = 10) {
        return this.request(`/getAllCustomer?page=${page}&per_page=${perPage}`);
    }

    async filterCenters(filters = {}, page = 1, perPage = 10) {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            per_page: perPage.toString(),
            ...Object.fromEntries(
                Object.entries(filters).filter(([_, value]) =>
                    value !== null && value !== undefined && value !== ''
                )
            )
        });

        return this.request(`/filter/cfp?${queryParams}`);
    }
}

export default new ApiService();