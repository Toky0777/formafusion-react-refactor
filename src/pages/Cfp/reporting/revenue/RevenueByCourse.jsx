import React, { useState, useEffect, useMemo } from "react";
import axios from "../../../../config/axios";
import { formatNumber } from "../../../../utils/objectifs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faEye,
  faArrowUpWideShort,
  faFilter,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

const RevenueByCourse = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [activeModuleIds, setActiveModuleIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [data, setData] = useState({
    modules: [],
    total_price: 0,
    totalProjects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCourses, setSelectedCourses] = useState([]);

  const years = useMemo(() => {
    const yearsArray = [];
    for (let i = -1; i <= 1; i++) {
      yearsArray.push(currentYear + i);
    }
    return yearsArray.sort((a, b) => b - a);
  }, [currentYear]);

  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear]);

  const { symbol } = useAuth();

  const fetchData = async (year) => {
    setLoading(true);
    setError(null);
    setActiveModuleIds([]);
    try {
      const response = await axios.get(`/cfp/reporting/chiffre/cours/${year}`);
      const backendData = response.data;

      const formattedModules = backendData.modules.map((module) => ({
        ...module,
        id: module.id_module,
        percentage: parseFloat(module.percentage),
        projects: module.projects.map((project) => ({
          ...project,
          cost: parseFloat(project.total_ttc),
          percentage: parseFloat(project.percentage),
          start: project.date_debut,
          end: project.date_fin,
          detail: `https://projets.forma-fusion.com/cfp/projets/${project.idProjet}/detail`,
        })),
      }));

      setData({
        modules: formattedModules,
        total_price: backendData.total_price,
        totalProjects: backendData.totalProjects,
      });
    } catch (err) {
      setError(
        "Impossible de charger les données pour l'année sélectionnée. Veuillez réessayer."
      );
      console.error("Erreur lors de la récupération des données:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleModuleDetails = (moduleId) => {
    setActiveModuleIds((prevIds) =>
      prevIds.includes(moduleId)
        ? prevIds.filter((id) => id !== moduleId)
        : [...prevIds, moduleId]
    );
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const toggleCourseSelection = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActiveFilter("all");
    setSelectedCourses([]);
  };

  const filteredAndSortedModules = useMemo(() => {
    let filteredModules = [...data.modules];

    // Apply search filter
    if (searchTerm) {
      filteredModules = filteredModules.filter((module) =>
        module.module_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply active filter
    if (activeFilter === "withProjects") {
      filteredModules = filteredModules.filter(
        (module) => module.projects?.length > 0
      );
    } else if (activeFilter === "withoutProjects") {
      filteredModules = filteredModules.filter(
        (module) => !module.projects || module.projects.length === 0
      );
    }

    // Apply course selection filter
    if (selectedCourses.length > 0) {
      filteredModules = filteredModules.filter((module) =>
        selectedCourses.includes(module.id)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filteredModules.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredModules;
  }, [data.modules, searchTerm, activeFilter, selectedCourses, sortConfig]);

  // Calculate filtered totals
  const filteredTotals = useMemo(() => {
    const totalPrice = filteredAndSortedModules.reduce(
      (sum, module) => sum + parseFloat(module.total_ttc || 0),
      0
    );
    const totalProjects = filteredAndSortedModules.reduce(
      (sum, module) => sum + (module.projects?.length || 0),
      0
    );

    return { totalPrice, totalProjects };
  }, [filteredAndSortedModules]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const expandVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const subTableColors = [
    "bg-blue-50",
    "bg-indigo-50",
    "bg-purple-50",
    "bg-pink-50",
  ];

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-16 h-16 border-t-4 border-b-4 border-blue-600 rounded-full animate-spin"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <motion.p
          className="ml-4 text-lg text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Chargement des données...
        </motion.p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen p-4 bg-red-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
        >
          <FontAwesomeIcon
            icon={faEye}
            className="w-16 h-16 mb-4 text-red-500"
          />
        </motion.div>
        <motion.p
          className="text-xl font-semibold text-center text-red-700"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          Une erreur est survenue :
        </motion.p>
        <motion.p
          className="mt-2 text-center text-red-600 text-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {error}
        </motion.p>
        <motion.button
          onClick={() => fetchData(selectedYear)}
          className="px-6 py-2 mt-6 text-white transition duration-300 bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Réessayer
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col w-full h-full p-4 md:p-6 bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col w-full min-h-screen px-4 mx-auto max-w-screen-2xl md:px-8">
        <div className="w-full h-full">
          <div className="h-[calc(100%-100px)] overflow-auto">
            <motion.div
              className="px-4 pb-6 transition-all duration-300 bg-white shadow-lg rounded-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-start justify-between gap-4 p-5 mb-6 md:flex-row md:items-center">
                <div>
                  <h1 className="text-xl font-bold text-gray-800 md:text-3xl">
                    Chiffre d'affaires par cours
                  </h1>
                </div>
                <div className="flex flex-col items-start w-full gap-4 md:flex-row md:items-center md:w-auto">
                  <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="text-gray-400"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Rechercher un cours..."
                      className="block w-full py-2 pl-10 pr-3 leading-5 placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        <FontAwesomeIcon
                          icon={faTimes}
                          className="text-gray-400 hover:text-gray-600"
                        />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <label
                      htmlFor="yearSelect"
                      className="text-sm font-medium text-gray-700 whitespace-nowrap"
                    >
                      Année:
                    </label>
                    <select
                      id="yearSelect"
                      name="yearSelect"
                      className="w-24 px-3 py-2 text-sm font-medium text-gray-700 transition duration-200 bg-gray-100 border border-gray-300 rounded-md appearance-none cursor-pointer focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
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

              {/* Filters Section */}
              <div className="p-4 mb-6 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        icon={faFilter}
                        className="mr-2 text-gray-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Filtres:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setActiveFilter("all")}
                        className={`px-3 py-1 text-sm rounded-md ${
                          activeFilter === "all"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Tous
                      </button>
                      <button
                        onClick={() => setActiveFilter("withProjects")}
                        className={`px-3 py-1 text-sm rounded-md ${
                          activeFilter === "withProjects"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Avec projets
                      </button>
                      <button
                        onClick={() => setActiveFilter("withoutProjects")}
                        className={`px-3 py-1 text-sm rounded-md ${
                          activeFilter === "withoutProjects"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Sans projets
                      </button>
                    </div>
                  </div>
                  {(searchTerm ||
                    activeFilter !== "all" ||
                    selectedCourses.length > 0) && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <FontAwesomeIcon icon={faTimes} className="mr-1" />
                      Réinitialiser les filtres
                    </button>
                  )}
                </div>

                {/* Course Selection Filter */}
                {data.modules.length > 0 && (
                  <div className="mt-4">
                    <details className="group">
                      <summary className="flex items-center justify-between p-2 text-sm font-medium text-gray-700 cursor-pointer">
                        <span>Filtrer par cours spécifiques</span>
                        <FontAwesomeIcon
                          icon={faArrowDown}
                          className="w-4 h-4 text-gray-500 transition-transform duration-200 group-open:rotate-180"
                        />
                      </summary>
                      <div className="p-2 mt-2 overflow-y-auto bg-white border border-gray-200 rounded max-h-60">
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                          {data.modules.map((module) => (
                            <div key={module.id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`course-${module.id}`}
                                checked={selectedCourses.includes(module.id)}
                                onChange={() =>
                                  toggleCourseSelection(module.id)
                                }
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label
                                htmlFor={`course-${module.id}`}
                                className="ml-2 text-sm text-gray-700 truncate"
                                title={module.module_name}
                              >
                                {module.module_name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </details>
                  </div>
                )}
              </div>

              <motion.div
                className="overflow-hidden border border-gray-200 rounded-lg"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <motion.tr variants={itemVariants}>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase rounded-tl-lg"></th>
                      <th
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                        onClick={() => requestSort("module_name")}
                      >
                        <div className="flex items-center">
                          <FontAwesomeIcon
                            icon={faArrowUpWideShort}
                            className={`mr-1 ${
                              sortConfig.key === "module_name"
                                ? "text-blue-500"
                                : "text-gray-400"
                            }`}
                          />
                          <span>Cours</span>
                          {sortConfig.key === "module_name" && (
                            <span className="ml-1 text-xs text-blue-500">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase cursor-pointer"
                        onClick={() => requestSort("projects.length")}
                      >
                        <div className="flex items-center justify-center">
                          <FontAwesomeIcon
                            icon={faArrowUpWideShort}
                            className={`mr-1 ${
                              sortConfig.key === "projects.length"
                                ? "text-blue-500"
                                : "text-gray-400"
                            }`}
                          />
                          <span>Nombre de projet</span>
                          {sortConfig.key === "projects.length" && (
                            <span className="ml-1 text-xs text-blue-500">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase cursor-pointer"
                        onClick={() => requestSort("total_ttc")}
                      >
                        <div className="flex items-center justify-end">
                          <FontAwesomeIcon
                            icon={faArrowUpWideShort}
                            className={`mr-1 ${
                              sortConfig.key === "total_ttc"
                                ? "text-blue-500"
                                : "text-gray-400"
                            }`}
                          />
                          <span>Coût</span>
                          {sortConfig.key === "total_ttc" && (
                            <span className="ml-1 text-xs text-blue-500">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                        Pourcentage
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase rounded-tr-lg">
                        Détails
                      </th>
                    </motion.tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedModules.length > 0 ? (
                      filteredAndSortedModules.map((module, index) => (
                        <React.Fragment key={module.id}>
                          <motion.tr
                            variants={itemVariants}
                            className={`transition-colors duration-200 ${
                              activeModuleIds.includes(module.id)
                                ? "bg-blue-100"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() => toggleModuleDetails(module.id)}
                          >
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                              <div className="flex items-center">
                                {selectedCourses.includes(module.id) && (
                                  <span className="w-2 h-2 mr-2 bg-blue-500 rounded-full"></span>
                                )}
                                {module.module_name}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                              <span className="px-2 py-1 rounded-full">
                                {module.projects?.length || 0}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-right text-gray-900 whitespace-nowrap">
                              {formatNumber(module.total_ttc)} {symbol}
                            </td>
                            <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                              <span
                                className={`${
                                  parseFloat(module.percentage || 0) > 0
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {module.percentage?.toFixed(2) || "0.00"} %
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                              <motion.button
                                id={`toggleButton-${module.id}`}
                                className="p-1 text-gray-500 transition-colors duration-200 hover:text-blue-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleModuleDetails(module.id);
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FontAwesomeIcon
                                  icon={faArrowDown}
                                  className={`transition-transform duration-300 ${
                                    activeModuleIds.includes(module.id)
                                      ? "rotate-180 text-blue-600"
                                      : ""
                                  }`}
                                />
                              </motion.button>
                            </td>
                          </motion.tr>

                          <AnimatePresence>
                            {activeModuleIds.includes(module.id) && (
                              <motion.tr
                                variants={expandVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className={`${
                                  subTableColors[index % subTableColors.length]
                                } border-t border-gray-300`}
                              >
                                <td colSpan="6" className="px-0 py-0">
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="px-6 py-4"
                                  >
                                    <div className="overflow-hidden border border-gray-300 rounded-lg">
                                      <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-200">
                                          <tr>
                                            <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                                              #
                                            </th>
                                            <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                                              Référence
                                            </th>
                                            <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                                              Client
                                            </th>
                                            <th className="px-4 py-2 text-xs font-medium tracking-wider text-right text-gray-700 uppercase">
                                              Début - Fin
                                            </th>
                                            <th className="px-4 py-2 text-xs font-medium tracking-wider text-right text-gray-700 uppercase">
                                              Coût
                                            </th>
                                            <th className="px-4 py-2 text-xs font-medium tracking-wider text-right text-gray-700 uppercase">
                                              Pourcentage
                                            </th>
                                            <th className="px-4 py-2 text-xs font-medium tracking-wider text-right text-gray-700 uppercase">
                                              Détails
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-300">
                                          {module.projects?.length > 0 ? (
                                            module.projects.map(
                                              (project, projectIndex) => (
                                                <motion.tr
                                                  key={
                                                    project.id_projet ??
                                                    `${module.id}-${projectIndex}`
                                                  }
                                                  initial={{
                                                    opacity: 0,
                                                    y: 10,
                                                  }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  transition={{
                                                    delay: projectIndex * 0.05,
                                                  }}
                                                  className="transition-colors duration-200 hover:bg-opacity-80"
                                                >
                                                  <td className="px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                    {projectIndex + 1}
                                                  </td>
                                                  <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                                                    {project.project_reference}
                                                  </td>
                                                  <td
                                                    className={`px-4 py-2 whitespace-nowrap text-sm ${
                                                      project.etpName ===
                                                      "Pas de client"
                                                        ? "text-red-500 font-semibold"
                                                        : "text-gray-900"
                                                    }`}
                                                  >
                                                    {project.etpName}
                                                  </td>

                                                  <td className="px-4 py-2 text-sm text-right text-gray-500 whitespace-nowrap">
                                                    {project.dateDebut} -{" "}
                                                    {project.dateFin}
                                                  </td>
                                                  <td className="px-4 py-2 text-sm text-right text-gray-900 whitespace-nowrap">
                                                    {formatNumber(project.cost)}{" "}
                                                    {symbol}
                                                  </td>
                                                  <td className="px-4 py-2 text-sm text-right text-gray-500 whitespace-nowrap">
                                                    {project.percentage?.toFixed(
                                                      2
                                                    ) || "0.00"}{" "}
                                                    %
                                                  </td>
                                                  <td className="px-4 py-2 text-sm text-right text-gray-500 whitespace-nowrap">
                                                    <Link
                                                      to={`/cfp/projet/detail/${project.idProjet}`}
                                                      className="inline-block p-1 text-gray-400"
                                                    >
                                                      <Eye size={16} />
                                                    </Link>
                                                  </td>
                                                </motion.tr>
                                              )
                                            )
                                          ) : (
                                            <tr>
                                              <td
                                                colSpan="7"
                                                className="px-4 py-4 text-sm text-center text-gray-500"
                                              >
                                                Aucun projet associé à ce cours
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </motion.div>
                                </td>
                              </motion.tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      ))
                    ) : (
                      <motion.tr
                        variants={itemVariants}
                        className="hover:bg-gray-50"
                      >
                        <td
                          colSpan="6"
                          className="px-6 py-4 text-sm text-center text-gray-500"
                        >
                          Aucun cours ne correspond à vos critères de recherche
                        </td>
                      </motion.tr>
                    )}
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <motion.tr variants={itemVariants}>
                      <td
                        colSpan="2"
                        className="px-6 py-3 text-sm font-medium text-right text-gray-900 uppercase"
                      >
                        Total filtré
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-center text-gray-900">
                        {filteredTotals.totalProjects}
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-right text-gray-900">
                        {formatNumber(filteredTotals.totalPrice)} {symbol}
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-right text-gray-900">
                        {filteredAndSortedModules.length > 0
                          ? (
                              (filteredTotals.totalPrice / data.total_price) *
                              100
                            ).toFixed(2)
                          : "0.00"}{" "}
                        %
                      </td>
                      <td className="px-6 py-3"></td>
                    </motion.tr>
                    {filteredAndSortedModules.length !==
                      data.modules.length && (
                      <motion.tr variants={itemVariants}>
                        <td
                          colSpan="2"
                          className="px-6 py-3 text-sm font-medium text-right text-gray-900 uppercase"
                        >
                          Total général
                        </td>
                        <td className="px-6 py-3 text-sm font-medium text-center text-gray-900">
                          {data.totalProjects}
                        </td>
                        <td className="px-6 py-3 text-sm font-medium text-right text-gray-900">
                          {formatNumber(data.total_price)} {symbol}
                        </td>
                        <td className="px-6 py-3 text-sm font-medium text-right text-gray-900">
                          100 %
                        </td>
                        <td className="px-6 py-3"></td>
                      </motion.tr>
                    )}
                  </tfoot>
                </table>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RevenueByCourse;
