import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import CardSkill from "../../../components/card/CardSkill";
import Employe from "../../../components/skills/Employe";
import SkillRenderLevel from "../../../components/skills/SkillRenderLevel";
import ManageButton from "../../../components/button/ManageButton";
import ProjectDetails from "../../../components/skills/ProjectDetails";
import { useSkillFormateur } from "../../../hooks/formateur/skill/useSkillFormateur";
import LoadingSpinner from "../../../components/ui/loading-spinner";

export default function FormateurSkills() {
  const { idProjet } = useParams();
  const {
    getAllEmployeInProjects,
    getSkillLevelInProject,
    emps,
    skillItems,
    skillLevel,
    projectDetails,
    editingCell,
    handleClick,
    handleCancel,
    handleSave,
    handleEditChange,
    getInputDataForCell,
    isSaving,
    isLoading,
  } = useSkillFormateur();

  useEffect(() => {
    getAllEmployeInProjects(idProjet);
    getSkillLevelInProject(idProjet);
  }, [idProjet]);

  const getSkillLevelForEmploye = (idEmploye, idSkill) => {
    return skillLevel?.find(
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
              to="/formateur/skill_matrix/projets"
              className="flex gap-2 text-sm items-center hover:text-blue-500 "
            >
              <ChevronLeft size={20} /> <span>Retour</span>
            </Link>
          </div>
          <div className="flex justify-between items-center mb-20">
            <ProjectDetails project={projectDetails} />
            <SkillRenderLevel />
          </div>

          <div className=" rounded-xl  overflow-x-auto">
            <div>
              <div className="">
                <div className="m-4">
                  <ManageButton
                    editingCell={editingCell}
                    onCancel={handleCancel}
                    onSave={handleSave}
                    isSaving={isSaving}
                  />
                </div>
                <div
                  className="grid gap-0 "
                  style={{
                    gridTemplateColumns: `300px repeat(${skillItems.length}, minmax(120px, 140px))`,
                  }}
                >
                  <div>
                    <span className="font-semibold text-gray-700"></span>
                  </div>
                  {skillItems.map((skill, index) => (
                    <div
                      key={skill.id}
                      className={` flex items-center justify-center  ${
                        index === skillItems.length - 1 ? "border-r-0" : ""
                      }`}
                    >
                      <span className="font-medium text-gray-700 text-center text-sm ">
                        {skill.skill_name}
                      </span>
                    </div>
                  ))}
                </div>

                {emps.map((emp, empIndex) => (
                  <div
                    key={emp.idEmploye}
                    className="grid gap-0"
                    style={{
                      gridTemplateColumns: `300px repeat(${skillItems.length}, minmax(120px, 140px))`,
                    }}
                  >
                    <div className="z-10">
                      <Employe emp={emp} />
                    </div>

                    {/* Skill cards */}
                    {skillItems.map((skill, skillIndex) => {
                      const skillData = getSkillLevelForEmploye(
                        emp.idEmploye,
                        skill.skill_id
                      );

                      const cellInputData = getInputDataForCell(
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
                            handleClick={() =>
                              handleClick(emp, skill, skillData)
                            }
                            skillData={skillData}
                            editingCell={editingCell}
                            inputData={cellInputData}
                            onChange={handleEditChange}
                            isSaving={isSaving}
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
