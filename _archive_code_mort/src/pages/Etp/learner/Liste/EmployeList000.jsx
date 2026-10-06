
import React, { useState, useEffect, useContext, useMemo } from 'react';
import axiosClient from '../../../axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { EmployeContext } from '../../../contexte/EmployeContexte';
import { useEntreprise } from '../../../contexte/TypeEntrepriseContext';
import { useEntreprises } from '../../../contexte/EntreprisesContexte';
import { useTranslation } from 'react-i18next';

function EmployeList() {
    const { t, i18n } = useTranslation();
    const { setEntreprises } = useEntreprises();
    const { setIsGroupeEntreprise } = useEntreprise();
    const [employesData, setEmployesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);
    const endpoint = 'https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg';
    const { searchETerm } = useContext(SearchEtpContext);
    const { emplFiltre } = useContext(EmployeContext);

    const areFiltersActive = emplFiltre && emplFiltre.length > 0;
    const [currentTotalItems, setCurrentTotalItems] = useState(0);

    useEffect(() => {
        const fetchEmployes = async () => {
            if (areFiltersActive) {
                setCurrentTotalItems(emplFiltre.length);
                setLoading(false);
                setError(null);
                setEmployesData(null);
                setCurrentPage(1);
                return;
            }
            try {
                setLoading(true);
                const response = await axiosClient.get(`/etp/employes?page=${currentPage}`);
                // console.log("API Response:", response.data); 

                setEmployesData(response.data);
                setEntreprises(response.data.entreprises);
                setIsGroupeEntreprise(response.data.checkEtpGrp || false);
                setCurrentTotalItems(response.data.checkEtpGrp
                    ? response.data.empGrps?.total
                    : response.data.employes?.total);
                setLoading(false);
                setError(null);
            } catch (err) {
                setError("Vous n'avez pas l'autorisation necessaire pour visiter cette adresse !");
                setLoading(false);
                setEmployesData(null);
                setCurrentTotalItems(0);
            }
        };
        fetchEmployes();
    }, [currentPage, areFiltersActive, emplFiltre]);

    const filterEmployesBySearchTerm = (employes) => {
        if (!searchETerm) return employes;

        const term = searchETerm.toLowerCase();
        return employes.filter(employe => {

            const etpNameToSearch = employe.etp_name === '--'
                ? (employe.etp_name_parent || '')
                : (employe.etp_name || employe.customerName || '');
            return (
                (employe.emp_name?.toLowerCase().includes(term) ||
                    employe.name?.toLowerCase().includes(term)) ||
                (employe.emp_firstname?.toLowerCase().includes(term) ||
                    employe.firstName?.toLowerCase().includes(term)) ||
                (employe.emp_matricule?.toLowerCase().includes(term) ||
                    employe.matricule?.toLowerCase().includes(term)) ||
                (employe.emp_email?.toLowerCase().includes(term) ||
                    employe.email?.toLowerCase().includes(term)) ||
                etpNameToSearch.toLowerCase().includes(term)
            );
        });
    };

    const getEmployesToDisplay = () => {
        if (areFiltersActive) {
            return filterEmployesBySearchTerm(emplFiltre || []);
        }

        if (employesData?.checkEtpGrp) {
            return filterEmployesBySearchTerm(employesData.empGrps?.data || []);
        }

        return filterEmployesBySearchTerm(employesData?.employes?.data || []);
    };

    const employesToDisplay = getEmployesToDisplay();

    const totalPages = useMemo(() => {
        return Math.ceil(currentTotalItems / itemsPerPage);
    }, [currentTotalItems, itemsPerPage]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const goToPrevPage = () => {
        if (!areFiltersActive && currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const goToNextPage = () => {
        if (!areFiltersActive && currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const renderPaginationNumbers = () => {
        if (areFiltersActive) return null;

        const pageNumbers = [];
        const maxVisible = 5;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 4) {
                pageNumbers.push(1, 2, 3, 4, 5, '...', totalPages);
            } else if (currentPage >= totalPages - 3) {
                pageNumbers.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pageNumbers.push(1, '...', currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, '...', totalPages);
            }
        }

        return pageNumbers.map((number, index) =>
            number === '...' ? (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">...</span>
            ) : (
                <button
                    key={`page-${number}`}
                    onClick={() => setCurrentPage(number)}
                    aria-current={currentPage === number ? 'page' : undefined}
                    className={`!relative !inline-flex !items-center !px-3 !py-2 !text-sm !font-medium
                    !leading-5 !border !border-gray-300
                    ${currentPage === number
                            ? '!bg-[#A462A4] !text-white'
                            : '!bg-white !text-gray-700 hover:!text-[#A462A4] hover:!bg-gray-100 !cursor-pointer'
                        }`}
                >
                    {number}
                </button>
            )
        );
    };

    if (loading && !areFiltersActive) {
        return (
            <div className="flex items-center justify-center mt-2 h-screen w-full bg-gray-50">
                <div className="flex flex-col items-center justify-center gap-6 w-full max-w-xs">
                    {/* Double spinner animé */}
                    <div className="relative w-24 h-24">
                        {/* Grand spinner extérieur */}
                        <div
                            className="absolute inset-0 border-4 border-transparent border-t-[#A462A4] rounded-full animate-spin"
                            style={{ animationDuration: '2s' }}
                        ></div>

                        {/* Petit spinner intérieur */}
                        <div
                            className="absolute inset-4 border-4 border-transparent border-t-purple-300 rounded-full animate-spin"
                            style={{
                                animationDuration: '1.5s',
                                animationDirection: 'reverse'
                            }}
                        ></div>

                        {/* Point central */}
                        <div className="absolute inset-8 bg-[#A462A4] rounded-full"></div>
                    </div>

                    {/* Texte de chargement */}
                    <div className="text-center space-y-2">
                        <p className="text-[#A462A4] font-medium text-lg">Chargement en cours</p>
                        <p className="text-gray-500 text-sm">Veuillez patienter...</p>
                    </div>


                </div>
            </div>
        );
    }

    if (error && !areFiltersActive) {
        return (<div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/70">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md mx-auto">
                <div className="text-red-500 text-center text-5xl animate-bounce">⚠️</div>
                <h3 className="text-xl text-center font-semibold text-gray-800 mb-4"> Une erreur est survenue</h3>
                <p className="text-gray-600 text-center mb-6">{error}</p>
                <div className="flex justify-end space-x-4"></div>
            </div>
        </div>)
    }

    return (
        <section id="content" className="p-14 mt-4">
            <div className="grid grid-cols-1 gap-4 showResult lg:grid-cols-3 xl:grid-cols-4 md:grid-cols-2">
                {employesToDisplay.length > 0 ? (
                    employesToDisplay.map(employe => (
                        <ProfileCard
                            key={employe.idEmploye || employe.id}
                            idEtp={employe.idEtp || employe.idEntreprise}
                            id={employe.idEmploye}
                            etpName={employe.etp_name === '--' ? employe.etp_name_parent : (employe.etp_name || employe.customerName)}
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
                            empInitialName={employe.emp_initial_name || employe.initialName}
                            empService={employe.user_is_in_service}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-600 col-span-full">
                        {searchETerm ? t('no_results') : t('no_results')}
                    </p>
                )}
            </div>

            {!areFiltersActive && currentTotalItems > itemsPerPage && (
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between mt-16">
                    <div>
                        <p className="text-lg leading-5 text-gray-800 dark:text-gray-400">
                            Affichage de <span className="font-medium"> {indexOfFirstItem + 1} </span> - <span className="font-medium"> {Math.min(indexOfLastItem, currentTotalItems)} </span> sur <span className="font-medium"> {currentTotalItems} </span> Employés
                        </p>
                    </div>

                    <div>
                        <span className="relative z-0 inline-flex gap-2 rounded-md rtl:flex-row-reverse">
                            <button onClick={goToPrevPage} disabled={currentPage === 1} aria-disabled={currentPage === 1} aria-label="&laquo; Previous" className={`relative inline-flex items-center px-2 py-2 text-sm font-medium leading-5 text-gray-500 bg-white border border-gray-300 rounded-l-md ${currentPage === 1 ? 'cursor-default opacity-50' : 'hover:text-gray-400 cursor-pointer'}`}>
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>

                            {renderPaginationNumbers()}

                            <button onClick={goToNextPage} disabled={currentPage === totalPages} aria-disabled={currentPage === totalPages} aria-label="Next &raquo;" className={`relative inline-flex items-center px-2 py-2 -ml-px text-sm font-medium leading-5 text-gray-500 bg-white border border-gray-300 rounded-r-md ${currentPage === totalPages ? 'cursor-default opacity-50' : 'hover:text-gray-400 cursor-pointer'}`}>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </span>
                    </div>
                </div>
            )}
        </section>
    );
}

export default EmployeList;













