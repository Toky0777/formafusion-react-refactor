import { useState } from "react";
import axios from "../config/axios";

export const useCustomer = () => {
  const [etps, setEtps] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllEtps = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/cfp/clients");
      setEtps(res.data.etps);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const editEtp = async (idEtp) => {
    try {
      const res = await axios.get(`/cfp/clients/${idEtp}/edit`);
      return res.data.entreprise;
    } catch (error) {
      console.log(error);
    }
  };

  const updateEtp = async (idEtp, data) => {
    try {
      const res = await axios.patch(`/cfp/clients/${idEtp}`, data);

      if (res.data.status === 200) {
        setEtps((prev) =>
          prev.map((e) =>
            e.idEtp === idEtp ? { ...e, ...res.data.entreprise } : e
          )
        );
        await getAllEtps();
        return res.data;
      }
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateLogoEtp = async (image, id) => {
    try {
      const res = await axios.post(`/cfp/clients/${id}/logo`, {
        image: image,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteEtp = async (idEtp) => {
    try {
      const res = await axios.delete(`/cfp/clients/${idEtp}`);
      if (res.data.status === 200) {
        setEtps((prev) => prev.filter((p) => p.idEtp !== idEtp));
      }
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    etps,
    updateEtp,
    getAllEtps,
    editEtp,
    deleteEtp,
    updateLogoEtp,
    loading,
  };
};
