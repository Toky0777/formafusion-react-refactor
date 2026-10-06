import axios from "../config/axios";

class SearchService {

  async searchGenerality(searchQuery) {
    const response = await axios.get(`/search-generality?key=${encodeURIComponent(searchQuery)}`);
    
    return response.data;
  }

  async getLearner(searchQuery) {
    const response = await axios.get(`/cfp/search/learners?key=${encodeURIComponent(searchQuery)}`);
    
    return response.data;
  }

  async getParticular(searchQuery) {
    const response = await axios.get(`/cfp/search/particulars?key=${encodeURIComponent(searchQuery)}`);
    
    return response.data;
  }

  async getProforma(searchQuery) {
    const response = await axios.get(`/cfp/search/proforma?key=${encodeURIComponent(searchQuery)}`);
    return response.data;
  }

  async getProject(searchQuery, page = 1, perPage = 15) {
    const response = await axios.get(
      `/cfp/search/projects?key=${encodeURIComponent(
        searchQuery
      )}&page=${page}&per_page=${perPage}`
    );
    return response;
  }

  async getProjectEtp(searchQuery) {
    const response = await axios.get(`/etp/search/projects?key=${encodeURIComponent(searchQuery)}`);
    
    
    return response.data;
  }

  async getCfp(searchQuery) {
    const response = await axios.get(`/etp/search/cfp?key=${encodeURIComponent(searchQuery)}`);
    
    return response.data;
  }

  async getEmployee(searchQuery) {
    const response = await axios.get(`/etp/search/employes?key=${encodeURIComponent(searchQuery)}`);
    
    return response.data;
  }

  async getProjectByReference(searchQuery, page = 1, perPage = 15) {
    const response = await axios.get(
      `/cfp/search/project-reference?key=${encodeURIComponent(
        searchQuery
      )}&page=${page}&per_page=${perPage}`
    );
    return response;
  }

  async getProjectByNeighborhood(searchQuery, page = 1, perPage = 15) {
    const response = await axios.get(
      `/cfp/search/project-neighborhood?key=${encodeURIComponent(
        searchQuery
      )}&page=${page}&per_page=${perPage}`
    );
    return response;
  }

  async getProjectByPlace(searchQuery, page = 1, perPage = 15) {
    const response = await axios.get(
      `/cfp/search/project-place?key=${encodeURIComponent(
        searchQuery
      )}&page=${page}&per_page=${perPage}`
    );
    return response;
  }

  async getProjectByCity(searchQuery, page = 1, perPage = 15) {
    const response = await axios.get(
      `/cfp/search/project-city?key=${encodeURIComponent(
        searchQuery
      )}&page=${page}&per_page=${perPage}`
    );
    return response;
  }

  async getProjectWithEtp(idEtp, page = 1, perPage = 15) {
    const response = await axios.get(
      `/cfp/search/project-with-etp?idEtp=${encodeURIComponent(
        idEtp
      )}&page=${page}&per_page=${perPage}`
    );
    return response;
  }

  async getTrainer(searchQuery) {
    const response = await axios.get(`/cfp/search/trainers?key=${encodeURIComponent(searchQuery)}`);
    
    return response.data;
  }

  async getEntreprise(searchQuery) {
    const response = await axios.get(`/cfp/search/entreprises?key=${encodeURIComponent(searchQuery)}`);
    
    return response.data;
  }

  async getReferent(searchQuery) {
    const response = await axios.get(`/cfp/search/referents?key=${encodeURIComponent(searchQuery)}`);
    
    return response.data;
  }

  async getReferentCustomer(searchQuery) {
    const response = await axios.get(`/cfp/search/referent-customers?key=${encodeURIComponent(searchQuery)}`);
    
    return response.data;
  }

  async getCourse(searchQuery) {
    const response = await axios.get(`/cfp/search/courses?key=${encodeURIComponent(searchQuery)}`);
    
    return response.data;
  }

  async getInvoice(searchQuery, page) {
    const response = await axios.get(`/cfp/search/invoices?key=${encodeURIComponent(searchQuery)}&page=${encodeURIComponent(page)}`);
    
    return response;
  }

  async getFolder(searchQuery) {
    const response = await axios.get(`/cfp/search/folders?key=${encodeURIComponent(searchQuery)}`);
    
    return response.data;
  }

  async searchGeneralityEtp(searchQuery) {
    const response = await axios.get(`/search-generality-etp?key=${encodeURIComponent(searchQuery)}`);
    console.log(response);
    
    return response.data;
  }
  
}

export const searchService = new SearchService();