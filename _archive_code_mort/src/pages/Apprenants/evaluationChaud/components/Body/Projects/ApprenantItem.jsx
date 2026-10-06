import React from 'react';
import { User } from 'lucide-react';
import ApprenantAvatar from './ApprenantAvatar';
import ApprenantScores from './ApprenantScore';

const ApprenantItem = ({ apprenant }) => {
  return (
    <li className="pt-3 pb-0 sm:pt-4 pb-2">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ApprenantAvatar apprenant={apprenant} />
        </div>
        
        <div className="flex-1 min-w-0 ms-4">
          <span className="inline-flex items-center w-full justify-between mb-1">
            <p className="text-lg text-slate-600 line-clamp-2 font-semibold">
              {apprenant.emp_name || apprenant.nom}
            </p>
          </span>
          
          <span className="inline-flex items-start w-full justify-between">
            <p className="text-lg text-slate-600 line-clamp-1">
              {apprenant.emp_firstname || apprenant.prenom}
            </p>
            <ApprenantScores apprenant={apprenant} />
          </span>
        </div>
      </div>
    </li>
  );
};

export default ApprenantItem;