import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { Task } from '../types';
import { useTasks } from '../hooks/useTasks';
import { ThemeProvider } from '../contexts/ThemeContext';
import HeaderImproved from './HeaderImproved';
import TeamViewSidebar from './TeamViewSidebar';
import StatusTabs from './StatusTabs';
import TaskTable from './TaskTable';
import TaskDetails from './TaskDetails';
import ControlInstructions from './ControlInstructions';

const EnterpriseTaskManager: React.FC = () => {
  const [activeTeamView, setActiveTeamView] = useState('user');
  const [activeStatus, setActiveStatus] = useState('all');
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  
  const {
    tasks,
    allTasks,
    selectedTask,
    setSelectedTask,
    updateTaskStatus,
    updateTask
  } = useTasks();

  // Filter tasks based on team view and status
  const filteredTasks = allTasks.filter(task => {
    const matchesTeamView = activeTeamView === 'all' || task.teamView === activeTeamView;
    
    let matchesStatus = true;
    switch (activeStatus) {
      case 'overdue':
        matchesStatus = task.status === 'overdue';
        break;
      case 'today':
        const today = new Date();
        const taskDate = new Date(task.dueDate);
        matchesStatus = taskDate.toDateString() === today.toDateString() && task.status !== 'completed';
        break;
      case 'upcoming':
        const todayUpcoming = new Date();
        const taskDateUpcoming = new Date(task.dueDate);
        matchesStatus = taskDateUpcoming > todayUpcoming && task.status !== 'completed';
        break;
      case 'completed':
        matchesStatus = task.status === 'completed';
        break;
      case 'all':
      default:
        matchesStatus = true;
    }
    
    return matchesTeamView && matchesStatus;
  });

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      <HeaderImproved />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Team View Sidebar */}
        <TeamViewSidebar
          tasks={allTasks}
          activeView={activeTeamView}
          onViewChange={setActiveTeamView}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Status Tabs */}
          <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <StatusTabs
              tasks={filteredTasks}
              activeStatus={activeStatus}
              onStatusChange={setActiveStatus}
            />
          </div>
          
          {/* Task Table */}
          <div className="flex-1 p-4 overflow-hidden">
            <TaskTable
              tasks={filteredTasks}
              selectedTask={selectedTask}
              onSelectTask={handleTaskSelect}
              onUpdateTaskStatus={updateTaskStatus}
            />
          </div>
        </div>
        
        {/* Task Details Panel */}
        {showTaskDetails && selectedTask && (
          <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
            {/* Task Details Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Task Details</h2>
                <button
                  onClick={() => setShowTaskDetails(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Basic Task Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Task ID</label>
                  <p className="text-gray-900 dark:text-white">#{selectedTask.id}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Due Status</label>
                  <p className="text-gray-900 dark:text-white">{selectedTask.status.toUpperCase()}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Due Date (Local)</label>
                  <p className="text-gray-900 dark:text-white">{selectedTask.dueDate.toLocaleString()}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Date Created (Local)</label>
                  <p className="text-gray-900 dark:text-white">{selectedTask.createdDate.toLocaleString()}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Workflow Step</label>
                  <p className="text-gray-900 dark:text-white">{selectedTask.workflowStep}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Days Overdue</label>
                  <p className="text-gray-900 dark:text-white">{selectedTask.daysOverdue || 0}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Control Name</label>
                  <p className="text-gray-900 dark:text-white">{selectedTask.controlName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Control Type</label>
                  <p className="text-gray-900 dark:text-white">{selectedTask.controlType}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Workflow Name</label>
                  <p className="text-gray-900 dark:text-white">{selectedTask.workflowName}</p>
                </div>
                
                {selectedTask.responsibleSupervisor && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Responsible Supervisor</label>
                    <p className="text-gray-900 dark:text-white">{selectedTask.responsibleSupervisor}</p>
                  </div>
                )}
                
                {selectedTask.responsibleEmployee && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Responsible Employee</label>
                    <p className="text-gray-900 dark:text-white">{selectedTask.responsibleEmployee}</p>
                  </div>
                )}
              </div>
              
              {/* Control Instructions */}
              <ControlInstructions task={selectedTask} />
              
              {/* Notes Section */}
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notes</h3>
                <div className="space-y-4">
                  {selectedTask.notes.map(note => (
                    <div key={note.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 text-xs font-semibold">
                            {note.avatar || note.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{note.author}</span>
                          {note.approved && (
                            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                              approved
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{note.content}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{note.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Files Section */}
              {selectedTask.files.length > 0 && (
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File(s)</h3>
                  <div className="space-y-2">
                    {selectedTask.files.map(file => (
                      <div key={file.id} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-600 rounded">
                        <FileText size={16} className="text-gray-400" />
                        <span className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                          {file.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnterpriseTaskManager;