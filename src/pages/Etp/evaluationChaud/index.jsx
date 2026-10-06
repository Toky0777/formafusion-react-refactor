import { BarChart3, Clock, Eye, Tag, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "../../../config/axios";
import { dateFormat } from "../../../utils/global";
import DrawerParent from "../../../components/drawer/drawer-parent";
import { IMAGE_URL } from "../../../config/env";

export default function EvaluationChaud() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showDrawerLearners, setShowDrawerLearners] = useState(false);
  const [learners, setLearners] = useState([]);
  const [generalAppreciate, setGeneralAppreciate] = useState(null);
  const [isLoadingLearners, setIsLoadingLearners] = useState(false);

  const imgUrl = IMAGE_URL + "/img/employes";

  const handleClickDrawer = async (idProjet) => {
    setShowDrawerLearners(true);
    setIsLoadingLearners(true);
    try {
      const res = await axios.get(`/etp/evalChaud/${idProjet}`);
      setLearners(res.data.learners);
      setGeneralAppreciate(res.data.percentage_evaluated);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingLearners(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const res = await axios.get(`/etp/evalChaud`);

        setProjects(res.data.projects);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 mb-8 bg-white shadow-sm rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 shadow-md bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-700">
              Évaluations à chaud
            </h1>
            <p className="text-sm text-gray-500">
              Suivi et export des évaluations à chaud
            </p>
          </div>
        </div>
      </div>

      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <h1> Chargement... </h1>
          </div>
        ) : projects?.length === 0 ? (
          <div> aucun </div>
        ) : (
          <div className="mx-auto p-5 max-w-7xl">
            {projects?.map((p) => (
              <div
                key={p.idProjet}
                className="group bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0 grid grid-cols-4 gap-4 items-center">
                      <div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer transition-all hover:scale-105 hover:text-blue-600">
                          <h3 className="font-semibold text-gray-900 truncate text-sm">
                            {p?.moduleName}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Tag className="w-3 h-3" />
                          <span className="truncate">
                            {p?.project_reference}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <div className="flex flex-col">
                            <span>{dateFormat(p?.dateDebut)}</span>
                            <span>{dateFormat(p?.dateFin)}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Users className="w-3 h-3 text-gray-400" />
                          <span>
                            {p.evaluated_count}/{p.totalLearners}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleClickDrawer(p.idProjet)}
                          className="flex items-center justify-center gap-2 text-sm text-blue-600 p-2 bg-blue-100 rounded-lg"
                        >
                          <Eye size={16} />
                          Voir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <DrawerParent
          title="Liste des apprenants"
          onClose={() => setShowDrawerLearners(false)}
          isOpen={showDrawerLearners}
        >
          <div className="p-2 h-full flex flex-col">
            {isLoadingLearners ? (
              <div className="text-center py-6 text-gray-500">
                Chargement...
              </div>
            ) : learners.length === 0 ? (
              <div className="text-center py-6 text-gray-400">
                Aucun apprenant
              </div>
            ) : (
              <div className="overflow-y-auto flex-1 space-y-3">
                <div className="flex justify-between items-center mb-5">
                  <h1 className="font-semibold text-xl">
                    {" "}
                    Appréciation générale{" "}
                  </h1>
                  <span> {generalAppreciate}% </span>
                </div>
                <div>
                  {learners.map((l) => (
                    <div
                      key={l.id}
                      className="flex items-center gap-4 p-4 bg-white rounded-2xl mb-2   border border-gray-200"
                    >
                      <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shadow-sm flex-shrink-0">
                        {l.photo ? (
                          <img
                            src={`${imgUrl}/${l.photo}`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="text-gray-400 w-7 h-7" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h1 className="text-base font-semibold text-gray-700">
                          {l.name} {l.first_name}
                        </h1>

                        <p className="text-sm text-gray-500">
                          <span className="text-indigo-600  text-sm">
                            {l.note > 0 ? (
                              <span> {l.note}/5 </span>
                            ) : (
                              <span>Non noté</span>
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DrawerParent>
      </div>
    </div>
  );
}
