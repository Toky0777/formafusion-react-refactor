import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import LoadingSpinner from "../../ui/loading-spinner";
import { ErrorDisplay } from "../../ui/error-display";
import { EmptyState } from "../../ui/EmptyState";
import { searchService } from "../../../services/searchService";
import LearnerCard from "../../card/learner-card-cfp";

const Learner = ({ searchQuery }) => {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLearners = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await searchService.getLearner(searchQuery);
      setLearners(response);
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
    fetchLearners();
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
        onRetry={fetchLearners}
      />
    );
  }

  if (!learners || learners.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-12 h-12 text-gray-400" />}
        title="Aucun apprenant trouvé"
        description="Il n'y a actuellement aucun apprenant correspondant à votre recherche."
      />
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "En cours";
      case "completed":
        return "Terminé";
      case "paused":
        return "En pause";
      default:
        return status;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Débutant":
        return "bg-green-100 text-green-800";
      case "Intermédiaire":
        return "bg-yellow-100 text-yellow-800";
      case "Avancé":
        return "bg-orange-100 text-orange-800";
      case "Expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {learners.length} Apprenant{learners.length > 1 ? "s" : ""} trouvé
          {learners.length > 1 ? "s" : ""}
        </h1>
        <button
          onClick={fetchLearners}
          className="px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
        >
          Actualiser
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-6">
        {learners.map((learner) => (
          <LearnerCard learner={learner} />
        ))}
      </div>
    </div>
  );
};

export default Learner;
