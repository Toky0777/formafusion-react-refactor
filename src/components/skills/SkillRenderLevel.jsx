import { skillLevels } from "../../utils/skillColor";

export default function SkillRenderLevel() {
  return (
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        {skillLevels.map((s) => (
          <div className="flex flex-col items-center text-sm" key={s.label}>
            <h1 className="mb-2">{s.label}</h1>
            <div className="flex text-sm">
              {Object.entries(s.range).map(([key, value]) => (
                <p className={`px-2  ${value}`} key={key}>
                  {key}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
