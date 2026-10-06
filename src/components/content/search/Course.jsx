import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import LoadingSpinner from "../../ui/loading-spinner";
import { EmptyState } from "../../ui/EmptyState";
import { searchService } from "../../../services/searchService";
import { ErrorDisplay } from "../../ui/error-display";
import icons from "../../icons/icone";
import { Link } from "react-router-dom";
import StarRating from "../../ui/StarRating";
import { IMAGE_URL } from "../../../config/env";

const Course = ({ searchQuery }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState({});

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await searchService.getCourse(searchQuery);

      setCourses(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération des apprenants";
      setError(errorMessage);
      console.error("Error fetching learners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [searchQuery]);

  const levelColors = {
    Intermédiaire: "#ECFCCB",
    MasterClass: "#FFE4E6",
    Fondamentaux: "#CCFBF1",
    Avancée: "#DBEAFE",
  };
  const textColors = {
    Intermédiaire: "#3F6253",
    MasterClass: "#9F1276",
    Fondamentaux: "#2388B6",
    Avancée: "#4F40BC",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner text="Chargement des apprenants..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Erreur de chargement"
        message={error}
        onRetry={fetchCourse}
      />
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-12 h-12 text-gray-400" />}
        title="Aucun module trouvé"
        description="Il n'y a actuellement aucun module correspondant à votre recherche."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-6 gap-4 mt-4">
      {courses.map((module) => {
        const qualityScore = module.sumQuality || 0;
        const averageRating = module.testSumQuality?.average || 0;
        const ratingCount = module.testSumQuality?.totalEmployees || 0;

        return (
          <li
            key={module.idModule}
            className="border border-gray-400 rounded-xl"
          >
            <div className="w-full h-40 bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
              {module.image && !imageError[module.id] ? (
                <img
                  src={`${IMAGE_URL}/img/modules/${module.image}`}
                  alt={module.moduleName}
                  className="w-full h-full object-cover rounded-lg"
                  onError={() =>
                    setImageError((prev) => ({
                      ...prev,
                      [module.id]: true,
                    }))
                  }
                  loading="lazy"
                />
              ) : (
                <span className="text-gray-400 text-sm">Illustration</span>
              )}
            </div>

            <span
              className="inline-block font-bold text-xs px-2 rounded-lg"
              style={{
                backgroundColor:
                  levelColors[module.module_level_name] || "#f1f5f9",
                color: textColors[module.module_level_name] || "#334155",
              }}
            >
              {module.level || "Aucun niveau"}
            </span>

            <h2 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 px-2">
              {module.title}
            </h2>

            <div className="flex items-center gap-2 mb-2 p-2 text-gray-500 text-xs sm:text-sm">
              <StarRating rating={averageRating} />
              <p className="text-gray-500">
                {averageRating.toFixed(1)} ({ratingCount} avis)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-600 px-2">
                <div className="flex items-center gap-1">
                  <icons.clock className="w-3 h-3" />
                  <span>
                    {module.dureeJ} jours ({module.dureeH}h)
                  </span>
                </div>
                <span className="font-medium">{parseInt(module.prix)} Ar</span>
              </div>

              <div className="flex justify-between p-2">
                <p className="text-slate-500 inline-flex items-center gap-1 text-xs sm:text-sm">
                  <icons.users /> {module.totalFormed} formé(s)
                </p>
              </div>

              <div className="flex justify-between p-2">
                <p className="text-slate-500 inline-flex items-center gap-1 text-xs sm:text-sm">
                  <icons.bookOpen /> {module.ressourceCount} Support de cours
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 translate-y-2 p-2">
              <Link
                to={`/cfp/catalogue/${module.id}/edit`}
                className="p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                title="Voir les détails"
                state={{ fromStatus: "online" }}
              >
                <icons.eye className="w-4 h-4" />
              </Link>

              <button
                className="p-2 rounded-md text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                title="Mettre en privé"
              >
                <icons.private className="w-4 h-4" />
              </button>

              <button
                className="p-2 rounded-md text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                title="Mettre en préparation"
              >
                <icons.inPreparation className="w-4 h-4" />
              </button>

              <button
                className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                title="Mettre en corbeille"
              >
                <icons.trash className="w-4 h-4" />
              </button>
            </div>
          </li>
        );
      })}
    </div>
  );
};

export default Course;
