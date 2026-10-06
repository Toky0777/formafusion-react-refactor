import { ModuleCard } from "../../../components/card/ModuleCard";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { useTrainerManageSkill } from "../../../hooks/cfp/skill/useTrainerManageSkill";
import { Book } from "lucide-react";

export default function ManageSkillTrainer() {
  const {
    modules,
    addSkillToModule,
    isLoading,
    deleteSkillInModule,
    udpateSkillToModule,
  } = useTrainerManageSkill();

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : modules.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[60vh] text-gray-500">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 bg-gray-100 rounded-full shadow-sm">
              <Book size={40} />
            </div>
            <h1 className="text-xl font-medium">Aucun module trouvé</h1>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2">
          {modules?.map((module, i) => (
            <div className="px-10 mb-10" key={i}>
              <ModuleCard
                module={module}
                onAddSkill={addSkillToModule}
                onRemoveSkill={deleteSkillInModule}
                onUpdate={udpateSkillToModule}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
