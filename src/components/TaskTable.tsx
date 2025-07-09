import React from 'react';
import { Calendar, FileText, AlertTriangle, CheckCircle, Clock, Paperclip } from 'lucide-react';
import { Task } from '../types';
import { formatDate, getDateColor } from '../utils/dateUtils';

interface TaskTableProps {
  tasks: Task[];
  selectedTask: Task | null;
  onSelectTask: (task: Task) => void;
  onUpdateTaskStatus: (taskId: string, status: Task['status']) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ 
  tasks, 
  selectedTask, 
  onSelectTask, 
  onUpdateTaskStatus 
}) => {
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-green-500" />;
      case 'overdue': return <AlertTriangle size={16} className="text-red-500" />;
      default: return <Clock size={16} className="text-orange-500" />;
    }
  };

  const getRowColor = (task: Task) => {
    if (selectedTask?.id === task.id) return 'bg-blue-50 border-blue-200';
    if (task.status === 'overdue') return 'bg-red-50 hover:bg-red-100';
    if (task.status === 'completed') return 'bg-green-50 hover:bg-green-100';
    return 'bg-white hover:bg-gray-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
          <div className="col-span-1">Task ID</div>
          <div className="col-span-2">Assignment</div>
          <div className="col-span-1 text-center">Files</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-4">Control Name</div>
          <div className="col-span-2">Alert Text</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="max-h-96 overflow-y-auto">
        {tasks.map(task => (
          <div
            key={task.id}
            onClick={() => onSelectTask(task)}
            className={`grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors ${getRowColor(task)}`}
          >
            {/* Task ID */}
            <div className="col-span-1 flex items-center space-x-2">
              {getStatusIcon(task.status)}
              <span className="text-blue-600 font-mono text-sm">{task.id}</span>
            </div>

            {/* Assignment */}
            <div className="col-span-2">
              <span className="text-sm text-gray-900">{task.assignedTo}</span>
            </div>

            {/* Files */}
            <div className="col-span-1 text-center">
              {task.files.length > 0 && (
                <div className="flex items-center justify-center space-x-1">
                  <Paperclip size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{task.files.length}</span>
                </div>
              )}
            </div>

            {/* Due Date */}
            <div className="col-span-2">
              <div className="flex items-center space-x-2">
                <Calendar size={14} className="text-gray-400" />
                <span className={`text-sm ${getDateColor(task.dueDate)}`}>
                  {formatDate(task.dueDate)}
                </span>
              </div>
            </div>

            {/* Control Name */}
            <div className="col-span-4">
              <span className="text-sm text-gray-900 line-clamp-2">{task.controlName}</span>
            </div>

            {/* Alert Text */}
            <div className="col-span-2">
              {task.alertText && (
                <span className="text-sm text-orange-700 line-clamp-2">{task.alertText}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="text-center">
            <FileText size={32} className="mx-auto mb-2 text-gray-300" />
            <p>No tasks found</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTable;