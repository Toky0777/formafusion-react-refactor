import {
  Calendar,
  MapPin,
  Users,
  BookOpen,
} from "lucide-react";
import DrawerParent from "../drawer-parent";
import LoadingSpinner from "../../ui/loading-spinner";
import { IMAGE_URL } from "../../../config/env";

function StatusBadge({ status }) {
  const statusColors = {
    Supprimé: "bg-red-100 text-red-800 border-red-200",
    "En cours": "bg-green-100 text-green-800 border-green-200",
    Terminé: "bg-gray-100 text-gray-800 border-gray-200",
    Planifié: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold border ${
        statusColors[status] || statusColors["Planifié"]
      }`}
    >
      {status}
    </span>
  );
}

function ModaliteBadge({ modalite }) {
  const modaliteColors = {
    Présentielle: "bg-purple-100 text-purple-800 border-purple-200",
    Distanciel: "bg-teal-100 text-teal-800 border-teal-200",
    Hybride: "bg-orange-100 text-orange-800 border-orange-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold border ${
        modaliteColors[modalite] || modaliteColors["Présentielle"]
      }`}
    >
      {modalite}
    </span>
  );
}

function ProjetCard({ projet }) {
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const imgUrL = IMAGE_URL + "/img/formateurs/";
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-20 ">
        <div className="absolute top-4 right-4 flex gap-2">
          <StatusBadge status={projet.project_status} />
        </div>
        <div className="absolute bottom-0 left-0 right-0  p-4">
          <h3 className="text-xl font-bold">{projet.module_name}</h3>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold border border-indigo-200">
            {projet.project_type}
          </span>
          <ModaliteBadge modalite={projet.modalite} />
        </div>

        {/* Dates */}
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700">Période</p>
            <p className="text-sm text-gray-600">
              {formatDate(projet.dateDebut)} - {formatDate(projet.dateFin)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
          <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700">
              {projet.salle_name}
            </p>
            <p className="text-sm text-gray-600">
              {projet.salle_quartier}, {projet.ville}
            </p>
          </div>
        </div>

        {projet.formateurs && projet.formateurs.length > 0 && (
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-purple-600" />
              <p className="text-sm font-semibold text-gray-700">
                Formateur{projet.formateurs.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="space-y-2">
              {projet.formateurs.map((formateur, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center overflow-hidden">
                    {formateur.form_photo ? (
                      <img
                        src={`${imgUrL}${formateur.form_photo}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-purple-700 font-bold text-sm">
                        {formateur.form_initial_name ||
                          formateur.form_firstname?.charAt(0) ||
                          "?"}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {formateur.form_firstname}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formateur.form_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DrawerProjetsParticulier({
  isOpen,
  onClose,
  partProjets,
  loading,
}) {
  return (
    <DrawerParent title="Projets" isOpen={isOpen} onClose={onClose}>
      <div className="p-6   min-h-full">
        {loading ? (
          <LoadingSpinner />
        ) : partProjets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <BookOpen className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium">Aucun projet disponible</p>
          </div>
        ) : (
          <div className="space-y-4">
            {partProjets.map((projet, index) => (
              <ProjetCard key={projet.idProjet || index} projet={projet} />
            ))}
          </div>
        )}
      </div>
    </DrawerParent>
  );
}
