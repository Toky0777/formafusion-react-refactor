import React from "react";
import RadioGroup from "./RadioGroup";
import { Sliders } from "lucide-react";

const PRICE_RANGES = {
    LOW: '1',
    MEDIUM: '2',
    HIGH: '3'
  };

const SidebarFilters = ({ 
    selectedPeriod, 
    selectedPrice, 
    onPeriodSelect, 
    onPriceSelect, 
    onReset 
  }) => {
  
    const periodOptions = [
      { value: 1, label: 'Événements à Venir'},
      { value: 2, label: 'Ce Mois-ci'}
    ];
    
    const priceOptions = [
      { value: PRICE_RANGES.LOW, label: 'Moins de 200 000 MGA' },
      { value: PRICE_RANGES.MEDIUM, label: '200 000 - 350 000 MGA' },
      { value: PRICE_RANGES.HIGH, label: 'Plus de 350 000 MGA' }
    ];
    
    return (
      <div className="md:w-1/4">
        <div className="p-5 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Sliders className="w-5 h-5" aria-hidden="true" />
              Filtres
            </h3>
            <button 
              className="text-sm text-purple-600 hover:text-purple-800 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded"
              onClick={onReset}
              aria-label="Effacer tous les filtres"
            >
              Effacer Tout
            </button>
          </div>
          
          <RadioGroup
            name="period"
            options={periodOptions}
            selectedValue={selectedPeriod}
            onChange={onPeriodSelect}
            label="Période"
          />
          
          <RadioGroup
            name="price"
            options={priceOptions}
            selectedValue={selectedPrice}
            onChange={onPriceSelect}
            label="Gamme de Prix"
          />
        </div>
      </div>
    );
  };

export default SidebarFilters;