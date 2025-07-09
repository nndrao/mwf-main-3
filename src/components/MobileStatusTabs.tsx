import React from 'react';
import { Clock, AlertTriangle, Calendar, CheckCircle } from 'lucide-react';
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
    { id: 'all', label: 'All', icon: <Clock size={18} />, color: 'blue' },
    { id: 'outstanding', label: 'Outstanding', icon: <AlertTriangle size={18} />, color: 'red' },
    { id: 'today', label: 'Today', icon: <Calendar size={18} />, color: 'orange' },
    { id: 'upcoming', label: 'Upcoming', icon: <Clock size={18} />, color: 'yellow' },
    { id: 'completed', label: 'Done', icon: <CheckCircle size={18} />, color: 'green' }
  ];

  const getTabStyles = (tabId: string, color: string) => {
    const isActive = activeStatus === tabId;
    const baseStyles = "flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-200 relative";
    
    if (isActive) {
      switch (color) {
        case 'red':
          return `${baseStyles} bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300`;
        case 'orange':
          return `${baseStyles} bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300`;
        case 'yellow':
          return `${baseStyles} bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300`;
        case 'green':
          return `${baseStyles} bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300`;
        default:
          return `${baseStyles} bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300`;
      }
    }
    
    return `${baseStyles} text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700`;
  };

  const getBadgeStyles = (color: string) => {
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
    <div className="px-4 pb-2">
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
                <div className="relative">
                  {tab.icon}
                  {count > 0 && activeStatus !== tab.id && (
                    <span className={`absolute -top-2 -right-2 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] ${getBadgeStyles(tab.color)}`}>
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold mt-1">{tab.label}</span>
                {activeStatus === tab.id && (
                  <span className="text-xs font-bold mt-0.5">{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileStatusTabs;