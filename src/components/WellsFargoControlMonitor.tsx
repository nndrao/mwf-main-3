import React, { useState } from 'react';
import { Task } from '../types';
import { useTasks } from '../hooks/useTasks';
import WellsFargoHeader from './WellsFargoHeader';
import WellsFargoSidebar from './WellsFargoSidebar';
import WellsFargoTaskTable from './WellsFargoTaskTable';
import WellsFargoTaskDetails from './WellsFargoTaskDetails';
import WellsFargoControlInstructions from './WellsFargoControlInstructions';
import WellsFargoNotes from './WellsFargoNotes';
import WellsFargoFiles from './WellsFargoFiles';

const WellsFargoControlMonitor: React.FC = () => {
  const [activeView, setActiveView] = useState('all');
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('my-open-tasks');
  const [daysToDisplay, setDaysToDisplay] = useState('30');
  const [teamView, setTeamView] = useState('user-only');
  
  const {
    tasks,
    allTasks,
    selectedTask,
    setSelectedTask,
    updateTaskStatus,
    updateTask
  } = useTasks();

  // Filter tasks based on active view
  const filteredTasks = allTasks.filter(task => {
    switch (activeView) {
      case 'outstanding':
        return task.status === 'outstanding' || task.status === 'overdue';
      case 'completed':
        return task.status === 'completed';
      case 'employee-licensing':
        return task.category === 'Employee Licensing & Registrations';
      case 't3-clean-pnl':
        return task.category === 'T+3 Clean PnL Sign-Off';
      case 'final-pnl':
        return task.category === 'Final PnL Sign-Off';
      case 'trade-surveillance':
        return task.category === 'Trade Surveillance Alert';
      case 'all':
      default:
        return true;
    }
  });

  const handleSelectTask = (taskId: string) => {
    const newSelected = new Set(selectedTaskIds);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTaskIds(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedTaskIds(new Set(filteredTasks.map(t => t.id)));
    } else {
      setSelectedTaskIds(new Set());
    }
  };

  const handleRowClick = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <WellsFargoHeader userName="Vona, Joseph" />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <WellsFargoSidebar 
          activePath={activeView}
          onNavigate={setActiveView}
        />

        {/* Main Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Action Bar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Tabs */}
              <div className="flex space-x-1">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === 'my-open-tasks' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setActiveTab('my-open-tasks')}
                >
                  My Open Tasks
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === 'my-tasks-user-only' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setActiveTab('my-tasks-user-only')}
                >
                  My Tasks (User Only)
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm font-medium">
                  Initiate Sign Off
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium">
                  Request for Info
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium">
                  Add Notes/Files
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium">
                  View Activity
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium">
                  Delegation & Assignment
                </button>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Days To Display (GM+2):</label>
                <select 
                  value={daysToDisplay}
                  onChange={(e) => setDaysToDisplay(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Team View:</label>
                <select 
                  value={teamView}
                  onChange={(e) => setTeamView(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="user-only">My Tasks (User Only)</option>
                  <option value="watcher">My Watcher View</option>
                  <option value="rfi">My RFI Tasks</option>
                  <option value="teams">My Teams Tasks</option>
                  <option value="extended">My Extended Teams Tasks</option>
                </select>
              </div>
            </div>
          </div>

          {/* Task Table Area */}
          <div className="flex-1 p-4 overflow-auto">
            <WellsFargoTaskTable
              tasks={filteredTasks}
              selectedTasks={selectedTaskIds}
              onSelectTask={handleSelectTask}
              onSelectAll={handleSelectAll}
              onRowClick={handleRowClick}
            />
          </div>

          {/* Bottom Panel - Task Details */}
          {selectedTask && (
            <div className="border-t border-gray-300 dark:border-gray-700 bg-gray-900 overflow-auto" style={{ height: '40%' }}>
              <div className="grid grid-cols-2 gap-4 p-4 h-full">
                {/* Left Column */}
                <div className="space-y-4 overflow-y-auto pr-2">
                  <WellsFargoTaskDetails task={selectedTask} />
                  <WellsFargoControlInstructions task={selectedTask} />
                </div>

                {/* Right Column */}
                <div className="space-y-4 overflow-y-auto pl-2">
                  <WellsFargoNotes task={selectedTask} />
                  <WellsFargoFiles task={selectedTask} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WellsFargoControlMonitor;