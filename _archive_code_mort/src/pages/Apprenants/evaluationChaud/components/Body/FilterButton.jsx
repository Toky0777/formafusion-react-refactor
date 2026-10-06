import React from 'react';
import { Filter } from 'lucide-react';

export const FilterButton = ({ onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
        isActive 
          ? 'bg-violet-500 border-violet-500 text-white' 
          : 'bg-white border-gray-200 text-gray-700 hover:bg-violet-50 hover:border-violet-300'
      }`}
    >
      <Filter className="w-4 h-4" />
      Filtrer vos projets
    </button>
  );
};