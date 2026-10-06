import { useEffect, useState } from 'react';
import { destroyChart } from './chartUtils';
import ClientHeader from './ClientHeader';
import FrequencyBadge from './FrequencyBadge';
import FrequencyStats from './FrequencyStats';
import KPISection from './KPISection';
import ChartSection from './ChartSection';
import ClientContact from './ClientContact';
import RegulationClient from './RegulationClient';
import { Eye } from 'lucide-react'; // Import des icônes
import customerService from '../../../services/cfp/customer/customerService';
import ProjectDrawer from '../../../components/drawer/customer/ProjectDrawer';

const ClientCard = ({
  client,
  displaySettings,
  frequencyConfig,
  getRecommendedAction,
  logoImages,
  chartsData,
  onEditEtp,
  
  account,
  onDelete
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const frequency = frequencyConfig[client.frequency];
  const action = getRecommendedAction(client.frequency);
  const [showDrawerProject, setShowDrawerProject] = useState(false);
  const [dataForEtp, setDataForEtp] = useState({});
  const [loadingForProject, setLoadingForProject] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleShowProject = async (id) => {
    setShowDrawerProject(true);
    setLoadingForProject(true);
    console.log(id)

    try {
      let res = null;
      if (account === "cfp") {
        res = await customerService.projetCustomer(id);
      } else {
        res = await customerService.getCfpById(id);
      }

      setDataForEtp(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingForProject(false);
    }
  };
console.log(client)
console.log(dataForEtp)
  // Nettoyer les graphiques lors du démontage
  useEffect(() => {
    return () => {
      destroyChart(`ca-chart-${client.id}`);
      destroyChart(`learners-chart-${client.id}`);
      destroyChart(`revenue-distribution-${client.id}`);
      destroyChart(`learners-distribution-${client.id}`);
    };
  }, [client.id]);

  return (
  <div>
    <div
      className="bg-white rounded-2xl shadow-lg p-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      {/* Boutons d'actions au hover */}
      {isHovered && (
        <div className="absolute top-14 right-8 z-20">
          <div className="flex gap-2 transition-opacity duration-300">

            {account === "cfp" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowProject(client?.id);
                }}
                className="p-2 text-gray-500 bg-white rounded-lg shadow-md transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700"
                title="Voir"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}


          </div>
        </div>
      )}

      {/* Ranking Badge */}
      {displaySettings.ranking && (
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs shadow-lg z-10">
          #{client.ranking}
        </div>
      )}

      <ClientHeader client={client} logoImages={logoImages} />

      <RegulationClient client={client} />

      <FrequencyBadge
        display={displaySettings.frequency}
        frequency={frequency}
      />

      <FrequencyStats
        display={displaySettings['frequency-stats']}
        client={client}
      />

      <KPISection
        display={displaySettings.kpi}
        client={client}
      />

      {/* ChartSection gère TOUS les graphiques maintenant */}
      <ChartSection
        displayCA={displaySettings['ca-chart']}
        displayLearners={displaySettings['learners-chart']}
        displayRevenueDistribution={displaySettings['revenue-distribution']}
        displayLearnersDistribution={displaySettings['learners-distribution']}
        client={client}
        chartsData={chartsData}
      />

      <ClientContact client={client} />

     

    </div>
     {showDrawerProject && (
        <ProjectDrawer
          isLoading={loadingForProject}
          data={dataForEtp}
          account={account}
          isShow={showDrawerProject}
          onClose={() => setShowDrawerProject(false)}
        />
      )}
</div>
    
  );
};

export default ClientCard;