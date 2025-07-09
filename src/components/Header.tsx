import React, { useState } from 'react';
import { User, MoreHorizontal, MessageSquare, Activity, UserPlus, Info } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const [showActions, setShowActions] = useState(false);

  const actions = [
    { icon: Info, label: 'Request Info', color: 'bg-blue-600' },
    { icon: MessageSquare, label: 'Add Notes', color: 'bg-green-600' },
    { icon: Activity, label: 'Activity', color: 'bg-purple-600' },
    { icon: UserPlus, label: 'Delegate', color: 'bg-orange-600' },
  ];

  return (
    <div className="bg-red-600 text-white safe-area-top">
      {/* Main header - much more compact */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold text-sm">CM</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">Control Monitor</h1>
              <p className="text-xs text-red-100 opacity-90">Task Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Theme toggle */}
            <ThemeToggle />
            
            {/* Smart action button */}
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2.5 bg-red-700 bg-opacity-50 rounded-full hover:bg-red-700 transition-colors"
            >
              <MoreHorizontal size={20} />
            </button>
            
            {/* User profile */}
            <div className="flex items-center space-x-2 bg-red-700 bg-opacity-50 rounded-full px-3 py-1.5">
              <User size={16} />
              <span className="text-sm font-medium hidden sm:block">Johnson, E</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable action menu */}
      {showActions && (
        <div className="px-4 pb-3 border-t border-red-500 border-opacity-30">
          <div className="grid grid-cols-2 gap-2 mt-3">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => setShowActions(false)}
                  className={`${action.color} text-white py-2.5 px-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center space-x-2`}
                >
                  <Icon size={16} />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;