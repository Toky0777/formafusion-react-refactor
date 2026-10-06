import React from "react";
import { FaBuilding } from "react-icons/fa6";
import { Link } from "react-router-dom";

export const InformationProject = ({ project }) => (
  <div className="flex p-6 mb-8">
    <div className="w-[70%] pr-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <figure className="w-24 h-24">
            {project?.etp_name ? (
              <div className="flex items-center justify-center w-full h-full border border-gray-200 shadow-md rounded-xl bg-gradient-to-r from-gray-50 to-gray-100">
                <span className="px-3 text-lg font-semibold text-center text-gray-700 truncate">
                  {project?.etp_name}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                <FaBuilding className="text-3xl text-purple-500" />
              </div>
            )}
          </figure>
        </div>

        <div className="flex flex-col justify-start flex-1 space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">
              {project?.module_name || "Module non spécifié"}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <span className="font-medium">Réf : BC :</span>
                <Link
                  to={`/cfp/bon-commande/view/${project?.idBc ?? ""}`}
                  className="px-2 py-1 bg-gray-100 rounded-md"
                >
                  {project?.project_reference || "Non spécifiée"}
                </Link>
              </span>
              <span className="flex items-center gap-1">
                <span className="font-medium">Dossier :</span>
                <span className="px-2 py-1 bg-gray-100 rounded-md">
                  {project?.nomDossier || "Non spécifié"}
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-full border border-amber-200/50 shadow-sm">
              <span className="text-sm font-bold text-transparent bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text">
                {note.toFixed(1).replace(".", ",")}
              </span>
              <span className="text-xs text-amber-400">★</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-500">
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">{avis}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 p-4 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Début :</span>
              <span className="px-3 py-1 text-gray-800 capitalize bg-white rounded-md shadow-sm">
                {project?.dateDebut
                  ? new Date(project?.dateDebut).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Non définie"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Fin :</span>
              <span className="px-3 py-1 text-gray-800 capitalize bg-white rounded-md shadow-sm">
                {project?.dateFin
                  ? new Date(project?.dateFin).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Non définie"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-4 py-2 text-sm font-medium text-blue-700 rounded-full bg-blue-50">
              {project?.project_type || "Type non spécifié"}
            </span>
            <span className="px-4 py-2 text-sm font-medium rounded-full bg-cyan-50 text-cyan-700">
              {project?.modalite || "Modalité non spécifiée"}
            </span>
            <span className="px-4 py-2 text-sm text-gray-600 rounded-full bg-gray-50">
              Non renseigné
            </span>
            <span
              className={`px-4 py-2  rounded-full text-sm ${getStatusColor(
                project?.project_status
              )}`}
              title="Le projet de formation est en cours de préparation, avec des détails tels que le programme, les supports de formation, et la logistique en cours de finalisation."
            >
              {project?.project_status || "Statut inconnu"}
            </span>
          </div>

          <div className="mt-4">
            <p className="leading-relaxed text-gray-700 line-clamp-3">
              {project?.project_description || "Aucune description disponible"}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="w-[30%] border-l border-gray-200 pl-6">
      {/* <div className="space-y-4">
        <ConfirmationModal
          title="confirmer!"
          message="Voulez-vous vraiment valider ce projet ?"
          onConfirm={() => validerProjet(id)}
          onCancel={() => setShowConfirmValider(false)}
          show={showConfirmValider}
        />

        <ConfirmationModal
          title="Confirmer !"
          message="Voulez-vous vraiment supprimer cette séance ?"
          show={showConfirmDeleteSeance}
          onCancel={() => setShowConfirmDeleteSeance(false)}
          onConfirm={handleDeleteSeance}
        />

        <ConfirmationModal
          title="Annuler!"
          message="Voulez-vous vraiment annuler ce projet ?"
          onConfirm={() => annulerProjet(id)}
          onCancel={() => setShowConfirmAnnuler(false)}
          show={showConfirmAnnuler}
        />

        <ConfirmationModal
          title="Confirmer la suppression"
          message="Voulez-vous vraiment supprimer ce projet ? Cette action est irréversible."
          onConfirm={() => suprimerProjet(id)}
          onCancel={() => setShowConfirmSuprimer(false)}
          show={showConfirmSuprimer}
        />

        <ConfirmationModal
          title="Confirmer la duplication"
          message="Voulez-vous vraiment dupliquer ce projet ? Cette action est irréversible."
          onConfirm={() => dupliquerProjet(id)}
          onCancel={() => setShowConfirmDupliquer(false)}
          show={showConfirmDupliquer}
        />

        <ConfirmationModal
          title="Reporter!"
          message="Voulez-vous vraiment reporter ce projet ?"
          show={showConfirmReporter}
          onConfirm={() => reporterProjet(id)}
          onCancel={() => setShowConfirmReporter(false)}
        >
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="dateDebutProjetDetail_763"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date de début
                </label>
                <input
                  type="date"
                  id="dateDebutProjetDetail_763"
                  name="dateDebut"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="dateFinProjetDetail_763"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date de fin
                </label>
                <input
                  type="date"
                  id="dateFinProjetDetail_763"
                  name="dateFin"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </ConfirmationModal>

        <ConfirmationModal
          title="Confirmer la cloture"
          message="Voulez-vous vraiment clôturer ce projet ? Cette action est irréversible."
          onConfirm={() => clotureProjet(id)}
          onCancel={() => setShowConfirmCloturer(false)}
          show={showConfirmCloturer}
        />
      </div> */}
    </div>
  </div>
);
