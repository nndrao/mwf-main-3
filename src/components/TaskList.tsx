import React from 'react';
import { Calendar, FileText, CheckCircle, RotateCcw, Filter, Plus } from 'lucide-react';
import { Task } from '../types';
import { formatDate, getDateColor } from '../utils/dateUtils';

interface TaskListProps {
  tasks: Task[];
  selectedTask: Task | null;
  onSelectTask: (task: Task) => void;
  onUpdateTaskStatus: (taskId: string, status: Task['status']) => void;
  onShowFilters: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  selectedTask, 
  onSelectTask, 
  onUpdateTaskStatus,
  onShowFilters
}) => {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900';
      case 'overdue': return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900';
      default: return 'text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900';
    }
  };

  const getTeamBadgeColor = (teamView?: string) => {
    switch (teamView) {
      case 'rfi': return 'bg-orange-500';
      case 'watcher': return 'bg-purple-500';
      case 'user': return 'bg-blue-500';
      case 'teams': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Compact header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tasks ({tasks.length})</h2>
          <button 
            className="bg-gray-600 text-white p-2.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-3 space-y-3">
          {tasks.map(task => (
            <div
              key={task.id}
              onClick={() => onSelectTask(task)}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-700 transition-colors"
            >
              {/* Task Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-base font-mono text-gray-500 dark:text-gray-400">#{task.id}</span>
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                  {task.teamView && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold text-white ${getTeamBadgeColor(task.teamView)}`}>
                      {task.teamView.toUpperCase()}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateTaskStatus(
                        task.id, 
                        task.status === 'completed' ? 'outstanding' : 'completed'
                      );
                    }}
                    className={`p-2.5 rounded-full transition-colors ${
                      task.status === 'completed' 
                        ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    <CheckCircle size={20} />
                  </button>
                </div>
              </div>
              
              {/* Task Content - Larger text for mobile */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                  {task.title}
                </h3>
                
                <p className="text-base text-gray-600 dark:text-gray-300">
                  {task.category}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Workflow: {task.workflowStep}
                </p>
              </div>

              {/* Status and Meta */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(task.status)}`}>
                    {task.status.toUpperCase()}
                  </span>
                  
                  {task.daysOverdue && task.daysOverdue > 0 && (
                    <span className="text-sm text-red-600 dark:text-red-400 font-semibold">
                      {task.daysOverdue} days overdue
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span className={getDateColor(task.dueDate)}>
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                  
                  {task.files.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <FileText size={14} />
                      <span>{task.files.length}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Alert Preview */}
              {task.alertText && (
                <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                  <p className="text-sm text-orange-800 dark:text-orange-300 line-clamp-2">
                    {task.alertText}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <CheckCircle size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-lg">No tasks found</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Filters Button - More appropriately sized with spacing */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
        <div className="pb-2"> {/* Added container with bottom padding for spacing */}
          <button
            onClick={onShowFilters}
            className="w-full bg-gray-700 text-white py-3 px-4 rounded-xl text-base font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
          >
            <Filter size={18} />
            <span>Filters & Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskList;