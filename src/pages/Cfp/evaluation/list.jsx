import { useState } from "react";
import { MapPin, Clock, Building, Edit3, Eye, Users, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "../../../config/axios";
import ProjectDrawer from "../../../components/drawer/customer/ProjectDrawer";
import DetailsProjectMin from "../../../components/drawer/details-project-min";
import ListApprenantEval from "../../../components/drawer/list-appr-eval";

export const ProjectListItem = ({ project }) => {
  const getRatingColor = (rating) => {
    const r = Number(rating) || 0;
    if (r >= 4.5) return "text-emerald-600";
    if (r >= 3.5) return "text-blue-600";
    if (r >= 2.5) return "text-orange-500";
    return "text-red-500";
  };

  const renderStars = (rating) => {
    const r = Number(rating) || 0;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            className={`w-3 h-3 transition-colors ${
              r >= i
                ? "text-amber-400 fill-amber-400"
                : "text-gray-300 fill-gray-300"
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const [showDrawerEtp, setShowDrawerEtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataEtp, setDataEtp] = useState([]);

  const [showDrawerProject, setShowDrawerProject] = useState(false);
  const [isLoadingDataProject, setIsLoadingDataProject] = useState(false);
  const [dataProject, setDataProject] = useState([]);

  const [showDrawerLearner, setShowDrawerLearner] = useState(false);
  const [isLoadingDataLeaner, setIsLoadingDataLeaner] = useState(false);
  const [dataLearner, setDataLearner] = useState([]);

  const handleClickEtp = async (idEtp) => {
    setShowDrawerEtp(true);
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

  const handleClickLearner = async (idProjet) => {
    setShowDrawerLearner(true);
    setIsLoadingDataLeaner(true);
    try {
      const res = await axios.get(`/cfp/evaluation/projet/${idProjet}`);

      setDataLearner(res.data.entreprises);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataLeaner(false);
    }
  };

  const evaluationProgress = project.percentage_evaluated;
  const isCompleted = evaluationProgress === 100;

  return (
    <div className="group bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
      <div className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center">
            {/* Module + Référence */}
            <div className="col-span-3 min-w-0">
              <div
                onClick={() => handleClickProject(project.id)}
                className=" flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer transition-all duration-200 ease-out hover:scale-105 hover:text-blue-600 "
              >
                <h3 className="font-semibold text-gray-900 truncate text-sm">
                  {project?.module}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Tag className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{project?.project_reference}</span>
              </div>
            </div>

            {/* Entreprise + Ville */}
            <div className="col-span-2 min-w-0">
              <div
                onClick={() => handleClickEtp(project.idEtp)}
                className=" flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer transition-all duration-200 ease-out hover:scale-105 hover:text-blue-600 "
              >
                <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate font-medium">
                  {project?.entreprise}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{project?.city}</span>
              </div>
            </div>

            {/* Dates */}
            <div className="col-span-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span>{project?.begin_date_converted}</span>
                  <span>{project?.end_date_converted}</span>
                </div>
              </div>
            </div>

            {/* Note + Apprenants */}
            <div className="col-span-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {renderStars(project.note)}
                  <span
                    className={`text-sm font-bold ${getRatingColor(
                      project.note
                    )}`}
                  >
                    {project.note?.toFixed(1)}
                  </span>
                </div>
                <div
                  className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer transition-all duration-200 ease-out hover:scale-105 hover:text-blue-600 "
                  onClick={() => handleClickLearner(project.id)}
                >
                  <Users className="w-3 h-3 text-gray-400" />
                  <span>
                    <span className="font-semibold text-gray-900">
                      {project.learners_evaluated}
                    </span>
                    <span className="text-gray-400 mx-0.5">/</span>
                    <span>{project.total_learners}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Progression */}
            <div className="col-span-2">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-bold ${
                      isCompleted ? "text-emerald-600" : "text-orange-600"
                    }`}
                  >
                    {evaluationProgress}%
                  </span>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Terminé
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                      Non terminé
                    </span>
                  )}
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isCompleted ? "bg-emerald-500" : "bg-orange-500"
                    }`}
                    style={{ width: `${evaluationProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bouton Voir / Évaluer */}
            <div className="col-span-1 flex justify-end">
              <Link
                to={`/cfp/evaluation_a_chaud/detail/${project.id}`}
                title={
                  isCompleted
                    ? "Voir les évaluations complétées"
                    : `${evaluationProgress}% d'évaluation - Cliquez pour évaluer`
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-lg whitespace-nowrap ${
                  isCompleted
                    ? "text-green-700 bg-green-50 hover:bg-green-100"
                    : "text-orange-700 bg-orange-50 hover:bg-orange-100"
                }`}
              >
                {isCompleted ? (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Voir</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    <span>Évaluer</span>
                  </>
                )}
              </Link>
            </div>
          </div>
        </div>

        {showDrawerEtp && (
          <ProjectDrawer
            data={dataEtp}
            isLoading={isLoading}
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
        {showDrawerLearner && (
          <ListApprenantEval
            data={dataLearner}
            isLoading={isLoadingDataLeaner}
            isOpen={showDrawerLearner}
            onClose={() => setShowDrawerLearner(false)}
          />
        )}
      </div>
    </div>
  );
};
