import React, { useState } from 'react';
import { User, MoreHorizontal, MessageSquare, Activity, UserPlus, Info, Menu, Bell, PenTool } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const HeaderImproved: React.FC = () => {
  const [showActions, setShowActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const actions = [
    { icon: PenTool, label: 'Initiate Sign Off', iconColor: 'text-gray-600 dark:text-gray-400' },
    { icon: Info, label: 'Request Info', iconColor: 'text-blue-600 dark:text-blue-400' },
    { icon: MessageSquare, label: 'Add Notes', iconColor: 'text-green-600 dark:text-green-400' },
    { icon: Activity, label: 'View Activity', iconColor: 'text-purple-600 dark:text-purple-400' },
    { icon: UserPlus, label: 'Delegate', iconColor: 'text-orange-600 dark:text-orange-400' },
  ];

  return (
    <div className="bg-[#D71E2B] text-white safe-area-top shadow-lg">
      {/* Main header */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Control Monitor</h1>
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

      {/* iOS-style Action Sheet Overlay */}
      {showActions && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
            onClick={() => setShowActions(false)}
          />
          
          {/* Action Sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl safe-area-bottom">
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
              </div>
              
              {/* Action Title */}
              <div className="px-6 pb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center">Task Actions</h3>
              </div>
              
              {/* Actions */}
              <div className="px-4 pb-2">
                <div className="space-y-2">
                  {actions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => setShowActions(false)}
                        className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-colors active:scale-[0.98]"
                      >
                        <div className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center`}>
                          <Icon size={20} className={action.iconColor} />
                        </div>
                        <span className="text-base font-medium text-gray-900 dark:text-white flex-1 text-left">{action.label}</span>
                      </button>
                    );
                  })}
                </div>
                
                {/* Cancel Button */}
                <button
                  onClick={() => setShowActions(false)}
                  className="w-full mt-3 py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-2xl active:scale-[0.98] transition-transform"
                >
                  Cancel
                </button>
              </div>
              
              {/* Bottom Safe Area Padding */}
              <div className="h-2" />
            </div>
          </div>
        </>
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