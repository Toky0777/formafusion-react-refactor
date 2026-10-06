import { useState, useEffect, useMemo } from "react";
import { Filter, RotateCcw, Calendar, Building2 } from "lucide-react";
import { ProjectCard } from "../../../components/card/ProjectCard";
import ProjectTable from "../../../components/table/ProjectTable";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { NavbarEvaluation } from "../../../components/navbar/navbar-evaluation";
import axios from "../../../config/axios";

export function Evaluation() {
    // États pour les filtres
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [showFilter, setShowFilter] = useState(false);

    // États pour l'interface
    const [activeTab, setActiveTab] = useState('termines');
    const [tabs, setTabs] = useState([]);
    const [loading, setLoading] = useState(false);

    // État principal pour stocker les projets groupés par mois
    const [projectsByMonth, setProjectsByMonth] = useState({
        termines: [],
        en_cours: [],
        clotures: []
    });

    /**
     * Fonction pour récupérer les données depuis l'API
     * Les projets arrivent maintenant déjà groupés par mois depuis le backend
     */
    const DataRequest = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/cfp/evaluation/projets`);

            const projectCount = data.projet_counts;

            // Créer les tabs avec les comptes totaux
            setTabs([
                { id: 'termines', label: 'Terminés', count: projectCount.termines || 0 },
                { id: 'en_cours', label: 'En Cours', count: projectCount.en_cours || 0 },
                { id: 'clotures', label: 'Clôturés', count: projectCount.clotures || 0 }
            ]);

            // Stocker les projets groupés par mois (ils viennent déjà groupés du backend)
            setProjectsByMonth({
                termines: data.projets.termines || [],
                en_cours: data.projets.en_cours || [],
                clotures: data.projets.clotures || []
            });

        } catch (error) {
            console.error('Erreur lors du chargement des projets:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fonction pour obtenir tous les projets d'un statut donné (pour les filtres)
     * Extrait tous les projets de tous les mois d'un statut
     */
    const getAllProjectsForStatus = (status) => {
        const monthsArray = projectsByMonth[status] || [];
        return monthsArray.flatMap(month => month.projects || []);
    };

    /**
     * Calcul des valeurs uniques pour les filtres
     * Basé sur tous les projets de tous les statuts
     */
    const uniqueStatuses = useMemo(() => {
        const allProjects = [
            ...getAllProjectsForStatus('termines'),
            ...getAllProjectsForStatus('en_cours'),
            ...getAllProjectsForStatus('clotures')
        ];
        return [...new Set(allProjects.map(p => p.project_status))].filter(Boolean);
    }, [projectsByMonth]);

    const uniqueTypes = useMemo(() => {
        const allProjects = [
            ...getAllProjectsForStatus('termines'),
            ...getAllProjectsForStatus('en_cours'),
            ...getAllProjectsForStatus('clotures')
        ];
        return [...new Set(allProjects.map(p => p.project_type))].filter(Boolean);
    }, [projectsByMonth]);

    /**
     * Fonction pour filtrer les projets groupés par mois selon les critères de recherche
     * @param {Array} monthsArray - Tableau des mois avec leurs projets
     * @returns {Array} - Mois filtrés avec seulement les projets qui matchent les filtres
     */
    const filterProjectsByMonth = (monthsArray) => {
        if (!monthsArray || monthsArray.length === 0) return [];

        return monthsArray
            .map(monthGroup => {
                // Filtrer les projets de ce mois
                let filteredProjects = monthGroup.projects || [];

                // Filtre par terme de recherche
                if (searchTerm.trim()) {
                    filteredProjects = filteredProjects.filter(project =>
                        project.project_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        project.module_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        project.ville?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        project.etp_name?.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }

                // Filtre par statut
                if (selectedStatus !== 'all') {
                    filteredProjects = filteredProjects.filter(project =>
                        project.project_status?.toLowerCase() === selectedStatus.toLowerCase()
                    );
                }

                // Filtre par type
                if (selectedType !== 'all') {
                    filteredProjects = filteredProjects.filter(project =>
                        project.project_type?.toLowerCase() === selectedType.toLowerCase()
                    );
                }

                // Retourner le groupe de mois avec les projets filtrés
                return {
                    ...monthGroup,
                    projects: filteredProjects
                };
            })
            // Garder seulement les mois qui ont des projets après filtrage
            .filter(monthGroup => monthGroup.projects.length > 0);
    };

    /**
     * Statistiques globales calculées à partir de tous les projets
     */
    const stats = useMemo(() => {
        const allProjects = [
            ...getAllProjectsForStatus('termines'),
            ...getAllProjectsForStatus('en_cours'),
            ...getAllProjectsForStatus('clotures')
        ];

        const totalProjects = allProjects.length;
        const termines = getAllProjectsForStatus('termines').length;
        const enCours = getAllProjectsForStatus('en_cours').length;
        const totalSeances = allProjects.reduce((sum, p) => sum + (p.seanceCount || 0), 0);

        return { totalProjects, termines, enCours, totalSeances };
    }, [projectsByMonth]);

    // Charger les données au montage du composant
    useEffect(() => {
        DataRequest();
    }, []);

    return <>
        <NavbarEvaluation />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            {/* Header Section */}
            <div className="">
                <div className="px-4 mx-auto max-w-8xl sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4 mt-3">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Projets</h1>
                        </div>

                        {/* Tabs de navigation */}
                        <div className="">
                            <nav className="flex -mb-px space-x-8">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative flex items-center justify-between w-44 px-4 py-2 border rounded-lg shadow-sm transition-all font-medium text-sm
                                        ${activeTab === tab.id
                                                ? tab.id === 'en_cours'
                                                    ? "bg-[#369ACC] text-white"
                                                    : tab.id === 'termines'
                                                        ? "bg-[#95CF92] text-white"
                                                        : "bg-[#6F1926] text-white"
                                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                                            }`}
                                    >
                                        <span>{tab.label}</span>
                                        <span
                                            className={`text-xs font-semibold h-[1.3rem] min-w-[1.3rem] px-2 rounded-full flex items-center justify-center shadow
                                        ${activeTab === tab.id
                                                    ? "bg-white text-black"
                                                    : "bg-[#369ACC] text-white"
                                                }`}
                                        >
                                            {tab.count ?? 0}
                                        </span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${showFilter
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filtres
                            </button>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedStatus('all');
                                    setSelectedType('all');
                                }}
                                className="inline-flex items-center px-4 py-2 text-gray-700 transition-colors duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Réinitialiser
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 py-6 mx-auto max-w-8xl sm:px-6 lg:px-8">
                {/* Section des filtres */}
                {showFilter && (
                    <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm rounded-xl">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Rechercher
                                </label>
                                <input
                                    type="text"
                                    placeholder="Rechercher par titre, client, référence..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Statut
                                </label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="all">Tous les statuts</option>
                                    {uniqueStatuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Type
                                </label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="all">Tous les types</option>
                                    {uniqueTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contenu basé sur l'onglet actif */}
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div>
                        {/* Affichage conditionnel des projets selon l'onglet actif */}
                        {activeTab === 'termines' && (
                            <ProjectsContent
                                monthsArray={filterProjectsByMonth(projectsByMonth.termines)}
                                activeTab={activeTab}
                            />
                        )}
                        {activeTab === 'en_cours' && (
                            <ProjectsContent
                                monthsArray={filterProjectsByMonth(projectsByMonth.en_cours)}
                                activeTab={activeTab}
                            />
                        )}
                        {activeTab === 'clotures' && (
                            <ProjectsContent
                                monthsArray={filterProjectsByMonth(projectsByMonth.clotures)}
                                activeTab={activeTab}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    </>
}

/**
 * Composant pour afficher le contenu des projets groupés par mois
 * @param {Array} monthsArray - Tableau des mois avec leurs projets
 * @param {string} activeTab - Onglet actif pour personnaliser l'affichage
 */
function ProjectsContent({ monthsArray, activeTab }) {
    // État pour gérer l'expansion/réduction des sections de mois
    const [expandedMonths, setExpandedMonths] = useState({});

    /**
     * Fonction pour basculer l'état d'expansion d'un mois
     * @param {string} month - Le nom du mois à basculer
     */
    const toggleMonth = (month) => {
        setExpandedMonths(prev => ({
            ...prev,
            [month]: !prev[month]
        }));
    };

    /**
     * Par défaut, tous les mois sont étendus quand les données changent
     */
    useEffect(() => {
        const initialExpanded = {};
        monthsArray.forEach(monthGroup => {
            initialExpanded[monthGroup.month] = true;
        });
        setExpandedMonths(initialExpanded);
    }, [monthsArray]);

    return (
        <div className="space-y-8">
            {/* Vérifier s'il y a des projets à afficher */}
            {monthsArray.length === 0 ? (
                <EmptyState
                    title="Aucun projet trouvé"
                    description="Essayez de modifier vos critères de recherche."
                />
            ) : (
                // Afficher chaque mois avec ses projets
                monthsArray.map((monthGroup) => (
                    <MonthSection
                        key={monthGroup.month}
                        month={monthGroup.month}
                        projects={monthGroup.projects}
                        isExpanded={expandedMonths[monthGroup.month]}
                        onToggle={() => toggleMonth(monthGroup.month)}
                        activeTab={activeTab}
                    />
                ))
            )}
        </div>
    )
}

/**
 * Composant pour une section mensuelle
 * @param {string} month - Nom du mois
 * @param {Array} projects - Projets de ce mois
 * @param {boolean} isExpanded - État d'expansion
 * @param {function} onToggle - Fonction de basculement
 * @param {string} activeTab - Onglet actif pour la couleur
 */
function MonthSection({ month, projects, isExpanded, onToggle, activeTab }) {
    // Couleurs selon le statut
    const getColorClasses = () => {
        switch (activeTab) {
            case 'en_cours':
                return 'text-[#369ACC] bg-[#369ACC]/10 border-[#369ACC]/20';
            case 'termines':
                return 'text-[#95CF92] bg-[#95CF92]/10 border-[#95CF92]/20';
            case 'clotures':
                return 'text-[#6F1926] bg-[#6F1926]/10 border-[#6F1926]/20';
            default:
                return 'text-purple-600 bg-purple-100 border-purple-200';
        }
    };

    return (
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
            {/* Header du mois avec bouton d'expansion */}
            <div
                className="px-6 py-4 transition-colors duration-200 border-b border-gray-200 cursor-pointer bg-gray-50 hover:bg-gray-100"
                onClick={onToggle}
            >
                <div className="flex items-center justify-between">
                    <h3 className="flex items-center text-lg font-semibold text-gray-900">
                        <Calendar className={`w-5 h-5 mr-2 ${getColorClasses().split(' ')[0]}`} />
                        {month}
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${getColorClasses()}`}>
                            {projects.length} projet{projects.length > 1 ? 's' : ''}
                        </span>
                    </h3>
                    <button className="text-xl font-bold text-gray-400 hover:text-gray-600">
                        {isExpanded ? '−' : '+'}
                    </button>
                </div>
            </div>

            {/* Contenu des projets (affiché seulement si étendu) */}
            {isExpanded && (
                <div className="grid grid-cols-2">
                    {projects.map((project, index) => (
                        <div key={`${project.project_reference}-${index}`} className="p-6">
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/**
 * Composant pour les états vides
 * @param {string} title - Titre à afficher
 * @param {string} description - Description à afficher
 */
function EmptyState({ title, description }) {
    return (
        <div className="py-12 text-center">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full">
                <Building2 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">{title}</h3>
            <p className="text-gray-500">{description}</p>
        </div>
    );
}

/**
 * Composant pour les statistiques (optionnel, gardé de votre version originale)
 * @param {string} title - Titre de la statistique
 * @param {number|string} value - Valeur à afficher
 * @param {React.Element} icon - Icône à afficher
 * @param {string} color - Couleur du thème
 */
function StatsCard({ title, value, icon, color }) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        green: 'bg-green-50 text-green-600 border-green-200',
        purple: 'bg-purple-50 text-purple-600 border-purple-200',
        amber: 'bg-amber-50 text-amber-600 border-amber-200'
    };

    return (
        <div className="p-6 transition-shadow duration-200 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

/**
 * Composant pour le contenu de la corbeille (gardé de votre version originale)
 */
function TrashContent() {
    return (
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Corbeille</h3>
            </div>
            <ProjectTable />
        </div>
    );
}

export default Evaluation;