import { useState, useEffect, useCallback, useRef } from "react";
import axios from "../../../config/axios";
import FormationFilter from "./FormationFilter";
import { format } from "date-fns";
const Reporting = () => {
  const [dateRange, setDateRange] = useState({
    range: "all",
    startDate: null,
    endDate: null,
    label: "Tous les dates",
  });
  const [selectedFormation, setSelectedFormation] = useState("all");

  const [formationData, setFormationData] = useState([]);
  const [formationsList, setFormationsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [displayDateRange, setDisplayDateRange] = useState("");
  const [displayFormationName, setDisplayFormationName] = useState(
    "Toutes les formations"
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 
  const tableBodyRef = useRef(null); 

  
  const calculateItemsPerPage = useCallback(() => {
    if (tableBodyRef.current) {
      const tableBodyHeight = tableBodyRef.current.offsetHeight; 
      const rowHeight = 48; 
      const calculatedItems = Math.max(
        5,
        Math.floor(tableBodyHeight / rowHeight)
      ); 
      setItemsPerPage(calculatedItems);
    } else {
      const windowHeight = window.innerHeight;
  
      const estimatedRows = Math.max(5, Math.floor((windowHeight - 300) / 48));
      setItemsPerPage(estimatedRows);
    }
  }, []);

  useEffect(() => {
    calculateItemsPerPage(); // Initial calculation
    window.addEventListener("resize", calculateItemsPerPage);
    return () => window.removeEventListener("resize", calculateItemsPerPage);
  }, [calculateItemsPerPage]);

  // Reset page to 1 when filters or data change
  useEffect(() => {
    setCurrentPage(1);
  }, [formationData, selectedFormation, dateRange]);

  const fetchFormationData = useCallback(
    async (currentDateRange, currentFormation) => {
      setLoading(true);
      setError(null);

      let daterangePayload;
      if (
        currentDateRange.range === "all" ||
        !currentDateRange.startDate ||
        !currentDateRange.endDate
      ) {
        daterangePayload = "01/01/1900 - 12/31/2999";
      } else {
        daterangePayload = `${format(
          currentDateRange.startDate,
          "MM/dd/yyyy"
        )} - ${format(currentDateRange.endDate, "MM/dd/yyyy")}`;
      }

      const payload = {
        daterange: daterangePayload,
        formation: currentFormation,
      };

      try {
        const response = await axios.post(
          "cfp/reporting/filterFormation",
          payload
        );

        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = response.data;

        setFormationData(data.all_learner || []);
        setFormationsList(data.all_cfp_formation || []);

        // Set display names based on API response or local state
        if (data.data_filter && data.data_filter.length === 2) {
          setDisplayDateRange(data.data_filter[0]);
          setDisplayFormationName(data.data_filter[1]);
        } else {
          setDisplayDateRange(currentDateRange.label);
          const foundFormation = (data.all_cfp_formation || []).find(
            (f) => f.idModule === parseInt(currentFormation)
          );
          setDisplayFormationName(
            currentFormation === "all"
              ? "Toutes les formations"
              : foundFormation?.module_name || currentFormation
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setError(
          "Impossible de charger les données. Veuillez réessayer plus tard. " +
          (error.response?.data?.message || error.message)
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchFormationData(dateRange, selectedFormation);
  }, [fetchFormationData, dateRange, selectedFormation]);

  const handleFilter = ({
    dateRange: newDateRange,
    formation: newFormation,
  }) => {
    setDateRange(newDateRange);
    setSelectedFormation(newFormation);
    // fetchFormationData will be called by useEffect due to dependency on dateRange and selectedFormation
  };

  // --- Pagination Logic ---
  const totalPages = Math.ceil(formationData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = formationData.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Generate page numbers to display in pagination controls
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Adjust how many page numbers to show directly

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Logic for showing ellipsis
      pageNumbers.push(1);
      if (
        currentPage > 2 + Math.floor(maxPagesToShow / 2) &&
        currentPage <= totalPages - Math.floor(maxPagesToShow / 2)
      ) {
        pageNumbers.push("...");
        for (
          let i = currentPage - Math.floor((maxPagesToShow - 3) / 2);
          i <= currentPage + Math.floor((maxPagesToShow - 3) / 2);
          i++
        ) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
      } else if (currentPage <= 2 + Math.floor(maxPagesToShow / 2)) {
        // Near start
        for (let i = 2; i <= maxPagesToShow - 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
      } else {
        // Near end
        pageNumbers.push("...");
        for (let i = totalPages - (maxPagesToShow - 2); i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      }
      if (!pageNumbers.includes(totalPages)) {
        // Ensure last page is always shown if not already
        if (pageNumbers[pageNumbers.length - 1] !== "...") {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
      }
    }
    return [...new Set(pageNumbers)]; // Remove duplicates
  };

  return (
    <div className="flex-grow pt-20 lg:pt-20 ">
      <div className="flex flex-col w-full px-4 mx-auto xl:p-0 gap-y-4 xl:container">
        <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-xs">
          <FormationFilter
            onFilter={handleFilter}
            loading={loading}
            formationsList={formationsList}
            initialDateRange={dateRange}
            initialSelectedFormation={selectedFormation}
            setDateRange={setDateRange}
            setSelectedFormation={setSelectedFormation}
          />
        </div>

        <div className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-xs">
          <div className="px-5 py-3 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg text-gray-500">
                  Résultats des formations
                </h2>
                <div className="mt-1 text-sm text-gray-500">
                  <span className="font-medium">Dates :</span>{" "}
                  {displayDateRange} |
                  <span className="ml-2 font-medium">Formation :</span>{" "}
                  {displayFormationName}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500 sm:mt-0">
                {formationData.length}{" "}
                {formationData.length === 1 ? "résultat" : "résultats"}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-5 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Matricule
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                   Nom
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Fonction
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Formation
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Statut
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Lieu
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Entreprise
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Début
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase"
                  >
                    Durée
                  </th>
                </tr>
              </thead>
              <tbody
                ref={tableBodyRef}
                className="bg-white divide-y divide-gray-200"
              >
                {loading && (
                  <tr>
                    <td
                      colSpan="10"
                      className="px-5 py-4 text-sm text-center text-gray-500"
                    >
                      <div className="flex items-center justify-center">
                        <svg
                          className="w-4 h-4 mr-2 -ml-1 text-gray-700 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Chargement des données...
                      </div>
                    </td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td
                      colSpan="10"
                      className="px-5 py-4 text-sm text-center text-red-600"
                    >
                      {error}
                    </td>
                  </tr>
                )}
                {!loading && !error && currentData.length === 0 && (
                  <tr>
                    <td
                      colSpan="10"
                      className="px-5 py-4 text-sm text-center text-gray-500"
                    >
                      Aucune donnée de formation trouvée pour les filtres
                      actuels ou sur cette page.
                    </td>
                  </tr>
                )}
                {!loading &&
                  !error &&
                  currentData.map((data, index) => (
                    <tr
                      key={index}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="w-20 max-w-[5rem] truncate overflow-hidden whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        {data.emp_matricule}
                      </td>
                      <td className="w-40 max-w-[90rem] truncate overflow-hidden whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        <div className="font-medium">
                          {data.emp_firstname} {data.emp_name}
                        </div>
                      </td>
                      <td className="w-40 max-w-[10rem] truncate overflow-hidden whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        {data.emp_fonction &&
                          data.emp_fonction === "default_function"
                          ? data.emp_fonction
                          : "Non renseigné"}
                      </td>

                      <td className="w-40 max-w-[10rem] truncate overflow-hidden whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        {data.module_name}
                      </td>
                      <td className="w-40 max-w-[10rem] truncate overflow-hidden whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${data.project_type === "Intra"
                              ? "bg-blue-100 text-blue-800"
                              : data.project_type === "Interne"
                                ? "bg-green-100 text-green-800"
                                : data.project_type === "Extra"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                            `}
                        >
                          {data.project_type || "Type inconnu"}
                        </span>
                      </td>

                      <td className="px-5 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${data.project_status === "Terminé"
                            ? "bg-green-100 text-green-800"
                            : data.project_status === "En cours"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {data.project_status}
                        </span>
                      </td>
                      <td className="w-40 max-w-[10rem] truncate overflow-hidden whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        {data.salle_name && data.salle_quartier
                          ? `${data.salle_name}, ${data.salle_quartier}`
                          : "Non spécifié"}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500">
                        {data.etp_name}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">
                        {data.dateDebut}
                      </td>
                      <td className="px-5 py-3 text-sm text-right text-gray-500 whitespace-nowrap">
                        {data.dureeH} H
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {!loading && !error && formationData.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((pageNumber, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      typeof pageNumber === "number" && goToPage(pageNumber)
                    }
                    className={`px-3 py-1 text-sm rounded-lg ${currentPage === pageNumber
                      ? "bg-purple-600 text-white"
                      : typeof pageNumber === "number"
                        ? "text-gray-700 hover:bg-gray-200"
                        : "text-gray-500 cursor-default"
                      }`}
                    disabled={typeof pageNumber !== "number"}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reporting;
