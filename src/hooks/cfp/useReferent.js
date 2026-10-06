import { useEffect, useState } from "react";
import axios from "../../config/axios";

export const useReferent = () => {
  const [referent, setReferent] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const getReferent = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/cfp/referents");
      setIsAdmin(res.data.refConnected);
      setReferent(res.data.referentAll);
      setIsAdmin(res.data.refConnected);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const editReferent = async (idReferent) => {
    try {
      const res = await axios.get(`/cfp/referents/${idReferent}/edit`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateInfoReferent = async (data, idReferent) => {
    try {
      const res = await axios.put(`/cfp/referents/${idReferent}`, data);
      if (res.status === 200) {
        getReferent();
      }

      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updatePassword = async (idReferent, password) => {
    try {
      const res = await axios.put(
        `/cfp/referents/updatePassword/${idReferent}`,
        {
          password: password,
        }
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updatePhotoReferent = async (image, idReferent) => {
    try {
      const res = await axios.post(`/cfp/referents/${idReferent}/updatePhoto`, {
        image: image,
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteReferent = async (idReferent) => {
    try {
      const res = await axios.delete(`/cfp/referents/${idReferent}`);
      if (res.data.status === 200) {
        getReferent();
      }
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReferent();
  }, []);

  return {
    getReferent,
    updateInfoReferent,
    updatePhotoReferent,
    editReferent,
    updatePassword,
    deleteReferent,
    referent,
    loading,
    isAdmin
  };
};
