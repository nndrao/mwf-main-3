import React, { useState } from 'react';
import { 
  Search, Bell, Plus, Filter, Calendar, Clock, AlertTriangle, 
  CheckCircle2, FileText, MoreVertical, ChevronRight, X
} from 'lucide-react';
import { Task } from '../types';
import { useTasks } from '../hooks/useTasks';
import { format } from 'date-fns';
import ThemeToggle from './ThemeToggle';
import TaskDetails from './TaskDetails';
import FilterSheet from './FilterSheet';
import MobileStatusTabs from './MobileStatusTabs';

const TabletLayout: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeStatus, setActiveStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    tasks: allTasks,
    filters,
    setFilters,
    selectedTask,
    setSelectedTask,
    updateTaskStatus,
    updateTask,
    addTask,
    deleteTask
  } = useTasks();

  // Filter tasks based on active status and search
  const filteredTasks = allTasks.filter(task => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!task.title.toLowerCase().includes(query) && 
          !task.description.toLowerCase().includes(query) &&
          !task.controlName.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Status filter
    switch (activeStatus) {
      case 'outstanding':
        return task.status === 'outstanding';
      case 'today':
        const today = new Date();
        const taskDate = new Date(task.dueDate);
        return taskDate.toDateString() === today.toDateString() && task.status !== 'completed';
      case 'upcoming':
        const todayUpcoming = new Date();
        const taskDateUpcoming = new Date(task.dueDate);
        return taskDateUpcoming > todayUpcoming && task.status !== 'completed';
      case 'completed':
        return task.status === 'completed';
      case 'all':
      default:
        return true;
    }
  });

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'outstanding': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getDateColor = (dueDate: Date) => {
    const today = new Date();
    const taskDate = new Date(dueDate);
    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600 dark:text-red-400';
    if (diffDays === 0) return 'text-orange-600 dark:text-orange-400';
    if (diffDays <= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-[#D71E2B] text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Control Monitor</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60"
                />
              </div>

              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Plus size={20} />
                <span className="hidden md:inline">New Task</span>
              </button>
              
              <button className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg relative transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <ThemeToggle />
              
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-white/30 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-semibold">JE</span>
                </div>
                <span className="text-sm font-semibold hidden md:block">Johnson, E</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar for small tablets */}
        <div className="px-6 pb-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60"
            />
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <MobileStatusTabs
          tasks={allTasks}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Task List - Left Side */}
        <div className="w-full md:w-1/2 lg:w-2/5 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4 space-y-3">
            {filteredTasks.map(task => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`
                  p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                  hover:shadow-md active:scale-[0.99]
                  ${selectedTask?.id === task.id 
                    ? 'border-[#D71E2B] bg-red-50 dark:bg-red-900/10' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-mono text-gray-500 dark:text-gray-400">#{task.id}</span>
                      {task.teamView && (
                        <span className="px-2 py-0.5 rounded text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600">
                          {task.teamView.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {task.title}
                    </h3>
                  </div>
                  <ChevronRight className="text-gray-400 ml-2 flex-shrink-0" size={20} />
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {task.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                      <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{task.priority}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${getDateColor(task.dueDate)}`}>
                    {format(task.dueDate, 'MMM dd')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <CheckCircle2 size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-lg font-medium">No tasks found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            </div>
          )}
        </div>

        {/* Task Details - Right Side */}
        <div className="hidden md:flex flex-1 bg-gray-50 dark:bg-gray-900">
          {selectedTask ? (
            <div className="w-full max-w-2xl mx-auto p-6">
              <TaskDetails
                task={selectedTask}
                onUpdateTask={updateTask}
                onClose={() => setSelectedTask(null)}
                isTabletView={true}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <FileText size={64} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-xl font-medium">Select a task to view details</p>
                <p className="text-sm mt-2">Choose from the list on the left</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Task Details Modal (for small tablets) */}
      {selectedTask && window.innerWidth < 768 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 w-full h-[85vh] rounded-t-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <TaskDetails
              task={selectedTask}
              onUpdateTask={updateTask}
              onClose={() => setSelectedTask(null)}
            />
          </div>
        </div>
      )}

      {/* Filter Button */}
      <button
        onClick={() => setShowFilters(true)}
        className="fixed bottom-6 right-6 bg-[#D71E2B] hover:bg-[#B5181F] text-white p-4 rounded-full shadow-lg transition-all duration-200 active:scale-95 md:hidden"
      >
        <Filter size={24} />
      </button>

      {/* Filter Sheet */}
      {showFilters && (
        <FilterSheet
          filters={filters}
          onFiltersChange={setFilters}
          tasks={allTasks}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default TabletLayout;