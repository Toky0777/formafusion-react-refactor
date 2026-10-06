import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Calendar, Eye } from "lucide-react";
import {
  dateFormat,
  formatMonthYear,
  getStatusColorClass,
} from "../../../utils/global";
import { AnimatePresence, motion } from "framer-motion";
import axios from "../../../config/axios";
import ProjectDrawer from "../../../components/drawer/customer/ProjectDrawer";

export function AttendanceTrainer() {
  const { getAllData, filteredProjects, loading } = useOutletContext();

  useEffect(() => {
    getAllData();
  }, []);

  const allProjects = filteredProjects?.length > 0 ? filteredProjects : [];

  const groupedProjects = allProjects.reduce((acc, projet) => {
    const monthKey = new Date(projet.dateDebut).toISOString().slice(0, 7);
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(projet);
    return acc;
  }, {});

  const sortedGroups = Object.entries(groupedProjects).sort((a, b) =>
    b[0].localeCompare(a[0])
  );

  const navigate = useNavigate();

  const [showDrawer, setShowDrawer] = useState(false);
  const [dataEtp, setDataEtp] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDataEtp = async (idEtp) => {
    setShowDrawer(true);
    setIsLoading(true);
    try {
      const res = await axios.get(`/cfp/etp-drawer/${idEtp}`);
      setDataEtp(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div>
        {loading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <h1 className="text-gray-400">Chargement...</h1>
          </div>
        ) : sortedGroups?.length === 0 ? (
          <div className="flex justify-center items-center h-[50vh]">
            <h1>Aucun projet trouvé</h1>
          </div>
        ) : (
          <div>
            <AnimatePresence>
              {sortedGroups.map(([monthKey, projects], groupIndex) => (
                <div key={groupIndex}>
                  <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-gray-600" />
                      <h2 className="text-xl font-bold text-gray-800 capitalize">
                        {formatMonthYear(monthKey)}
                      </h2>
                      <span className="bg-gray-200 text-gray-700 text-sm font-medium px-2 py-1 rounded-full">
                        {projects.length} formation
                        {projects.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm bg-white">
                      <thead className="bg-white border-b border-gray-100">
                        <tr className="text-left">
                          <th className="px-6 py-4 text-sm font-semibold text-gray-700 min-w-[250px]">
                            Formation
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-gray-700 min-w-[180px]">
                            Période
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-gray-700 min-w-[180px]">
                            Status
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                            Entreprise
                          </th>

                          <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                            Apprenants
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                            Taux (%)
                          </th>

                          {/* <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                            Formateurs
                          </th> */}

                          <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((projet, index) => (
                          <motion.tr
                            key={projet.idProjet || index}
                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-200 "
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              delay: groupIndex * 0.1 + index * 0.05,
                            }}
                          >
                            <td className="px-6 py-4">{projet.module_name}</td>
                            <td className="px-6 py-4">
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">
                                  {dateFormat(projet.dateDebut)}
                                </div>
                                <div className="text-gray-500">
                                  {dateFormat(projet.dateFin)}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`p-1 rounded-full text-white  ${getStatusColorClass(
                                  projet.project_status
                                )}`}
                              >
                                {projet.project_status}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              {(Array.isArray(projet.entreprises)
                                ? projet.entreprises
                                : [projet.entreprises]
                              ).map((etp) => (
                                <p key={etp?.id}>{etp?.name}</p>
                              ))}
                            </td>

                            <td className="px-6 py-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {projet.nbApprenant.nb_present}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    présent
                                    {projet.nbApprenant.nb_present > 1
                                      ? "s"
                                      : ""}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {projet.nbApprenant.nb_absent}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    absent
                                    {projet.nbApprenant.nb_absent > 1
                                      ? "s"
                                      : ""}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                  <span className="text-sm font-semibold text-gray-900">
                                    {projet.nbApprenant.total_inscrits}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    inscrit
                                    {projet.nbApprenant.total_inscrits > 1
                                      ? "s"
                                      : ""}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {projet.pourcentage.present}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {projet.pourcentage.absent}
                                  </span>
                                </div>
                              </div>
                            </td>
                            {/* <td className="px-6 py-4">
                              {projet.formateurs.length === 0 ? (
                                <div className="text-gray-400">
                                  Aucun formateur
                                </div>
                              ) : (
                                <AvatarGroup
                                  items={projet.formateurs}
                                  type="trainer"
                                />
                              )}
                            </td> */}
                            <td className="px-6 py-4">
                              <Eye
                                onClick={() =>
                                  navigate(`emargement/${projet.idProjet}`)
                                }
                                size={16}
                                className="text-gray-400 cursor-pointer"
                              />
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      {showDrawer && (
        <ProjectDrawer
          account="cfp"
          data={dataEtp}
          onClose={() => setShowDrawer(false)}
          isShow={showDrawer}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
