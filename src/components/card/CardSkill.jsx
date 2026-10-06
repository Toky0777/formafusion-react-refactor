import { getSkillColor } from "../../utils/skillColor";
import InputSkill from "../skills/InputSkill";

export default function CardSkill({
  handleClick,
  skillData,
  editingCell,
  emp,
  skill,
  inputData, // Ceci contient maintenant les données spécifiques à cette cellule
  onChange,
}) {
  const isEditing =
    editingCell?.idEmploye === emp.idEmploye &&
    editingCell?.idSkill === skill.skill_id;

  const handleClickCell = () => {
    handleClick(emp, skill, skillData);
  };

  const handleChange = (name, value) => {
    onChange(name, value, emp.idEmploye, skill.skill_id);
  };

  return (
    <div
      className={`rounded-xl ${getSkillColor(
        skillData?.skill_score_after || skillData?.skill_score_before
      )} items-center p-2 w-24 h-24 cursor-pointer relative flex justify-center items-center`}
      onClick={handleClickCell}
    >
      <div className="w-full h-full relative">
        {isEditing ? (
          <div className="w-full h-full">
            <InputSkill
              name="before"
              value={inputData?.before || skillData?.skill_score_before || 0}
              onChange={(e) => handleChange("before", e.target.value)}
            />

            <div className="flex justify-center items-center h-full">
              <InputSkill
                name="after"
                value={inputData?.after || skillData?.skill_score_after || 0}
                onChange={(e) => handleChange("after", e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-full">
            <div className="absolute top-0 left-0">
              <span className="font-semibold">
                {skillData?.skill_score_before > 0
                  ? skillData?.skill_score_before
                  : ""}
              </span>
            </div>

            <div className="flex justify-center items-center h-full">
              <span className="text-2xl font-bold">
                {skillData?.skill_score_after || skillData?.skill_score_before}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
