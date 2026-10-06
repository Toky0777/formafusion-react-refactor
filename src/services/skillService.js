import axios from "../config/axios";

// Projects CFP
export const getAllProjects = async () => {
  try {
    const res = await axios.get("/cfp/skill-matrix");
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

export const showProject = async (idProjet) => {
  try {
    const res = await axios.get(`/cfp/skill-matrix/projects/${idProjet}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSkillLevel = async (idProjet) => {
  try {
    const res = await axios.get(
      `/cfp/skill-matrix/projects/${idProjet}/skill-levels`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// Projects Entreprise
export const getAllProjectEntreprise = async () => {
  try {
    const res = await axios.get("/entreprises/skill-matrix");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getProjetEtpById = async (idProjet) => {
  try {
    const res = await axios.get(
      `/entreprises/skill-matrix/projects/${idProjet}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getSkillLevelEtp = async (idProjet) => {
  try {
    const res = await axios.get(
      `/entreprises/skill-matrix/projects/${idProjet}/skill-levels`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// Projets Apprenants
export const getAllProjectForApprenant = async () => {
  try {
    const res = await axios.get("/employes/skill-matrix");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getProjetApprenantById = async (idProjet) => {
  try {
    const res = await axios.get(`/employes/skill-matrix/projects/${idProjet}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getSkillLevelApprenant = async (idProjet) => {
  try {
    const res = await axios.get(
      `/employes/skill-matrix/projects/${idProjet}/skill-levels`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// Projet Formateur

export const getAllProjectsFormateur = async () => {
  try {
    const res = await axios.get("/formateurs/skill-matrix");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getProjectFormById = async (idProjet) => {
  try {
    const res = await axios.get(
      `/formateurs/skill-matrix/projects/${idProjet}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getSkillLevelForm = async (idProjet) => {
  try {
    const res = await axios.get(
      `/formateurs/skill-matrix/projects/${idProjet}/skill-levels`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// Skill

export const getAllModulesCfp = async () => {
  try {
    const res = await axios.get("/cfp/module_skills");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const addNewSkill = async (idModule, skillName) => {
  try {
    const response = await axios.post(`/cfp/module_skills/${idModule}/skills`, {
      name: skillName,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const updateSkillNameFromCfp = async (idModule, idSkill, skillName) => {
  try {
    const response = await axios.put(
      `/cfp/module_skills/${idModule}/skills/${idSkill}/update`,
      {
        name: skillName,
      }
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteSkill = async (idModule, idSkill) => {
  try {
    const response = await axios.delete(
      `/cfp/module_skills/${idModule}/skills/${idSkill}`
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
};

// CFP Skill niveau

export const saveSkillEmploye = async (data) => {
  try {
    const response = await axios.post(
      `/cfp/skill-matrix/projects/${data.idProjet}/employes/${data.idEmploye}/skills/${data.skillId}`,
      {
        skill_score_before: data.before,
        skill_score_after: data.after,
      }
    );
  } catch (error) {
    console.error(error);
  }
};

export const updateSkillEmploye = async (data) => {
  try {
    const response = await axios.put(
      `/cfp/skill-matrix/projects/${data.idProjet}/employes/${data.idEmploye}/skills/${data.skillId}/update`,
      {
        skill_score_before: data.before,
        skill_score_after: data.after,
      }
    );
  } catch (error) {
    console.error(error);
  }
};

// Formateur Skill niveau
export const saveSkillEmployeForm = async (data) => {
  try {
    const response = await axios.post(
      `/formateurs/skill-matrix/projects/${data.idProjet}/employes/${data.idEmploye}/skills/${data.skillId}`,
      {
        skill_score_before: data.before,
        skill_score_after: data.after,
      }
    );
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

export const updateSkillEmployeForm = async (data) => {
  try {
    const response = await axios.put(
      `/formateurs/skill-matrix/projects/${data.idProjet}/employes/${data.idEmploye}/skills/${data.skillId}/update`,
      {
        skill_score_before: data.before,
        skill_score_after: data.after,
      }
    );
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};
