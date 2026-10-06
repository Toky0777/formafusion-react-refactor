import { MapPin, PhoneCall, Building2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import StarRating from "../Common/StarRating";
import { getThemeIcon } from "../../utils/themeUtils";
import { getThemeColors } from "../../utils/styleUtils";

const CenterCard = ({ center }) => {
  const themeIcon = getThemeIcon(center.themes?.[0]?.name) || {
    bg: "bg-gray-100",
    icon: Building2,
  };
  const IconComponent = themeIcon.icon || Building2;
  const themeColors = getThemeColors();

  return (
    <div
      key={center.id}
      className="overflow-hidden transition-all duration-200 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md hover:border-gray-200"
    >
      <div className="flex h-48">
        {/* Left Icon / Image Block */}
        <div
          className={`w-32 ${themeIcon.bg} flex items-center justify-center flex-shrink-0`}
        >
          {center.image ? (
            <img
              src={center.image}
              alt={center.name || "Centre de formation"}
              className="object-contain h-16"
            />
          ) : (
            <IconComponent
              className="w-16 h-16 text-white"
              aria-label="Icône de centre"
            />
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col justify-between flex-1 min-w-0 p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="mb-1 text-lg font-semibold text-gray-900 truncate">
                {center.name}
              </h3>
              <p className="mb-3 text-sm text-gray-600 line-clamp-1">
                {center.description}
              </p>

              <StarRating
                rating={center.rating}
                reviewCount={center.reviewCount}
                size="sm"
              />
            </div>

            {/* Right Info Column */}
            <div className="flex flex-col items-end gap-2 text-right">
              <span className="text-lg text-green-600">{center.price}</span>

              <div className="flex items-center justify-end text-sm text-gray-700">
                <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                <span>{center.location}</span>
              </div>

              <div className="flex items-center justify-end text-sm text-gray-800">
                <PhoneCall className="w-4 h-4 mr-1 text-green-500" />
                <span>{center.phone}</span>
              </div>

              <div className="flex items-center justify-end text-sm text-gray-800">
                <Mail className="w-4 h-4 mr-1 text-purple-500" />
                <span>{center.email}</span>
              </div>

              <Link to={`/cfp/detail/${center.id}`}>
                <button className="px-4 py-1 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700">
                  Détails
                </button>
              </Link>
            </div>
          </div>

          {/* Themes */}
          <div className="flex flex-wrap items-center gap-2">
            {center.themes?.map((theme) => (
              <span
                key={theme.id}
                className={`text-xs px-2 py-1 rounded-full ${
                  themeColors[theme.name] || themeColors.default
                }`}
              >
                {theme.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterCard;
