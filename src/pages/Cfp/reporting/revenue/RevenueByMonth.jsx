import React, { useState, useEffect, useMemo } from "react";
import axios from "../../../../config/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatNumber } from "../../../../utils/objectifs";
import {
  faArrowDown,
  faEye,
  faSort,
  faFilter, // Ajout de l'icône de filtre
  faTimes, // Ajout de l'icône de fermeture/réinitialisation
  faSortUp, // Pour l'icône de tri croissant
  faSortDown, // Pour l'icône de tri décroissant
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select"; // Import de React-Select
import makeAnimated from "react-select/animated"; // Pour les animations de React-Select
import { useAuth } from "../../../../contexts/AuthContext";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

const animatedComponents = makeAnimated();

const RevenueByMonth = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [activeMonthIds, setActiveMonthIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [data, setData] = useState({
    months: [],
    total_price: 0,
    totalProjects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Nouveaux états pour le filtre de mois
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState([]); // Pour le filtre par Mois

  const { symbol } = useAuth();

  // Générer les années de manière dynamique
  const years = useMemo(() => {
    const yearsArray = [];
    for (let i = currentYear + 2; i >= currentYear - 2; i--) {
      yearsArray.push(i);
    }
    return yearsArray;
  }, [currentYear]);

  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear]);

  const fetchData = async (year) => {
    setLoading(true);
    setError(null);
    setActiveMonthIds([]); // Réinitialise les détails ouverts lors du changement d'année
    try {
      const response = await axios.get(`/cfp/reporting/chiffre/mois/${year}`);
      const backendData = response.data;

      const formattedMonths = backendData.months.map((month) => ({
        ...month,
        id: month.monthValue, // Utilise 'monthValue' comme identifiant unique pour le mois
        percentage: parseFloat(month.percentage),
        projects: month.projects.map((project) => ({
          ...project,
          cost: parseFloat(project.total_ttc),
          start: project.dateDebut,
          end: project.dateFin,
          detail: `https://projets.forma-fusion.com/cfp/projets/${project.idProjet}/detail`,
          percentage: parseFloat(project.percentage),
        })),
      }));

      setData({
        months: formattedMonths,
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

  // Cette fonction ajoute/retire les IDs de mois du tableau activeMonthIds
  const toggleMonthDetails = (monthId) => {
    setActiveMonthIds(
      (prevIds) =>
        prevIds.includes(monthId)
          ? prevIds.filter((id) => id !== monthId) // Supprime si déjà présent
          : [...prevIds, monthId] // Ajoute si non présent
    );
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return faSort;
    }
    if (sortConfig.direction === "asc") {
      return faSortUp;
    }
    return faSortDown;
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Options pour le filtre "Mois"
  const monthOptions = useMemo(() => {
    // S'assurer que chaque mois est unique et a un format { value: id, label: name }
    const uniqueMonths = new Set();
    data.months.forEach((month) => {
      uniqueMonths.add(
        JSON.stringify({ value: month.monthValue, label: month.month_name })
      );
    });
    return Array.from(uniqueMonths).map((monthStr) => JSON.parse(monthStr));
  }, [data.months]);

  // Filtrage des données par mois
  const filteredMonths = useMemo(() => {
    if (!data.months) return [];
    let result = [...data.months];

    if (selectedMonths.length > 0) {
      const selectedMonthValues = selectedMonths.map((m) => m.value);
      result = result.filter((month) =>
        selectedMonthValues.includes(month.monthValue)
      );
    }
    return result;
  }, [data.months, selectedMonths]);

  // Tri des données filtrées
  const sortedMonths = useMemo(() => {
    let sortableMonths = [...filteredMonths]; // Trie les données déjà filtrées
    if (sortConfig.key) {
      sortableMonths.sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key === "projects.length") {
          aValue = a.projects?.length || 0;
          bValue = b.projects?.length || 0;
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

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
    return sortableMonths;
  }, [filteredMonths, sortConfig]);

  const resetFilters = () => {
    setSelectedMonths([]); // Réinitialise seulement le filtre de mois
  };

  const filteredTotals = useMemo(() => {
    const totalPrice = filteredMonths.reduce(
      (sum, month) => sum + parseFloat(month.total_ttc || 0),
      0
    );
    const totalProjects = filteredMonths.reduce(
      (sum, month) => sum + (month.count_project || 0),
      0
    );

    return { total_price: totalPrice, totalProjects };
  }, [filteredMonths]);

  // Compteur de filtres actifs
  const activeFiltersCount = selectedMonths.length;

  // Animation variants
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

  // Alternating colors for sub-tables
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
            icon={faTimes}
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
          onClick={() => {
            setError(null); // Clear the error before retrying
            setLoading(true); // Set loading to true
            fetchData(selectedYear); // Re-fetch data
          }}
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
      className="flex flex-col w-full h-full min-h-screen p-4 md:p-6 bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col w-full mx-auto max-w-screen-2xl bg-white p-5  rounded-xl ">
        {/* Header avec filtres */}
        <motion.div
          className="p-6 mb-6  "
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <h1 className="text-xl font-bold text-gray-800 md:text-3xl">
              Chiffre d'affaires par mois
            </h1>
            <div className="flex items-center space-x-2">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex gap-2">
                  {activeFiltersCount > 0 && (
                    <motion.button
                      onClick={resetFilters}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 transition-colors bg-white border border-red-300 rounded-lg hover:bg-red-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                      <span>Réinitialiser</span>
                    </motion.button>
                  )}
                </div>
              </div>
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FontAwesomeIcon icon={faFilter} />
                <span>Filtres</span>
                {activeFiltersCount > 0 && (
                  <AnimatePresence>
                    <motion.span
                      className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                      }}
                    >
                      {activeFiltersCount}
                    </motion.span>
                  </AnimatePresence>
                )}
              </motion.button>
              <label
                htmlFor="yearSelect"
                className="text-sm font-medium text-gray-700"
              >
                Année:
              </label>
              <select
                id="yearSelect"
                name="yearSelect"
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer w-28 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
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

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 gap-4 pt-4 mt-4 border-t border-gray-200 md:grid-cols-2"
              >
                {/* Filtre par Mois */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Mois
                  </label>
                  <Select
                    isMulti
                    options={monthOptions}
                    value={selectedMonths}
                    onChange={setSelectedMonths}
                    placeholder="Sélectionner mois..."
                    components={animatedComponents}
                    className="text-sm"
                    classNamePrefix="select"
                    // Assure que le menu déroulant est au-dessus du tableau
                    styles={{
                      menu: (provided) => ({ ...provided, zIndex: 9999 }),
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Résumé des totaux filtrés */}
        <motion.div
          className="flex items-center justify-between mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        ></motion.div>

        {/* Tableau principal */}
        <motion.div
          className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <motion.tr variants={itemVariants}>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase rounded-tl-lg">
                  #
                </th>
                <th
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                  onClick={() => requestSort("month_name")}
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={getSortIcon("month_name")}
                      className={`mr-1 ${
                        sortConfig.key === "month_name"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span>Mois</span>
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase cursor-pointer"
                  onClick={() => requestSort("count_project")}
                >
                  <div className="flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={getSortIcon("count_project")}
                      className={`mr-1 ${
                        sortConfig.key === "count_project"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span>Nombre de projets</span>
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase cursor-pointer"
                  onClick={() => requestSort("total_ttc")}
                >
                  <div className="flex items-center justify-end">
                    <FontAwesomeIcon
                      icon={getSortIcon("total_ttc")}
                      className={`mr-1 ${
                        sortConfig.key === "total_ttc"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span>Coût</span>
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase cursor-pointer"
                  onClick={() => requestSort("percentage")}
                >
                  <div className="flex items-center justify-end">
                    <FontAwesomeIcon
                      icon={getSortIcon("percentage")}
                      className={`mr-1 ${
                        sortConfig.key === "percentage"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span>Pourcentage</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase rounded-tr-lg">
                  Détails
                </th>
              </motion.tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedMonths.map((month, index) => (
                <React.Fragment key={`${month.monthValue}-${index}`}>
                  <motion.tr
                    variants={itemVariants}
                    className={`transition-colors duration-200 ${
                      activeMonthIds.includes(month.monthValue)
                        ? "bg-blue-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {month.month_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                      {month.count_project || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900 whitespace-nowrap">
                      {formatNumber(month.total_ttc)} {symbol}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                      {month.percentage?.toFixed(2) || "0.00"} %
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                      <motion.button
                        id={`toggleButton-${month.monthValue}`}
                        className="p-1 text-gray-500 transition-colors duration-200 hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMonthDetails(month.monthValue);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FontAwesomeIcon
                          icon={faArrowDown}
                          className={`transition-transform duration-300 ${
                            activeMonthIds.includes(month.monthValue)
                              ? "rotate-180 text-blue-600"
                              : ""
                          }`}
                        />
                      </motion.button>
                    </td>
                  </motion.tr>

                  <AnimatePresence>
                    {activeMonthIds.includes(month.monthValue) && (
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
                                      Projet
                                    </th>
                                    <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                                      Référence
                                    </th>
                                    <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                                      Client
                                    </th>
                                    <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                                      Début - Fin
                                    </th>
                                    <th className="px-4 py-2 text-xs font-medium tracking-wider text-right text-gray-700 uppercase">
                                      Coût
                                    </th>
                                    <th className="px-4 py-2 text-xs font-medium tracking-wider text-right text-gray-700 uppercase">
                                      Pourcentage
                                    </th>
                                    <th className="px-4 py-2 text-xs font-medium tracking-wider text-right text-gray-700 uppercase">
                                      Voir Détails
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-300">
                                  {month.projects?.map(
                                    (project, projectIndex) => (
                                      <motion.tr
                                        key={
                                          project.idProjet ||
                                          `${month.monthValue}-${projectIndex}`
                                        }
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                          delay: projectIndex * 0.05,
                                        }}
                                        className="transition-colors duration-200 hover:bg-opacity-80"
                                      >
                                        <td className="px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                                          {projectIndex + 1}
                                        </td>
                                        <td
                                          className="w-40 max-w-[10rem] truncate overflow-hidden whitespace-nowrap px-2 py-2 text-sm text-gray-700"
                                          title={project.moduleName}
                                        >
                                          {project.moduleName}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                                          {project.project_reference}
                                        </td>
                                        <td
                                          className="w-40 max-w-[10rem] truncate overflow-hidden whitespace-nowrap px-2 py-2 text-sm text-gray-700"
                                          title={
                                            project.etpName || "Pas de client"
                                          }
                                        >
                                          {project.etpName ? (
                                            project.etpName
                                          ) : (
                                            <span className="italic text-gray-400">
                                              Pas de client
                                            </span>
                                          )}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-left text-gray-500 whitespace-nowrap">
                                          {project.dateDebut} -{" "}
                                          {project.dateFin}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-right text-gray-900 whitespace-nowrap">
                                          {formatNumber(project.total_ttc)}
                                          {symbol}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-right text-gray-500 whitespace-nowrap">
                                          {project.percentage?.toFixed(2) ||
                                            "0.00"}{" "}
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
              ))}
            </tbody>
            <tfoot className="bg-gray-100">
              <motion.tr variants={itemVariants}>
                <td
                  colSpan="2"
                  className="px-6 py-3 text-sm font-medium text-right text-gray-900 uppercase"
                >
                  Total
                </td>
                <td className="px-6 py-3 text-sm font-medium text-center text-gray-900">
                  {filteredTotals.totalProjects}
                </td>
                <td className="px-6 py-3 text-sm font-medium text-right text-gray-900">
                  {formatNumber(filteredTotals.total_price)}
                  {symbol}
                </td>
                <td className="px-6 py-3 text-sm font-medium text-right text-gray-900">
                  {filteredTotals.total_price > 0 ? "100.00" : "0.00"} %
                </td>
                <td className="px-6 py-3"></td>
              </motion.tr>
            </tfoot>
          </table>
          {sortedMonths.length === 0 && !loading && (
            <motion.div
              className="flex flex-col items-center justify-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FontAwesomeIcon
                icon={faEye} // Icône générique pour "aucun résultat"
                className="w-12 h-12 mb-4 text-gray-400"
              />
              <p className="text-lg text-gray-600">
                Aucun mois trouvé pour les critères sélectionnés.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RevenueByMonth;
