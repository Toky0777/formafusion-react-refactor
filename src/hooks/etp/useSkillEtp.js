import { useState } from "react";
import { getProjetEtpById, getSkillLevelEtp } from "../../services/skillService";

export const useSkillEtp = () => {
  const [leanersEtp, setLearnersEtp] = useState([]);
  const [skillItemsEtp, setSkillItemsEtp] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [skillLevelEtp, setSkillLevelEtp] = useState([]);
  const [projectEptDetails, setProjectEtpDetails] = useState({});

  const projetById = async (idProjet) => {
    setIsLoading(true);
    try {
      const res = await getProjetEtpById(idProjet);
      setLearnersEtp(res.learners.learner_items);
      setSkillItemsEtp(res.skills.skill_items);
      setProjectEtpDetails(res.project);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSkillLevelInProjectEtp = async (idProjet) => {
    try {
      const res = await getSkillLevelEtp(idProjet);
      setSkillLevelEtp(res.skill_levels);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    projetById,
    skillLevelEtp,
    projectEptDetails,
    isLoading,
    leanersEtp,
    skillItemsEtp,
    getSkillLevelInProjectEtp,
  };
};
