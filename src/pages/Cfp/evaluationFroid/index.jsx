import { useState, useEffect } from "react";
import {
  BookOpen,
  Building,
  Clock,
  Eye,
  MapPin,
  Send,
  Tag,
} from "lucide-react";
import axios from "../../../config/axios";
import { dateFormat, formatMonthYear } from "../../../utils/global";
import ProjectDrawer from "../../../components/drawer/customer/ProjectDrawer";
import DetailsProjectMin from "../../../components/drawer/details-project-min";
import DrawerSendEvalFroid from "../../../components/drawer/send-eval-froid";
import Search from "../../../components/search/search";
import { useSearch } from "../../../hooks/cfp/skill/useSearch";

export default function EvaluationsFroids() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataEtp, setDataEtp] = useState([]);
  const [showDrawerEtp, setShowDrawerEtp] = useState(false);
  const [isLoadingDataEtp, setIsLoadingDataEtp] = useState(false);

  const [showDrawerProject, setShowDrawerProject] = useState(false);
  const [dataProject, setDataProject] = useState([]);
  const [isLoadingDataProject, setIsLoadingDataProject] = useState(false);

  const [apprenants, setApprenants] = useState([]);
  const [showApprenants, setShowApprenants] = useState(false);
  const [isLoadingApprenants, setIsLoadingApprenants] = useState(false);

  const { searchTerm, handleChange } = useSearch();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("cfp/evaluations/froids");
        setProjects(res.data.projects);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const groupedProjects = projects.reduce((acc, projet) => {
    const monthKey = new Date(projet.dateDebut).toISOString().slice(0, 7);
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(projet);
    return acc;
  }, {});

  const handleClickEtp = async (idEtp) => {
    setShowDrawerEtp(true);
    setIsLoadingDataEtp(true);
    try {
      const res = await axios.get(`/cfp/etp-drawer/${idEtp}`);
      setDataEtp(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataEtp(false);
    }
  };

  const handleClickProject = async (idProjet) => {
    setShowDrawerProject(true);
    setIsLoadingDataProject(true);
    try {
      const res = await axios.get(`/cfp/projets/${idProjet}/detail`);
      setDataProject(res.data.projet);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataProject(false);
    }
  };

  const handleGetApprenants = async (idProjet) => {
    setShowApprenants(true);
    setIsLoadingApprenants(true);
    try {
      const res = await axios.get(
        `/cfp/evaluations/froids/apprenants/${idProjet}`
      );
      if (res.data.status === 200) {
        setApprenants(res.data.apprenants);
      } else {
        setApprenants([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingApprenants(false);
    }
  };

  const filteredGroupedProjects = Object.entries(groupedProjects).reduce(
    (acc, [monthKey, projets]) => {
      const filtered = projets.filter((p) => {
        const term = searchTerm.toLowerCase();

        return (
          p.module_name.toLowerCase().includes(term) ||
          p.etps?.some((etp) => etp.etp_name?.toLowerCase().includes(term))
        );
      });

      if (filtered.length > 0) acc[monthKey] = filtered;

      return acc;
    },
    {}
  );

  return (
    <div className="px-4 py-6 space-y-10 ">
      <div className="sticky top-0 z-30 px-4 py-3 mb-8 border-b border-gray-200 shadow-sm bg-white/90 backdrop-blur-sm rounded-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-600">
                Évaluations à Froid
              </h1>
              <p className="text-gray-600">
                Gestion et suivi des formations terminées
              </p>
            </div>
          </div>
          <div>
            <Search
              placeholder="Recherche..."
              value={searchTerm}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[60vh] ">
          <h1> Chargement... </h1>
        </div>
      ) : Object.keys(filteredGroupedProjects).length === 0 ? (
        <div className="flex justify-center items-center h-[60vh]">
          <h1 className="font-semibold text-xl"> Aucun projet trouvé </h1>
        </div>
      ) : (
        <div>
          <div>
            {Object.entries(filteredGroupedProjects).map(
              ([monthKey, projets]) => (
                <div key={monthKey} className="mb-8">
                  <h2 className="text-lg font-bold text-indigo-600 mb-3">
                    {formatMonthYear(monthKey)}
                  </h2>

                  {/* Liste des projets du mois */}
                  {projets.map((p) => (
                    <div
                      key={p.idProjet}
                      className="group bg-white rounded-xl shadow-sm border border-gray-200  transition-all duration-200 mb-3"
                    >
                      <div className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-5 flex-1">
                          {/* Module + Ref */}
                          <div className="w-1/3 min-w-0">
                            <h3
                              onClick={() => handleClickProject(p.idProjet)}
                              className="font-semibold text-gray-800 text-sm cursor-pointer truncate hover:text-indigo-600 transition"
                            >
                              {p.module_name}
                            </h3>

                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 truncate">
                              <Tag className="w-3 h-3" />
                              {p.project_reference}
                            </div>
                          </div>

                          {/* Entreprise */}
                          <div className="w-1/4 min-w-0">
                            <div className="flex items-center gap-1 text-sm text-gray-700 truncate">
                              <Building className="w-4 h-4 text-gray-400" />
                              <span className="font-medium truncate">
                                {p.etps?.length > 0
                                  ? p.etps.map((etp) => (
                                      <span
                                        key={etp.idEtp}
                                        onClick={() =>
                                          handleClickEtp(etp.idEtp)
                                        }
                                        className="cursor-pointer hover:text-indigo-600 transition"
                                      >
                                        {etp.etp_name}
                                      </span>
                                    ))
                                  : "Aucune entreprise"}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <MapPin className="w-3 h-3" />
                              {p.ville}
                            </div>
                          </div>

                          {/* Dates */}
                          <div className="w-1/5">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <div className="flex flex-col">
                                <span>{dateFormat(p.dateDebut)}</span>
                                <span>{dateFormat(p.dateFin)}</span>
                              </div>
                            </div>
                          </div>
                          {/* Envoyé ou non */}
                          <div className="w-1/5">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              {p.is_sent ? (
                                <Send className="w-3 h-3 text-green-400" />
                              ) : (
                                <Clock className="w-3 h-3 text-gray-400" />
                              )}
                              <span>{p.is_sent ? "Envoyé" : "Non envoyé"}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleGetApprenants(p.idProjet)}
                          className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition flex items-center gap-1 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          Voir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
          <div>
            {showDrawerEtp && (
              <ProjectDrawer
                isLoading={isLoadingDataEtp}
                data={dataEtp}
                isShow={showDrawerEtp}
                onClose={() => setShowDrawerEtp(false)}
                account="cfp"
              />
            )}
            {showDrawerProject && (
              <DetailsProjectMin
                projectDetails={dataProject}
                isLoading={isLoadingDataProject}
                isShow={showDrawerProject}
                onClose={() => setShowDrawerProject(false)}
              />
            )}

            {showApprenants && (
              <DrawerSendEvalFroid
                isLoading={isLoadingApprenants}
                isOpen={showApprenants}
                data={apprenants}
                onClose={() => setShowApprenants(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
