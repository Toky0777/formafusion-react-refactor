// ApprenantTable.jsx - Version simplifiée pour affichage intégré
import React, { useEffect, useState, useMemo } from 'react';
import {
    Star,
    User,
    CheckCircle,
    Clock,
    Search,
    Edit3,
    Eye,
    Info
} from 'lucide-react';
import axios from '../../../../../../config/axios';
import { LoadingScreen } from '../LoadingScreen';
import { EvaluationDrawerCfp } from './EvaluationDrawerCfp';
import { motion, AnimatePresence } from 'framer-motion';

const ApprenantTable = ({ idProjet, idCfpInter, onClose, projectName, refreshTrigger }) => {
    const [etpEmps, setEtpEmps] = useState({});
    const [apprenants, setApprenants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedApprenant, setSelectedApprenant] = useState(null);
    const [showEvaluationDrawer, setShowEvaluationDrawer] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingEvaluations, setLoadingEvaluations] = useState({});

    // Fonction optimisée pour récupérer les détails d'évaluation
    const fetchEvaluationDetails = async (idProject, idEmploye) => {
        const cacheKey = `eval-${idProject}-${idEmploye}`;
        
        try {
            setLoadingEvaluations(prev => ({ ...prev, [cacheKey]: true }));

            const response = await axios.get(`cfp/projet/evaluation/checkEval/${idProject}/${idEmploye}`);

            let result;
            if (response.data && (response.data.averageNote !== undefined || response.data.one !== null)) {
                result = response.data;
            } else {
                result = null;
            }

            return result;
            
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return null;
            } else {
                console.error("Erreur lors de la récupération des détails d'évaluation:", error);
                return null;
            }
        } finally {
            setLoadingEvaluations(prev => ({ ...prev, [cacheKey]: false }));
        }
    };

    // Charger les évaluations par lots
    const loadEvaluationsBatch = async (apprenantsList, projectId) => {
        const batchSize = 3;
        const results = [];
        
        for (let i = 0; i < apprenantsList.length; i += batchSize) {
            const batch = apprenantsList.slice(i, i + batchSize);
            
            const batchPromises = batch.map(async (apprenant) => {
                try {
                    const evaluationDetails = await fetchEvaluationDetails(projectId, apprenant.idEmploye);
                    
                    const hasEvaluation = evaluationDetails?.one !== null && evaluationDetails?.one !== undefined;
                    const rating = evaluationDetails?.averageNote || 0;
                    
                    return {
                        ...apprenant,
                        rating: rating,
                        evaluationCompleted: hasEvaluation,
                        evaluationDetails: evaluationDetails,
                        hasEvaluation: hasEvaluation
                    };
                } catch (error) {
                    console.error(`Erreur pour ${apprenant.emp_name}:`, error);
                    return {
                        ...apprenant,
                        rating: 0,
                        evaluationCompleted: false,
                        evaluationDetails: null,
                        hasEvaluation: false
                    };
                }
            });
            
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
            
            if (i + batchSize < apprenantsList.length) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        return results;
    };

    const fetchData = async () => {
        const route = idCfpInter == null
            ? `cfp/projet/apprenants/getApprenantAdded/${idProjet}`
            : `cfp/projet/etpInter/getApprenantAddedInter/${idProjet}`;
        setIsLoading(true);
        try {
            const { data } = await axios.get(route);

            if (data.apprs && Array.isArray(data.apprs)) {
                const apprenantsAvecNotes = await loadEvaluationsBatch(data.apprs, idProjet);
                setApprenants(apprenantsAvecNotes);
            } else {
                setApprenants([]);
            }
        } catch (error) {
            console.error("Erreur de récupération des apprenants:", error);
            setApprenants([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (idProjet) {
            fetchData();
        }
    }, [idProjet, idCfpInter, refreshTrigger]);

    function groupByCompanyWithReduce(apprenants) {
        return apprenants.reduce((etpEmps, apprenant) => {
            const entreprise = apprenant.etp_name;
            if (!etpEmps[entreprise]) {
                etpEmps[entreprise] = [];
            }

            const hasEvaluation = apprenant.hasEvaluation || apprenant.rating > 0;
            const evaluationNote = apprenant.rating;

            etpEmps[entreprise].push({
                id: apprenant.idEmploye,
                name: apprenant.emp_name,
                subtitle: apprenant.emp_firstname,
                avatar: apprenant.emp_photo
                    ? `https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/employes/${apprenant.emp_photo}`
                    : null,
                initial: apprenant.emp_initial_name
                    ? apprenant.emp_initial_name
                    : apprenant.emp_name.charAt(0),
                presence: apprenant.presence || 'present',
                rating: evaluationNote,
                evaluation: apprenant.evaluation,
                evaluationDetails: apprenant.evaluationDetails,
                hasEvaluation: hasEvaluation
            });

            return etpEmps;
        }, {});
    }

    const filteredApprenants = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return apprenants.filter(
            (apprenant) =>
                apprenant.emp_name?.toLowerCase().includes(term) ||
                apprenant.emp_firstname?.toLowerCase().includes(term) ||
                apprenant.etp_name?.toLowerCase().includes(term)
        );
    }, [apprenants, searchTerm]);

    useEffect(() => {
        if (filteredApprenants.length > 0) {
            const groupedData = groupByCompanyWithReduce(filteredApprenants);
            setEtpEmps(groupedData);
        } else {
            setEtpEmps({});
        }
    }, [filteredApprenants]);

    const handleOpenEvaluation = (learner) => {
        setSelectedApprenant(learner);
        setShowEvaluationDrawer(true);
    };

    const handleCloseEvaluation = () => {
        setShowEvaluationDrawer(false);
        setSelectedApprenant(null);
        // Recharger les données
        fetchData();
    };

    const handleEvaluationSuccess = () => {
        setShowEvaluationDrawer(false);
        setSelectedApprenant(null);
        fetchData();
    };

    const renderStars = (rating, size = "sm") => {
        const numericRating = Number(rating) || 0;
        const starSize = size === "lg" ? "w-4 h-4" : "w-3 h-3";
        
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                    if (numericRating >= star) {
                        return (
                            <svg key={star} className={`${starSize} text-amber-400 fill-amber-400`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        );
                    } else {
                        return (
                            <svg key={star} className={`${starSize} text-gray-300`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        );
                    }
                })}
            </div>
        );
    };

    const renderAvatar = (learner) => {
        if (learner.avatar) {
            return (
                <img
                    src={learner.avatar}
                    alt={learner.name}
                    onError={(e) => e.target.style.display = 'none'}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                />
            );
        } else {
            return (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs border-2 border-white shadow-sm">
                    {learner.initial}
                </div>
            );
        }
    };

    const getRatingColor = (rating) => {
        const numericRating = Number(rating) || 0;
        if (numericRating >= 4.5) return 'text-emerald-600';
        if (numericRating >= 3.5) return 'text-amber-600';
        if (numericRating >= 2.5) return 'text-orange-600';
        return 'text-red-600';
    };

    const getEvaluationStats = () => {
        const allLearners = Object.values(etpEmps).flat();
        const evaluated = allLearners.filter((l) => l.hasEvaluation).length;
        const total = allLearners.length;
        
        return {
            evaluated,
            total,
            percentage: total > 0 ? Math.round((evaluated / total) * 100) : 0
        };
    };

    const EvaluationButton = ({ learner, onEvaluate }) => {
        const hasEvaluation = learner.hasEvaluation;
        
        return (
            <button
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    hasEvaluation
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                        : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-sm"
                }`}
                onClick={() => onEvaluate(learner)}
                title={hasEvaluation ? "Consulter l'évaluation" : "Évaluer cet apprenant"}
            >
                {hasEvaluation ? (
                    <>
                        <Eye className="w-4 h-4" />
                        <span>Voir</span>
                    </>
                ) : (
                    <>
                        <Edit3 className="w-4 h-4" />
                        <span>Évaluer</span>
                    </>
                )}
            </button>
        );
    };

    return (
        <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200">
            {/* Barre de recherche */}
            <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un apprenant..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                        />
                    </div>
                    
                    {/* Statistiques rapides */}
                    <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                            <div className="text-gray-600 font-medium">Progression</div>
                            <div className="text-lg font-bold text-green-600">
                                {getEvaluationStats().percentage}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 mx-4 mt-2 rounded-lg p-2">
                <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-800">
                        <strong>Important :</strong> Les évaluations soumises ne peuvent plus être modifiées.
                    </div>
                </div>
            </div>

            {/* Contenu scrollable */}
            <div className="flex-1 overflow-y-auto max-h-96">
                {isLoading && (
                    <div className="flex items-center justify-center p-8">
                        <LoadingScreen />
                    </div>
                )}

                {!isLoading && filteredApprenants.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                        <User className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-sm font-medium text-gray-600 mb-1">
                            Aucun apprenant trouvé
                        </p>
                        <p className="text-xs text-gray-500">
                            {searchTerm 
                                ? 'Aucun apprenant ne correspond à votre recherche.'
                                : 'Aucun apprenant inscrit.'
                            }
                        </p>
                    </div>
                )}

                {/* Liste des entreprises et apprenants */}
                <div className="space-y-4 p-4">
                    <AnimatePresence>
                        {Object.entries(etpEmps).map(([sectionName, learners]) => (
                            <motion.div
                                key={sectionName}
                                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {/* En-tête entreprise */}
                                <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            {sectionName}
                                        </h3>
                                        <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border">
                                            {learners.filter(l => l.hasEvaluation).length}/{learners.length} évalués
                                        </span>
                                    </div>
                                </div>

                                {/* Liste des apprenants */}
                                <div className="divide-y divide-gray-100">
                                    {learners.map((learner, index) => (
                                        <div
                                            key={learner.id || index}
                                            className="px-3 py-2 hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            <div className="flex items-center justify-between">
                                                {/* Informations apprenant */}
                                                <div className="flex items-center gap-3 flex-1">
                                                    {renderAvatar(learner)}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-semibold text-gray-900 truncate">
                                                            {learner.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 truncate">
                                                            {learner.subtitle}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Notation */}
                                                <div className="flex items-center gap-3">
                                                    {learner.hasEvaluation ? (
                                                        <div className="text-center">
                                                            {renderStars(learner.rating)}
                                                            <div className={`text-xs font-semibold ${getRatingColor(learner.rating)}`}>
                                                                {learner.rating.toFixed(1)}/5
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center text-gray-400">
                                                            <div className="text-xs">Non évalué</div>
                                                        </div>
                                                    )}
                                                    
                                                    <EvaluationButton 
                                                        learner={learner} 
                                                        onEvaluate={handleOpenEvaluation}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Drawer d'évaluation */}
            <AnimatePresence>
                {showEvaluationDrawer && selectedApprenant && (
                    <EvaluationDrawerCfp
                        project={{
                            idProjet: idProjet,
                            idEmploye: selectedApprenant.id,
                            emp_name: selectedApprenant.name,
                            emp_firstname: selectedApprenant.subtitle,
                        }}
                        onClose={handleCloseEvaluation}
                        evaluationData={selectedApprenant.evaluationDetails || selectedApprenant.evaluation}
                        onSuccess={handleEvaluationSuccess}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ApprenantTable;