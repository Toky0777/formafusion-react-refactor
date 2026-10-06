import axios from "../config/axios";

export const allModule = async () => {
  try {
    const data = await axios.get("cfp/objectif");

    return data;
  } catch (error) {
    console.log(error.response);
  }
};

export const formatNumber = (number) => {
  let numStr = String(number).replace(/\s/g, "");
  if (!/^\d+$/.test(numStr)) {
    return number;
  }
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const saveGoal = async (data) => {
  try {
    const res = await axios.post("cfp/objectif/save", {
      year: data.year,
      month: data.month,
      idModule: data.idModule,
      amount: data.amount,
    });
    return res.data;
  } catch (error) {
    throw error; // Propager l'erreur pour la gérer dans handleSave
  }
};

export const months = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];
