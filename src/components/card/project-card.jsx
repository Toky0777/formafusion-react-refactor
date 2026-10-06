// components/ProjectCard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  MapPin,
  Folder,
  Info,
  Calendar,
  CalendarCheck,
  Clock,
  FileText,
  DollarSign,
  CreditCard,
  Undo2,
  DownloadCloud,
} from "lucide-react";
import {
  FaEllipsisVertical,
  FaEye,
  FaCheck,
  FaTrashCan,
  FaCopy,
  FaBoxArchive,
  FaXmark,
  FaCalendarDays,
  FaCircleXmark,
  FaTriangleExclamation,
} from "react-icons/fa6";
import axios from "../../config/axios";
import { toast } from "react-hot-toast";
import { projectService } from "../../services/projectService";
import ApprenantDrawer from "../drawer/project/learner-drawer";
import { AnimatePresence } from "framer-motion";
import { IMAGE_URL } from "../../config/env";

const ProjectCard = ({
  project,
  showMenu,
  onMenuToggle,
  onActionClick,
  setting,
}) => {
  const note = project?.general_note?.[0] || 0;
  const avis = project?.general_note?.[1] || 0;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [learners, setLearners] = useState([]);

  const handlePreview = async (idBc) => {
    try {
      const { data } = await axios.get(
        `/bon-commandes/doc/${idBc}/first-document`
      );
      const documentId = data?.idDocument;
      if (documentId) {
        const response = await axios.get(
          `/bon-commandes/doc/${documentId}/preview`,
          {
            responseType: "blob",
          }
        );

        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");

        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 1000);
      } else {
        toast.error("Aucun document disponible pour cette bon de commande!");
      }
    } catch (error) {
      console.error("Erreur lors de la prévisualisation:", error);
    }
  };

  const handleShowLearner = async (projectId) => {
    try {
      const response = await projectService.getLearnerByProject(projectId);
      setOpenDrawer(true);
      setLearners(response);
    } catch (error) {}
  };

  const ApprenantsSection = ({ project }) => (
    <div className="flex items-center cursor-pointer">
      {project.learners && project.learners.length > 0 ? (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-3 hover:-space-x-2 transition-all duration-300">
            {project.learners.slice(0, 3).map((apprenant, i) =>
              apprenant.photo ? (
                <div
                  key={i}
                  className="relative group transition-transform duration-300 hover:scale-110 hover:z-10"
                  onClick={() => handleShowLearner(project.idProjet)}
                >
                  <img
                    src={`${IMAGE_URL}/img/employes/${apprenant.photo}`}
                    alt="Employé"
                    className="object-cover w-9 h-9 rounded-full ring-2 ring-white shadow-md"
                    title="Apprenant"
                  />
                  <div className="absolute inset-0 rounded-full bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : (
                <div
                  key={i}
                  className="relative group flex items-center justify-center w-9 h-9 font-bold text-xs uppercase rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 ring-2 ring-white text-cyan-700 shadow-md transition-transform duration-300 hover:scale-110 hover:z-10"
                  onClick={() => handleShowLearner(project.idProjet)}
                >
                  {apprenant.name.charAt(0) || "A"}
                  <div className="absolute inset-0 rounded-full bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              )
            )}
          </div>

          {project.learners.length > 3 && (
            <div
              className="flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full h-9 w-9 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ring-2 ring-white"
              onClick={() => handleShowLearner(project.idProjet)}
            >
              +{project.learners.length - 3}
            </div>
          )}

          <div className="relative inline-flex">
            <DownloadCloud
              className="peer w-8 h-8 cursor-pointer"
              onClick={() =>
                handleFileDownload(project.idProjet, project?.module_name)
              }
            />

            <span
              className="
                  absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                  opacity-0 pointer-events-none
                  peer-hover:opacity-100
                  transition-opacity duration-200
                  px-3 py-1 text-sm text-white bg-gray-800
                  rounded-md shadow-lg whitespace-nowrap
                  z-50
                "
            >
              Télécharger la liste des apprenants
            </span>
          </div>
        </div>
      ) : (
        <EmptyState type="apprenant" title="Aucun apprenant assigné" />
      )}
    </div>
  );

  const ParticipantsSection = ({ project, onActionClick }) => (
    <div className="flex items-center justify-between mb-4">
      <ApprenantsSection project={project} />
      {(project.type_project === 1 || project.type_project === 2) && (
        <EntrepriseSection project={project} onActionClick={onActionClick} />
      )}
    </div>
  );

  const EntrepriseSection = ({ project, onActionClick }) => (
    <div
      className="inline-block cursor-pointer"
      onClick={() =>
        onActionClick.handleShowEntreprise(project.entreprises[0].idEtp)
      }
    >
      {project?.entreprises?.length > 0 ? (
        <div
          className="max-w-[180px] px-3 py-1.5 rounded-lg
                      bg-gradient-to-r from-slate-100 to-slate-200 shadow-md"
        >
          <span className="block text-sm font-semibold text-slate-600 truncate">
            {project.entreprises[0].name}
          </span>
        </div>
      ) : (
        <EmptyState type="entreprise" title="Aucune entreprise assignée" />
      )}
    </div>
  );

  const handleFileDownload = async (id, projectName) => {
    const element = document.createElement("a");

    const response = await projectService.getLearnerByProject(id);

    const data = response.map((r) => `${r.name} ${r.firstName || ""}`);

    const file = new Blob([data.join("\n")], {
      type: "text/plain;charset=utf-8",
    });

    const fileName = "Liste des apprenants de " + projectName.toLowerCase();

    element.href = URL.createObjectURL(file);
    element.download = `${fileName}.txt`;
    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);
  };

  const getStatusColor = (status) => {
    const colors = {
      "En préparation":
        "bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 animate-pulse",
      "En cours":
        "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-pulse",
      Terminé:
        "bg-gradient-to-r from-green-400 via-green-500 to-green-600 animate-pulse",
      Planifié:
        "bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 animate-pulse",
      Cloturé:
        "bg-gradient-to-r from-red-800 via-red-700 to-red-900 animate-pulse",
    };
    return colors[status] || "bg-gray-500 animate-pulse";
  };

  const formatStatus = (status) => {
    if (status === "En préparation") return "En prep";
    return status;
  };

  const SubContractorBadge = () => (
    <div className="absolute top-0 right-0 z-0">
      <div className="relative">
        <div className="w-0 h-0 border-t-[80px] border-t-emerald-500 border-l-[80px] border-l-transparent"></div>
        <div className="absolute top-2 right-2 transform rotate-45">
          <div className="flex flex-col items-center gap-0.5">
            <svg
              className="w-4 h-4 text-white drop-shadow-md"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>
            <span className="text-white text-[7px] font-bold whitespace-nowrap drop-shadow-md">
              SOUS-TRAITÉ
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const ProjectHeader = ({ project, handlePreview }) => (
    <>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer line-clamp-2 hover:text-blue-600 transition">
        <BookOpen className="w-4 h-4 text-blue-500" />
        {project?.module_name}
      </h3>

      <p className="italic text-xs text-gray-700">
        {project?.numero_bc ? (
          <span>
            BC:{" "}
            <span
              title={`Bon de commande numéro ${project.numero_bc}`}
              onClick={(e) => {
                e.stopPropagation();
                handlePreview(project?.idBc);
              }}
              className="cursor-pointer hover:text-blue-600 transition underline-offset-4 hover:underline"
            >
              {project.numero_bc}
            </span>
          </span>
        ) : (
          "Aucun bon de commande"
        )}
      </p>

      <p className="italic text-xs text-slate-500"></p>
    </>
  );

  const RatingSection = ({ note, avis, renderStars }) => (
    <div className="flex items-center gap-2 mt-3">
      {renderStars(note)}
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-full border border-amber-200/50 shadow-sm">
        <span className="font-bold text-sm bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
          {note.toFixed(1).replace(".", ",")}
        </span>
        <span className="text-amber-400 text-xs">★</span>
      </div>
      <div className="flex items-center gap-1 text-gray-500 text-sm">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
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
  );

  const ProjectMenu = ({ project, showMenu, onMenuToggle, onActionClick }) => (
    <div className="relative mt-4 flex justify-end col-span-1">
      <button
        onClick={() => onMenuToggle(project.idProjet)}
        className="flex items-center justify-center w-12 h-12 duration-200 rounded-xl hover:bg-gray-100"
      >
        <FaEllipsisVertical className="text-gray-600" />
      </button>

      {showMenu === project.idProjet && (
        <ul className="absolute right-0 top-14 z-20 w-64 rounded-xl bg-white shadow-lg ring-1 ring-slate-200 divide-y divide-slate-100 text-slate-700">
          <li className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Actions
          </li>
          <li>
            <Link
              to={`/cfp/projet/detail/${project.idProjet}`}
              className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 transition rounded-md"
            >
              <FaEye className="text-indigo-500" /> Aperçu
            </Link>
          </li>
          {project.project_statjus == "Supprimé" && (
            <li>
              <button
                onClick={() =>
                  onActionClick.askRestorationConfirmation(project.idProjet)
                }
                className="flex items-center gap-2 px-4 py-2 w-full hover:bg-green-50 transition rounded-md text-green-600"
              >
                <Undo2 /> Restaurer
              </button>
            </li>
          )}
          {project.project_status !== "Supprimé" && (
            <>
              {(project.project_status === "En préparation" ||
                project.project_status === "Annulé" ||
                project.project_status === "Reporté" ||
                project.project_status === "Planifié") && (
                <li>
                  <button
                    onClick={() =>
                      onActionClick.askProgramationConfirmation(
                        project.idProjet
                      )
                    }
                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-green-50 transition rounded-md text-green-600"
                  >
                    <FaCheck /> Valider
                  </button>
                </li>
              )}

              <li>
                <button
                  onClick={() =>
                    onActionClick.askSupressionConfirmation(project.idProjet)
                  }
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-red-50 transition rounded-md text-red-600"
                >
                  <FaTrashCan /> Supprimer
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    onActionClick.askDuplicationConfirmation(project.idProjet)
                  }
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 transition rounded-md text-slate-600"
                >
                  <FaCopy /> Dupliquer
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    onActionClick.askArchiverConfirmation(project.idProjet)
                  }
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 transition rounded-md text-slate-600"
                >
                  <FaBoxArchive /> Archiver
                </button>
              </li>
              <li className="px-4 py-2 mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Statut
              </li>
              {project.project_status !== "Reporté" && (
                <>
                  <li>
                    <button
                      onClick={() =>
                        onActionClick.askReporterConfirmation(project.idProjet)
                      }
                      className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 transition rounded-md text-slate-600"
                    >
                      <FaCalendarDays /> Reporter
                    </button>
                  </li>
                </>
              )}
              {project.project_status !== "Annulé" && (
                <>
                  <li>
                    <button
                      onClick={() =>
                        onActionClick.askAnnulerConfirmation(project.idProjet)
                      }
                      className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 transition rounded-md text-slate-600"
                    >
                      <FaXmark /> Annuler
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        onActionClick.askCloturerConfirmation(project.idProjet)
                      }
                      className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 transition rounded-md text-slate-600"
                    >
                      <FaCircleXmark /> Clôturer
                    </button>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      )}
    </div>
  );

  const ProjectBadges = ({ project, getStatusColor, formatStatus }) => (
    <div className="flex justify-between mt-4 items-center">
      <div className="flex gap-2 flex-wrap">
        <span
          className={`px-3 py-1 rounded-2xl text-sm font-medium transition ${
            project.project_type === "inter"
              ? "text-purple-700 bg-purple-100 hover:bg-purple-200"
              : "text-blue-700 bg-blue-100 hover:bg-blue-200"
          }`}
        >
          {project.project_type}
        </span>

        <span className="px-3 py-1 rounded-2xl text-sm font-medium text-cyan-700 bg-cyan-100 hover:bg-cyan-200 transition">
          {project.modalite}
        </span>

        <span className="px-3 py-1 rounded-2xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition">
          {project.paiement}
        </span>
      </div>

      <span
        className={`px-3 py-1 rounded-2xl text-sm font-medium text-white ${getStatusColor(
          project.project_status
        )} transition`}
      >
        {formatStatus(project.project_status)}
      </span>
    </div>
  );

  const ProjectDetails = ({ project, onActionClick, setting }) => (
    <div className="mt-4">
      <LocationSection project={project} onActionClick={onActionClick} />
      <DossierSection project={project} onActionClick={onActionClick} />
      <DescriptionSection project={project} />
      <MaterialsSection project={project} onActionClick={onActionClick} />
      <ParticipantsSection project={project} onActionClick={onActionClick} />
      <ResourcesSection project={project} onActionClick={onActionClick} />
      <ProjectFooter project={project} setting={setting} />
    </div>
  );

  const LocationSection = ({ project, onActionClick }) => (
    <div
      onClick={() => onActionClick.handleShowLieu(project.idProjet)}
      title="Lieu de formation"
      className="w-full inline-flex items-center gap-2 cursor-pointer hover:text-blue-600 transition mb-2"
    >
      <MapPin className="w-4 h-4 text-gray-400" />
      <p className="line-clamp-1 underline-offset-4 hover:underline">
        {project.salle_name} — {project.ville} ({project.salle_code_postal})
      </p>
    </div>
  );

  const MaterialsSection = ({ project, onActionClick }) => {
    const materials = project?.materials?.material_items ?? [];
    return (
      <div
        onClick={() => onActionClick.handleShowMaterials(project.idProjet)}
        title="Matériels requis"
        className="w-full inline-flex items-center gap-2 cursor-pointer hover:text-purple-600 transition mt-1 mb-4"
      >
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>

        <div className="text-sm text-gray-700 underline-offset-4">
          {materials.length > 0 ? (
            <>
              {materials
                .slice(0, 2)
                .map((m) => `${m.number} ${m.material_name}`)
                .join(", ")}

              {materials.length > 2 && (
                <span className="text-gray-500 ml-1">
                  +{materials.length - 2} autres
                </span>
              )}
            </>
          ) : (
            <span className="text-gray-400 italic">Aucun matériel</span>
          )}
        </div>
      </div>
    );
  };

  const DossierSection = ({ project, onActionClick }) => {
    // Accès direct et sécurisé aux données
    const dossierId = project?.dossier?.[0]?.idDossier;
    const hasDossier = Boolean(dossierId);
    const dossierName = project?.dossier?.[0]?.nomDossier || "Pas de dossier";

    const handleClick = () => {
      if (!dossierId) {
        return;
      }

      // Vérification que la fonction existe
      if (onActionClick?.handleShowDossiers) {
        onActionClick.handleShowDossiers(dossierId);
      } else {
      }
    };

    return (
      <div
        onClick={handleClick}
        title={hasDossier ? "Voir le dossier" : "Aucun dossier assigné"}
        className={`inline-flex items-center gap-2 ${
          hasDossier
            ? "cursor-pointer hover:text-purple-600 transition"
            : "cursor-not-allowed opacity-50"
        } mt-auto`}
      >
        <Folder className="w-4 h-4 text-gray-400" />
        <p
          className={`line-clamp-1 ${
            hasDossier ? "underline-offset-4 hover:underline" : ""
          }`}
        >
          {dossierName}
        </p>
      </div>
    );
  };

  const DescriptionSection = ({ project }) => (
    <div className="flex items-start gap-2 mt-1">
      <Info className="w-4 h-4 text-gray-400 shrink-0 mt-[2px]" />
      <p className="line-clamp-2 text-sm text-gray-600">
        {project.project_description?.trim() || "Pas de description"}
      </p>
    </div>
  );

  const FormateurSection = ({ project, onActionClick }) => (
    <div className="group cursor-pointer">
      {project?.formateurs && project?.formateurs.length > 0 ? (
        <div className="flex -space-x-3">
          {project?.formateurs.map((f, i) => (
            <div
              onClick={() =>
                onActionClick.handleShowFormateurs(
                  f.idFormateur,
                  project.idProjet
                )
              }
              key={i}
              className="relative"
            >
              <img
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-md group-hover:ring-cyan-400 group-hover:scale-110 transition-all duration-300"
                src={`${IMAGE_URL}/img/formateurs/${f?.form_photo}`}
                alt="Formateur"
                title="Formateur"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-white flex items-center justify-center">
                <svg
                  className="w-2 h-2 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-full bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          type="formateur"
          title="Aucun formateur assigné"
          actionText="Cliquez pour en ajouter un"
        />
      )}
    </div>
  );

  const EmptyState = ({ type, title, actionText }) => {
    const getIcon = () => {
      switch (type) {
        case "apprenant":
          return (
            <svg
              className="w-5 h-5 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          );
        case "entreprise":
          return (
            <svg
              className="w-6 h-6 text-amber-400 group-hover/empty:scale-110 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          );
        case "formateur":
          return (
            <svg
              className="w-5 h-5 text-amber-400 group-hover/empty:scale-110 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <div className="relative group/empty" title={title}>
        <div
          className={`relative flex items-center justify-center ${
            type === "entreprise" ? "h-[35px] w-[60px]" : "w-10 h-10"
          } rounded-xl ring-2 ring-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md group-hover/empty:ring-amber-300 group-hover/empty:shadow-lg transition-all duration-300`}
        >
          {getIcon()}
          <div className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-amber-500 rounded-full shadow-lg ring-2 ring-white">
            <FaTriangleExclamation
              className="text-[10px] text-white animate-pulse"
              aria-hidden="true"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/empty:translate-x-full transition-transform duration-700 rounded-xl"></div>
        </div>

        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/empty:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-20 shadow-xl">
          <div className="font-semibold mb-0.5">{title}</div>
          {actionText && (
            <div className="text-[10px] text-gray-300">{actionText}</div>
          )}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  };

  const ResourcesSection = ({ project, onActionClick }) => (
    <div className="flex items-center justify-between mb-4">
      <FormateurSection project={project} onActionClick={onActionClick} />
      <div className="flex items-center gap-5">
        <ResourceItem
          icon={Clock}
          value={project.totalSessionHour}
          label="Hrs"
          color="blue"
          onClick={() => onActionClick.handleShowHeures(project.idProjet)}
          title="Heure"
        />
        <ResourceItem
          icon={CalendarCheck}
          value={project.seanceCount}
          label="Ses"
          color="green"
          onClick={() => onActionClick.handleShowHeures(project.idProjet)}
          title="Séance"
        />
        <ResourceItem
          icon={FileText}
          value={project.nbDocument}
          label="Docs"
          color="purple"
          onClick={() => onActionClick.handleShowDocument(project.idProjet)}
          title="Documents"
        />
      </div>
    </div>
  );

  const ResourceItem = ({
    icon: Icon,
    value,
    label,
    color,
    onClick,
    title,
  }) => {
    const colorClasses = {
      blue: "text-blue-500 hover:text-blue-600",
      green: "text-green-500 hover:text-green-600",
      purple: "text-purple-500 hover:text-purple-600",
    };

    return (
      <div
        className={`flex items-center gap-2 cursor-pointer transition ${colorClasses[color]}`}
        title={title}
        onClick={onClick}
      >
        <Icon className="w-4 h-4" />
        <span>
          {value} <span className="underline text-slate-400">{label}</span>
        </span>
      </div>
    );
  };

  const ProjectFooter = ({ project, setting }) => (
    <div className="grid grid-cols-4 divide-x divide-slate-200 text-sm text-slate-600">
      <DateSection project={project} />
      <PriceSection project={project} setting={setting} />
      <PaymentSection project={project} />
    </div>
  );

  const DateSection = ({ project }) => (
    <div className="grid grid-cols-2 col-span-2 pl-1 gap-2">
      <DateItem
        icon={Calendar}
        dateDebut={project.dateDebut}
        dateFin={project.dateFin}
        color="blue"
      />
    </div>
  );

  const DateItem = ({ icon: Icon, dateDebut, dateFin, color }) => (
    <div className="flex items-center gap-2">
      {Icon && <Icon className={`w-4 h-4 text-${color}-500`} />}
      <div>
        <p className="font-semibold text-slate-700 flex items-center gap-2">
          {dateDebut
            ? new Date(dateDebut).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Non définie"}
          <span className="text-slate-400">→</span>
          {dateFin
            ? new Date(dateFin).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Non définie"}
        </p>
      </div>
    </div>
  );

  const PriceSection = ({ project, setting }) => (
    <div className="pl-3 flex items-center gap-2">
      <DollarSign className="w-4 h-4 text-green-500" />
      <div>
        <h5 className="text-xs text-slate-400">Prix HT</h5>
        <p className="font-bold text-slate-700">
          {project.total_ht}
          {setting?.currency_unit}
        </p>
      </div>
    </div>
  );

  const PaymentSection = ({ project }) => (
    <div className="pl-3 flex items-center gap-2">
      <CreditCard className="w-4 h-4 text-purple-500" />
      {project.invoice?.invoice_number ? (
        <Link
          to={`/cfp/facture/details/${project.invoice?.idInvoice}`}
          title={`Facture numéro ${project.invoice?.invoice_number}`}
          target="_blank"
          className="px-3 py-1 text-xs rounded-xl text-slate-700 hover:text-blue-600 bg-slate-100 cursor-pointer"
        >
          {project.invoice?.invoice_status_name}
        </Link>
      ) : (
        <span className="px-3 py-1 text-xs rounded-xl text-slate-700 bg-slate-100">
          Non envoyé
        </span>
      )}
    </div>
  );

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return <div className=""></div>;
  };

  return (
    <>
      <div className="relative w-full p-5 rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
        {project?.idSubContractor && <SubContractorBadge />}

        <div className="grid grid-cols-6">
          <div className="col-span-5">
            <ProjectHeader project={project} handlePreview={handlePreview} />
            <RatingSection note={note} avis={avis} renderStars={renderStars} />
          </div>
          <ProjectMenu
            project={project}
            showMenu={showMenu}
            onMenuToggle={onMenuToggle}
            onActionClick={onActionClick}
          />
        </div>

        <ProjectBadges
          project={project}
          getStatusColor={getStatusColor}
          formatStatus={formatStatus}
        />
        <ProjectDetails
          project={project}
          onActionClick={onActionClick}
          setting={setting}
        />
      </div>

      <AnimatePresence>
        {openDrawer && (
          <ApprenantDrawer
            data={learners}
            onClose={() => setOpenDrawer(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectCard;
