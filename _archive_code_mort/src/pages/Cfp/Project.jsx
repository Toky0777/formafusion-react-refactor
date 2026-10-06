import React, { useState, useMemo, useEffect } from 'react';
import {
    Search, Plus, Filter, FileText, X, ArrowUpDown, ArrowUp, ArrowDown, Download, Edit2, Trash2, Eye, FileSpreadsheet, Grid3x3, Bell,
    Users, GraduationCap, CheckCircle, BarChart3, BookOpen, Target, Monitor, Award,
    Clipboard, Rocket, Calendar, Building, PenTool,
    Folder, Camera,
    User, CreditCard,
    TrendingUp, FileBarChart,
    ShoppingCart, Settings, List, LayoutGrid, Layers
} from 'lucide-react';

// Styles CSS pour les classes personnalisées
const customStyles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .app-launcher-dropdown {
    animation: fadeInScale 0.15s ease-out;
  }
  .mega-menu-dropdown {
    animation: fadeInDown 0.2s ease-out;
  }
  .menu-category-dropdown {
    animation: fadeInScale 0.15s ease-out;
  }
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Project = () => {
    const [activeTab, setActiveTab] = useState('catalogue');
    const [activeStatusTab, setActiveStatusTab] = useState('enCours'); // 'enCours', 'préparation', 'planifié', 'terminé', 'cloturé'
    const [showNewCourse, setShowNewCourse] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [globalSearchTerm, setGlobalSearchTerm] = useState('');
    const [showGlobalSearch, setShowGlobalSearch] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const [showGroupBy, setShowGroupBy] = useState(false);
    const [showColumnSelector, setShowColumnSelector] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState({
        reference: true,
        nomCours: true,
        type: true,
        formateurs: true,
        lieu: true,
        nombreApprenants: true,
        dureeHeures: true,
        nomClient: true,
        modeFinancement: true,
        date: true,
        mode: true,
        actions: true // Actions toujours visibles
    });
    const [groupBy, setGroupBy] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' ou 'cards'
    const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [filters, setFilters] = useState({
        reference: '',
        nomCours: '',
        type: '',
        formateur: '',
        lieu: '',
        nomClient: '',
        modeFinancement: '',
        date: '',
        mode: ''
    });

    const [projects, setProjects] = useState([
        {
            id: 1,
            reference: 'PRJ-2025-001',
            nomCours: 'Introduction au JavaScript',
            type: 'Intra',
            formateurs: ['Rakoto Jean', 'Andriana Marie'],
            lieu: 'Centre de formation Antananarivo',
            nombreApprenants: 15,
            dureeHeures: 40,
            nomClient: 'Telma Madagascar',
            modeFinancement: 'Fonds propre',
            date: 'février 2025',
            mode: 'Présentiel',
            statut: 'enCours',
            dateCreation: '2025-01-15',
            dateDebut: '2025-02-01',
            dateFin: '2025-02-05'
        },
        {
            id: 2,
            reference: 'PRJ-2025-002',
            nomCours: 'React Avancé',
            type: 'Inter',
            formateurs: ['Rabe Paul'],
            lieu: 'Centre de formation Antsirabe',
            nombreApprenants: 22,
            dureeHeures: 80,
            nomClient: 'Orange Madagascar',
            modeFinancement: 'FMFP',
            date: 'février 2025',
            mode: 'Hybride',
            statut: 'enCours',
            dateCreation: '2025-02-01',
            dateDebut: '2025-02-10',
            dateFin: '2025-02-21'
        },
        {
            id: 3,
            reference: 'PRJ-2025-003',
            nomCours: 'Python pour la Data Science',
            type: 'Intra',
            formateurs: ['Rasoamanana Hery', 'Randriamaro Sophie'],
            lieu: 'Siège client - Tamatave',
            nombreApprenants: 12,
            dureeHeures: 60,
            nomClient: 'Ambatovy',
            modeFinancement: 'Fonds propre',
            date: 'janvier 2025',
            mode: 'Présentiel',
            statut: 'terminé',
            dateCreation: '2025-01-10',
            dateDebut: '2025-01-20',
            dateFin: '2025-01-28'
        },
        {
            id: 4,
            reference: 'PRJ-2025-004',
            nomCours: 'Design Thinking Masterclass',
            type: 'Inter',
            formateurs: ['Raharison Michel', 'Razafy Lanto', 'Andriantsoa Claude'],
            lieu: 'Centre de formation Fianarantsoa',
            nombreApprenants: 18,
            dureeHeures: 120,
            nomClient: 'Multiple (formation ouverte)',
            modeFinancement: 'FMFP',
            date: 'mars 2025',
            mode: 'En ligne',
            statut: 'planifié',
            dateCreation: '2025-01-20',
            dateDebut: '2025-03-01',
            dateFin: '2025-03-15'
        },
        {
            id: 5,
            reference: 'PRJ-2025-005',
            nomCours: 'HTML/CSS Basics',
            type: 'Intra',
            formateurs: ['Rakotomalala Naina'],
            lieu: 'Centre de formation Mahajanga',
            nombreApprenants: 20,
            dureeHeures: 30,
            nomClient: 'BNI Madagascar',
            modeFinancement: 'Fonds propre',
            date: 'février 2025',
            mode: 'Présentiel',
            statut: 'enCours',
            dateCreation: '2025-02-05',
            dateDebut: '2025-02-12',
            dateFin: '2025-02-16'
        },
        {
            id: 6,
            reference: 'PRJ-2025-006',
            nomCours: 'Machine Learning Avancé',
            type: 'Inter',
            formateurs: ['Randrianarison Fidy', 'Rabemananjara Tina'],
            lieu: 'Centre de formation Antananarivo',
            nombreApprenants: 14,
            dureeHeures: 100,
            nomClient: 'Multiple (formation ouverte)',
            modeFinancement: 'Autre',
            date: 'mars 2025',
            mode: 'Hybride',
            statut: 'préparation',
            dateCreation: '2025-01-18',
            dateDebut: '2025-03-10',
            dateFin: '2025-03-22'
        },
        {
            id: 7,
            reference: 'PRJ-2025-007',
            nomCours: 'API REST avec Node.js',
            type: 'Intra',
            formateurs: ['Rakotozafy Olivier'],
            lieu: 'Siège client - Antananarivo',
            nombreApprenants: 8,
            dureeHeures: 50,
            nomClient: 'Jovenna',
            modeFinancement: 'Fonds propre',
            date: 'janvier 2025',
            mode: 'En ligne',
            statut: 'terminé',
            dateCreation: '2025-01-05',
            dateDebut: '2025-01-15',
            dateFin: '2025-01-21'
        },
        {
            id: 8,
            reference: 'PRJ-2025-008',
            nomCours: 'DevOps Masterclass',
            type: 'Inter',
            formateurs: ['Ranaivosoa Eric', 'Ratsimandresy Mamy'],
            lieu: 'Centre de formation Antsiranana',
            nombreApprenants: 16,
            dureeHeures: 110,
            nomClient: 'Multiple (formation ouverte)',
            modeFinancement: 'FMFP',
            date: 'mars 2025',
            mode: 'Présentiel',
            statut: 'préparation',
            dateCreation: '2025-02-08',
            dateDebut: '2025-03-15',
            dateFin: '2025-03-29'
        },
        {
            id: 9,
            reference: 'PRJ-2025-009',
            nomCours: 'Leadership et Management',
            type: 'Intra',
            formateurs: ['Ramaroson Christine', 'Andriamanana David'],
            lieu: 'Siège client - Antsirabe',
            nombreApprenants: 25,
            dureeHeures: 35,
            nomClient: 'STAR Brasseries',
            modeFinancement: 'Fonds propre',
            date: 'février 2025',
            mode: 'Hybride',
            statut: 'enCours',
            dateCreation: '2025-01-25',
            dateDebut: '2025-02-08',
            dateFin: '2025-02-12'
        },
        {
            id: 10,
            reference: 'PRJ-2025-010',
            nomCours: 'Stratégie Marketing Digital',
            type: 'Inter',
            formateurs: ['Rajaonarison Faniry'],
            lieu: 'Centre de formation Toliara',
            nombreApprenants: 19,
            dureeHeures: 70,
            nomClient: 'Multiple (formation ouverte)',
            modeFinancement: 'Autre',
            date: 'janvier 2025',
            mode: 'En ligne',
            statut: 'cloturé',
            dateCreation: '2025-02-03',
            dateDebut: '2025-01-10',
            dateFin: '2025-01-19'
        },
        {
            id: 11,
            reference: 'PRJ-2025-011',
            nomCours: 'Gestion de Projet Agile',
            type: 'Intra',
            formateurs: ['Razanamparany Tsiry', 'Randriamampionona Lalao'],
            lieu: 'Centre de formation Morondava',
            nombreApprenants: 13,
            dureeHeures: 45,
            nomClient: 'Total Energies Madagascar',
            modeFinancement: 'Fonds propre',
            date: 'mars 2025',
            mode: 'Présentiel',
            statut: 'planifié',
            dateCreation: '2025-01-30',
            dateDebut: '2025-03-05',
            dateFin: '2025-03-11'
        }
    ]);

    const [newProject, setNewProject] = useState({
        reference: '',
        nomCours: '',
        type: '',
        formateurs: [],
        lieu: '',
        nombreApprenants: '',
        dureeHeures: '',
        nomClient: '',
        modeFinancement: '',
        date: '',
        mode: ''
    });

    // Get current data
    const currentData = projects;
    const setCurrentData = setProjects;

    const filteredProjects = useMemo(() => {
        let filtered = currentData.filter(project => {
            // Filter by status first
            const matchStatus = project.statut === activeStatusTab;

            // Then apply other filters
            const matchSearch = project.nomCours.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.nomClient.toLowerCase().includes(searchTerm.toLowerCase());
            const matchReference = !filters.reference || project.reference.includes(filters.reference);
            const matchNomCours = !filters.nomCours || project.nomCours.includes(filters.nomCours);
            const matchType = !filters.type || project.type === filters.type;
            const matchFormateur = !filters.formateur || project.formateurs.some(f => f.includes(filters.formateur));
            const matchLieu = !filters.lieu || project.lieu.includes(filters.lieu);
            const matchClient = !filters.nomClient || project.nomClient.includes(filters.nomClient);
            const matchFinancement = !filters.modeFinancement || project.modeFinancement === filters.modeFinancement;
            const matchDate = !filters.date || project.date.includes(filters.date);
            const matchMode = !filters.mode || project.mode === filters.mode;

            return matchStatus && matchSearch && matchReference && matchNomCours && matchType && matchFormateur && matchLieu && matchClient && matchFinancement && matchDate && matchMode;
        });

        // Apply sorting
        if (sortConfig.field) {
            filtered.sort((a, b) => {
                let aValue = a[sortConfig.field];
                let bValue = b[sortConfig.field];

                // Handle date fields
                if (sortConfig.field === 'dateCreation' || sortConfig.field === 'dateDebut' || sortConfig.field === 'dateFin') {
                    aValue = new Date(aValue);
                    bValue = new Date(bValue);
                }

                // Handle array fields (formateurs)
                if (sortConfig.field === 'formateurs') {
                    aValue = aValue.join(', ');
                    bValue = bValue.join(', ');
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [currentData, searchTerm, filters, sortConfig]);

    // Group projects if groupBy is active
    const groupedProjects = useMemo(() => {
        if (!groupBy) return { '': filteredProjects };

        const groups = {};
        filteredProjects.forEach(project => {
            const groupKey = project[groupBy];
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(project);
        });

        // Sort groups alphabetically and sort projects within each group
        const sortedGroups = {};
        Object.keys(groups).sort().forEach(key => {
            sortedGroups[key] = groups[key].sort((a, b) => a.nomCours.localeCompare(b.nomCours));
        });

        return sortedGroups;
    }, [filteredProjects, groupBy]);

    // Status counts
    const statusCounts = useMemo(() => {
        return {
            enCours: currentData.filter(project => project.statut === 'enCours').length,
            préparation: currentData.filter(project => project.statut === 'préparation').length,
            planifié: currentData.filter(project => project.statut === 'planifié').length,
            terminé: currentData.filter(project => project.statut === 'terminé').length,
            cloturé: currentData.filter(project => project.statut === 'cloturé').length,
        };
    }, [currentData]);

    // Pagination calculations - adjust for grouping
    const totalProjects = filteredProjects.length;
    const totalPages = groupBy ? 1 : Math.ceil(totalProjects / itemsPerPage); // No pagination when grouped
    const startIndex = groupBy ? 0 : (currentPage - 1) * itemsPerPage;
    const endIndex = groupBy ? totalProjects : startIndex + itemsPerPage;

    const paginatedGroupedProjects = useMemo(() => {
        if (groupBy) {
            return groupedProjects; // Return all groups when grouping is active
        } else {
            // Return paginated single group when no grouping
            const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
            return { '': paginatedProjects };
        }
    }, [groupedProjects, filteredProjects, startIndex, endIndex, groupBy]);

    // Reset filters when changing tabs
    useEffect(() => {
        setCurrentPage(1);
        setSearchTerm('');
        setFilters({ reference: '', nomCours: '', type: '', formateur: '', lieu: '', nomClient: '', modeFinancement: '', date: '', mode: '' });
        setSortConfig({ field: null, direction: 'asc' });
        setGroupBy('');
        setActiveStatusTab('enCours');
        setShowFilters(false);
        setShowSearch(false);
        setShowGroupBy(false);
        setItemsPerPage(5);
        setViewMode('list'); // Reset to list view
    }, [activeTab]);

    // Adjust items per page when switching view modes
    useEffect(() => {
        if (viewMode === 'cards' && itemsPerPage === 5) {
            setItemsPerPage(6); // Show 6 cards by default (2 lignes de 3)
        } else if (viewMode === 'list' && (itemsPerPage === 6 || itemsPerPage === 9 || itemsPerPage === 12 || itemsPerPage === 15)) {
            setItemsPerPage(5); // Reset to list default
        }
        setCurrentPage(1);
    }, [viewMode]);

    // Reset to page 1 when filters change or status changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters, sortConfig, itemsPerPage, activeStatusTab]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.sort-dropdown') && !e.target.closest('.sort-button')) {
                setShowSort(false);
            }
            if (!e.target.closest('.groupby-dropdown') && !e.target.closest('.groupby-button')) {
                setShowGroupBy(false);
            }
            if (!e.target.closest('.column-selector-dropdown') && !e.target.closest('.column-selector-button')) {
                setShowColumnSelector(false);
            }
            if (!e.target.closest('#global-search-input') && !e.target.closest('.global-search-button')) {
                if (!globalSearchTerm) {
                    setShowGlobalSearch(false);
                }
            }
        };
        document.addEventListener('click', handleClickOutside);

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setShowSort(false);
                setShowGroupBy(false);
                setShowColumnSelector(false);
                if (!globalSearchTerm) {
                    setShowGlobalSearch(false);
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [globalSearchTerm]);

    const createProject = () => {
        if (newProject.reference && newProject.nomCours && newProject.type && newProject.lieu && newProject.nombreApprenants && newProject.dureeHeures && newProject.nomClient && newProject.modeFinancement && newProject.date && newProject.mode) {
            const maxId = Math.max(...projects.map(project => project.id), 0);

            const project = {
                id: maxId + 1,
                reference: newProject.reference,
                nomCours: newProject.nomCours,
                type: newProject.type,
                formateurs: newProject.formateurs.length > 0 ? newProject.formateurs : ['À assigner'],
                lieu: newProject.lieu,
                nombreApprenants: parseInt(newProject.nombreApprenants),
                dureeHeures: parseInt(newProject.dureeHeures),
                nomClient: newProject.nomClient,
                modeFinancement: newProject.modeFinancement,
                date: newProject.date,
                mode: newProject.mode,
                statut: 'préparation', // Nouveau projet en préparation par défaut
                dateCreation: new Date().toISOString().split('T')[0],
                dateDebut: '',
                dateFin: ''
            };

            setProjects([...projects, project]);

            setNewProject({ reference: '', nomCours: '', type: '', formateurs: [], lieu: '', nombreApprenants: '', dureeHeures: '', nomClient: '', modeFinancement: '', date: '', mode: '' });
            setShowNewCourse(false);
        }
    };

    const clearFilters = () => {
        setFilters({ reference: '', nomCours: '', type: '', formateur: '', lieu: '', nomClient: '', modeFinancement: '', date: '', mode: '' });
        setSearchTerm('');
        setShowSearch(false);
        setShowFilters(false);
        setShowGroupBy(false);
        setGroupBy('');
        setSortConfig({ field: null, direction: 'asc' });
    };

    const handleSort = (field) => {
        setSortConfig(prev => ({
            field: field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
        setShowSort(false);
    };

    const getNiveauColor = (niveau) => {
        switch (niveau) {
            case 'Fondamentaux': return 'bg-green-100 text-green-800';
            case 'Intermédiaire': return 'bg-blue-100 text-blue-800';
            case 'Avancé': return 'bg-orange-100 text-orange-800';
            case 'Masterclass': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getDomaineColor = (domaine) => {
        switch (domaine) {
            case 'Développement Web': return 'bg-cyan-100 text-cyan-800';
            case 'Développement Backend': return 'bg-indigo-100 text-indigo-800';
            case 'Data Science': return 'bg-emerald-100 text-emerald-800';
            case 'Intelligence Artificielle': return 'bg-violet-100 text-violet-800';
            case 'Infrastructure': return 'bg-slate-100 text-slate-800';
            case 'Innovation': return 'bg-rose-100 text-rose-800';
            case 'Leadership': return 'bg-amber-100 text-amber-800';
            case 'Marketing': return 'bg-pink-100 text-pink-800';
            case 'Management': return 'bg-lime-100 text-lime-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleGroupBy = (field) => {
        if (groupBy === field) {
            setGroupBy(''); // Toggle off if same field
        } else {
            setGroupBy(field);
            setCurrentPage(1); // Reset to first page when grouping changes
        }
        setShowGroupBy(false);
    };

    const toggleColumn = (columnKey) => {
        setVisibleColumns(prev => ({
            ...prev,
            [columnKey]: !prev[columnKey]
        }));
    };

    const resetColumns = () => {
        setVisibleColumns({
            reference: true,
            nomCours: true,
            type: true,
            formateurs: true,
            lieu: true,
            nombreApprenants: true,
            dureeHeures: true,
            nomClient: true,
            modeFinancement: true,
            date: true,
            mode: true,
            actions: true
        });
        setShowColumnSelector(false);
    };

    return (
        <>
            {/* Styles personnalisés */}
            <style dangerouslySetInnerHTML={{ __html: customStyles }} />

            <div className="min-h-screen bg-gray-50">
                {/* Breadcrumb */}
                <div className="px-4 py-3 bg-white border-b sm:px-6 lg:px-8">
                    <div className="flex items-center text-sm text-gray-600">
                        <span>Catalogue</span>
                        <span className="mx-2">›</span>
                        <span className="text-gray-900">Gestion</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-4 py-4 sm:px-6 lg:px-8">
                    {/* Title */}
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold text-gray-900">Projets de formation</h1>
                    </div>

                    {/* Status Tabs - Ultra Minimal */}
                    <div className="flex items-center mb-3 space-x-1">
                        <button
                            onClick={() => {
                                setActiveStatusTab('enCours');
                                setCurrentPage(1);
                            }}
                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeStatusTab === 'enCours'
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            En cours
                            <span className={`ml-1.5 text-xs ${activeStatusTab === 'enCours' ? 'text-blue-600' : 'text-gray-400'
                                }`}>
                                {statusCounts.enCours}
                            </span>
                        </button>

                        <button
                            onClick={() => {
                                setActiveStatusTab('préparation');
                                setCurrentPage(1);
                            }}
                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeStatusTab === 'préparation'
                                ? 'bg-orange-50 text-orange-700 font-medium'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            En préparation
                            <span className={`ml-1.5 text-xs ${activeStatusTab === 'préparation' ? 'text-orange-600' : 'text-gray-400'
                                }`}>
                                {statusCounts.préparation}
                            </span>
                        </button>

                        <button
                            onClick={() => {
                                setActiveStatusTab('planifié');
                                setCurrentPage(1);
                            }}
                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeStatusTab === 'planifié'
                                ? 'bg-purple-50 text-purple-700 font-medium'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Planifié
                            <span className={`ml-1.5 text-xs ${activeStatusTab === 'planifié' ? 'text-purple-600' : 'text-gray-400'
                                }`}>
                                {statusCounts.planifié}
                            </span>
                        </button>

                        <button
                            onClick={() => {
                                setActiveStatusTab('terminé');
                                setCurrentPage(1);
                            }}
                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeStatusTab === 'terminé'
                                ? 'bg-green-50 text-green-700 font-medium'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Terminé
                            <span className={`ml-1.5 text-xs ${activeStatusTab === 'terminé' ? 'text-green-600' : 'text-gray-400'
                                }`}>
                                {statusCounts.terminé}
                            </span>
                        </button>

                        <button
                            onClick={() => {
                                setActiveStatusTab('cloturé');
                                setCurrentPage(1);
                            }}
                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeStatusTab === 'cloturé'
                                ? 'bg-gray-50 text-gray-700 font-medium'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Cloturé
                            <span className={`ml-1.5 text-xs ${activeStatusTab === 'cloturé' ? 'text-gray-600' : 'text-gray-400'
                                }`}>
                                {statusCounts.cloturé}
                            </span>
                        </button>
                    </div>

                    {/* Actions Bar - Ultra Minimal */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            {/* Ultra Minimal Search */}
                            <div className="relative">
                                {!showSearch ? (
                                    <button
                                        onClick={() => {
                                            setShowSearch(true);
                                            setTimeout(() => {
                                                document.getElementById('search-input')?.focus();
                                            }, 100);
                                        }}
                                        className={`p-1.5 rounded-md transition-colors ${searchTerm ? 'bg-green-50 text-green-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                            }`}
                                        title="Rechercher"
                                    >
                                        <Search className="w-4 h-4" />
                                        {searchTerm && (
                                            <span className="absolute w-1 h-1 bg-green-600 rounded-full top-1 right-1"></span>
                                        )}
                                    </button>
                                ) : (
                                    <div className="flex items-center space-x-1">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                id="search-input"
                                                type="text"
                                                placeholder="Rechercher..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onBlur={() => {
                                                    if (!searchTerm) {
                                                        setTimeout(() => setShowSearch(false), 200);
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Escape') {
                                                        setSearchTerm('');
                                                        setShowSearch(false);
                                                    }
                                                }}
                                                className="w-48 lg:w-64 pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-purple-400 transition-all duration-200"
                                            />
                                        </div>
                                        {searchTerm && (
                                            <button
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    document.getElementById('search-input')?.focus();
                                                }}
                                                className="p-1 text-gray-400 hover:text-gray-600"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* View Mode Buttons - Ultra Minimal */}
                            <div className="flex items-center">
                                {/* List View Button */}
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                        }`}
                                    title="Affichage liste"
                                >
                                    <List className="w-4 h-4" />
                                </button>

                                {/* Card View Button */}
                                <button
                                    onClick={() => setViewMode('cards')}
                                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'cards' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                        }`}
                                    title="Affichage cartes"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Minimal Filter Button */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`p-1.5 rounded-md transition-colors ${showFilters ? 'bg-purple-50 text-purple-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                        }`}
                                    title="Filtres"
                                >
                                    <Filter className="w-4 h-4" />
                                    {(filters.entreprise || filters.bc || filters.statut || filters.date || filters.echeance) && (
                                        <span className="absolute w-1 h-1 bg-purple-600 rounded-full top-1 right-1"></span>
                                    )}
                                </button>
                            </div>

                            {/* Sort Button - Clean Style */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowSort(!showSort)}
                                    className={`sort-button p-1.5 rounded-md transition-colors ${sortConfig.field ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                        }`}
                                    title="Trier"
                                >
                                    {sortConfig.field ? (
                                        sortConfig.direction === 'asc' ?
                                            <ArrowUp className="w-4 h-4" /> :
                                            <ArrowDown className="w-4 h-4" />
                                    ) : (
                                        <ArrowUpDown className="w-4 h-4" />
                                    )}
                                </button>

                                {/* Sort Dropdown */}
                                {showSort && (
                                    <div className="sort-dropdown absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 py-1 min-w-[160px]">
                                        <button
                                            onClick={() => handleSort('reference')}
                                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            Référence
                                            {sortConfig.field === 'reference' && (
                                                <span className="text-xs text-gray-500">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleSort('nomCours')}
                                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            Nom du cours
                                            {sortConfig.field === 'nomCours' && (
                                                <span className="text-xs text-gray-500">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleSort('type')}
                                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            Type
                                            {sortConfig.field === 'type' && (
                                                <span className="text-xs text-gray-500">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleSort('formateurs')}
                                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            Formateurs
                                            {sortConfig.field === 'formateurs' && (
                                                <span className="text-xs text-gray-500">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleSort('lieu')}
                                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            Lieu
                                            {sortConfig.field === 'lieu' && (
                                                <span className="text-xs text-gray-500">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleSort('nombreApprenants')}
                                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            Nb apprenants
                                            {sortConfig.field === 'nombreApprenants' && (
                                                <span className="text-xs text-gray-500">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleSort('dureeHeures')}
                                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            Durée (h)
                                            {sortConfig.field === 'dureeHeures' && (
                                                <span className="text-xs text-gray-500">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleSort('nomClient')}
                                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            Client
                                            {sortConfig.field === 'nomClient' && (
                                                <span className="text-xs text-gray-500">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleSort('modeFinancement')}
                                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            Financement
                                            {sortConfig.field === 'modeFinancement' && (
                                                <span className="text-xs text-gray-500">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleSort('date')}
                                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            Date
                                            {sortConfig.field === 'date' && (
                                                <span className="text-xs text-gray-500">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleSort('mode')}
                                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            Mode
                                            {sortConfig.field === 'mode' && (
                                                <span className="text-xs text-gray-500">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleSort('dateCreation')}
                                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            Date création
                                            {sortConfig.field === 'dateCreation' && (
                                                <span className="text-xs text-gray-500">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </button>
                                        <div className="pt-1 mt-1 border-t border-gray-100">
                                            <button
                                                onClick={() => {
                                                    setSortConfig({ field: null, direction: 'asc' });
                                                    setShowSort(false);
                                                }}
                                                className="w-full px-3 py-1.5 text-left text-sm text-gray-500 hover:bg-gray-50"
                                            >
                                                Réinitialiser
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Group By Button - New */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowGroupBy(!showGroupBy)}
                                    className={`groupby-button p-1.5 rounded-md transition-colors ${groupBy ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                        }`}
                                    title="Grouper par"
                                >
                                    <Layers className="w-4 h-4" />
                                    {groupBy && (
                                        <span className="absolute w-1 h-1 bg-indigo-600 rounded-full top-1 right-1"></span>
                                    )}
                                </button>

                                {/* Group By Dropdown */}
                                {showGroupBy && (
                                    <div className="groupby-dropdown absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 py-1 min-w-[160px]">
                                        <button
                                            onClick={() => handleGroupBy('type')}
                                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            Par type
                                            {groupBy === 'type' && (
                                                <span className="text-xs text-indigo-600">✓</span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleGroupBy('modeFinancement')}
                                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            Par financement
                                            {groupBy === 'modeFinancement' && (
                                                <span className="text-xs text-indigo-600">✓</span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleGroupBy('lieu')}
                                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            Par lieu
                                            {groupBy === 'lieu' && (
                                                <span className="text-xs text-indigo-600">✓</span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleGroupBy('date')}
                                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            Par date
                                            {groupBy === 'date' && (
                                                <span className="text-xs text-indigo-600">✓</span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleGroupBy('mode')}
                                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            Par mode
                                            {groupBy === 'mode' && (
                                                <span className="text-xs text-indigo-600">✓</span>
                                            )}
                                        </button>
                                        <div className="pt-1 mt-1 border-t border-gray-100">
                                            <button
                                                onClick={() => {
                                                    setGroupBy('');
                                                    setShowGroupBy(false);
                                                }}
                                                className="w-full px-3 py-1.5 text-left text-sm text-gray-500 hover:bg-gray-50"
                                            >
                                                Aucun groupement
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Column Selector Button */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowColumnSelector(!showColumnSelector)}
                                    className={`column-selector-button p-1.5 rounded-md transition-colors ${Object.values(visibleColumns).some(visible => !visible) ? 'bg-teal-50 text-teal-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                        }`}
                                    title="Colonnes"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v10z" />
                                    </svg>
                                    {Object.values(visibleColumns).some(visible => !visible) && (
                                        <span className="absolute w-1 h-1 bg-teal-600 rounded-full top-1 right-1"></span>
                                    )}
                                </button>

                                {/* Column Selector Dropdown */}
                                {showColumnSelector && (
                                    <div className="column-selector-dropdown absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 py-1 min-w-[180px]">
                                        <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase border-b border-gray-100">
                                            Colonnes visibles
                                        </div>

                                        <label className="flex items-center px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns.reference}
                                                onChange={() => toggleColumn('reference')}
                                                className="mr-2 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                            />
                                            <span className="text-sm">Référence</span>
                                        </label>

                                        <label className="flex items-center px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns.nomCours}
                                                onChange={() => toggleColumn('nomCours')}
                                                className="mr-2 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                            />
                                            <span className="text-sm">Nom du cours</span>
                                        </label>

                                        <label className="flex items-center px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns.type}
                                                onChange={() => toggleColumn('type')}
                                                className="mr-2 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                            />
                                            <span className="text-sm">Type</span>
                                        </label>

                                        <label className="flex items-center px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns.formateurs}
                                                onChange={() => toggleColumn('formateurs')}
                                                className="mr-2 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                            />
                                            <span className="text-sm">Formateur(s)</span>
                                        </label>

                                        <label className="flex items-center px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns.lieu}
                                                onChange={() => toggleColumn('lieu')}
                                                className="mr-2 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                            />
                                            <span className="text-sm">Lieu</span>
                                        </label>

                                        <label className="flex items-center px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns.nombreApprenants}
                                                onChange={() => toggleColumn('nombreApprenants')}
                                                className="mr-2 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                            />
                                            <span className="text-sm">Apprenants</span>
                                        </label>

                                        <label className="flex items-center px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns.dureeHeures}
                                                onChange={() => toggleColumn('dureeHeures')}
                                                className="mr-2 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                            />
                                            <span className="text-sm">Durée (h)</span>
                                        </label>

                                        <label className="flex items-center px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns.nomClient}
                                                onChange={() => toggleColumn('nomClient')}
                                                className="mr-2 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                            />
                                            <span className="text-sm">Client</span>
                                        </label>

                                        <label className="flex items-center px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns.modeFinancement}
                                                onChange={() => toggleColumn('modeFinancement')}
                                                className="mr-2 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                            />
                                            <span className="text-sm">Financement</span>
                                        </label>

                                        <label className="flex items-center px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns.date}
                                                onChange={() => toggleColumn('date')}
                                                className="mr-2 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                            />
                                            <span className="text-sm">Date</span>
                                        </label>

                                        <label className="flex items-center px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns.mode}
                                                onChange={() => toggleColumn('mode')}
                                                className="mr-2 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                            />
                                            <span className="text-sm">Mode</span>
                                        </label>

                                        <label className="flex items-center px-3 py-1.5 bg-gray-50 cursor-not-allowed opacity-50">
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns.actions}
                                                disabled
                                                className="mr-2 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                            />
                                            <span className="text-sm">Actions</span>
                                        </label>

                                        <div className="pt-1 mt-1 border-t border-gray-100">
                                            <button
                                                onClick={resetColumns}
                                                className="w-full px-3 py-1.5 text-left text-sm text-gray-500 hover:bg-gray-50"
                                            >
                                                Tout afficher
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Clear button - minimal */}
                            {(filters.reference || filters.nomCours || filters.type || filters.formateur || filters.lieu || filters.nomClient || filters.modeFinancement || filters.date || filters.mode || searchTerm || sortConfig.field || groupBy) && (
                                <button
                                    onClick={clearFilters}
                                    className="p-1.5 text-gray-400 hover:text-gray-600"
                                    title="Effacer tout"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            {/* Export Excel Button - Ultra Minimal */}
                            <button
                                className="p-1.5 rounded-md text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                title="Exporter Excel"
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                            </button>

                            {/* Export PDF Button - Ultra Minimal */}
                            <button
                                className="p-1.5 rounded-md text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Exporter PDF"
                            >
                                <FileText className="w-4 h-4" />
                            </button>

                            {/* Separator */}
                            <div className="w-px h-5 bg-gray-200"></div>

                            {/* Compact New Project Button */}
                            <button
                                onClick={() => setShowNewCourse(true)}
                                className="flex items-center px-3 py-1.5 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-800"
                            >
                                <Plus className="w-4 h-4 lg:mr-1.5" />
                                <span className="hidden lg:inline">Nouveau projet</span>
                            </button>
                        </div>
                    </div>

                    {/* Collapsible Filters - Ultra Compact */}
                    {showFilters && (
                        <div className="grid grid-cols-2 gap-2 pb-4 mb-4 border-b border-gray-100 md:grid-cols-9">
                            <input
                                type="text"
                                placeholder="Référence"
                                value={filters.reference}
                                onChange={(e) => setFilters({ ...filters, reference: e.target.value })}
                                className="px-2.5 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-purple-400"
                            />
                            <input
                                type="text"
                                placeholder="Nom du cours"
                                value={filters.nomCours}
                                onChange={(e) => setFilters({ ...filters, nomCours: e.target.value })}
                                className="px-2.5 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-purple-400"
                            />
                            <select
                                value={filters.type}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                className="px-2.5 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-purple-400"
                            >
                                <option value="">Tous types</option>
                                <option value="Intra">Intra</option>
                                <option value="Inter">Inter</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Formateur"
                                value={filters.formateur}
                                onChange={(e) => setFilters({ ...filters, formateur: e.target.value })}
                                className="px-2.5 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-purple-400"
                            />
                            <input
                                type="text"
                                placeholder="Lieu"
                                value={filters.lieu}
                                onChange={(e) => setFilters({ ...filters, lieu: e.target.value })}
                                className="px-2.5 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-purple-400"
                            />
                            <input
                                type="text"
                                placeholder="Client"
                                value={filters.nomClient}
                                onChange={(e) => setFilters({ ...filters, nomClient: e.target.value })}
                                className="px-2.5 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-purple-400"
                            />
                            <select
                                value={filters.modeFinancement}
                                onChange={(e) => setFilters({ ...filters, modeFinancement: e.target.value })}
                                className="px-2.5 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-purple-400"
                            >
                                <option value="">Tous financements</option>
                                <option value="Fonds propre">Fonds propre</option>
                                <option value="FMFP">FMFP</option>
                                <option value="Autre">Autre</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Date"
                                value={filters.date}
                                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                                className="px-2.5 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-purple-400"
                            />
                            <select
                                value={filters.mode}
                                onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
                                className="px-2.5 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-purple-400"
                            >
                                <option value="">Tous modes</option>
                                <option value="Présentiel">Présentiel</option>
                                <option value="En ligne">En ligne</option>
                                <option value="Hybride">Hybride</option>
                            </select>
                        </div>
                    )}

                    {/* Project List or Cards - with grouping support */}
                    {viewMode === 'list' ? (
                        // List View (Table) with grouping
                        <div className="space-y-4">
                            {Object.keys(paginatedGroupedProjects).length === 0 ? (
                                <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-lg">
                                    <BookOpen className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">Aucun projet trouvé</p>
                                </div>
                            ) : (
                                Object.entries(paginatedGroupedProjects).map(([groupKey, projects]) => (
                                    <div key={groupKey} className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                                        {/* Group Header */}
                                        {groupBy && groupKey && (
                                            <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="flex items-center text-sm font-semibold text-gray-900">
                                                        {groupBy === 'type' && (
                                                            <>
                                                                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${groupKey === 'Intra' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                                                                {groupKey}
                                                            </>
                                                        )}
                                                        {groupBy === 'modeFinancement' && (
                                                            <>
                                                                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${groupKey === 'Fonds propre' ? 'bg-emerald-500' :
                                                                    groupKey === 'FMFP' ? 'bg-purple-500' : 'bg-orange-500'
                                                                    }`}></span>
                                                                {groupKey}
                                                            </>
                                                        )}
                                                        {groupBy === 'lieu' && (
                                                            <>
                                                                <span className="inline-block w-3 h-3 mr-2 bg-indigo-500 rounded-full"></span>
                                                                {groupKey}
                                                            </>
                                                        )}
                                                        {groupBy === 'date' && (
                                                            <>
                                                                <span className="inline-block w-3 h-3 mr-2 rounded-full bg-rose-500"></span>
                                                                {groupKey}
                                                            </>
                                                        )}
                                                        {groupBy === 'mode' && (
                                                            <>
                                                                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${groupKey === 'Présentiel' ? 'bg-blue-500' :
                                                                    groupKey === 'En ligne' ? 'bg-cyan-500' : 'bg-yellow-500'
                                                                    }`}></span>
                                                                {groupKey}
                                                            </>
                                                        )}
                                                    </h3>
                                                    <span className="text-xs text-gray-500">
                                                        {projects.length} projets
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Courses Table */}
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                {(!groupBy || groupKey === Object.keys(paginatedGroupedProjects)[0]) && (
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            {visibleColumns.reference && <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Référence</th>}
                                                            {visibleColumns.nomCours && <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Nom du cours</th>}
                                                            {visibleColumns.type && <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Type</th>}
                                                            {visibleColumns.formateurs && <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Formateur(s)</th>}
                                                            {visibleColumns.lieu && <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Lieu</th>}
                                                            {visibleColumns.nombreApprenants && <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Apprenants</th>}
                                                            {visibleColumns.dureeHeures && <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Durée (h)</th>}
                                                            {visibleColumns.nomClient && <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Client</th>}
                                                            {visibleColumns.modeFinancement && <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Financement</th>}
                                                            {visibleColumns.date && <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Date</th>}
                                                            {visibleColumns.mode && <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Mode</th>}
                                                            {visibleColumns.actions && <th className="px-3 py-2 text-xs font-medium text-center text-gray-500 uppercase">Actions</th>}
                                                        </tr>
                                                    </thead>
                                                )}
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {projects.map((project) => (
                                                        <tr key={project.id} className="hover:bg-gray-50">
                                                            {visibleColumns.reference && (
                                                                <td className="px-3 py-2.5 whitespace-nowrap text-xs font-medium text-gray-900">
                                                                    {project.reference}
                                                                </td>
                                                            )}
                                                            {visibleColumns.nomCours && (
                                                                <td className="px-3 py-2.5 whitespace-nowrap text-xs font-medium text-gray-900">
                                                                    {project.nomCours}
                                                                </td>
                                                            )}
                                                            {visibleColumns.type && (
                                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                                    <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${project.type === 'Intra' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                                                        }`}>
                                                                        {project.type}
                                                                    </span>
                                                                </td>
                                                            )}
                                                            {visibleColumns.formateurs && (
                                                                <td className="px-3 py-2.5 text-xs text-gray-900">
                                                                    <div className="max-w-32">
                                                                        {project.formateurs.length > 1 ? (
                                                                            <div className="space-y-0.5">
                                                                                {project.formateurs.slice(0, 2).map((formateur, index) => (
                                                                                    <div key={index} className="truncate">{formateur}</div>
                                                                                ))}
                                                                                {project.formateurs.length > 2 && (
                                                                                    <div className="text-gray-500">+{project.formateurs.length - 2} autre(s)</div>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <div className="truncate">{project.formateurs[0]}</div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            )}
                                                            {visibleColumns.lieu && (
                                                                <td className="px-3 py-2.5 text-xs text-gray-900">
                                                                    <div className="truncate max-w-28" title={project.lieu}>
                                                                        {project.lieu}
                                                                    </div>
                                                                </td>
                                                            )}
                                                            {visibleColumns.nombreApprenants && (
                                                                <td className="px-3 py-2.5 whitespace-nowrap text-xs text-gray-900 text-center">
                                                                    {project.nombreApprenants}
                                                                </td>
                                                            )}
                                                            {visibleColumns.dureeHeures && (
                                                                <td className="px-3 py-2.5 whitespace-nowrap text-xs text-gray-900 text-center">
                                                                    {project.dureeHeures}h
                                                                </td>
                                                            )}
                                                            {visibleColumns.nomClient && (
                                                                <td className="px-3 py-2.5 text-xs text-gray-900">
                                                                    <div className="truncate max-w-24" title={project.nomClient}>
                                                                        {project.nomClient}
                                                                    </div>
                                                                </td>
                                                            )}
                                                            {visibleColumns.modeFinancement && (
                                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                                    <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${project.modeFinancement === 'Fonds propre' ? 'bg-emerald-100 text-emerald-800' :
                                                                        project.modeFinancement === 'FMFP' ? 'bg-purple-100 text-purple-800' :
                                                                            'bg-orange-100 text-orange-800'
                                                                        }`}>
                                                                        {project.modeFinancement}
                                                                    </span>
                                                                </td>
                                                            )}
                                                            {visibleColumns.date && (
                                                                <td className="px-3 py-2.5 whitespace-nowrap text-xs text-gray-900">
                                                                    {project.date}
                                                                </td>
                                                            )}
                                                            {visibleColumns.mode && (
                                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                                    <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${project.mode === 'Présentiel' ? 'bg-blue-100 text-blue-800' :
                                                                        project.mode === 'En ligne' ? 'bg-cyan-100 text-cyan-800' :
                                                                            'bg-yellow-100 text-yellow-800'
                                                                        }`}>
                                                                        {project.mode}
                                                                    </span>
                                                                </td>
                                                            )}
                                                            {visibleColumns.actions && (
                                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                                    <div className="flex items-center justify-center space-x-1">
                                                                        <button className="p-1 text-gray-400 transition-colors rounded hover:text-blue-600 hover:bg-blue-50" title="Voir détails">
                                                                            <Eye className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button className="p-1 text-gray-400 transition-colors rounded hover:text-green-600 hover:bg-green-50" title="Télécharger programme">
                                                                            <Download className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button className="p-1 text-gray-400 transition-colors rounded hover:text-purple-600 hover:bg-purple-50" title="Modifier">
                                                                            <Edit2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button className="p-1 text-gray-400 transition-colors rounded hover:text-red-600 hover:bg-red-50" title="Supprimer">
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        // Cards View with grouping
                        <div className="space-y-6">
                            {Object.keys(paginatedGroupedProjects).length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                    <BookOpen className="w-12 h-12 mb-3 text-gray-300" />
                                    <p className="text-sm">Aucun projet trouvé</p>
                                </div>
                            ) : (
                                Object.entries(paginatedGroupedProjects).map(([groupKey, projects]) => (
                                    <div key={groupKey}>
                                        {/* Group Header for Cards */}
                                        {groupBy && groupKey && (
                                            <div className="mb-4">
                                                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                                    {groupBy === 'type' && (
                                                        <>
                                                            <span className={`inline-block w-4 h-4 rounded-full mr-3 ${groupKey === 'Intra' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                                                            {groupKey}
                                                        </>
                                                    )}
                                                    {groupBy === 'modeFinancement' && (
                                                        <>
                                                            <span className={`inline-block w-4 h-4 rounded-full mr-3 ${groupKey === 'Fonds propre' ? 'bg-emerald-500' :
                                                                groupKey === 'FMFP' ? 'bg-purple-500' : 'bg-orange-500'
                                                                }`}></span>
                                                            {groupKey}
                                                        </>
                                                    )}
                                                    {groupBy === 'lieu' && (
                                                        <>
                                                            <span className="inline-block w-4 h-4 mr-3 bg-indigo-500 rounded-full"></span>
                                                            {groupKey}
                                                        </>
                                                    )}
                                                    {groupBy === 'date' && (
                                                        <>
                                                            <span className="inline-block w-4 h-4 mr-3 rounded-full bg-rose-500"></span>
                                                            {groupKey}
                                                        </>
                                                    )}
                                                    {groupBy === 'mode' && (
                                                        <>
                                                            <span className={`inline-block w-4 h-4 rounded-full mr-3 ${groupKey === 'Présentiel' ? 'bg-blue-500' :
                                                                groupKey === 'En ligne' ? 'bg-cyan-500' : 'bg-yellow-500'
                                                                }`}></span>
                                                            {groupKey}
                                                        </>
                                                    )}
                                                    <span className="ml-auto text-sm font-normal text-gray-500">
                                                        {projects.length} projets
                                                    </span>
                                                </h3>
                                            </div>
                                        )}

                                        {/* Cards Grid */}
                                        <div className="grid grid-cols-3 gap-4">
                                            {projects.map((project) => (
                                                <div key={project.id} className="p-4 transition-shadow bg-white border border-gray-200 rounded-lg hover:shadow-md">
                                                    {/* Header avec référence et badges */}
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center mb-1 space-x-2">
                                                                <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                                                    {project.reference}
                                                                </span>
                                                                {groupBy !== 'type' && (
                                                                    <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${project.type === 'Intra' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                                                        }`}>
                                                                        {project.type}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                                                                {project.nomCours}
                                                            </h3>
                                                        </div>
                                                    </div>

                                                    {/* Informations du projet */}
                                                    <div className="mb-4 space-y-2">
                                                        <div className="flex items-center justify-between text-xs text-gray-600">
                                                            <span className="text-gray-400">Formateur(s):</span>
                                                            <span className="text-right truncate max-w-24" title={project.formateurs.join(', ')}>
                                                                {project.formateurs.length === 1 ? project.formateurs[0] : `${project.formateurs[0]} +${project.formateurs.length - 1}`}
                                                            </span>
                                                        </div>
                                                        {groupBy !== 'lieu' && (
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="text-gray-400">Lieu:</span>
                                                                <span className="text-right truncate max-w-32" title={project.lieu}>
                                                                    {project.lieu}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center justify-between text-xs text-gray-600">
                                                            <span className="text-gray-400">Apprenants:</span>
                                                            <span>{project.nombreApprenants}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-xs text-gray-600">
                                                            <span className="text-gray-400">Durée:</span>
                                                            <span>{project.dureeHeures}h</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-xs text-gray-600">
                                                            <span className="text-gray-400">Client:</span>
                                                            <span className="text-right truncate max-w-24" title={project.nomClient}>
                                                                {project.nomClient}
                                                            </span>
                                                        </div>
                                                        {groupBy !== 'modeFinancement' && (
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="text-gray-400">Financement:</span>
                                                                <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${project.modeFinancement === 'Fonds propre' ? 'bg-emerald-100 text-emerald-800' :
                                                                    project.modeFinancement === 'FMFP' ? 'bg-purple-100 text-purple-800' :
                                                                        'bg-orange-100 text-orange-800'
                                                                    }`}>
                                                                    {project.modeFinancement}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {groupBy !== 'date' && (
                                                            <div className="flex items-center justify-between text-xs text-gray-600">
                                                                <span className="text-gray-400">Date:</span>
                                                                <span>{project.date}</span>
                                                            </div>
                                                        )}
                                                        {groupBy !== 'mode' && (
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="text-gray-400">Mode:</span>
                                                                <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${project.mode === 'Présentiel' ? 'bg-blue-100 text-blue-800' :
                                                                    project.mode === 'En ligne' ? 'bg-cyan-100 text-cyan-800' :
                                                                        'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                    {project.mode}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center justify-center pt-2 space-x-1 border-t border-gray-100">
                                                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Voir détails">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Télécharger programme">
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors" title="Modifier">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Supprimer">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Pagination commune aux deux vues - masquée en mode groupé */}
                    {filteredProjects.length > 0 && !groupBy && (
                        <div className="mt-4 bg-white border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between px-4 py-2 text-xs border-t border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <span className="text-gray-600">
                                        {startIndex + 1}-{Math.min(endIndex, filteredProjects.length)} / {filteredProjects.length}
                                    </span>
                                    {/* Items per page selector - Ultra minimal */}
                                    <div className="flex items-center text-xs text-gray-500">
                                        <select
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                            className="pr-0 font-medium transition-colors bg-transparent border-0 appearance-none cursor-pointer focus:outline-none hover:text-gray-700"
                                            title={viewMode === 'cards' ? 'Cartes par page' : 'Lignes par page'}
                                        >
                                            {viewMode === 'cards' ? (
                                                <>
                                                    <option value="4">4</option>
                                                    <option value="8">8</option>
                                                    <option value="12">12</option>
                                                    <option value="16">16</option>
                                                    <option value="20">20</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="5">5</option>
                                                    <option value="10">10</option>
                                                    <option value="20">20</option>
                                                    <option value="50">50</option>
                                                    <option value="100">100</option>
                                                </>
                                            )}
                                        </select>
                                        <span className="ml-1">{viewMode === 'cards' ? 'cartes' : 'lignes'}</span>
                                    </div>
                                </div>
                                {totalPages > 1 && (
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`p-1 rounded ${currentPage === 1
                                                ? 'text-gray-300 cursor-not-allowed'
                                                : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <span className="px-2 text-gray-700">
                                            {currentPage}/{totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className={`p-1 rounded ${currentPage === totalPages
                                                ? 'text-gray-300 cursor-not-allowed'
                                                : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Summary for grouped view */}
                    {groupBy && filteredProjects.length > 0 && (
                        <div className="mt-4 bg-white border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-600">
                                <span>
                                    Total: {filteredProjects.length} projets dans {Object.keys(groupedProjects).length} {groupBy === 'type' ? 'types' : groupBy === 'modeFinancement' ? 'modes de financement' : groupBy === 'lieu' ? 'lieux' : groupBy === 'date' ? 'dates' : groupBy === 'mode' ? 'modes' : 'groupes'}
                                </span>
                                <span>
                                    Groupé par {groupBy === 'type' ? 'type' : groupBy === 'modeFinancement' ? 'mode de financement' : groupBy === 'lieu' ? 'lieu' : groupBy === 'date' ? 'date' : groupBy === 'mode' ? 'mode' : 'critère'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* New Project Modal */}
                {showNewCourse && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                        <div className="w-full max-w-2xl max-h-screen p-6 overflow-y-auto bg-white rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Nouveau projet</h2>
                                <button
                                    onClick={() => setShowNewCourse(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                            Référence du projet *
                                        </label>
                                        <input
                                            type="text"
                                            value={newProject.reference}
                                            onChange={(e) => setNewProject({ ...newProject, reference: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="ex: PRJ-2025-012"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                            Type *
                                        </label>
                                        <select
                                            value={newProject.type}
                                            onChange={(e) => setNewProject({ ...newProject, type: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="">Sélectionner un type</option>
                                            <option value="Intra">Intra</option>
                                            <option value="Inter">Inter</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Nom du cours *
                                    </label>
                                    <input
                                        type="text"
                                        value={newProject.nomCours}
                                        onChange={(e) => setNewProject({ ...newProject, nomCours: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="ex: Introduction à React"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Lieu de formation *
                                    </label>
                                    <input
                                        type="text"
                                        value={newProject.lieu}
                                        onChange={(e) => setNewProject({ ...newProject, lieu: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="ex: Centre de formation Antananarivo"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                            Nombre d'apprenants *
                                        </label>
                                        <input
                                            type="number"
                                            value={newProject.nombreApprenants}
                                            onChange={(e) => setNewProject({ ...newProject, nombreApprenants: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="15"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                            Durée en heures *
                                        </label>
                                        <input
                                            type="number"
                                            value={newProject.dureeHeures}
                                            onChange={(e) => setNewProject({ ...newProject, dureeHeures: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="40"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Nom du client *
                                    </label>
                                    <input
                                        type="text"
                                        value={newProject.nomClient}
                                        onChange={(e) => setNewProject({ ...newProject, nomClient: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="ex: Telma Madagascar"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Mode de financement *
                                    </label>
                                    <select
                                        value={newProject.modeFinancement}
                                        onChange={(e) => setNewProject({ ...newProject, modeFinancement: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="">Sélectionner un mode de financement</option>
                                        <option value="Fonds propre">Fonds propre</option>
                                        <option value="FMFP">FMFP</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end mt-6 space-x-3">
                                <button
                                    onClick={() => setShowNewCourse(false)}
                                    className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={createProject}
                                    className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                                >
                                    Créer le projet
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Project;