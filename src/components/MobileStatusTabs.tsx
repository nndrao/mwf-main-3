import React from 'react';
import { Task } from '../types';

interface MobileStatusTabsProps {
  tasks: Task[];
  activeStatus: string;
  onStatusChange: (status: string) => void;
}

const MobileStatusTabs: React.FC<MobileStatusTabsProps> = ({ tasks, activeStatus, onStatusChange }) => {
  const getCount = (status: string) => {
    switch (status) {
      case 'outstanding':
        return tasks.filter(t => t.status === 'outstanding').length;
      case 'today':
        const today = new Date();
        return tasks.filter(t => {
          const taskDate = new Date(t.dueDate);
          return taskDate.toDateString() === today.toDateString() && t.status !== 'completed';
        }).length;
      case 'upcoming':
        const todayUpcoming = new Date();
        return tasks.filter(t => {
          const taskDate = new Date(t.dueDate);
          return taskDate > todayUpcoming && t.status !== 'completed';
        }).length;
      case 'completed':
        return tasks.filter(t => t.status === 'completed').length;
      default:
        return tasks.length;
    }
  };

  const tabs = [
    { id: 'all', label: 'All', color: 'blue' },
    { id: 'outstanding', label: 'Late', color: 'red' },
    { id: 'today', label: 'Today', color: 'orange' },
    { id: 'upcoming', label: 'Soon', color: 'yellow' },
    { id: 'completed', label: 'Done', color: 'green' }
  ];

  const getTabStyles = (tabId: string, color: string) => {
    const isActive = activeStatus === tabId;
    const baseStyles = "flex items-center justify-center py-2 px-2 rounded-xl transition-all duration-200 relative h-16";
    
    if (isActive) {
      switch (color) {
        case 'red':
          return `${baseStyles} bg-red-500 dark:bg-red-600 text-white`;
        case 'orange':
          return `${baseStyles} bg-orange-500 dark:bg-orange-600 text-white`;
        case 'yellow':
          return `${baseStyles} bg-yellow-500 dark:bg-yellow-600 text-white`;
        case 'green':
          return `${baseStyles} bg-green-500 dark:bg-green-600 text-white`;
        default:
          return `${baseStyles} bg-blue-500 dark:bg-blue-600 text-white`;
      }
    }
    
    return `${baseStyles} text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700`;
  };

  const getBadgeStyles = (color: string, isActive: boolean) => {
    if (isActive) {
      return 'bg-white/90 text-gray-800 font-bold';
    }
    switch (color) {
      case 'red':
        return 'bg-red-500 text-white';
      case 'orange':
        return 'bg-orange-500 text-white';
      case 'yellow':
        return 'bg-yellow-500 text-white';
      case 'green':
        return 'bg-green-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="px-4 pb-2 pt-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-5 gap-1">
          {tabs.map(tab => {
            const count = getCount(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => onStatusChange(tab.id)}
                className={getTabStyles(tab.id, tab.color)}
              >
                <div className="flex flex-col items-center justify-between h-full">
                  <div className="flex-1 flex items-center justify-center">
                    {count > 0 && (
                      <span className={`text-sm font-bold px-1.5 py-0.5 rounded-full min-w-[24px] text-center ${getBadgeStyles(tab.color, activeStatus === tab.id)}`}>
                        {count > 99 ? '99+' : count}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold mb-1">
                    {tab.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileStatusTabs;