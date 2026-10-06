import { useState } from "react";
import axios from "../../config/axios";

export const useFmfp = () => {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mdls, setMdls] = useState([]);

  const getAllEtps = async () => {
    try {
      const res = await axios.get("cfp/clients");
      return res.data.etps;
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProjectsFmfp = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/cfp/fmfp");
      setProjects(res.data.fmfp);
      setStatus(res.data.status_fmfp);
      setMdls(res.data.modules);
      return res.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getAllComments = async (id) => {
    try {
      const res = await axios.get(`/cfp/fmfp/comments/${id}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const commentFolder = async (contents, id) => {
    try {
      const res = await axios.post(`/cfp/fmfp/comment/${id}`, {
        contents: contents,
      });
      if (res.data.status === 201) {
        await getAllComments(id);
      }
      return res.data;
    } catch (error) {
      console.log();
    }
  };

  const deleteComment = async (idComment, idFolder) => {
    try {
      const res = await axios.delete(
        `/cfp/fmfp/deleteComment/${idComment}/${idFolder}`
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const store = async (data) => {
    try {
      const res = await axios.post("/cfp/fmfp", data);
      if (res.status === 201) {
        await getAllProjectsFmfp();
      }
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const show = async (id) => {
    try {
      const res = await axios.get(`/cfp/fmfp/${id}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (data, id) => {
    try {
      const res = await axios.patch(`/cfp/fmfp/update/${id}`, data);

      if (res.status === 200) {
        await getAllProjectsFmfp();
      }
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const changeStatus = async (newsStatusId, folderId) => {
    try {
      const res = await axios.patch(`/cfp/fmfp/changeStatus/${folderId}`, {
        idStatus: newsStatusId,
      });

      console.log(res);
      
      if (res.status === 200) {
        await getAllProjectsFmfp();
      }
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const changeStatusWithCreatingProject = async (newsStatusId, folderId) => {
    try {
      const res = await axios.patch(`/cfp/fmfp/changeStatus/${folderId}`, {
        idStatus: newsStatusId,
      });
      console.log(res);
      
      if (res.status === 200) {
        await getAllProjectsFmfp();
      }
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFmpf = async (id) => {
    try {
      const res = await axios.delete(`/cfp/fmfp/delete/${id}`);
      if (res.status === 200) {
        await getAllProjectsFmfp();
      }
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    getAllProjectsFmfp,
    changeStatus,
    projects,
    status,
    loading,
    getAllEtps,
    deleteComment,
    getAllComments,
    commentFolder,
    show,
    mdls,
    update,
    deleteFmpf,
    store,
    changeStatusWithCreatingProject
  };
};
