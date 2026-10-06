import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, Calendar } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { MONTHS, dateFormat } from "../../utils/global";

const getStatusColor = (status) => {
  const colors = {
    "En cours": "bg-blue-100 text-blue-800",
    Terminé: "bg-green-100 text-green-800",
    "En attente": "bg-yellow-100 text-yellow-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export default function ProjectTable({ projects, pathSkills, searchTerm }) {
  const [expandedMonths, setExpandedMonths] = useState({});
  const { userType } = useAuth();
  const navigate = useNavigate();

  const groupedProjects = useMemo(() => {
    if (!projects) return {};
    if (!searchTerm) return projects;

    const lowerTerm = searchTerm.toLowerCase();
    const filtered = {};

    Object.entries(projects).forEach(([year, months]) => {
      const monthEntries = {};

      Object.entries(months).forEach(([month, monthProjects]) => {
        const filteredProjects = monthProjects.filter((p) =>
          p.etp_name?.toLowerCase().includes(lowerTerm)
        );
        if (filteredProjects.length > 0) {
          monthEntries[month] = filteredProjects;
        }
      });

      if (Object.keys(monthEntries).length > 0) {
        filtered[year] = monthEntries;
      }
    });

    return filtered;
  }, [projects, searchTerm]);

  let tableColName = "";
  switch (userType) {
    case "superAdminCfp":
    case "etp_single":
    case "etp_grouped":
    case "formateur":
    case "cfp":
      tableColName = "Entreprise";
      break;
    default:
      tableColName = "Centre de formation";
      break;
  }

  const toggleMonth = (yearMonth) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [yearMonth]: !prev[yearMonth],
    }));
  };

  const getMonthStats = (monthProjects) => {
    const totalLearners = monthProjects.reduce(
      (sum, projet) => sum + (projet.learner_count || 0),
      0
    );
    return { totalProjects: monthProjects.length, totalLearners };
  };

  if (!groupedProjects || Object.keys(groupedProjects).length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="text-lg font-medium">Aucun projet disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedProjects)
        .sort(([yearA], [yearB]) => yearB - yearA)
        .map(([year, months]) => (
          <div key={year}>
            <div className="w-full px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between border-l-4 border-blue-400">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-gray-800">{year}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 space-y-3">
              {Object.entries(months)
                .sort(([monthA], [monthB]) => monthB - monthA)
                .map(([month, monthProjects]) => {
                  const {
                    totalProjects: monthTotal,
                    totalLearners: monthLearners,
                  } = getMonthStats(monthProjects);

                  const monthKey = `${year}-${month}`;
                  const isMonthExpanded = expandedMonths[monthKey];

                  return (
                    <div key={month} className="rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleMonth(monthKey)}
                        className="w-full px-4 py-3   flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          {isMonthExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          )}
                          <span className="text-sm font-semibold text-gray-700">
                            {MONTHS[parseInt(month) - 1] || `Mois ${month}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-gray-600">
                            <span className="font-medium">{monthTotal}</span>{" "}
                            projet{monthTotal > 1 ? "s" : ""}
                          </span>
                        </div>
                      </button>

                      {isMonthExpanded && (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Module
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Début
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Fin
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  {tableColName}
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Statut
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Apprenants
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {monthProjects.map((projet, index) => (
                                <tr
                                  key={projet.idProjet || index}
                                  className={`transition-colors ${
                                    projet.learner_count > 0
                                      ? "hover:bg-blue-50 cursor-pointer"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    if (projet.learner_count > 0) {
                                      navigate(
                                        `${pathSkills}/${projet.idProjet}`
                                      );
                                    }
                                  }}
                                >
                                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                    {projet.module_name}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {dateFormat(projet.start_date)}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {dateFormat(projet.end_date)}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                      <span className="truncate">
                                        {projet.etp_name || projet.cfp_name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span
                                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                        projet.project_status
                                      )}`}
                                    >
                                      {projet.project_status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold">
                                      {projet.learner_count}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
    </div>
  );
}
