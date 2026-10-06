import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function TablePaginator({ datas, columns, dataNames }) {
  const [currentPage, setCurrentPage] = useState(1); // numero de la page courrante

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

  return (
    <>
      <div className="overflow-hidden bg-white border border-gray-100 shadow-lg rounded-xl">
        <div className="overflow-x-auto">
          <div className="flex flex-col max-h-[70vh] overflow-y-auto">
            <table className="min-w-full table-auto">
              <thead className="sticky top-0 z-10">
                <tr className="text-xs font-semibold tracking-wider text-gray-600 uppercase border-b border-gray-200 bg-gray-50">
                  {columns.map((column, index) => (
                    <th
                      className={`px-6 py-4 ${
                        column.includes("Campagne") ||
                        column.includes("Actions")
                          ? "text-center"
                          : "text-left"
                      } whitespace-nowrap`}
                      key={index}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm bg-white divide-y divide-gray-200">
                {currentData.length > 0 ? (
                  currentData.map((data, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="transition-colors duration-200 hover:bg-gray-50"
                    >
                      {dataNames.map((name, colIndex) => (
                        <td
                          className={`px-6 py-4 ${
                            name.includes("camp") || name.includes("actions")
                              ? "text-center"
                              : "text-left"
                          }`}
                          key={colIndex}
                        >
                          {data[name]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr className="transition-colors duration-200 hover:bg-gray-50">
                    <td
                      colSpan={columns.length}
                      className="px-6 py-4 text-center"
                    >
                      {" "}
                      Aucun resultat
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center my-6">
          <div className="flex items-center px-2 bg-white border border-gray-100 rounded-lg shadow-sm">
            {currentPage > 1 && (
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 mx-1 text-gray-600 transition-colors duration-200 rounded-md hover:bg-purple-50 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <nav className="flex items-center">
              {linkPages.map((link) => {
                const isCurrentPage = link === currentPage;
                return (
                  <button
                    key={link}
                    onClick={() => onPageChange(link)}
                    className={`
                      ${link < 10 ? "w-10" : "w-12"} 
                      h-10 
                      mx-1 
                      rounded-md
                      transition-all 
                      duration-200 
                      ${
                        isCurrentPage
                          ? "bg-purple-600 text-white font-medium shadow-sm"
                          : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                      }
                    `}
                  >
                    {link}
                  </button>
                );
              })}
            </nav>

            {currentPage < totalPages && (
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 mx-1 text-gray-600 transition-colors duration-200 rounded-md hover:bg-purple-50 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
