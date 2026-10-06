import axios from "../config/axios";

class ProjectService {
  async storeProject(data) {
    const response = await axios.post(`/cfp/projets`, data);
    return response.data;
  }

  async assignEtp(projectId, etpId) {
    const response = await axios.patch(`/cfp/projets/${projectId}/${etpId}/assign_etp`);
    
    return response.data;
  }

  async getEntrepriseByKey(key) {
    const response = await axios.get(`/cfp/projets/entreprise/key`, {
      params: { key },
    });
    return response.data;
  }

  async getCourseByKey(key) {
    const response = await axios.get(`/cfp/projet/module-first/key`, {
      params: { key },
    });
    return response.data;
  }

  async assignCourse(projectId, moduleId) {
    const response = await axios.patch(`cfp/projets/${projectId}/${moduleId}/module/assign`);
    return response.data;
  }

  async getPurchaseOrders(etpIds) {
    const response = await axios.get(`/cfp/bon-commande/purchase_order_by_etp`, {
    params: {
      etpId: etpIds,
    },
  });
    return response.data;
  }

  async getAllEntreprise(){
    const response = await axios.get('/cfp/all-entreprise');
    return response.data;
  }

  async getAllParticular(){
    const response = await axios.get('/cfp/particulars');
    return response.data;
  }

  async getAllCourse(){
    const response = await axios.get('/cfp/course');
    return response.data;
  }

  async getAllFolder(){
    const response = await axios.get('/cfp/all-folder');
    return response.data;
  }

  async createProject(data) {
    try {
      const response = await axios.post('/cfp/create-project', data);
      return response.data; 
    } catch (err) {
      throw err;
    }
  }

  async getDetailProject(projectId){
    try {
      const response = await axios.get(`/cfp/projet/detail/${projectId}`);
      return response.data; 
    } catch (err) {
      throw err;
    }
  }

  async getInvoiceAndProjectEtp(etpId){
    const response = await axios.get(`/cfp/etp-drawer/${etpId}`);
    return response.data;
  }

  async getLearnerAdded(projectId){
    const response = await axios.get(`/cfp/projets/${projectId}/get-learner-added`);
    console.log(response);
    
    return response.data;
  }

  async getAllParticulars(){
    const response = await axios.get(`/cfp/projets/all/particular`);
    return response.data;
  }

   async getLearnerByEntreprise(etpId){
    const response = await axios.get(`/cfp/projets/${etpId}/get-learner-by-etp`);
    return response.data;
  }

  async getLearnerByProject(projectId){
    const response = await axios.get(`/cfp/projets/${projectId}/get-learner-by-project`);
    return response.data;
  }

  async getEntrepriseByProject(projectId){
    const response = await axios.get(`/cfp/projets/${projectId}/get-entreprise`);
    return response.data;
  }

  async updateFinancial(projectId, idPaiement){
    const response = await axios.patch(`/cfp/projets/update/financement/${projectId}`,
          { idPaiement }
        );
    return response.data;
  }

  async manageFrais(projectId, idFrais, idSubContractor){
    const isEtp = idSubContractor ? 2 : 0;
    const response = await axios.post(
      `/cfp/projets/${projectId}/${idFrais}/${isEtp}/fraisprojet/assign`
    );
    return response.data;
  }

  async getCvTrainer(trainerId) {
    const response = await axios.get(
      `/cfp/projets/formateur/${trainerId}/mini-cv`
    );

    return response.data;
  }

  async deleteMaterial(projectId, materialId){
    const response = await axios.delete("/cfp/project-materials", {
      params: { projectId, materialId },
    });

    return response.data;
  }

  async updateNumberMaterial(projectId, materialId, number){
    const response = await axios.put("/cfp/project-materials/update-number", {
        project_id: projectId,
        material_id: materialId,
        number,
      });

    return response.data;
  }

  async manageRoom(projectId, roomId){
    const response = await axios.patch(`/cfp/projets/${projectId}/${roomId}/salle/assign`
        );
      
    return response.data;
  }

  async getEtpAssigned(projectId){
    const response = await axios.get(
      `/cfp/projets/${projectId}/etp-assigned`
    );

    return response.data;
  }

  async deassignEtp(projectId, etpId) {
    const response = await axios.delete(`/cfp/projets/${projectId}/${etpId}/deassign_etp`);
    return response.data;
  }

  async getAllRoom(){
    const response = await axios.get("/cfp/rooms-cfp");
    return response.data;
  }

  async getRoomAssigned(projectId){
    const response = await axios.get(`/cfp/room/${projectId}`);
    return response.data;
  }

  async deleteRoomForProject(projectId, roomId){
    const response = await axios.delete(`/cfp/projets/${projectId}/${roomId}/salle/deassign`
        );
      
    return response.data;
  }

  async deassignLearnerToProject(projectId, employeeId){
    const response = await axios.delete(`/cfp/projet/apprenants/${projectId}/${employeeId}`
        );
      
    return response.data;
  }

  async assignLearnerToProject(projectId, employeeId){
    const response = await axios.post(`/cfp/projet/apprenants/${projectId}/${employeeId}`
        );
      
    return response.data;
  }

  async getLearnerByKey(projectId, key){
    const response = await axios.get(`/cfp/projets/${projectId}/get-learner-by-key`, {params: {key}}
        );
      
    return response.data;
  }
}

export const projectService = new ProjectService();