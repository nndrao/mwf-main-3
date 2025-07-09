import React from 'react';
import { X, Search, ChevronRight } from 'lucide-react';
import { TaskFilters as TaskFiltersType, Task } from '../types';

interface FilterSheetProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  tasks: Task[];
  onClose: () => void;
}

const FilterSheet: React.FC<FilterSheetProps> = ({ 
  filters, 
  onFiltersChange, 
  tasks, 
  onClose 
}) => {
  const statusCounts = {
    all: tasks.length,
    outstanding: tasks.filter(t => t.status === 'outstanding').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
  };

  const teamViewOptions = [
    { id: 'all', label: 'All Views', count: tasks.length },
    { id: 'user', label: 'My Tasks (User Only)', count: tasks.filter(t => t.teamView === 'user').length },
    { id: 'pending', label: 'My Tasks (Pending Others)', count: tasks.filter(t => t.teamView === 'pending').length },
    { id: 'watcher', label: 'My Watcher View', count: tasks.filter(t => t.teamView === 'watcher').length },
    { id: 'rfi', label: 'My RFI Tasks', count: tasks.filter(t => t.teamView === 'rfi').length },
    { id: 'teams', label: 'My Teams Tasks', count: tasks.filter(t => t.teamView === 'teams').length },
    { id: 'extended', label: 'My Extended Teams Tasks', count: tasks.filter(t => t.teamView === 'extended').length },
  ];

  const categories = [
    'Final PnL Sign-Off',
    'Employee Licensing & Registrations',
    'T+3 Clean PnL Sign-Off',
    'Anomalous Trading',
    'Cancel and Amend Review',
    'Supervisor Dashboard Signoff',
    'Independent Price Verification (IPV)',
    'Trade Surveillance Alert'
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center sm:justify-center animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 w-full h-[85vh] sm:h-auto sm:max-h-[85vh] sm:w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filters</h2>
          <button
            onClick={onClose}
            className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content with subtle scrollbar */}
        <div className="flex-1 overflow-y-auto filter-scroll p-4 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Team View */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Team View</h3>
            <div className="space-y-2">
              {teamViewOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => onFiltersChange({ ...filters, teamView: option.id })}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                    filters.teamView === option.id 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="text-base font-medium">{option.label}</span>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      filters.teamView === option.id 
                        ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      {option.count}
                    </span>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Status</h3>
            <div className="space-y-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <button
                  key={status}
                  onClick={() => onFiltersChange({ ...filters, status })}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                    filters.status === status 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="text-base font-medium capitalize">{status}</span>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      filters.status === status 
                        ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      {count}
                    </span>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => onFiltersChange({ ...filters, category: 'all' })}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                  filters.category === 'all' 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <span className="text-base font-medium">All Categories</span>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    filters.category === 'all' 
                      ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200' 
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}>
                    {tasks.length}
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </button>
              
              {categories.map(category => {
                const count = tasks.filter(t => t.category === category).length;
                return (
                  <button
                    key={category}
                    onClick={() => onFiltersChange({ ...filters, category })}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                      filters.category === category 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="text-base font-medium text-left">{category}</span>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        filters.category === category 
                          ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200' 
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }`}>
                        {count}
                      </span>
                      <ChevronRight size={18} className="text-gray-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Priority</h3>
            <div className="space-y-2">
              {['all', 'low', 'medium', 'high', 'critical'].map(priority => (
                <button
                  key={priority}
                  onClick={() => onFiltersChange({ ...filters, priority })}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                    filters.priority === priority 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="text-base font-medium capitalize">{priority} Priority</span>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Extra padding at bottom to ensure last item is visible */}
          <div className="h-4"></div>
        </div>

        {/* Footer - Fixed */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3 flex-shrink-0 bg-white dark:bg-gray-800">
          <button
            onClick={() => onFiltersChange({
              status: 'all',
              category: 'all',
              priority: 'all',
              search: '',
              subcategory: '',
              daysFilter: '',
              teamView: 'all'
            })}
            className="w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Clear All Filters
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-4 bg-gray-700 text-white rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSheet;