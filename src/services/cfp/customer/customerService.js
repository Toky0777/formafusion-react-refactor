import axios from "../../../config/axios";

class CustomerService {
  async getAllEtp() {
    const { data } = await axios.get(`/cfp/clients`);
    return data;
  }

  async getAllTypeCustomers() {
    const { data } = await axios.get(`/cfp/clients/type-customers/get`);
    return data;
  }

  async editEtp(idEtp) {
    const { data } = await axios.get(`/cfp/clients/${idEtp}/edit`);
    return data;
  }

  async getAllCitiesEtp() {
    const { data } = await axios.get(`/cfp/clients/cities/get`);
    return data;
  }

  async projetCustomer(id) {
    const { data } = await axios.get(`/cfp/etp-drawer/${id}`);
    return data;
  }

  async getAllCfp() {
    const { data } = await axios.get("/entreprise/clients");
    return data;
  }

  async deleteCentreDeFormation(idCfp) {
    const { data } = await axios.delete(`/entreprise/clients/destroy/${idCfp}`);
    return data;
  }

  async getCfpByName(name) {
    const { data } = await axios.get(`entreprise/invites/${name}/name`);
    return data;
  }

  async getCfpById(idCfp) {
    const res = await axios.get(`/entreprise/clients/${idCfp}`);
    return res.data;
  }

  async projetCustomer(id) {
    const response = await axios.get(`cfp/etp-drawer/${id}`);
    return response.data;
  }

  async deleteCustomer(id) {
    const result = await axios.delete(`cfp/clients/${id}`);
    return result;
  }

  async inviteCustomer(idTypeCustomer, idCustomer) {
    const response = await axios.post(
      `cfp/invites/store/${idTypeCustomer}/${idCustomer}`
    );
    return response;
  }
  async inviteCustomer(idTypeCustomer, idCustomer) {
    const response = await axios.post(
      `cfp/invites/store/${idTypeCustomer}/${idCustomer}`
    );
    return response;
  }
}

const customerService = new CustomerService();
export default customerService;
