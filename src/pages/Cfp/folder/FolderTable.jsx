import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFolder,
    faChevronDown,
    faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatMontant } from "../../../utils/formatMontant";
import ProjectDrawer from "../../../components/drawer/customer/ProjectDrawer";
import customerService from "../../../services/cfp/customer/customerService";

const SortIcon = ({ columnKey, sortConfig }) => {
    if (sortConfig.key !== columnKey) {
        return (
            <FontAwesomeIcon
                icon={faChevronDown}
                className="w-3 h-3 ml-1 opacity-50"
            />
        );
    }
    return sortConfig.direction === "ascending" ? (
        <FontAwesomeIcon icon={faChevronUp} className="w-3 h-3 ml-1" />
    ) : (
        <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3 ml-1" />
    );
};

const TableHeader = ({
    children,
    sortable,
    sortKey,
    sortConfig,
    onSort,
    width,
    responsiveClass = "",
}) => {
    return (
        <th
            scope="col"
            className={`px-3 py-2 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap ${width} ${responsiveClass} text-center`}
        >
            {sortable ? (
                <button
                    onClick={() => onSort(sortKey)}
                    className="flex items-center justify-center space-x-1 hover:text-gray-900 transition-colors focus:outline-none w-full"
                >
                    <span>{children}</span>
                    <SortIcon columnKey={sortKey} sortConfig={sortConfig} />
                </button>
            ) : (
                <div className="flex justify-center">{children}</div>
            )}
        </th>
    );
};

const StatusBadge = ({ status }) => {
    const statusConfig = {
        Terminé: { bg: "bg-green-100", text: "text-green-800" },
        Cloturé: { bg: "bg-green-100", text: "text-green-800" },
        Annulé: { bg: "bg-red-100", text: "text-red-800" },
        "En préparation": { bg: "bg-blue-100", text: "text-blue-800" },
        "En cours": { bg: "bg-yellow-100", text: "text-yellow-800" },
        Planifié: { bg: "bg-purple-100", text: "text-purple-800" },
        Reporté: { bg: "bg-orange-100", text: "text-orange-800" },
    };

    const config = statusConfig[status] || {
        bg: "bg-gray-100",
        text: "text-gray-800",
    };

    return (
        <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}
        >
            {status}
        </span>
    );
};

const ClientCell = ({ entreprises }) => {
    console.log(entreprises);

    const [showDrawerProject, setShowDrawerProject] = useState(false);
    const [loadingForProject, setLoadingForProject] = useState(false);
    const account = "cfp";
    const [dataForEtp, setDataForEtp] = useState({});

    const handleShowProject = async (id) => {
        setShowDrawerProject(true);
        setLoadingForProject(true);

        try {
            let res = null;
            if (account === "cfp") {
                res = await customerService.projetCustomer(id);
            } else {
                res = await customerService.getCfpById(id);
            }
            setDataForEtp(res);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingForProject(false);
        }
    };

    if (!Array.isArray(entreprises) || entreprises.length === 0) {
        return <span className="text-gray-400 text-xs">—</span>;
    }

    return (
        <>
            <div className="flex items-center flex-wrap gap-1 min-h-[24px] max-w-full">
                {entreprises.map((entreprise, index) => (
                    <span
                        key={index}
                        className="inline-block max-w-full truncate px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs cursor-pointer hover:bg-gray-200 transition-colors"
                        title={entreprise.etp_name}
                        onClick={(e) => {
                            e.stopPropagation(); // ← empêche le clic de remonter au <tr>
                            handleShowProject(entreprise?.idEtp);
                        }}
                    >
                        {entreprise.etp_name}
                    </span>
                ))}
            </div>

            {showDrawerProject && (
                <ProjectDrawer
                    isLoading={loadingForProject}
                    data={dataForEtp}
                    account={account}
                    isShow={showDrawerProject}
                    onClose={() => setShowDrawerProject(false)}
                />
            )}
        </>
    );
};

const LoadingState = () => (
    <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full"
            />
            <span className="text-gray-600 text-sm">Chargement des dossiers...</span>
        </div>
    </div>
);

const EmptyState = ({ message }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 text-center bg-white rounded-lg border border-gray-200"
    >
        <div className="w-12 h-12 mx-auto mb-3 text-gray-300">
            <FontAwesomeIcon icon={faFolder} size="lg" />
        </div>
        <p className="text-gray-500 text-sm">{message}</p>
    </motion.div>
);

