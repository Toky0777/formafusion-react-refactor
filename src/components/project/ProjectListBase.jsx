// Liste de projets commune : chaque rôle fournit son composant carte (prop ProjectCard)
import { Calendar, FolderKanban } from "lucide-react";

const ProjectListBase = ({
  ProjectCard,
  groupesTries,
  filteredProjets,
  searchTerm,
  notes,
  onMenuToggle,
  showMenu,
  onActionClick,
  isFiltered 
}) => {
  // Si des filtres sont actifs et qu'il n'y a pas de résultats
  if (isFiltered && filteredProjets.length === 0) {
    return <EmptyState />;
  }

  // Si aucun filtre n'est actif et qu'il n'y a pas de groupes
  if (!isFiltered && groupesTries.length === 0) {
    return <EmptyState />;
  }

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
        // Affichage normal groupé par mois
        groupesTries.map(([mois, projetsDuMois]) => (
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
        ))
      )}
    </div>
  );
};

const EmptyState = ({isFiltered}) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <FolderKanban className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Aucun projet trouvé
    </h3>
  </div>
);

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
    {searchTerm === "" && (
      <div className="w-full flex items-center gap-3 p-4 mb-6 text-2xl font-semibold bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-md">
        <Calendar className="w-7 h-7 text-blue-600" />
        <h1 className="text-gray-700">{mois}</h1>
      </div>
    )}

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

export default ProjectListBase;