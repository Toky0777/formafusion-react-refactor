import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import LoadingSpinner from "../../ui/loading-spinner";
import { EmptyState } from "../../ui/EmptyState";
import { searchService } from "../../../services/searchService";
import { ErrorDisplay } from "../../ui/error-display";
import CustomerCard from "../../card/CustomerCard";

const Entreprise = ({ searchQuery }) => {
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEntreprise = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await searchService.getEntreprise(searchQuery);

      setEntreprises(response);
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
    fetchEntreprise();
  }, [searchQuery]);

  const handleDeleteSuccess = (id, isEnterprise) => {
    setEntreprises((prevEtps) =>
      prevEtps.filter((e) =>
        isEnterprise ? e.idEtp !== id : e.idParticulier !== id
      )
    );
  };

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
        onRetry={fetchEntreprise}
      />
    );
  }

  if (!entreprises || entreprises.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-12 h-12 text-gray-400" />}
        title="Aucun projet trouvé"
        description="Il n'y a actuellement aucun apprenant correspondant à votre recherche."
      />
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {entreprises.map((entreprise, index) => (
        <CustomerCard
          code="etp"
          data={entreprise}
          onDelete={() =>
            handleDeleteSuccess(
              entreprise.idEtp || entreprise.idParticulier,
              !!entreprise.idEtp
            )
          }
        />
      ))}
    </div>
  );
};

export default Entreprise;
