import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock navigate function for demonstration

export function TableResults({ datas, columns, dataNames }) {
  const [currentPage, setCurrentPage] = useState(1); // numero de la page courrante
  const navigate = useNavigate();
  const itemsPerPage = 10; //nombre des données à rendre par page
  const totalPages = Math.ceil(datas.length / itemsPerPage); // total des pages
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = datas.slice(startIndex, startIndex + itemsPerPage);

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

  const mockColumns = [
    "RANG",
    "NOM",
    "PRÉNOM",
    "ENTREPRISE",
    "DATE",
    "POINTS",
    "NIVEAU",
    "ACTION",
  ];
  const mockDataNames = [
    "rang",
    "nom",
    "prenom",
    "entreprise",
    "date",
    "points",
    "niveau",
    "actions",
  ];

  // Use mock data if no props provided
  const finalData = datas || [];
  const finalColumns = columns || mockColumns;
  const finalDataNames = dataNames || mockDataNames;

  const finalCurrentData = finalData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const finalTotalPages = Math.ceil(finalData.length / itemsPerPage);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-none shadow-sm">
        <div className="overflow-x-auto">
          <div className="flex flex-col max-h-[70vh] overflow-y-auto">
            <table className="min-w-full border-collapse table-auto">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-gray-200 bg-gray-50">
                  {finalColumns.map((column) => {
                    return (
                      <th
                        className={`px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider text-left border-r border-gray-200 last:border-r-0 ${
                          column.includes("Niveau") ||
                          column.includes("Action") ||
                          column.includes("NIVEAU") ||
                          column.includes("ACTION")
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
              <tbody className="bg-white divide-y divide-gray-200">
                {finalCurrentData.map((data, index) => (
                  <tr
                    key={index}
                    className="transition-colors duration-150 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      navigate(
                        `/formateur/testing/qcm/${data.idqcm}/appr/${data.id}/session/${data.session}/result`
                      )
                    }
                  >
                    {finalDataNames.map((name) => {
                      if (name === "niveau") {
                        return (
                          <td
                            key={name}
                            className="px-4 py-3 text-center border-r border-gray-100 last:border-r-0"
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
                      if (name == "actions") {
                        return (
                          <td
                            key={name}
                            className="px-4 py-3 text-sm text-center text-gray-700 border-r border-gray-100 last:border-r-0"
                          >
                            <span className="text-blue-600 cursor-pointer hover:text-blue-800">
                              📄 {data[name]}
                            </span>
                          </td>
                        );
                      }
                      return (
                        <td
                          key={name}
                          className="px-4 py-3 text-sm text-gray-700 border-r border-gray-100 last:border-r-0 whitespace-nowrap"
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
      <div className="flex justify-center">
        <div className="flex justify-between px-4 py-2 mt-2 transition-colors duration-200 rounded-xl">
          {currentPage > 1 && (
            <button
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 transition-colors duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <nav className="px-4 my-1 rounded-b-md">
            {linkPages.map((link) => {
              const isCurrentPage =
                link === currentPage
                  ? "bg-purple-700 text-white"
                  : "bg-[#9c9d9f2f] text-white";
              return (
                <button
                  className={`${
                    link < 10 ? "px-4" : "px-3"
                  } py-2 mx-1 my-3 ${isCurrentPage} btn`}
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
              className="p-2 transition-colors duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
