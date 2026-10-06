import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const projectStatusMapping = (status) => {
  switch (status) {
    case "projects_finished":
      return { label: "Terminé", color: "green", icon: CheckCircle };

    case "projects_in_progress":
      return { label: "En cours", color: "blue", icon: Clock };

    case "projects_future":
      return { label: "Future", color: "purple", icon: Calendar };

    case "projects_in_preparation":
      return { label: "En préparation", color: "orange", icon: AlertCircle };

    case "projects_fenced":
      return { label: "Cloturé", color: "red", icon: FileText };

    default:
      return { label: "Inconnu", color: "gray", icon: FileText };
  }
};

const StatusBadge = ({ status, count }) => {
  const config = projectStatusMapping(status);
  const Icon = config.icon;

  const colorClasses = {
    green: "bg-green-100 text-green-800 border-green-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
    red: "bg-red-100 text-red-800 border-red-200",
    gray: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colorClasses[config.color]
        }`}
    >
      <Icon className="w-4 h-4 mr-1" />
      {config.label} ({count})
    </div>
  );
};

function CustomerProjectTable({ projects, status }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!projects || projects.length === 0) return null;
  return (
    <div>
      <div className="mb-6">
        <div
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 mb-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center">
            <StatusBadge status={status} count={projects.length} />
          </div>
          <div className="flex items-center text-gray-500">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom du Projet
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Début
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Fin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Détails
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project, index) => (
                  <tr key={`${status}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                      {project.module_name || "Projet sans nom"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.date_debut || "Non défini"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.date_fin || "Non défini"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {project.total_ht ? `${project.total_ht}` : "-"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                      <Link to={`/cfp/projet/detail/${project.id_projet}`}>
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export const renderProjectsByStatus = (data) => {
  if (!data) return null;

  const statusOrder = [
    "projects_in_progress",
    "projects_in_preparation",
    "projects_future",
    "projects_finished",
    "projects_fenced",
  ];

  const statusGroups = {};

  statusOrder.forEach((status) => {
    statusGroups[status] = data[status] || [];
  });

  const hasProjects = statusOrder.some(
    (status) => statusGroups[status] && statusGroups[status].length > 0
  );

  if (!hasProjects) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Aucun projet trouvé</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div className="space-y-4">
          {statusOrder.map((status) => {
            const projects = statusGroups[status];
            if (!projects || projects.length === 0) return null;

            return (
              <CustomerProjectTable
                key={status}
                projects={projects}
                status={status}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
