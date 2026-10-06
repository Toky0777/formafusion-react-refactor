import { useState, useEffect } from "react";
import { Users, Mail, Phone, User } from "lucide-react";
import LoadingSpinner from "../../ui/loading-spinner";
import { ErrorDisplay } from "../../ui/error-display";
import { EmptyState } from "../../ui/EmptyState";
import { searchService } from "../../../services/searchService";
import { IMAGE_URL } from "../../../config/env";

const Particular = ({ searchQuery }) => {
  const [particulars, setParticular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const imgUrl = IMAGE_URL + "/img/particuliers";

  const fetchParticular = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await searchService.getParticular(searchQuery);
      setParticular(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération des particulier";
      setError(errorMessage);
      console.error("Error fetching learners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticular();
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
        onRetry={fetchParticular}
      />
    );
  }

  if (!particulars || particulars.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-12 h-12 text-gray-400" />}
        title="Aucun apprenant trouvé"
        description="Il n'y a actuellement aucun particulier correspondant à votre recherche."
      />
    );
  }

  return (
    <div className="p-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {particulars.length} Particulier{particulars.length > 1 ? "s" : ""}{" "}
          trouvé
          {particulars.length > 1 ? "s" : ""}
        </h1>
        <button
          onClick={fetchParticular}
          className="px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
        >
          Actualiser
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
        {particulars.map((particular) => (
          <div className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full group">
            <div className="p-6 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0 flex-1 mr-2">
                  <div className="relative group w-24 h-24 flex-shrink-0">
                    {particular?.photo ? (
                      <img
                        src={`${imgUrl}/${particular.photo}`}
                        alt="Photo apprenant"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200 shadow-sm">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-bold truncate">
                      {" "}
                      {particular?.name}
                    </span>
                    <span className="text-sm text-gray-500 truncate">
                      {" "}
                      {particular?.firstName}{" "}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <p className="text-sm">
                    {particular?.email || "Aucun email disponible"}
                  </p>
                </div>
                <div className="flex items-center text-gray-600 transition-colors">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">
                    {particular?.phone &&
                    particular?.phone.trim() !== "" &&
                    particular?.phone !== "undefined"
                      ? particular?.phone
                      : "Aucun numéro"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Particular;
