// components/ProjectList.jsx
import { Calendar } from "lucide-react";
import ProjectCard from "../card/project-card";

const ProjectList = ({
  groupesTries,
  filteredProjets,
  searchTerm,
  notes,
  onMenuToggle,
  showMenu,
  onActionClick,
  isFiltered,
}) => {
  return (
    <div className="w-[90%] m-auto mt-4 text-sm pb-100">
      {isFiltered ? (
        // Affichage des projets filtrés (sans groupement par mois)
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjets.map((projet) => (
            <ProjectCard
              key={projet.idProjet}
              project={projet}
              notes={notes}
              showMenu={showMenu}
              onMenuToggle={onMenuToggle}
              onActionClick={onActionClick}
            />
          ))}
        </div>
      ) : (
        groupesTries.map(([mois, projetsDuMois]) => (
          <>
            <ProjectMonthSection
              key={mois}
              mois={mois}
              projetsDuMois={projetsDuMois}
              searchTerm={searchTerm}
              notes={notes}
              onMenuToggle={onMenuToggle}
              showMenu={showMenu}
              onActionClick={onActionClick}
            />
          </>
        ))
      )}
    </div>
  );
};

const ProjectMonthSection = ({
  mois,
  projetsDuMois,
  searchTerm,
  notes,
  onMenuToggle,
  showMenu,
  onActionClick,
}) => (
  <div className="mb-8">
    <div className="w-full flex items-center gap-3 p-4 mb-6 text-2xl font-semibold bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-md">
      <Calendar className="w-7 h-7 text-blue-600" />
      <h1 className="text-gray-700">{mois}</h1>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projetsDuMois.map((projet) => (
        <ProjectCard
          key={projet.idProjet}
          project={projet}
          notes={notes}
          showMenu={showMenu}
          onMenuToggle={onMenuToggle}
          onActionClick={onActionClick}
        />
      ))}
    </div>
  </div>
);

export default ProjectList;