// Composant Mobile Card pour les petits écrans
const MobileCard = ({
    dossier,
    onClick,
    formatPeriode,
    currency_unit,
    onEntrepriseClick,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onClick}
            className="bg-white border border-gray-200 rounded-lg p-4 mb-3 cursor-pointer hover:bg-blue-50 transition-colors shadow-sm"
        >
            {/* En-tête de la carte */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center flex-1 min-w-0">
                    <FontAwesomeIcon
                        icon={faFolder}
                        className="text-yellow-500 w-4 h-4 mr-2 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                        <h3
                            className="font-medium text-gray-900 text-sm leading-tight truncate"
                            title={dossier.nomDossier}
                        >
                            {dossier.nomDossier || "—"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {Array.isArray(dossier.entreprises)
                                ? dossier.entreprises.length
                                : 0}{" "}
                            entreprise(s)
                        </p>
                    </div>
                </div>
                <StatusBadge status={dossier.status} />
            </div>

            {/* Informations principales */}
            <div className="space-y-2">
                {/* Client */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                        Client
                    </label>
                    <ClientCell entreprises={dossier.entreprises} />
                </div>

                {/* Modules */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                        Modules
                    </label>
                    <p
                        className="text-gray-700 text-xs leading-tight truncate"
                        title={
                            Array.isArray(dossier.module_names)
                                ? dossier.module_names.join(", ")
                                : "—"
                        }
                    >
                        {Array.isArray(dossier.module_names)
                            ? dossier.module_names.join(", ")
                            : "—"}
                    </p>
                </div>

                {/* Ville et Période sur la même ligne */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                            Ville
                        </label>
                        <p
                            className="text-gray-700 text-xs leading-tight truncate"
                            title={
                                Array.isArray(dossier.villes) ? dossier.villes.join(", ") : "—"
                            }
                        >
                            {Array.isArray(dossier.villes) ? dossier.villes.join(", ") : "—"}
                        </p>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                            Période
                        </label>
                        <p
                            className="text-gray-700 text-xs leading-tight truncate"
                            title={formatPeriode(
                                dossier.dateMinProjet,
                                dossier.dateMaxProjet
                            )}
                        >
                            {formatPeriode(dossier.dateMinProjet, dossier.dateMaxProjet)}
                        </p>
                    </div>
                </div>

                {/* Montant */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                        Montant
                    </label>
                    <span className="font-semibold text-gray-900 text-sm">
                        {formatMontant(dossier.montantTotal, currency_unit)}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

// Composant principal du tableau
const FolderTable = ({
    loading,
    error,
    sortedAndFiltered,
    currentItems,
    sortConfig,
    handleSort,
    navigate,
    currency_unit,
    formatPeriode,
    currentPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    goToPreviousPage,
    goToNextPage,
    paginate,
}) => {
    return (
        <div className="overflow-hidden">
            {loading ? (
                <LoadingState />
            ) : error ? (
                <div className="p-6 text-center">
                    <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                        {error}
                    </div>
                </div>
            ) : sortedAndFiltered.length === 0 ? (
                <EmptyState message="Aucun dossier trouvé avec les critères sélectionnés" />
            ) : (
                <>
                    {/* Version Desktop/Tablette - Tableau */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full table-fixed text-sm">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <TableHeader
                                        width="w-[14%] lg:w-[12%] xl:w-[14%]"
                                        sortable={true}
                                        sortKey="nomDossier"
                                        sortConfig={sortConfig}
                                        onSort={handleSort}
                                    >
                                        Dossier
                                    </TableHeader>
                                    <TableHeader
                                        width="w-[18%] lg:w-[20%] xl:w-[18%]"
                                        responsiveClass="hidden xl:table-cell"
                                    >
                                        Client
                                    </TableHeader>
                                    <TableHeader
                                        width="w-[18%] lg:w-[16%] xl:w-[18%]"
                                        responsiveClass="hidden lg:table-cell"
                                    >
                                        Modules
                                    </TableHeader>
                                    <TableHeader
                                        width="w-[14%] lg:w-[12%] xl:w-[14%]"
                                        responsiveClass="hidden xl:table-cell"
                                    >
                                        Ville
                                    </TableHeader>
                                    <TableHeader
                                        width="w-[18%] lg:w-[20%] xl:w-[18%]"
                                        sortable={true}
                                        sortKey="periode"
                                        sortConfig={sortConfig}
                                        onSort={handleSort}
                                        responsiveClass="hidden lg:table-cell"
                                    >
                                        Période
                                    </TableHeader>
                                    <TableHeader width="w-[12%] lg:w-[10%] xl:w-[12%]">
                                        Statut
                                    </TableHeader>
                                    <TableHeader
                                        width="w-[10%] lg:w-[10%] xl:w-[10%]"
                                        sortable={true}
                                        sortKey="montant"
                                        sortConfig={sortConfig}
                                        onSort={handleSort}
                                    >
                                        Montant
                                    </TableHeader>
                                </tr>
                            </thead>

                            <tbody>
                                <AnimatePresence>
                                    {currentItems.map((dossier, index) => (
                                        <tr
                                            key={dossier.idDossier}
                                            className={`cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                } hover:bg-blue-50 transition-colors`}
                                            onClick={(e) => {
                                                if (!e.defaultPrevented) navigate(`/cfp/dossier/detail/${dossier.idDossier}`);
                                            }}
                                        >

                                            <td className="px-3 py-2 w-[14%] lg:w-[12%] xl:w-[14%]">
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon
                                                        icon={faFolder}
                                                        className="text-yellow-500 w-4 h-4 mr-2"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <div
                                                            className="font-semibold text-gray-500 text-sm leading-none truncate"
                                                            title={dossier.nomDossier}
                                                        >
                                                            {dossier.nomDossier || "—"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td
                                                className="px-3 py-2 w-[18%] lg:w-[20%] xl:w-[18%] hidden xl:table-cell"
                                            >
                                                <ClientCell entreprises={dossier.entreprises} />
                                            </td>

                                            <td
                                                className="px-3 py-2 w-[18%] lg:w-[16%] xl:w-[18%] truncate text-gray-700 text-sm leading-none hidden lg:table-cell"
                                                title={
                                                    Array.isArray(dossier.module_names)
                                                        ? dossier.module_names.join(", ")
                                                        : "—"
                                                }
                                            >
                                                {Array.isArray(dossier.module_names)
                                                    ? dossier.module_names.join(", ")
                                                    : "—"}
                                            </td>

                                            <td
                                                className="px-3 py-2 w-[14%] lg:w-[12%] xl:w-[14%] truncate text-gray-700 text-sm leading-none hidden xl:table-cell"
                                                title={
                                                    Array.isArray(dossier.villes) ? dossier.villes.join(", ") : "—"
                                                }
                                            >
                                                {Array.isArray(dossier.villes) ? dossier.villes.join(", ") : "—"}
                                            </td>

                                            <td
                                                className="px-3 py-2 w-[18%] lg:w-[20%] xl:w-[18%] truncate text-gray-700 text-sm leading-none hidden lg:table-cell"
                                                title={formatPeriode(dossier.dateMinProjet, dossier.dateMaxProjet)}
                                            >
                                                {formatPeriode(dossier.dateMinProjet, dossier.dateMaxProjet)}
                                            </td>

                                            <td className="px-3 py-2 w-[12%] lg:w-[10%] xl:w-[12%] text-center">
                                                <StatusBadge status={dossier.status} />
                                            </td>

                                            <td
                                                className="px-3 py-2 w-[10%] lg:w-[10%] xl:w-[10%] text-right font-semibold text-gray-500 text-sm leading-none"
                                                title={formatMontant(dossier.montantTotal, currency_unit)}
                                            >
                                                {formatMontant(dossier.montantTotal, currency_unit)}
                                            </td>
                                        </tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>

                        </table>
                    </div>

                    {/* Version Mobile - Cartes */}
                    <div className="lg:hidden space-y-3 p-2">
                        <AnimatePresence>
                            {currentItems.map((dossier) => (
                                <MobileCard
                                    key={dossier.idDossier}
                                    dossier={dossier}
                                    onClick={() =>
                                        navigate(`/cfp/dossier/detail/${dossier.idDossier}`)
                                    }
                                    formatPeriode={formatPeriode}
                                    currency_unit={currency_unit}
                                />
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Pagination */}
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-xs text-gray-600 order-2 sm:order-1">
                                {indexOfFirstItem + 1}-
                                {Math.min(indexOfLastItem, sortedAndFiltered.length)} sur{" "}
                                {sortedAndFiltered.length} dossiers
                            </div>

                            <div className="flex items-center space-x-1 order-1 sm:order-2">
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className={`p-1 rounded border ${currentPage === 1
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-white text-gray-600 hover:bg-gray-50 border-gray-300"
                                        }`}
                                >
                                    <ChevronLeftIcon className="w-3 h-3" />
                                </button>

                                <div className="flex space-x-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const page = i + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => paginate(page)}
                                                className={`px-2 py-1 text-xs rounded min-w-[32px] ${currentPage === page
                                                    ? "bg-purple-600 text-white"
                                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className={`p-1 rounded border ${currentPage === totalPages
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-white text-gray-600 hover:bg-gray-50 border-gray-300"
                                        }`}
                                >
                                    <ChevronRightIcon className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FolderTable;
