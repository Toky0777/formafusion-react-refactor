import { useEffect, useRef } from 'react';
import { 
  createCAChartWithRealData, 
  createLearnersChartWithRealData,
  createRevenueDistributionChart,
  createLearnersDistributionChart,
  destroyChart 
} from './chartUtils';

const ChartSection = ({ 
  displayCA, 
  displayLearners, 
  displayRevenueDistribution,
  displayLearnersDistribution,
  client,
  chartsData 
}) => {
  const initializedRef = useRef(false);

  console.log(chartsData)
  // Initialiser les graphiques
  useEffect(() => {
    if (!chartsData || !client.id || initializedRef.current) return;

    // Marquer comme initialisé pour éviter les doubles appels
    initializedRef.current = true;

    // Initialiser immédiatement - les canvas doivent être dans le DOM
    if (displayCA && chartsData.revenue_evolution) {
      const canvasId = `ca-chart-${client.id}`;
      const canvas = document.getElementById(canvasId);
      if (canvas) {
        createCAChartWithRealData(
          canvasId, 
          chartsData.revenue_evolution,
          client.client_info?.etp_name || client.name
        );
      }
    }
    
    if (displayLearners && chartsData.learners_evolution) {
      const canvasId = `learners-chart-${client.id}`;
      const canvas = document.getElementById(canvasId);
      if (canvas) {
        createLearnersChartWithRealData(
          canvasId,
          chartsData.learners_evolution,
          client.client_info?.etp_name || client.name
        );
      }
    }
    
    if (displayRevenueDistribution && chartsData.revenue_distribution) {
      const canvasId = `revenue-distribution-${client.id}`;
      const canvas = document.getElementById(canvasId);
      if (canvas) {
        createRevenueDistributionChart(
          canvasId,
          chartsData.revenue_distribution
        );
      }
    }
    
    if (displayLearnersDistribution && chartsData.learners_distribution) {
      const canvasId = `learners-distribution-${client.id}`;
      const canvas = document.getElementById(canvasId);
      if (canvas) {
        createLearnersDistributionChart(
          canvasId,
          chartsData.learners_distribution
        );
      }
    }
  }, [
    chartsData, 
    client.id, 
    displayCA, 
    displayLearners, 
    displayRevenueDistribution, 
    displayLearnersDistribution
  ]);

  // Réinitialiser quand les dépendances changent
  useEffect(() => {
    initializedRef.current = false;
  }, [chartsData, client.id, displayCA, displayLearners, displayRevenueDistribution, displayLearnersDistribution]);

  // Nettoyer les graphiques au démontage
  useEffect(() => {
    return () => {
      destroyChart(`ca-chart-${client.id}`);
      destroyChart(`learners-chart-${client.id}`);
      destroyChart(`revenue-distribution-${client.id}`);
      destroyChart(`learners-distribution-${client.id}`);
    };
  }, [client.id]);

  if (!chartsData || (!displayCA && !displayLearners && !displayRevenueDistribution && !displayLearnersDistribution)) {
    return null;
  }

  return (
    <div className="space-y-3">
      {displayCA && chartsData?.revenue_evolution && (
        <ChartContainer 
          title="Évolution CA"
          chartId={`ca-chart-${client.id}`}
          key={`ca-${client.id}`}
          dataSummary={getRevenueSummary(chartsData.revenue_evolution)}
        />
      )}
      
      {displayLearners && chartsData?.learners_evolution && (
        <ChartContainer 
          title="Évolution Apprenants"
          chartId={`learners-chart-${client.id}`}
          key={`learners-${client.id}`}
          dataSummary={getLearnersSummary(chartsData.learners_evolution)}
        />
      )}
      
      {displayRevenueDistribution && chartsData?.revenue_distribution && (
        <ChartContainer 
          title="💰 Répartition CA"
          chartId={`revenue-distribution-${client.id}`}
          key={`revenue-dist-${client.id}`}
          dataSummary={getDistributionSummary(chartsData.revenue_distribution, 'revenue')}
        />
      )}
      
      {displayLearnersDistribution && chartsData?.learners_distribution && (
        <ChartContainer 
          title="📊 Répartition Apprenants"
          chartId={`learners-distribution-${client.id}`}
          key={`learners-dist-${client.id}`}
          dataSummary={getDistributionSummary(chartsData.learners_distribution, 'learners')}
        />
      )}
    </div>
  );
};

const ChartContainer = ({ title, chartId, dataSummary }) => (
  <div className="mb-3">
    <div className="flex justify-between items-center mb-1">
      <div className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold truncate">
        {title}
      </div>
      {dataSummary && (
        <div className="text-[9px] text-gray-500 bg-gray-100 px-1 rounded">
          {dataSummary}
        </div>
      )}
    </div>
    <div className="h-16 bg-gray-50 rounded p-2">
      <canvas id={chartId} key={chartId} />
    </div>
  </div>
);
const formatNumber = (number) => {
  let numStr = String(number).replace(/\s/g, "");
  if (!/^\d+$/.test(numStr)) {
    return number;
  }
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const getRevenueSummary = (revenueData) => {
  if (!revenueData) return '';
  const total = revenueData.total_current_year || 0;
 
  return formatNumber(Math.round(total));
};

const getLearnersSummary = (learnersData) => {
  if (!learnersData) return '';
  const total = learnersData.total_current_year || 0;
  return `${total} apprenants`;
};

const getDistributionSummary = (distributionData, type) => {
  if (!distributionData) return '';
  if (type === 'revenue') {
    return `${distributionData.distribution?.length || 0} projets`;
  } else {
    return `${distributionData.length || 0} projets`;
  }
};

export default ChartSection;