import { useState, useMemo, useEffect } from 'react';
import { MonthSection } from '../components/Body/Projects/MonthSection';
import { MagnifyingGlassIcon, FunnelIcon, AcademicCapIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import axios from '../../../../config/axios';
import LoadingSpinner from '../components/Body/LoadingSpinner';
import ApprenantDrawer from '../components/Body/Projects/ApprenantDrawer';
import CustomerDrawer from '../components/Body/Projects/CustomerDrawer';
import TrainerProfileDrawer from '../components/Body/Projects/TrainerProfileDrawer';
import { EvaluationDrawer } from '../components/Body/Projects/EvaluationDrawer';

const MONTHS_FR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

export function ProjectApprenticeList() {
  const [projectOpen, setProjectOpen] = useState({})
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [evaluationOpen, setEvaluationOpen] = useState(false)
  const [projectView, setProjectView] = useState(null)

const [drawer, setDrawer] = useState({
  evaluationOpen: false,
  apprenantOpen: false,
  customerOpen: false,
  trainerOpen: false,
  selectedProject: null,
  customerId: null,
  trainerId: null,
});

    const onCloseEval = () => {
      handleCloseDrawer('evaluation');
    };

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/employes/projets/list`);

      if (data?.projets && Array.isArray(data.projets)) {
        const processedProjects = data.projets.map(project => {
          const date = new Date(project.dateDebut);
          const month = `${MONTHS_FR[date.getMonth()]} ${date.getFullYear()}`;
          let clientData = {
            id: project.idEtp || null,
            name: 'Client inconnu'
          };
          if (Array.isArray(project.etp_name) && project.etp_name.length > 0) {
            const client = project.etp_name[0];
            clientData = {
              id: client.idEtp || project.idEtp,
              name: client.etp_name || 'Client inconnu',
              logo: client.etp_logo,
              initial: client.etp_initial_name
            };
          } else if (typeof project.etp_name === 'string') {
            clientData.name = project.etp_name;
          }
          return {
            ...project,
            id: project.idProjet,
            title: project.module_name || 'Sans titre',
            status: project.project_status || 'Inconnu',
            type: project.project_type || 'Inconnu',
            location: project.ville || '',
            client: clientData,
            month: month,
          };
        });
        setProjects(processedProjects);
      } else {
        console.error('Aucune donnée reçue ou format incorrect:', data);
        setProjects([]);
      }
    } catch (error) {
      console.error('Erreur API:', error.response?.data || error.message);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const uniqueStatuses = useMemo(() => {
    const statuses = projects.map(p => p.status).filter(Boolean);
    return [...new Set(statuses)];
  }, [projects]);

  const uniqueTypes = useMemo(() => {
    const types = projects.map(p => p.type).filter(Boolean);
    return [...new Set(types)];
  }, [projects]);

  const projectsByMonth = useMemo(() => {
    let filteredProjects = projects;
    if (searchTerm) {
      filteredProjects = filteredProjects.filter(project =>
        (project.title && project.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.client?.name && project.client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.location && project.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (selectedStatus !== 'all') {
      filteredProjects = filteredProjects.filter(project => project.status === selectedStatus);
    }
    if (selectedType !== 'all') {
      filteredProjects = filteredProjects.filter(project => project.type === selectedType);
    }
    const grouped = filteredProjects.reduce((acc, project) => {
      const month = project.month;
      if (!acc[month]) acc[month] = [];
      acc[month].push(project);
      return acc;
    }, {});
    return Object.keys(grouped)
      .sort((a, b) => {
        const [monthA, yearA] = a.split(' ');
        const [monthB, yearB] = b.split(' ');
        if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
        return MONTHS_FR.indexOf(monthB) - MONTHS_FR.indexOf(monthA);
      })
      .reduce((acc, key) => ({ ...acc, [key]: grouped[key] }), {});
  }, [searchTerm, selectedStatus, selectedType, projects]);

// Dans ProjectApprenantCard, vérifiez que project est bien passé
const handleOpenEvaluation = (project) => {
    console.log("Opening evaluation for:", project);
    if (!project || !project.idProjet) {
        console.error("Project invalide");
        return;
    }
    
    setDrawer(prev => ({
        ...prev,
        evaluationOpen: true, 
        selectedProject: project
    }));
};

  const handleOpenParticipants = (project) => {
    setDrawer(prev => ({ ...prev, apprenantOpen: true, selectedProject: project }));
  };

  const handleOpenClient = (clientId) => {
    setDrawer(prev => ({ ...prev, customerOpen: true, customerId: clientId }));
  };

  const handleOpenTrainerCV = (trainerId) => {
    setDrawer(prev => ({ ...prev, trainerOpen: true, trainerId: trainerId }));
  };

  const handleCloseDrawer = (drawerName) => {
    setDrawer(prev => ({
      ...prev,
      [`${drawerName}Open`]: false,
      ...(drawerName === 'evaluation' && { selectedProject: null }),
      ...(drawerName === 'apprenant' && { selectedProject: null }),
      ...(drawerName === 'customer' && { customerId: null }),
      ...(drawerName === 'trainer' && { trainerId: null }),
    }));
  };

  const handleResetFilters = () => {
    setSelectedStatus('all');
    setSelectedType('all');
    setSearchTerm('');
    setIsFilterOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30 backdrop-blur-sm bg-white/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <AcademicCapIcon className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Projets d'Apprentissage</h1>
                  <p className="text-gray-600">Gérez vos formations et suivez les progrès</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher un projet..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
                  />
                </div>
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <FunnelIcon className="w-5 h-5" />
                    Filtres
                    <ChevronDownIcon className={clsx("w-4 h-4 transition-transform", isFilterOpen && "rotate-180")} />
                  </button>
                  {isFilterOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                      <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-64 z-20">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                            <select
                              value={selectedStatus}
                              onChange={(e) => setSelectedStatus(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="all">Tous les statuts</option>
                              {uniqueStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                            <select
                              value={selectedType}
                              onChange={(e) => setSelectedType(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="all">Tous les types</option>
                              {uniqueTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                          </div>
                          <button
                            onClick={handleResetFilters}
                            className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Réinitialiser
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? <LoadingSpinner /> : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {Object.keys(projectsByMonth).length === 0 ? (
              <div className="text-center py-16">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <AcademicCapIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
                <p className="text-gray-500">
                  {projects.length === 0 ? "Vous n'avez aucun projet assigné." : "Essayez de modifier vos critères de recherche ou vos filtres."}
                </p>
              </div>
            ) : (
              Object.entries(projectsByMonth).map(([month, monthProjects]) => (
                <MonthSection
                  key={month}
                  month={month}
                  projects={monthProjects}
                  onEvaluate={handleOpenEvaluation}
                  onShowParticipants={handleOpenParticipants}
                  onShowClient={handleOpenClient}
                  onViewTrainerCV={handleOpenTrainerCV}
                />
              ))
            )}
          </div>
        )}
      </div>
    {drawer.evaluationOpen && drawer.selectedProject && (<EvaluationDrawer project={drawer.selectedProject} onClose={() => handleCloseDrawer('evaluation')} />)}
    {drawer.apprenantOpen && <ApprenantDrawer projet={drawer.selectedProject} onClose={() => handleCloseDrawer('apprenant')} />}
    {drawer.customerOpen && <CustomerDrawer idEtps={drawer.customerId} onClose={() => handleCloseDrawer('customer')} />}
    {drawer.trainerOpen && <TrainerProfileDrawer idTrainer={drawer.trainerId} onClose={() => handleCloseDrawer('trainer')} />}
    </>
  );
}