import React, { useState } from 'react';
import { ProjectCard } from '../card/ProjectCard';
import { Building2, Filter, Users } from 'lucide-react';

export const ProjectsContainer = ({ projects, onFetchEvaluations, refreshEvaluations }) => {
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('default');

    // Fonction pour rafraîchir les évaluations d'un projet spécifique
    const handleRefreshProjectEvaluations = (projectId) => {
        console.log(`🔄 Rafraîchissement demandé pour le projet ${projectId}`);
        if (typeof refreshEvaluations === 'function') {
            refreshEvaluations(projectId);
        }
    };
    const calculateProgress = (project) => {
        if (!project?.apprs || project.apprs.length === 0) return 0;
        const evaluatedCount = project.apprs.filter(app =>
            app.evaluationCompleted || app.rating > 0
        ).length;
        return Math.round((evaluatedCount / project.apprs.length) * 100);
    };

    // Trier les projets si nécessaire
    const sortedProjects = React.useMemo(() => {
        if (!projects) return [];

        const projectsCopy = [...projects];

        switch (sortBy) {
            case 'name':
                return projectsCopy.sort((a, b) =>
                    (a.module_name || '').localeCompare(b.module_name || '')
                );
            case 'progress':
                return projectsCopy.sort((a, b) => {
                    const progressA = calculateProgress(a);
                    const progressB = calculateProgress(b);
                    return progressB - progressA;
                });
            default:
                return projectsCopy;
        }
    }, [projects, sortBy]);

    if (!projects || projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                <Building2 className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
                <p className="text-gray-500 text-center max-w-md">
                    Aucun projet ne correspond à vos critères de recherche.
                    Essayez de modifier vos filtres ou votre recherche.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-[2000px] mx-auto p-4">
                {/* Header avec contrôles */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Projets de Formation</h1>
                            <p className="text-gray-600 mt-2">
                                {projects.length} projet{projects.length > 1 ? 's' : ''} trouvé{projects.length > 1 ? 's' : ''}
                            </p>
                        </div>

                        {/* Contrôles de vue */}
                        <div className="flex items-center gap-4">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="default">Trier par défaut</option>
                                <option value="name">Nom du projet</option>
                                <option value="progress">Progression d'évaluation</option>
                            </select>

                            <div className="flex items-center gap-1 p-1 bg-white border border-gray-300 rounded-lg">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                                        ? 'bg-indigo-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    title="Vue grille"
                                >
                                    <Users className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                                        ? 'bg-indigo-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    title="Vue liste"
                                >
                                    <Filter className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grille des projets */}
                <div className={`space-y-4 ${viewMode === 'list' ? 'max-w-4xl mx-auto' : ''}`}>
                    {sortedProjects.map((project, index) => (
                        <ProjectCard
                            key={project.idProjet || index}
                            project={project}
                            onFetchEvaluations={onFetchEvaluations}
                            refreshTrigger={refreshEvaluations}
                            compact={viewMode === 'list'}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};