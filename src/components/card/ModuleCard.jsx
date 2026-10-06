import { Award } from "lucide-react";
import { SkillBadge } from "../badge/SkillBadge";
import { AddSkillForm } from "../skills/AddSkillForm";

export const ModuleCard = ({ module, onAddSkill, onRemoveSkill, onUpdate }) => {
  return (
    <div className="relative">
      <div className="absolute -top-5 -right-3 z-10">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400   rounded-full px-3 py-1  ">
          <div className="flex items-center gap-1.5">
            <Award size={16} />
            <span className="text-sm font-semibold ">
              {module?.skills?.length} skill
              {module?.skills?.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-br from-white to-gray-50 p-2">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <h3 className="text-md font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {module?.moduleName || module.module_name}
              </h3>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Skills</h4>
            {module?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {module?.skills?.map((skill) => (
                  <SkillBadge
                    key={skill.id}
                    skill={skill}
                    onRemove={() => onRemoveSkill(module?.idModule, skill.id)}
                    onUpdate={(updatedName) =>
                      onUpdate(module?.idModule, skill.id, updatedName)
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic mb-4 text-sm">
                Aucune skill ajoutée
              </p>
            )}
          </div>

          <AddSkillForm
            onAdd={(skill) => onAddSkill(module?.idModule, skill.name)}
            idModule={module?.idModule}
            skills={module?.skills}
          />
        </div>
      </div>
    </div>
  );
};
