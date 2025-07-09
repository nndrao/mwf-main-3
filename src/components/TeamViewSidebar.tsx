import React from 'react';
import { User, Users, Eye, MessageSquare, Building, Network, Clock } from 'lucide-react';
import { Task } from '../types';

interface TeamViewSidebarProps {
  tasks: Task[];
  activeView: string;
  onViewChange: (view: string) => void;
}

const TeamViewSidebar: React.FC<TeamViewSidebarProps> = ({ tasks, activeView, onViewChange }) => {
  const teamViews = [
    {
      id: 'user',
      label: 'My Tasks (User Only)',
      icon: User,
      color: 'text-blue-600',
      count: tasks.filter(t => t.teamView === 'user').length
    },
    {
      id: 'pending',
      label: 'My Tasks (Pending Others)',
      icon: Clock,
      color: 'text-yellow-600',
      count: tasks.filter(t => t.teamView === 'pending').length
    },
    {
      id: 'watcher',
      label: 'My Watcher View',
      icon: Eye,
      color: 'text-green-600',
      count: tasks.filter(t => t.teamView === 'watcher').length
    },
    {
      id: 'rfi',
      label: 'My RFI Tasks',
      icon: MessageSquare,
      color: 'text-orange-600',
      count: tasks.filter(t => t.teamView === 'rfi').length
    },
    {
      id: 'teams',
      label: 'My Teams Tasks',
      icon: Users,
      color: 'text-purple-600',
      count: tasks.filter(t => t.teamView === 'teams').length
    },
    {
      id: 'extended',
      label: 'My Extended Teams Tasks',
      icon: Network,
      color: 'text-indigo-600',
      count: tasks.filter(t => t.teamView === 'extended').length
    }
  ];

  return (
    <div className="bg-gray-900 text-white w-64 h-full overflow-y-auto">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Team Views</h3>
        
        <div className="space-y-2">
          {teamViews.map(view => {
            const Icon = view.icon;
            const isActive = activeView === view.id;
            
            return (
              <button
                key={view.id}
                onClick={() => onViewChange(view.id)}
                className={`
                  w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={18} className={isActive ? 'text-white' : view.color} />
                  <span className="text-sm font-medium">{view.label}</span>
                </div>
                
                <span className={`
                  px-2 py-1 rounded-full text-xs font-semibold
                  ${isActive 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-700 text-gray-300'
                  }
                `}>
                  {view.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeamViewSidebar;