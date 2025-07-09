import React, { useState } from 'react';
import { User, MoreHorizontal, MessageSquare, Activity, UserPlus, Info, Menu, Bell } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const HeaderImproved: React.FC = () => {
  const [showActions, setShowActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const actions = [
    { icon: Info, label: 'Request Info', color: 'from-blue-500 to-blue-600' },
    { icon: MessageSquare, label: 'Add Notes', color: 'from-green-500 to-green-600' },
    { icon: Activity, label: 'Activity', color: 'from-purple-500 to-purple-600' },
    { icon: UserPlus, label: 'Delegate', color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white safe-area-top shadow-lg">
      {/* Main header */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">CM</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Control Monitor</h1>
              <p className="text-xs text-white/80">Task Management System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200 active:scale-95"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Theme toggle */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1">
              <ThemeToggle />
            </div>
            
            {/* Smart action button */}
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200 active:scale-95"
            >
              <MoreHorizontal size={20} />
            </button>
            
            {/* User profile */}
            <button className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 hover:bg-white/20 transition-all duration-200">
              <div className="w-7 h-7 bg-white/30 rounded-lg flex items-center justify-center">
                <User size={16} />
              </div>
              <span className="text-sm font-semibold hidden sm:block">Johnson, E</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable action menu with improved animations */}
      {showActions && (
        <div className="px-4 pb-4 border-t border-white/20 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-3 mt-4">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => setShowActions(false)}
                  className={`bg-gradient-to-r ${action.color} text-white py-3 px-4 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 active:scale-95`}
                >
                  <Icon size={18} />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Notifications dropdown */}
      {showNotifications && (
        <div className="absolute top-full right-4 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <div className="p-4 space-y-3">
              <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">New task assigned</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Final PnL Sign-Off requires your attention</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Task overdue</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Trade Surveillance Alert is 2 days overdue</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderImproved;