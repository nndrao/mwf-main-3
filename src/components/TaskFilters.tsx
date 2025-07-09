import React, { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronRight, Calendar } from 'lucide-react';
import { TaskFilters as TaskFiltersType, Task, TaskCategory } from '../types';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  tasks: Task[];
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, onFiltersChange, tasks }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Final PnL Sign-Off']));
  
  const statusCounts = {
    all: tasks.length,
    outstanding: tasks.filter(t => t.status === 'outstanding').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
  };

  const teamViewOptions = [
    { id: 'user', label: 'My Tasks (User Only)', count: tasks.filter(t => t.teamView === 'user').length },
    { id: 'pending', label: 'My Tasks (Pending Others)', count: tasks.filter(t => t.teamView === 'pending').length },
    { id: 'watcher', label: 'My Watcher View', count: tasks.filter(t => t.teamView === 'watcher').length },
    { id: 'rfi', label: 'My RFI Tasks', count: tasks.filter(t => t.teamView === 'rfi').length },
    { id: 'teams', label: 'My Teams Tasks', count: tasks.filter(t => t.teamView === 'teams').length },
    { id: 'extended', label: 'My Extended Teams Tasks', count: tasks.filter(t => t.teamView === 'extended').length },
  ];

  const categories: TaskCategory[] = [
    {
      id: 'final-pnl',
      name: 'Final PnL Sign-Off',
      count: tasks.filter(t => t.category === 'Final PnL Sign-Off').length,
      color: '#ef4444',
      subcategories: [
        {
          id: 'rates-liquid-institutional-options',
          name: 'Rates | Liquid Products - Derivs | Institutional Options',
          count: tasks.filter(t => t.subcategory === 'Rates | Liquid Products - Derivs | Institutional Options').length,
          parentId: 'final-pnl'
        },
        {
          id: 'rates-liquid-institutional-swaps',
          name: 'Rates | Liquid Products - Derivs | Institutional Swaps CLT',
          count: tasks.filter(t => t.subcategory === 'Rates | Liquid Products - Derivs | Institutional Swaps CLT').length,
          parentId: 'final-pnl'
        },
        {
          id: 'foreign-exchange-fx',
          name: 'Foreign Exchange | FX Options',
          count: tasks.filter(t => t.subcategory === 'Foreign Exchange | FX Options').length,
          parentId: 'final-pnl'
        }
      ],
      daysFilter: [7, 14, 30]
    },
    {
      id: 'employee-licensing',
      name: 'Employee Licensing & Registrations',
      count: tasks.filter(t => t.category === 'Employee Licensing & Registrations').length,
      color: '#f59e0b',
      subcategories: [
        {
          id: 'government-security-dealer',
          name: 'Government Security Dealer Transaction Review',
          count: tasks.filter(t => t.subcategory === 'Government Security Dealer Transaction Review').length,
          parentId: 'employee-licensing'
        },
        {
          id: 'employee-licensing-exception',
          name: 'Employee Licensing & Registration Exception',
          count: tasks.filter(t => t.subcategory === 'Employee Licensing & Registration Exception').length,
          parentId: 'employee-licensing'
        }
      ]
    },
    {
      id: 't3-clean-pnl',
      name: 'T+3 Clean PnL Sign-Off',
      count: tasks.filter(t => t.category === 'T+3 Clean PnL Sign-Off').length,
      color: '#10b981'
    },
    {
      id: 'anomalous-trading',
      name: 'Anomalous Trading',
      count: tasks.filter(t => t.category === 'Anomalous Trading').length,
      color: '#8b5cf6'
    },
    {
      id: 'cancel-amend-review',
      name: 'Cancel and Amend Review',
      count: tasks.filter(t => t.category === 'Cancel and Amend Review').length,
      color: '#06b6d4'
    },
    {
      id: 'supervisor-dashboard',
      name: 'Supervisor Dashboard Signoff',
      count: tasks.filter(t => t.category === 'Supervisor Dashboard Signoff').length,
      color: '#84cc16'
    },
    {
      id: 'ipv',
      name: 'Independent Price Verification (IPV)',
      count: tasks.filter(t => t.category === 'Independent Price Verification (IPV)').length,
      color: '#f97316'
    },
    {
      id: 'trade-surveillance',
      name: 'Trade Surveillance Alert',
      count: tasks.filter(t => t.category === 'Trade Surveillance Alert').length,
      color: '#ec4899'
    }
  ];

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="bg-gray-900 text-white p-4 space-y-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Filter size={18} className="text-gray-400" />
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
        />
      </div>

      {/* Team View Filter */}
      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-300">Team View</h3>
        <select
          value={filters.teamView || 'all'}
          onChange={(e) => onFiltersChange({ ...filters, teamView: e.target.value })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-white"
        >
          <option value="all">All Views</option>
          {teamViewOptions.map(option => (
            <option key={option.id} value={option.id}>
              {option.label} ({option.count})
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-300">Status</h3>
        <div className="space-y-1">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => onFiltersChange({ ...filters, status })}
              className={`
                w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors
                ${filters.status === status 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
                }
              `}
            >
              <span className="capitalize">{status}</span>
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${filters.status === status 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-800 text-gray-300'
                }
              `}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter with Hierarchical Structure */}
      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-300">Categories</h3>
        <div className="space-y-1">
          {categories.map(category => (
            <div key={category.id}>
              <div className="flex items-center">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="flex items-center space-x-1 text-gray-300 hover:text-white p-1"
                >
                  {expandedCategories.has(category.id) ? 
                    <ChevronDown size={14} /> : 
                    <ChevronRight size={14} />
                  }
                </button>
                <button
                  onClick={() => onFiltersChange({ ...filters, category: category.name })}
                  className={`
                    flex-1 flex items-center justify-between px-2 py-1 rounded text-sm transition-colors
                    ${filters.category === category.name 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800'
                    }
                  `}
                >
                  <span className="truncate">{category.name}</span>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium ml-2
                    ${filters.category === category.name 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-800 text-gray-300'
                    }
                  `}>
                    {category.count}
                  </span>
                </button>
              </div>
              
              {/* Subcategories */}
              {expandedCategories.has(category.id) && category.subcategories && (
                <div className="ml-6 space-y-1 mt-1">
                  {category.subcategories.map(subcategory => (
                    <button
                      key={subcategory.id}
                      onClick={() => onFiltersChange({ 
                        ...filters, 
                        category: category.name,
                        subcategory: subcategory.name 
                      })}
                      className={`
                        w-full flex items-center justify-between px-2 py-1 rounded text-xs transition-colors
                        ${filters.subcategory === subcategory.name 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                        }
                      `}
                    >
                      <span className="truncate">{subcategory.name}</span>
                      <span className={`
                        px-1 py-0.5 rounded text-xs font-medium ml-1
                        ${filters.subcategory === subcategory.name 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-700 text-gray-400'
                        }
                      `}>
                        {subcategory.count}
                      </span>
                    </button>
                  ))}
                  
                  {/* Days Filter for Final PnL */}
                  {category.id === 'final-pnl' && category.daysFilter && (
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <h4 className="text-xs font-medium text-gray-400 mb-1 flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>Days to Display</span>
                      </h4>
                      <div className="space-y-1">
                        {category.daysFilter.map(days => (
                          <button
                            key={days}
                            onClick={() => onFiltersChange({ 
                              ...filters, 
                              daysFilter: days.toString() 
                            })}
                            className={`
                              w-full text-left px-2 py-1 rounded text-xs transition-colors
                              ${filters.daysFilter === days.toString() 
                                ? 'bg-yellow-600 text-white' 
                                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                              }
                            `}
                          >
                            {days} days
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Priority Filter */}
      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-300">Priority</h3>
        <select
          value={filters.priority}
          onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-white"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Clear Filters */}
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
        className="w-full px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default TaskFilters;