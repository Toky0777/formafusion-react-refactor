import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import CardSkill from "../../../components/card/CardSkill";
import Employe from "../../../components/skills/Employe";
import SkillRenderLevel from "../../../components/skills/SkillRenderLevel";
import ProjectDetails from "../../../components/skills/ProjectDetails";
import { useSkillEtp } from "../../../hooks/etp/useSkillEtp";
import LoadingSpinner from "../../../components/ui/loading-spinner";

export default function EtpSkills() {
  const { idProjet } = useParams();
  const {
    projetById,
    leanersEtp,
    skillItemsEtp,
    isLoading,
    getSkillLevelInProjectEtp,
    projectEptDetails,
    skillLevelEtp,
  } = useSkillEtp();

  useEffect(() => {
    projetById(idProjet);
    getSkillLevelInProjectEtp(idProjet);
  }, [idProjet]);

  const getSkillLevelForEmploye = (idEmploye, idSkill) => {
    return skillLevelEtp?.find(
      (s) => s.idEmploye === idEmploye && s.id_module_skill === idSkill
    );
  };

  return (
    <div className="min-h-screen">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className="mb-10">
            <Link
              to="/etp/skill_matrix/projets"
              className="flex gap-2 text-sm items-center hover:text-blue-500 "
            >
              <ChevronLeft size={20} /> <span>Retour</span>
            </Link>
          </div>
          <div className="flex justify-between items-center mb-20">
            <ProjectDetails project={projectEptDetails} />
            <div>
              <SkillRenderLevel />
            </div>
          </div>

          <div className=" rounded-xl    overflow-x-auto">
            <div>
              <div className="">
                <div
                  className="grid gap-0 "
                  style={{
                    gridTemplateColumns: `500px repeat(${skillItemsEtp.length}, minmax(120px, 140px))`,
                  }}
                >
                  <div>
                    <span className="font-semibold text-gray-700"></span>
                  </div>
                  {skillItemsEtp.map((skill, index) => (
                    <div
                      key={skill.id}
                      className={` flex items-center justify-center  ${
                        index === skillItemsEtp.length - 1 ? "border-r-0" : ""
                      }`}
                    >
                      <span className="font-medium text-gray-700 text-center text-sm leading-tight">
                        {skill.skill_name}
                      </span>
                    </div>
                  ))}
                </div>

                {leanersEtp.map((emp, empIndex) => (
                  <div
                    key={emp.idEmploye}
                    className="grid gap-0"
                    style={{
                      gridTemplateColumns: `500px repeat(${skillItemsEtp.length}, minmax(120px, 140px))`,
                    }}
                  >
                    <div className=" z-10">
                      <Employe emp={emp} />
                    </div>

                    {/* Skill cards */}
                    {skillItemsEtp.map((skill, skillIndex) => {
                      const skillData = getSkillLevelForEmploye(
                        emp.idEmploye,
                        skill.skill_id
                      );

                      return (
                        <div
                          key={`${emp.idEmploye}-${skill.skill_id}`}
                          className="p-3 flex items-center justify-center"
                        >
                          <CardSkill
                            emp={emp}
                            skill={skill}
                            skillData={skillData}
                            handleClick={() => {}}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
