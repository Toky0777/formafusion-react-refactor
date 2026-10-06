import {
  MapPin,
  Clock,
  Building,
  Edit3,
  Eye,
  Users,
  TrendingUp,
  Tag,
} from "lucide-react";
import { Link } from "react-router-dom";

export const ProjectCard = ({ project }) => {
  const getRatingColor = (rating) => {
    const r = Number(rating) || 0;
    if (r >= 4.5) return "text-emerald-600";
    if (r >= 3.5) return "text-blue-600";
    if (r >= 2.5) return "text-orange-500";
    return "text-red-500";
  };

  const getRatingBgColor = (rating) => {
    const r = Number(rating) || 0;
    if (r >= 4.5) return "bg-emerald-50";
    if (r >= 3.5) return "bg-blue-50";
    if (r >= 2.5) return "bg-orange-50";
    return "bg-red-50";
  };

  const renderStars = (rating) => {
    const r = Number(rating) || 0;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            className={`w-3.5 h-3.5 transition-colors ${
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

  const evaluationProgress = project.percentage_evaluated;
  const isCompleted = evaluationProgress === 100;

  return (
    <div
      className="group relative bg-white rounded-xl border border-gray-200 shadow-sm
                 hover:shadow-lg hover:border-gray-300 transition-all duration-300
                 overflow-hidden"
    >
      {/* Status indicator bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 transition-all`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-gray-700 transition-colors">
                {project?.module}
              </h3>
            </div>

            <div className="flex flex-col gap-1.5 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{project?.project_reference}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="font-medium truncate">
                  {project?.entreprise}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{project?.city}</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <Link
            to={`/cfp/evaluation_a_chaud/detail/${project.id}`}
            title={
              isCompleted
                ? "Voir les évaluations complétées"
                : `${evaluationProgress}% d'évaluation - Cliquez pour évaluer`
            }
            className={`flex items-center gap-1 px-2 py-1.5 text-sm font-medium transition-all duration-200 rounded-lg
                        ${
                          isCompleted
                            ? "text-green-600 bg-green-50 hover:bg-green-100"
                            : "text-orange-600 bg-orange-50 hover:bg-orange-100"
                        }`}
          >
            {isCompleted ? (
              <>
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Voir</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Évaluer</span>
              </>
            )}
          </Link>
        </div>

        {/* Date info */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>
            {project?.begin_date_converted} - {project?.end_date_converted}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Progress stat */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">
                Progression
              </span>
              <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-2xl font-bold ${
                  isCompleted ? "text-emerald-600" : "text-orange-600"
                }`}
              >
                {evaluationProgress}
              </span>
              <span className="text-sm text-gray-500">%</span>
            </div>
            {/* Progress bar */}
            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isCompleted ? "bg-emerald-500" : "bg-orange-500"
                }`}
                style={{ width: `${evaluationProgress}%` }}
              />
            </div>
          </div>

          {/* Rating stat */}
          <div
            className={`rounded-lg p-3 border transition-colors ${getRatingBgColor(
              project.note
            )}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">
                Note moyenne
              </span>
              {renderStars(project.note)}
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-2xl font-bold ${getRatingColor(project.note)}`}
              >
                {project.note?.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">/5</span>
            </div>
          </div>
        </div>

        {/* Learners info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  {project.learners_evaluated}
                </span>
                <span className="text-gray-400 mx-1">/</span>
                <span>{project.total_learners}</span>
              </span>
              <span className="text-gray-500">apprenants</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Terminé
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                <svg
                  className="w-3 h-3 animate-pulse"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                En cours
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
