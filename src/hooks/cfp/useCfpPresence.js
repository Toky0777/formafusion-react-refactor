import { useState } from "react";
import axios from "../../config/axios";

export const useCfpPresence = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/cfp/presence");
      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const showEmg = async (idProjet) => {
    try {
      const res = await axios.get(`cfp/presence/emargement/${idProjet}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    data,
    loading,
    getAllData,
    showEmg,
  };
};
