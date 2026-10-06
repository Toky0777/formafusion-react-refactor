import React from 'react';
import { Badge } from 'lucide-react';

export const StatusFilter = ({ onStatusChange, selectedStatus }) => {
  const statuses = [
    { label: 'En cours', count: 8, color: 'bg-blue-500', value: 'En cours' },
    { label: 'Terminé', count: 177, color: 'bg-green-500', value: 'Terminé' },
    { label: 'Clôturé', count: 11, color: 'bg-red-600', value: 'Cloturé' }
  ];

  return (
    <div className="flex flex-wrap items-center gap-4">
      {statuses.map((status) => (
        <div key={status.value} className="relative">
          <span className={`absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 ${status.color} rounded-full z-10`}>
            {status.count}
          </span>
          <button
            onClick={() => onStatusChange(status.value)}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
              selectedStatus === status.value 
                ? 'bg-violet-100 border-violet-300 text-violet-700' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {status.label}
          </button>
        </div>
      ))}
    </div>
  );
};