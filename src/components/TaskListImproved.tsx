import React, { useState } from 'react';
import { Calendar, FileText, CheckCircle, AlertTriangle, Clock, Filter, Plus, ChevronRight, Briefcase, PenTool, Info, MessageSquare, Activity, UserPlus, MoreVertical, Check, Square, CheckSquare } from 'lucide-react';
import { Task } from '../types';
import { formatDate, getDateColor } from '../utils/dateUtils';
import MobileStatusTabs from './MobileStatusTabs';
import SignoffDialog from './SignoffDialog';

interface TaskListImprovedProps {
  tasks: Task[];
  selectedTask: Task | null;
  onSelectTask: (task: Task) => void;
  onUpdateTaskStatus: (taskId: string, status: Task['status']) => void;
  onShowFilters: () => void;
}

const TaskListImproved: React.FC<TaskListImprovedProps> = ({ 
  tasks, 
  selectedTask, 
  onSelectTask, 
  onUpdateTaskStatus,
  onShowFilters
}) => {
  const [activeStatus, setActiveStatus] = useState('all');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showSignoffDialog, setShowSignoffDialog] = useState(false);
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityTextColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle size={20} className="text-green-500" />;
      case 'outstanding': return <AlertTriangle size={20} className="text-red-500" />;
      default: return <Clock size={20} className="text-orange-500" />;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      case 'outstanding': return 'text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      default: return 'text-orange-700 bg-orange-50 dark:text-orange-300 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800';
    }
  };

  const getTeamBadgeColor = (teamView?: string) => {
    switch (teamView) {
      case 'rfi': return 'bg-gradient-to-r from-orange-500 to-orange-600';
      case 'watcher': return 'bg-gradient-to-r from-purple-500 to-purple-600';
      case 'user': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'teams': return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'pending': return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 'extended': return 'bg-gradient-to-r from-indigo-500 to-indigo-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  // Filter tasks based on active status
  const filteredTasks = tasks.filter(task => {
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

  const outstandingCount = tasks.filter(t => t.status === 'outstanding').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  // Handle long press to enter selection mode
  const handleLongPress = (taskId: string) => {
    console.log('Long press triggered for task:', taskId);
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedTaskIds(new Set([taskId]));
      // Trigger haptic feedback if available
      if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }
  };

  // Toggle task selection
  const toggleTaskSelection = (taskId: string) => {
    const newSelection = new Set(selectedTaskIds);
    if (newSelection.has(taskId)) {
      newSelection.delete(taskId);
    } else {
      newSelection.add(taskId);
    }
    setSelectedTaskIds(newSelection);
  };

  // Exit selection mode
  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedTaskIds(new Set());
  };

  // Select all tasks
  const selectAllTasks = () => {
    const allTaskIds = new Set(filteredTasks.map(task => task.id));
    setSelectedTaskIds(allTaskIds);
  };

  // Handle task click
  const handleTaskClick = (task: Task, event?: React.MouseEvent) => {
    // If clicking on the chevron or the right part of the card in selection mode, view details
    if (isSelectionMode && event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const cardWidth = rect.width;
      
      // If click is in the right 20% of the card or on the chevron, view details
      if (clickX > cardWidth * 0.8) {
        onSelectTask(task);
        return;
      }
    }
    
    if (isSelectionMode) {
      toggleTaskSelection(task.id);
    } else {
      onSelectTask(task);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Enhanced Mobile Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-5 shadow-sm">
        <div className="flex items-center justify-between">
          {isSelectionMode ? (
            <>
              <button
                onClick={exitSelectionMode}
                className="text-blue-600 dark:text-blue-400 font-medium"
              >
                Cancel
              </button>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedTaskIds.size} Selected
                </p>
              </div>
              <button
                onClick={selectAllTasks}
                className="text-blue-600 dark:text-blue-400 font-medium"
              >
                Select All
              </button>
            </>
          ) : (
            <>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    {outstandingCount} outstanding
                  </span>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {completedCount} completed
                  </span>
                </div>
              </div>
              <button 
                className="bg-[#D71E2B] text-white p-3 rounded-xl hover:bg-[#B5181F] active:scale-95 transition-all duration-150 shadow-md"
              >
                <Plus size={24} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Status Tabs */}
      <MobileStatusTabs
        tasks={tasks}
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
      />

      {/* Task List with improved mobile UI */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="px-4 py-4 space-y-4">
          {filteredTasks.map(task => {
            const isSelected = selectedTaskIds.has(task.id);
            let longPressTimer: NodeJS.Timeout;
            
            return (
              <div
                key={task.id}
                onClick={(e) => handleTaskClick(task, e)}
                onTouchStart={() => {
                  console.log('Touch start on task:', task.id);
                  longPressTimer = setTimeout(() => handleLongPress(task.id), 500);
                }}
                onTouchEnd={() => {
                  console.log('Touch end on task:', task.id);
                  clearTimeout(longPressTimer);
                }}
                onTouchMove={() => {
                  console.log('Touch move on task:', task.id);
                  clearTimeout(longPressTimer);
                }}
                onMouseDown={() => {
                  console.log('Mouse down on task:', task.id);
                  longPressTimer = setTimeout(() => handleLongPress(task.id), 500);
                }}
                onMouseUp={() => {
                  console.log('Mouse up on task:', task.id);
                  clearTimeout(longPressTimer);
                }}
                onMouseLeave={() => {
                  console.log('Mouse leave on task:', task.id);
                  clearTimeout(longPressTimer);
                }}
                className={`relative
                bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg 
                border-2 transition-all duration-200 cursor-pointer
                active:scale-[0.99] overflow-hidden
                ${isSelected && isSelectionMode
                  ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                  : selectedTask?.id === task.id 
                    ? 'border-blue-500 dark:border-blue-400' 
                    : 'border-transparent'
                }
              `}
              >
                {/* Selection Checkbox */}
                {isSelectionMode && (
                  <div className="absolute left-4 top-4 z-10">
                    {isSelected ? (
                      <CheckSquare size={24} className="text-blue-500" />
                    ) : (
                      <Square size={24} className="text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                )}
                
                {/* Task Card Content */}
                <div className={`p-4 ${isSelectionMode ? 'pl-14' : ''}`}>
                {/* Top Section with Status Icon and Actions */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(task.status)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">#{task.id}</span>
                        {task.teamView && (
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white ${getTeamBadgeColor(task.teamView)} shadow-sm`}>
                            {task.teamView.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateTaskStatus(
                        task.id, 
                        task.status === 'completed' ? 'outstanding' : 'completed'
                      );
                    }}
                    className={`
                      p-3 rounded-xl transition-all duration-200 active:scale-90
                      ${task.status === 'completed' 
                        ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    <CheckCircle size={24} />
                  </button>
                </div>
                
                {/* Task Title and Description */}
                <div className="mb-4">
                  <h3 className={`text-lg font-bold leading-tight mb-2 ${
                    task.additionalInfo 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {task.description}
                  </p>
                </div>

                {/* Task Metadata */}
                <div className="space-y-3">
                  {/* Category and Control */}
                  <div className="flex items-center space-x-2 text-sm">
                    <Briefcase size={16} className="text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{task.category}</span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span className="text-gray-600 dark:text-gray-400">{task.controlName}</span>
                  </div>

                  {/* Due Date and Priority */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Due Date */}
                      <div className={`flex items-center space-x-1.5 text-sm font-medium ${getDateColor(task.dueDate)}`}>
                        <Calendar size={16} />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                      
                      {/* Priority Badge */}
                      <div className={`flex items-center space-x-1.5 ${getPriorityTextColor(task.priority)}`}>
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                        <span className="text-sm font-medium capitalize">{task.priority}</span>
                      </div>
                    </div>

                    {/* Files indicator */}
                    {task.files.length > 0 && (
                      <div className="flex items-center space-x-1.5 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                        <FileText size={14} />
                        <span className="font-medium">{task.files.length}</span>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-3.5 py-2 rounded-xl text-sm font-bold border ${getStatusColor(task.status)}`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      {!!task.daysOverdue && task.daysOverdue > 0 ? (
                        <span className="ml-2">({task.daysOverdue}d)</span>
                      ) : null}
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTask(task);
                      }}
                      className="p-2 -m-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ChevronRight size={20} className="text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Alert Text */}
                {task.alertText && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-700 rounded-xl">
                    <div className="flex items-start space-x-2">
                      <span className="text-orange-600 dark:text-orange-400">⚠️</span>
                      <p className="text-sm font-medium text-orange-800 dark:text-orange-300 line-clamp-2 flex-1">
                        {task.alertText}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <CheckCircle size={56} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-xl font-medium">No tasks found</p>
              <p className="text-sm mt-2">Try adjusting your filters</p>
            </div>
          </div>
        )}

        {/* Add padding at bottom for safe area */}
        <div className="h-16"></div>
      </div>

      {/* Enhanced Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 safe-area-bottom shadow-lg">
        <button
          onClick={onShowFilters}
          className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 active:scale-[0.98]"
        >
          <Filter size={18} />
          <span>Filters & Search</span>
        </button>
      </div>

      {/* Floating Action Button for Selected Items */}
      {isSelectionMode && selectedTaskIds.size > 0 && (
        <div className="absolute bottom-24 right-4 z-20">
          <button
            onClick={() => setShowActionSheet(true)}
            className="bg-[#D71E2B] text-white p-4 rounded-full shadow-lg hover:bg-[#B5181F] active:scale-95 transition-all duration-150"
          >
            <MoreVertical size={24} />
          </button>
        </div>
      )}

      {/* Action Sheet for Selected Items */}
      {showActionSheet && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
            onClick={() => setShowActionSheet(false)}
          />
          
          {/* Action Sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl safe-area-bottom">
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
              </div>
              
              {/* Action Title */}
              <div className="px-6 pb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                  {selectedTaskIds.size} Task{selectedTaskIds.size > 1 ? 's' : ''} Selected
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                  Choose an action to perform
                </p>
              </div>
              
              {/* Actions */}
              <div className="px-4 pb-2">
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setShowActionSheet(false);
                      setShowSignoffDialog(true);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-colors active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <PenTool size={20} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <span className="text-base font-medium text-gray-900 dark:text-white flex-1 text-left">Initiate Sign Off</span>
                  </button>

                  <button
                    onClick={() => {
                      console.log('Request Info for:', Array.from(selectedTaskIds));
                      setShowActionSheet(false);
                      exitSelectionMode();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-colors active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Info size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-base font-medium text-gray-900 dark:text-white flex-1 text-left">Request Info</span>
                  </button>

                  <button
                    onClick={() => {
                      console.log('Add Notes for:', Array.from(selectedTaskIds));
                      setShowActionSheet(false);
                      exitSelectionMode();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-colors active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <MessageSquare size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-base font-medium text-gray-900 dark:text-white flex-1 text-left">Add Notes</span>
                  </button>

                  <button
                    onClick={() => {
                      console.log('View Activity for:', Array.from(selectedTaskIds));
                      setShowActionSheet(false);
                      exitSelectionMode();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-colors active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Activity size={20} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-base font-medium text-gray-900 dark:text-white flex-1 text-left">View Activity</span>
                  </button>

                  <button
                    onClick={() => {
                      console.log('Delegate:', Array.from(selectedTaskIds));
                      setShowActionSheet(false);
                      exitSelectionMode();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-colors active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <UserPlus size={20} className="text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-base font-medium text-gray-900 dark:text-white flex-1 text-left">Delegate</span>
                  </button>
                </div>
                
                {/* Cancel Button */}
                <button
                  onClick={() => setShowActionSheet(false)}
                  className="w-full mt-3 py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-2xl active:scale-[0.98] transition-transform"
                >
                  Cancel
                </button>
              </div>
              
              {/* Bottom Safe Area Padding */}
              <div className="h-2" />
            </div>
          </div>
        </>
      )}
      
      {/* Signoff Dialog */}
      <SignoffDialog
        isOpen={showSignoffDialog}
        onClose={() => {
          setShowSignoffDialog(false);
          exitSelectionMode();
        }}
        selectedTasks={tasks.filter(task => selectedTaskIds.has(task.id))}
        onSubmit={(data) => {
          console.log('Signoff submitted:', data);
          // Here you would typically make an API call to submit the signoff
          setShowSignoffDialog(false);
          exitSelectionMode();
        }}
      />
    </div>
  );
};

export default TaskListImproved;