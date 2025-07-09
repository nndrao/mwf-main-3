import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { Task } from '../types';
import { format } from 'date-fns';

interface WellsFargoTaskTableProps {
  tasks: Task[];
  selectedTasks: Set<string>;
  onSelectTask: (taskId: string) => void;
  onSelectAll: (selected: boolean) => void;
  onRowClick: (task: Task) => void;
}

const WellsFargoTaskTable: React.FC<WellsFargoTaskTableProps> = ({
  tasks,
  selectedTasks,
  onSelectTask,
  onSelectAll,
  onRowClick
}) => {
  const formatDueDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy, h:mm a');
  };

  const getRowColor = (task: Task) => {
    if (task.status === 'overdue') return 'bg-red-50 dark:bg-red-900/20';
    if (task.status === 'completed') return 'bg-green-50 dark:bg-green-900/20';
    if (task.daysOverdue && task.daysOverdue > 0) return 'bg-yellow-50 dark:bg-yellow-900/20';
    return '';
  };

  const allSelected = tasks.length > 0 && tasks.every(task => selectedTasks.has(task.id));
  const someSelected = tasks.some(task => selectedTasks.has(task.id));

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
        <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300">
          <div className="col-span-1 flex items-center">
            <input
              type="checkbox"
              checked={allSelected}
              indeterminate={someSelected && !allSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600"
            />
          </div>
          <div className="col-span-2">Task ID</div>
          <div className="col-span-2">Assignment</div>
          <div className="col-span-1 text-center">Files</div>
          <div className="col-span-2">Due Date ⬇️</div>
          <div className="col-span-3">Control Name</div>
          <div className="col-span-1">Alert Text</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`grid grid-cols-12 gap-2 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${getRowColor(task)}`}
            onClick={() => onRowClick(task)}
          >
            <div className="col-span-1 flex items-center">
              <input
                type="checkbox"
                checked={selectedTasks.has(task.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelectTask(task.id);
                }}
                onClick={(e) => e.stopPropagation()}
                className="rounded border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="col-span-2 font-mono text-blue-600 dark:text-blue-400">
              {task.id}
            </div>
            <div className="col-span-2 text-gray-700 dark:text-gray-300">
              Not Delegated
            </div>
            <div className="col-span-1 flex justify-center">
              {task.files.length > 0 && (
                <FileText size={16} className="text-gray-500" />
              )}
            </div>
            <div className="col-span-2 text-gray-700 dark:text-gray-300">
              {formatDueDate(task.dueDate)}
            </div>
            <div className="col-span-3 text-gray-700 dark:text-gray-300 truncate" title={task.controlName}>
              {task.controlName}
            </div>
            <div className="col-span-1 text-center">
              {task.alertText && (
                <span className="text-red-600 dark:text-red-400 font-bold" title={task.alertText}>
                  ⚠️
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 text-xs text-gray-600 dark:text-gray-400 border-t border-gray-300 dark:border-gray-600 flex justify-between">
        <span>Displaying {tasks.length} records</span>
        <div className="flex space-x-4">
          <span>OVERDUE: {tasks.filter(t => t.status === 'overdue').length}</span>
          <span>TODAY: {tasks.filter(t => {
            const today = new Date();
            const taskDate = new Date(t.dueDate);
            return taskDate.toDateString() === today.toDateString();
          }).length}</span>
          <span>UPCOMING: {tasks.filter(t => {
            const today = new Date();
            const taskDate = new Date(t.dueDate);
            return taskDate > today && t.status !== 'completed';
          }).length}</span>
          <span>ALL: {tasks.length}</span>
        </div>
      </div>
    </div>
  );
};

export default WellsFargoTaskTable;