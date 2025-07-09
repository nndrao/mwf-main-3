import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  FileText, 
  MessageCircle, 
  User, 
  Edit3,
  Save,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Task } from '../types';
import { formatDate, getDateColor } from '../utils/dateUtils';
import MobileDatePicker from './MobileDatePicker';
import ControlInstructions from './ControlInstructions';
import AdditionalInfoTable from './AdditionalInfoTable';

interface TaskDetailsProps {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onClose: () => void;
  isTabletView?: boolean;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onUpdateTask, onClose, isTabletView = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      assignedTo: task.assignedTo
    });
  };

  const handleSave = () => {
    onUpdateTask(task.id, editedTask);
    setIsEditing(false);
    setEditedTask({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask({});
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle size={24} className="text-green-500" />;
      case 'outstanding': return <AlertTriangle size={24} className="text-red-500" />;
      default: return <Clock size={24} className="text-orange-500" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900';
      case 'high': return 'text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900';
      case 'medium': return 'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900';
      case 'low': return 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900';
      default: return 'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700';
    }
  };

  const formatDateForInput = (date: Date) => {
    // Format date for datetime-local input (YYYY-MM-DDTHH:MM)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Header - Smart button logic */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          {getStatusIcon(task.status)}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Task Details</h2>
            <p className="text-base text-gray-500 dark:text-gray-400">#{task.id}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              {/* Edit mode: Save and Cancel buttons only */}
              <button
                onClick={handleSave}
                className="p-3 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                <Save size={20} />
              </button>
              <button
                onClick={handleCancel}
                className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </>
          ) : (
            <>
              {/* View mode: Edit and Close buttons */}
              <button
                onClick={handleEdit}
                className="p-3 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                <Edit3 size={20} />
              </button>
              <button
                onClick={onClose}
                className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content - Larger text throughout */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basic Info */}
        <div className="space-y-5">
          <div>
            <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">Title</label>
            {isEditing ? (
              <input
                type="text"
                value={editedTask.title || ''}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{task.title}</p>
            )}
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
            {isEditing ? (
              <textarea
                value={editedTask.description || ''}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            ) : (
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{task.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">Priority</label>
              {isEditing ? (
                <select
                  value={editedTask.priority || ''}
                  onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Task['priority'] })}
                  className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              ) : (
                <span className={`inline-flex px-4 py-2 rounded-full text-base font-semibold ${getPriorityColor(task.priority)}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              )}
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
              {isEditing ? (
                isMobile ? (
                  <MobileDatePicker
                    value={editedTask.dueDate || task.dueDate}
                    onChange={(date) => setEditedTask({ ...editedTask, dueDate: date })}
                    className="text-base"
                  />
                ) : (
                  <input
                    type="datetime-local"
                    value={editedTask.dueDate ? formatDateForInput(editedTask.dueDate) : formatDateForInput(task.dueDate)}
                    onChange={(e) => setEditedTask({ ...editedTask, dueDate: new Date(e.target.value) })}
                    className="native-date-input w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                )
              ) : (
                <div className="flex items-center space-x-2">
                  <Calendar size={18} className="text-gray-400" />
                  <span className={`text-base ${getDateColor(task.dueDate)}`}>
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">Assigned To</label>
            {isEditing ? (
              <input
                type="text"
                value={editedTask.assignedTo || ''}
                onChange={(e) => setEditedTask({ ...editedTask, assignedTo: e.target.value })}
                className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <User size={18} className="text-gray-400" />
                <span className="text-base text-gray-900 dark:text-white">{task.assignedTo}</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">Control Name</label>
            <p className="text-base text-gray-700 dark:text-gray-300">{task.controlName}</p>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">Workflow Step</label>
            <p className="text-base text-gray-700 dark:text-gray-300">{task.workflowStep}</p>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">Created Date</label>
            <p className="text-base text-gray-700 dark:text-gray-300">{formatDate(task.createdDate)}</p>
          </div>

          {task.alertText && (
            <div>
              <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">Alert Text</label>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                <p className="text-base text-orange-800 dark:text-orange-300">{task.alertText}</p>
              </div>
            </div>
          )}
        </div>

        {/* Control Instructions - Feature parity with desktop */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <ControlInstructions task={task} />
        </div>

        {/* Additional Information */}
        {task.additionalInfo && (
          <AdditionalInfoTable 
            additionalInfo={task.additionalInfo} 
            isTabletView={isTabletView}
          />
        )}

        {/* Files */}
        {task.files.length > 0 && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
              <FileText size={18} />
              <span>Files ({task.files.length})</span>
            </h3>
            <div className="space-y-3">
              {task.files.map(file => (
                <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <FileText size={18} className="text-gray-400" />
                    <div>
                      <p className="text-base font-semibold text-gray-900 dark:text-white">{file.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center space-x-2">
            <MessageCircle size={18} />
            <span>Notes ({task.notes.length})</span>
          </h3>
          <div className="space-y-4">
            {task.notes.map(note => (
              <div key={note.id} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                      {note.avatar || note.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-base font-semibold text-gray-900 dark:text-white">{note.author}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(note.timestamp)}</span>
                  </div>
                  <p className="text-base text-gray-700 dark:text-gray-300">{note.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;