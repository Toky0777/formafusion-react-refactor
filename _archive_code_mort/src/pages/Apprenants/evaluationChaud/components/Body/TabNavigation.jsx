import React from 'react';
import { FolderOpen, Archive, Trash2 } from 'lucide-react';

export const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'projets', label: 'Projets', icon: FolderOpen },
    { id: 'archives', label: 'Archives', icon: Archive },
    { id: 'corbeilles', label: 'Corbeille', icon: Trash2 }
  ];

  return (
    <div className="flex items-center gap-1 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-violet-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};