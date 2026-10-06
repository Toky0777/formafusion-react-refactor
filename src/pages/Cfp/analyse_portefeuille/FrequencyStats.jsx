
const FrequencyStats = ({ display, client }) => {
  if (!display) return null;

  return (
    <div className="flex gap-2 mb-3">
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-2 rounded border border-gray-200 text-center">
        <div className="text-base font-bold text-[#667eea] mb-0.5">
          {client.projectsPerYear}
        </div>
        <div className="text-[9px] text-gray-600 uppercase tracking-wider leading-tight">
          {client.frequency === 'nouveau' ? '1er Projet' : 'Projets/an'}
        </div>
      </div>
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-2 rounded border border-gray-200 text-center">
        <div className="text-base font-bold text-[#667eea] mb-0.5">
          {client.lastTrainingDays}
        </div>
        <div className="text-[9px] text-gray-600 uppercase tracking-wider leading-tight">
          {client.frequency === 'nouveau' ? 'Inscription (j)' : 'Dernière (j)'}
        </div>
      </div>
    </div>
  );
};

export default FrequencyStats;