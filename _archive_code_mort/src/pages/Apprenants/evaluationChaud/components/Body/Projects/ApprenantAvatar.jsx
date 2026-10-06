import React from 'react';
import { User } from 'lucide-react';

const ApprenantAvatar = ({ apprenant }) => {
  if (apprenant.avatar || apprenant.emp_photo) {
    return (
      <img 
        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" 
        src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/employes/${apprenant.emp_photo}`}
        alt={`${apprenant.firstName} ${apprenant.lastName}`}
      />
    );
  }

  return (
    <div className="w-14 h-14 rounded-full flex items-center justify-center text-gray-500 font-bold text-center bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white shadow-sm relative">
      <User className="w-6 h-6 text-gray-600" />
    </div>
  );
};

export default ApprenantAvatar;