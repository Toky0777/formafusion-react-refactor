import React from 'react';
import { X, Plus } from 'lucide-react';
import FormationHeader from './FormationHeader';
import ApprenantsByCompany from './ApprenantsByCompany';

const ApprenantList = ({ 
  apprenants = [],
  formation = {}, 
  onClose, 
  onAddApprenant 
}) => {
  // Grouper les apprenants par entreprise
  const groupedApprenants = apprenants.reduce((acc, apprenant) => {
    const company = apprenant.company || 'Sans entreprise';
    if (!acc[company]) {
      acc[company] = [];
    }
    acc[company].push(apprenant);
    return acc;
  }, {});
  return (
    <div className="fixed right-0 top-0 z-20 bg-white offcanvas offcanvas-end !w-[60rem] overflow-y-auto show" 
         tabIndex="-1" 
         id="offcanvasEtp" 
         aria-labelledby="offcanvasEtp" 
         aria-modal="true" 
         role="dialog">
      
      <div className="flex flex-col w-full">
        {/* Header */}
        <div className="w-full px-4 py-2 inline-flex items-center justify-between bg-gray-100">
          <p className="text-lg text-gray-500 font-medium">
            Nombres d'apprenants : {apprenants.length}
          </p>
          <div className="inline-flex items-center gap-2">
            <button 
              onClick={onAddApprenant}
              className="btn btn-sm btn-outline opacity-70 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              Ajouter d'autre apprenant
            </button>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-md hover:bg-gray-200 duration-200 cursor-pointer flex items-center justify-center"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div id="listApprDrawer" className="w-full flex flex-col p-3 relative">
          <FormationHeader formation={formation} />
          
          <div className="mt-2 px-4">
            <ul role="list" className="divide-y divide-dashed divide-gray-200">
              {Object.entries(groupedApprenants).map(([company, companyApprenants]) => (
                <ApprenantsByCompany 
                  key={company}
                  company={company}
                  apprenants={companyApprenants}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="offcanvas-backdrop fade show"></div>
    </div>
  );
};

export default ApprenantList;