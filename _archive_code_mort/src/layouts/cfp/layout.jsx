import React, { useState, useContext, useEffect, useRef, useCallback, useMemo } from 'react';
import NavbarLearner from '../../components/navbar/navbar-learner';
import axios from '../../config/axios';
import { useProjectLearnerContext } from '../../contexts/cfp/ProjectLearnerContext';
import { ViewContext } from '../../contexts/cfp/ViewContext';
import { SearchLearnerContext } from '../../contexts/cfp/SearchLearnerContext';
import { useTranslation } from 'react-i18next';
import { LearnerContext } from '../../contexts/cfp/LearnerContext';
import toastr from 'toastr';
import {SearchLearnerProvider} from '../../contexts/cfp/SearchLearnerContext';

// Configuration de toastr
toastr.options = {
    positionClass: "toast-top-center",
    timeOut: 6000,
    progressBar: true,
};

// Constants
const DROPDOWN_TYPES = {
    ENTREPRISE: 'entreprise',
    PERIODE: 'periode',
    COURS: 'cours',
    MODALITE: 'modalite',
    STATUS: 'status',
};

const PERIODE_LABELS = {
    prev_3_month: 'last_3_months',
    prev_6_month: 'last_6_months',
    prev_12_month: 'last_12_months',
    next_3_month: 'next_3_months',
    next_6_month: 'next_6_months',
    next_12_month: 'next_12_months',
};

// Custom Hooks
const useFilterData = () => {
    const [companiesList, setCompaniesList] = useState([]);
    const [coursesList, setCoursesList] = useState([]);
    const [modalitiesList, setModalitiesList] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [periodesList, setPeriodesList] = useState([]);

    const fetchDropdownData = useCallback(async () => {
        try {
            const response = await axios.get('/cfp/apprenants/filter/dropdown');
            const { data } = response;

            setCompaniesList(data?.etps || []);
            setCoursesList(data?.modules || []);
            setModalitiesList(data?.modalites || []);
            setStatusList(data?.status || []);

            // Construction des périodes avec valeurs par défaut
            const periodesData = [
                data?.periodePrev3 || { p_id_periode: 'prev_3_month', emp_nb: 0 },
                data?.periodePrev6 || { p_id_periode: 'prev_6_month', emp_nb: 0 },
                data?.periodePrev12 || { p_id_periode: 'prev_12_month', emp_nb: 0 },
                data?.periodeNext3 || { p_id_periode: 'next_3_month', emp_nb: 0 },
                data?.periodeNext6 || { p_id_periode: 'next_6_month', emp_nb: 0 },
                data?.periodeNext12 || { p_id_periode: 'next_12_month', emp_nb: 0 },
            ];
            setPeriodesList(periodesData);
        } catch (error) {
            console.error("Erreur lors de la récupération des données du dropdown :", error);
        }
    }, []);

    return {
        companiesList,
        coursesList,
        modalitiesList,
        statusList,
        periodesList,
        fetchDropdownData,
    };
};

