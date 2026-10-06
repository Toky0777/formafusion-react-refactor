import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import LoadingSpinner from "../../ui/loading-spinner";
import { EmptyState } from "../../ui/EmptyState";
import { searchService } from "../../../services/searchService";
import { ErrorDisplay } from "../../ui/error-display";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { formatMontant } from "../../../utils/formatMontant";

const Folder = ({ searchQuery }) => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currency = "XOF";
  const formatPeriode = (dateMin, dateMax) => {
    if (!dateMin || !dateMax) return "—";
    return `${new Date(dateMin).toLocaleDateString("fr-FR")} - ${new Date(
      dateMax
    ).toLocaleDateString("fr-FR")}`;
  };

  const fetchFolder = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await searchService.getFolder(searchQuery);
      console.log(response);

      setFolders(response);
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
  const statusLabels = {
    "En préparation": "En préparation",
    "En cours": "En cours",
    Planifié: "Planifié",
    Terminé: "Terminé",
    Annulé: "Annulé",
    Reporté: "Reporté",
    Cloturé: "Cloturé",
  };

  useEffect(() => {
    fetchFolder();
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
        onRetry={fetchFolder}
      />
    );
  }

  if (!folders || folders.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-12 h-12 text-gray-400" />}
        title="Aucun referent trouvé"
        description="Il n'y a actuellement aucun referent correspondant à votre recherche."
      />
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-700"
            >
              Dossier
            </th>
            <th
              scope="col"
              className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-700"
            >
              Type
            </th>
            <th
              scope="col"
              className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-700"
            >
              Modules
            </th>
            <th
              scope="col"
              className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-700"
            >
              Ville
            </th>
            <th
              scope="col"
              className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-700"
            >
              Période
            </th>
            <th
              scope="col"
              className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-500"
            >
              Statut
            </th>
            <th
              scope="col"
              className="w-40 max-w-[10rem] truncate px-2 py-2 text-left text-xs font-medium uppercase text-gray-500"
            >
              Montant
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {folders.map((folder, index) => (
            <tr
              key={folder.idDossier}
              onClick={() =>
                navigate(`/cfp/dossier/detail/${folder.idDossier}`)
              }
              className="transition-colors cursor-pointer hover:bg-gray-50"
            >
              <td className="w-40 max-w-[10rem] truncate overflow-hidden whitespace-nowrap px-2 py-2 text-sm text-gray-700">
                <div className="flex items-center">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-purple-600 bg-purple-100 rounded-full">
                    <FontAwesomeIcon icon={faFolder} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {folder.nomDossier || "—"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {folder.entreprises || "—"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="max-w-[200px] truncate whitespace-nowrap overflow-hidden px-2 py-2 text-sm text-gray-700">
                {folder.typeProjets || "—"}
              </td>
              <td
                className="max-w-[200px] truncate whitespace-nowrap overflow-hidden px-2 py-2 text-sm"
                title={
                  Array.isArray(folder.modules)
                    ? folder.modules.join(", ")
                    : "—"
                }
              >
                {folder.modules || "—"}
              </td>
              <td
                className="w-40 max-w-[10rem] truncate overflow-hidden whitespace-nowrap px-2 py-2 text-sm text-gray-700"
                title={
                  Array.isArray(folder.villes) ? folder.villes.join(", ") : "—"
                }
              >
                {folder.villes || "—"}
              </td>
              <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                {formatPeriode(folder.dates.dateDebut, folder.dates.dateFin)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    folder.status === "Terminé" || folder.status === "Cloturé"
                      ? "bg-green-100 text-green-800"
                      : folder.status === "Annulé"
                      ? "bg-red-100 text-red-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {statusLabels[folder.status] || "En préparation"}
                </span>
              </td>
              <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                {formatMontant(folder.prix, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Folder;
