import { Link } from "react-router-dom";

const CardCentre = ({ route, cfpName, lieu, slogan, nb_projet }) => (
  <Link
    to={route}
    className=" transition-all duration-300 bg-white border border-gray-100 rounded-lg shadow-lg hover:shadow-xl hover:border-purple-200"
  >
    <div className="h-2 bg-gradient-to-r from-fuchsia-700 to-fuchsia-700"></div>
    <div className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{cfpName}</h3>
        <p className="text-base text-gray-500">{lieu}</p>
      </div>
      <p className="mb-4 text-base text-gray-600">{slogan}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{nb_projet} cours</span>
        <span className="text-base font-medium text-purple-600">
          {nb_projet <= 2 ? "Voir le cours" : "Voir les cours"}
        </span>
      </div>
    </div>
  </Link>
);

export default CardCentre;
