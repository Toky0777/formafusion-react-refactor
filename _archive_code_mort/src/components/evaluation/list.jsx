import { BarChart3, AlertCircle, ChevronDown, ChevronRight, ExternalLink, User } from 'lucide-react';
import { useState } from 'react';
import axios from '../../config/axios';

const ResultsList = ({ results, selectedProject, projectResults = [] }) => {
    const [expandedProjects, setExpandedProjects] = useState(new Set());
    const [apprenantResults, setApprenantResults] = useState({});
    const [loadingResults, setLoadingResults] = useState({});

    // Fonction pour récupérer les résultats des apprenants
    const getApprenantByProjectResult = async (idProjet) => {
        if (expandedProjects.has(idProjet)) {
            // Si déjà ouvert, on ferme
            const newExpanded = new Set(expandedProjects);
            newExpanded.delete(idProjet);
            setExpandedProjects(newExpanded);
            return;
        }

        setLoadingResults(prev => ({ ...prev, [idProjet]: true }));

        try {
            // Simuler l'appel API - remplacez par votre vraie URL
            const response = await axios(`/cfp/evaluations/froids/detail/${idProjet}`);
            const res = await response.json();

            console.log(res);

            if (res.status === 200) {
                setApprenantResults(prev => ({
                    ...prev,
                    [idProjet]: res.apprenants
                }));
            } else if (res.status === 404) {
                setApprenantResults(prev => ({
                    ...prev,
                    [idProjet]: []
                }));
            }

            // Ouvrir le projet
            const newExpanded = new Set(expandedProjects);
            newExpanded.add(idProjet);
            setExpandedProjects(newExpanded);

        } catch (error) {
            console.error('Erreur lors du chargement des résultats:', error);
            setApprenantResults(prev => ({
                ...prev,
                [idProjet]: []
            }));
        } finally {
            setLoadingResults(prev => ({ ...prev, [idProjet]: false }));
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'terminé':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'en cours':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'en attente':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 75) return 'text-blue-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const averageScore = results.length > 0
        ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length)
        : 0;

    return (
        <div className="overflow-hidden bg-white border shadow-lg rounded-xl border-gray-200/50">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-purple-50/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Liste des résultats</h3>
                            <p className="text-sm text-gray-600">
                                {projectResults.length > 0 ? `${projectResults.length} projet${projectResults.length > 1 ? 's' : ''} avec résultats` : 'Aucun résultat'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {projectResults.length === 0 ? (
                    <div className="py-12 text-center">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full">
                            <AlertCircle className="w-8 h-8 text-orange-400" />
                        </div>
                        <p className="text-center text-gray-500">
                            Résultat indisponible
                        </p>
                        <p className="mt-2 text-sm text-gray-400">
                            Aucun résultat d'évaluation disponible
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Project Results List */}
                        {projectResults.map((project) => (
                            <div key={project.idProjet} className="overflow-hidden border border-gray-200 rounded-xl">
                                {/* Project Header */}
                                <div
                                    onClick={() => getApprenantByProjectResult(project.idProjet)}
                                    className="p-4 transition-all duration-200 cursor-pointer bg-gradient-to-r from-gray-50 to-blue-50/30 hover:from-blue-50 hover:to-indigo-50/50 group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 transition-colors duration-200 bg-blue-100 rounded-lg group-hover:bg-blue-200">
                                                    {expandedProjects.has(project.idProjet) ? (
                                                        <ChevronDown className="w-4 h-4 text-blue-600" />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4 text-blue-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 transition-colors duration-200 group-hover:text-blue-700">
                                                        {project.module_name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {project.projet_date_debut} - {project.projet_date_fin} • {project.etp_name}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {loadingResults[project.idProjet] && (
                                            <div className="w-5 h-5 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                                        )}
                                    </div>
                                </div>

                                {/* Apprenants Results */}
                                {expandedProjects.has(project.idProjet) && (
                                    <div className="p-4 bg-white border-t border-gray-100">
                                        {loadingResults[project.idProjet] ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="text-center">
                                                    <div className="w-8 h-8 mx-auto mb-2 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                                                    <p className="text-gray-600">Chargement des résultats...</p>
                                                </div>
                                            </div>
                                        ) : apprenantResults[project.idProjet]?.length > 0 ? (
                                            <div className="space-y-3">
                                                {apprenantResults[project.idProjet].map((apprenant, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-4 transition-all duration-200 border rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200/50 hover:shadow-md group"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center justify-center w-10 h-10 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-purple-500 to-indigo-600">
                                                                    <User className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-gray-900">
                                                                        {apprenant.emp_name} {apprenant.emp_firstname}
                                                                    </p>
                                                                    <p className="text-sm text-gray-600">Apprenant</p>
                                                                </div>
                                                            </div>

                                                            <a
                                                                href={`/cfp/evaluations/froids/result/${project.idProjet}/${apprenant.idEmploye}`}
                                                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700 group-hover:shadow-lg"
                                                            >
                                                                <ExternalLink className="w-4 h-4" />
                                                                Voir le résultat
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center">
                                                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-full">
                                                    <AlertCircle className="w-6 h-6 text-orange-500" />
                                                </div>
                                                <p className="text-gray-500">Aucun résultat trouvé !</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsList;