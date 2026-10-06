import { useState } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

export function TableResults({ datas, columns, dataNames }) {
  const [currentPage, setCurrentPage] = useState(1);
  // Mock navigate function for demonstration
  const navigate = (url) => console.log(`Navigating to: ${url}`);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(datas?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = datas?.slice(startIndex, startIndex + itemsPerPage);

  const linkPages = [];
  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  for (let index = 1; index <= totalPages; index++) {
    linkPages.push(index);
  }

  const getLevelClasses = (niveau) => {
    switch (niveau) {
      case "Débutant":
        return "bg-blue-100 text-blue-800";
      case "Intermédiaire":
        return "bg-green-100 text-green-800";
      case "Avancé":
        return "bg-purple-100 text-purple-800";
      case "Expert":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  // Mock data for demonstration
  const mockData = [
    {
      rang: 1,
      name: "Dupont",
      firstname: "Marie",
      etp: "Tech Corp",
      campaignName: "Formation 2024",
      date: "2024-01-15",
      intituleqcm: "JavaScript Avancé",
      points: 95,
      niveau: "Expert",
      actions: "Voir détails",
      idqcm: 1,
      id: 101,
      session: "A1",
    },
    {
      rang: 2,
      name: "Martin",
      firstname: "Pierre",
      etp: "Innovation Ltd",
      campaignName: "Certification Web",
      date: "2024-01-14",
      intituleqcm: "React Fundamentals",
      points: 88,
      niveau: "Avancé",
      actions: "Voir détails",
      idqcm: 2,
      id: 102,
      session: "B2",
    },
    {
      rang: 3,
      name: "Bernard",
      firstname: "Sophie",
      etp: "Digital Solutions",
      campaignName: "Formation 2024",
      date: "2024-01-13",
      intituleqcm: "CSS Grid Layout",
      points: 76,
      niveau: "Intermédiaire",
      actions: "Voir détails",
      idqcm: 3,
      id: 103,
      session: "C3",
    },
    {
      rang: 4,
      name: "Rousseau",
      firstname: "Thomas",
      etp: "StartUp Inc",
      campaignName: "Bootcamp Dev",
      date: "2024-01-12",
      intituleqcm: "HTML Basics",
      points: 65,
      niveau: "Débutant",
      actions: "Voir détails",
      idqcm: 4,
      id: 104,
      session: "D4",
    },
  ];

  const mockColumns = [
    "Rang",
    "Nom",
    "Prénom",
    "Entreprise",
    "Campagne",
    "Date",
    "QCM",
    "Points",
    "Niveau",
    "Actions",
  ];

  const mockDataNames = [
    "rang",
    "name",
    "firstname",
    "etp",
    "campaignName",
    "date",
    "intituleqcm",
    "points",
    "niveau",
    "actions",
  ];

  // Use mock data if no props provided
  const finalData = datas || mockData;
  const finalColumns = columns || mockColumns;
  const finalDataNames = dataNames || mockDataNames;

  const finalCurrentData = finalData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const finalTotalPages = Math.ceil(finalData.length / itemsPerPage);

  return (
    <>
      {/* Container avec le même style que le parent */}
      <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="flex flex-col max-h-[70vh] overflow-y-auto">
            <table className="min-w-full border-collapse table-auto">
              {/* Header avec style parent */}
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                  {finalColumns.map((column) => {
                    return (
                      <th
                        className={`px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left border-r border-gray-100 last:border-r-0 ${
                          column.includes("Niveau") ||
                          column.includes("Action") ||
                          column.includes("NIVEAU") ||
                          column.includes("ACTION") ||
                          column.includes("Actions")
                            ? "text-center"
                            : ""
                        }`}
                        key={column}
                      >
                        {column}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white/80 backdrop-blur-sm divide-y divide-gray-100">
                {finalCurrentData.map((data, index) => (
                  <tr
                    key={index}
                    className="transition-all duration-300 border-b border-gray-50 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-white hover:shadow-md"
                    onClick={() =>
                      navigate(
                        `/cfp/prequal/qcm/${data.idqcm}/appr/${data.id}/session/${data.session}/result`
                      )
                    }
                  >
                    {finalDataNames.map((name) => {
                      if (name === "niveau") {
                        return (
                          <td
                            key={name}
                            className="px-6 py-4 text-center border-r border-gray-50 last:border-r-0"
                          >
                            <span
                              className={`py-1 px-3 rounded-full text-xs font-semibold ${getLevelClasses(
                                data[name]
                              )}`}
                            >
                              {data[name]}
                            </span>
                          </td>
                        );
                      }
                      if (name === "actions") {
                        return (
                          <td
                            key={name}
                            className="px-6 py-4 text-sm text-center text-gray-700 border-r border-gray-50 last:border-r-0"
                          >
                            <div className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                              <FileText className="w-4 h-4" />
                              <span>{data[name]}</span>
                            </div>
                          </td>
                        );
                      }
                      return (
                        <td
                          key={name}
                          className="px-6 py-4 text-sm text-gray-700 border-r border-gray-50 last:border-r-0 whitespace-nowrap font-medium"
                        >
                          {data[name]}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination avec le style du parent */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg p-2">
          {currentPage > 1 && (
            <button
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 transition-all duration-300 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <nav className="flex items-center space-x-1">
            {linkPages.map((link) => {
              const isCurrentPage = link === currentPage;
              return (
                <button
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isCurrentPage
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : "bg-white/80 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 border border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setCurrentPage(link)}
                  key={link}
                >
                  {link}
                </button>
              );
            })}
          </nav>

          {currentPage < finalTotalPages && (
            <button
              onClick={() =>
                currentPage < finalTotalPages && onPageChange(currentPage + 1)
              }
              disabled={currentPage === finalTotalPages}
              className="p-2 transition-all duration-300 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Info pagination */}
      <div className="text-center text-gray-600 text-sm mt-4 font-medium">
        Page {currentPage} sur {finalTotalPages} • Total: {finalData.length}{" "}
        résultats
      </div>
    </>
  );
}
