import DrawerParent from "./drawer-parent";
import { dateFormat, getStatusColorClass } from "../../utils/global";
import { formatNumber } from "../../utils/objectifs";
import { useAuth } from "../../contexts/AuthContext";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DetailsProjectMin({
  projectDetails,
  isLoading,
  isShow,
  onClose,
}) {
  const { symbol } = useAuth();

  const navigate = useNavigate();
  return (
    <div>
      <DrawerParent title="Detail du projet" isOpen={isShow} onClose={onClose}>
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500">Chargement...</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <figure className="w-24 h-24">
                    <div className="flex items-center justify-center w-full h-full border border-gray-200 shadow-md rounded-xl bg-gradient-to-r from-gray-50 to-gray-100">
                      <span className="px-3 text-lg font-semibold text-center text-gray-700 truncate">
                        {projectDetails.etp_name}
                      </span>
                    </div>
                  </figure>
                </div>
                <div className="flex flex-col justify-start flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="space-y-2 flex-1">
                        <h1 className="text-xl font-semibold text-gray-900">
                          {projectDetails.module_name}
                        </h1>
                      </div>

                      <button
                        onClick={() =>
                          navigate(
                            `/cfp/projet/detail/${projectDetails.idProjet}`
                          )
                        }
                        className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition flex items-center gap-1 text-sm font-medium"
                      >
                        <Eye size={18} />
                        <span className="font-medium text-sm">
                          Voir plus de détails
                        </span>
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Réf :</span>
                        <span className="px-2 py-1 bg-gray-100 rounded-md">
                          {projectDetails.project_reference}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Dossier :</span>
                        <span className="px-2 py-1 bg-gray-100 rounded-md">
                          Non spécifié
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Montant :</span>
                        <span className="px-2 py-1 bg-gray-100 rounded-md">
                          {formatNumber(projectDetails.total_ttc)} {symbol}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-full border border-amber-200/50 shadow-sm">
                      <span className="text-sm font-bold text-transparent bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text">
                        {projectDetails.paiement}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Début :</span>
                      <span className="px-3 py-1 text-gray-800 capitalize bg-white rounded-md shadow-sm">
                        {dateFormat(projectDetails.dateDebut)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Fin :</span>
                      <span className="px-3 py-1 text-gray-800 capitalize bg-white rounded-md shadow-sm">
                        {dateFormat(projectDetails.dateFin)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-4 py-2 text-sm font-medium text-blue-700 rounded-full bg-blue-50">
                      {projectDetails.project_type}
                    </span>
                    <span className="px-4 py-2 text-sm font-medium rounded-full bg-cyan-50 text-cyan-700">
                      {projectDetails.modalite}
                    </span>
                    <span
                      className={`text-white px-4 py-2  rounded-full text-sm ${getStatusColorClass(
                        projectDetails.project_status
                      )}`}
                      title="Le projet de formation est en cours de préparation, avec des détails tels que le programme, les supports de formation, et la logistique en cours de finalisation."
                    >
                      {projectDetails.project_status}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="leading-relaxed text-gray-700 line-clamp-3">
                      {projectDetails.project_description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DrawerParent>
    </div>
  );
}
