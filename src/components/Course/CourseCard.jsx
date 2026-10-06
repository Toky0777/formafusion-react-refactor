import { MapPin, Clock } from "lucide-react";
import StarRating from "../Common/StarRating";
import { getThemeIcon } from "../../utils/themeUtils";
import { getThemeColors } from "../../utils/styleUtils";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const themeIcon = getThemeIcon(course.theme);
  const IconComponent = themeIcon.icon;
  const themeColors = getThemeColors();

  return (
    <div
      key={course.id}
      className="overflow-hidden transition-all duration-200 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md hover:border-gray-200"
    >
      <div className="flex h-48">
        {/* Icône de la thématique - pleine hauteur */}
        <div
          className={`w-32 ${themeIcon.bg} flex items-center justify-center flex-shrink-0`}
        >
          <IconComponent className={`w-16 h-16 ${themeIcon.color}`} />
        </div>

        {/* Contenu de la formation */}
        <div className="flex flex-col justify-between flex-1 min-w-0 p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="mb-1 text-lg font-semibold text-gray-900 truncate">
                {course.title}
              </h3>
              {/* Sous-titre du centre */}
              <p className="mb-2 text-sm font-medium tracking-wide text-blue-600 uppercase">
                {course.center}
              </p>
              {/* Description courte */}
              <p className="mb-3 text-sm text-gray-600 line-clamp-1">
                {course.description}
              </p>
              {/* Note et étoiles */}
              <div className="mb-3">
                <StarRating
                  rating={course.rating}
                  reviewCount={course.reviewCount}
                  size="sm"
                />
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 ml-4">
              <span className="flex-shrink-0 text-lg text-green-600">
                {course.price}
              </span>
              {/* Lieu de course */}
              <div className="flex items-center text-right">
                <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                <span className="text-base font-medium text-gray-700">
                  {course.location}
                </span>
              </div>
              {/* Durée */}
              <div className="flex items-center text-right">
                <Clock className="w-4 h-4 mr-1 text-green-500" />
                <span className="text-base text-gray-800">
                  {course.duration
                    ? `${course.duration} jour${course.duration > 1 ? "s" : ""}`
                    : "Jour non déterminé"}
                </span>
              </div>

              <Link to={`/cours/detail/${course.id}`}>
                <button className="px-4 py-1 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700">
                  Détails
                </button>
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span
              className={`inline-block text-xs px-2 py-1 rounded-full ${
                themeColors[course.theme] || "bg-gray-100 text-gray-800"
              }`}
            >
              {course.theme}
            </span>
            {/* <span className={`text-xs px-2 py-1 rounded-full ${course.format === 'Présentielle' ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'
                            }`}>
                            {course.format}
                        </span> */}
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                course.level === "Fondamentaux"
                  ? "bg-green-100 text-green-800"
                  : course.level === "Intermédiaire"
                  ? "bg-blue-100 text-blue-800"
                  : course.level === "Avancée"
                  ? "bg-orange-100 text-orange-800"
                  : course.level === "MasterClass"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {course.level}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
