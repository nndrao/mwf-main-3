import React from 'react';
import { FileText } from 'lucide-react';
import { Task } from '../types';

interface WellsFargoFilesProps {
  task: Task;
}

const WellsFargoFiles: React.FC<WellsFargoFilesProps> = ({ task }) => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg">
      <h3 className="text-sm font-bold mb-4 text-yellow-400">File(s)</h3>
      
      {task.files.length === 0 ? (
        <div>
          <p className="text-xs text-gray-400 mb-2">No Links</p>
        </div>
      ) : (
        <div className="space-y-2">
          {task.files.map((file) => (
            <div key={file.id} className="flex items-center space-x-2">
              <FileText size={14} className="text-blue-400" />
              <a 
                href="#" 
                className="text-xs text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                onClick={(e) => e.preventDefault()}
              >
                {file.name}
              </a>
            </div>
          ))}
        </div>
      )}
      
      {/* Links Section */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <h4 className="text-sm font-bold mb-2 text-yellow-400">Link(s)</h4>
        <p className="text-xs text-gray-400">Task - {task.id}</p>
        <p className="text-xs text-gray-400">No Links</p>
      </div>
    </div>
  );
};

export default WellsFargoFiles;