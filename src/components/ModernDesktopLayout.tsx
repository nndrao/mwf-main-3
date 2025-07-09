import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Users, 
  TrendingUp, 
  Shield, 
  BarChart3,
  Search,
  Bell,
  Plus,
  Filter,
  Calendar,
  ChevronRight,
  MoreVertical,
  X,
  Edit3,
  Trash2,
  Download,
  Upload,
  Send,
  Archive
} from 'lucide-react';
import { Task } from '../types';
import { useTasks } from '../hooks/useTasks';
import { format } from 'date-fns';
import { ThemeProvider } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import ControlInstructions from './ControlInstructions';

const ModernDesktopLayout: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  
  const {
    tasks: allTasks,
    selectedTask,
    setSelectedTask,
    updateTaskStatus,
    updateTask,
    addTask,
    deleteTask
  } = useTasks();

  // Filter tasks based on selected filter
  const tasks = allTasks.filter(task => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!task.title.toLowerCase().includes(query) && 
          !task.description.toLowerCase().includes(query) &&
          !task.controlName.toLowerCase().includes(query)) {
        return false;
      }
    }

    switch (selectedFilter) {
      case 'overdue':
        return task.status === 'overdue';
      case 'today':
        const today = new Date();
        const taskDate = new Date(task.dueDate);
        return taskDate.toDateString() === today.toDateString();
      case 'upcoming':
        const now = new Date();
        const taskDateUpcoming = new Date(task.dueDate);
        return taskDateUpcoming > now && task.status !== 'completed';
      case 'completed':
        return task.status === 'completed';
      default:
        return true;
    }
  });

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, count: null },
    { id: 'all', label: 'All Tasks', icon: FileText, count: allTasks.length },
    { id: 'overdue', label: 'Overdue', icon: AlertTriangle, count: allTasks.filter(t => t.status === 'overdue').length, color: 'text-red-500' },
    { id: 'today', label: 'Due Today', icon: Clock, count: allTasks.filter(t => {
      const today = new Date();
      const taskDate = new Date(t.dueDate);
      return taskDate.toDateString() === today.toDateString();
    }).length, color: 'text-orange-500' },
    { id: 'upcoming', label: 'Upcoming', icon: Calendar, count: allTasks.filter(t => {
      const now = new Date();
      const taskDate = new Date(t.dueDate);
      return taskDate > now && t.status !== 'completed';
    }).length, color: 'text-blue-500' },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, count: allTasks.filter(t => t.status === 'completed').length, color: 'text-green-500' },
  ];

  const categories = [
    { id: 'final-pnl', label: 'Final PnL Sign-Off', icon: BarChart3 },
    { id: 'licensing', label: 'Employee Licensing', icon: Users },
    { id: 'trading', label: 'Trading Surveillance', icon: TrendingUp },
    { id: 'compliance', label: 'Compliance Review', icon: Shield },
  ];

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
    setIsEditing(false);
    setEditedTask({});
  };

  const handleStartEdit = () => {
    if (selectedTask) {
      setIsEditing(true);
      setEditedTask({
        title: selectedTask.title,
        description: selectedTask.description,
        priority: selectedTask.priority,
        dueDate: selectedTask.dueDate,
        assignedTo: selectedTask.assignedTo
      });
    }
  };

  const handleSaveEdit = () => {
    if (selectedTask && editedTask) {
      updateTask(selectedTask.id, editedTask);
      setIsEditing(false);
      setEditedTask({});
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTask({});
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
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

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Top Header Bar */}
        <div className="bg-[#D71E2B] text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white px-3 py-1 rounded">
              <span className="text-[#D71E2B] font-bold">CONTROL MONITOR</span>
            </div>
            <span className="text-sm">Task Management System</span>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm">Support</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Joseph Vona</span>
              <span className="text-xs">▼</span>
            </div>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-1 rounded text-sm transition-colors">
              Exit
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Logo Area */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#D71E2B] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">CM</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Control Monitor</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Task Management System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = selectedFilter === item.id || (item.id === 'dashboard' && activeView === 'dashboard');
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedFilter(item.id);
                      setActiveView(item.id === 'dashboard' ? 'dashboard' : 'tasks');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-red-50 dark:bg-red-900/20 text-[#D71E2B] dark:text-red-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={20} className={item.color || ''} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.count !== null && (
                      <span className={`text-sm font-semibold ${
                        isActive ? 'text-[#D71E2B] dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Categories */}
            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                    >
                      <Icon size={20} />
                      <span className="font-medium">{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-gray-600 dark:text-gray-300 font-semibold">JV</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Joseph Vona</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">joseph.vona@company.com</p>
              </div>
            </div>
          </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {/* Search */}
                <div className="relative max-w-md flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 rounded-md transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 rounded-md transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button className="bg-[#D71E2B] hover:bg-[#B5181F] text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                  <Plus size={20} />
                  <span>New Task</span>
                </button>
                
                <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                  <Filter size={20} />
                </button>

                <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 relative">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            {activeView === 'dashboard' ? (
              /* Dashboard View */
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{allTasks.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                        <FileText className="text-[#D71E2B] dark:text-red-400" size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                          {allTasks.filter(t => t.status === 'overdue').length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Due Today</p>
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                          {allTasks.filter(t => {
                            const today = new Date();
                            const taskDate = new Date(t.dueDate);
                            return taskDate.toDateString() === today.toDateString();
                          }).length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                        <Clock className="text-orange-600 dark:text-orange-400" size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                          {allTasks.filter(t => t.status === 'completed').length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="text-green-600 dark:text-green-400" size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Tasks */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tasks</h3>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {tasks.slice(0, 5).map((task) => (
                      <div
                        key={task.id}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                        onClick={() => handleTaskClick(task)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.controlName}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                            <ChevronRight className="text-gray-400" size={20} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Tasks View */
              <div>
                {viewMode === 'grid' ? (
                  /* Grid View */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-all duration-200 cursor-pointer"
                        onClick={() => handleTaskClick(task)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">#{task.id}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle more options
                            }}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>

                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {task.title}
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {task.description}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>{format(task.dueDate, 'MMM dd, yyyy')}</span>
                          </div>
                          {task.files.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <FileText size={14} />
                              <span>{task.files.length}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          {task.assignedTo && (
                            <div className="flex items-center space-x-1">
                              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                  {task.assignedTo.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* List View */
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Task
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Priority
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Due Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Assigned To
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {tasks.map((task) => (
                          <tr
                            key={task.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                            onClick={() => handleTaskClick(task)}
                          >
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {task.title}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {task.controlName}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                                <span className="text-sm text-gray-900 dark:text-white capitalize">
                                  {task.priority}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                              {format(task.dueDate, 'MMM dd, yyyy')}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                              {task.assignedTo || 'Unassigned'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle actions
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              >
                                <MoreVertical size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Task Details Panel */}
        {showTaskDetails && selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Task Details</h2>
                  <button
                    onClick={() => setShowTaskDetails(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <X size={20} className="text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    {/* Task Info */}
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          {!isEditing ? (
                            <>
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {selectedTask.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400">
                                {selectedTask.description}
                              </p>
                            </>
                          ) : (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={editedTask.title || ''}
                                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                                className="w-full px-3 py-2 text-lg font-semibold bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                placeholder="Task title"
                              />
                              <textarea
                                value={editedTask.description || ''}
                                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white resize-none"
                                rows={3}
                                placeholder="Task description"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {!isEditing ? (
                            <>
                              <button 
                                onClick={handleStartEdit}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                              >
                                <Edit3 size={18} className="text-gray-500 dark:text-gray-400" />
                              </button>
                              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                                <Trash2 size={18} className="text-gray-500 dark:text-gray-400" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={handleSaveEdit}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                          <span className={`inline-flex px-2.5 py-1 text-sm font-medium rounded-full mt-1 ${getStatusColor(selectedTask.status)}`}>
                            {selectedTask.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Priority</p>
                          {!isEditing ? (
                            <div className="flex items-center space-x-2 mt-1">
                              <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedTask.priority)}`}></div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                {selectedTask.priority}
                              </span>
                            </div>
                          ) : (
                            <select
                              value={editedTask.priority || selectedTask.priority}
                              onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Task['priority'] })}
                              className="mt-1 w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="critical">Critical</option>
                            </select>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                          {!isEditing ? (
                            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                              {format(selectedTask.dueDate, 'MMMM dd, yyyy')}
                            </p>
                          ) : (
                            <input
                              type="datetime-local"
                              value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().slice(0, 16) : new Date(selectedTask.dueDate).toISOString().slice(0, 16)}
                              onChange={(e) => setEditedTask({ ...editedTask, dueDate: new Date(e.target.value) })}
                              className="mt-1 w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Assigned To</p>
                          {!isEditing ? (
                            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                              {selectedTask.assignedTo || 'Unassigned'}
                            </p>
                          ) : (
                            <input
                              type="text"
                              value={editedTask.assignedTo || selectedTask.assignedTo || ''}
                              onChange={(e) => setEditedTask({ ...editedTask, assignedTo: e.target.value })}
                              className="mt-1 w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                              placeholder="Enter assignee name"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Control Information */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Control Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Control Name</span>
                          <span className="text-sm text-gray-900 dark:text-white">{selectedTask.controlName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Control Type</span>
                          <span className="text-sm text-gray-900 dark:text-white">{selectedTask.controlType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Workflow</span>
                          <span className="text-sm text-gray-900 dark:text-white">{selectedTask.workflowName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Control Instructions */}
                    <ControlInstructions task={selectedTask} />

                    {/* Notes */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Notes</h4>
                      {selectedTask.notes.length > 0 ? (
                        <div className="space-y-3">
                          {selectedTask.notes.map((note) => (
                            <div key={note.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                              <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                    {note.author.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {note.author}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {format(note.timestamp, 'MMM dd, h:mm a')}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {note.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No notes yet</p>
                      )}
                    </div>

                    {/* Files */}
                    {selectedTask.files.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Files</h4>
                        <div className="space-y-2">
                          {selectedTask.files.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <FileText size={20} className="text-gray-400" />
                                <span className="text-sm text-gray-900 dark:text-white">{file.name}</span>
                              </div>
                              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                                Download
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                      <Upload size={18} />
                      <span>Add Files</span>
                    </button>
                    <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                      <Archive size={18} />
                      <span>Archive</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        updateTaskStatus(selectedTask.id, 'completed');
                        setShowTaskDetails(false);
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      <CheckCircle2 size={18} />
                      <span>Mark Complete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ModernDesktopLayout;