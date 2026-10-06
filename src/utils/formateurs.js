import axios from "../config/axios";

export const allFormateur = async () => {
  try {
    const response = await axios.get("cfp/dashboard/formateur");
    return response.data;
  } catch (error) {
    console.log(error.response.data);
  }
};

export const formateurById = async (id) => {
  try {
    const response = await axios.get(`cfp/dashboard/formateur/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
