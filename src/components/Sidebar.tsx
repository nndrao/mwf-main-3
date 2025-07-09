import React from 'react';
import { BarChart3, CheckSquare, Users, User, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: 'dashboard' | 'tasks';
  onViewChange: (view: 'dashboard' | 'tasks') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, view: 'dashboard' as const },
    { id: 'tasks', label: 'Task Manager', icon: CheckSquare, view: 'tasks' as const },
    { id: 'hierarchy', label: 'Hierarchy', icon: Users, view: 'tasks' as const },
    { id: 'profile', label: 'My Profile', icon: User, view: 'tasks' as const },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700 lg:hidden">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="mt-8">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.view && item.id === currentView;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.view);
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={`
                  w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors
                  ${isActive 
                    ? 'bg-red-600 text-white border-r-4 border-red-400' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;