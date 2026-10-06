import React, { useState, useEffect, useMemo } from "react";
import axios from "../../../../config/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatNumber } from "../../../../utils/objectifs";
import { useNavigate } from "react-router-dom";

import {
  faArrowDown,
  faSort,
  faFilter,
  faTimes,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useAuth } from "../../../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

const animatedComponents = makeAnimated();

const RevenueByFolder = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [activeFolderIds, setActiveFolderIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [data, setData] = useState({
    folders: [],
    total_price: 0,
    totalProjects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Suppression des états de filtre non désirés
  // const [searchTerm, setSearchTerm] = useState("");
  // const [minPercentage, setMinPercentage] = useState("");
  // const [maxPercentage, setMaxPercentage] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);

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
    setActiveFolderIds([]);
    try {
      const response = await axios.get(
        `/cfp/reporting/chiffre/dossier/${year}`
      );
      const backendData = response.data;

      const formattedFolders = backendData.folders.map((folder) => ({
        ...folder,
        id: folder.id,
        percentage: parseFloat(folder.percentage),
        projects: folder.projects.map((project) => ({
          ...project,
          cost: parseFloat(project.total_ttc),
          start: project.dateDebut,
          end: project.dateFin,
          detail: `https://projets.forma-fusion.com/cfp/projets/${folder.id}/detail`,
          percentage: parseFloat(project.percentage),
        })),
      }));

      setData({
        folders: formattedFolders,
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

  const toggleFoldersDetails = (folderId) => {
    setActiveFolderIds((prevIds) =>
      prevIds.includes(folderId)
        ? prevIds.filter((id) => id !== folderId)
        : [...prevIds, folderId]
    );
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
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

  // Options pour les filtres (basées sur les données brutes)
  const folderOptions = useMemo(() => {
    return data.folders.map((folder) => ({
      value: folder.id,
      label: folder.name,
    }));
  }, [data.folders]);

  // Filtrage des données - Simplifié pour ne garder que dossiers et clients
  const filteredFolders = useMemo(() => {
    if (!data.folders) return [];

    return data.folders.filter((folder) => {
      // Filtre 1: Dossiers sélectionnés
      const matchesFolders =
        selectedFolders.length === 0 ||
        selectedFolders.some((f) => f.value === folder.id);

      // Filtre 2: Clients sélectionnés
      const matchesClients =
        selectedClients.length === 0 ||
        folder.projects?.some((project) =>
          selectedClients.some((c) => c.value === project.etpName)
        );

      return matchesFolders && matchesClients;
    });
  }, [data.folders, selectedFolders, selectedClients]);

  // Options de clients dynamiques (basées sur les dossiers filtrés)
  const clientOptions = useMemo(() => {
    const clients = new Set();
    filteredFolders.forEach((folder) => {
      folder.projects?.forEach((project) => {
        if (project.etpName) {
          clients.add(project.etpName);
        }
      });
    });
    return Array.from(clients).map((client) => ({
      value: client,
      label: client,
    }));
  }, [filteredFolders]);

  // Tri des données filtrées
  const sortedFolders = useMemo(() => {
    let sortableFolders = [...filteredFolders];
    if (sortConfig.key) {
      sortableFolders.sort((a, b) => {
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
    return sortableFolders;
  }, [filteredFolders, sortConfig]);

  const resetFilters = () => {
    // Suppression de la réinitialisation des filtres supprimés
    // setSearchTerm("");
    // setMinPercentage("");
    // setMaxPercentage("");
    setSelectedFolders([]);
    setSelectedClients([]);
  };

  const filteredTotals = useMemo(() => {
    const totalPrice = filteredFolders.reduce(
      (sum, folder) => sum + parseFloat(folder.total_ttc || 0),
      0
    );
    const totalProjects = filteredFolders.reduce(
      (sum, folder) => sum + (folder.count_project || 0),
      0
    );

    return { total_price: totalPrice, totalProjects };
  }, [filteredFolders]);

  // Mise à jour du compteur de filtres actifs
  const activeFiltersCount = [
    selectedFolders.length,
    selectedClients.length,
  ].reduce((a, b) => a + b, 0);

  // Animations
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
      className="flex flex-col w-full h-full min-h-screen p-4 md:p-6 bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col w-full mx-auto max-w-screen-2xl bg-white rounded-xl p-4">
        {/* Header avec filtres */}
        <motion.div
          // Augmentation du z-index pour s'assurer que les Select sont au-dessus
          className=" p-6 mb-6  "
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
            <h1 className="text-xl font-bold text-gray-800 md:text-3xl">
              Chiffre d'affaires par dossiers
            </h1>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${showFilters
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

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                // Suppression de 'overflow-hidden' pour permettre aux menus Select de s'afficher correctement
                className="grid grid-cols-1 gap-4 pt-4 mt-4 border-t border-gray-200 md:grid-cols-2"
              >
                {/* Filtre par Dossiers */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Dossiers
                  </label>
                  <Select
                    isMulti
                    options={folderOptions}
                    value={selectedFolders}
                    onChange={setSelectedFolders}
                    placeholder="Sélectionner dossiers..."
                    components={animatedComponents}
                    className="text-sm"
                    classNamePrefix="select"
                    // Ajout d'un style pour s'assurer que le menu est toujours visible
                    styles={{
                      menu: (provided) => ({ ...provided, zIndex: 9999 }),
                    }}
                  />
                </div>

                {/* Filtre par Clients */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Clients
                  </label>
                  <Select
                    isMulti
                    options={clientOptions}
                    value={selectedClients}
                    onChange={setSelectedClients}
                    placeholder="Sélectionner clients..."
                    components={animatedComponents}
                    className="text-sm"
                    classNamePrefix="select"
                    // Ajout d'un style pour s'assurer que le menu est toujours visible
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
        >
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">
              {sortedFolders.length}
            </span>{" "}
            dossier(s) trouvé(s)
          </p>
          <p className="text-sm font-medium text-gray-700">
            Total filtré:{" "}
            <span className="font-bold text-blue-600">
              {formatNumber(filteredTotals.total_price)} {symbol}
            </span>{" "}
            ({filteredTotals.totalProjects} projets)
          </p>
        </motion.div>

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
                  onClick={() => requestSort("name")}
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={getSortIcon("name")}
                      className={`mr-1 ${sortConfig.key === "name"
                          ? "text-blue-600"
                          : "text-gray-400"
                        }`}
                    />
                    <span>Dossier</span>
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase cursor-pointer"
                  onClick={() => requestSort("projects.length")}
                >
                  <div className="flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={getSortIcon("projects.length")}
                      className={`mr-1 ${sortConfig.key === "projects.length"
                          ? "text-blue-600"
                          : "text-gray-400"
                        }`}
                    />
                    <span>Projets</span>
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase cursor-pointer"
                  onClick={() => requestSort("total_ttc")}
                >
                  <div className="flex items-center justify-end">
                    <FontAwesomeIcon
                      icon={getSortIcon("total_ttc")}
                      className={`mr-1 ${sortConfig.key === "total_ttc"
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
                      className={`mr-1 ${sortConfig.key === "percentage"
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
              {sortedFolders.map((folder, index) => (
                <React.Fragment key={`${folder.id}-${index}`}>
                  <motion.tr
                    variants={itemVariants}
                    className={`transition-colors duration-200 ${activeFolderIds.includes(folder.id)
                        ? "bg-blue-100"
                        : "hover:bg-gray-50"
                      }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span>{folder.name}</span>
                        <motion.button
                          className="flex items-center gap-1 px-1 py-1 text-xs font-medium text-gray-500  hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Redirection vers la page de détail du dossier
                            navigate(`/cfp/dossier/detail/${folder.id}`);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Voir le détail du dossier"
                        >
                          <Eye size={14} />
                        </motion.button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                      {folder.count_project || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900 whitespace-nowrap">
                      {formatNumber(folder.total_ttc)} {symbol}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                      {folder.percentage?.toFixed(2) || "0.00"} %
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                      <motion.button
                        className="p-1 text-gray-500 transition-colors duration-200 hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFoldersDetails(folder.id);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FontAwesomeIcon
                          icon={faArrowDown}
                          className={`transition-transform duration-300 ${activeFolderIds.includes(folder.id)
                              ? "rotate-180 text-blue-600"
                              : ""
                            }`}
                        />
                      </motion.button>
                    </td>
                  </motion.tr>

                  <AnimatePresence>
                    {activeFolderIds.includes(folder.id) && (
                      <motion.tr
                        variants={expandVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`${subTableColors[index % subTableColors.length]
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
                                    <th className="px-2 py-2 text-xs font-medium text-left text-gray-500 uppercase">
                                      #
                                    </th>
                                    <th className="px-2 py-2 text-xs font-medium text-left text-gray-500 uppercase">
                                      Projet
                                    </th>
                                    <th className="px-2 py-2 text-xs font-medium text-left text-gray-500 uppercase">
                                      Référence
                                    </th>
                                    <th className="px-2 py-2 text-xs font-medium text-left text-gray-500 uppercase">
                                      Client
                                    </th>
                                    <th className="px-2 py-2 text-xs font-medium text-left text-gray-500 uppercase">
                                      Début - Fin
                                    </th>
                                    <th className="px-2 py-2 text-xs font-medium text-left text-gray-500 uppercase">
                                      Coût
                                    </th>
                                    <th className="px-2 py-2 text-xs font-medium text-left text-gray-500 uppercase">
                                      Pourcentage
                                    </th>
                                    <th className="px-2 py-2 text-xs font-medium text-left text-gray-500 uppercase">
                                      Détails
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-300">
                                  {folder.projects?.map(
                                    (project, projectIndex) => (
                                      <motion.tr
                                        key={
                                          project.id_projet ||
                                          `${folder.id}-${projectIndex}`
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
                                          className="max-w-[10rem] truncate px-2 py-2 text-sm text-gray-700"
                                          title={project.moduleName}
                                        >
                                          {project.moduleName}
                                        </td>
                                        <td
                                          className="max-w-[10rem] truncate px-2 py-2 text-sm text-gray-700"
                                          title={project.project_reference}
                                        >
                                          {project.project_reference}
                                        </td>
                                        <td
                                          className="max-w-[10rem] truncate px-2 py-2 text-sm text-gray-700"
                                          title={project.etpName}
                                        >
                                          {project.etpName ? (
                                            project.etpName
                                          ) : (
                                            <span className="text-red-500">
                                              Pas de Client
                                            </span>
                                          )}
                                        </td>
                                        <td className="max-w-[10rem] truncate px-2 py-2 text-sm text-gray-700">
                                          {project.dateDebut} -{" "}
                                          {project.dateFin}
                                        </td>
                                        <td className="max-w-[10rem] truncate px-2 py-2 text-sm text-gray-700">
                                          {formatNumber(project.total_ttc)}{" "}
                                          {symbol}
                                        </td>
                                        <td className="max-w-[10rem] truncate px-2 py-2 text-sm text-gray-700">
                                          {project.percentage?.toFixed(2) ||
                                            "0.00"}{" "}
                                          %
                                        </td>
                                        <td className="max-w-[10rem] truncate px-2 py-2 text-sm text-gray-700">
                                          <Link
                                            to={`/cfp/projet/detail/${project.idProjet}`}
                                            className="inline-block p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                                            title="Voir le détail du projet"
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
              {sortedFolders.length === 0 && (
                <motion.tr
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-lg text-center text-gray-500"
                  >
                    Aucun dossier trouvé pour les critères sélectionnés
                  </td>
                </motion.tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RevenueByFolder;
