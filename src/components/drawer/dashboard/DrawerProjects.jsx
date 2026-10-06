import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { Eye, Folder, X, Calendar, TrendingUp } from "lucide-react";
import { useDashboardCfp } from "../../../contexts/cfp/DashboardCfpProvider";
import LoadingSpinner from "../../ui/loading-spinner";
import { getStatusColorClass } from "../../../utils/global";

const DrawerProjects = ({
  onClose,
  isOpen,
  currentYear,
  clickedData,
  isLoading,
}) => {
  const { formatNumber } = useDashboardCfp();

  let projects = clickedData?.projects;

  if (projects && typeof projects === "object" && !Array.isArray(projects)) {
    projects = Object.values(projects);
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !onClose) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/30  z-[9994]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[550px] lg:w-[900px] bg-white shadow-2xl z-[9995] flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="relative px-6 py-3 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 shadow-sm">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Liste des projets
                  </h2>
                  <div className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-1.5 rounded-full shadow-sm">
                    <Calendar size={16} className="text-gray-600" />
                    <span className="font-semibold text-gray-700">
                      {clickedData?.month || "Mois"} {currentYear}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="flex items-center space-x-3 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Folder size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">
                        Projets
                      </div>
                      <span className="text-lg font-semibold text-gray-800">
                        {projects?.length || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <TrendingUp size={18} className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">
                        Total CA
                      </div>
                      <span className="text-lg font-semibold text-gray-800">
                        {clickedData?.value
                          ? formatNumber(clickedData.value)
                          : "0"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton fermer */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 rounded-full bg-white border border-gray-200 p-2 transition-all hover:bg-gray-50 hover:scale-105 active:scale-95 shadow-sm"
                aria-label="Fermer"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="overflow-hidden rounded-xl  shadow-sm bg-white">
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="border-b">
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">
                          Module
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">
                          Client
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-gray-700">
                          Montant
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8">
                            <LoadingSpinner />
                          </td>
                        </tr>
                      ) : !projects || projects.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-10 text-gray-500"
                          >
                            <Folder
                              size={48}
                              className="mx-auto mb-3 text-gray-300"
                            />
                            <p>Aucun projet trouvé pour ce mois</p>
                          </td>
                        </tr>
                      ) : (
                        projects.map((project, index) => (
                          <tr
                            key={`${project.idProjet}-${index}`}
                            className="hover:bg-blue-50 transition-colors duration-150"
                          >
                            <td className="px-4 py-3">
                              <div
                                className="max-w-[200px] truncate"
                                title={project.module_name}
                              >
                                {project.module_name}
                              </div>
                            </td>

                            <td className="px-4 py-3">
                              {project.etp_name ? (
                                <div className="flex items-center space-x-2">
                                  <span>{project.etp_name}</span>
                                </div>
                              ) : (
                                <span className="text-gray-400 italic">
                                  N/A
                                </span>
                              )}
                            </td>

                            <td className="px-3 py-1 text-right font-semibold text-gray-900">
                              {formatNumber(project.total_ttc)}
                            </td>
                            <td className="px-4 py-3 text-right  text-gray-900 ">
                              <span
                                className={`text-sm text-white p-1.5 rounded-xl text-sm ${getStatusColorClass(
                                  project.project_status
                                )}`}
                              >
                                {project.project_status}{" "}
                              </span>
                            </td>

                            <td className="px-4 py-3 text-center">
                              <Link
                                to={`/cfp/projet/detail/${
                                  project.idProjet || project.id_projet
                                }`}
                                className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-150"
                                title="Voir les détails"
                              >
                                <Eye size={16} />
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default DrawerProjects;
