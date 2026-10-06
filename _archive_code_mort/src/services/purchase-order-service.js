
import axios from "../config/axios";

class PurchaseOrderService {
  async getAllOrder(){
    const response = await axios.get('/cfp/course');
    return response.data;
  }
}

export const purchaseOrderService = new PurchaseOrderService();