import { useEffect, useState } from "react";
import {
  Users,
  Building,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import LoadingSpinner from "../../ui/loading-spinner";
import { EmptyState } from "../../ui/EmptyState";
import { searchService } from "../../../services/searchService";
import { ErrorDisplay } from "../../ui/error-display";
import { motion, AnimatePresence } from "framer-motion";
import { IMAGE_URL } from "../../../config/env";

const endpoint =
  IMAGE_URL;

const EmployeeCard = ({ employe }) => {
  const etpName =
    employe.etp_name === "--"
      ? employe.etp_name_parent
      : employe.etp_name || employe.customerName || "—";

  const nom = employe.emp_name || employe.name;
  const prenom = employe.emp_firstname || employe.firstName;

  const getInitials = () => {
    if (!nom && !prenom) return "?";
    return `${prenom ? prenom.charAt(0).toUpperCase() : ""}${
      nom ? nom.charAt(0).toUpperCase() : ""
    }`;
  };

  const img =
    employe.emp_photo?.trim() &&
    employe.emp_photo.trim().toLowerCase() !== "photo"
      ? `${endpoint}/img/employes/${employe.emp_photo}`
      : employe.photo?.trim() && employe.photo.trim().toLowerCase() !== "photo"
      ? `${endpoint}/img/employes/${employe.photo}`
      : null;

  const infoComplete = true;

  return (
    <motion.div
      key={employe.idEmploye || employe.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      layout
      className="relative bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 hover:shadow-lg transition-all"
    >
      {/* Badge d'état des informations */}
      <div
        className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
          infoComplete ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}
        title={
          infoComplete ? "Informations complètes" : "Informations incomplètes"
        }
      >
        {infoComplete ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
      </div>

      {/* En-tête avec photo */}
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full border-2 border-white shadow-md overflow-hidden flex items-center justify-center bg-blue-500 text-white font-bold cursor-pointer">
          {img ? (
            <img
              src={img}
              alt={`${prenom} ${nom}`}
              className="w-full h-full object-cover"
            />
          ) : (
            getInitials()
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-md font-semibold text-gray-800 truncate">
            {prenom} {nom}
          </h3>
          {(employe.emp_matricule || employe.matricule) && (
            <p className="text-xs text-gray-500 mt-1 bg-gray-100 px-2 py-0.5 rounded-md inline-block">
              #{employe.emp_matricule || employe.matricule}
            </p>
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-2 text-xs border-l-2 border-blue-100 pl-3 ml-1">
        <div className="flex items-center gap-2 text-gray-700" title={etpName}>
          <Building size={14} className="text-blue-500 flex-shrink-0" />
          <span className="truncate">{etpName}</span>
        </div>
        <div
          className="flex items-center gap-2 text-gray-700"
          title={employe.emp_email || employe.email}
        >
          <Mail size={14} className="text-blue-500 flex-shrink-0" />
          <span className="truncate">
            {employe.emp_email || employe.email || "—"}
          </span>
        </div>
        <div
          className="flex items-center gap-2 text-gray-700"
          title={employe.emp_phone || employe.phone}
        >
          <Phone size={14} className="text-blue-500 flex-shrink-0" />
          <span className="truncate">
            {employe.emp_phone || employe.phone || "—"}
          </span>
        </div>
      </div>

      {/* Statut */}
      <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
        <span className="text-xs font-medium text-gray-700">Statut:</span>
        <div
          className={`w-16 h-6 flex items-center rounded-full transition-all duration-300 px-0.5 ${
            employe.user_is_in_service ? "bg-green-100" : "bg-gray-200"
          }`}
        >
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full transition-all duration-300 ${
              employe.user_is_in_service
                ? "bg-green-500 text-white translate-x-8"
                : "bg-gray-500 text-white"
            }`}
          >
            {employe.user_is_in_service ? "Actif" : "Inactif"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Employee = ({ searchQuery }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchService.getEmployee(searchQuery);
      setEmployees(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération des apprenants"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [searchQuery]);

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
        onRetry={fetchEmployee}
      />
    );
  }

  if (!employees || employees.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-12 h-12 text-gray-400" />}
        title="Aucun employé trouvé"
        description="Il n'y a actuellement aucun apprenant correspondant à votre recherche."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence>
        {employees.map((employe) => (
          <EmployeeCard
            key={employe.idEmploye || employe.id}
            employe={employe}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Employee;
