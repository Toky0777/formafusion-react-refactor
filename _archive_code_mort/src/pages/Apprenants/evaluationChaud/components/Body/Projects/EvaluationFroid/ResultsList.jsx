import React from 'react';
import { BarChart3, TrendingUp, Award, AlertCircle, ChevronDown, ChevronRight, ExternalLink, User } from 'lucide-react';
import { useState } from 'react';

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
      const response = await fetch(`/cfp/evaluations/froids/detail/${idProjet}`);
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-green-50/50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Liste des résultats</h3>
              <p className="text-sm text-gray-600">
                {projectResults.length > 0 ? `${projectResults.length} projet${projectResults.length > 1 ? 's' : ''} avec résultats` : 'Aucun résultat'}
              </p>
            </div>
          </div>
          
          {/* Affichage du score moyen */}
          {results.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm text-gray-600">Score moyen</p>
                <p className={`text-xl font-bold ${getScoreColor(averageScore)}`}>
                  {averageScore}%
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {projectResults.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-orange-400" />
            </div>
            <p className="text-gray-500 text-center">
              Résultat indisponible
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Aucun résultat d'évaluation disponible
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Project Results List */}
            {projectResults.map((project) => (
              <div key={project.idProjet} className="border border-gray-200 rounded-xl overflow-hidden">
                {/* Project Header */}
                <div 
                  onClick={() => getApprenantByProjectResult(project.idProjet)}
                  className="p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 cursor-pointer hover:from-blue-50 hover:to-indigo-50/50 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                          {expandedProjects.has(project.idProjet) ? (
                            <ChevronDown className="w-4 h-4 text-blue-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                            {project.module_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {project.projet_date_debut} - {project.projet_date_fin} • {project.etp_name}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Affichage du score du projet */}
                      {project.score !== undefined && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Score</p>
                          <p className={`text-lg font-bold ${getScoreColor(project.score)}`}>
                            {project.score}%
                          </p>
                        </div>
                      )}
                      
                      {loadingResults[project.idProjet] && (
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Apprenants Results */}
                {expandedProjects.has(project.idProjet) && (
                  <div className="p-4 bg-white border-t border-gray-100">
                    {loadingResults[project.idProjet] ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-gray-600">Chargement des résultats...</p>
                        </div>
                      </div>
                    ) : apprenantResults[project.idProjet]?.length > 0 ? (
                      <div className="space-y-3">
                        {apprenantResults[project.idProjet].map((apprenant, index) => (
                          <div 
                            key={index}
                            className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200/50 hover:shadow-md transition-all duration-200 group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                                  <User className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {apprenant.emp_name} {apprenant.emp_firstname}
                                  </p>
                                  <p className="text-sm text-gray-600">Apprenant</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                {/* Affichage du score de l'apprenant */}
                                {apprenant.score !== undefined && (
                                  <div className="text-right">
                                    <p className="text-sm text-gray-600">Score</p>
                                    <p className={`text-lg font-bold ${getScoreColor(apprenant.score)}`}>
                                      {apprenant.score}%
                                    </p>
                                  </div>
                                )}
                                
                                <a 
                                  href={`/cfp/evaluations/froids/result/${project.idProjet}/${apprenant.idEmploye}`}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-sm group-hover:shadow-lg"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Voir le résultat
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
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