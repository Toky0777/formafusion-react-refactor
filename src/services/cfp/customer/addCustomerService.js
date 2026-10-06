import axios from "../../../config/axios";

// Client existant
export const inviteCustomer = async (idTypeCustomer, idCustomer) => {
  try {
    const response = await axios.post(
      `cfp/invites/store/${idTypeCustomer}/${idCustomer}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Client inexsistant

export const inviteNewCustomer = async (idTypeCustomer, name, email) => {
  try {
    const result = await axios.post("cfp/invites/new-customer", {
      idTypeCustomer,
      customer_name: name,
      customer_email: email,
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

// Invite Centre de formation

export const inviteCentreDeFormation = async (idCustomer) => {
  try {
    const response = await axios.post(
      `entreprise/invites/store/1/${idCustomer}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const inviteNewCentreDeFormation = async (name, email) => {
  try {
    const response = await axios.post("entreprise/invites/new-customer", {
      idTypeCustomer: 1,
      customer_name: name,
      customer_email: email,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'invitation:", error);
    throw error;
  }
};
