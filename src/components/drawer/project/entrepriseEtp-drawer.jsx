// components/drawer/project/entreprise-drawer.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  DollarSign,
  Eye,
} from "lucide-react";
import { FaXmark, FaUser, FaEnvelope, FaPhone } from "react-icons/fa6";

export const EntrepriseDrawer = ({
  data,
  onClose,
  activeTab,
  setActiveTab,
}) => {
  const { idEtp, idProjet, etpDetail, tousEtp: drawerTousEtp, etp } = data;  

  console.log("etp", etpDetail);

  // Calculate projects by status for this enterprise
const projectsByStatus = {
    preparation: Array.isArray(etpDetail) ? etpDetail.filter(p => p.project_status === 'En préparation') : [],
    planifie: Array.isArray(etpDetail) ? etpDetail.filter(p => p.project_status === 'Planifié') : [],
    encours: Array.isArray(etpDetail) ? etpDetail.filter(p => p.project_status === 'En cours') : [],
    termine: Array.isArray(etpDetail) ? etpDetail.filter(p => p.project_status === 'Terminé') : [],
    cloture: Array.isArray(etpDetail) ? etpDetail.filter(p => p.project_status === 'Cloturé') : []
};


  const statusConfig = {
    preparation: {
      label: "En préparation",
      color: "bg-yellow-500",
      count: projectsByStatus.preparation.length,
      textColor: "text-yellow-700",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    planifie: {
      label: "Planifié",
      color: "bg-purple-500",
      count: projectsByStatus.planifie.length,
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    encours: {
      label: "En cours",
      color: "bg-blue-500",
      count: projectsByStatus.encours.length,
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    termine: {
      label: "Terminé",
      color: "bg-green-500",
      count: projectsByStatus.termine.length,
      textColor: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    cloture: {
      label: "Clôturé",
      color: "bg-red-600",
      count: projectsByStatus.cloture.length,
      textColor: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  };

  const ProjectCard = ({ project }) => (
    <div className="p-4 transition-shadow duration-200 bg-white border border-gray-200 rounded-xl hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="mb-1 text-lg font-semibold text-gray-800">
            {project.module_name}
          </h4>
          <p className="text-sm text-gray-500">
            Réf: {project.project_reference}
          </p>
        </div>
        <Link to={`/cfp/projet/detail/${project.idProjet}`}>
          <button className="p-2 transition-colors duration-200 rounded-lg hover:bg-gray-100">
            <Eye className="w-4 h-4 text-gray-400" />
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <FaUser className="w-4 h-4" />
          <span>{project.ville}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>{project.project_price_pedagogique?.toLocaleString()} Ar</span>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          {project.dateDebut} → {project.dateFin}
        </p>
      </div>
    </div>
  );

  return (
    <>
      <motion.div
        className="fixed inset-0 backdrop-blur-sm z-400000"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        <div className="absolute top-0 right-0 w-full h-full max-w-4xl overflow-y-auto bg-white shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Détails de l'entreprise
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-10 h-10 transition-colors duration-200 rounded-lg hover:bg-gray-100"
                >
                  <FaXmark className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Company Profile */}
            <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <h3 className="mb-2 text-3xl font-bold">
                    {etpDetail[0]?.etp_name || "Entreprise non spécifiée"}
                  </h3>
                  <p className="text-black">Partenaire formation</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm rounded-xl">
              <h4 className="mb-4 text-xl font-semibold text-gray-800">
                Informations de contact
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                  <FaUser className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaUser className="w-4 h-4" />
                      <span>Contact principal</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaEnvelope className="w-4 h-4" />
                      <span>{etpDetail[0]?.etp_email || "Non spécifié"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaPhone className="w-4 h-4" />
                      <span>{etpDetail[0]?.etp_phone || "Non spécifié"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Tabs */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === key
                        ? `${config.color} text-white shadow-lg`
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span>{config.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        activeTab === key
                          ? "bg-white bg-opacity-20"
                          : "bg-gray-200"
                      }`}
                    >
                      {config.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Content */}
            <div className="min-h-96">
              {Object.entries(projectsByStatus).map(
                ([status, projects]) =>
                  activeTab === status && (
                    <div key={status}>
                      {projects.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                          {projects.map((project, index) => (
                            <ProjectCard
                              key={project.idProjet || index}
                              project={project}
                            />
                          ))}
                        </div>
                      ) : (
                        <div
                          className={`text-center py-12 rounded-xl border-2 border-dashed ${statusConfig[status].borderColor} ${statusConfig[status].bgColor}`}
                        >
                          <div
                            className={`w-16 h-16 mx-auto mb-4 rounded-full ${statusConfig[status].bgColor} flex items-center justify-center`}
                          >
                            <Users
                              className={`w-8 h-8 ${statusConfig[status].textColor}`}
                            />
                          </div>
                          <h3
                            className={`text-lg font-medium ${statusConfig[status].textColor} mb-2`}
                          >
                            Aucun projet{" "}
                            {statusConfig[status].label.toLowerCase()}
                          </h3>
                          <p className="text-gray-500">
                            Il n'y a actuellement aucun projet avec le statut "
                            {statusConfig[status].label}"
                          </p>
                        </div>
                      )}
                    </div>
                  )
              )}
            </div>

            {/* Summary Stats */}
            <div className="p-6 mt-8 bg-gray-50 rounded-xl">
              <h4 className="mb-4 text-lg font-semibold text-gray-800">
                Résumé des projets
              </h4>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {Object.entries(statusConfig).map(([key, config]) => (
                  <div key={key} className="text-center">
                    <div
                      className={`w-12 h-12 mx-auto mb-2 rounded-lg ${config.color} flex items-center justify-center`}
                    >
                      <span className="font-bold text-white">
                        {config.count}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{config.label}</p>
                  </div>
                ))}
              </div>
              <div className="pt-4 mt-4 border-t border-gray-200">
                <p className="text-sm text-center text-gray-600">
                  Total des projets :{" "}
                  <span className="font-semibold">{etpDetail.length}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