const useFilterSearch = (initialList) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredList, setFilteredList] = useState(initialList);

    useEffect(() => {
        setFilteredList(initialList);
    }, [initialList]);

    useEffect(() => {
        const filtered = initialList.filter((item) => {
            const searchField = item.etp_name || item.module_name || item.project_modality || item.project_status || '';
            return searchField.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setFilteredList(filtered);
    }, [searchTerm, initialList]);

    return {
        searchTerm,
        setSearchTerm,
        filteredList,
    };
};

// Components
const SearchInput = ({ onChange, placeholder = "Search" }) => (
    <div className="relative flex items-center w-full px-3 py-1 border border-gray-300 rounded-md">
        <input
            type="search"
            className="w-full focus:outline-none"
            placeholder={placeholder}
            onChange={onChange}
        />
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
        >
            <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
            />
        </svg>
    </div>
);

const DropdownHeader = ({ title, hasSelection, isOpen, onClick }) => (
    <div
        tabIndex={0}
        className="inline-flex items-center w-full"
        onClick={onClick}
    >
        <span
            className={`w-full px-3 py-2 border-[3px] rounded-md ${hasSelection
                ? "border-2 border-[#A462A4] hover:bg-[#934f93]/20"
                : "bg-white border-gray-300 text-gray-800"
                } flex items-center justify-between cursor-pointer transition-colors duration-200`}
        >
            {title}
            <i
                className={`fa-solid fa-chevron-down transition-transform duration-200 ${hasSelection ? "text-black" : ""
                    } ${isOpen ? "transform rotate-180" : ""}`}
                aria-hidden="true"
            />
        </span>
    </div>
);

const DropdownContent = ({ children, isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute z-50 w-full p-3 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
            {children}
        </div>
    );
};

const CheckboxItem = ({ value, label, count, isSelected, onChange }) => (
    <div className="p-1 rounded-md hover:bg-gray-100">
        <div className="grid grid-cols-6">
            <div className="grid col-span-5 truncate grid-cols-subgrid" title={label}>
                <span className="flex items-center gap-2 px-2">
                    <input
                        type="checkbox"
                        value={value}
                        className="w-4 h-4 cursor-pointer transition-colors duration-200 border border-gray-300 rounded-sm checked:ring-1 checked:ring-offset-1 checked:ring-[#A462A4] checked:bg-[#A462A4]"
                        checked={isSelected}
                        onChange={onChange}
                    />
                    <p className="text-gray-500">{label}</p>
                </span>
            </div>
            {count !== undefined && (
                <div className="flex items-center justify-end col-span-1">
                    {count}
                </div>
            )}
        </div>
    </div>
);

const RadioItem = ({ value, label, count, isSelected, onChange, name }) => (
    <div className="p-2 rounded-md cursor-pointer hover:bg-gray-100">
        <label className="flex items-center w-full">
            <input
                type="radio"
                name={name}
                value={value}
                className="w-4 h-4 mr-2 text-purple-500 focus:ring-purple-500"
                checked={isSelected}
                onChange={onChange}
            />
            <span className="flex-grow">{label}</span>
            <span className="ml-2 text-gray-700">{count}</span>
        </label>
    </div>
);

// Main Component
function Layout({ children }) {
    const { setApprFiltre, apprFiltre } = useContext(LearnerContext);
    const { setView, view } = useContext(ViewContext);
    const { setSearchTerm } = useContext(SearchLearnerContext);
    const { projetsapprfiltre, setProjetsApprfiltre } = useProjectLearnerContext();
    const { t } = useTranslation();

    // States
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [selectedModalities, setSelectedModalities] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [selectedPeriodes, setSelectedPeriodes] = useState('');

    const [openDropdown, setOpenDropdown] = useState({
        [DROPDOWN_TYPES.ENTREPRISE]: false,
        [DROPDOWN_TYPES.PERIODE]: false,
        [DROPDOWN_TYPES.COURS]: false,
        [DROPDOWN_TYPES.MODALITE]: false,
        [DROPDOWN_TYPES.STATUS]: false,
    });

    const dropdownRef = useRef(null);

    // Custom hooks
    const {
        companiesList,
        coursesList,
        modalitiesList,
        statusList,
        periodesList,
        fetchDropdownData,
    } = useFilterData();

    const {
        searchTerm: companySearchTerm,
        setSearchTerm: setCompanySearchTerm,
        filteredList: filteredCompaniesList,
    } = useFilterSearch(companiesList);

    const {
        searchTerm: courseSearchTerm,
        setSearchTerm: setCourseSearchTerm,
        filteredList: filteredCoursesList,
    } = useFilterSearch(coursesList);

    const {
        searchTerm: modalitySearchTerm,
        setSearchTerm: setModalitySearchTerm,
        filteredList: filteredModalitiesList,
    } = useFilterSearch(modalitiesList);

    const {
        searchTerm: statusSearchTerm,
        setSearchTerm: setStatusSearchTerm,
        filteredList: filteredStatusList,
    } = useFilterSearch(statusList);

    // Memoized values
    const hasSelectedFilters = useMemo(() => ({
        companies: selectedCompanies.length > 0,
        courses: selectedCourses.length > 0,
        modalities: selectedModalities.length > 0,
        status: selectedStatus.length > 0,
        periodes: selectedPeriodes !== '',
    }), [selectedCompanies, selectedCourses, selectedModalities, selectedStatus, selectedPeriodes]);

    // API call with debouncing
    const onSearchChange = useCallback(async (
        companyFilter,
        courseFilter,
        modalityFilter,
        statusFilter,
        periodeFilter
    ) => {
        try {
            const params = new URLSearchParams({
                idEtp: (companyFilter || []).join(','),
                idModule: (courseFilter || []).join(','),
                idModalite: (modalityFilter || []).join(','),
                idStatut: (statusFilter || []).join(','),
                idPeriode: periodeFilter || ''
            });

            const response = await axios.get(`/cfp/apprenants/filter/items?${params.toString()}`);
            setApprFiltre(response.data.apprs);
        } catch (error) {
            console.error("Erreur lors du filtrage :", error);
        }
    }, [setApprFiltre]);

    // Event handlers
    const handleFilterChange = useCallback((type, newValue) => {
        const updates = {
            companies: selectedCompanies,
            courses: selectedCourses,
            modalities: selectedModalities,
            status: selectedStatus,
            periodes: selectedPeriodes,
        };

        updates[type] = newValue;

        onSearchChange(
            updates.companies,
            updates.courses,
            updates.modalities,
            updates.status,
            updates.periodes
        );
    }, [selectedCompanies, selectedCourses, selectedModalities, selectedStatus, selectedPeriodes, onSearchChange]);

    const handleCompanyCheckboxChange = useCallback((event) => {
        const companyId = parseInt(event.target.value);
        const isChecked = event.target.checked;
        const newSelectedCompanies = isChecked
            ? [...selectedCompanies, companyId]
            : selectedCompanies.filter((id) => id !== companyId);

        setSelectedCompanies(newSelectedCompanies);
        handleFilterChange('companies', newSelectedCompanies);
    }, [selectedCompanies, handleFilterChange]);

    const handleCourseCheckboxChange = useCallback((event) => {
        const courseId = parseInt(event.target.value);
        const isChecked = event.target.checked;
        const newSelectedCourses = isChecked
            ? [...selectedCourses, courseId]
            : selectedCourses.filter((id) => id !== courseId);

        setSelectedCourses(newSelectedCourses);
        handleFilterChange('courses', newSelectedCourses);
    }, [selectedCourses, handleFilterChange]);

    const handleModalityCheckboxChange = useCallback((event) => {
        const modality = event.target.value;
        const isChecked = event.target.checked;
        const newSelectedModalities = isChecked
            ? [...selectedModalities, modality]
            : selectedModalities.filter((m) => m !== modality);

        setSelectedModalities(newSelectedModalities);
        handleFilterChange('modalities', newSelectedModalities);
    }, [selectedModalities, handleFilterChange]);

    const handleStatusCheckboxChange = useCallback((event) => {
        const status = event.target.value;
        const isChecked = event.target.checked;
        const newSelectedStatus = isChecked
            ? [...selectedStatus, status]
            : selectedStatus.filter((s) => s !== status);

        setSelectedStatus(newSelectedStatus);
        handleFilterChange('status', newSelectedStatus);
    }, [selectedStatus, handleFilterChange]);

    const handlePeriodeRadioChange = useCallback((event) => {
        const periodeId = event.target.value;
        setSelectedPeriodes(periodeId);
        handleFilterChange('periodes', periodeId);
    }, [handleFilterChange]);

    const toggleDropdown = useCallback((dropdown) => {
        setOpenDropdown((prev) => ({
            ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
            [dropdown]: !prev[dropdown],
        }));
    }, []);

    const closeAllDropdowns = useCallback(() => {
        setOpenDropdown({
            [DROPDOWN_TYPES.ENTREPRISE]: false,
            [DROPDOWN_TYPES.PERIODE]: false,
            [DROPDOWN_TYPES.COURS]: false,
            [DROPDOWN_TYPES.MODALITE]: false,
            [DROPDOWN_TYPES.STATUS]: false,
        });
    }, []);

    const handleSearchChange = useCallback((event) => {
        const value = event.target.value;
        setSearchQuery(value);
        setSearchTerm(value);
    }, [setSearchTerm]);

    const handleResetFilter = useCallback(() => {
        // Réinitialiser tous les filtres
        setSelectedCompanies([]);
        setSelectedCourses([]);
        setSelectedModalities([]);
        setSelectedStatus([]);
        setSelectedPeriodes('');
        setSearchQuery('');
        setSearchTerm('');

        // Appeler le filtre avec des valeurs vides pour récupérer tous les résultats
        onSearchChange([], [], [], [], '');
    }, [onSearchChange, setSearchTerm]);

    const toggleFilterVisibility = useCallback(() => {
        setIsFilterVisible(!isFilterVisible);
    }, [isFilterVisible]);

    // Effects
    useEffect(() => {
        fetchDropdownData();
    }, [fetchDropdownData]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeAllDropdowns();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [closeAllDropdowns]);

    // Helper functions
    const isSelected = useCallback((type, value) => {
        switch (type) {
            case 'company':
                return selectedCompanies.includes(value);
            case 'course':
                return selectedCourses.includes(value);
            case 'modality':
                return selectedModalities.includes(value);
            case 'status':
                return selectedStatus.includes(value);
            case 'periode':
                return selectedPeriodes === value;
            default:
                return false;
        }
    }, [selectedCompanies, selectedCourses, selectedModalities, selectedStatus, selectedPeriodes]);

    const renderChildren = () => {
        return React.Children.map(children, (child) => {
            if (React.isValidElement(child) && typeof child.type !== 'string') {
                return React.cloneElement(child, {
                    search: searchQuery,
                    companyFilter: selectedCompanies,
                    courseFilter: selectedCourses,
                    modalityFilter: selectedModalities,
                    statusFilter: selectedStatus,
                    periodeFilter: selectedPeriodes,
                    apprFiltre: apprFiltre,
                    projetsapprfiltre: projetsapprfiltre,
                    setProjetsApprfiltre: setProjetsApprfiltre
                });
            }
            return child;
        });
    };

    return (
        <div className="flex flex-col bg-gray-50">
            <SearchLearnerProvider>            <NavbarLearner
                isFilterVisible={isFilterVisible}
                onFilterToggle={setIsFilterVisible}
            /></SearchLearnerProvider>

            {/* 
      <div className="px-4 mt-4">
        <button
          onClick={toggleFilterVisibility}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isFilterVisible
            ? "bg-[#A462A4] text-white"
            : "bg-gray-300 text-gray-700 hover:bg-gray-200"
            }`}
          title={t('filtre')}
        >
          <i className="text-xl fa-solid fa-filter" />
          <span className="hidden sm:inline">{t('filter')}</span>
          {isFilterVisible ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </button>
      </div> */}

            {isFilterVisible && (
                <section
                    id="filterSection"
                    className="p-2 mx-2 mt-1 bg-white border border-gray-300 rounded-lg shadow-md"
                    ref={dropdownRef}
                >
                    <div className="flex flex-col">
                        <div className="flex flex-col gap-2 p-1 mb-3 bg-white rounded-lg shadow-sm">
                            <div className="grid my-1 md:grid-cols-3 gap-x-2 gap-y-3">

                                {/* Filtre Entreprise */}
                                <div className="relative">
                                    <DropdownHeader
                                        title={t("companies")}
                                        hasSelection={hasSelectedFilters.companies}
                                        isOpen={openDropdown[DROPDOWN_TYPES.ENTREPRISE]}
                                        onClick={() => toggleDropdown(DROPDOWN_TYPES.ENTREPRISE)}
                                    />

                                    <DropdownContent isOpen={openDropdown[DROPDOWN_TYPES.ENTREPRISE]}>
                                        <div className="flex items-center justify-between w-full">
                                            <h5 className="text-xl font-bold text-gray-700">
                                                {t("companies")}
                                            </h5>
                                        </div>

                                        <div className="flex items-center gap-3 my-2">
                                            <SearchInput
                                                onChange={(e) => setCompanySearchTerm(e.target.value)}
                                            />
                                        </div>

                                        <div className="w-full flex flex-col space-y-2 max-h-[20em] overflow-y-auto my-2">
                                            {filteredCompaniesList.map((company) => (
                                                <CheckboxItem
                                                    key={company.idEtp}
                                                    value={company.idEtp}
                                                    label={company.etp_name}
                                                    count={company.emp_nb}
                                                    isSelected={isSelected('company', company.idEtp)}
                                                    onChange={handleCompanyCheckboxChange}
                                                />
                                            ))}
                                        </div>
                                    </DropdownContent>
                                </div>

                                {/* Filtre Période */}
                                <div className="relative">
                                    <DropdownHeader
                                        title={t("training_period")}
                                        hasSelection={hasSelectedFilters.periodes}
                                        isOpen={openDropdown[DROPDOWN_TYPES.PERIODE]}
                                        onClick={() => toggleDropdown(DROPDOWN_TYPES.PERIODE)}
                                    />

                                    <DropdownContent isOpen={openDropdown[DROPDOWN_TYPES.PERIODE]}>
                                        <div className="flex items-center justify-between w-full">
                                            <h5 className="text-xl font-bold text-gray-700">
                                                {t("training_period")}
                                            </h5>
                                        </div>

                                        <div className="w-full flex flex-col space-y-2 max-h-[20em] overflow-y-auto my-2">
                                            {periodesList.map((periode) => (
                                                <RadioItem
                                                    key={periode.p_id_periode}
                                                    value={periode.p_id_periode}
                                                    label={t(PERIODE_LABELS[periode.p_id_periode])}
                                                    count={periode.emp_nb}
                                                    isSelected={isSelected('periode', periode.p_id_periode)}
                                                    onChange={handlePeriodeRadioChange}
                                                    name="periode"
                                                />
                                            ))}
                                        </div>
                                    </DropdownContent>
                                </div>

                                {/* Filtre Cours */}
                                <div className="relative">
                                    <DropdownHeader
                                        title={t("courses")}
                                        hasSelection={hasSelectedFilters.courses}
                                        isOpen={openDropdown[DROPDOWN_TYPES.COURS]}
                                        onClick={() => toggleDropdown(DROPDOWN_TYPES.COURS)}
                                    />

                                    <DropdownContent isOpen={openDropdown[DROPDOWN_TYPES.COURS]}>
                                        <div className="flex items-center justify-between w-full">
                                            <h5 className="text-xl font-bold text-gray-700">
                                                {t("courses")}
                                            </h5>
                                        </div>

                                        <div className="flex items-center gap-3 my-2">
                                            <SearchInput
                                                onChange={(e) => setCourseSearchTerm(e.target.value)}
                                            />
                                        </div>

                                        <div className="w-full flex flex-col space-y-2 max-h-[20em] overflow-y-auto my-2">
                                            {filteredCoursesList.map((course) => (
                                                <CheckboxItem
                                                    key={course.idModule}
                                                    value={course.idModule}
                                                    label={course.module_name}
                                                    isSelected={isSelected('course', course.idModule)}
                                                    onChange={handleCourseCheckboxChange}
                                                />
                                            ))}
                                        </div>
                                    </DropdownContent>
                                </div>

                                {/* Filtre Modalité */}
                                <div className="relative">
                                    <DropdownHeader
                                        title={t("training_method")}
                                        hasSelection={hasSelectedFilters.modalities}
                                        isOpen={openDropdown[DROPDOWN_TYPES.MODALITE]}
                                        onClick={() => toggleDropdown(DROPDOWN_TYPES.MODALITE)}
                                    />

                                    <DropdownContent isOpen={openDropdown[DROPDOWN_TYPES.MODALITE]}>
                                        <div className="flex items-center justify-between w-full">
                                            <h5 className="text-xl font-bold text-gray-700">
                                                {t("training_method")}
                                            </h5>
                                        </div>

                                        <div className="flex items-center gap-3 my-2">
                                            <SearchInput
                                                onChange={(e) => setModalitySearchTerm(e.target.value)}
                                            />
                                        </div>

                                        <div className="w-full flex flex-col space-y-2 max-h-[20em] overflow-y-auto my-2">
                                            {filteredModalitiesList.map((modality) => (
                                                <CheckboxItem
                                                    key={modality.project_modality}
                                                    value={modality.project_modality}
                                                    label={modality.project_modality}
                                                    count={modality.emp_nb}
                                                    isSelected={isSelected('modality', modality.project_modality)}
                                                    onChange={handleModalityCheckboxChange}
                                                />
                                            ))}
                                        </div>
                                    </DropdownContent>
                                </div>

                                {/* Filtre Status */}
                                <div className="relative">
                                    <DropdownHeader
                                        title={t("training_status")}
                                        hasSelection={hasSelectedFilters.status}
                                        isOpen={openDropdown[DROPDOWN_TYPES.STATUS]}
                                        onClick={() => toggleDropdown(DROPDOWN_TYPES.STATUS)}
                                    />

                                    <DropdownContent isOpen={openDropdown[DROPDOWN_TYPES.STATUS]}>
                                        <div className="flex items-center justify-between w-full">
                                            <h5 className="text-xl font-bold text-gray-700">
                                                {t("training_status")}
                                            </h5>
                                        </div>

                                        <div className="flex items-center gap-3 my-2">
                                            <SearchInput
                                                onChange={(e) => setStatusSearchTerm(e.target.value)}
                                            />
                                        </div>

                                        <div className="w-full flex flex-col space-y-2 max-h-[20em] overflow-y-auto my-2">
                                            {filteredStatusList.map((status) => (
                                                <CheckboxItem
                                                    key={status.project_status}
                                                    value={status.project_status}
                                                    label={status.project_status}
                                                    count={status.emp_nb}
                                                    isSelected={isSelected('status', status.project_status)}
                                                    onChange={handleStatusCheckboxChange}
                                                />
                                            ))}
                                        </div>
                                    </DropdownContent>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end space-x-1">
                                <button
                                    id="listView"
                                    className={`p-2 rounded-md ${view === "list"
                                        ? "bg-white text-[#A462A4] border border-[#A462A4] hover:bg-[#A462A4] hover:text-white"
                                        : "hover:bg-gray-200"
                                        }`}
                                    onClick={() => setView('list')}
                                    aria-label="Vue Liste"
                                >
                                    <i className="text-xl fa-solid fa-list" />
                                </button>
                                <button
                                    id="cardView"
                                    className={`p-2 rounded-md ${view === "card"
                                        ? "bg-white text-[#A462A4] border border-[#A462A4] hover:bg-[#A462A4] hover:text-white"
                                        : "hover:bg-gray-200"
                                        }`}
                                    onClick={() => setView('card')}
                                    aria-label="Vue Carte"
                                >
                                    <i className="text-2xl fa-solid fa-square" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {

                                        window.location.reload();
                                    }}

                                    className="flex items-center gap-1 p-2 text-[#A462A4] hover:text-purple-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
                                >
                                    <i className="fa-solid fa-rotate-right" />
                                    <span>{t("reset filter")}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <main className="flex-1 mt-6 overflow-x-hidden overflow-y-auto rounded-t-lg">
                <div className="rounded-lg bg-white-100">
                    {renderChildren()}
                </div>
            </main>
        </div>
    );
}

export default Layout;