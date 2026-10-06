import { useState, useEffect, useMemo } from "react";
import axios from "../../../../config/axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";
import { formatNumber } from "../../../../utils/objectifs";

const RevenueByProject = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [projects, setProjects] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const setting = sessionStorage.getItem("setting");
  const [showFilters, setShowFilters] = useState(false);

  // États pour les filtres
  const [selectedFormations, setSelectedFormations] = useState([]);
  const [selectedReferences, setSelectedReferences] = useState([]);
  const [allFormations, setAllFormations] = useState([]);
  const [allReferences, setAllReferences] = useState([]);
  const { symbol } = useAuth();

  const years = useMemo(() => {
    return [currentYear + 1, currentYear, currentYear - 1];
  }, [currentYear]);

  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear]);

  const fetchData = async (year) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`/cfp/reporting/chiffre/projet/${year}`);
      const formattedProjects = response.data.projects.map((project) => ({
        id: project.id_projet,
        formation: project.module_name,
        reference: project.project_reference,
        debut: project.date_debut,
        fin: project.date_fin,
        cout: project.total_ttc,
        pourcentage: `${project.percentage} %`,
        detail: `/reporting/project/detail/${project.idProjet}`,
      }));

      setProjects(formattedProjects);
      setTotalPrice(response.data.total_price);

      // Extraire les formations et références uniques pour les filtres
      const uniqueFormations = [
        ...new Set(formattedProjects.map((p) => p.formation)),
      ];
      const uniqueReferences = [
        ...new Set(formattedProjects.map((p) => p.reference)),
      ];

      setAllFormations(uniqueFormations.map((f) => ({ value: f, label: f })));
      setAllReferences(uniqueReferences.map((r) => ({ value: r, label: r })));

      setCurrentPage(1);
    } catch (err) {
      setError(
        "Impossible de charger les données pour l'année sélectionnée. Veuillez réessayer."
      );
      console.error("Erreur lors de la récupération des données:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les projets en fonction des sélections
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const formationMatch =
        selectedFormations.length === 0 ||
        selectedFormations.some((f) => f.value === project.formation);

      const referenceMatch =
        selectedReferences.length === 0 ||
        selectedReferences.some((r) => r.value === project.reference);

      return formationMatch && referenceMatch;
    });
  }, [projects, selectedFormations, selectedReferences]);

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const sortTable = (columnName) => {
    const sorted = [...filteredProjects].sort((a, b) => {
      if (
        typeof a[columnName] === "string" &&
        isNaN(parseFloat(a[columnName]))
      ) {
        return a[columnName].localeCompare(b[columnName]);
      }

      const valA = parseFloat(String(a[columnName]).replace(/[^0-9.-]+/g, ""));
      const valB = parseFloat(String(b[columnName]).replace(/[^0-9.-]+/g, ""));

      if (!isNaN(valA) && !isNaN(valB)) return valA - valB;

      if (columnName === "debut" || columnName === "fin") {
        return new Date(a[columnName]) - new Date(b[columnName]);
      }

      return 0;
    });

    setProjects(sorted);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const resetFilters = () => {
    setSelectedFormations([]);
    setSelectedReferences([]);
  };

  const hasActiveFilters =
    selectedFormations.length > 0 || selectedReferences.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-600 rounded-full animate-spin"></div>
        <p className="ml-4 text-lg text-gray-700">Chargement des données...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col w-full h-full p-4 md:p-8 mt-15"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col w-full min-h-screen mx-auto max-w-screen-2xl bg-white shadow-sm rounded-xl p-5">
        <motion.div className="mb-8 pb-4" variants={itemVariants}>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <h1 className="text-xl font-bold text-gray-800 md:text-3xl">
              Chiffre d'affaires par projet
            </h1>

            <div className="flex flex-col w-full gap-3 sm:flex-row md:w-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                    showFilters
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : hasActiveFilters
                      ? "bg-orange-50 text-orange-700 border-orange-200"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <Filter size={16} />
                  Filtres
                  {showFilters ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                  {hasActiveFilters && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                      {selectedFormations.length + selectedReferences.length}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="yearSelect"
                    className="text-sm font-medium text-gray-700 whitespace-nowrap"
                  >
                    Année:
                  </label>
                  <select
                    id="yearSelect"
                    name="yearSelect"
                    className="w-full px-3 py-2 text-sm font-medium text-gray-700 transition duration-200 border border-gray-300 rounded-md cursor-pointer md:w-32 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                    value={selectedYear}
                    onChange={handleYearChange}
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ======= Filtres ======= */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 mb-8 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Filtres avancés
              </h3>
              <div className="flex gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                  >
                    <X size={14} />
                    Réinitialiser
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex items-center gap-1 px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                >
                  <X size={14} />
                  Fermer
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Formation
                </label>
                <Select
                  options={allFormations}
                  value={selectedFormations}
                  onChange={setSelectedFormations}
                  isMulti
                  placeholder="Sélectionner une ou plusieurs formations..."
                  className="react-select-container"
                  classNamePrefix="react-select"
                  noOptionsMessage={() => "Aucune option disponible"}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Référence
                </label>
                <Select
                  options={allReferences}
                  value={selectedReferences}
                  onChange={setSelectedReferences}
                  isMulti
                  placeholder="Sélectionner une ou plusieurs références..."
                  className="react-select-container"
                  classNamePrefix="react-select"
                  noOptionsMessage={() => "Aucune option disponible"}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* ======= Tableau ======= */}
        <motion.div className="overflow-x-auto" variants={itemVariants}>
          {currentProjects.length > 0 ? (
            <div className="rounded-lg border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      #
                    </th>
                    <th
                      className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer hover:text-blue-600"
                      onClick={() => sortTable("formation")}
                    >
                      Formation
                    </th>
                    <th
                      className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer hover:text-blue-600"
                      onClick={() => sortTable("reference")}
                    >
                      Référence
                    </th>
                    <th
                      className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase cursor-pointer hover:text-blue-600"
                      onClick={() => sortTable("debut")}
                    >
                      Début
                    </th>
                    <th
                      className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase cursor-pointer hover:text-blue-600"
                      onClick={() => sortTable("fin")}
                    >
                      Fin
                    </th>
                    <th
                      className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase cursor-pointer hover:text-blue-600"
                      onClick={() => sortTable("cout")}
                    >
                      Coût
                    </th>
                    <th
                      className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase cursor-pointer hover:text-blue-600"
                      onClick={() => sortTable("pourcentage")}
                    >
                      Pourcentage
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
                      Détail
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {currentProjects.map((project, index) => (
                    <motion.tr
                      key={project.id}
                      className="hover:bg-gray-50"
                      variants={itemVariants}
                    >
                      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td
                        className="max-w-xs px-4 py-3 text-sm text-gray-900 truncate"
                        title={project.formation}
                      >
                        {project.formation}
                      </td>
                      <td
                        className="max-w-xs px-4 py-3 text-sm text-gray-900 truncate"
                        title={project.reference}
                      >
                        {project.reference}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-500 whitespace-nowrap">
                        {project.debut}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-500 whitespace-nowrap">
                        {project.fin}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-right text-gray-900 whitespace-nowrap">
                        {formatNumber(project.cout)} {symbol}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-500 whitespace-nowrap">
                        {project.pourcentage}
                      </td>
                      <td className="px-10 py-3 text-sm font-medium text-center whitespace-nowrap">
                        <Link
                          to={`/cfp/projet/detail/${project.id}`}
                          className="text-gray-400"
                        >
                          <Eye size={16} />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}

                  {/* ======= Ligne total ======= */}
                  <tr className="font-semibold bg-gray-100">
                    <td
                      colSpan="5"
                      className="px-4 py-3 text-sm text-right text-gray-700 uppercase"
                    >
                      Total
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">
                      {formatNumber(
                        filteredProjects.reduce(
                          (sum, project) => sum + parseFloat(project.cout || 0),
                          0
                        )
                      )}{" "}
                      {symbol}
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center rounded-lg bg-gray-50 mt-8">
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {selectedFormations.length > 0 || selectedReferences.length > 0
                  ? "Aucun projet ne correspond à vos critères de recherche"
                  : "Aucun projet trouvé pour l'année sélectionnée"}
              </h3>
              <div className="mt-6">
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {selectedFormations.length > 0 ||
                  selectedReferences.length > 0
                    ? "Réinitialiser les filtres"
                    : "Réessayer"}
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* ======= Pagination ======= */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft />
              </button>
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 border rounded-md text-sm font-medium ${
                        currentPage === number
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RevenueByProject;
