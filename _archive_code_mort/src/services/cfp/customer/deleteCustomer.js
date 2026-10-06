import axios from "../../../config/axios";

export const deleteCustomer = async (id) => {
  try {
    const result = await axios.delete(`cfp/clients/${id}`);
    return result;
  } catch (error) {
    console.log(error);
  }
};
