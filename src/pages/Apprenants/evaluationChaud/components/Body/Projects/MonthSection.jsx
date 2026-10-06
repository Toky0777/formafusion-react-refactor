import { ProjectApprenantCard } from './ProjectApprenantCard';
import { CalendarIcon } from '@heroicons/react/24/outline';

export function MonthSection({ 
  month, 
  projects, 
  onViewDetails,
  onEvaluate,
  onShowParticipants,
  onShowClient,
  onShowLocation,
  onShowSessions,
  onViewTrainerCV
}) {

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100">
        <CalendarIcon className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800 capitalize">{month}</h2>
        <div className="ml-auto bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
          {projects.length} projet{projects.length > 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
        {projects && projects.map((project) => (
          <ProjectApprenantCard
            key={project.id}
            project={project}
            onViewDetails={onViewDetails}
            onEvaluate={onEvaluate}
            onShowParticipants={onShowParticipants}
            onShowClient={onShowClient}
            onShowLocation={onShowLocation}
            onShowSessions={onShowSessions}
            onViewTrainerCV={onViewTrainerCV}
          />
        ))}
      </div>
    </div>
  );
}