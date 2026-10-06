import { Link } from "react-router-dom";

const CardProgramme = ({
  route,
  module_name,
  cfp_name,
  description,
  dateDebut,
  nb_module_ressources,
}) => (
  <Link
    to={route}
    className="block overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-lg hover:shadow-xl"
  >
    <div className="h-2 bg-gradient-to-r from-fuchsia-700 to-fuchsia-700"></div>
    <div className="p-5 ">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {module_name}
        </h3>
        <span className="px-2 py-1 ml-2 text-xs font-medium text-purple-700 rounded-full whitespace-nowrap bg-[rgba(160,90,160,0.6)]/20">
          {cfp_name}
        </span>
      </div>
      <p className="mb-4 text-gray-600 line-clamp-2">{description}</p>
      <div className="flex flex-wrap gap-y-2">
        <div className="flex items-center w-full text-xs text-gray-500 sm:w-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1 lucide lucide-file-text"
          >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
            <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
            <path d="M10 9H8"></path>
            <path d="M16 13H8"></path>
            <path d="M16 17H8"></path>
          </svg>
          <span>{nb_module_ressources} documents</span>
        </div>
        <div className="flex items-center w-full text-xs text-gray-500 sm:w-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1 lucide lucide-calendar"
          >
            <path d="M8 2v4"></path>
            <path d="M16 2v4"></path>
            <rect width="18" height="18" x="3" y="4" rx="2">
              {" "}
            </rect>
            <path d="M3 10h18"></path>
          </svg>
          <span>{dateDebut}</span>
        </div>
      </div>
    </div>
  </Link>
);

export default CardProgramme;
