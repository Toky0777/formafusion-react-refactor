import { useEffect } from "react";
import { Calendar, Building2, GraduationCap } from "lucide-react";
import { dateFormat } from "../../utils/global";
import { AddSkillForm } from "./AddSkillForm";
import { useParams } from "react-router-dom";
import { useManageSkill } from "../../hooks/cfp/skill/useManageSkill";
import { useSkill } from "../../hooks/cfp/skill/useSkill";

export default function ProjectDetails({ project, skills,refreshData }) {

  const { idProjet } = useParams();
  const {
    addSkillToModule,

  } = useManageSkill();

  const {
    getAllEmployeInProjects,
    getSkillLevelInProject,

  } = useSkill();

  useEffect(() => {
    getAllEmployeInProjects(idProjet);
    getSkillLevelInProject(idProjet);
  }, [idProjet]);
  return (
    <div>
      <div className="rounded-2xl p-6 ">
        {/* Titre + Référence */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-800">
            {project.module_name}
          </h2>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-slate-700">
            <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
            <span>
              Début :{" "}
              <span className="text-gray-500">
                {dateFormat(project.start_date)}
              </span>
            </span>
          </div>
          <div className="flex items-center text-sm text-slate-700">
            <Calendar className="w-4 h-4 mr-2 text-rose-500" />
            <span>
              Fin :{" "}
              <span className="text-gray-500">
                {dateFormat(project.end_date)}
              </span>
            </span>
          </div>
        </div>

        {/* Entreprise & Centre */}
        <div className="grid grid-cols-2 gap-4 mb-2">
          {project.etp_name && (
            <div className="flex items-center text-sm text-slate-700">
              <Building2 className="w-4 h-4 mr-2 text-emerald-500" />
              <span>
                Entreprise :{" "}
                <span className="text-gray-500">{project.etp_name}</span>
              </span>
            </div>
          )}
          {project.cfp_name && (
            <div className="flex items-center text-sm text-slate-700">
              <GraduationCap className="w-4 h-4 mr-2 text-blue-500" />
              <span>
                Centre de formation :{" "}
                <span className="text-gray-500">{project.cfp_name}</span>
              </span>
            </div>
          )}
        </div>
        <AddSkillForm
          onAdd={async (skill) => {
            await addSkillToModule(project?.idModule, skill.name);
            refreshData();
          }}
          idModule={project?.idModule}
          skills={skills}

        />
      </div>
    </div>
  );
}
