import { useEffect, useRef, useState } from "react";
import { FilterResults } from "../../../components/Body/FilterResults";
import { NavBar } from "../../../components/Navbar/NavBar";
import { useStateContext } from "../../Context/ContextProvider";
import axios from "axios";
import { TableResults } from "../../../components/Body/TableResults";
import { LoadingScreen } from "../../../components/Body/LoadingScreen";
import { Link } from "react-router-dom";
import { BarChart, ArrowLeft, TrendingUp, Target, Award, Users, Plus } from 'lucide-react';
import { Footer } from "../../../components/footer/Footer";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { formatDate } from "../../../utils/dateUtils";

// Enregistrer tous les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineController,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Results() {
    const { token, user, api_base_url } = useStateContext()
    const [isLoading, setIsLoading] = useState(false)
    const [apprenants, setApprenants] = useState([])
    const [filteredApprenants, setFilteredApprenants] = useState([])
    const [level, setLevel] = useState([])
    const [campagne, setCampagne] = useState([])
    
    // États pour le modal chart
    const [isChartModalOpen, setIsChartModalOpen] = useState(false)
    const [chartData, setChartData] = useState(null)
    const [chartLoading, setChartLoading] = useState(false)
    const [chartError, setChartError] = useState(null)
    const chartRef = useRef(null)
    const chartInstanceRef = useRef(null)

    // États pour les filtres
    const [filters, setFilters] = useState({
        name: '',
        etp: '',
        qcm: '',
        date: '',
        pointsMin: '',
        pointsMax: '',
        level: '',
        campaign: ''
    });

    const dataNames = ["rang", "name", "firstname", "etp", "campaignName", "date", "intituleqcm", "points", "niveau"]
    const columns = ["Rang", "Nom", "Firstname", "Entreprise", "Campagne", "Date", "QCM", "Points", "Niveau"]

    console.log(`${api_base_url}global-results/qcm`);
    

    /* test */

    // Fonction pour ouvrir le modal chart
    const openChartModal = () => {
        setIsChartModalOpen(true);
        loadChartData();
    };

    // Fonction pour fermer le modal chart
    const closeChartModal = () => {
        setIsChartModalOpen(false);
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
            chartInstanceRef.current = null;
        }
        setChartError(null);
    };

    // Fonction pour charger les données du chart
    const loadChartData = async () => {
        setChartLoading(true);
        setChartError(null);

        if (!user?.id) {
            setChartError('Erreur: Identifiants manquants');
            setChartLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${api_base_url}global-results/qcm/chart-data-global/${user.id}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            const data = response.data;

            const maxPoints = data.pointsMaxQcm && data.pointsMaxQcm.length > 0 ?
                data.pointsMaxQcm[0].points_maximum :
                Math.max(...data.chartData.datasets[0].data);

            setChartData({
                ...data.chartData,
                maxPoints
            });

        } catch (err) {
            setChartError(`Erreur lors du chargement des données: ${err.message}`);
        } finally {
            setChartLoading(false);
        }
    };

    // Fonction de filtrage
    const applyFilters = () => {
        let filtered = [...apprenants];

        // Filtre par nom
        if (filters.name) {
            filtered = filtered.filter(apprenant => 
                apprenant.name.toLowerCase().includes(filters.name.toLowerCase()) ||
                apprenant.firstname.toLowerCase().includes(filters.name.toLowerCase())
            );
        }

        // Filtre par entreprise
        if (filters.etp) {
            filtered = filtered.filter(apprenant => 
                apprenant.etp.toLowerCase().includes(filters.etp.toLowerCase())
            );
        }

        // Filtre par QCM
        if (filters.qcm) {
            filtered = filtered.filter(apprenant => 
                apprenant.intituleqcm.toLowerCase().includes(filters.qcm.toLowerCase())
            );
        }

        // Filtre par date
        if (filters.date) {
            filtered = filtered.filter(apprenant => {
                const apprenantDate = new Date(apprenant.date).toISOString().split('T')[0];
                return apprenantDate === filters.date;
            });
        }

        // Filtre par points minimum
        if (filters.pointsMin) {
            filtered = filtered.filter(apprenant => 
                parseFloat(apprenant.points) >= parseFloat(filters.pointsMin)
            );
        }

        // Filtre par points maximum
        if (filters.pointsMax) {
            filtered = filtered.filter(apprenant => 
                parseFloat(apprenant.points) <= parseFloat(filters.pointsMax)
            );
        }

        // Filtre par niveau
        if (filters.level) {
            filtered = filtered.filter(apprenant => 
                apprenant.niveau === filters.level
            );
        }

        // Filtre par campagne
        if (filters.campaign) {
            filtered = filtered.filter(apprenant => 
                apprenant.campaignName === filters.campaign
            );
        }

        setFilteredApprenants(filtered);
    };

    // Appliquer les filtres à chaque changement
    useEffect(() => {
        applyFilters();
    }, [filters, apprenants]);

    // Fonction pour mettre à jour les filtres
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    // Fonction pour réinitialiser les filtres
    const resetFilters = () => {
        setFilters({
            name: '',
            etp: '',
            qcm: '',
            date: '',
            pointsMin: '',
            pointsMax: '',
            level: '',
            campaign: ''
        });
    };

    // Créer le graphique quand les données sont disponibles
    useEffect(() => {
        if (chartData && chartRef.current && isChartModalOpen) {
            // Détruire le graphique existant s'il y en a un
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            chartInstanceRef.current = new ChartJS(ctx, {
                type: 'bar',
                data: {
                    labels: chartData.labels,
                    datasets: chartData.datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: chartData.maxPoints,
                            ticks: {
                                stepSize: Math.ceil(chartData.maxPoints / 5)
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.dataset.label || '';
                                    const value = context.raw || 0;
                                    const percentage = ((value / chartData.maxPoints) * 100).toFixed(1);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }, [chartData, isChartModalOpen]);

    // Gérer la fermeture avec Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeChartModal();
            }
        };

        if (isChartModalOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isChartModalOpen]);

    // Nettoyer le graphique lors du démontage du composant
    useEffect(() => {
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, []);

    useEffect(() => {
        ResultRequest()
    }, [])

    // Obtenir les valeurs uniques pour les selects
    const uniqueLevels = [...new Set(apprenants.map(a => a.niveau))].filter(Boolean);
    const uniqueCampaigns = [...new Set(apprenants.map(a => a.campaignName))].filter(Boolean);

    return (
        <>
        <div className="min-h-[110vh] bg-gradient-to-br from-purple-100 via-purple-600 to-purple-300">
            <NavBar />
            
            {/* Hero Section épuré */}
            <div className="relative pt-20 overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600">
                <div className="container px-4 mx-auto mt-16">
                    <div className="text-center text-white">
                        <div className="inline-flex items-center px-3 py-1 mb-4 text-sm rounded-full bg-white/20">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Gestion des Résultats
                        </div>
                        <h1 className="mb-4 text-4xl font-bold">
                            Résultats global des tests
                        </h1>
                        <p className="max-w-2xl mx-auto mb-8 text-purple-100">
                            Gérez et suivez vos résultats en un seul endroit
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-4 my-2">
                            <button
                                onClick={openChartModal}
                                className="inline-flex items-center px-6 py-3 font-medium text-purple-700 transition-colors bg-white rounded-lg hover:bg-gray-50"
                            >
                                <BarChart className="w-5 h-5 mr-2" />
                                Voir les graphiques
                            </button>
                            
                            <Link
                                to="/qcm/index"
                                className="inline-flex items-center px-6 py-3 font-medium text-white transition-colors bg-purple-500 rounded-lg hover:bg-purple-600"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Retour au menu
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="min-h-screen py-8 bg-gray-50">
                <div className="container px-4 mx-auto">
                    {/* Statistiques */}
                    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                        <div className="p-6 bg-white border rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Apprenants</p>
                                    <p className="text-2xl font-bold text-gray-900">{filteredApprenants.length}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 bg-white border rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Campagnes</p>
                                    <p className="text-2xl font-bold text-gray-900">{uniqueCampaigns.length}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <Target className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 bg-white border rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Niveaux</p>
                                    <p className="text-2xl font-bold text-gray-900">{uniqueLevels.length}</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Award className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section principale */}
                    <div className="bg-white border rounded-lg shadow-sm">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Résultats Actifs</h2>
                                    <p className="text-sm text-gray-600">Gérez vos résultats et leurs invitations</p>
                                </div>
                            </div>
                        </div>

                        {/* Contenu */}
                        <div className="p-6">
                            <FilterResults 
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onReset={resetFilters}
                                levels={uniqueLevels}
                                campaigns={uniqueCampaigns}
                            />
                            
                            <div className="mt-6">
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <LoadingScreen />
                                    </div>
                                ) : (
                                    <div className="bg-white border rounded-lg">
                                        <TableResults 
                                            datas={filteredApprenants} 
                                            columns={columns} 
                                            dataNames={dataNames} 
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Chart simplifié */}
            {isChartModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        {/* Header du modal */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Analyse graphique</h2>
                                    <p className="text-sm text-gray-600">Visualisation des performances</p>
                                </div>
                                <button
                                    onClick={closeChartModal}
                                    className="text-2xl font-bold text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        {/* Contenu du modal */}
                        <div className="p-6">
                            {/* Zone du graphique */}
                            <div className="mb-6">
                                {chartLoading && (
                                    <div className="flex items-center justify-center rounded-lg h-96 bg-gray-50">
                                        <div className="text-center">
                                            <div className="w-12 h-12 mx-auto mb-4 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                                            <div className="text-lg font-medium text-gray-600">Chargement des données...</div>
                                        </div>
                                    </div>
                                )}
                                
                                {chartError && (
                                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                                        <div className="flex items-center">
                                            <div className="flex items-center justify-center w-8 h-8 mr-3 bg-red-500 rounded-full">
                                                <span className="font-bold text-white">!</span>
                                            </div>
                                            <div className="text-red-700">{chartError}</div>
                                        </div>
                                    </div>
                                )}
                                
                                {chartData && !chartLoading && !chartError && (
                                    <div className="p-4 rounded-lg bg-gray-50">
                                        <div className="p-4 bg-white rounded-lg shadow-sm" style={{ height: '400px' }}>
                                            <canvas ref={chartRef}></canvas>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Statistiques */}
                            {chartData && chartData.overall_stats && (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                                        <div className="flex items-center justify-between mb-2">
                                            <Users className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <p className="text-sm font-medium text-blue-700">Total utilisateurs</p>
                                        <p className="text-2xl font-bold text-blue-900">
                                            {chartData.overall_stats.total_users}
                                        </p>
                                    </div>
                                    
                                    <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                                        <div className="flex items-center justify-between mb-2">
                                            <Target className="w-5 h-5 text-green-600" />
                                        </div>
                                        <p className="text-sm font-medium text-green-700">Sessions totales</p>
                                        <p className="text-2xl font-bold text-green-900">
                                            {chartData.overall_stats.total_sessions}
                                        </p>
                                    </div>
                                    
                                    <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                                        <div className="flex items-center justify-between mb-2">
                                            <Award className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <p className="text-sm font-medium text-purple-700">Score moyen</p>
                                        <p className="text-2xl font-bold text-purple-900">
                                            {chartData.overall_stats.average_total_score}%
                                        </p>
                                    </div>
                                    
                                    <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                                        <div className="flex items-center justify-between mb-2">
                                            <TrendingUp className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <p className="text-sm font-medium text-orange-700">Points maximum</p>
                                        <p className="text-2xl font-bold text-orange-900">
                                            {chartData.maxPoints}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer du modal */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex justify-end">
                                <button
                                    onClick={closeChartModal}
                                    className="px-4 py-2 text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-700"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
            </div>
        </>
    );
}