import FormationCard from "./FormationCard";
import DateBlock from "./DateBlock";

const FormationsByDate = ({ formationsByDate }) => {
  return (
    <div className="space-y-8">
      {formationsByDate.map((dateGroup) => (
        <div key={dateGroup.date} className="relative">
          <DateBlock dateGroup={dateGroup} />

          {/* Liste des formations pour cette date */}
          <div className="ml-24 space-y-2">
            {dateGroup.formations.map((formation) => (
              <FormationCard key={formation.id} formation={formation} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormationsByDate;
