import ClientCard from './ClientCard';

const ClientGrid = ({ 
  clients, 
  displaySettings, 
  frequencyConfig, 
  getRecommendedAction, 
  logoImages,
  onEditEtp,
  onShowProject,
  onDeleteClient 
}) => {
  const gridClasses = [
    !displaySettings.ranking && 'hide-ranking',
    !displaySettings.frequency && 'hide-frequency',
    !displaySettings['frequency-stats'] && 'hide-frequency-stats',
    !displaySettings.actions && 'hide-actions',
    !displaySettings.kpi && 'hide-kpi',
    !displaySettings['ca-chart'] && 'hide-ca-chart',
    !displaySettings['learners-chart'] && 'hide-learners-chart'
  ].filter(Boolean).join(' ');

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-5 gap-4 ${gridClasses}`}>
      {clients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          displaySettings={displaySettings}
          frequencyConfig={frequencyConfig}
          getRecommendedAction={getRecommendedAction}
          logoImages={logoImages}
          chartsData={client.charts_data}
          onEditEtp={onEditEtp}
          onShowProject={onShowProject}
          onDelete={onDeleteClient}
          account="cfp"
        />
      ))}
    </div>
  );
};

export default ClientGrid;