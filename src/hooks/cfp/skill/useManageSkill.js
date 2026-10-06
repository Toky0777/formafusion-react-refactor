import {
  addNewSkill,
  deleteSkill,
  getAllModulesCfp,
  updateSkillNameFromCfp,
} from "../../../services/skillService";
import { useEffect, useState } from "react";
import "toastr/build/toastr.min.css";
import toastr from "toastr";

export const useManageSkill = () => {
  const [modules, setModules] = useState([]);
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      setIsLoading(true);

      try {
        const res = await getAllModulesCfp();
        setModules(res.modules.modules_items);
        setSkills(res.modules.modules_items.skills);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModules();
  }, []);

  const addSkillToModule = async (idModule, skillName) => {
    const res = await addNewSkill(idModule, skillName);

    if (res.status === 200) {
      setModules((prev) =>
        prev.map((module) => {
          if (module.idModule === idModule) {
            const newSkill = {
              id: res.data.id,
              name: res.data.name,
              idModule: idModule,
            };
            return {
              ...module,
              skills: [...module.skills, newSkill],
            };
          }
          return module;
        })
      );
      toastr.success(res.message);
    } else {
      console.log(res);
      toastr.error(res.message);
    }
  };

  const deleteSkillInModule = async (idModule, idSkill) => {
    try {
      const res = await deleteSkill(idModule, idSkill);
      if (res.status === 200) {
        setModules((prev) =>
          prev.map((module) =>
            module.idModule === idModule
              ? {
                  ...module,
                  skills: module.skills.filter((s) => s.id !== idSkill),
                }
              : module
          )
        );
        toastr.success(res.message);
      } else {
        toastr.error("On ne peut pas supprimer cette skill");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const udpateSkillToModule = async (idModule, idSkill, skillName) => {
    try {
      const res = await updateSkillNameFromCfp(idModule, idSkill, skillName);

      if (res.status === 200) {
        setModules((prevModules) =>
          prevModules.map((module) => {
            if (module.idModule === idModule) {
              return {
                ...module,
                skills: module.skills.map((skill) =>
                  skill.id === idSkill
                    ? { ...skill, name: res.skill?.name || skillName }
                    : skill
                ),
              };
            }
            return module;
          })
        );

        toastr.success(res.message || "Skill mise à jour avec succès !");
      } else {
        toastr.error(res.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.log(error);
      toastr.error("Une erreur est survenue");
    }
  };

  return {
    deleteSkillInModule,
    udpateSkillToModule,
    modules,
    skills,
    addSkillToModule,
    isLoading,
  };
};
