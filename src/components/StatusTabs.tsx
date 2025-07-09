import React from 'react';
import { AlertTriangle, Clock, CheckCircle, Calendar } from 'lucide-react';
import { Task } from '../types';

interface StatusTabsProps {
  tasks: Task[];
  activeStatus: string;
  onStatusChange: (status: string) => void;
}

const StatusTabs: React.FC<StatusTabsProps> = ({ tasks, activeStatus, onStatusChange }) => {
  const statusCounts = {
    overdue: tasks.filter(t => t.status === 'overdue').length,
    today: tasks.filter(t => {
      const today = new Date();
      const taskDate = new Date(t.dueDate);
      return taskDate.toDateString() === today.toDateString() && t.status !== 'completed';
    }).length,
    upcoming: tasks.filter(t => {
      const today = new Date();
      const taskDate = new Date(t.dueDate);
      return taskDate > today && t.status !== 'completed';
    }).length,
    completed: tasks.filter(t => t.status === 'completed').length,
    all: tasks.length
  };

  const tabs = [
    { 
      id: 'overdue', 
      label: 'OVERDUE', 
      count: statusCounts.overdue, 
      color: 'bg-red-600 text-white',
      icon: AlertTriangle 
    },
    { 
      id: 'today', 
      label: 'TODAY', 
      count: statusCounts.today, 
      color: 'bg-yellow-500 text-white',
      icon: Clock 
    },
    { 
      id: 'upcoming', 
      label: 'UPCOMING', 
      count: statusCounts.upcoming, 
      color: 'bg-green-500 text-white',
      icon: Calendar 
    },
    { 
      id: 'completed', 
      label: 'COMPLETED', 
      count: statusCounts.completed, 
      color: 'bg-purple-600 text-white',
      icon: CheckCircle 
    },
    { 
      id: 'all', 
      label: 'ALL', 
      count: statusCounts.all, 
      color: 'bg-gray-600 text-white',
      icon: Calendar 
    }
  ];

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeStatus === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onStatusChange(tab.id)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-semibold transition-all
              ${isActive 
                ? tab.color 
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <Icon size={16} />
            <span>{tab.label}</span>
            <span className={`
              px-2 py-1 rounded-full text-xs font-bold
              ${isActive 
                ? 'bg-white bg-opacity-20' 
                : 'bg-gray-200 text-gray-700'
              }
            `}>
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default StatusTabs;