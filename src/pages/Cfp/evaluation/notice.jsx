import { useEffect, useState, useMemo } from 'react';
import ReviewAccordion from '../../../components/evaluation/ReviewAccordion';
import LoadingSpinner from '../../../components/ui/loading-spinner';
import { Search, X, Star, MessageSquare, Filter, ChevronDown } from 'lucide-react';
import axios from '../../../config/axios';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

function Notice() {
    const [modules, setModules] = useState([])
    const [etps, setEtps] = useState([])
    const [apprs, setApprs] = useState([])
    const [processedData, setProcessedData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchModule, setSearchModule] = useState('')
    const [showFilter, setShowFilter] = useState(false)
    const location = useLocation();

    // Tabs configuration
    const tabs = [
        { id: 'evaluation-chaud', label: 'Éval. à chaud', icon: Star, link: '/cfp/evaluation/chaud' },
        { id: 'evaluation-froid', label: 'Éval. à froid', icon: Star, link: '/cfp/evaluation/froids' },
        { id: 'avis', label: 'Avis', icon: MessageSquare, link: '/cfp/evaluation/avis' },
    ];

    const ProjectRequest = async () => {
        setIsLoading(true)
        try {
            const { data } = await axios.get(`/cfp/avis`);
            setModules(data.modules);
            setEtps(data.etps);
            setApprs(data.apprs);

            // Traitement des données après réception
            processData(data.modules, data.etps, data.apprs)
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false)
        }
    }

    // Fonction pour calculer la moyenne des notes
    const calculateAverageRating = (ratings) => {
        if (ratings.length === 0) return 0;
        const sum = ratings.reduce((acc, rating) => acc + rating, 0);
        return (sum / ratings.length).toFixed(1);
    }

    // Fonction principale de traitement des données
    const processData = (modulesData, etpsData, apprsData) => {
        const processedModules = modulesData.map(module => {
            // Filtrer les évaluations pour ce module
            const moduleApprs = apprsData.filter(appr => appr.idModule === module.idModule);

            // Grouper par entreprise (etp)
            const etpGroups = {};
            moduleApprs.forEach(appr => {
                if (!etpGroups[appr.idEtp]) {
                    etpGroups[appr.idEtp] = [];
                }
                etpGroups[appr.idEtp].push(appr);
            });

            // Créer les sections par entreprise
            const sections = Object.keys(etpGroups).map(etpId => {
                const etpApprs = etpGroups[etpId];
                const etpInfo = etpsData.find(etp => etp.idEtp === parseInt(etpId));

                // Transformer les évaluations en reviews
                const reviews = etpApprs.map(appr => ({
                    id: appr.idEmploye,
                    firstName: appr.firstName || 'N/A',
                    lastName: appr.name,
                    rating: appr.generalApreciate,
                    comment: appr.temoignage || 'Aucun commentaire'
                }));

                // Calculer la note moyenne pour cette entreprise
                const ratings = etpApprs.map(appr => appr.generalApreciate);
                const averageRating = parseFloat(calculateAverageRating(ratings));

                return {
                    id: parseInt(etpId),
                    title: etpInfo ? etpInfo.etp_name : `Entreprise ${etpId}`,
                    rating: averageRating,
                    reviewCount: etpApprs.length,
                    reviews: reviews
                };
            });

            // Calculer la note globale du module
            const allRatings = moduleApprs.map(appr => appr.generalApreciate);
            const overallRating = parseFloat(calculateAverageRating(allRatings));

            return {
                id: module.idModule,
                title: module.module_name,
                overallRating: overallRating,
                totalReviews: moduleApprs.length,
                sections: sections.filter(section => section.reviews.length > 0) // Filtrer les sections vides
            };
        });

        // Filtrer les modules qui ont des évaluations
        const modulesWithReviews = processedModules.filter(module => module.totalReviews > 0);
        setProcessedData(modulesWithReviews);
    }

    // Filtrage des modules basé sur la recherche
    const filteredModules = useMemo(() => {
        if (!searchModule.trim()) {
            return processedData;
        }

        const searchTerm = searchModule.toLowerCase().trim();
        return processedData.filter(module =>
            module.title.toLowerCase().includes(searchTerm)
        );
    }, [processedData, searchModule]);

    // Fonction pour effacer la recherche
    const clearSearch = () => {
        setSearchModule('');
    };

    useEffect(() => {
        ProjectRequest();
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
            <div className="max-w-8xl mx-auto">
                {/* Navbar */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-30 backdrop-blur-sm bg-white/90 mb-8 rounded-xl shadow-sm">
                    <div className="px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
                                    <MessageSquare className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Système d'Avis et Témoignages
                                    </h1>
                                    <p className="text-gray-600">
                                        Évaluations des formations par module et entreprise
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un module..."
                                        value={searchModule}
                                        onChange={(e) => setSearchModule(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
                                    />
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowFilter(!showFilter)}
                                        className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors ${showFilter
                                                ? "bg-purple-600 text-white"
                                                : "bg-white text-gray-700"
                                            }`}
                                    >
                                        <Filter className="w-5 h-5" />
                                        Filtres
                                        <ChevronDown
                                            className={clsx(
                                                "w-4 h-4 transition-transform",
                                                showFilter && "rotate-180"
                                            )}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 pb-4">
                        <nav className="flex space-x-4">
                            {tabs.map((tab) => (
                                <Link
                                    key={tab.id}
                                    to={tab.link}
                                    className={`relative flex items-center justify-between px-4 py-2 rounded-xl transition-all font-medium text-sm ${location.pathname === tab.link
                                            ? "bg-purple-600 text-white shadow-lg"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {tab.icon && <tab.icon className="w-5 h-5 mr-2" />}
                                    <span>{tab.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {showFilter && (
                    <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm rounded-xl">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Recherche par module
                                </label>
                                <input
                                    type="text"
                                    placeholder="Rechercher un module..."
                                    value={searchModule}
                                    onChange={(e) => setSearchModule(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Note minimale
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="all">Toutes les notes</option>
                                    <option value="4">4 étoiles et plus</option>
                                    <option value="3">3 étoiles et plus</option>
                                    <option value="2">2 étoiles et plus</option>
                                    <option value="1">1 étoile et plus</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={() => {
                                        setSearchModule("");
                                    }}
                                    className="w-full px-4 py-2 text-gray-700 transition-colors duration-200 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                                >
                                    Réinitialiser
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : filteredModules.length > 0 ? (
                    filteredModules.map((moduleData) => (
                        <div key={moduleData.id} className="mt-12">
                            <ReviewAccordion
                                title={moduleData.title}
                                overallRating={moduleData.overallRating}
                                totalReviews={moduleData.totalReviews}
                                sections={moduleData.sections}
                            />
                        </div>
                    ))
                ) : searchModule ? (
                    <div className="py-12 text-center">
                        <div className="max-w-md mx-auto">
                            <Search className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                            <p className="mb-4 text-slate-500">
                                Aucun module trouvé pour "{searchModule}"
                            </p>
                            <button
                                onClick={clearSearch}
                                className="inline-flex items-center px-4 py-2 text-white transition-colors duration-200 bg-purple-600 rounded-lg hover:bg-purple-700"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Effacer la recherche
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <p className="text-slate-500">Aucune évaluation disponible pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Notice;