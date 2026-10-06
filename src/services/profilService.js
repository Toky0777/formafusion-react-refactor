import axios from "../config/axios";

class ProfilService {

  // --- PROFIL / USER ---
  async getProfilCfp() {
    const response = await axios.get(`/cfp/profils`);
    return response.data;
  }

  async getUser() {
    const response = await axios.get(`/cfp/profils/user`);
    return response.data;
  }

  async updateCustomer(payload) {
    const response = await axios.put(`/cfp/profils/update`, payload);
    return response.data;
  }

  async updateUser(payload) {
    const response = await axios.put(`/cfp/profils/update-user`, payload);
    return response.data;
  }

  // --- BANK ACCOUNTS ---
  async addAccountBank(payload) {
    const response = await axios.post(`/cfp/bankAccount`, payload);
    return response.data;
  }

  async updateBankAccount(id, payload) {
    
    const response = await axios.put(`/cfp/bankAccount/${id}`, payload);
    return response.data;
  }

  async deleteBankAccount(id) {
    const response = await axios.delete(`/cfp/bankAccount/${id}`);
    return response.data;
  }

  async getBankAccount(id) {
    const response = await axios.get(`/cfp/bankAccount/${id}`);
    return response.data;
  }

  // --- MOBILE MONEY ACCOUNTS ---
  async addMobileAccount(payload) {
    const response = await axios.post(`/cfp/mobilemoneyAccount`, payload);
    return response.data;
  }

  async updateMobileAccount(id, payload) {
    const response = await axios.put(`/cfp/mobilemoneyAccount/${id}`, payload);

    console.log(response.data);

    return response.data;
  }

  async deleteMobileAccount(id) {
    const response = await axios.delete(`/cfp/mobilemoneyAccount/${id}`);
    return response.data;
  }

  //profil learner
  async getProfilLearner() {
    const response = await axios.get(`/emp/getUser`);
    return response.data;
  }

  // ---------------------------ENTREPRISE PROFIL-----------------------
  async getProfilEtp() {
    const response = await axios.get(`/etp/profils`);

    return response.data;
  }

  async getUserEtp() {
    const response = await axios.get(`/etp/profils/user`);

    return response.data;
  }

  async updateUserEtp(payload) {
    const response = await axios.put(`/etp/profils/update-user`, payload);
    return response.data;
  }
  async updateCustomerEtp(payload) {
    const response = await axios.put(`/etp/profils/update`, payload);
    return response.data;
  }
}

export const profilService = new ProfilService();
