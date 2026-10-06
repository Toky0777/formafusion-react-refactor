import { useState } from "react";
import axios from "../../config/axios";

export const useLearnerCfp = () => {
  const [learners, setLearners] = useState([]);
  const [homeLoading, setHomeLoading] = useState(true);
  const [moduleQuery, setModuleQuery] = useState([]);
  const [villes, setVilles] = useState([]);

  const getAllModuleQuery = async () => {
    try {
      const res = await axios.get("/cfp/apprenants");
      setModuleQuery(res.data.moduleQuery);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const getAllLearnears = async () => {
    setHomeLoading(true);
    try {
      const res = await axios.get("/cfp/apprenants");
      setLearners(res.data.apprenants);
      setVilles(res.data.villes);
    } catch (error) {
      console.log(error);
    } finally {
      setHomeLoading(false);
    }
  };

  const addLearner = async (data) => {
    try {
      const res = await axios.post("cfp/apprenants", data);
      if (res.data.status === 200) {
        getAllLearnears();
      } else {
        return res.data;
      }

      return res.data;
    } catch (error) {
      return error.response.data;
    }
  };

  const addAppExcel = async (data) => {
    try {
      const res = await axios.post("/cfp/apprenants/excel", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.status === 200) {
        getAllLearnears();
      } else {
        return res.data;
      }
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const editLearner = async (idLearner) => {
    try {
      const res = await axios.get(`/cfp/apprenants/${idLearner}/edit`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateLearner = async (data, idLearner) => {
    try {
      const res = await axios.put(
        `cfp/apprenants/update/learner/${idLearner}`,
        data
      );

      if (res.data.status === 200) {
        setLearners((prev) =>
          prev.map((p) =>
            p.idEmploye === idLearner ? { ...p, ...res.data.apprenant } : p
          )
        );
      }
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  };

  const updatePhotoLearner = async (image, idLearner) => {
    try {
      const res = await axios.post(`/cfp/apprenants/${idLearner}/updatePhoto`, {
        image: image,
      });

      if (res.data.status === 200) {
        setLearners((prev) =>
          prev.map((p) =>
            p.idEmploye === idLearner
              ? { ...p, emp_photo: res.data.imageName }
              : p
          )
        );
      }
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteLearner = async (idLearner) => {
    try {
      const res = await axios.delete(`/cfp/apprenants/${idLearner}`);
      if (res.data.status === 200) {
        setLearners((prev) => prev.filter((p) => p.idEmploye !== idLearner));
      }
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const showEtp = async (idEtp) => {
    try {
      const res = await axios.get(`/cfp/etp-drawer/${idEtp}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    homeLoading,
    learners,
    getAllLearnears,
    updatePhotoLearner,
    updateLearner,
    editLearner,
    addLearner,
    deleteLearner,
    getAllModuleQuery,
    showEtp,
    addAppExcel,
    moduleQuery,
    villes,
  };
};
