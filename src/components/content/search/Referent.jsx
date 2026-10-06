import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import LoadingSpinner from "../../ui/loading-spinner";
import { EmptyState } from "../../ui/EmptyState";
import { searchService } from "../../../services/searchService";
import { ErrorDisplay } from "../../ui/error-display";
import CardReferent from "../../../pages/Cfp/referent/card-referent";

const Referent = ({ searchQuery }) => {
  const [referents, setReferents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReferent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await searchService.getReferent(searchQuery);

      setReferents(response);
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
    fetchReferent();
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
        onRetry={fetchReferent}
      />
    );
  }

  if (!referents || referents.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-12 h-12 text-gray-400" />}
        title="Aucun referent trouvé"
        description="Il n'y a actuellement aucun referent correspondant à votre recherche."
      />
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {referents.map((referent, index) => (
        <CardReferent
          key={referent.id}
          referent={referent}
          setReferent={setReferents}
          index={index}
        />
      ))}
    </div>
  );
};

export default Referent;
