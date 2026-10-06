import { useEffect, useState } from 'react';
import { BookOpen, Home, Mail, History } from 'lucide-react';
import ProjectsTableEvaluation from '../../../components/evaluation/table';
import LearnersList from '../../../components/evaluation/learner';
import ResultsList from '../../../components/evaluation/list';
import axios from '../../../config/axios';

const EvaluationFroid = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [apprenants, setApprenants] = useState([]);
  const [results, setResults] = useState([]);
  const [learnerLoading, setLearnerLoading] = useState(false);

  const ApprenantsRequest = async () => {
    setLearnerLoading(true);
    try {
      const { data } = await axios.get(`/cfp/evaluations/froids/apprenants/${selectedProject?.idProjet}`);
      setApprenants(data.apprenants);
    } catch (error) {
      console.error('Erreur lors de la récupération des apprenants:', error);
    } finally {
      setLearnerLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject != null && selectedProject.idProjet) {
      ApprenantsRequest();
    }
  }, [selectedProject]);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    ApprenantsRequest();
  };

  const NavigationListFroid = () => {
    const location = { pathname: '/cfp/evaluation/froids' };
    const isMenuActive = (route) => location.pathname === route;
    const getIcon = (iconName) => {
      switch (iconName) {
        case 'home': return <Home className="w-4 h-4" />;
        case 'history': return <History className="w-4 h-4" />;
        case 'mail': return <Mail className="w-4 h-4" />;
        default: return <Home className="w-4 h-4" />;
      }
    };

  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="mx-auto max-w-8xl">
        {/* Header amélioré */}
        <div className="sticky top-0 z-30 mb-8 bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm bg-white/90 rounded-xl">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-600">Évaluations à Froid</h1>
                  <p className="text-gray-600">Gestion et suivi des formations terminées</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation améliorée */}
          {/* <div className="px-4 pb-4">
            <NavigationListFroid />
          </div> */}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-5">
          {/* Projects Table - 3 columns */}
          <div className="lg:col-span-3">
            <ProjectsTableEvaluation
              onProjectSelect={handleProjectSelect}
              selectedProject={selectedProject}
            />
          </div>

          {/* Apprenants List - 2 columns */}
          <div className="lg:col-span-2">
            <LearnersList
              apprenants={apprenants || []}
              selectedProject={selectedProject}
              learnerLoading={learnerLoading}
            />
          </div>
        </div>

        {/* Results Section - Full width */}
        <div className="w-full">
          <ResultsList
            results={results}
            selectedProject={selectedProject}
          />
        </div>
      </div>
    </div>
  );
};

export default EvaluationFroid;