import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Task } from '../types';

// Status Cell Renderer
export const StatusCellRenderer: React.FC<{ value: Task['status'] }> = ({ value }) => {
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'outstanding':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
      {value}
    </span>
  );
};

// Priority Cell Renderer
export const PriorityCellRenderer: React.FC<{ value: Task['priority'] }> = ({ value }) => {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${getPriorityColor(value)}`}></div>
      <span className="text-sm text-gray-900 dark:text-white capitalize">
        {value}
      </span>
    </div>
  );
};

// Task Cell Renderer
export const TaskCellRenderer: React.FC<{ data: Task }> = ({ data }) => {
  return (
    <div className="py-2">
      <div className={`text-sm font-medium ${
        data.additionalInfo 
          ? 'text-blue-600 dark:text-blue-400' 
          : 'text-gray-900 dark:text-white'
      }`}>
        {data.title}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {data.controlName}
      </div>
    </div>
  );
};

// Actions Cell Renderer
export const ActionsCellRenderer: React.FC<{ data: Task }> = ({ data }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement actions menu
    console.log('Actions clicked for task:', data.id);
  };

  return (
    <div className="flex justify-end">
      <button
        onClick={handleClick}
        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <MoreVertical size={16} />
      </button>
    </div>
  );
};