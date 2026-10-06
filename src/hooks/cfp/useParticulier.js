import { useState } from "react";
import axios from "../../config/axios";
import toastr from "toastr";

export const useParticulier = () => {
  const [parts, setParts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllParticulierInCfp = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/particulier");
      if (
        res.status === 204 ||
        !res.data.particuliers ||
        res.data.particuliers.length === 0
      ) {
        setParts([]);
      } else {
        setParts(res.data.particuliers);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des particuliers :", error);
      setParts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getProjectParticulier = async (idParticulier) => {
    try {
      const res = await axios.get(`/particulier/projets/${idParticulier}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const addParticulier = async (data) => {
    try {
      const res = await axios.post("/particulier", data);
      if (res.status === 200) {
        setParts((prev) => {
          const safePrev = Array.isArray(prev) ? prev : [];
          return [...safePrev, res.data.particulier];
        });

        return res;
      }
    } catch (error) {
      return error.response;
    }
  };

  const deleteParticulier = async (idParticulier) => {
    try {
      const res = await axios.delete(`/particulier/destroy/${idParticulier}`);

      if (res.data.status === 200) {
        setParts((prev) =>
          prev.filter((p) => p.idParticulier !== idParticulier)
        );
      }
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const editParticulier = async (idParticulier) => {
    try {
      const res = await axios.get(`/particulier/${idParticulier}`);
      return res.data.particulier;
    } catch (error) {
      console.log(error);
      toastr.error("Erreur lors de la récupération des données");
    }
  };

  const updateParticulier = async (idParticulier, data) => {
    try {
      const res = await axios.patch(`/particulier/${idParticulier}`, data);
      if (res.data.status === 200) {
        setParts((prev) =>
          prev.map((p) =>
            p.idParticulier === idParticulier
              ? { ...p, ...res.data.particulier }
              : p
          )
        );
      }
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const updatePhotoParticulier = async (image, idParticulier) => {
    try {
      const res = await axios.post(
        `/particulier/${idParticulier}/updatePhoto`,
        {
          image: image,
        }
      );

      if (res.data.status === 200) {
        setParts((prev) =>
          prev.map((p) =>
            p.idParticulier === idParticulier
              ? { ...p, part_photo: res.data.imageName }
              : p
          )
        );
      }
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    parts,
    isLoading,
    updatePhotoParticulier,
    updateParticulier,
    editParticulier,
    getAllParticulierInCfp,
    addParticulier,
    deleteParticulier,
    getProjectParticulier,
  };
};
