import { useState } from "react";
import {
  getProjetApprenantById,
  getSkillLevelApprenant,
} from "../services/skillService";

export const useSkillApprenant = () => {
  const [leaners, setLearners] = useState([]);
  const [skillItems, setSkillItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [skillLevel, setSkillLevel] = useState([]);
  const [projectEptDetails, setProjectEtpDetails] = useState({});

  const projetById = async (idProjet) => {
    setIsLoading(true);
    try {
      const res = await getProjetApprenantById(idProjet);
      setLearners(res.learners.learner_items);
      setSkillItems(res.skills.skill_items);
      setProjectEtpDetails(res.project);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSkillLevelForApprenant = async (idProjet) => {
    try {
      const res = await getSkillLevelApprenant(idProjet);
      setSkillLevel(res.skill_levels);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    projetById,
    skillLevel,
    getSkillLevelForApprenant,
    projectEptDetails,
    isLoading,
    leaners,
    skillItems,
  };
};
