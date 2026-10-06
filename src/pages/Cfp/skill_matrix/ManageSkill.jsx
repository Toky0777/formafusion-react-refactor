import { ModuleCard } from "../../../components/card/ModuleCard";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { useManageSkill } from "../../../hooks/cfp/skill/useManageSkill";

export default function ManageSkill() {
  const {
    modules,
    addSkillToModule,
    isLoading,
    deleteSkillInModule,
    udpateSkillToModule,
  } = useManageSkill();

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : modules.length === 0 ? (
        <div>
          <h1>Aucun module</h1>
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
