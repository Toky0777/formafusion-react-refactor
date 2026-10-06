import { useEffect, useState } from "react";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import axios from "../../../config/axios";

export const useTrainerManageSkill = () => {
  const [modules, setModules] = useState([]);
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      setIsLoading(true);

      try {
        const res = await axios.get("/formateurs/skill-matrix/module_skills");
        console.log(res);

        setModules(res.data.modules.modules_items);
        setSkills(res.data.modules.modules_items.skills);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModules();
  }, []);

  const addSkillToModule = async (idModule, skillName) => {
    const res = await axios.post(
      `/formateurs/skill-matrix/module_skills/${idModule}/skills`,
      {
        name: skillName,
      }
    );

    if (res.data.status === 200) {
      setModules((prev) =>
        prev.map((module) => {
          if (module.idModule === idModule) {
            const newSkill = {
              id: res.data.data.id,
              name: res.data.data.name,
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
      toastr.success(res.data.message);
    } else {
      console.log(res);
      toastr.error(res.message);
    }
  };

  const udpateSkillToModule = async (idModule, idSkill, skillName) => {
    try {
      const res = await axios.put(
        `/formateurs/skill-matrix/module_skills/${idModule}/skills/${idSkill}/update`,
        {
          name: skillName,
        }
      );
      console.log();

      if (res.data.status === 200) {
        setModules((prevModules) =>
          prevModules.map((module) => {
            if (module.idModule === idModule) {
              return {
                ...module,
                skills: module.skills.map((skill) =>
                  skill.id === idSkill
                    ? { ...skill, name: res.data.skill?.name || skillName }
                    : skill
                ),
              };
            }
            return module;
          })
        );

        toastr.success(res.data.message || "Skill mise à jour avec succès !");
      } else {
        toastr.error(res.data.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.log(error);
      toastr.error("Une erreur est survenue");
    }
  };

  const deleteSkillInModule = async (idModule, idSkill) => {
    try {
      const res = await axios.delete(
        `/formateurs/skill-matrix/module_skills/${idModule}/skills/${idSkill}`
      );
      if (res.data.status === 200) {
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
        toastr.success(res.data.message);
      } else {
        toastr.error("On ne peut pas supprimer cette skill");
      }
    } catch (error) {
      console.log(error);
      toastr.error("On ne peut pas supprimer cette skill");
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
