import axios from "../config/axios";

class ModalityService {
  async getAllModality(){
    const response = await axios.get('/cfp/course');
    return response.data;
  }
}

export const modalityService = new ModalityService();