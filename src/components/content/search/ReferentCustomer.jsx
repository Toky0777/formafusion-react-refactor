import { useEffect, useState } from "react";
import { Users, Mail, Phone, Building2 } from "lucide-react";
import LoadingSpinner from "../../ui/loading-spinner";
import { EmptyState } from "../../ui/EmptyState";
import { searchService } from "../../../services/searchService";
import { ErrorDisplay } from "../../ui/error-display";
import { IMAGE_URL } from "../../../config/env";

const ReferentCustomer = ({ searchQuery }) => {
  const [referents, setReferents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = IMAGE_URL + "/img/referents";

  const fetchReferent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await searchService.getReferentCustomer(searchQuery);

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
        <div className="flex flex-col w-full h-full p-4 bg-white shadow-lg rounded-xl hover:shadow-2xl transition-shadow duration-300">
          {/* Première ligne : Photo + Nom / Prénom */}
          <div className="flex items-center gap-4 mb-3">
            {/* Photo */}
            <div className="w-24 h-24 overflow-hidden rounded-full border-2 border-purple-600 bg-gray-100 flex items-center justify-center">
              <img
                src={`${url}/${referent.photo}`}
                alt="avatar"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Nom / Prénom */}
            <div className="flex flex-col justify-center">
              <p className="font-semibold text-lg text-slate-700">
                {referent.name}
              </p>
              <p className="text-gray-500">{referent.firstName}</p>
            </div>
          </div>

          {/* Deuxième ligne : Détails */}
          <div className="flex flex-col gap-1 text-sm mb-3">
            {/* Matricule */}
            <p className="text-gray-700 font-medium">
              MATRICULE :{" "}
              <span className="font-normal">{referent.matricule}</span>
            </p>

            {/* Email */}
            <div className="flex items-center gap-2">
              <Mail className="text-purple-600 w-4 h-4" />
              <span className="text-gray-600">{referent.email}</span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2">
              <Phone className="text-purple-600 w-4 h-4" />
              <span className="text-gray-600">{referent.phone}</span>
            </div>

            {/* Fonction */}
            <div className="flex items-center gap-2">
              <Building2 className="text-purple-600 w-4 h-4" />
              <span className="text-gray-600">{referent.customerName}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReferentCustomer;
