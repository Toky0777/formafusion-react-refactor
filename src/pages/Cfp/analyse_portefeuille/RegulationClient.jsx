import React from 'react';
import { IMAGE_URL } from "../../../config/env";

const RegulationClient = ({ client, logoImages }) => {
  const imgUrl = IMAGE_URL + "/img/entreprises";
  
  // Récupérer les données de regulation
  const regulationData = client.regulation || [];
  
  // Trouver l'année courante (la dernière dans le tableau)
  const currentYearData = regulationData[regulationData.length - 1];
  const currentPercentage = currentYearData ? currentYearData.percentage : 0;
  
  // Déterminer le niveau de risque basé sur l'évolution
  const getRiskLevel = () => {
    if (regulationData.length < 2) return "high";
    
    const previousYearData = regulationData[regulationData.length - 2];
    const previousPercentage = previousYearData ? previousYearData.percentage : 0;
    
    if (currentPercentage > previousPercentage) return "medium";
    if (currentPercentage === previousPercentage) return "medium";
    return "high";
  };
  
  // Déterminer la tendance
  const getTrend = () => {
    if (regulationData.length < 2) return "→";
    
    const previousYearData = regulationData[regulationData.length - 2];
    const previousPercentage = previousYearData ? previousYearData.percentage : 0;
    
    if (currentPercentage > previousPercentage) return "↗";
    if (currentPercentage < previousPercentage) return "↘";
    return "→";
  };
  
  // Vérifier si c'est un nouveau client (pas de CA les années précédentes)
  const isNewClient = () => {
    if (regulationData.length === 0) return false;
    
    const hasPreviousRevenue = regulationData
      .slice(0, -1)
      .some(year => year.client_revenue > 0);
    
    return !hasPreviousRevenue && currentPercentage > 0;
  };

  const riskLevel = getRiskLevel();
  const trend = getTrend();
  const isNew = isNewClient();

  // Couleurs selon le niveau de risque
  const riskColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800"
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
      {/* Part du CA total */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="bg-blue-50 rounded-md p-1 border border-blue-100">
              <div className="text-xs font-medium text-gray-600">Part du CA total</div>
              <div className="text-xs font-bold text-blue-700">
                {currentPercentage > 0 ? `${currentPercentage.toFixed(1)}%` : '0%'}
              </div>
            </div>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
            style={{ width: `${currentPercentage}%` }}
          ></div>
        </div>

        {/* Indicateur de risque */}
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold shadow-sm ${riskColors[riskLevel]}`}>
            {riskLevel === 'high' ? 'Risque élevé' : riskLevel === 'medium' ? 'Risque moyen' : 'Risque faible'} (tendance {trend})
          </span>
        </div>
      </div>

      {/* Évolution 5 ans */}
      <div className="mt-1 pt-1 border-t border-gray-200">
        <div className="flex flex-col space-y-2">
          <div className="text-xs font-medium text-gray-600">Évolution 5 ans:</div>
          
          {/* Années */}
          <div className="flex items-center space-x-1 text-xs">
            {regulationData.map((yearData, index) => (
              <React.Fragment key={yearData.year}>
                <span 
                  className={`px-0.5 ${
                    index === regulationData.length - 1 
                      ? 'text-blue-600 font-semibold bg-blue-50 rounded text-[10px]' 
                      : yearData.percentage === 0 
                      ? 'text-gray-400' 
                      : 'text-gray-600'
                  }`}
                  title={`${yearData.year}: ${yearData.percentage.toFixed(1)}%`}
                >
                  {yearData.percentage > 0 ? `${yearData.percentage.toFixed(1)}%` : '—%'}
                </span>
                {index < regulationData.length - 1 && (
                  <span className="text-gray-300 text-[10px]">→</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Badge Nouveau si applicable */}
          {isNew && (
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-green-100 text-green-800 shadow-sm">
               
                Nouveau
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegulationClient;