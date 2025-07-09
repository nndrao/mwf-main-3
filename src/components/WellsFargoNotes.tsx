import React from 'react';
import { Task } from '../types';
import { format } from 'date-fns';

interface WellsFargoNotesProps {
  task: Task;
}

const WellsFargoNotes: React.FC<WellsFargoNotesProps> = ({ task }) => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg">
      <h3 className="text-sm font-bold mb-4 text-yellow-400">Notes</h3>
      
      {task.notes.length === 0 ? (
        <p className="text-xs text-gray-400">No notes available.</p>
      ) : (
        <div className="space-y-3">
          {task.notes.map((note) => (
            <div key={note.id} className="flex space-x-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {note.avatar || note.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
              
              {/* Note Content */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-bold text-white">{note.author}</span>
                  {note.approved && (
                    <span className="text-xs bg-green-700 text-green-200 px-2 py-0.5 rounded">
                      approved
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-300 mb-1">{note.content}</p>
                <p className="text-xs text-gray-500">{format(note.timestamp, 'MMM dd, yyyy, h:mm a')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WellsFargoNotes;