import React from 'react';
import { Task } from '../types';
import { format } from 'date-fns';

interface WellsFargoTaskDetailsProps {
  task: Task;
}

const WellsFargoTaskDetails: React.FC<WellsFargoTaskDetailsProps> = ({ task }) => {
  const formatDateTime = (date: Date) => {
    return format(date, 'MMM dd, yyyy, h:mm a');
  };

  const details = [
    { label: 'Task ID:', value: task.id },
    { label: 'Due Status:', value: task.status.toUpperCase() },
    { label: 'Due Date (Local):', value: formatDateTime(task.dueDate) },
    { label: 'Date Created (Local):', value: formatDateTime(task.createdDate) },
    { label: 'Workflow Step:', value: task.workflowStep },
    { label: 'Days Overdue:', value: task.daysOverdue || '0' },
    { label: 'Control Name:', value: task.controlName },
    { label: 'Control Type:', value: task.controlType },
    { label: 'Workflow Name:', value: task.workflowName },
    { label: 'Responsible Supervisor:', value: task.responsibleSupervisor || 'uSR5511' },
    { label: 'Employee:', value: task.responsibleEmployee || '-' }
  ];

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg">
      <h3 className="text-sm font-bold mb-4 text-yellow-400">Task Details</h3>
      
      <div className="grid grid-cols-2 gap-x-8 gap-y-3">
        {details.map((detail, index) => (
          <div key={index} className="flex">
            <span className="text-xs text-gray-400 min-w-[140px]">{detail.label}</span>
            <span className="text-xs text-white font-medium">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WellsFargoTaskDetails;