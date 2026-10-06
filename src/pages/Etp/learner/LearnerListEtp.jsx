import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from '../../../config/axios';
import ProfileCard from './Liste/ProfileCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useFilter } from '../../../contexts/etp/FilterContext';
import { useEntreprises } from '../../../contexts/etp/EntreprisesContexte';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGE_URL } from "../../../config/env";

// Fonction utilitaire pour vérifier si les informations de l'employé sont complètes
const hasCompleteInfo = (employe) => {
    return employe.emp_name &&
        employe.emp_firstname &&
        employe.emp_matricule &&
        employe.etp_name &&
        employe.emp_email &&
        employe.emp_phone;
};

// Composant pour afficher une erreur avec un bouton de réessai
const ErrorDisplay = ({ error, onRetry }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-center text-gray-800">Une erreur est survenue</h3>
            <p className="mb-6 text-center text-gray-600">{error}</p>
            <button
                onClick={onRetry}
                className="block w-full px-4 py-3 font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
            >
                Réessayer
            </button>
        </div>
    </div>
);

function LearnerListEtp() {
    // Clé pour forcer le rafraîchissement des données
    const [refreshKey, setRefreshKey] = useState(0);
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Utilisation des hooks de contexte pour les filtres et les données d'entreprise
    const {
        filters,
        searchTerm,
        isSearching,
        userType,
        availableCompanies,
        setAvailableCompanies
    } = useFilter();
    const { setEntreprises } = useEntreprises();

    // États pour gérer les données, le chargement, les erreurs et la pagination
    const [employesData, setEmployesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);
    const endpoint = IMAGE_URL;
    const [currentTotalItems, setCurrentTotalItems] = useState(0);
    const [newEmployees, setNewEmployees] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);

    // Fonction de rappel pour gérer la mise à jour des employés, mémorisée avec useCallback
    const handleEmployeeUpdated = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    // Fonction de rappel pour gérer la suppression des employés, mémorisée avec useCallback
    const handleEmployeeDeleted = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    // Fonction pour gérer l'ajout d'un nouvel employé
    const handleEmployeeAdded = useCallback((newEmployee) => {
        // Ajouter l'employé à la liste des nouveaux employés
        setNewEmployees(prev => [...prev, newEmployee.id]);
        
        // Rafraîchir la liste après un court délai pour permettre l'animation
        setTimeout(() => {
            setRefreshKey(prev => prev + 1);
            // Retirer l'employé de la liste des nouveaux après 3 secondes
            setTimeout(() => {
                setNewEmployees(prev => prev.filter(id => id !== newEmployee.id));
            }, 3000);
        }, 500);
    }, []);

    // Fonction pour récupérer les employés, mémorisée avec useCallback
    const fetchEmployes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            params.append('page', currentPage);
            params.append('per_page', itemsPerPage);

            // Ajout des filtres de recherche aux paramètres de l'URL
            if (filters.companies && filters.companies.length > 0) {
                params.append('companies', filters.companies.join(','));
            }
            if (filters.activeStatus && filters.activeStatus !== 'all') {
                params.append('activeStatus', filters.activeStatus);
            }
            if (searchTerm) {
                params.append('search', searchTerm);
            }

            // Ne pas envoyer le filtre infoStatus au serveur car il ne fonctionne pas correctement
            // Nous allons le gérer côté client

            const response = await Axios.get(`/etp/employes?${params.toString()}`);

            setEmployesData(response.data);
            if (setEntreprises) setEntreprises(response.data.entreprises || []);
            
            // Mettre à jour les entreprises disponibles pour le filtre
            if (response.data.entreprises && setAvailableCompanies) {
                setAvailableCompanies(response.data.entreprises);
            }

            const totalItems = response.data.checkEtpGrp
                ? response.data.empGrps?.total || 0
                : response.data.employes?.total || 0;

            setCurrentTotalItems(totalItems);
            setError(null);
        } catch (err) {
            console.error('Erreur lors du chargement des employés:', err);
            setError("Vous n'avez pas l'autorisation nécessaire pour visiter cette adresse !");
            setEmployesData(null);
            setCurrentTotalItems(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, setEntreprises, filters.companies, filters.activeStatus, searchTerm, itemsPerPage, setAvailableCompanies]);

    // Effet de bord pour déclencher la récupération des employés lors de changements
    useEffect(() => {
        fetchEmployes();
    }, [fetchEmployes, refreshKey]);

    // Fonction pour déterminer quelle liste d'employés afficher
    const getEmployesToDisplay = () => {
        let employees = [];
        
        if (employesData?.checkEtpGrp) {
            employees = employesData.empGrps?.data || [];
        } else {
            employees = employesData?.employes?.data || [];
        }

        // Appliquer le filtre infoStatus côté client
        if (filters.infoStatus && filters.infoStatus !== 'all') {
            employees = employees.filter(employe => {
                const isComplete = hasCompleteInfo(employe);
                return filters.infoStatus === 'complete' ? isComplete : !isComplete;
            });
        }

        return employees;
    };

    const employesToDisplay = getEmployesToDisplay();

    // Calcul du nombre total de pages, mémorisée avec useMemo
    const totalPages = useMemo(() => {
        if (employesData?.checkEtpGrp) {
            return employesData.empGrps?.last_page || 1;
        } else {
            return employesData?.employes?.last_page || 1;
        }
    }, [employesData]);

    // Fonctions de navigation pour la pagination
    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleRetry = () => {
        setError(null);
        setCurrentPage(1);
        setRefreshKey(prev => prev + 1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Rendu des numéros de pagination
    const renderPaginationNumbers = () => {
        if (currentTotalItems <= itemsPerPage) return null;

        const pageNumbers = [];
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${currentPage === i
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:text-purple-600'
                        }`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex items-center space-x-1">
                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => handlePageChange(1)}
                            className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-purple-600"
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
                    </>
                )}
                {pageNumbers}
                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-purple-600"
                        >
                            {totalPages}
                        </button>
                    </>
                )}
            </div>
        );
    };

    // Vérifie si des filtres sont actifs
    const hasActiveFilters = searchTerm ||
        filters.infoStatus !== 'all' ||
        filters.activeStatus !== 'all' ||
        (filters.companies && filters.companies.length > 0);

    if (error) {
        return <ErrorDisplay error={error} onRetry={handleRetry} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            {/* Lien pour accéder à la liste de batch, en utilisant le composant Link de React Router */}
            {/* <Link
                to="/etp/employe/batch"
                className="inline-block mb-6 px-4 py-2 bg-gray-500 text-white rounded-lg 
               hover:bg-blue-600 transition-all duration-300 ease-in-out 
               animate-pulse hover:animate-none hover:scale-105"
            >
                Liste des batches
            </Link> */}

            <div className="max-w-7xl mx-auto">
                {/* Affichage du message de chargement */}
                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        <span className="ml-3 text-gray-600">Chargement...</span>
                    </div>
                )}

                {/* Affichage du nombre d'employés et de la pagination */}
                <div className="mb-4 flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                        {currentTotalItems} employé(s) au total
                        {hasActiveFilters ? (
                            <span className="ml-2 text-purple-500">
                                ({employesToDisplay.length} résultat(s) filtré(s))
                            </span>
                        ) : (
                            <span className="ml-2 text-purple-500">
                                (Page {currentPage} sur {totalPages})
                            </span>
                        )}
                    </p>
                </div>

                {!loading && (
                    <>
                        {/* Grille d'affichage des cartes de profil */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            <AnimatePresence>
                                {employesToDisplay.length > 0 ? (
                                    employesToDisplay.map(employe => {
                                        // Détermine le nom de l'entreprise à afficher
                                        const etpNameToDisplay = employe.etp_name === '--'
                                            ? employe.etp_name_parent
                                            : (employe.etp_name || employe.customerName || '—');

                                        const isNewEmployee = newEmployees.includes(employe.idEmploye || employe.id);

                                        return (
                                            <motion.div
                                                key={employe.idEmploye || employe.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3 }}
                                                layout
                                            >
                                                <ProfileCard
                                                    idEtp={employe.idEtp || employe.idEntreprise}
                                                    id={employe.idEmploye || employe.id}
                                                    etpName={etpNameToDisplay}
                                                    matricule={employe.emp_matricule || employe.matricule}
                                                    nom={employe.emp_name || employe.name}
                                                    prenom={employe.emp_firstname || employe.firstName}
                                                    mail={employe.emp_email || employe.email}
                                                    telephone={employe.emp_phone || employe.phone}
                                                    fonction={employe.emp_fonction || employe.fonction}
                                                    img={
                                                        employe.emp_photo?.trim() && employe.emp_photo.trim().toLowerCase() !== 'photo'
                                                            ? `${endpoint}/img/employes/${employe.emp_photo}`
                                                            : (employe.photo?.trim() && employe.photo.trim().toLowerCase() !== 'photo'
                                                                ? `${endpoint}/img/employes/${employe.photo}`
                                                                : null)
                                                    }
                                                    empService={employe.user_is_in_service}
                                                    infoComplete={hasCompleteInfo(employe)}
                                                    onUpdate={handleEmployeeUpdated}
                                                    onDelete={handleEmployeeDeleted}
                                                    ville={employe.ville}
                                                    codePostal={employe.code_postal}
                                                    lot={employe.lot}
                                                    quartier={employe.quartier}
                                                    isNew={isNewEmployee}
                                                />
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    // Message à afficher lorsqu'aucun employé n'est trouvé
                                    <div className="col-span-full py-16 text-center">
                                        <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun employé trouvé</h3>
                                        <p className="text-gray-500 mb-6">
                                            {hasActiveFilters
                                                ? "Aucun résultat ne correspond à votre recherche ou filtres"
                                                : "La liste des employés est vide"
                                            }
                                        </p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Pagination */}
                        {currentTotalItems > itemsPerPage && (
                            <div className="flex flex-col items-center justify-between mt-12 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="mb-4 text-sm text-gray-600 sm:mb-0">
                                    Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à <span className="font-medium">{Math.min(currentPage * itemsPerPage, currentTotalItems)}</span> sur <span className="font-medium">{currentTotalItems}</span> employés
                                </div>
                                <nav className="flex items-center space-x-2">
                                    <button
                                        onClick={goToPrevPage}
                                        disabled={currentPage === 1}
                                        className="p-3 text-gray-500 bg-white border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                                    >
                                        <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                                    </button>
                                    {renderPaginationNumbers()}
                                    <button
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                        className="p-3 text-gray-500 bg-white border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                                    >
                                        <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default LearnerListEtp;