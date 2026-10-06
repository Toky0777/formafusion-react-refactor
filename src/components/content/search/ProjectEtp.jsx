import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { CardProject } from "../../card/CardProject";
import LoadingSpinner from "../../ui/loading-spinner";
import { EmptyState } from "../../ui/EmptyState";
import { searchService } from "../../../services/searchService";
import { ErrorDisplay } from "../../ui/error-display";

const ProjectEtp = ({ searchQuery }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await searchService.getProjectEtp(searchQuery);

      setProjects(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération des apprenants";
      setError(errorMessage);
      console.error("Error fetching learners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner text="Chargement des apprenants..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Erreur de chargement"
        message={error}
        onRetry={fetchProjects}
      />
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-12 h-12 text-gray-400" />}
        title="Aucun projet trouvé"
        description="Il n'y a actuellement aucun apprenant correspondant à votre recherche."
      />
    );
  }

  return (
    <div className="grid grid-cols-3 3xl:grid-cols-5 gap-3">
      {projects.map((project, index) => (
        <CardProject key={index} projet={project} />
      ))}
    </div>
  );
};

export default ProjectEtp;
