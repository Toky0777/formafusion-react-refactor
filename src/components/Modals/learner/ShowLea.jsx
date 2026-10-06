import { useState, useEffect } from "react";
import axios from "../../../config/axios";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingSpinner from "../../ui/loading-spinner";
import { Link } from "react-router-dom";
import T from "../../translate/AutoTranslator";
import { IMAGE_URL } from "../../../config/env";

function ShowEmpl({ onClose, idEmploye }) {
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState({
    future: [],
    progress: [],
    finished: [],
    fenced: [],
  });

  useEffect(() => {
    if (!idEmploye) return;
    const fetchDataEmploye = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/cfp/etp-drawers/apprenant/${idEmploye}`);
        setEmploye(res.data.user);
        setProjects({
          future: res.data.projects_future || [],
          progress: res.data.projects_in_progress || [],
          finished: res.data.projects_finished || [],
          fenced: res.data.projects_fenced || [],
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDataEmploye();
  }, [idEmploye]);

  const ProjectTable = ({ title, color, items }) => {
    if (!items.length) return null;
    return (
      <div className="mt-4">
        <span
          className="text-md rounded-xl py-1 px-3 text-white font-semibold shadow-sm"
          style={{ backgroundColor: color }}
        >
          <T>{title}</T>
        </span>
        <div className="mt-2 overflow-x-auto rounded-lg shadow border border-gray-200">
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">
                  <T>Cours</T>
                </th>
                <th className="px-4 py-3">
                  <T>Ref</T>
                </th>
                <th className="px-4 py-3">
                  <T>Début - Fin</T>
                </th>
                <th className="px-4 py-3">
                  <T>Détail</T>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((project, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{project.module_name || "N/A"}</td>
                  <td className="px-4 py-2">{project.reference || "N/A"}</td>
                  <td className="px-4 py-2">
                    {project.date_debut
                      ? `${project.date_debut} - ${project.date_fin}`
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    <Link to={`/cfp/projet/detail/${project.id_projet}`}>
                      <i className="fa-solid fa-eye opacity-50"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {idEmploye && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-[9994]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-[350px] lg:w-[900px] bg-white shadow-xl z-[9995] p-5 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {/* Bouton X */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-2 hover:scale-105 transition"
              aria-label="Fermer"
            >
              <X size={24} />
            </button>

            <p className="text-xl font-semibold text-gray-900 mb-4">
              {" "}
              <T>Employé</T>{" "}
            </p>

            {loading ? (
              <div>
                {" "}
                <LoadingSpinner />{" "}
              </div>
            ) : (
              <div>
                {employe && (
                  <div className="flex items-center mb-6">
                    <div className="flex-shrink-0">
                      {employe.photo ? (
                        <img
                          src={`${IMAGE_URL}/img/employes/${employe.photo}`}
                          alt="photo"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-2xl">
                          {employe.name?.charAt(0) || "E"}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        <i className="fa-solid fa-user text-sm"></i>{" "}
                        {employe.name} {employe.firstName} (
                        {employe.fonction || <T>Non spécifié</T>})
                      </p>
                      <p className="text-sm text-gray-500">
                        <i className="fa-solid fa-envelope text-sm"></i>{" "}
                        {employe.email || <T>Non spécifié</T>}
                      </p>
                      <p className="text-sm text-gray-500">
                        <i className="fa-solid fa-phone text-sm"></i>{" "}
                        {employe.phone || <T>Non spécifié</T>}
                      </p>
                    </div>
                  </div>
                )}
                <ProjectTable
                  title="À venir"
                  color="#3B82F6"
                  items={projects.future}
                />
                <ProjectTable
                  title="En cours"
                  color="#2563EB"
                  items={projects.progress}
                />
                <ProjectTable
                  title="Terminée"
                  color="#10B981"
                  items={projects.finished}
                />
                <ProjectTable
                  title="Clôturé"
                  color="#4B5563"
                  items={projects.fenced}
                />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ShowEmpl;
